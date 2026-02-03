import "@testing-library/jest-dom";
import { vi } from "vitest";

/* matchMedia */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    matches: false,
    media: "",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

/* IntersectionObserver */
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = MockIntersectionObserver;

/* =====================
   mock videos
   ===================== */

// LayoutBg.jsx
vi.mock("../assets/design/video/bg_dark_video.mp4", () => ({
  default: "mock-dark-video",
}));

vi.mock("../assets/design/video/bg_light_video.mp4", () => ({
  default: "mock-light-video",
}));
