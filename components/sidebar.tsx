"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Home,
  ChevronRight,
  Menu,
  X,
  Calculator,
  Code,
  FileText,
  Globe,
  PenToolIcon as Tool,
  Bot,
  ChevronLeft,
  Briefcase,
} from "lucide-react"
import { menuConfig } from "@/config/menu-config"
import { useLanguage } from "@/contexts/language-context"
import { QuickAccess } from "./quick-access"

// Map category names to icons
const categoryIcons: Record<string, React.ReactNode> = {
  "Code Tools": <Code size={20} />,
  代码工具: <Code size={20} />,
  "Dev Utilities": <Tool size={20} />,
  开发实用工具: <Tool size={20} />,
  "Text & Docs": <FileText size={20} />,
  文本和文档: <FileText size={20} />,
  "AI Assistants": <Bot size={20} />,
  AI助手: <Bot size={20} />,
  "Break Time": <Calculator size={20} />,
  摸鱼时间: <Calculator size={20} />,
  Productivity: <Tool size={20} />,
  生产力工具: <Tool size={20} />,
  "Network Tools": <Globe size={20} />,
  网络工具: <Globe size={20} />,
  "Workplace Tools": <Briefcase size={20} />,
  职场工具: <Briefcase size={20} />,
}

interface SidebarProps {
  onToolSelect?: (tool: string | null) => void
  isCollapsed?: boolean
  toggleCollapsed?: () => void
}

