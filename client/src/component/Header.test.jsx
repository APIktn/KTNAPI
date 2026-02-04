import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./Header";
import { MemoryRouter } from "react-router-dom";

/* ================= mock child components ================= */
vi.mock("./Nav/Navbar", () => ({
  default: ({ onToggleSidebar }) => (
    <button onClick={onToggleSidebar}>toggle sidebar</button>
  ),
}));

vi.mock("./Nav/SidebarDesktop", () => ({
  default: () => <div data-testid="sidebar-desktop">desktop sidebar</div>,
}));

vi.mock("./Nav/SidebarMobile", () => ({
  default: ({ open }) =>
    open ? <div data-testid="sidebar-mobile">mobile sidebar</div> : null,
}));

vi.mock("./Footer", () => ({
  default: () => <div data-testid="footer">footer</div>,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">content</div>,
  };
});

/* ================= mock IntersectionObserver ================= */
beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    vi.fn(function () {
      this.observe = vi.fn();
      this.disconnect = vi.fn();
    })
  );
});

/* ================= helpers ================= */
const setDesktop = () => {
  window.innerWidth = 1200;
  window.dispatchEvent(new Event("resize"));
};

const setMobile = () => {
  window.innerWidth = 375;
  window.dispatchEvent(new Event("resize"));
};

/* ================= tests ================= */
describe("Header", () => {
  it("renders navbar, outlet, and footer", () => {
    setDesktop();

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText(/toggle sidebar/i)).toBeInTheDocument();
    expect(screen.getByTestId("outlet")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("renders desktop layout when screen is large", () => {
    setDesktop();

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.queryByTestId("sidebar-desktop")).toBeNull();
  });

  it("opens desktop sidebar when toggle clicked", () => {
    setDesktop();

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/toggle sidebar/i));

    expect(
      screen.getByTestId("sidebar-desktop")
    ).toBeInTheDocument();
  });

  it("renders mobile layout when screen is small", () => {
    setMobile();

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.queryByTestId("sidebar-desktop")).toBeNull();
    expect(screen.queryByTestId("sidebar-mobile")).toBeNull();
  });

  it("opens mobile sidebar when toggle clicked", () => {
    setMobile();

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/toggle sidebar/i));

    expect(
      screen.getByTestId("sidebar-mobile")
    ).toBeInTheDocument();
  });
});
