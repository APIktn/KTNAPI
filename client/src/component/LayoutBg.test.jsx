import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

/* mock Outlet */
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">content</div>,
  };
});

describe("LayoutBg", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("renders outlet content", async () => {
    vi.doMock("../context/Theme", () => ({
      useTheme: () => ({ theme: "light" }),
    }));

    const LayoutBg = (await import("./LayoutBg")).default;

    render(<LayoutBg />);
    expect(screen.getByTestId("outlet")).toBeInTheDocument();
  });

  it("uses light background video when theme is light", async () => {
    vi.doMock("../context/Theme", () => ({
      useTheme: () => ({ theme: "light" }),
    }));

    const LayoutBg = (await import("./LayoutBg")).default;

    render(<LayoutBg />);

    const source = document.querySelector("source");
    expect(source.src).toContain("/video/bg_light_video.mp4");
  });

  it("uses dark background video when theme is dark", async () => {
    vi.doMock("../context/Theme", () => ({
      useTheme: () => ({ theme: "dark" }),
    }));

    const LayoutBg = (await import("./LayoutBg")).default;

    render(<LayoutBg />);

    const source = document.querySelector("source");
    expect(source.src).toContain("/video/bg_dark_video.mp4");
  });
});
