import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "./NotFound";

/* ---------- mock react-router-dom ---------- */
vi.mock("react-router-dom", () => ({
  Link: ({ to, children, className }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));

describe("notfound page", () => {
it("renders without crashing", () => {
  render(<NotFound />);
  expect(screen.getByText(/404/)).toBeInTheDocument();
});

it("shows not found message", () => {
  render(<NotFound />);

  expect(
    screen.getByText(/your url was not found anywhere in this universe/i)
  ).toBeInTheDocument();
});

  it("renders link back to home page", () => {
    render(<NotFound />);

    const link = screen.getByText(
      "but don’t worry, we can go back to home page"
    );

    expect(link).toHaveAttribute("href", "/");
  });

  it("renders background video", () => {
    const { container } = render(<NotFound />);

    const video = container.querySelector("video");
    expect(video).toBeInTheDocument();

    const source = container.querySelector("source");
    expect(source.getAttribute("src")).toContain("notfound.mp4");
  });
});
