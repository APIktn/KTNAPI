import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Signup from "./Signup";

/* ---------- mock pagewrapper ---------- */
vi.mock("../context/animate", () => ({
  default: ({ children }) => <div>{children}</div>,
}));

/* ---------- mock router ---------- */
const navigateMock = vi.fn();

vi.mock("react-router-dom", () => ({
  Link: ({ to, children }) => <a href={to}>{children}</a>,
  useNavigate: () => navigateMock,
}));

/* ---------- mock axios ---------- */
vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

/* ---------- mock modal ---------- */
vi.mock("../component/Modal/AppModal", () => ({
  default: ({ open, title, message }) =>
    open ? (
      <div>
        <h1>{title}</h1>
        <p>{message}</p>
      </div>
    ) : null,
}));

import axios from "axios";

describe("signup page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders signup form", () => {
    render(<Signup />);

    expect(screen.getByText("sign up")).toBeInTheDocument();
    expect(screen.getByLabelText("first name")).toBeInTheDocument();
    expect(screen.getByLabelText("last name")).toBeInTheDocument();
    expect(screen.getByLabelText("email")).toBeInTheDocument();
    expect(screen.getByLabelText("password")).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    render(<Signup />);

    fireEvent.click(screen.getByText("register"));

    expect(await screen.findByText("first name is required")).toBeInTheDocument();
    expect(screen.getByText("last name is required")).toBeInTheDocument();
    expect(screen.getByText("email is required")).toBeInTheDocument();
    expect(screen.getByText("password is required")).toBeInTheDocument();
  });

  it("shows invalid email error", async () => {
    render(<Signup />);

    fireEvent.change(screen.getByLabelText("first name"), {
      target: { value: "john" },
    });
    fireEvent.change(screen.getByLabelText("last name"), {
      target: { value: "doe" },
    });
    fireEvent.change(screen.getByLabelText("email"), {
      target: { value: "wrong-email" },
    });
    fireEvent.change(screen.getByLabelText("password"), {
      target: { value: "1234567890" },
    });

    fireEvent.click(screen.getByText("register"));

    expect(
      await screen.findByText("invalid email format")
    ).toBeInTheDocument();
  });

  it("submits form and shows success modal", async () => {
    axios.post.mockResolvedValueOnce({
      status: 201,
      data: { message: "user created" },
    });

    render(<Signup />);

    fireEvent.change(screen.getByLabelText("first name"), {
      target: { value: "john" },
    });
    fireEvent.change(screen.getByLabelText("last name"), {
      target: { value: "doe" },
    });
    fireEvent.change(screen.getByLabelText("email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText("password"), {
      target: { value: "1234567890" },
    });

    fireEvent.click(screen.getByText("register"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });

    expect(
      screen.getByText("registration successful")
    ).toBeInTheDocument();

    expect(screen.getByText("user created")).toBeInTheDocument();
  });

  it("shows error modal when api fails", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { error: "email already exists" } },
    });

    render(<Signup />);

    fireEvent.change(screen.getByLabelText("first name"), {
      target: { value: "john" },
    });
    fireEvent.change(screen.getByLabelText("last name"), {
      target: { value: "doe" },
    });
    fireEvent.change(screen.getByLabelText("email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText("password"), {
      target: { value: "1234567890" },
    });

    fireEvent.click(screen.getByText("register"));

    await waitFor(() => {
      expect(
        screen.getByText("registration failed")
      ).toBeInTheDocument();
    });

    expect(screen.getByText("email already exists")).toBeInTheDocument();
  });
});
