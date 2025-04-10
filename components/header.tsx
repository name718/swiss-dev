"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Github, MoonIcon, SunIcon, User, Search, Globe, Menu, Settings, X } from "lucide-react"
import { useTheme } from "@/components/theme-context"
import { DigitalClock } from "./digital-clock"
import { useLanguage } from "@/contexts/language-context"
import { SettingsModal } from "./settings-modal"
import { SearchResults } from "./search-results"
import { LoginModal } from "./login-modal"

interface HeaderProps {
  toggleSidebar?: () => void
  onToolSelect?: (route: string) => void
}

export function Header({ toggleSidebar, onToolSelect }: HeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showClock, setShowClock] = useState(true)
  const { theme, setTheme } = useTheme()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Use the language context
  const { language, setLanguage, t } = useLanguage()

  // 从 localStorage 加载设置
  useEffect(() => {
    const savedShowClock = localStorage.getItem("showClock")
    if (savedShowClock !== null) {
      setShowClock(savedShowClock === "true")
    }

    // 检查登录状态
    const savedLoginState = localStorage.getItem("isLoggedIn")
    if (savedLoginState === "true") {
      setIsLoggedIn(true)
    }

    // 监听设置变更事件
    const handleSettingsChanged = (e: CustomEvent) => {
      if (e.detail && e.detail.showClock !== undefined) {
        setShowClock(e.detail.showClock)
      }
    }

    window.addEventListener("settingsChanged", handleSettingsChanged as EventListener)
    return () => {
      window.removeEventListener("settingsChanged", handleSettingsChanged as EventListener)
    }
  }, [])

  // 处理点击外部关闭搜索结果
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        showSearchResults
      ) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showSearchResults])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const toggleLogin = () => {
    if (isLoggedIn) {
      // 登出
      setIsLoggedIn(false)
      localStorage.removeItem("isLoggedIn")
    } else {
      // 显示登录模态框
      setShowLoginModal(true)
    }
  }

  const handleLogin = (email: string, password: string, remember: boolean) => {
    console.log("Login attempt:", { email, password, remember })
    // 在实际应用中，这里会进行身份验证
    // 模拟成功登录
    setIsLoggedIn(true)
    setShowLoginModal(false)

    // 如果选择了"记住我"，则保存登录状态
    if (remember) {
      localStorage.setItem("isLoggedIn", "true")
    }
  }

  const toggleSearch = () => {
    setShowSearch(!showSearch)
    if (!showSearch) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }

  const toggleLanguage = () => {
    setLanguage(language === "zh" ? "en" : "zh")
  }

  const openSettings = () => {
    setShowSettings(true)
  }

  const closeSettings = () => {
    setShowSettings(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // 在实际应用中，这里会执行搜索
    console.log("Searching for:", searchQuery)
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    setShowSearchResults(query.trim().length > 0)
  }

  const handleSearchInputFocus = () => {
    if (searchQuery.trim().length > 0) {
      setShowSearchResults(true)
    }
  }

  const handleToolSelect = (route: string) => {
    if (onToolSelect) {
      onToolSelect(route)
    }
    setSearchQuery("")
    setShowSearchResults(false)
    setShowSearch(false)
  }

  const clearSearch = () => {
    setSearchQuery("")
    searchInputRef.current?.focus()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          {toggleSidebar && (
            <button
              onClick={toggleSidebar}
              className="mr-3 neumorphic-button p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>
          )}
          {showClock && <DigitalClock />}
          <h1 className="ml-3 text-xl font-semibold text-neutral-800 dark:text-neutral-100 hidden sm:block">
            {language === "zh" ? "开发工具集" : "DevTools Hub"}
          </h1>
        </div>

        <div className="flex-1 max-w-xl mx-4 hidden md:block" ref={searchContainerRef}>
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder={language === "zh" ? "搜索工具..." : "Search tools..."}
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={handleSearchInputFocus}
              ref={searchInputRef}
              className="w-full py-2 px-4 pl-10 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600 transition-all duration-300"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X size={18} />
              </button>
            )}

            <SearchResults
              query={searchQuery}
              onSelect={handleToolSelect}
              onClose={() => setShowSearchResults(false)}
              isVisible={showSearchResults}
            />
          </form>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSearch}
            className="neumorphic-button p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all duration-300 md:hidden"
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          <button
            onClick={toggleLanguage}
            className="neumorphic-button p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all duration-300"
            aria-label={language === "zh" ? "Switch to English" : "切换到中文"}
          >
            <Globe size={20} />
          </button>

          <Link
            href="https://github.com/name718"
            target="_blank"
            rel="noopener noreferrer"
            className="neumorphic-button p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all duration-300"
            aria-label={language === "zh" ? "GitHub" : "GitHub"}
          >
            <Github size={20} />
          </Link>

          <button
            onClick={toggleTheme}
            className="neumorphic-button p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all duration-300"
            aria-label={
              theme === "dark"
                ? language === "zh"
                  ? "切换到亮色模式"
                  : "Switch to light mode"
                : language === "zh"
                  ? "切换到暗色模式"
                  : "Switch to dark mode"
            }
          >
            {theme === "dark" ? <SunIcon size={20} /> : <MoonIcon size={20} />}
          </button>

          <button
            onClick={toggleLogin}
            className={`neumorphic-button px-4 py-2 rounded-lg ${
              isLoggedIn ? "bg-green-50 dark:bg-green-900/20" : "bg-white dark:bg-neutral-800"
            } text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all duration-300 flex items-center gap-2`}
          >
            <User size={18} className={isLoggedIn ? "text-green-500" : ""} />
            <span className="hidden sm:inline">
              {isLoggedIn ? (language === "zh" ? "退出登录" : "Logout") : language === "zh" ? "登录" : "Login"}
            </span>
          </button>

          <button
            onClick={openSettings}
            className="neumorphic-button p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all duration-300"
            aria-label={language === "zh" ? "设置" : "Settings"}
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Mobile search overlay */}
      {showSearch && (
        <div
          className="md:hidden p-4 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 transition-all duration-300"
          ref={searchContainerRef}
        >
          <div className="relative">
            <input
              type="text"
              placeholder={language === "zh" ? "搜索工具..." : "Search tools..."}
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={handleSearchInputFocus}
              ref={searchInputRef}
              className="w-full py-2 px-4 pl-10 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600 transition-all duration-300"
              autoFocus
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X size={18} />
              </button>
            )}

            <SearchResults
              query={searchQuery}
              onSelect={handleToolSelect}
              onClose={() => setShowSearchResults(false)}
              isVisible={showSearchResults}
            />
          </div>
        </div>
      )}

      {/* 设置模态框 */}
      <SettingsModal isOpen={showSettings} onClose={closeSettings} />

      {/* 登录模态框 */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />
    </header>
  )
}
