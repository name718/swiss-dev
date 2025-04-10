"use client"

import type React from "react"
import { ArrowLeft, Share2, ExternalLink, Maximize, Minimize } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useState } from "react"

interface ToolDetailPageProps {
  title: string
  description: string
  children: React.ReactNode
  onBack?: () => void
  isExternalLink?: boolean
  externalUrl?: string
}

export function ToolDetailPage({
  title,
  description,
  children,
  onBack,
  isExternalLink = false,
  externalUrl = "",
}: ToolDetailPageProps) {
  const { language } = useLanguage()
  // 添加全屏状态管理
  const [isFullscreen, setIsFullscreen] = useState(false)

  // 添加切换全屏的函数
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const shareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert(language === "zh" ? "链接已复制到剪贴板！" : "Link copied to clipboard!")
    }
  }

  const openExternalLink = () => {
    if (externalUrl) {
      window.open(externalUrl, "_blank", "noopener,noreferrer")
    }
  }

  // 修改返回的 JSX，添加全屏样式和按钮
  return (
    <div
      className={`transition-all duration-300 ${isFullscreen ? "fixed inset-0 z-50 p-4 bg-neutral-50 dark:bg-neutral-900 overflow-auto" : "max-w-6xl mx-auto"}`}
    >
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          {onBack && (
            <button
              onClick={onBack}
              className="neumorphic-icon-button p-2 rounded-lg mr-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
              aria-label={language === "zh" ? "返回" : "Back"}
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">{title}</h1>
            <p className="text-neutral-600 dark:text-neutral-400">{description}</p>
          </div>
        </div>

        <div className="flex space-x-2">
          {/* 添加全屏切换按钮 */}
          <button
            onClick={toggleFullscreen}
            className="neumorphic-button p-2 rounded-lg flex items-center gap-2 text-neutral-600 dark:text-neutral-400"
            aria-label={
              isFullscreen
                ? language === "zh"
                  ? "退出全屏"
                  : "Exit Fullscreen"
                : language === "zh"
                  ? "全屏模式"
                  : "Fullscreen"
            }
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            <span className="hidden sm:inline">
              {isFullscreen
                ? language === "zh"
                  ? "退出全屏"
                  : "Exit Fullscreen"
                : language === "zh"
                  ? "全屏模式"
                  : "Fullscreen"}
            </span>
          </button>

          {isExternalLink && externalUrl ? (
            <button
              onClick={openExternalLink}
              className="neumorphic-button p-2 rounded-lg flex items-center gap-2 text-neutral-600 dark:text-neutral-400"
            >
              <ExternalLink size={18} />
              <span>{language === "zh" ? "访问网站" : "Visit Website"}</span>
            </button>
          ) : (
            <button
              onClick={shareLink}
              className="neumorphic-button p-2 rounded-lg flex items-center gap-2 text-neutral-600 dark:text-neutral-400"
            >
              <Share2 size={18} />
              <span>{language === "zh" ? "分享" : "Share"}</span>
            </button>
          )}
        </div>
      </div>

      <div
        className={`neumorphic-card p-6 rounded-xl bg-neutral-100 dark:bg-neutral-800 ${isFullscreen ? "h-[calc(100%-5rem)]" : ""}`}
      >
        <div className={`${isFullscreen ? "h-full overflow-auto" : ""}`}>{children}</div>
      </div>
    </div>
  )
}
