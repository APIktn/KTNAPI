import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./Theme";

// mock
function TestComponent() {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <span>theme:{theme}</span>
      <button onClick={toggleTheme}>toggle</button>
    </>
  );
}

// tests
describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();

    vi.stubGlobal("matchMedia", vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })));
  });

  it("uses light theme by default when no localStorage and system is light", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText(/theme:light/i)).toBeInTheDocument();
  });

  it("uses theme from localStorage if exists", () => {
    localStorage.setItem("theme", "dark");

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText(/theme:dark/i)).toBeInTheDocument();
  });

  it("toggles theme from light to dark", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText(/toggle/i));

    expect(screen.getByText(/theme:dark/i)).toBeInTheDocument();
  });

  it("saves theme to localStorage when changed", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText(/toggle/i));

    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("applies data-bs-theme attribute", () => {
    const { container } = render(
      <ThemeProvider>
        <div>content</div>
      </ThemeProvider>
    );

    expect(container.querySelector("[data-bs-theme='light']")).toBeTruthy();
  });
});
