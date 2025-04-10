"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ExternalLink } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Calculator } from "./tools/calculator"
import { ProgrammerCalculator } from "./tools/programmer-calculator"
import { MarkdownGuide } from "./tools/markdown-guide"

// Define the card type
type ToolCard = {
  id: string
  title: { en: string; zh: string }
  route: string
  size: "small" | "medium" | "large"
  component?: React.ReactNode
  complexTool?: boolean // Flag for complex tools that shouldn't render directly
  description?: { en: string; zh: string }
  icon?: string
  isExternalLink?: boolean
}

interface CardGridProps {
  onToolSelect?: (route: string) => void
  showOnlyBookmarked?: boolean
}

// Define external links
const externalLinks: Record<string, boolean> = {
  "/api-tester": true,
  "/http-status-codes": true,
  "/cors-tester": true,
  "/ip-lookup": true,
  "/dns-lookup": true,
  "/ssl-checker": true,
}

export function CardGrid({ onToolSelect, showOnlyBookmarked = false }: CardGridProps) {
  const { t, getMenuText } = useLanguage()

  // Initial cards configuration with actual components
  const initialCards: ToolCard[] = [
    {
      id: "json-formatter",
      title: { en: "JSON Formatter", zh: "JSON格式化" },
      route: "/json-formatter",
      size: "medium",
      component: null,
      complexTool: true,
      description: { en: "Format, validate, and minify JSON data", zh: "格式化、验证和压缩 JSON 数据" },
      icon: "{}",
    },
    {
      id: "calculator",
      title: { en: "Scientific Calculator", zh: "科学计算器" },
      route: "/calculator",
      size: "small",
      component: <Calculator />,
      complexTool: false,
      description: { en: "A powerful calculator with scientific functions", zh: "强大的计算器，支持科学函数" },
      icon: "🧮",
    },
    {
      id: "programmer-calculator",
      title: { en: "Programmer Calculator", zh: "程序员计算器" },
      route: "/programmer-calculator",
      size: "medium",
      component: <ProgrammerCalculator />,
      complexTool: false,
      description: {
        en: "A calculator for developers with support for different number bases",
        zh: "支持不同进制的开发者计算器",
      },
      icon: "⚙️",
    },
    {
      id: "currency-converter",
      title: { en: "Currency Converter", zh: "货币换算" },
      route: "/currency-converter",
      size: "medium",
      component: null,
      complexTool: true,
      description: {
        en: "Convert between different currencies with live exchange rates",
        zh: "使用实时汇率在不同货币之间转换",
      },
      icon: "💱",
    },
    {
      id: "md5-generator",
      title: { en: "MD5 Generator", zh: "MD5生成器" },
      route: "/md5-generator",
      size: "medium",
      component: null,
      complexTool: true,
      description: { en: "Generate MD5 hashes from text or files", zh: "从文本或文件生成MD5哈希" },
      icon: "🔐",
    },
    {
      id: "sha-generator",
      title: { en: "SHA Generator", zh: "SHA生成器" },
      route: "/sha-generator",
      size: "medium",
      component: null,
      complexTool: true,
      description: { en: "Generate secure SHA hashes with different algorithms", zh: "使用不同算法生成安全的SHA哈希" },
      icon: "🔒",
    },
    {
      id: "aes-encrypt",
      title: { en: "AES Encryption", zh: "AES加密" },
      route: "/aes-encrypt",
      size: "large",
      component: null,
      complexTool: true,
      description: { en: "Encrypt and decrypt data using AES algorithm", zh: "使用AES算法加密和解密数据" },
      icon: "🔏",
    },
    {
      id: "markdown-editor",
      title: { en: "Markdown Editor", zh: "Markdown编辑器" },
      route: "/markdown-editor",
      size: "large",
      component: null,
      complexTool: true,
      description: { en: "Create and preview Markdown documents", zh: "创建和预览Markdown文档" },
      icon: "📝",
    },
    {
      id: "base-converter",
      title: { en: "Base Converter", zh: "进制转换" },
      route: "/base-converter",
      size: "medium",
      component: null,
      complexTool: true,
      description: { en: "Convert numbers between different numeral systems", zh: "在不同数字系统之间转换数字" },
      icon: "⟲",
    },
    {
      id: "markdown-guide",
      title: { en: "Markdown Guide", zh: "Markdown指南" },
      route: "/markdown-guide",
      size: "medium",
      component: <MarkdownGuide />,
      complexTool: false,
      description: { en: "Learn Markdown syntax with examples", zh: "通过示例学习Markdown语法" },
      icon: "📘",
    },
    {
      id: "translator",
      title: { en: "Translator", zh: "翻译工具" },
      route: "/translator",
      size: "medium",
      component: null,
      complexTool: true,
      description: { en: "Translate text between multiple languages", zh: "在多种语言之间翻译文本" },
      icon: "🌐",
    },
    {
      id: "productivity-tools",
      title: { en: "Productivity Tools", zh: "摸鱼工具" },
      route: "/productivity-tools",
      size: "large",
      component: null,
      complexTool: true,
      description: {
        en: "Productivity tools including Pomodoro timer and break reminders",
        zh: "生产力工具，包括番茄钟和休息提醒",
      },
      icon: "⏱️",
    },
    {
      id: "game-2048",
      title: { en: "2048 Game", zh: "2048游戏" },
      route: "/game-2048",
      size: "large",
      component: null,
      complexTool: true,
      description: { en: "Join the tiles, get to 2048!", zh: "合并方块，达到2048！" },
      icon: "🎮",
    },
    {
      id: "sudoku",
      title: { en: "Sudoku", zh: "数独" },
      route: "/sudoku",
      size: "large",
      component: null,
      complexTool: true,
      description: { en: "Fill the grid with numbers 1-9", zh: "用数字1-9填充网格" },
      icon: "🧩",
    },
    {
      id: "ai-tools",
      title: { en: "AI Tools", zh: "AI工具" },
      route: "/ai-tools",
      size: "large",
      component: null,
      complexTool: true,
      description: { en: "Collection of AI tools and websites for various tasks", zh: "各种任务的AI工具和网站集合" },
      icon: "🤖",
    },
    // External tools
    {
      id: "api-tester",
      title: { en: "API Tester", zh: "API测试器" },
      route: "/api-tester",
      size: "medium",
      component: null,
      complexTool: true,
      description: { en: "Test REST APIs with different HTTP methods", zh: "使用不同的HTTP方法测试REST API" },
      icon: "🧪",
      isExternalLink: true,
    },
    {
      id: "http-status-codes",
      title: { en: "HTTP Status Codes", zh: "HTTP状态码" },
      route: "/http-status-codes",
      size: "medium",
      component: null,
      complexTool: true,
      description: { en: "Reference for HTTP status codes and their meanings", zh: "HTTP状态码及其含义的参考" },
      icon: "📊",
      isExternalLink: true,
    },
    {
      id: "cors-tester",
      title: { en: "CORS Tester", zh: "CORS测试器" },
      route: "/cors-tester",
      size: "medium",
      component: null,
      complexTool: true,
      description: { en: "Test Cross-Origin Resource Sharing for your APIs", zh: "测试API的跨源资源共享" },
      icon: "🔄",
      isExternalLink: true,
    },
  ]

  const [cards, setCards] = useState<ToolCard[]>([])
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load saved card order from localStorage on component mount
  useEffect(() => {
    if (!isClient) return

    const savedLayout = localStorage.getItem("devToolkitLayout")
    if (savedLayout) {
      try {
        const savedCards = JSON.parse(savedLayout)
        // Ensure all required cards exist (in case we've added new ones since last save)
        const mergedCards = initialCards.map((card) => {
          const savedCard = savedCards.find((sc: any) => sc.id === card.id)
          return savedCard ? { ...card, size: savedCard.size } : card
        })
        setCards(mergedCards)
      } catch (e) {
        console.error("Error loading saved layout:", e)
        setCards(initialCards)
      }
    } else {
      setCards(initialCards)
    }
  }, [isClient])

  // Handle card click
  const handleCardClick = (route: string) => {
    if (onToolSelect) {
      // Track tool usage
      trackToolUsage(route)
      onToolSelect(route)
    }
  }

  // Track tool usage
  const trackToolUsage = (route: string) => {
    if (!isClient) return

    // Get current usage stats
    const usageStatsJson = localStorage.getItem("toolUsageStats") || "{}"
    const usageStats = JSON.parse(usageStatsJson)

    // Increment usage count
    const toolId = route.replace("/", "")
    usageStats[toolId] = (usageStats[toolId] || 0) + 1

    // Save updated stats
    localStorage.setItem("toolUsageStats", JSON.stringify(usageStats))
  }

  // If not client-side yet, return a loading placeholder
  if (!isClient) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="neumorphic-card rounded-xl bg-neutral-100 dark:bg-neutral-800 h-64 animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-100">{t("available.tools")}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.route)}
            className={`
            neumorphic-card rounded-xl bg-neutral-100 dark:bg-neutral-800 
            transition-all duration-300 cursor-pointer hover:translate-y-[-5px]
            col-span-1 w-full
            relative
          `}
          >
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center transition-colors duration-300">
              <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-100 flex items-center transition-colors duration-300">
                {getMenuText(card.title)}
              </h3>
              {card.isExternalLink && <ExternalLink size={16} className="text-neutral-500" />}
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <div className="text-4xl mb-4 flex items-center justify-center">{card.icon}</div>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  {getMenuText(card.description || { en: "", zh: "" })}
                </p>
                <button
                  className="mt-4 neumorphic-button px-4 py-2 rounded-lg text-sm flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCardClick(card.route)
                  }}
                >
                  {card.isExternalLink ? (t("language") === "zh" ? "访问网站" : "Visit Website") : t("app.open.tool")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
