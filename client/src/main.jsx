import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./theme.css";
import "./css/NotFound.css";
import "./css/Class.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ThemeProvider } from "./context/Theme.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import jwtInterceptor from "./utils/JwtInterceptor.js";

jwtInterceptor();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
          <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
