import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SidebarMenu from "./SidebarMenu";
import { MemoryRouter } from "react-router-dom";

/* ================= mock MUI components ================= */
vi.mock("@mui/material/List", () => ({
  default: ({ children }) => <div>{children}</div>,
}));
vi.mock("@mui/material/Divider", () => ({
  default: () => <hr />,
}));
vi.mock("@mui/material/ListItem", () => ({
  default: ({ children }) => <div>{children}</div>,
}));
vi.mock("@mui/material/ListItemButton", () => ({
  default: ({ children, component: Comp = "div", to }) => (
    <Comp to={to}>{children}</Comp>
  ),
}));
vi.mock("@mui/material/ListItemIcon", () => ({
  default: ({ children }) => <span>{children}</span>,
}));
vi.mock("@mui/material/ListItemText", () => ({
  default: ({ primary }) => <span>{primary}</span>,
}));

describe("SidebarMenu", () => {
  it("renders shared menu items always", () => {
    render(
      <MemoryRouter>
        <SidebarMenu showText isMobile={false} />
      </MemoryRouter>
    );

    expect(screen.getByText(/add product/i)).toBeInTheDocument();
    expect(screen.getByText(/inventory/i)).toBeInTheDocument();
  });

  it("does not render mobile-only menu when isMobile is false", () => {
    render(
      <MemoryRouter>
        <SidebarMenu showText isMobile={false} />
      </MemoryRouter>
    );

    expect(screen.queryByText(/home/i)).toBeNull();
    expect(screen.queryByText(/contact/i)).toBeNull();
  });

  it("renders mobile-only menu when isMobile is true", () => {
    render(
      <MemoryRouter>
        <SidebarMenu showText isMobile />
      </MemoryRouter>
    );

    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/contact/i)).toBeInTheDocument();
  });

  it("does not show text labels when showText is false", () => {
    render(
      <MemoryRouter>
        <SidebarMenu showText={false} isMobile />
      </MemoryRouter>
    );

    expect(screen.queryByText(/home/i)).toBeNull();
    expect(screen.queryByText(/contact/i)).toBeNull();
    expect(screen.queryByText(/add product/i)).toBeNull();
    expect(screen.queryByText(/inventory/i)).toBeNull();
  });
});
