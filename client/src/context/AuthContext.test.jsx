import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";

/* ================= helper component ================= */
function TestComponent() {
  const { user, login, updateUser, logout } = useAuth();

  return (
    <>
      <span>{user ? user.name : "no user"}</span>
      <button onClick={() => login({ id: 1, name: "john" })}>login</button>
      <button onClick={() => updateUser({ id: 1, name: "doe" })}>
        update
      </button>
      <button onClick={logout}>logout</button>
    </>
  );
}

/* ================= tests ================= */
describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("initializes user from localStorage", () => {
    localStorage.setItem("user", JSON.stringify({ id: 1, name: "saved" }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText(/saved/i)).toBeInTheDocument();
  });

  it("login sets user state and localStorage", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText(/login/i));

    expect(screen.getByText(/john/i)).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("user")).name).toBe("john");
  });

  it("updateUser updates user state and localStorage", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText(/login/i));
    fireEvent.click(screen.getByText(/update/i));

    expect(screen.getByText(/doe/i)).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("user")).name).toBe("doe");
  });

  it("logout clears user and localStorage", () => {
    localStorage.setItem("user", JSON.stringify({ id: 1, name: "saved" }));
    localStorage.setItem("token", "fake-token");

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText(/logout/i));

    expect(screen.getByText(/no user/i)).toBeInTheDocument();
    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });
});
