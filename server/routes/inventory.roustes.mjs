import express from "express"
import con from "../db.mjs"
import { validateInventory } from "../middleware/inventoryValidator.mjs";

const inventoryRoute = express.Router()

inventoryRoute.post("/getinventory", validateInventory, async (req, res) => {
    const {
        search = "",
        priceMin = 0,
        priceMax = 100000,
    } = req.body;

    try {
        /* ===== header + price filter ===== */
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
        `,
            [
                `%${search}%`,
                `%${search}%`,
                priceMin,
                priceMax,
            ]
        );

        if (products.length === 0) {
            return res.json({
                success: true,
                items: [],
            });
        }

        /* ===== lines ===== */
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