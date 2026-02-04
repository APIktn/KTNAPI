import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PageWrapper from "./animate";

/* ================= mock framer-motion ================= */
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => (
      <div data-motion {...props}>
        {children}
      </div>
    ),
  },
}));

describe("PageWrapper", () => {
  it("renders children correctly", () => {
    render(
      <PageWrapper>
        <h1>content</h1>
      </PageWrapper>
    );

    expect(screen.getByText(/content/i)).toBeInTheDocument();
  });

  it("wraps content with motion div", () => {
    const { container } = render(
      <PageWrapper>
        <span>child</span>
      </PageWrapper>
    );

    expect(container.querySelector("[data-motion]")).toBeTruthy();
  });
});
