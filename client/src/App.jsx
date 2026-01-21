import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppThemeProvider from "./context/ThemeProvider.jsx";
import Header from "./components/Header.jsx";
import Home from "./views/Home.jsx";
import PageA from "./views/test.jsx";

function App() {
  return (
    <BrowserRouter>
      <AppThemeProvider>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<PageA />} />
        </Routes>

      </AppThemeProvider>
    </BrowserRouter>
  );
}

export default App;
