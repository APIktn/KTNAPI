import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Profile from "./Profile";

/* ---------- mock axios ---------- */
vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

/* ---------- mock auth context ---------- */
const updateUserMock = vi.fn();

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    updateUser: updateUserMock,
  }),
}));

/* ---------- mock theme ---------- */
vi.mock("../context/Theme", () => ({
  useTheme: () => ({
    theme: "dark",
  }),
}));

/* ---------- mock mui ---------- */
vi.mock("@mui/material", async () => {
  const actual = await vi.importActual("@mui/material");
  return {
    ...actual,
    Slide: ({ children }) => <div>{children}</div>,
    useMediaQuery: () => false,
  };
});

/* ---------- mock modal ---------- */
vi.mock("../component/Modal/AppModal", () => ({
  default: ({ open, title, message, onClose }) =>
    open ? (
      <div>
        <h1>{title}</h1>
        <p>{message}</p>
        <button onClick={onClose}>close</button>
      </div>
    ) : null,
}));

/* ---------- mock saving backdrop ---------- */
vi.mock("../component/SavingBackdrop", () => ({
  default: ({ open, text }) =>
    open ? <div>{text}</div> : null,
}));

import axios from "axios";

describe("profile page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("does not render when no token", () => {
    const { container } = render(<Profile />);
    expect(container.firstChild).toBeNull();
  });

  it("loads and displays profile data", async () => {
    localStorage.setItem("token", "fake-token");

    axios.post.mockResolvedValueOnce({
      data: {
        user: {
          firstName: "john",
          lastName: "doe",
          userName: "johndoe",
          address: "bangkok",
          tel: "0123456789",
          imageUpload: null,
        },
      },
    });

    render(<Profile />);

    expect(await screen.findByDisplayValue("john")).toBeInTheDocument();
    expect(screen.getByDisplayValue("doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("johndoe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("bangkok")).toBeInTheDocument();
    expect(screen.getByDisplayValue("0123456789")).toBeInTheDocument();
  });
it("shows validation errors when saving empty names", async () => {
  localStorage.setItem("token", "fake-token");

  axios.post.mockResolvedValueOnce({
    data: {
      user: {
        firstName: "",
        lastName: "",
        userName: "",
        address: "",
        tel: "",
      },
    },
  });

  render(<Profile />);

  // รอให้ form โหลดจริง
  await screen.findByLabelText("first name");

  fireEvent.click(
    screen.getByRole("button", { name: /save/i })
  );

  expect(
    screen.getByText("first name is required")
  ).toBeInTheDocument();

  expect(
    screen.getByText("last name is required")
  ).toBeInTheDocument();
});

  it("saves profile and updates user after closing modal", async () => {
    localStorage.setItem("token", "fake-token");

    // load profile
    axios.post.mockResolvedValueOnce({
      data: {
        user: {
          firstName: "john",
          lastName: "doe",
          userName: "johndoe",
          address: "bkk",
          tel: "000",
          imageUpload: null,
        },
      },
    });

    // save profile
    axios.post.mockResolvedValueOnce({
      data: {
        user: {
          firstName: "john",
          lastName: "doe",
          userName: "johndoe",
          address: "bkk",
          tel: "111",
          imageUpload: "new.png",
        },
      },
    });

    render(<Profile />);

    await screen.findByDisplayValue("john");

    fireEvent.change(
      screen.getByLabelText("tel"),
      { target: { value: "111" } }
    );

    fireEvent.click(
      screen.getByRole("button", { name: /save/i })
    );

    // success modal appears
    expect(
      await screen.findByText("update success")
    ).toBeInTheDocument();

    // close modal -> triggers updateUser
    fireEvent.click(screen.getByText("close"));

    expect(updateUserMock).toHaveBeenCalled();
  });

  it("does not render profile ui when load profile fails", async () => {
    localStorage.setItem("token", "fake-token");

    axios.post.mockRejectedValueOnce(new Error("fail"));

    const { container } = render(<Profile />);

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });
});
