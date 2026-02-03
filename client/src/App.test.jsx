import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";

/* mock layout */
vi.mock("./component/LayoutBg", () => ({
  default: ({ children }) => <div>{children}</div>,
}));

/* mock pages */
vi.mock("./view/Home", () => ({
  default: () => <h1>Home</h1>,
}));

vi.mock("./view/Contact", () => ({
  default: () => <h1>Contact</h1>,
}));

vi.mock("./view/Login", () => ({
  default: () => <h1>Login</h1>,
}));

vi.mock("./view/Signup", () => ({
  default: () => <h1>Sign Up</h1>,
}));

vi.mock("./view/Profile", () => ({
  default: () => <h1>Profile</h1>,
}));

vi.mock("./view/NotFound", () => ({
  default: () => <h1>Not Found</h1>,
}));

import { AppRoutes } from "./App";
import { renderWithProviders } from "./main_test";

describe("App routing", () => {
  it("renders Home on /", () => {
    renderWithProviders(<AppRoutes />, { route: "/" });
    expect(screen.getByText(/home/i)).toBeInTheDocument();
  });

  it("renders Contact on /contact", () => {
    renderWithProviders(<AppRoutes />, { route: "/contact" });
    expect(screen.getByText(/contact/i)).toBeInTheDocument();
  });

  it("renders Login on /login", () => {
    renderWithProviders(<AppRoutes />, { route: "/login" });
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it("renders Signup on /signup", () => {
    renderWithProviders(<AppRoutes />, { route: "/signup" });
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it("redirects to Login when accessing protected route", () => {
    renderWithProviders(<AppRoutes />, { route: "/profile" });
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it("renders NotFound on unknown route", () => {
    renderWithProviders(<AppRoutes />, { route: "/unknown" });
    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });
});
