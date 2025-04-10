"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => {},
})

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: {
  children: ReactNode
  defaultTheme?: Theme
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  // Initialize theme
  useEffect(() => {
    setMounted(true)

    // Get saved theme from localStorage
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    } else if (defaultTheme === "system") {
      // Check system preference
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      setTheme(systemTheme)
    }
  }, [defaultTheme])

  // Update theme
  useEffect(() => {
    if (!mounted) return

    // Save to localStorage
    localStorage.setItem("theme", theme)

    // Update document class
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme, mounted])

  // Handle system theme changes
  useEffect(() => {
    if (!mounted || theme !== "system") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = () => {
      const newTheme = mediaQuery.matches ? "dark" : "light"
      document.documentElement.classList.toggle("dark", mediaQuery.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, mounted])

  // Avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
