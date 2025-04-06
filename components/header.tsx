"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Github, MoonIcon, SunIcon, User, Search } from "lucide-react"
import { useTheme } from "next-themes"
import { DigitalClock } from "./digital-clock"
import { menuConfig } from "@/config/menu-config"

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn)
  }

  const toggleSearch = () => {
    setShowSearch(!showSearch)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would perform a search
    console.log("Searching for:", searchQuery)
  }

  return (
    <header className="sticky top-0 z-50 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <DigitalClock />
          <h1 className="ml-3 text-xl font-semibold text-neutral-800 dark:text-neutral-100 hidden sm:block">
            {menuConfig.siteName}
          </h1>
        </div>

        <div className="flex-1 max-w-xl mx-4 hidden md:block">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="搜索工具..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 pl-10 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600 transition-all duration-300"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
          </form>
        </div>

        <div className="flex items-center space-x-4 fixed top-3 right-4 md:relative md:top-0 md:right-0 z-50">
          <button
            onClick={toggleSearch}
            className="neumorphic-button p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all duration-300 md:hidden"
            aria-label="Search"
            data-tooltip="Search"
          >
            <Search size={20} />
          </button>

          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="neumorphic-button p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all duration-300"
            aria-label="GitHub Integration"
            data-tooltip="Connect with GitHub"
          >
            <Github size={20} />
          </Link>

          <button
            onClick={toggleTheme}
            className="neumorphic-button p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all duration-300"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            data-tooltip={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? <SunIcon size={20} /> : <MoonIcon size={20} />}
          </button>

          <button
            onClick={toggleLogin}
            className="neumorphic-button px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all duration-300 flex items-center gap-2"
            data-tooltip={isLoggedIn ? "Sign out of your account" : "Sign in to your account"}
          >
            <User size={18} />
            <span>{isLoggedIn ? "Log Out" : "Log In"}</span>
          </button>
        </div>
      </div>

      {/* Mobile search overlay */}
      {showSearch && (
        <div className="md:hidden p-4 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 transition-all duration-300">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="搜索工具..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 pl-10 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600 transition-all duration-300"
              autoFocus
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
          </form>
        </div>
      )}
    </header>
  )
}

