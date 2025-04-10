"use client"

import { useEffect, useState } from "react"
import { menuConfig } from "@/config/menu-config"
import { useLanguage } from "@/contexts/language-context"

interface SearchResultsProps {
  query: string
  onSelect: (route: string) => void
  onClose: () => void
  isVisible: boolean
}

interface SearchResult {
  name: string
  route: string
  description?: string
  category?: string
}

export function SearchResults({ query, onSelect, onClose, isVisible }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const { getMenuText } = useLanguage()

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchQuery = query.toLowerCase()
    const searchResults: SearchResult[] = []

    // 搜索主菜单
    menuConfig.mainMenu.forEach((category) => {
      const categoryName = typeof category.category === "string" ? category.category : getMenuText(category.category)

      // 检查类别本身
      if (categoryName.toLowerCase().includes(searchQuery) && category.route) {
        searchResults.push({
          name: categoryName,
          route: category.route,
          category: "主类别",
        })
      }

      // 检查直接工具
      if (category.tools) {
        category.tools.forEach((tool) => {
          const toolName = typeof tool.name === "string" ? tool.name : getMenuText(tool.name)
          const toolDesc = tool.description ? getMenuText(tool.description) : ""

          if (toolName.toLowerCase().includes(searchQuery) || toolDesc.toLowerCase().includes(searchQuery)) {
            searchResults.push({
              name: toolName,
              route: tool.route,
              description: toolDesc,
              category: categoryName,
            })
          }
        })
      }

      // 检查子项目
      category.subItems.forEach((subItem) => {
        const subItemName = typeof subItem.name === "string" ? subItem.name : getMenuText(subItem.name)

        subItem.tools.forEach((tool) => {
          const toolName = typeof tool.name === "string" ? tool.name : getMenuText(tool.name)
          const toolDesc = tool.description ? getMenuText(tool.description) : ""

          if (
            toolName.toLowerCase().includes(searchQuery) ||
            toolDesc.toLowerCase().includes(searchQuery) ||
            subItemName.toLowerCase().includes(searchQuery)
          ) {
            searchResults.push({
              name: toolName,
              route: tool.route,
              description: toolDesc,
              category: `${categoryName} > ${subItemName}`,
            })
          }
        })
      })
    })

    // 搜索快速访问
    menuConfig.quickAccess.forEach((item) => {
      const itemName = typeof item.name === "string" ? item.name : getMenuText(item.name)

      if (itemName.toLowerCase().includes(searchQuery)) {
        searchResults.push({
          name: itemName,
          route: item.route,
          category: "快速访问",
        })
      }
    })

    // 限制结果数量
    setResults(searchResults.slice(0, 8))
  }, [query, getMenuText])

  if (!isVisible || results.length === 0) {
    return null
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 z-50 max-h-96 overflow-y-auto">
      <ul className="py-2">
        {results.map((result, index) => (
          <li key={index}>
            <button
              onClick={() => {
                onSelect(result.route)
                onClose()
              }}
              className="w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-150"
            >
              <div className="flex flex-col">
                <span className="font-medium text-neutral-800 dark:text-neutral-200">{result.name}</span>
                {result.category && (
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">{result.category}</span>
                )}
                {result.description && (
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-1">
                    {result.description}
                  </span>
                )}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
