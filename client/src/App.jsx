import { BrowserRouter, Routes, Route } from "react-router-dom"
import Header from "./component/Header.jsx"
import Home from "./view/Home.jsx"
import PageA from "./view/Test.jsx"

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<PageA />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
