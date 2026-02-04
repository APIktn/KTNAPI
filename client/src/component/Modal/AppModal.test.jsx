import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AppModal from "./AppModal";

/* ================= mock MUI Dialog (ตัด portal / transition) ================= */
vi.mock("@mui/material/Dialog", () => ({
  default: ({ open, children, onClose }) =>
    open ? (
      <div data-testid="dialog" onClick={() => onClose?.({}, "backdropClick")}>
        {children}
      </div>
    ) : null,
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
  default: ({ children, onClick, ...props }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

/* ================= tests ================= */
describe("AppModal", () => {
  it("renders title and message when open", () => {
    render(
      <AppModal
        open
        title="success"
        message="done"
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText(/success/i)).toBeInTheDocument();
    expect(screen.getByText(/done/i)).toBeInTheDocument();
  });

  it("calls onClose when confirm button clicked in alert mode", () => {
    const onClose = vi.fn();

    render(
      <AppModal
        open
        title="alert"
        message="msg"
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByText(/ok/i));

    expect(onClose).toHaveBeenCalled();
  });

  it("calls onConfirm in confirm mode", () => {
    const onConfirm = vi.fn();

    render(
      <AppModal
        open
        mode="confirm"
        title="confirm"
        message="msg"
        onConfirm={onConfirm}
      />
    );

    fireEvent.click(screen.getByText(/ok/i));

    expect(onConfirm).toHaveBeenCalled();
  });

  it("calls onCancel when cancel button clicked", () => {
    const onCancel = vi.fn();

    render(
      <AppModal
        open
        mode="confirm"
        title="confirm"
        message="msg"
        onCancel={onCancel}
      />
    );

    fireEvent.click(screen.getByText(/cancel/i));

    expect(onCancel).toHaveBeenCalled();
  });

  it("renders link buttons when links provided", () => {
    render(
      <AppModal
        open
        title="link"
        message="msg"
        link1="https://example.com"
        link1Text="open link"
      />
    );

    expect(screen.getByText(/open link/i)).toBeInTheDocument();
  });
});
