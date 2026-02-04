import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SidebarMobile from "./SidebarMobile";

/* ================= mock SidebarMenu ================= */
vi.mock("./SidebarMenu", () => ({
  default: ({ showText, isMobile }) => (
    <div data-testid="sidebar-menu">
      {showText && "showText"} {isMobile && "mobile"}
    </div>
  ),
}));

/* ================= mock MUI Drawer ================= */
vi.mock("@mui/material/Drawer", () => ({
  default: ({ open, onClose, children }) =>
    open ? (
      <div data-testid="drawer" onClick={onClose}>
        {children}
      </div>
    ) : null,
}));

describe("SidebarMobile", () => {
  it("does not render when open is false", () => {
    render(<SidebarMobile open={false} onClose={vi.fn()} />);

    expect(screen.queryByTestId("drawer")).toBeNull();
  });

  it("renders SidebarMenu when open is true", () => {
    render(<SidebarMobile open onClose={vi.fn()} />);

    expect(screen.getByTestId("sidebar-menu")).toBeInTheDocument();
  });

  it("passes showText and isMobile to SidebarMenu", () => {
    render(<SidebarMobile open onClose={vi.fn()} />);

    expect(screen.getByText(/showText/i)).toBeInTheDocument();
    expect(screen.getByText(/mobile/i)).toBeInTheDocument();
  });

  it("calls onClose when drawer is closed", () => {
    const onClose = vi.fn();

    render(<SidebarMobile open onClose={onClose} />);

    fireEvent.click(screen.getByTestId("drawer"));

    expect(onClose).toHaveBeenCalled();
  });
});
