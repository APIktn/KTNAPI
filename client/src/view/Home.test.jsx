import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "./Home";

/* ---------- mock PageWrapper ---------- */
vi.mock("../context/animate", () => ({
  default: ({ children }) => <div>{children}</div>,
}));

/* ---------- mock IntersectionObserver ---------- */
beforeEach(() => {
  global.IntersectionObserver = function () {
    return {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    };
  };
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

    const centerImg = document.querySelector(".mrbone-img.center");
    expect(centerImg).toBeTruthy();

    expect(centerImg.getAttribute("src").toLowerCase())
      .toContain("mrbone_1");
  });
it("click next changes center image", async () => {
  render(<Home />);

  fireEvent.click(
    screen.getByRole("button", { name: "next" })
  );

  await waitFor(() => {
    const centerImg = document.querySelector(".mrbone-img.center");
    expect(centerImg.getAttribute("src").toLowerCase())
      .toContain("mrbone_2");
  });
});

it("click prev changes center image backward", async () => {
  render(<Home />);

  fireEvent.click(
    screen.getByRole("button", { name: "prev" })
  );

  await waitFor(() => {
    const centerImg = document.querySelector(".mrbone-img.center");
    expect(centerImg.getAttribute("src").toLowerCase())
      .toContain("mrbone_8");
  });
});

});
