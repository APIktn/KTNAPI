import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PleaseLoginModal from "./PleaseLoginModal";

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
describe("PleaseLoginModal", () => {
  it("does not render when open is false", () => {
    render(<PleaseLoginModal open={false} onClose={vi.fn()} />);

    expect(screen.queryByTestId("dialog")).toBeNull();
  });

  it("renders title and message when open is true", () => {
    render(<PleaseLoginModal open onClose={vi.fn()} />);

    expect(
      screen.getByText(/login required/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/please login before visiting this page/i)
    ).toBeInTheDocument();
  });

  it("calls onClose when ok button is clicked", () => {
    const onClose = vi.fn();

    render(<PleaseLoginModal open onClose={onClose} />);

    fireEvent.click(screen.getByText(/ok/i));

    expect(onClose).toHaveBeenCalled();
  });
});