export function Sidebar({ onToolSelect, isCollapsed = false, toggleCollapsed }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null)
  const [activeTool, setActiveTool] = useState<string>("/dashboard")
  const [isClient, setIsClient] = useState(false)
  const { t, language, getMenuText } = useLanguage()

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true)
  }, [])

  // 修改 useEffect 钩子，在路由变化时自动展开对应的菜单目录
  useEffect(() => {
    setIsClient(true)

    // 如果有活动工具，自动展开对应的菜单目录
    if (activeTool && activeTool !== "/dashboard") {
      // 查找工具所在的类别和子类别
      menuConfig.mainMenu.forEach((category) => {
        // 检查直接工具
        if (category.tools) {
          const foundTool = category.tools.find((tool) => tool.route === activeTool)
          if (foundTool) {
            setActiveCategory(getMenuText(category.category))
          }
        }

        // 检查子类别中的工具
        if (category.subItems) {
          category.subItems.forEach((subItem) => {
            const foundTool = subItem.tools.find((tool) => tool.route === activeTool)
            if (foundTool) {
              setActiveCategory(getMenuText(category.category))
              setActiveSubCategory(getMenuText(subItem.name))
            }
          })
        }
      })
    }
  }, [activeTool, getMenuText])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  // Update the handleCategoryClick function to handle categories with direct routes
  const handleCategoryClick = (category: any) => {
    const categoryName = getMenuText(category.category)

    // If category has a direct route, navigate to it
    if (category.route) {
      setActiveTool(category.route)
      if (onToolSelect) {
        onToolSelect(category.route)
        // Track tool usage
        trackToolUsage(category.route)
      }
      if (window.innerWidth < 768) {
        setIsOpen(false)
      }
      return
    }

    // Otherwise toggle the dropdown
    setActiveCategory(activeCategory === categoryName ? null : categoryName)
    // Close any open subcategory if we're closing this category
    if (activeCategory === categoryName) {
      setActiveSubCategory(null)
    }
  }

  const handleSubCategoryClick = (subCategory: any) => {
    const subCategoryName = getMenuText(subCategory.name)
    setActiveSubCategory(activeSubCategory === subCategoryName ? null : subCategoryName)
  }

  const handleToolClick = (route: string) => {
    setActiveTool(route)
    if (onToolSelect) {
      onToolSelect(route)
      // Track tool usage
      trackToolUsage(route)
    }
    if (window.innerWidth < 768) {
      setIsOpen(false)
    }
  }

  const handleHomeClick = () => {
    setActiveTool("/dashboard")
    if (onToolSelect) {
      onToolSelect(null)
    }
    if (window.innerWidth < 768) {
      setIsOpen(false)
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
      <div className="fixed md:fixed z-10 w-72 h-[calc(100vh-4rem)] bg-neutral-100 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="animate-pulse p-4">
          <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded-lg mb-4"></div>
          <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-lg mb-4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed bottom-4 right-4 z-20 md:hidden neumorphic-button p-3 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 fixed z-10 
          ${isCollapsed ? "w-20" : "w-72"} 
          top-[120px] bottom-auto transition-all duration-300 ease-in-out 
          bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-200 
          dark:border-neutral-800 overflow-auto flex flex-col
          max-h-[calc(100vh-180px)]
        `}
      >
        {/* Collapse/Expand button */}
        {toggleCollapsed && (
          <button
            onClick={toggleCollapsed}
            className="absolute top-4 right-4 neumorphic-icon-button p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 z-20 flex items-center justify-center"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Site name */}
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
            <h2
              className={`text-xl font-semibold text-neutral-800 dark:text-neutral-100 ${isCollapsed ? "text-center" : ""}`}
            >
              {isCollapsed ? "🧰" : getMenuText(menuConfig.siteName)}
            </h2>
          </div>

          {/* Quick access */}
          {!isCollapsed && (
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
              {onToolSelect && <QuickAccess onToolSelect={onToolSelect} />}
            </div>
          )}

          {/* Main menu */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              <button
                onClick={handleHomeClick}
                className={`neumorphic-button w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all duration-300 ${
                  activeTool === "/dashboard" ? "neumorphic-button-active" : ""
                } ${isCollapsed ? "justify-center" : ""}`}
              >
                <Home size={20} />
                {!isCollapsed && <span>{t("sidebar.home")}</span>}
              </button>

              {menuConfig.mainMenu.map((category: any, index) => (
                <div key={index} className="space-y-2">
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeCategory === getMenuText(category.category) || activeTool === category.route
                        ? "neumorphic-button-active bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                        : "neumorphic-button bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
                    } ${isCollapsed ? "justify-center" : ""}`}
                  >
                    <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
                      {categoryIcons[getMenuText(category.category)] || (
                        <span className="text-xl">{category.icon}</span>
                      )}
                      {!isCollapsed && <span>{getMenuText(category.category)}</span>}
                    </div>
                    {!isCollapsed && (
                      <ChevronRight
                        size={18}
                        className={`transition-transform duration-300 ${
                          activeCategory === getMenuText(category.category) ? "rotate-90" : ""
                        }`}
                      />
                    )}
                  </button>

                  {!isCollapsed && activeCategory === getMenuText(category.category) && (
                    <div className="ml-4 pl-4 border-l border-neutral-200 dark:border-neutral-700 space-y-2 animate-slideDown">
                      {/* 显示子类别 */}
                      {category.subItems && category.subItems.length > 0 && (
                        <>
                          {category.subItems.map((subItem: any, subIndex: number) => (
                            <div key={subIndex} className="space-y-1">
                              <button
                                onClick={() => handleSubCategoryClick(subItem)}
                                className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-300 ${
                                  activeSubCategory === getMenuText(subItem.name)
                                    ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50"
                                }`}
                              >
                                <span>{getMenuText(subItem.name)}</span>
                                <ChevronRight
                                  size={16}
                                  className={`transition-transform duration-300 ${
                                    activeSubCategory === getMenuText(subItem.name) ? "rotate-90" : ""
                                  }`}
                                />
                              </button>

                              {activeSubCategory === getMenuText(subItem.name) && (
                                <div className="ml-4 pl-4 border-l border-neutral-200 dark:border-neutral-700 space-y-1 animate-slideDown">
                                  {subItem.tools.map((tool: any, toolIndex: number) => (
                                    <button
                                      key={toolIndex}
                                      className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 w-full text-left ${
                                        activeTool === tool.route
                                          ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 font-medium"
                                          : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50"
                                      }`}
                                      onClick={() => handleToolClick(tool.route)}
                                    >
                                      {tool.icon && <span className="mr-2">{tool.icon}</span>}
                                      <span>{getMenuText(tool.name)}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </>
                      )}

                      {/* 显示直接工具 */}
                      {category.tools && category.tools.length > 0 && (
                        <div className="space-y-1">
                          {category.tools.map((tool: any, toolIndex: number) => (
                            <button
                              key={toolIndex}
                              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 w-full text-left ${
                                activeTool === tool.route
                                  ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 font-medium"
                                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50"
                              }`}
                              onClick={() => handleToolClick(tool.route)}
                            >
                              {tool.icon && <span className="mr-2">{tool.icon}</span>}
                              <span>{getMenuText(tool.name)}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>
      </aside>
    </>
  )
}
