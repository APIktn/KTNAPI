import express from "express";
import con from "../db.mjs";
import multer from "multer";
import cloudinary from "../utils/cloudinary.mjs";
import generateProductCode from "../utils/generateProductCode.mjs";
import { validateProduct } from "../middleware/prodValidator.mjs";

const productRoute = express.Router();

//////////////////////////////////////////////////
// upload config (memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5mb
});

//////////////////////////////////////////////////
// save product (create / update)
productRoute.post(
  "/saveprod",
  upload.single("image"),
  validateProduct,
  async (req, res) => {
    const {
      status,
      productCode,
      productName,
      description,
      imageType,
    } = req.body;

    const items = req.parsedItems;
    const userCode = req.user?.userCode;

    if (!userCode) {
      return res.status(401).json({
        success: false,
        error: "unauthorized",
      });
    }

    const imgType = imageType || "MAIN";

    // ===== validate image =====
    if (req.file && !["image/jpeg", "image/png"].includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        error: "invalid image type",
      });
    }

    // ===== upload image =====
    let imageUrl = null;
    let imagePublicId = null;

    if (req.file) {
      try {
        const uploadResult = await cloudinary.uploader.upload(
          `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
          {
            folder: "bone_chop/product",
            context: {
              imageType: imgType,
            },
          }
        );

        imageUrl = uploadResult.secure_url;
        imagePublicId = uploadResult.public_id;
      } catch {
        return res.status(500).json({
          success: false,
          error: "image upload failed",
        });
      }
    }

    const conn = await con.getConnection();

    try {
      await conn.beginTransaction();

      let headerId = null;
      let prdCode = productCode;

      // ==================================================
      // CREATE PRODUCT
      // ==================================================
      if (status === "createprod") {
        prdCode = await generateProductCode(conn);

        const [header] = await conn.query(
          `
          insert into tbl_trs_product_header
          (ProductCode, ProductName, ProductDes,
           CreateBy, CreateDateTime, UpdateBy, UpdateDateTime)
          values (?, ?, ?, ?, ?, ?, ?)
          `,
          [
            prdCode,
            productName,
            description,
            userCode,
            new Date(),
            userCode,
            new Date(),
          ]
        );

        headerId = header.insertId;

        if (!headerId) {
          throw new Error("invalid product header");
        }

        // insert MAIN image
        if (imageUrl) {
          await conn.query(
            `
            insert into tbl_trs_product_image
            (IdRef, ImageType, ProductImage, ProductImageId,
             CreateBy, CreateDateTime, UpdateBy, UpdateDateTime)
            values (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
              headerId,
              imgType,
              imageUrl,
              imagePublicId,
              userCode,
              new Date(),
              userCode,
              new Date(),
            ]
          );
        }
      }

      // ==================================================
      // UPDATE PRODUCT
      // ==================================================
      if (status === "updateprod") {
        const [headers] = await conn.query(
          `select Id from tbl_trs_product_header where ProductCode = ?`,
          [productCode]
        );

        if (headers.length === 0) {
          throw new Error("product not found");
        }

        headerId = headers[0].Id;

        // update header
        await conn.query(
          `
          update tbl_trs_product_header
          set ProductName=?, ProductDes=?, UpdateBy=?, UpdateDateTime=?
          where ProductCode=?
          `,
          [productName, description, userCode, new Date(), productCode]
        );

        // ===== update MAIN image =====
        if (imageUrl) {
          const [[old]] = await conn.query(
            `
            select Id, ProductImageId
            from tbl_trs_product_image
            where IdRef=? and ImageType='MAIN'
            limit 1
            `,
            [headerId]
          );

          // delete old cloudinary image
          if (old?.ProductImageId) {
            await cloudinary.uploader.destroy(old.ProductImageId);
          }

          if (old?.Id) {
            // update MAIN record
            await conn.query(
              `
              update tbl_trs_product_image
              set ProductImage=?, ProductImageId=?,
                  UpdateBy=?, UpdateDateTime=?
              where Id=?
              `,
              [
                imageUrl,
                imagePublicId,
                userCode,
                new Date(),
                old.Id,
              ]
            );
          } else {
            // fallback (ไม่มี MAIN)
            await conn.query(
              `
              insert into tbl_trs_product_image
              (IdRef, ImageType, ProductImage, ProductImageId,
               CreateBy, CreateDateTime, UpdateBy, UpdateDateTime)
              values (?, ?, ?, ?, ?, ?, ?, ?)
              `,
              [
                headerId,
                "MAIN",
                imageUrl,
                imagePublicId,
                userCode,
                new Date(),
                userCode,
                new Date(),
              ]
            );
          }
        }
      }

      // ==================================================
      // PRODUCT LINES
      // ==================================================
      const newLines = items.filter((i) =>
        String(i.lineKey).startsWith("new")
      );
      const existLines = items.filter(
        (i) => !String(i.lineKey).startsWith("new")
      );

      for (const item of newLines) {
        await conn.query(
          `
          insert into tbl_trs_product_line
          (IdRef, LineNo, Size, Price, Amount, Note,
           CreateBy, CreateDateTime, UpdateBy, UpdateDateTime)
          values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            headerId,
            item.lineNo,
            item.size,
            item.price,
            item.amount,
            item.note || "",
            userCode,
            new Date(),
            userCode,
            new Date(),
          ]
        );
      }

      for (const item of existLines) {
        await conn.query(
          `
          update tbl_trs_product_line
          set LineNo=?, Size=?, Price=?, Amount=?, Note=?,
              UpdateBy=?, UpdateDateTime=?
          where Id=? and IdRef=?
          `,
          [
            item.lineNo,
            item.size,
            item.price,
            item.amount,
            item.note || "",
            userCode,
            new Date(),
            item.lineKey,
            headerId,
          ]
        );
      }

      await conn.commit();

      res.json({
        success: true,
        message: "product saved successfully",
        productCode: prdCode,
      });
    } catch (err) {
      await conn.rollback();
      console.error("save product error:", err);

      res.status(500).json({
        success: false,
        error: "server error",
      });
    } finally {
      conn.release();
    }
  }
);

//////////////////////////////////////////////////
// line update / delete
productRoute.post("/line", validateProduct, async (req, res) => {
  const { status, lineId, lines } = req.body;
  const userCode = req.user?.userCode;

  if (!userCode) {
    return res.status(401).json({
      success: false,
      error: "unauthorized",
    });
  }

  try {
    // ===== update line =====
    if (status === "updateprodline") {
      const list = lines || [];

      for (const l of list) {
        await con.query(
          `
          update tbl_trs_product_line
          set LineNo=?, Size=?, Price=?, Amount=?, Note=?,
              UpdateBy=?, UpdateDateTime=?
          where Id=?
          `,
          [
            l.lineNo,
            l.size,
            l.price,
            l.amount,
            l.note || "",
            userCode,
            new Date(),
            l.lineKey,
          ],
        );
      }

      return res.json({
        success: true,
        message: "line updated successfully",
      });
    }

    // ===== delete line =====
    if (status === "deleteprodline") {
      const conn = await con.getConnection();

      try {
        await conn.beginTransaction();

        const [[line]] = await conn.query(
          `select IdRef from tbl_trs_product_line where Id = ?`,
          [lineId],
        );

        if (!line) {
          await conn.rollback();
          return res.status(404).json({
            success: false,
            error: "line not found",
          });
        }

        const headerId = line.IdRef;

        await conn.query(`delete from tbl_trs_product_line where Id = ?`, [
          lineId,
        ]);

        const [rows] = await conn.query(
          `
          select Id
          from tbl_trs_product_line
          where IdRef = ?
          order by LineNo
          `,
          [headerId],
        );

        let no = 1;
        for (const r of rows) {
          await conn.query(
            `
            update tbl_trs_product_line
            set LineNo=?, UpdateBy=?, UpdateDateTime=?
            where Id=?
            `,
            [no++, userCode, new Date(), r.Id],
          );
        }

        await conn.commit();

        return res.json({
          success: true,
          message: "line deleted and reordered",
        });
      } catch (err) {
        await conn.rollback();
        throw err;
      } finally {
        conn.release();
      }
    }

    return res.status(400).json({
      success: false,
      error: "invalid status",
    });
  } catch (err) {
    console.error("line error:", err);
    res.status(500).json({
      success: false,
      error: "server error",
    });
  }
});

//////////////////////////////////////////////////
// delete product
productRoute.post("/delete", validateProduct, async (req, res) => {
  const { productCode } = req.body;
  const userCode = req.user?.userCode;

  if (!userCode) {
    return res.status(401).json({
      success: false,
      error: "unauthorized",
    });
  }

  const conn = await con.getConnection();

  try {
    await conn.beginTransaction();

    // ===== header =====
    const [[header]] = await conn.query(
      `select Id from tbl_trs_product_header where ProductCode = ?`,
      [productCode]
    );

    if (!header) {
      throw new Error("product not found");
    }

    const headerId = header.Id;

    // ===== get images =====
    const [images] = await conn.query(
      `
      select ProductImageId
      from tbl_trs_product_image
      where IdRef = ?
      `,
      [headerId]
    );

    // ===== delete cloudinary =====
    for (const img of images) {
      if (img.ProductImageId) {
        await cloudinary.uploader.destroy(img.ProductImageId);
      }
    }

    // ===== delete header (cascade line + image) =====
    await conn.query(
      `delete from tbl_trs_product_header where Id = ?`,
      [headerId]
    );

    await conn.commit();

    res.json({
      success: true,
      message: "product deleted successfully",
    });
  } catch (err) {
    await conn.rollback();
    console.error("delete product error:", err);

    res.status(500).json({
      success: false,
      error: "server error",
    });
  } finally {
    conn.release();
  }
});

//////////////////////////////////////////////////
// get product
productRoute.post("/getprod", async (req, res) => {
  const { status, prdcode } = req.body;

  if (status !== "getprod") {
    return res.status(403).json({
      success: false,
      error: "access denied",
    });
  }

  try {
    // ===== header =====
    const [headers] = await con.query(
      `
      select Id, ProductCode, ProductName, ProductDes
      from tbl_trs_product_header
      where ProductCode = ?
      limit 1
      `,
      [prdcode],
    );

    if (headers.length === 0) {
      return res.status(404).json({
        success: false,
        error: "product not found",
      });
    }

    const header = headers[0];

    // ===== main image =====
    const [[mainImage]] = await con.query(
      `
      select ProductImage
      from tbl_trs_product_image
      where IdRef = ? and ImageType = 'MAIN'
      order by CreateDateTime desc
      limit 1
      `,
      [header.Id],
    );

    // ===== lines =====
    const [lines] = await con.query(
      `
      select Id, LineNo, Size, Price, Amount, Note
      from tbl_trs_product_line
      where IdRef = ?
      order by LineNo
      `,
      [header.Id],
    );

    res.json({
      success: true,
      productCode: header.ProductCode,
      productName: header.ProductName,
      description: header.ProductDes,
      mainImage: mainImage?.ProductImage || null,
      items: lines.map((l) => ({
        lineKey: String(l.Id),
        lineNo: l.LineNo,
        size: l.Size,
        price: l.Price,
        amount: l.Amount,
        note: l.Note,
      })),
    });
  } catch (err) {
    console.error("get product error:", err);
    res.status(500).json({
      success: false,
      error: "server error",
    });
  }
});

export default productRoute;
