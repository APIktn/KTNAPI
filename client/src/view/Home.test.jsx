import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "./Home";

/* ---------- mock pagewrapper ---------- */
vi.mock("../context/animate", () => ({
  default: ({ children }) => <div>{children}</div>,
}));

/* ---------- mock intersectionobserver ---------- */
beforeEach(() => {
  global.IntersectionObserver = vi.fn(function () {
    return {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    };
  });
});

describe("home page", () => {
  it("renders without crashing", () => {
    render(<Home />);
    expect(screen.getByText("bone chop!")).toBeInTheDocument();
  });

  it("renders main headings", () => {
    render(<Home />);

    expect(
      screen.getByText("art toy shop for collectors")
    ).toBeInTheDocument();

    expect(
      screen.getByText("select your style!")
    ).toBeInTheDocument();

    expect(
      screen.getByText("find your favorite")
    ).toBeInTheDocument();
  });

  it("shows initial center image", () => {
    render(<Home />);

    const images = document.querySelectorAll(".mrbone-img.center");
    expect(images.length).toBe(1);

    expect(images[0].getAttribute("src")).toContain("mrbone_1");
  });

  it("click next changes center image", () => {
    render(<Home />);

    const nextBtn = document.querySelector(
      'button:has(svg[data-testid="ChevronRightIcon"])'
    );

    fireEvent.click(nextBtn);

    const centerImg = document.querySelector(".mrbone-img.center");
    expect(centerImg.getAttribute("src")).toContain("mrbone_2");
  });

  it("click prev changes center image backward", () => {
    render(<Home />);

    const prevBtn = document.querySelector(
      'button:has(svg[data-testid="ChevronLeftIcon"])'
    );

    fireEvent.click(prevBtn);

    const centerImg = document.querySelector(".mrbone-img.center");
    expect(centerImg.getAttribute("src")).toContain("mrbone_8");
  });
});
