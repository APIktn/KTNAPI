import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

/* ================= mocks ================= */
const mockToggleTheme = vi.fn();

vi.mock("../../context/Theme", () => ({
  useTheme: () => ({
    theme: "light",
    toggleTheme: mockToggleTheme,
  }),
}));

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    logout: vi.fn(),
  }),
}));

vi.mock("../Modal/AppModal", () => ({
  default: () => null,
}));

/* MUI */
vi.mock("@mui/material/BottomNavigation", () => ({
  default: ({ children }) => <div>{children}</div>,
}));
vi.mock("@mui/material/BottomNavigationAction", () => ({
  default: ({ label }) => <span>{label}</span>,
}));
vi.mock("@mui/material/Button", () => ({
  default: ({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

describe("Navbar (guest)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows login and signup buttons", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it("calls toggleTheme when theme switch clicked", () => {
    const { container } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    fireEvent.click(container.querySelector(".theme-switch"));

    expect(mockToggleTheme).toHaveBeenCalled();
  });
});
