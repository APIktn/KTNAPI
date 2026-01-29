import express from "express";
import con from "../db.mjs";
import multer from "multer";
import path from "path";
import fs from "fs";

import generateProductCode from "../utils/generateProductCode.mjs";
import generatePrdImageName from "../utils/generatePrdImageName.mjs";
import { validateProduct } from "../middleware/prodValidator.mjs";

const productRoute = express.Router();

//////////////////////////////////////////////////
// upload config
const uploadDir = path.join("asset", "Image");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) =>
    cb(null, generatePrdImageName(file.originalname, "prd")),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

//////////////////////////////////////////////////
// save product (create / update)
productRoute.post(
  "/saveprod",
  upload.single("image"),
  validateProduct,
  async (req, res) => {
    const { status, productCode, productName, description } = req.body;
    const items = req.parsedItems;
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

      let headerId = null;
      let prdCode = productCode;

      // ===== create =====
      if (status === "createprod") {
        prdCode = await generateProductCode(conn);

        const imagePath = req.file
          ? `/asset/Image/${req.file.filename}`
          : null;

        const [header] = await conn.query(
          `
          insert into tbl_trs_product_header
          (ProductCode, ProductName, ProductDes, ProductImage,
           CreateBy, CreateDateTime, UpdateBy, UpdateDateTime)
          values (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            prdCode,
            productName,
            description,
            imagePath,
            userCode,
            new Date(),
            userCode,
            new Date(),
          ]
        );

        headerId = header.insertId;
      }

      // ===== update =====
      if (status === "updateprod") {
        const [headers] = await conn.query(
          `select Id from tbl_trs_product_header where ProductCode = ?`,
          [productCode]
        );

        if (headers.length === 0) {
          throw new Error("product not found");
        }

        headerId = headers[0].Id;

        await conn.query(
          `
          update tbl_trs_product_header
          set ProductName=?, ProductDes=?, UpdateBy=?, UpdateDateTime=?
          where ProductCode=?
          `,
          [productName, description, userCode, new Date(), productCode]
        );
      }

      // ===== insert new lines =====
      for (const item of items.filter((i) =>
        String(i.lineKey).startsWith("new")
      )) {
        await conn.query(
          `
          insert into tbl_trs_product_line
          (IdRef, LineNo, Status, Size, Price, Amount, Note,
           CreateBy, CreateDateTime, UpdateBy, UpdateDateTime)
          values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            headerId,
            item.lineNo,
            Number(item.amount) === 0 ? "sold" : "available",
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
// line action (update / delete)
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
          ]
        );
      }
    }

    // ===== delete line =====
    if (status === "deleteprodline") {
      await con.query(
        `delete from tbl_trs_product_line where Id = ?`,
        [lineId]
      );
    }

    res.json({
      success: true,
      message: "line updated successfully",
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

    const [headers] = await conn.query(
      `select Id from tbl_trs_product_header where ProductCode = ?`,
      [productCode]
    );

    if (headers.length === 0) {
      throw new Error("product not found");
    }

    const headerId = headers[0].Id;

    await conn.query(
      `delete from tbl_trs_product_line where IdRef = ?`,
      [headerId]
    );

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
    const [headers] = await con.query(
      `
      select Id, ProductCode, ProductName, ProductDes, ProductImage
      from tbl_trs_product_header
      where ProductCode = ?
      limit 1
      `,
      [prdcode]
    );

    if (headers.length === 0) {
      return res.status(404).json({
        success: false,
        error: "product not found",
      });
    }

    const header = headers[0];

    const [lines] = await con.query(
      `
      select Id, LineNo, Size, Price, Amount, Note
      from tbl_trs_product_line
      where IdRef = ?
      order by LineNo
      `,
      [header.Id]
    );

    res.json({
      success: true,
      productCode: header.ProductCode,
      productName: header.ProductName,
      description: header.ProductDes,
      image: header.ProductImage,
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
