import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext()

const getDefaultTheme = () => {
  const saved = localStorage.getItem("theme")
  if (saved) return saved

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getDefaultTheme)

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"))
  }

  useEffect(() => {
    localStorage.setItem("theme", theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div data-bs-theme={theme} className="min-vh-100">
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
