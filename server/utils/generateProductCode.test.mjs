import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import generateProductCode from "./generateProductCode";

describe("generateProductCode", () => {
  const mockDate = new Date("2026-10-31T10:00:00Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("should generate first product code when no existing record", async () => {
    const con = {
      query: vi.fn().mockResolvedValue([[]]),
    };

    const code = await generateProductCode(con);

    expect(code).toBe("PRD20261031000001");
    expect(con.query).toHaveBeenCalledOnce();
  });

  it("should increment product code when existing record found", async () => {
    const con = {
      query: vi.fn().mockResolvedValue([
        [{ ProductCode: "PRD20261031000009" }],
      ]),
    };

    const code = await generateProductCode(con);

    expect(code).toBe("PRD20261031000010");
  });
});
