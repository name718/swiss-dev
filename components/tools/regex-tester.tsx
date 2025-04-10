"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Copy, Check, Save, Trash, Book, Bookmark, AlertTriangle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

type RegexFlag = "g" | "i" | "m" | "s" | "u" | "y"
type RegexMatch = {
  index: number
  match: string
  groups: string[]
}

type SavedPattern = {
  id: string
  name: string
  pattern: string
  flags: RegexFlag[]
  description: string
}

export function RegexTester() {
  const { language } = useLanguage()
  const [pattern, setPattern] = useState<string>("")
  const [testText, setTestText] = useState<string>("")
  const [flags, setFlags] = useState<RegexFlag[]>(["g"])
  const [matches, setMatches] = useState<RegexMatch[]>([])
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"test" | "reference" | "library">("test")
  const [highlightedText, setHighlightedText] = useState<string>("")
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [patternName, setPatternName] = useState("")
  const [patternDescription, setPatternDescription] = useState("")
  const [savedPatterns, setSavedPatterns] = useState<SavedPattern[]>([])
  const [copied, setCopied] = useState<string | null>(null)
  const [matchCount, setMatchCount] = useState(0)
  const [executionTime, setExecutionTime] = useState(0)
  const [showExamples, setShowExamples] = useState(false)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  // 加载保存的正则表达式模式
  useEffect(() => {
    const loadSavedPatterns = () => {
      const saved = localStorage.getItem("savedRegexPatterns")
      if (saved) {
        try {
          setSavedPatterns(JSON.parse(saved))
        } catch (e) {
          console.error("Failed to load saved patterns:", e)
        }
      }
    }

    loadSavedPatterns()
  }, [])

  // 测试正则表达式
  const testRegex = () => {
    if (!pattern) {
      setMatches([])
      setHighlightedText("")
      setError(null)
      setMatchCount(0)
      setExecutionTime(0)
      return
    }

    try {
      setError(null)
      const startTime = performance.now()

      // 创建正则表达式对象
      const flagsStr = flags.join("")
      const regex = new RegExp(pattern, flagsStr)

      // 查找所有匹配项
      const allMatches: RegexMatch[] = []
      let match
      const text = testText
      let matchCounter = 0

      if (regex.global) {
        // 使用 exec 循环查找所有匹配项
        while ((match = regex.exec(text)) !== null) {
          matchCounter++
          allMatches.push({
            index: match.index,
            match: match[0],
            groups: match.slice(1),
          })

          // 防止无限循环
          if (match[0] === "" && regex.lastIndex === match.index) {
            regex.lastIndex++
          }

          // 安全措施：如果匹配数量过多，停止处理
          if (matchCounter > 1000) {
            setError("超过1000个匹配项，已停止处理以避免性能问题")
            break
          }
        }
      } else {
        // 非全局模式，只匹配一次
        match = regex.exec(text)
        if (match) {
          matchCounter = 1
          allMatches.push({
            index: match.index,
            match: match[0],
            groups: match.slice(1),
          })
        }
      }

      setMatches(allMatches)
      setMatchCount(matchCounter)

      // 高亮显示匹配文本
      highlightMatches(text, allMatches)

      const endTime = performance.now()
      setExecutionTime(endTime - startTime)
    } catch (e) {
      setError(`正则表达式错误: ${(e as Error).message}`)
      setMatches([])
      setHighlightedText("")
      setMatchCount(0)
      setExecutionTime(0)
    }
  }

  // 高亮显示匹配文本
  const highlightMatches = (text: string, matches: RegexMatch[]) => {
    if (matches.length === 0) {
      setHighlightedText(escapeHtml(text))
      return
    }

    let result = ""
    let lastIndex = 0

    // 按索引排序匹配项
    const sortedMatches = [...matches].sort((a, b) => a.index - b.index)

    for (const match of sortedMatches) {
      // 添加匹配前的文本
      result += escapeHtml(text.substring(lastIndex, match.index))

      // 添加高亮的匹配文本
      result += `<mark class="bg-yellow-200 dark:bg-yellow-800/50">${escapeHtml(match.match)}</mark>`

      lastIndex = match.index + match.match.length
    }

    // 添加最后一个匹配后的文本
    result += escapeHtml(text.substring(lastIndex))

    setHighlightedText(result)
  }

  // HTML转义
  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/\n/g, "<br>")
      .replace(/\s/g, "&nbsp;")
  }

  // 切换标志
  const toggleFlag = (flag: RegexFlag) => {
    if (flags.includes(flag)) {
      setFlags(flags.filter((f) => f !== flag))
    } else {
      setFlags([...flags, flag])
    }
  }

  // 复制到剪贴板
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  // 保存正则表达式模式
  const savePattern = () => {
    if (!pattern || !patternName) return

    const newPattern: SavedPattern = {
      id: Date.now().toString(),
      name: patternName,
      pattern,
      flags,
      description: patternDescription,
    }

    const updatedPatterns = [...savedPatterns, newPattern]
    setSavedPatterns(updatedPatterns)
    localStorage.setItem("savedRegexPatterns", JSON.stringify(updatedPatterns))

    setShowSaveModal(false)
    setPatternName("")
    setPatternDescription("")
  }

  // 加载保存的模式
  const loadPattern = (savedPattern: SavedPattern) => {
    setPattern(savedPattern.pattern)
    setFlags(savedPattern.flags)
    setActiveTab("test")
  }

  // 删除保存的模式
  const deletePattern = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updatedPatterns = savedPatterns.filter((p) => p.id !== id)
    setSavedPatterns(updatedPatterns)
    localStorage.setItem("savedRegexPatterns", JSON.stringify(updatedPatterns))
  }

  // 加载示例
  const loadExample = (examplePattern: string, exampleText: string, exampleFlags: RegexFlag[] = ["g"]) => {
    setPattern(examplePattern)
    setTestText(exampleText)
    setFlags(exampleFlags)
    setShowExamples(false)

    // 聚焦到文本区域
    if (textAreaRef.current) {
      textAreaRef.current.focus()
    }
  }

  // 常用正则表达式示例
  const regexExamples = [
    {
      name: "电子邮件",
      pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
      text: "联系我们：support@example.com 或 sales@company.co.uk",
      flags: ["g"],
    },
    {
      name: "URL",
      pattern:
        "https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)",
      text: "访问我们的网站 https://example.com 或 http://www.company.org/products",
      flags: ["g"],
    },
    {
      name: "中国手机号",
      pattern: "1[3-9]\\d{9}",
      text: "请联系：13812345678 或 18987654321",
      flags: ["g"],
    },
    {
      name: "中国身份证号",
      pattern: "[1-9]\\d{5}(?:19|20)\\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\\d|3[01])\\d{3}[\\dXx]",
      text: "身份证号：440123199001015555 和 11010120000101123X",
      flags: ["g"],
    },
    {
      name: "IP地址",
      pattern: "(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)",
      text: "服务器IP: 192.168.1.1 和 10.0.0.1 以及 255.255.255.0",
      flags: ["g"],
    },
    {
      name: "日期 (YYYY-MM-DD)",
      pattern: "\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])",
      text: "会议日期：2023-01-15 到 2023-02-28",
      flags: ["g"],
    },
    {
      name: "HTML标签",
      pattern: '<([a-z][a-z0-9]*)(?: +[a-z][a-z0-9]*="[^"]*")*>.*?<\\/\\1>',
      text: '<div class="container">内容</div> <span>文本</span>',
      flags: ["g", "i"],
    },
    {
      name: "密码强度",
      pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
      text: "强密码：Test@1234 弱密码：password123",
      flags: ["g"],
    },
  ]

  // 正则表达式参考
  const regexReference = [
    {
      category: "字符类",
      items: [
        { symbol: ".", description: "匹配除换行符外的任何单个字符" },
        { symbol: "\\d", description: "匹配任何数字字符，等价于 [0-9]" },
        { symbol: "\\D", description: "匹配任何非数字字符，等价于 [^0-9]" },
        { symbol: "\\w", description: "匹配任何字母、数字或下划线字符，等价于 [A-Za-z0-9_]" },
        { symbol: "\\W", description: "匹配任何非字母、数字或下划线字符，等价于 [^A-Za-z0-9_]" },
        { symbol: "\\s", description: "匹配任何空白字符（空格、制表符、换行符等）" },
        { symbol: "\\S", description: "匹配任何非空白字符" },
      ],
    },
    {
      category: "边界匹配器",
      items: [
        { symbol: "^", description: "匹配输入的开头" },
        { symbol: "$", description: "匹配输入的结尾" },
        { symbol: "\\b", description: "匹配单词边界" },
        { symbol: "\\B", description: "匹配非单词边界" },
      ],
    },
    {
      category: "量词",
      items: [
        { symbol: "*", description: "匹配前面的表达式 0 次或多次" },
        { symbol: "+", description: "匹配前面的表达式 1 次或多次" },
        { symbol: "?", description: "匹配前面的表达式 0 次或 1 次" },
        { symbol: "{n}", description: "匹配前面的表达式恰好 n 次" },
        { symbol: "{n,}", description: "匹配前面的表达式至少 n 次" },
        { symbol: "{n,m}", description: "匹配前面的表达式至少 n 次，但不超过 m 次" },
      ],
    },
    {
      category: "贪婪与懒惰",
      items: [
        { symbol: "*?", description: "懒惰匹配，匹配前面的表达式 0 次或多次，但尽可能少地匹配" },
        { symbol: "+?", description: "懒惰匹配，匹配前面的表达式 1 次或多次，但尽可能少地匹配" },
        { symbol: "??", description: "懒惰匹配，匹配前面的表达式 0 次或 1 次，但尽可能少地匹配" },
        { symbol: "{n,m}?", description: "懒惰匹配，匹配前面的表达式至少 n 次，但不超过 m 次，且尽可能少地匹配" },
      ],
    },
    {
      category: "分组与引用",
      items: [
        { symbol: "(pattern)", description: "捕获组，匹配 pattern 并捕获匹配项" },
        { symbol: "(?:pattern)", description: "非捕获组，匹配 pattern 但不捕获匹配项" },
        { symbol: "(?<name>pattern)", description: "命名捕获组，匹配 pattern 并将匹配项存储在名为 name 的组中" },
        { symbol: "\\n", description: "反向引用，其中 n 是捕获组的编号（从 1 开始）" },
      ],
    },
    {
      category: "字符集",
      items: [
        { symbol: "[abc]", description: "字符集，匹配集合中的任何字符" },
        { symbol: "[^abc]", description: "否定字符集，匹配任何不在集合中的字符" },
        { symbol: "[a-z]", description: "范围，匹配指定范围内的任何字符" },
        { symbol: "[a-zA-Z]", description: "多个范围，匹配任何指定范围内的字符" },
      ],
    },
    {
      category: "断言",
      items: [
        { symbol: "(?=pattern)", description: "正向先行断言，匹配 pattern 前面的位置" },
        { symbol: "(?!pattern)", description: "负向先行断言，匹配不是 pattern 前面的位置" },
        { symbol: "(?<=pattern)", description: "正向后行断言，匹配 pattern 后面的位置" },
        { symbol: "(?<!pattern)", description: "负向后行断言，匹配不是 pattern 后面的位置" },
      ],
    },
    {
      category: "标志",
      items: [
        { symbol: "g", description: "全局匹配，查找所有匹配项" },
        { symbol: "i", description: "忽略大小写" },
        { symbol: "m", description: "多行匹配，使 ^ 和 $ 匹配每行的开头和结尾" },
        { symbol: "s", description: "使 . 匹配包括换行符在内的所有字符" },
        { symbol: "u", description: "启用 Unicode 匹配" },
        { symbol: "y", description: "粘性匹配，从正则表达式的 lastIndex 属性指定的位置开始匹配" },
      ],
    },
  ]

  // 渲染标志切换按钮
  const renderFlagToggle = (flag: RegexFlag, label: string, description: string) => (
    <button
      type="button"
      onClick={() => toggleFlag(flag)}
      className={`neumorphic-button px-3 py-1.5 rounded-lg flex items-center gap-1 ${
        flags.includes(flag)
          ? "neumorphic-button-active bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          : ""
      }`}
      title={description}
    >
      <span className="font-mono">{flag}</span>
      <span className="text-xs hidden sm:inline">({label})</span>
    </button>
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">正则表达式测试器</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">测试、调试和验证正则表达式</p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="neumorphic-button px-3 py-1.5 rounded-lg flex items-center gap-1"
          >
            <Book size={16} />
            <span className="hidden sm:inline">示例</span>
          </button>

          <button
            onClick={() => setShowSaveModal(true)}
            className="neumorphic-button px-3 py-1.5 rounded-lg flex items-center gap-1"
            disabled={!pattern}
          >
            <Save size={16} />
            <span className="hidden sm:inline">保存</span>
          </button>
        </div>
      </div>

      {/* 示例面板 */}
      {showExamples && (
        <div className="neumorphic-card p-4 rounded-xl mb-4 animate-slideDown">
          <h4 className="font-medium mb-3 text-neutral-700 dark:text-neutral-300 flex items-center">
            <Book size={18} className="mr-2" />
            常用正则表达式示例
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {regexExamples.map((example, index) => (
              <button
                key={index}
                onClick={() => loadExample(example.pattern, example.text, example.flags)}
                className="neumorphic-button p-3 rounded-lg text-left hover:translate-y-[-2px] transition-transform"
              >
                <div className="font-medium text-neutral-800 dark:text-neutral-100">{example.name}</div>
                <div className="text-xs font-mono text-neutral-500 dark:text-neutral-400 truncate mt-1">
                  /{example.pattern}/
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 主要内容区域 */}
      <div className="flex flex-col space-y-4">
        {/* 标签页切换 */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("test")}
            className={`neumorphic-button px-4 py-2 rounded-lg ${
              activeTab === "test" ? "neumorphic-button-active" : ""
            }`}
          >
            测试
          </button>
          <button
            onClick={() => setActiveTab("reference")}
            className={`neumorphic-button px-4 py-2 rounded-lg ${
              activeTab === "reference" ? "neumorphic-button-active" : ""
            }`}
          >
            参考
          </button>
          <button
            onClick={() => setActiveTab("library")}
            className={`neumorphic-button px-4 py-2 rounded-lg ${
              activeTab === "library" ? "neumorphic-button-active" : ""
            }`}
          >
            我的模式库 {savedPatterns.length > 0 && `(${savedPatterns.length})`}
          </button>
        </div>

        {/* 测试面板 */}
        {activeTab === "test" && (
          <div className="space-y-4">
            {/* 正则表达式输入 */}
            <div>
              <div className="flex justify-between mb-1">
                <label
                  htmlFor="regex-pattern"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  正则表达式
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(pattern, "pattern")}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                    disabled={!pattern}
                  >
                    {copied === "pattern" ? <Check size={12} className="mr-1" /> : <Copy size={12} className="mr-1" />}
                    复制
                  </button>
                  <button
                    onClick={() => {
                      setPattern("")
                      setMatches([])
                      setHighlightedText("")
                      setError(null)
                    }}
                    className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center"
                    disabled={!pattern}
                  >
                    <Trash size={12} className="mr-1" />
                    清除
                  </button>
                </div>
              </div>
              <div className="flex">
                <div className="flex items-center bg-neutral-200 dark:bg-neutral-700 px-2 rounded-l-lg text-neutral-600 dark:text-neutral-400 font-mono">
                  /
                </div>
                <input
                  id="regex-pattern"
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="输入正则表达式..."
                  className="flex-1 p-2 bg-neutral-50 dark:bg-neutral-800 border-y border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 font-mono focus:outline-none"
                />
                <div className="flex items-center bg-neutral-200 dark:bg-neutral-700 px-2 rounded-r-lg text-neutral-600 dark:text-neutral-400 font-mono">
                  /{flags.join("")}
                </div>
              </div>
            </div>

            {/* 标志选项 */}
            <div className="flex flex-wrap gap-2">
              {renderFlagToggle("g", "全局", "全局匹配，查找所有匹配项")}
              {renderFlagToggle("i", "忽略大小写", "忽略大小写")}
              {renderFlagToggle("m", "多行", "多行匹配，使 ^ 和 $ 匹配每行的开头和结尾")}
              {renderFlagToggle("s", "点匹配所有", "使 . 匹配包括换行符在内的所有字符")}
              {renderFlagToggle("u", "Unicode", "启用 Unicode 匹配")}
              {renderFlagToggle("y", "粘性", "粘性匹配，从正则表达式的 lastIndex 属性指定的位置开始匹配")}
            </div>

            {/* 测试文本输入 */}
            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="test-text" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  测试文本
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(testText, "text")}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                    disabled={!testText}
                  >
                    {copied === "text" ? <Check size={12} className="mr-1" /> : <Copy size={12} className="mr-1" />}
                    复制
                  </button>
                  <button
                    onClick={() => setTestText("")}
                    className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center"
                    disabled={!testText}
                  >
                    <Trash size={12} className="mr-1" />
                    清除
                  </button>
                </div>
              </div>
              <textarea
                id="test-text"
                ref={textAreaRef}
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder="输入要测试的文本..."
                className="w-full h-32 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 font-mono focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600"
              />
            </div>

            {/* 测试按钮 */}
            <button
              onClick={testRegex}
              className="w-full py-2 px-4 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium neumorphic-button"
              disabled={!pattern || !testText}
            >
              测试正则表达式
            </button>

            {/* 错误信息 */}
            {error && (
              <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 flex items-start">
                <AlertTriangle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                <div>{error}</div>
              </div>
            )}

            {/* 匹配结果 */}
            {(matches.length > 0 || testText) && !error && (
              <div className="space-y-4">
                {/* 匹配统计 */}
                <div className="flex justify-between text-sm">
                  <div className="text-neutral-600 dark:text-neutral-400">
                    找到 <span className="font-bold text-blue-600 dark:text-blue-400">{matchCount}</span> 个匹配项
                  </div>
                  <div className="text-neutral-600 dark:text-neutral-400">
                    执行时间: <span className="font-mono">{executionTime.toFixed(2)}ms</span>
                  </div>
                </div>

                {/* 高亮显示匹配结果 */}
                <div className="neumorphic-card p-4 rounded-xl">
                  <h4 className="font-medium mb-2 text-neutral-700 dark:text-neutral-300">匹配结果</h4>
                  <div
                    className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono text-sm overflow-auto max-h-60"
                    dangerouslySetInnerHTML={{ __html: highlightedText || escapeHtml(testText) }}
                  />
                </div>

                {/* 匹配详情 */}
                {matches.length > 0 && (
                  <div className="neumorphic-card p-4 rounded-xl">
                    <h4 className="font-medium mb-2 text-neutral-700 dark:text-neutral-300">匹配详情</h4>
                    <div className="overflow-auto max-h-60">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-neutral-200 dark:border-neutral-700">
                            <th className="text-left p-2">#</th>
                            <th className="text-left p-2">匹配文本</th>
                            <th className="text-left p-2">位置</th>
                            <th className="text-left p-2">捕获组</th>
                          </tr>
                        </thead>
                        <tbody>
                          {matches.map((match, index) => (
                            <tr key={index} className="border-b border-neutral-200 dark:border-neutral-700">
                              <td className="p-2 font-mono">{index + 1}</td>
                              <td className="p-2 font-mono break-all">
                                <span className="bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">{match.match}</span>
                              </td>
                              <td className="p-2 font-mono">{match.index}</td>
                              <td className="p-2 font-mono">
                                {match.groups.length > 0 ? (
                                  <div className="space-y-1">
                                    {match.groups.map((group, groupIndex) => (
                                      <div key={groupIndex} className="text-xs">
                                        ${groupIndex + 1}:{" "}
                                        <span className="text-green-600 dark:text-green-400">{group}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-neutral-500 dark:text-neutral-400">无捕获组</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 参考面板 */}
        {activeTab === "reference" && (
          <div className="neumorphic-card p-4 rounded-xl">
            <h4 className="font-medium mb-4 text-neutral-700 dark:text-neutral-300 flex items-center">
              <Book size={18} className="mr-2" />
              正则表达式语法参考
            </h4>

            <div className="space-y-6">
              {regexReference.map((section, index) => (
                <div key={index}>
                  <h5 className="font-medium text-neutral-800 dark:text-neutral-100 mb-2">{section.category}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex">
                        <div className="bg-neutral-100 dark:bg-neutral-800 p-2 rounded-l-lg font-mono text-blue-600 dark:text-blue-400 min-w-[60px] text-center">
                          {item.symbol}
                        </div>
                        <div className="flex-1 p-2 bg-neutral-50 dark:bg-neutral-700 rounded-r-lg text-sm">
                          {item.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 模式库面板 */}
        {activeTab === "library" && (
          <div className="neumorphic-card p-4 rounded-xl">
            <h4 className="font-medium mb-4 text-neutral-700 dark:text-neutral-300 flex items-center">
              <Bookmark size={18} className="mr-2" />
              我的正则表达式模式库
            </h4>

            {savedPatterns.length === 0 ? (
              <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                <div className="mb-4">
                  <Bookmark size={48} className="mx-auto opacity-30" />
                </div>
                <p>您的模式库是空的</p>
                <p className="text-sm mt-2">保存常用的正则表达式以便快速访问</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {savedPatterns.map((savedPattern) => (
                  <div
                    key={savedPattern.id}
                    onClick={() => loadPattern(savedPattern)}
                    className="neumorphic-button p-4 rounded-lg cursor-pointer hover:translate-y-[-2px] transition-transform"
                  >
                    <div className="flex justify-between items-start">
                      <h5 className="font-medium text-neutral-800 dark:text-neutral-100">{savedPattern.name}</h5>
                      <button
                        onClick={(e) => deletePattern(savedPattern.id, e)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title="删除"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                    <div className="font-mono text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      /{savedPattern.pattern}/{savedPattern.flags.join("")}
                    </div>
                    {savedPattern.description && (
                      <div className="text-sm text-neutral-500 dark:text-neutral-500 mt-2">
                        {savedPattern.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 保存模式模态框 */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 max-w-md w-full mx-4 neumorphic-card">
            <h4 className="text-lg font-medium text-neutral-800 dark:text-neutral-100 mb-4">保存正则表达式模式</h4>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="pattern-name"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                >
                  名称
                </label>
                <input
                  id="pattern-name"
                  type="text"
                  value={patternName}
                  onChange={(e) => setPatternName(e.target.value)}
                  placeholder="给你的正则表达式起个名字..."
                  className="w-full p-2 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700"
                />
              </div>

              <div>
                <label
                  htmlFor="pattern-description"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                >
                  描述 (可选)
                </label>
                <textarea
                  id="pattern-description"
                  value={patternDescription}
                  onChange={(e) => setPatternDescription(e.target.value)}
                  placeholder="添加描述..."
                  className="w-full p-2 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 h-20"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 rounded-lg neumorphic-button text-neutral-700 dark:text-neutral-300"
                >
                  取消
                </button>
                <button
                  onClick={savePattern}
                  className="px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium neumorphic-button"
                  disabled={!patternName}
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 使用提示 */}
      <div className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">
        <h4 className="font-medium mb-2 text-neutral-700 dark:text-neutral-300">使用提示：</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>
            使用 <span className="font-mono">g</span> 标志可以查找所有匹配项，而不仅仅是第一个
          </li>
          <li>
            使用 <span className="font-mono">i</span> 标志可以忽略大小写
          </li>
          <li>
            使用括号 <span className="font-mono">()</span> 可以创建捕获组，匹配的内容会显示在匹配详情中
          </li>
          <li>
            使用 <span className="font-mono">|</span> 符号可以创建多个选择，例如{" "}
            <span className="font-mono">cat|dog</span> 会匹配 "cat" 或 "dog"
          </li>
          <li>
            使用 <span className="font-mono">?</span> 使前面的元素变为可选，例如{" "}
            <span className="font-mono">colou?r</span> 会匹配 "color" 或 "colour"
          </li>
        </ul>
      </div>
    </div>
  )
}
