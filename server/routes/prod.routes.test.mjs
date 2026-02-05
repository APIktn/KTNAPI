import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import productRoute from "./prod.routes.mjs";

/* ================= mocks ================= */

vi.mock("../db.mjs", () => ({
  default: {
    query: vi.fn(),
    getConnection: vi.fn(),
  },
}));

vi.mock("../utils/cloudinary.mjs", () => ({
  default: {
    uploader: {
      upload: vi.fn(),
      destroy: vi.fn(),
    },
  },
}));

vi.mock("../utils/generateProductCode.mjs", () => ({
  default: vi.fn(),
}));

import con from "../db.mjs";
import cloudinary from "../utils/cloudinary.mjs";
import generateProductCode from "../utils/generateProductCode.mjs";

describe("productRoute", () => {
  let app;
  let conn;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // inject req.user
    app.use((req, res, next) => {
      req.user = { userCode: "USR001" };
      next();
    });

    app.use("/product", productRoute);

    conn = {
      query: vi.fn(),
      beginTransaction: vi.fn(),
      commit: vi.fn(),
      rollback: vi.fn(),
      release: vi.fn(),
    };

    con.getConnection.mockResolvedValue(conn);
    vi.clearAllMocks();
  });

  /* ================= validateProduct ================= */

  it("reject when status missing", async () => {
    const res = await request(app)
      .post("/product/saveprod")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("status is required");
  });

  it("reject invalid product line format", async () => {
    const res = await request(app)
      .post("/product/saveprod")
      .send({
        status: "createprod",
        productName: "A",
        description: "B",
        items: "xxx",
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("invalid product line format");
  });

  /* ================= create product ================= */

  it("create product success (no image)", async () => {
    generateProductCode.mockResolvedValue("PRD001");

    conn.query
      .mockResolvedValueOnce([{ insertId: 1 }]) // insert header
      .mockResolvedValueOnce([{}]);             // insert line

    const res = await request(app)
      .post("/product/saveprod")
      .send({
        status: "createprod",
        productName: "Test",
        description: "Desc",
        items: JSON.stringify([
          {
            lineKey: "new1",
            lineNo: 1,
            size: "M",
            price: 100,
            amount: 5,
          },
        ]),
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.productCode).toBe("PRD001");
    expect(conn.beginTransaction).toHaveBeenCalled();
    expect(conn.commit).toHaveBeenCalled();
  });

  /* ================= update line ================= */

  it("update product line success", async () => {
    con.query.mockResolvedValue({});

    const res = await request(app)
      .post("/product/line")
      .send({
        status: "updateprodline",
        lines: [
          {
            lineKey: 1,
            lineNo: 1,
            size: "L",
            price: 200,
            amount: 3,
          },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("line updated successfully");
  });

  /* ================= delete line ================= */

  it("delete product line success", async () => {
    conn.query
      .mockResolvedValueOnce([[{ IdRef: 1 }]]) // get line
      .mockResolvedValueOnce([{}])             // delete
      .mockResolvedValueOnce([[{ Id: 2 }]]);   // reorder

    const res = await request(app)
      .post("/product/line")
      .send({
        status: "deleteprodline",
        lineId: 1,
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("line deleted and reordered");
  });

  /* ================= delete product ================= */

  it("delete product success", async () => {
    conn.query
      .mockResolvedValueOnce([[{ Id: 1 }]]) // header
      .mockResolvedValueOnce([[{ ProductImageId: "img1" }]])
      .mockResolvedValueOnce([{}]);

    const res = await request(app)
      .post("/product/delete")
      .send({
        status: "delprod",
        productCode: "PRD001",
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("product deleted successfully");
    expect(cloudinary.uploader.destroy).toHaveBeenCalled();
  });

  /* ================= get product ================= */

  it("get product success", async () => {
    con.query
      .mockResolvedValueOnce([
        [{ Id: 1, ProductCode: "PRD001", ProductName: "A", ProductDes: "B" }],
      ])
      .mockResolvedValueOnce([[{ ProductImage: "img.png" }]])
      .mockResolvedValueOnce([
        [{ Id: 1, LineNo: 1, Size: "M", Price: 100, Amount: 2, Note: "" }],
      ]);

    const res = await request(app)
      .post("/product/getprod")
      .send({
        status: "getprod",
        prdcode: "PRD001",
      });

    expect(res.status).toBe(200);
    expect(res.body.productCode).toBe("PRD001");
    expect(res.body.items.length).toBe(1);
  });
});
