import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { renderWithProviders } from "../main_test";

/* ================= mock navigate ================= */
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

/* ================= mock modal ================= */
vi.mock("../component/Modal/PleaseLoginModal", () => ({
  default: ({ open, onClose }) =>
    open ? <button onClick={onClose}>close modal</button> : null,
}));

/* ================= tests ================= */
describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("renders outlet when token exists", async () => {
    localStorage.setItem("token", "fake-token");

    renderWithProviders(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<h1>private</h1>} />
        </Route>
      </Routes>,
      { route: "/" }
    );

    expect(await screen.findByText(/private/i)).toBeInTheDocument();
  });

  it("shows modal when token does not exist", async () => {
    localStorage.removeItem("token");

    renderWithProviders(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<h1>private</h1>} />
        </Route>
      </Routes>,
      { route: "/" }
    );

    expect(await screen.findByText(/close modal/i)).toBeInTheDocument();
  });

  it("redirects to /login when modal is closed", async () => {
    localStorage.removeItem("token");

    renderWithProviders(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<h1>private</h1>} />
        </Route>
        <Route path="/login" element={<h1>login</h1>} />
      </Routes>,
      { route: "/" }
    );

    fireEvent.click(await screen.findByText(/close modal/i));

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
