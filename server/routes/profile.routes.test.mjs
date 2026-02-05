import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import profileRoute from "./profile.routes.mjs";

// ===== mock db =====
vi.mock("../db.mjs", () => ({
  default: {
    query: vi.fn(),
  },
}));

// ===== mock cloudinary =====
vi.mock("../utils/cloudinary.mjs", () => ({
  default: {
    uploader: {
      upload: vi.fn(),
      destroy: vi.fn(),
    },
  },
}));

import con from "../db.mjs";
import cloudinary from "../utils/cloudinary.mjs";

describe("profileRoute", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // mock auth middleware (inject req.user)
    app.use((req, res, next) => {
      req.user = { userCode: "USR001" };
      next();
    });

    app.use("/profile", profileRoute);
    vi.clearAllMocks();
  });

  /* ================= get profile ================= */

  it("POST /profile getprofile success", async () => {
    con.query.mockResolvedValueOnce([
      [{
        UserCode: "USR001",
        UserEmail: "test@mail.com",
        UserName: "john",
        FirstName: "John",
        LastName: "Doe",
        Address: "BKK",
        Tel: "099",
        Profile_Image: "img1",
        Upload_Image: "img2",
      }],
    ]);

    const res = await request(app)
      .post("/profile/profile")
      .send({
        status: "getprofile",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.userCode).toBe("USR001");
  });

  it("POST /profile getprofile user not found", async () => {
    con.query.mockResolvedValueOnce([[undefined]]);

    const res = await request(app)
      .post("/profile/profile")
      .send({
        status: "getprofile",
      });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("user not found");
  });

  /* ================= update profile ================= */

  it("POST /profile updateprofile success (no image)", async () => {
    // profileValidator dup check
    con.query
      .mockResolvedValueOnce([[undefined]])
      // update
      .mockResolvedValueOnce([{}])
      // get updated user
      .mockResolvedValueOnce([
        [{
          UserCode: "USR001",
          UserEmail: "test@mail.com",
          UserName: "john",
          FirstName: "John",
          LastName: "Doe",
          Profile_Image: "img1",
          Upload_Image: "img2",
        }],
      ]);

    const res = await request(app)
      .post("/profile/profile")
      .send({
        status: "updateprofile",
        userName: "john",
        firstName: "John",
        lastName: "Doe",
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("profile updated");
  });

  it("POST /profile updateprofile duplicate username", async () => {
    con.query.mockResolvedValueOnce([[{ UserCode: "USR999" }]]);

    const res = await request(app)
      .post("/profile/profile")
      .send({
        status: "updateprofile",
        userName: "dupname",
      });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe("username already in use");
  });

  /* ================= validator ================= */

  it("POST /profile invalid status", async () => {
    const res = await request(app)
      .post("/profile/profile")
      .send({
        status: "hack",
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("invalid profile action");
  });

  it("POST /profile missing userCode (unauthorized)", async () => {
    const app2 = express();
    app2.use(express.json());
    app2.use("/profile", profileRoute);

    const res = await request(app2)
      .post("/profile/profile")
      .send({
        status: "getprofile",
      });

    expect(res.status).toBe(401);
  });
});
