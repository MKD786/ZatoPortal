"use client"

import { type ReactNode, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setTheme } from "../../features/theme/theme.slice"
import type { RootState } from "../../store"

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const dispatch = useDispatch()
  const { theme } = useSelector((state: RootState) => state.theme)

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      dispatch(setTheme(savedTheme as "light" | "dark"))
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      dispatch(setTheme(prefersDark ? "dark" : "light"))
    }
  }, [dispatch])

  // Apply theme class to document
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("theme", theme)
  }, [theme])

  return <>{children}</>
}
