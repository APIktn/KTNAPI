import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar.jsx"
import Home from "./views/Home.jsx"
import ProtectedRoute from "./routes/ProtectedRoute.jsx"
import PageA from "./views/test.jsx"

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/test"
          element={
            <ProtectedRoute>
              <PageA />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
