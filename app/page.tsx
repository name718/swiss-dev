"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { menuConfig } from "@/config/menu-config"
import { CardGrid } from "@/components/card-grid"
import { QuickAccess } from "@/components/quick-access"
import { ToolDetailPage } from "@/components/tool-detail-page"
import { NotImplemented } from "@/components/not-implemented"
import { JsonFormatter } from "@/components/tools/json-formatter"
import { Calculator } from "@/components/tools/calculator"
import { ProgrammerCalculator } from "@/components/tools/programmer-calculator"
import { CurrencyConverter } from "@/components/tools/currency-converter"
import { MD5Generator } from "@/components/tools/md5-generator"
import { SHAGenerator } from "@/components/tools/sha-generator"
import { AESEncrypt } from "@/components/tools/aes-encrypt"
import { MarkdownEditor } from "@/components/tools/markdown-editor"
import { BaseConverter } from "@/components/tools/base-converter"
import { MarkdownGuide } from "@/components/tools/markdown-guide"
import { Translator } from "@/components/tools/translator"
import { ProductivityTools } from "@/components/tools/productivity-tools"
import { Game2048 } from "@/components/tools/game-2048"
import { Sudoku } from "@/components/tools/sudoku"
import { Minesweeper } from "@/components/tools/minesweeper"
import { useLanguage } from "@/contexts/language-context"
import { AIToolsPage } from "@/components/tools/ai-tools-page"
import { AIPlatform } from "@/components/tools/ai-platform"
import { Tetris } from "@/components/tools/tetris"
import { Pomodoro } from "@/components/tools/pomodoro"
import { BreathingExercise } from "@/components/tools/breathing-exercise"
import { WorkplaceComeback } from "@/components/tools/workplace-comeback"
import { SlackingDashboard } from "@/components/tools/slacking-dashboard"
import { RegexTester } from "@/components/tools/regex-tester"
import { ResignationReasonGenerator } from "@/components/tools/resignation-reason-generator"
import { ProcrastinationArena } from "@/components/tools/procrastination-arena"
import { CorporateTranslator } from "@/components/tools/corporate-translator"
import CodeEditor from "@/components/tools/code-editor"

// Define external links
const externalLinks: Record<string, string> = {
  "/api-tester": "https://reqbin.com/",
  "/http-status-codes": "https://httpstatuses.com/",
  "/cors-tester": "https://cors-test.codehappy.dev/",
  "/ip-lookup": "https://www.whatismyip.com/",
  "/dns-lookup": "https://dnschecker.org/",
  "/ssl-checker": "https://www.ssllabs.com/ssltest/",
}

// Define implemented tools
const implementedTools: string[] = [
  "/json-formatter",
  "/calculator",
  "/programmer-calculator",
  "/currency-converter",
  "/md5-generator",
  "/sha-generator",
  "/aes-encrypt",
  "/markdown-editor",
  "/base-converter",
  "/markdown-guide",
  "/translator",
  "/productivity-tools",
  "/game-2048",
  "/sudoku",
  "/minesweeper",
  "/tetris",
  "/ai-tools",
  "/ai-platform",
  "/pomodoro",
  "/breathing-exercise",
  "/workplace-comeback",
  "/slacking-dashboard",
  "/regex-tester",
  "/resignation-reason",
  "/procrastination-arena",
  "/corporate-translator",
  "/code-editor", // 添加新工具路由
]

