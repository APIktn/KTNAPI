import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";

/* ---------- mock layout ---------- */
vi.mock("./component/LayoutBg", async () => {
  const { Outlet } = await import("react-router-dom");
  return {
    default: () => <Outlet />,
  };
});

vi.mock("./component/Header", async () => {
  const { Outlet } = await import("react-router-dom");
  return {
    default: () => <Outlet />,
  };
});

/* ---------- mock route guards ---------- */
vi.mock("./context/ProtectedRoute", async () => {
  const { Outlet } = await import("react-router-dom");
  return {
    default: () => <Outlet />,
  };
});

vi.mock("./context/PublicRoute", async () => {
  const { Outlet } = await import("react-router-dom");
  return {
    default: () => <Outlet />,
  };
});

/* ---------- mock pages ---------- */
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

/* ---------- imports หลัง mock ---------- */
import { AppRoutes } from "./App";
import { renderWithProviders } from "./main_test";

describe("App routing", () => {
  it("renders Home on /", async () => {
    renderWithProviders(<AppRoutes />, { route: "/" });
    expect(await screen.findByText(/home/i)).toBeInTheDocument();
  });

  it("renders Contact on /contact", async () => {
    renderWithProviders(<AppRoutes />, { route: "/contact" });
    expect(await screen.findByText(/contact/i)).toBeInTheDocument();
  });

  it("renders Login on /login", async () => {
    renderWithProviders(<AppRoutes />, { route: "/login" });
    expect(await screen.findByText(/login/i)).toBeInTheDocument();
  });

  it("renders Signup on /signup", async () => {
    renderWithProviders(<AppRoutes />, { route: "/signup" });
    expect(await screen.findByText(/sign up/i)).toBeInTheDocument();
  });

  it("renders Profile on protected route", async () => {
    renderWithProviders(<AppRoutes />, { route: "/profile" });
    expect(await screen.findByText(/profile/i)).toBeInTheDocument();
  });

  it("renders NotFound on unknown route", async () => {
    renderWithProviders(<AppRoutes />, { route: "/unknown" });
    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });
});
