import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "../context/Theme";
import { AuthProvider } from "../context/AuthContext";

export function renderWithProviders(ui, { route = "/" } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ThemeProvider>
        <AuthProvider>{ui}</AuthProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}
