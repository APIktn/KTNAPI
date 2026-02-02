import { describe, it, expect, vi } from "vitest";
import request from "supertest";

/**
 * mock authenticateToken
 * ให้ทุก protected route ผ่าน auth
 */
vi.mock("./middleware/authVerify.mjs", () => {
  return {
    default: (req, res, next) => {
      req.user = { id: 1, role: "admin" };
      next();
    },
  };
});

import app from "./app.mjs";

describe("Express app routes", () => {

  it("GET / should return server status", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.text).toContain("Server is running");
  });

  it("GET /test should pass with mocked auth", async () => {
    const res = await request(app).get("/test");

    expect(res.status).not.toBe(401);
  });

  it("POST /auth/login should be accessible without token", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({});

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("GET /inventory should be protected but pass with mocked auth", async () => {
    const res = await request(app).get("/inventory");

    expect(res.status).not.toBe(401);
  });

  it("GET /user should be protected but pass with mocked auth", async () => {
    const res = await request(app).get("/user");

    expect(res.status).not.toBe(401);
  });

});
