import express from "express";
import con from "../db.mjs";
import { validateInventory } from "../middleware/inventoryValidator.mjs";

const inventoryRoute = express.Router();

inventoryRoute.post(
  "/getinventory",
  validateInventory,
  async (req, res) => {
    const {
      search = "",
      priceMin = 0,
      priceMax = 100000,
      page = 1,
      limit = 12,
    } = req.body;

    const offset = (page - 1) * limit;

    try {
      /* ===== get products (paginate) ===== */
      const [products] = await con.query(
        `
        SELECT DISTINCT
          h.Id,
          h.ProductCode,
          h.ProductName,
          h.ProductImage
        FROM tbl_trs_product_header h
        JOIN tbl_trs_product_line l
          ON h.Id = l.IdRef
        WHERE
          (h.ProductName LIKE ? OR h.ProductCode LIKE ?)
          AND l.Price BETWEEN ? AND ?
        ORDER BY h.CreateDateTime DESC
        LIMIT ? OFFSET ?
        `,
        [
          `%${search}%`,
          `%${search}%`,
          priceMin,
          priceMax,
          Number(limit),
          Number(offset),
        ]
      );

      if (products.length === 0) {
        return res.json({
          success: true,
          items: [],
          total: 0,
          page,
          totalPages: 0,
        });
      }

      /* ===== count total ===== */
      const [[{ total }]] = await con.query(
        `
        SELECT COUNT(DISTINCT h.Id) AS total
        FROM tbl_trs_product_header h
        JOIN tbl_trs_product_line l
          ON h.Id = l.IdRef
        WHERE
          (h.ProductName LIKE ? OR h.ProductCode LIKE ?)
          AND l.Price BETWEEN ? AND ?
        `,
        [`%${search}%`, `%${search}%`, priceMin, priceMax]
      );

      /* ===== get lines ===== */
      const ids = products.map((p) => p.Id);

      const [lines] = await con.query(
        `
        SELECT
          IdRef,
          Price,
          Amount
        FROM tbl_trs_product_line
        WHERE IdRef IN (?)
        `,
        [ids]
      );

      /* ===== group lines ===== */
      const lineMap = {};
      for (const l of lines) {
        if (!lineMap[l.IdRef]) lineMap[l.IdRef] = [];
        lineMap[l.IdRef].push({
          price: l.Price,
          amount: l.Amount,
        });
      }

      /* ===== merge ===== */
      const items = products.map((p) => ({
        productCode: p.ProductCode,
        productName: p.ProductName,
        image: p.ProductImage,
        lines: lineMap[p.Id] || [],
      }));

      res.json({
        success: true,
        items,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (err) {
      console.error("get inventory error:", err);
      res.status(500).json({
        success: false,
        error: "server error",
      });
    }
  }
);

export default inventoryRoute;
