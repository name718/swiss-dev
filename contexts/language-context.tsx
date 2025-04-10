"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "zh" | "en"

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
  getMenuText: (text: { en: string; zh: string }) => string
}

const translations: Record<Language, Record<string, string>> = {
  zh: {
    // General
    "app.name": "开发工具集",
    "app.tagline": "提升开发效率的工具箱",
    "app.future.content": "未来内容",
    "app.future.description": "此区域预留给未来使用。",
    "app.click.to.open": "点击打开此工具",
    "app.open.tool": "打开工具",
    language: "zh",

    // Header
    "header.search.placeholder": "搜索工具...",
    "header.github": "GitHub 集成",
    "header.dark.mode": "暗黑模式",
    "header.light.mode": "明亮模式",
    "header.login": "登录",
    "header.logout": "登出",

    // Sidebar
    "sidebar.home": "首页",
    "sidebar.quick.access": "快捷访问",
    "sidebar.settings": "设置",

    // Footer
    "footer.disclaimer": "免责声明：此工具包仅供教育目的使用。",
    "footer.privacy": "隐私政策",
    "footer.terms": "服务条款",
    "footer.contact": "联系我们",
    "footer.rights": "版权所有",

    // Tools
    "tools.calculator": "科学计算器",
    "tools.calculator.desc": "强大的计算器，支持科学函数",
    "tools.programmer.calculator": "程序员计算器",
    "tools.programmer.calculator.desc": "支持不同进制的开发者计算器",
    "tools.json.formatter": "JSON 格式化",
    "tools.json.formatter.desc": "格式化、验证和压缩 JSON 数据",
    "tools.markdown.editor": "Markdown 编辑器",
    "tools.markdown.editor.desc": "创建和预览 Markdown 文档",
    "tools.base.converter": "进制转换器",
    "tools.base.converter.desc": "在不同数字系统之间转换数字",
    "tools.game.2048": "2048 游戏",
    "tools.game.2048.desc": "合并方块，达到 2048！",
    "tools.sudoku": "数独",
    "tools.sudoku.desc": "用数字 1-9 填充网格",

    // AI Tools
    "ai.tools.all": "所有AI工具",
    "ai.tools.assistants": "AI助手",
    "ai.tools.creative": "创意AI",
    "ai.tools.developer": "开发者工具",
    "ai.tools.favorites": "收藏",
    "ai.tools.clear.all": "清除全部",
    "ai.tools.add.favorite": "添加到收藏",
    "ai.tools.remove.favorite": "从收藏中移除",
    "ai.tools.no.favorites": "还没有收藏的AI工具。点击任何AI工具上的星标图标将其添加到收藏夹。",
    "ai.tools.visit.website": "访问网站",

    // Sudoku
    "sudoku.fill.grid": "用数字 1-9 填充网格",
    "sudoku.mistakes": "错误",
    "sudoku.easy": "简单",
    "sudoku.medium": "中等",
    "sudoku.hard": "困难",
    "sudoku.new.game": "新游戏",
    "sudoku.pause": "暂停",
    "sudoku.resume": "继续",
    "sudoku.game.paused": "游戏已暂停",
    "sudoku.puzzle.completed": "谜题已完成！",
    "sudoku.time": "时间",
    "sudoku.play.again": "再玩一次",
    "sudoku.notes.on": "笔记开启",
    "sudoku.notes.off": "笔记关闭",
    "sudoku.hint": "提示",

    // New categories
    "category.code.tools": "代码工具",
    "category.dev.utilities": "开发实用工具",
    "category.text.docs": "文本和文档",
    "category.ai.assistants": "AI助手",
    "category.break.time": "摸鱼时间",
    "category.productivity": "生产力工具",
    "category.network.tools": "网络工具",

    // Language
    "language.switch": "Switch to English",
    "available.tools": "可用工具",

    // Not implemented
    "feature.under.development": "功能开发中",
    "feature.under.development.message": "功能正在开发中，敬请期待！",
    "feature.under.development.note": "我们正在努力完善此功能，感谢您的耐心等待。",

    // AI Assistants
    "ai.assistants.directory": "AI助手目录",
    "ai.assistants.search": "搜索AI助手...",
    "ai.assistants.all": "所有助手",
    "ai.assistants.general": "通用大语言模型",
    "ai.assistants.search.tools": "搜索助手",
    "ai.assistants.coding": "编程助手",
    "ai.assistants.writing": "写作助手",
    "ai.assistants.specialized": "专业工具",
    "ai.assistants.platforms": "AI平台",
    "ai.assistants.global": "全球可用",
    "ai.assistants.china": "中国特色",
    "ai.assistants.showing": "显示 {count} 个AI助手",
    "ai.assistants.no.results": "没有找到匹配的AI助手。请尝试不同的搜索词或筛选条件。",
    "ai.assistants.no.favorites": "还没有收藏的AI助手。点击任何AI助手上的星标图标将其添加到收藏夹。",
    "ai.assistants.favorites": "收藏",
    "ai.assistants.clear.all": "清除全部",
    "ai.assistants.add.favorite": "添加到收藏",
    "ai.assistants.remove.favorite": "从收藏中移除",
    "ai.assistants.all.regions": "所有地区",

    // AI Platform
    "ai.platform.directory": "AI平台目录",
    "ai.platform.all": "所有平台",
    "ai.platform.general": "通用AI",
    "ai.platform.creative": "创意AI",
    "ai.platform.developer": "开发者工具",
    "ai.platform.search": "搜索AI",
  },
  en: {
    // General
    "app.name": "DevTools Hub",
    "app.tagline": "Developer Tools Collection",
    "app.future.content": "Future Content",
    "app.future.description": "This area is reserved for future use.",
    "app.click.to.open": "Click to open this tool",
    "app.open.tool": "Open Tool",
    language: "en",

    // Header
    "header.search.placeholder": "Search tools...",
    "header.github": "GitHub Integration",
    "header.dark.mode": "Dark Mode",
    "header.light.mode": "Light Mode",
    "header.login": "Log In",
    "header.logout": "Log Out",

    // Sidebar
    "sidebar.home": "Home",
    "sidebar.quick.access": "Quick Access",
    "sidebar.settings": "Settings",

    // Footer
    "footer.disclaimer": "Disclaimer: This toolkit is provided for educational purposes only.",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.contact": "Contact Us",
    "footer.rights": "All rights reserved",

    // Tools
    "tools.calculator": "Scientific Calculator",
    "tools.calculator.desc": "A powerful calculator with scientific functions",
    "tools.programmer.calculator": "Programmer Calculator",
    "tools.programmer.calculator.desc": "A calculator for developers with support for different number bases",
    "tools.json.formatter": "JSON Formatter",
    "tools.json.formatter.desc": "Format, validate, and minify JSON data",
    "tools.markdown.editor": "Markdown Editor",
    "tools.markdown.editor.desc": "Create and preview Markdown documents",
    "tools.base.converter": "Base Converter",
    "tools.base.converter.desc": "Convert numbers between different numeral systems",
    "tools.game.2048": "2048 Game",
    "tools.game.2048.desc": "Join the tiles, get to 2048!",
    "tools.sudoku": "Sudoku",
    "tools.sudoku.desc": "Fill the grid with numbers 1-9",

    // AI Tools
    "ai.tools.all": "All AI Tools",
    "ai.tools.assistants": "AI Assistants",
    "ai.tools.creative": "Creative AI",
    "ai.tools.developer": "Developer Tools",
    "ai.tools.favorites": "Favorites",
    "ai.tools.clear.all": "Clear All",
    "ai.tools.add.favorite": "Add to favorites",
    "ai.tools.remove.favorite": "Remove from favorites",
    "ai.tools.no.favorites":
      "No favorite AI tools yet. Click the star icon on any AI tool to add it to your favorites.",
    "ai.tools.visit.website": "Visit Website",

    // Sudoku
    "sudoku.fill.grid": "Fill the grid with numbers 1-9",
    "sudoku.mistakes": "MISTAKES",
    "sudoku.easy": "Easy",
    "sudoku.medium": "Medium",
    "sudoku.hard": "Hard",
    "sudoku.new.game": "New Game",
    "sudoku.pause": "Pause",
    "sudoku.resume": "Resume",
    "sudoku.game.paused": "Game Paused",
    "sudoku.puzzle.completed": "Puzzle Completed!",
    "sudoku.time": "Time",
    "sudoku.play.again": "Play Again",
    "sudoku.notes.on": "Notes On",
    "sudoku.notes.off": "Notes Off",
    "sudoku.hint": "Hint",

    // New categories
    "category.code.tools": "Code Tools",
    "category.dev.utilities": "Dev Utilities",
    "category.text.docs": "Text & Docs",
    "category.ai.assistants": "AI Assistants",
    "category.break.time": "Break Time",
    "category.productivity": "Productivity",
    "category.network.tools": "Network Tools",

    // Language
    "language.switch": "切换到中文",
    "available.tools": "Available Tools",

    // Not implemented
    "feature.under.development": "Feature Under Development",
    "feature.under.development.message": "This feature is currently under development. Please check back later!",
    "feature.under.development.note": "We are working hard to complete this feature. Thank you for your patience.",

    // AI Assistants
    "ai.assistants.directory": "AI Assistants Directory",
    "ai.assistants.search": "Search AI assistants...",
    "ai.assistants.all": "All Assistants",
    "ai.assistants.general": "General LLMs",
    "ai.assistants.search.tools": "Search Assistants",
    "ai.assistants.coding": "Coding Assistants",
    "ai.assistants.writing": "Writing Assistants",
    "ai.assistants.specialized": "Specialized Tools",
    "ai.assistants.platforms": "AI Platforms",
    "ai.assistants.global": "Global",
    "ai.assistants.china": "China Focused",
    "ai.assistants.showing": "Showing {count} AI assistants",
    "ai.assistants.no.results": "No matching AI assistants found. Try different search terms or filters.",
    "ai.assistants.no.favorites":
      "No favorite AI assistants yet. Click the star icon on any AI assistant to add it to your favorites.",
    "ai.assistants.favorites": "Favorites",
    "ai.assistants.clear.all": "Clear All",
    "ai.assistants.add.favorite": "Add to favorites",
    "ai.assistants.remove.favorite": "Remove from favorites",
    "ai.assistants.all.regions": "All Regions",

    // AI Platform
    "ai.platform.directory": "AI Platform Directory",
    "ai.platform.all": "All Platforms",
    "ai.platform.general": "General AI",
    "ai.platform.creative": "Creative AI",
    "ai.platform.developer": "Developer Tools",
    "ai.platform.search": "Search AI",
  },
}

const defaultContextValue: LanguageContextType = {
  language: "zh",
  setLanguage: () => {},
  t: (key) => key,
  getMenuText: (text) => text.zh,
}

const LanguageContext = createContext<LanguageContextType>(defaultContextValue)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("zh")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Only access localStorage on the client side
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language") as Language
      if (savedLanguage && (savedLanguage === "zh" || savedLanguage === "en")) {
        setLanguageState(savedLanguage)
      }
    }
  }, [])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    if (typeof window !== "undefined") {
      localStorage.setItem("language", newLanguage)
    }
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  // New function to get text from bilingual menu objects
  const getMenuText = (text: { en: string; zh: string }): string => {
    return text[language] || text.en
  }

  const value = {
    language,
    setLanguage,
    t,
    getMenuText,
  }

  // Avoid hydration mismatch by only rendering when mounted
  if (!mounted) {
    return <>{children}</>
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}
