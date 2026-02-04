import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const mockLogout = vi.fn();
const mockNavigate = vi.fn();

vi.mock("../../context/Theme", () => ({
  useTheme: () => ({ theme: "light", toggleTheme: vi.fn() }),
}));

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ user: { displayName: "john" }, logout: mockLogout }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("../Modal/AppModal", () => ({
  default: ({ open, onConfirm }) =>
    open ? <button onClick={onConfirm}>confirm logout</button> : null,
}));

import Navbar from "./Navbar";

describe("Navbar (authenticated)", () => {
  it("shows avatar button with name", () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    expect(
      screen.getByRole("button", { name: /john/i })
    ).toBeInTheDocument();
  });

  it("confirms logout", () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>);

    fireEvent.click(
      screen.getByRole("button", { name: /john/i })
    );
    fireEvent.click(screen.getByText(/logout/i));
    fireEvent.click(screen.getByText(/confirm logout/i));

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
