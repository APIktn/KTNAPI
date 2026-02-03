import { describe, it, expect, beforeEach, vi } from "vitest";

/* =====================
   mock axios (สำคัญมาก)
   ===================== */
vi.mock("axios", () => ({
  default: {
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

/* mock jwt-decode */
vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

import axios from "axios";
import jwtInterceptor from "./JwtInterceptor";
import { jwtDecode } from "jwt-decode";

describe("jwtInterceptor", () => {
  let requestInterceptor;
  let responseInterceptor;

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    axios.interceptors.request.use.mockImplementation((fn) => {
      requestInterceptor = fn;
    });

    axios.interceptors.response.use.mockImplementation((success, error) => {
      responseInterceptor = error;
    });

    jwtInterceptor();
  });

  it("adds Authorization header when token is valid", () => {
    const token = "valid.token";
    localStorage.setItem("token", token);

    jwtDecode.mockReturnValue({
      exp: Date.now() / 1000 + 1000,
    });

    const req = { headers: {} };
    const result = requestInterceptor(req);

    expect(result.headers.Authorization).toBe(`Bearer ${token}`);
  });

  it("removes token and dispatches event when token is expired", () => {
    localStorage.setItem("token", "expired.token");

    const spy = vi.spyOn(window, "dispatchEvent");

    jwtDecode.mockReturnValue({
      exp: Date.now() / 1000 - 10,
    });

    requestInterceptor({ headers: {} });

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ type: "auth-expired" })
    );
  });

  it("removes token and dispatches event when jwtDecode throws error", () => {
    localStorage.setItem("token", "bad.token");

    const spy = vi.spyOn(window, "dispatchEvent");

    jwtDecode.mockImplementation(() => {
      throw new Error("invalid token");
    });

    requestInterceptor({ headers: {} });

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ type: "auth-expired" })
    );
  });

  it("dispatches auth-expired on 401 response", async () => {
    const spy = vi.spyOn(window, "dispatchEvent");

    const error = {
      response: { status: 401 },
    };

    await responseInterceptor(error).catch(() => {});

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ type: "auth-expired" })
    );
  });
});
