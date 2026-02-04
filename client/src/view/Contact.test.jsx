import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Contact from "./Contact";

/* ---------- mock mui grow ---------- */
vi.mock("@mui/material", async () => {
  const actual = await vi.importActual("@mui/material");

  return {
    ...actual,
    Grow: ({ children }) => <div>{children}</div>,
  };
});

describe("contact page", () => {
  it("renders without crashing", () => {
    render(<Contact />);
    expect(screen.getByAltText("resume")).toBeInTheDocument();
  });

  it("renders resume image", () => {
    render(<Contact />);

    const img = screen.getByAltText("resume");
    expect(img).toHaveAttribute(
      "src",
      expect.stringContaining("kittanun_apisitamorn_resume.png")
    );
  });
});
