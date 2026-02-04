import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import { renderWithProviders } from "../main_test";

describe("PublicRoute", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("renders outlet when user does not exist", async () => {
    renderWithProviders(
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<h1>login</h1>} />
        </Route>
      </Routes>,
      { route: "/login" }
    );

    expect(await screen.findByText(/login/i)).toBeInTheDocument();
  });

  it("redirects to home when user exists", async () => {
    localStorage.setItem("user", JSON.stringify({ id: 1 }));

    renderWithProviders(
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<h1>login</h1>} />
        </Route>
        <Route path="/" element={<h1>home</h1>} />
      </Routes>,
      { route: "/login" }
    );

    expect(await screen.findByText(/home/i)).toBeInTheDocument();
  });
});
