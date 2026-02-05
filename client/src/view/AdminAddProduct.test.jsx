import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import AdminAddProduct from "./AdminAddProduct";
import axios from "axios";

/* ---------- mock axios ---------- */
vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

/* ---------- mock router ---------- */
const navigateMock = vi.fn();
const searchParamsMock = new URLSearchParams();

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
  useSearchParams: () => [searchParamsMock],
}));

/* ---------- mock theme ---------- */
vi.mock("../context/Theme", () => ({
  useTheme: () => ({ theme: "dark" }),
}));

/* ---------- mock dnd-kit ---------- */
vi.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }) => <div>{children}</div>,
  closestCenter: vi.fn(),
  PointerSensor: vi.fn(),
  TouchSensor: vi.fn(),
  useSensor: vi.fn(),
  useSensors: () => [],
}));

vi.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }) => <div>{children}</div>,
  useSortable: () => ({
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    attributes: {},
    listeners: {},
  }),
  verticalListSortingStrategy: vi.fn(),
  arrayMove: vi.fn((arr) => arr),
}));

/* ---------- mock mui animation ---------- */
vi.mock("@mui/material", async () => {
  const actual = await vi.importActual("@mui/material");
  return {
    ...actual,
    Slide: ({ children }) => <div>{children}</div>,
  };
});

/* ---------- mock modal & backdrop ---------- */
vi.mock("../component/Modal/AppModal", () => ({
  default: () => null,
}));

vi.mock("../component/SavingBackdrop", () => ({
  default: () => null,
}));

/* ---------- mock not found ---------- */
vi.mock("./NotFound", () => ({
  default: () => <div>not found</div>,
}));

/* ---------- mock data ---------- */
const mockProduct = {
  productName: "bone alpha",
  description: "test desc",
  mainImage: "/img/a.png",
  items: [
    {
      lineKey: 1,
      lineNo: 1,
      size: "100%",
      price: 100,
      amount: 5,
      note: "",
    },
  ],
};

vi.mock("@mui/material", async () => {
  const actual = await vi.importActual("@mui/material");
  return {
    ...actual,
    Select: ({ value, onChange, children }) => (
      <select
        data-testid="size-select"
        value={value}
        onChange={(e) => onChange({ target: { value: e.target.value } })}
      >
        {children}
      </select>
    ),
    MenuItem: ({ value, children }) => (
      <option value={value}>{children}</option>
    ),
    Slide: ({ children }) => <div>{children}</div>,
  };
});

vi.mock("@mui/material/MenuItem", () => ({
  default: ({ value, children }) => <option value={value}>{children}</option>,
}));

describe("admin add product", () => {
  beforeAll(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  beforeEach(() => {
    vi.clearAllMocks();
    searchParamsMock.delete("prd");
  });

  it("renders new product form", () => {
    render(<AdminAddProduct />);

    expect(screen.getByText(/new product/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/product name/i)).toBeInTheDocument();
  });

  it("loads product when prd param exists", async () => {
    searchParamsMock.set("prd", "p001");

    axios.post.mockResolvedValueOnce({ data: mockProduct });

    render(<AdminAddProduct />);

    expect(await screen.findByDisplayValue("bone alpha")).toBeInTheDocument();

    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("handles 404 without crashing", async () => {
    searchParamsMock.set("prd", "badcode");

    axios.post.mockRejectedValueOnce({
      response: { status: 404 },
    });

    render(<AdminAddProduct />);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });

  it("adds new row when clicking add row button", async () => {
    render(<AdminAddProduct />);

    const addRowBtn = screen.getByTestId("AddIcon").closest("button");

    await act(async () => {
      fireEvent.click(addRowBtn);
    });

    const prices = await screen.findAllByLabelText(/price/i);
    expect(prices.length).toBeGreaterThan(1);
  });

  it("validates product name before save", async () => {
    render(<AdminAddProduct />);

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(
      await screen.findByText(/product name is required/i),
    ).toBeInTheDocument();
  });

  it("calls save api when valid (edit mode)", async () => {
    axios.post
      .mockResolvedValueOnce({ data: mockProduct }) // load
      .mockResolvedValueOnce({ data: { productCode: "p001" } }); // save

    searchParamsMock.set("prd", "p001");

    render(<AdminAddProduct />);

    await screen.findByDisplayValue("bone alpha");

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });

  it("calls save api when valid (new product)", async () => {
    axios.post.mockResolvedValueOnce({
      data: { productCode: "p999" },
    });

    render(<AdminAddProduct />);

    fireEvent.change(screen.getByLabelText(/product name/i), {
      target: { value: "new bone" },
    });

    fireEvent.change(screen.getByTestId("size-select"), {
      target: { value: "100%" },
    });

    const priceInputs = screen.getAllByLabelText(/price/i);
    fireEvent.change(priceInputs[0], {
      target: { value: "100" },
    });

    const amountInputs = screen.getAllByLabelText(/amount/i);
    fireEvent.change(amountInputs[0], {
      target: { value: "5" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });
});
