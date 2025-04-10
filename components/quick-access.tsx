"use client"

import { useState, useEffect } from "react"
import { BarChart2, ExternalLink } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

type QuickAccessTool = {
  id: string
  name: string
  route: string
  icon: string
  usageCount: number
  isExternalLink?: boolean
}

interface QuickAccessProps {
  onToolSelect: (route: string) => void
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

export function QuickAccess({ onToolSelect }: QuickAccessProps) {
  const { t, language } = useLanguage()
  const [quickAccessTools, setQuickAccessTools] = useState<QuickAccessTool[]>([])
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load most used tools
  useEffect(() => {
    if (!isClient) return

    // Load usage stats
    const usageStatsJson = localStorage.getItem("toolUsageStats")
    if (!usageStatsJson) return

    try {
      const usageStats = JSON.parse(usageStatsJson)

      // Create tools array from usage stats
      const tools: QuickAccessTool[] = Object.entries(usageStats)
        .map(([id, count]) => {
          // Format the name from the ID
          const name = id
            .replace(/-/g, " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")

          const route = `/${id}`

          return {
            id,
            name,
            route,
            icon: getIconForTool(id),
            usageCount: count as number,
            isExternalLink: externalLinks[route],
          }
        })
        // Sort by usage count (descending)
        .sort((a, b) => b.usageCount - a.usageCount)
        // Take top 6
        .slice(0, 6)

      setQuickAccessTools(tools)
    } catch (e) {
      console.error("Error loading usage stats:", e)
    }
  }, [isClient])

  // Get icon for tool
  const getIconForTool = (id: string): string => {
    const iconMap: Record<string, string> = {
      calculator: "🧮",
      "json-formatter": "{}",
      "markdown-editor": "📝",
      "base-converter": "⟲",
      "game-2048": "🎮",
      "ai-tools": "🤖",
      "programmer-calculator": "⚙️",
      "currency-converter": "💱",
      "md5-generator": "🔐",
      "sha-generator": "🔒",
      "aes-encrypt": "🔏",
      "markdown-guide": "📘",
      translator: "🌐",
      "productivity-tools": "⏱️",
      sudoku: "🧩",
      "api-tester": "🧪",
      "http-status-codes": "📊",
      "cors-tester": "🔄",
      "ip-lookup": "🔍",
      "dns-lookup": "🌐",
      "ssl-checker": "🔒",
    }

    return iconMap[id] || "🔧"
  }

  // Handle tool click
  const handleToolClick = (route: string) => {
    onToolSelect(route)

    // Update usage stats
    const toolId = route.replace("/", "")
    const usageStatsJson = localStorage.getItem("toolUsageStats") || "{}"
    const usageStats = JSON.parse(usageStatsJson)
    usageStats[toolId] = (usageStats[toolId] || 0) + 1
    localStorage.setItem("toolUsageStats", JSON.stringify(usageStats))
  }

  if (!isClient) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 mb-3"></div>
        <div className="grid grid-cols-3 gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (quickAccessTools.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          {language === "zh"
            ? "开始使用工具，这里将显示您最常用的工具"
            : "Start using tools to see your most frequently used ones here"}
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-3 flex items-center">
        <BarChart2 size={16} className="mr-2" />
        {language === "zh" ? "最常用工具" : "Most Used Tools"}
      </h3>

      <div className="grid grid-cols-3 gap-2">
        {quickAccessTools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => handleToolClick(tool.route)}
            className="neumorphic-button flex flex-col items-center justify-center p-2 rounded-lg text-center transition-all duration-300 relative cursor-pointer hover:translate-y-[-5px]"
          >
            {tool.isExternalLink && (
              <div className="absolute top-1 right-1 text-neutral-400">
                <ExternalLink size={12} />
              </div>
            )}
            <span className="text-xl mb-1">{tool.icon}</span>
            <span className="text-xs">{tool.name}</span>
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1">
              {language === "zh" ? `使用 ${tool.usageCount} 次` : `Used ${tool.usageCount} times`}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
