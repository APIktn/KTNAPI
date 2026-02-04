import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SavingBackdrop from "./SavingBackdrop";

/* mock MUI */
vi.mock("@mui/material/Backdrop", () => ({
  default: ({ open, children }) =>
    open ? <div data-testid="backdrop">{children}</div> : null,
}));

vi.mock("@mui/material/CircularProgress", () => ({
  default: () => <div>loading...</div>,
}));

vi.mock("@mui/material/Typography", () => ({
  default: ({ children }) => <span>{children}</span>,
}));

describe("SavingBackdrop", () => {
  it("does not render when open is false", () => {
    render(<SavingBackdrop open={false} />);
    expect(screen.queryByTestId("backdrop")).toBeNull();
  });

  it("renders when open is true", () => {
    render(<SavingBackdrop open />);
    expect(screen.getByTestId("backdrop")).toBeInTheDocument();
  });

  it("shows default text 'loading...' when text prop not provided", () => {
    render(<SavingBackdrop open />);
    expect(screen.getAllByText("loading...").length).toBeGreaterThan(0);
  });

  it("shows custom text when text prop is provided", () => {
    render(<SavingBackdrop open text="uploading..." />);
    expect(screen.getByText(/uploading/i)).toBeInTheDocument();
  });
});
