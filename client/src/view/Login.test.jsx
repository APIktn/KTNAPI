import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";

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

/* ---------- mock auth context ---------- */
const loginMock = vi.fn();

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    login: loginMock,
  }),
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

describe("login page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders login form", () => {
    render(<Login />);

    expect(
      screen.getByRole("heading", { name: /login/i })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("username or email")
    ).toBeInTheDocument();

    expect(screen.getByLabelText("password")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /login/i })
    ).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    render(<Login />);

    fireEvent.click(
      screen.getByRole("button", { name: /login/i })
    );

    expect(
      await screen.findByText("username or email is required")
    ).toBeInTheDocument();

    expect(
      screen.getByText("password is required")
    ).toBeInTheDocument();
  });

  it("shows error when password is too short", async () => {
    render(<Login />);

    fireEvent.change(
      screen.getByLabelText("username or email"),
      { target: { value: "john" } }
    );

    fireEvent.change(
      screen.getByLabelText("password"),
      { target: { value: "123" } }
    );

    fireEvent.click(
      screen.getByRole("button", { name: /login/i })
    );

    expect(
      await screen.findByText("password must be at least 10 characters")
    ).toBeInTheDocument();
  });

  it("logs in successfully and shows success modal", async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
      data: {
        token: "fake-token",
        user: { id: 1, name: "john" },
        message: "welcome back",
      },
    });

    render(<Login />);

    fireEvent.change(
      screen.getByLabelText("username or email"),
      { target: { value: "john@example.com" } }
    );

    fireEvent.change(
      screen.getByLabelText("password"),
      { target: { value: "1234567890" } }
    );

    fireEvent.click(
      screen.getByRole("button", { name: /login/i })
    );

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });

    expect(localStorage.getItem("token")).toBe("fake-token");

    expect(loginMock).toHaveBeenCalledWith({
      id: 1,
      name: "john",
    });

    expect(
      screen.getByText("login successful")
    ).toBeInTheDocument();

    expect(
      screen.getByText("welcome back")
    ).toBeInTheDocument();
  });

  it("shows error modal when login fails", async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          error: "invalid credentials",
        },
      },
    });

    render(<Login />);

    fireEvent.change(
      screen.getByLabelText("username or email"),
      { target: { value: "john@example.com" } }
    );

    fireEvent.change(
      screen.getByLabelText("password"),
      { target: { value: "1234567890" } }
    );

    fireEvent.click(
      screen.getByRole("button", { name: /login/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText("login failed")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("invalid credentials")
    ).toBeInTheDocument();
  });
});
