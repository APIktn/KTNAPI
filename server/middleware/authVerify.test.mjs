import { describe, it, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";
import authenticateToken from "./authVerify.mjs";

/* helper: mock req */
function mockReq(token) {
  return {
    headers: {
      authorization: token ? `Bearer ${token}` : undefined,
    },
  };
}

/* helper: mock res */
function mockRes() {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

let next;

beforeEach(() => {
  next = vi.fn();
  vi.restoreAllMocks();
});

describe("authenticateToken middleware", () => {

  it("returns 401 when no token is provided", () => {
    const req = mockReq();
    const res = mockRes();

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "access denied. please login again.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 when token is invalid or expired", () => {
    vi.spyOn(jwt, "verify").mockImplementation((token, secret, cb) => {
      cb(new Error("invalid token"), null);
    });

    const req = mockReq("bad-token");
    const res = mockRes();

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "invalid or expired token. please login again.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next and sets req.user when token is valid", () => {
    const fakeUser = { id: 1, role: "user" };

    vi.spyOn(jwt, "verify").mockImplementation((token, secret, cb) => {
      cb(null, fakeUser);
    });

    const req = mockReq("good-token");
    const res = mockRes();

    authenticateToken(req, res, next);

    expect(req.user).toEqual(fakeUser);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

});
