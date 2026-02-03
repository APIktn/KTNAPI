import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { AppRoutes } from "./App";
import { renderWithProviders } from "./main_test";

describe("App routing", () => {
  /* mock bg */
  vi.mock("./component/LayoutBg", () => ({
    default: ({ children }) => <div>{children}</div>,
  }));

  it("test renders Home page on /", () => {
    renderWithProviders(<AppRoutes />, { route: "/" });
    expect(screen.getByText(/home/i)).toBeInTheDocument();
  });

  it("test renders Contact page on /contact", () => {
    renderWithProviders(<AppRoutes />, { route: "/contact" });
    expect(screen.getByText(/contact/i)).toBeInTheDocument();
  });

  it("test renders Login page on /login (public route)", () => {
    renderWithProviders(<AppRoutes />, { route: "/login" });

    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });

  it("test renders Signup page on /signup (public route)", () => {
    renderWithProviders(<AppRoutes />, { route: "/signup" });

    expect(
      screen.getByRole("heading", { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  it("test redirects to Login page when accessing protected route without authentication", () => {
    renderWithProviders(<AppRoutes />, { route: "/profile" });

    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });

  it("test renders NotFound page for unknown routes", () => {
    renderWithProviders(<AppRoutes />, { route: "/unknown" });

    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });
});
