"use client"

import { useState } from "react"
import { Menu, X, ChevronDown, ChevronRight, Home, Settings, Star } from "lucide-react"
import { menuConfig } from "@/config/menu-config"
import Link from "next/link"

type ToolItem = {
  name: string
  route: string
  icon?: string
}

type SubCategory = {
  name: string
  tools: ToolItem[]
}

type MainCategory = {
  category: string
  icon: string
  subItems: SubCategory[]
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [expandedSubCategories, setExpandedSubCategories] = useState<string[]>([])
  const [activeTool, setActiveTool] = useState<string>("/dashboard")

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const toggleSubCategory = (subCategory: string) => {
    setExpandedSubCategories((prev) =>
      prev.includes(subCategory) ? prev.filter((c) => c !== subCategory) : [...prev, subCategory],
    )
  }

  const handleToolClick = (route: string) => {
    setActiveTool(route)
    if (window.innerWidth < 768) {
      setIsOpen(false)
    }
  }

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed bottom-4 right-4 z-20 md:hidden neumorphic-button p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static z-10 w-72 h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out bg-neutral-100 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 overflow-hidden`}
      >
        <div className="h-full flex flex-col">
          {/* Site name */}
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">{menuConfig.siteName}</h2>
          </div>

          {/* Quick access */}
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-3 flex items-center">
              <Star size={16} className="mr-2" />
              快捷访问
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {menuConfig.quickAccess.map((item, index) => (
                <Link
                  key={index}
                  href={item.route}
                  className={`neumorphic-button flex flex-col items-center justify-center p-2 rounded-lg text-center transition-all duration-300 ${
                    activeTool === item.route ? "neumorphic-button-active" : ""
                  }`}
                  onClick={() => handleToolClick(item.route)}
                >
                  <span className="text-xl mb-1">{item.icon}</span>
                  <span className="text-xs">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Main menu */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              <Link
                href="/dashboard"
                className={`neumorphic-button flex items-center gap-3 px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all duration-300 ${
                  activeTool === "/dashboard" ? "neumorphic-button-active" : ""
                }`}
                onClick={() => handleToolClick("/dashboard")}
              >
                <Home size={18} />
                <span>首页</span>
              </Link>

              {menuConfig.mainMenu.map((category: MainCategory, index) => (
                <div key={index} className="space-y-1">
                  <button
                    onClick={() => toggleCategory(category.category)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{category.icon}</span>
                      <span>{category.category}</span>
                    </div>
                    {expandedCategories.includes(category.category) ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>

                  {expandedCategories.includes(category.category) && (
                    <div className="ml-4 pl-4 border-l border-neutral-200 dark:border-neutral-700 space-y-1">
                      {category.subItems.map((subItem: SubCategory, subIndex) => (
                        <div key={subIndex} className="space-y-1">
                          <button
                            onClick={() => toggleSubCategory(subItem.name)}
                            className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-all duration-300"
                          >
                            <span>{subItem.name}</span>
                            {expandedSubCategories.includes(subItem.name) ? (
                              <ChevronDown size={14} />
                            ) : (
                              <ChevronRight size={14} />
                            )}
                          </button>

                          {expandedSubCategories.includes(subItem.name) && (
                            <div className="ml-4 pl-4 border-l border-neutral-200 dark:border-neutral-700 space-y-1">
                              {subItem.tools.map((tool, toolIndex) => (
                                <Link
                                  key={toolIndex}
                                  href={tool.route}
                                  className={`flex items-center px-4 py-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-all duration-300 ${
                                    activeTool === tool.route ? "bg-neutral-200 dark:bg-neutral-700 font-medium" : ""
                                  }`}
                                  onClick={() => handleToolClick(tool.route)}
                                >
                                  <span>{tool.name}</span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Settings */}
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
            <Link
              href="/settings"
              className={`neumorphic-button flex items-center gap-3 px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all duration-300 ${
                activeTool === "/settings" ? "neumorphic-button-active" : ""
              }`}
              onClick={() => handleToolClick("/settings")}
            >
              <Settings size={18} />
              <span>设置</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}

