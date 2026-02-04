import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminInventory from "./AdminInventory";

/* ---------- mock axios ---------- */
vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

/* ---------- mock router ---------- */
const navigateMock = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}));

/* ---------- mock debounce hook ---------- */
/* ทำให้ debounce คืนค่าทันที ไม่ต้องรอเวลา */
vi.mock("./AdminInventory", async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    __esModule: true,
    default: mod.default,
    useDebounce: (v) => v,
  };
});

/* ---------- mock mui grow ---------- */
vi.mock("@mui/material", async () => {
  const actual = await vi.importActual("@mui/material");
  return {
    ...actual,
    Grow: ({ children }) => <div>{children}</div>,
  };
});

/* ---------- mock saving backdrop ---------- */
vi.mock("../component/SavingBackdrop", () => ({
  default: () => null,
}));

import axios from "axios";

const mockProducts = [
  {
    productCode: "p001",
    productName: "bone alpha",
    image: "/img/a.png",
    lines: [{ amount: 5 }],
  },
  {
    productCode: "p002",
    productName: "bone beta",
    image: "/img/b.png",
    lines: [{ amount: 0 }],
  },
];

describe("admin inventory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("token", "fake-token");
  });

  it("renders inventory items from api", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        items: mockProducts,
        totalPages: 1,
      },
    });

    render(<AdminInventory />);

    expect(
      await screen.findByText("bone alpha")
    ).toBeInTheDocument();

    expect(screen.getByText("bone beta")).toBeInTheDocument();
    expect(screen.getByText("available")).toBeInTheDocument();
    expect(screen.getByText("sold")).toBeInTheDocument();
  });

  it("navigates to manage product page", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        items: mockProducts,
        totalPages: 1,
      },
    });

    render(<AdminInventory />);

    const manageButtons = await screen.findAllByRole("button", {
      name: /manage/i,
    });

    fireEvent.click(manageButtons[0]);

    expect(navigateMock).toHaveBeenCalledWith(
      "/AdminAddProduct?prd=p001"
    );
  });

  it("fetches new data when clicking next page", async () => {
    axios.post
      .mockResolvedValueOnce({
        data: {
          items: mockProducts,
          totalPages: 2,
        },
      })
      .mockResolvedValueOnce({
        data: {
          items: [],
          totalPages: 2,
        },
      });

    render(<AdminInventory />);

    await screen.findByText("bone alpha");

    fireEvent.click(
      screen.getByRole("button", { name: /next/i })
    );

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(2);
    });
  });
});
