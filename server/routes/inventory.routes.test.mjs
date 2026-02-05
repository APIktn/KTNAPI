import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import inventoryRoute from "./inventory.routes.mjs";

vi.mock("../db.mjs", () => ({
  default: {
    query: vi.fn(),
  },
}));

import con from "../db.mjs";

describe("inventoryRoute", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/inventory", inventoryRoute);
    vi.clearAllMocks();
  });

  it("POST /getinventory success", async () => {
    con.query
      .mockResolvedValueOnce([
        [
          {
            Id: 1,
            ProductCode: "PRD001",
            ProductName: "Test Product",
            ProductImage: "img.png",
          },
        ],
      ])
      .mockResolvedValueOnce([[{ total: 1 }]])
      .mockResolvedValueOnce([
        [
          { IdRef: 1, Price: 100, Amount: 5 },
          { IdRef: 1, Price: 200, Amount: 2 },
        ],
      ]);

    const res = await request(app)
      .post("/inventory/getinventory")
      .send({
        status: "getinventory",
        search: "",
        priceMin: 0,
        priceMax: 1000,
        page: 1,
        limit: 12,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.items.length).toBe(1);
    expect(res.body.items[0].lines.length).toBe(2);
    expect(res.body.total).toBe(1);
  });

  it("POST /getinventory empty result", async () => {
    con.query.mockResolvedValueOnce([[]]);

    const res = await request(app)
      .post("/inventory/getinventory")
      .send({
        status: "getinventory",
      });

    expect(res.status).toBe(200);
    expect(res.body.items).toEqual([]);
    expect(res.body.total).toBe(0);
  });

  it("POST /getinventory missing status", async () => {
    const res = await request(app)
      .post("/inventory/getinventory")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("status is required");
  });

  it("POST /getinventory invalid status", async () => {
    const res = await request(app)
      .post("/inventory/getinventory")
      .send({
        status: "hack",
      });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe("invalid inventory action");
  });
});
