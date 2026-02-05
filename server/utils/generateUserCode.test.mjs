import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import generateUserCode from "./generateUserCode";

describe("generateUserCode", () => {
  const mockDate = new Date("2026-10-31T10:00:00Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("should generate first user code when no existing record", async () => {
    const con = {
      query: vi.fn().mockResolvedValue([[]]),
    };

    const code = await generateUserCode(con);

    expect(code).toBe("USR202610310001");
    expect(con.query).toHaveBeenCalledOnce();
  });

  it("should increment user code when existing record found", async () => {
    const con = {
      query: vi.fn().mockResolvedValue([
        [{ UserCode: "USR202610310009" }],
      ]),
    };

    const code = await generateUserCode(con);

    expect(code).toBe("USR202610310010");
  });
});
