import { describe, it, expect, vi } from "vitest";
import generateAvatarUrl, { getRandomBackgroundColor } from "./avatarGenerator";

describe("getRandomBackgroundColor", () => {

  it("should return a color from predefined list", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    const color = getRandomBackgroundColor();

    expect(color).toBe("007bff");

    Math.random.mockRestore();
  });

});

describe("generateAvatarUrl", () => {

  it("should generate avatar url with initials and background color", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    const url = generateAvatarUrl("john", "doe");

    expect(url).toContain("JD");
    expect(url).toContain("background=007bff");
    expect(url).toContain("color=ffffff");

    Math.random.mockRestore();
  });

});
