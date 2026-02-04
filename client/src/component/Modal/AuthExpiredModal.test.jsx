import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AuthExpiredModal from "./AuthExpiredModal";

/* ================= mock MUI Dialog ================= */
vi.mock("@mui/material/Dialog", () => ({
  default: ({ open, children }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
}));

vi.mock("@mui/material/DialogTitle", () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock("@mui/material/DialogContent", () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock("@mui/material/DialogContentText", () => ({
  default: ({ children }) => <p>{children}</p>,
}));

vi.mock("@mui/material/DialogActions", () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock("@mui/material/Button", () => ({
  default: ({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

/* ================= tests ================= */
describe("AuthExpiredModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    Object.defineProperty(window, "location", {
      value: { replace: vi.fn() },
      writable: true,
    });
  });

  it("does not render dialog initially", () => {
    render(<AuthExpiredModal />);

    expect(screen.queryByTestId("dialog")).toBeNull();
  });

  it("opens modal when auth-expired event is dispatched", async () => {
    render(<AuthExpiredModal />);

    window.dispatchEvent(new Event("auth-expired"));

    expect(
      await screen.findByText(/session expired/i)
    ).toBeInTheDocument();
  });

  it("redirects to /login when ok button is clicked", async () => {
    render(<AuthExpiredModal />);

    window.dispatchEvent(new Event("auth-expired"));

    fireEvent.click(await screen.findByText(/ok/i));

    expect(window.location.replace).toHaveBeenCalledWith("/login");
  });
});
