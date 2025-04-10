"use client"

import { useState, useEffect } from "react"
import { X, Moon, Sun, Globe, Volume2, VolumeX, Clock, LayoutGrid } from "lucide-react"
import { useTheme } from "./theme-context"
import { useLanguage } from "@/contexts/language-context"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showClock, setShowClock] = useState(true)
  const [compactMode, setCompactMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  // 初始化设置
  useEffect(() => {
    setMounted(true)

    // 从 localStorage 加载设置
    const savedSound = localStorage.getItem("soundEnabled")
    const savedShowClock = localStorage.getItem("showClock")
    const savedCompactMode = localStorage.getItem("compactMode")

    if (savedSound !== null) setSoundEnabled(savedSound === "true")
    if (savedShowClock !== null) setShowClock(savedShowClock === "true")
    if (savedCompactMode !== null) setCompactMode(savedCompactMode === "true")
  }, [])

  // 保存设置到 localStorage
  useEffect(() => {
    if (!mounted) return

    localStorage.setItem("soundEnabled", String(soundEnabled))
    localStorage.setItem("showClock", String(showClock))
    localStorage.setItem("compactMode", String(compactMode))

    // 发布设置变更事件，让其他组件可以响应
    const event = new CustomEvent("settingsChanged", {
      detail: { soundEnabled, showClock, compactMode },
    })
    window.dispatchEvent(event)
  }, [soundEnabled, showClock, compactMode, mounted])

  // 切换主题
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // 切换语言
  const toggleLanguage = () => {
    setLanguage(language === "zh" ? "en" : "zh")
  }

  // 切换声音
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
  }

  // 切换时钟显示
  const toggleClock = () => {
    setShowClock(!showClock)
  }

  // 切换紧凑模式
  const toggleCompactMode = () => {
    setCompactMode(!compactMode)
  }

  // 重置所有设置
  const resetSettings = () => {
    setTheme("system")
    setSoundEnabled(true)
    setShowClock(true)
    setCompactMode(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800 shadow-xl neumorphic-card">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          aria-label="Close settings"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-neutral-100">
          {language === "zh" ? "设置" : "Settings"}
        </h2>

        <div className="space-y-6">
          {/* 外观设置 */}
          <div>
            <h3 className="text-lg font-medium mb-3 text-neutral-700 dark:text-neutral-200">
              {language === "zh" ? "外观" : "Appearance"}
            </h3>
            <div className="space-y-4">
              {/* 主题切换 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {theme === "dark" ? (
                    <Moon size={20} className="text-blue-400" />
                  ) : (
                    <Sun size={20} className="text-yellow-500" />
                  )}
                  <span className="text-neutral-700 dark:text-neutral-200">
                    {language === "zh" ? "主题模式" : "Theme Mode"}
                  </span>
                </div>
                <button onClick={toggleTheme} className="px-4 py-2 rounded-lg neumorphic-button text-sm font-medium">
                  {theme === "dark"
                    ? language === "zh"
                      ? "切换到亮色"
                      : "Switch to Light"
                    : language === "zh"
                      ? "切换到暗色"
                      : "Switch to Dark"}
                </button>
              </div>

              {/* 紧凑模式 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LayoutGrid size={20} className="text-purple-500" />
                  <span className="text-neutral-700 dark:text-neutral-200">
                    {language === "zh" ? "紧凑模式" : "Compact Mode"}
                  </span>
                </div>
                <button
                  onClick={toggleCompactMode}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    compactMode ? "bg-green-500" : "bg-neutral-300 dark:bg-neutral-600"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      compactMode ? "transform translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>

              {/* 时钟显示 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-green-500" />
                  <span className="text-neutral-700 dark:text-neutral-200">
                    {language === "zh" ? "显示时钟" : "Show Clock"}
                  </span>
                </div>
                <button
                  onClick={toggleClock}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    showClock ? "bg-green-500" : "bg-neutral-300 dark:bg-neutral-600"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      showClock ? "transform translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 语言和声音设置 */}
          <div>
            <h3 className="text-lg font-medium mb-3 text-neutral-700 dark:text-neutral-200">
              {language === "zh" ? "语言和声音" : "Language & Sound"}
            </h3>
            <div className="space-y-4">
              {/* 语言切换 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-blue-500" />
                  <span className="text-neutral-700 dark:text-neutral-200">
                    {language === "zh" ? "界面语言" : "Interface Language"}
                  </span>
                </div>
                <button onClick={toggleLanguage} className="px-4 py-2 rounded-lg neumorphic-button text-sm font-medium">
                  {language === "zh" ? "Switch to English" : "切换到中文"}
                </button>
              </div>

              {/* 声音开关 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {soundEnabled ? (
                    <Volume2 size={20} className="text-green-500" />
                  ) : (
                    <VolumeX size={20} className="text-red-500" />
                  )}
                  <span className="text-neutral-700 dark:text-neutral-200">
                    {language === "zh" ? "系统声音" : "System Sound"}
                  </span>
                </div>
                <button
                  onClick={toggleSound}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    soundEnabled ? "bg-green-500" : "bg-neutral-300 dark:bg-neutral-600"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      soundEnabled ? "transform translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 重置按钮 */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <button
              onClick={resetSettings}
              className="w-full py-2 rounded-lg neumorphic-button-danger text-sm font-medium"
            >
              {language === "zh" ? "重置所有设置" : "Reset All Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
