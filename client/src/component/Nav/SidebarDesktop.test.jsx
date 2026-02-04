import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SidebarDesktop from "./SidebarDesktop";

/* ================= mock SidebarMenu ================= */
vi.mock("./SidebarMenu", () => ({
  default: ({ showText }) => (
    <div data-testid="sidebar-menu">
      {showText ? "open" : "closed"}
    </div>
  ),
}));

/* ================= mock MUI Drawer ================= */
vi.mock("@mui/material/Drawer", () => ({
  default: ({ children, onMouseEnter, onMouseLeave }) => (
    <div
      data-testid="drawer"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  ),
}));

describe("SidebarDesktop", () => {
  it("renders SidebarMenu", () => {
    render(
      <SidebarDesktop
        isOpen={false}
        isNavbarSticky={false}
        isFooterVisible={false}
        animateBorder={false}
      />
    );

    expect(
      screen.getByTestId("sidebar-menu")
    ).toBeInTheDocument();
  });

  it("passes showText=false when closed", () => {
    render(
      <SidebarDesktop
        isOpen={false}
        isNavbarSticky={false}
        isFooterVisible={false}
        animateBorder={false}
      />
    );

    expect(screen.getByText(/closed/i)).toBeInTheDocument();
  });

  it("passes showText=true when open", () => {
    render(
      <SidebarDesktop
        isOpen
        isNavbarSticky={false}
        isFooterVisible={false}
        animateBorder={false}
      />
    );

    expect(screen.getByText(/open/i)).toBeInTheDocument();
  });

  it("calls mouse enter and leave handlers", () => {
    const onMouseEnter = vi.fn();
    const onMouseLeave = vi.fn();

    render(
      <SidebarDesktop
        isOpen
        isNavbarSticky={false}
        isFooterVisible={false}
        animateBorder={false}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    );

    const drawer = screen.getByTestId("drawer");

    fireEvent.mouseEnter(drawer);
    fireEvent.mouseLeave(drawer);

    expect(onMouseEnter).toHaveBeenCalled();
    expect(onMouseLeave).toHaveBeenCalled();
  });
});
