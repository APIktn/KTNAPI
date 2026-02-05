import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import authRouter from "./auth.routes.mjs";

// mock db
vi.mock("../db.mjs", () => ({
  default: {
    query: vi.fn(),
  },
}));

// mock utils
vi.mock("../utils/generateUserCode.mjs", () => ({
  default: vi.fn(),
}));

vi.mock("../utils/avatarGenerator.mjs", () => ({
  default: vi.fn(),
}));

// mock bcrypt
vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

// mock jwt
vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
  },
}));

import con from "../db.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generateUserCode from "../utils/generateUserCode.mjs";
import generateAvatarUrl from "../utils/avatarGenerator.mjs";

describe("authRouter", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/auth", authRouter);

    vi.clearAllMocks();
  });

  ////////////////////////////// register

  it("POST /register success", async () => {
    generateUserCode.mockResolvedValue("USR202610310001");
    generateAvatarUrl.mockReturnValue("avatar-url");
    bcrypt.hash.mockResolvedValue("hashed-password");

    con.query
      .mockResolvedValueOnce([[]]) // validateRegister (email not exist)
      .mockResolvedValueOnce([{}]); // insert

    const res = await request(app)
      .post("/auth/register")
      .send({
        status: "register",
        firstName: "john",
        lastName: "doe",
        userEmail: "john@test.com",
        password: "1234",
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("registration successful");
  });

  it("POST /register duplicate email", async () => {
    con.query.mockResolvedValueOnce([[{ Id: 1 }]]);

    const res = await request(app)
      .post("/auth/register")
      .send({
        status: "register",
        userEmail: "dup@test.com",
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("already registered");
  });

  ////////////////////////////// login

  it("POST /login success", async () => {
    con.query.mockResolvedValueOnce([
      [{
        Id: 1,
        UserCode: "USR001",
        UserEmail: "john@test.com",
        UserName: "john",
        Password: "hashed",
        FirstName: "John",
        LastName: "Doe",
        Profile_Image: "img",
        Upload_Image: null,
      }],
    ]);

    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("jwt-token");

    const res = await request(app)
      .post("/auth/login")
      .send({
        status: "LoginUser",
        username: "john@test.com",
        password: "1234",
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBe("jwt-token");
    expect(res.body.user.userCode).toBe("USR001");
  });

  it("POST /login invalid password", async () => {
    con.query.mockResolvedValueOnce([
      [{ Password: "hashed" }],
    ]);

    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app)
      .post("/auth/login")
      .send({
        status: "LoginUser",
        username: "john",
        password: "wrong",
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("invalid password");
  });

  it("POST /login user not found", async () => {
    con.query.mockResolvedValueOnce([[]]);

    const res = await request(app)
      .post("/auth/login")
      .send({
        status: "LoginUser",
        username: "none",
        password: "1234",
      });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("user not found");
  });
});