// Main component
export default function Home() {
  const [isClient, setIsClient] = useState(false)
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { getMenuText } = useLanguage()

  useEffect(() => {
    setIsClient(true)

    // Load sidebar state from localStorage
    const savedSidebarState = localStorage.getItem("sidebarCollapsed")
    if (savedSidebarState) {
      setSidebarCollapsed(savedSidebarState === "true")
    }
  }, [])

  // Save sidebar state when it changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("sidebarCollapsed", String(sidebarCollapsed))
    }
  }, [sidebarCollapsed, isClient])

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  // Track tool usage when a tool is selected
  const handleToolSelect = (route: string | null) => {
    // Check if it's an external link
    if (route && externalLinks[route]) {
      window.open(externalLinks[route], "_blank", "noopener,noreferrer")
      return
    }

    setActiveTool(route)

    if (route && isClient) {
      // Get current usage stats
      const usageStatsJson = localStorage.getItem("toolUsageStats") || "{}"
      const usageStats = JSON.parse(usageStatsJson)

      // Increment usage count
      const toolId = route.replace("/", "")
      usageStats[toolId] = (usageStats[toolId] || 0) + 1

      // Save updated stats
      localStorage.setItem("toolUsageStats", JSON.stringify(usageStats))
    }
  }

  // Map of tool routes to their components
  const toolComponents: Record<string, React.ReactNode> = {
    "/json-formatter": <JsonFormatter />,
    "/calculator": <Calculator />,
    "/programmer-calculator": <ProgrammerCalculator />,
    "/currency-converter": <CurrencyConverter />,
    "/md5-generator": <MD5Generator />,
    "/sha-generator": <SHAGenerator />,
    "/aes-encrypt": <AESEncrypt />,
    "/markdown-editor": <MarkdownEditor />,
    "/base-converter": <BaseConverter />,
    "/markdown-guide": <MarkdownGuide />,
    "/translator": <Translator />,
    "/productivity-tools": <ProductivityTools />,
    "/game-2048": <Game2048 />,
    "/sudoku": <Sudoku />,
    "/minesweeper": <Minesweeper />,
    "/tetris": <Tetris />,
    "/ai-tools": <AIToolsPage />,
    "/ai-platform": <AIPlatform />,
    "/pomodoro": <Pomodoro />,
    "/breathing-exercise": <BreathingExercise />,
    "/workplace-comeback": <WorkplaceComeback />,
    "/slacking-dashboard": <SlackingDashboard />,
    "/regex-tester": <RegexTester />,
    "/resignation-reason": <ResignationReasonGenerator />,
    "/procrastination-arena": <ProcrastinationArena />,
    "/corporate-translator": <CorporateTranslator />,
    "/code-editor": <CodeEditor />, // 添加新组件
  }

  // Function to render the active tool
  const renderActiveTool = () => {
    if (!activeTool) return null

    // Check if it's an implemented tool
    const isImplemented = implementedTools.includes(activeTool)

    return (
      <ToolDetailPage
        title={getToolName(activeTool)}
        description={getToolDescription(activeTool)}
        onBack={() => setActiveTool(null)}
        isExternalLink={!!externalLinks[activeTool]}
        externalUrl={externalLinks[activeTool]}
      >
        {isImplemented ? toolComponents[activeTool] : <NotImplemented toolName={getToolName(activeTool)} />}
      </ToolDetailPage>
    )
  }

  // Get the tool name from its route
  const getToolName = (route: string): string => {
    // Find the tool in the menu config
    for (const category of menuConfig.mainMenu) {
      if (category.route === route) {
        return getMenuText(category.category)
      }

      // Check if the category has direct tools
      if (category.tools) {
        for (const tool of category.tools) {
          if (tool.route === route) {
            return getMenuText(tool.name)
          }
        }
      }

      // Check subItems
      for (const subItem of category.subItems) {
        for (const tool of subItem.tools) {
          if (tool.route === route) {
            return getMenuText(tool.name)
          }
        }
      }
    }

    // Check quick access
    for (const item of menuConfig.quickAccess) {
      if (item.route === route) {
        return getMenuText(item.name)
      }
    }

    // Default name if not found
    return route
      .replace("/", "")
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Get the tool description from its route
  const getToolDescription = (route: string): string => {
    // Find the tool in the menu config to get its description
    for (const category of menuConfig.mainMenu) {
      // Check if the category has direct tools
      if (category.tools) {
        for (const tool of category.tools) {
          if (tool.route === route && tool.description) {
            return getMenuText(tool.description)
          }
        }
      }

      // Check subItems
      for (const subItem of category.subItems) {
        for (const tool of subItem.tools) {
          if (tool.route === route && tool.description) {
            return getMenuText(tool.description)
          }
        }
      }
    }

    // Default descriptions for common tools
    switch (route) {
      case "/calculator":
        return getMenuText({ en: "A powerful calculator with scientific functions", zh: "强大的计算器，支持科学函数" })
      case "/programmer-calculator":
        return getMenuText({
          en: "A calculator for developers with support for different number bases",
          zh: "支持不同进制的开发者计算器",
        })
      case "/json-formatter":
        return getMenuText({ en: "Format, validate, and minify JSON data", zh: "格式化、验证和压缩 JSON 数据" })
      case "/markdown-editor":
        return getMenuText({ en: "Create and preview Markdown documents", zh: "创建和预览 Markdown 文档" })
      case "/base-converter":
        return getMenuText({
          en: "Convert numbers between different numeral systems",
          zh: "在不同数字系统之间转换数字",
        })
      case "/game-2048":
        return getMenuText({ en: "Join the tiles, get to 2048!", zh: "合并方块，达到 2048！" })
      case "/sudoku":
        return getMenuText({ en: "Fill the grid with numbers 1-9", zh: "用数字 1-9 填充网格" })
      case "/minesweeper":
        return getMenuText({ en: "Find all mines without stepping on any!", zh: "找出所有地雷，小心不要踩到它们！" })
      case "/ai-tools":
        return getMenuText({
          en: "Collection of AI tools and websites for various tasks",
          zh: "各种任务的 AI 工具和网站集合",
        })
      case "/ai-platform":
        return getMenuText({
          en: "Directory of popular AI websites and platforms",
          zh: "流行AI网站和平台目录",
        })
      case "/tetris":
        return getMenuText({
          en: "The classic Tetris game",
          zh: "经典俄罗斯方块游戏",
        })
      case "/pomodoro":
        return getMenuText({
          en: "Focus on work with timed breaks",
          zh: "专注工作，定时休息",
        })
      case "/breathing-exercise":
        return getMenuText({
          en: "Reduce stress and anxiety with guided breathing",
          zh: "通过引导呼吸减轻压力和焦虑",
        })
      case "/workplace-comeback":
        return getMenuText({
          en: "Generate smart responses to difficult workplace situations",
          zh: "生成应对职场刁难的高情商回复",
        })
      case "/slacking-dashboard":
        return getMenuText({
          en: "Track your work week progress and countdown to freedom",
          zh: "追踪工作周进度和下班倒计时",
        })
      case "/regex-tester":
        return getMenuText({
          en: "Test, debug and validate regular expressions with syntax highlighting",
          zh: "测试、调试和验证正则表达式，支持高亮显示匹配结果",
        })
      case "/resignation-reason":
        return getMenuText({
          en: "Transform your real resignation reasons into professional, dignified expressions",
          zh: "将真实离职原因转化为专业、体面的表述，优雅告别职场",
        })
      case "/procrastination-arena":
        return getMenuText({
          en: "Transform your tasks into monsters and defeat them by focusing on your work",
          zh: "将任务转化为怪物，通过专注工作来击败它们，拖延越久怪物越强大",
        })
      case "/corporate-translator":
        return getMenuText({
          en: "Translate corporate jargon to plain language and vice versa",
          zh: "将职场黑话转换为普通人话，或将普通人话包装成华丽的职场黑话",
        })
      case "/code-editor":
        return getMenuText({
          en: "A powerful code editor with syntax highlighting and multiple language support",
          zh: "强大的代码编辑器，支持语法高亮和多种编程语言",
        })
      default:
        return ""
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-100 dark:bg-neutral-900 transition-colors duration-300">
      {/* Header - fixed at the top */}
      <Header toggleSidebar={toggleSidebar} onToolSelect={handleToolSelect} />

      {/* Main content area - takes up available space */}
      <div className="flex flex-1">
        {/* Sidebar - fixed position */}
        <Sidebar onToolSelect={handleToolSelect} isCollapsed={sidebarCollapsed} toggleCollapsed={toggleSidebar} />

        {/* Main content - adjusts based on sidebar state */}
        <main
          className={`flex-1 p-4 md:p-6 mt-[120px] transition-all duration-300 ${sidebarCollapsed ? "md:ml-20" : "md:ml-72"}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-16">
            {/* Main content area - takes up 3/4 of the space */}
            <div className="lg:col-span-3">
              {isClient ? (
                activeTool ? (
                  renderActiveTool()
                ) : (
                  <HomeContent onToolSelect={handleToolSelect} />
                )
              ) : (
                <div className="animate-pulse w-full">
                  <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-1/3 mb-6"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className="rounded-xl bg-neutral-200 dark:bg-neutral-800 h-64" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right sidebar - takes up 1/4 of the space */}
            <div className="hidden lg:block bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl">
              <RightSidebar />
            </div>
          </div>
        </main>
      </div>

      {/* Footer - at the bottom */}
      <Footer />
    </div>
  )
}

// 在 HomeContent 组件中添加一个突出显示的按钮

function HomeContent({ onToolSelect }: { onToolSelect: (route: string) => void }) {
  const { t, getMenuText } = useLanguage()
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6 text-neutral-800 dark:text-neutral-100">
        {getMenuText(menuConfig.siteName)} - {t("app.tagline")}
      </h2>

      {/* 新工具通知 - 代码编辑器 */}
      <div className="mb-8 neumorphic-card p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
              新功能：代码编辑器 - 支持多种编程语言
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              强大的代码编辑器，支持语法高亮、代码格式化和多种编程语言
            </p>
          </div>
          <button
            onClick={() => onToolSelect("/code-editor")}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg text-white font-medium hover:from-green-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-green-500/20"
          >
            立即体验
          </button>
        </div>
      </div>

      {/* Quick Access Section */}
      <div className="mb-8 neumorphic-card p-4 rounded-xl">
        <QuickAccess onToolSelect={onToolSelect} />
      </div>

      {/* All Tools */}
      <CardGrid onToolSelect={onToolSelect} />
    </div>
  )
}

function RightSidebar() {
  const { t } = useLanguage()

  return (
    <>
      <h3 className="text-lg font-medium mb-2 text-neutral-800 dark:text-neutral-100">{t("app.future.content")}</h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">{t("app.future.description")}</p>
    </>
  )
}
