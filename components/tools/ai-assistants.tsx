"use client"

import { useState, useEffect } from "react"
import { ExternalLink, Search, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

type AIAssistant = {
  id: string
  name: string
  url: string
  icon: string
  description: {
    en: string
    zh: string
  }
  category: string
  tags: string[]
  region?: "global" | "china" | "both"
}

export function AIAssistants() {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [activeRegion, setActiveRegion] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isClient, setIsClient] = useState(false)
  const { language, getMenuText } = useLanguage()

  const aiAssistants: AIAssistant[] = [
    // Large Language Model Assistants
    {
      id: "chatgpt",
      name: "ChatGPT",
      url: "https://chat.openai.com",
      icon: "🧠",
      description: {
        en: "OpenAI's conversational AI model that can engage in natural language dialogues and assist with various tasks.",
        zh: "OpenAI的对话式AI模型，可以进行自然语言对话并协助完成各种任务。",
      },
      category: "llm",
      tags: ["openai", "gpt-4", "popular"],
      region: "global",
    },
    {
      id: "claude",
      name: "Claude",
      url: "https://claude.ai",
      icon: "🔮",
      description: {
        en: "Anthropic's AI assistant designed to be helpful, harmless, and honest with strong reasoning capabilities.",
        zh: "Anthropic的AI助手，设计为有帮助、无害和诚实，具有强大的推理能力。",
      },
      category: "llm",
      tags: ["anthropic", "claude-3", "reasoning"],
      region: "global",
    },
    {
      id: "gemini",
      name: "Gemini",
      url: "https://gemini.google.com",
      icon: "💎",
      description: {
        en: "Google's multimodal AI that can understand and generate text, images, and code with Google's knowledge integration.",
        zh: "Google的多模态AI，可以理解和生成文本、图像和代码，集成了Google的知识库。",
      },
      category: "llm",
      tags: ["google", "multimodal", "search"],
      region: "global",
    },
    {
      id: "copilot",
      name: "Microsoft Copilot",
      url: "https://copilot.microsoft.com",
      icon: "🚀",
      description: {
        en: "Microsoft's AI assistant powered by OpenAI's models, integrated with Microsoft services and web search.",
        zh: "微软的AI助手，由OpenAI的模型提供支持，与微软服务和网络搜索集成。",
      },
      category: "llm",
      tags: ["microsoft", "bing", "office"],
      region: "global",
    },
    {
      id: "perplexity",
      name: "Perplexity",
      url: "https://perplexity.ai",
      icon: "🔍",
      description: {
        en: "AI-powered search engine that provides comprehensive answers with citations and real-time information.",
        zh: "AI驱动的搜索引擎，提供带有引用和实时信息的全面答案。",
      },
      category: "search",
      tags: ["research", "citations", "real-time"],
      region: "global",
    },
    {
      id: "poe",
      name: "Poe",
      url: "https://poe.com",
      icon: "📝",
      description: {
        en: "Platform that provides access to multiple AI models in one place, including Claude, GPT, and more.",
        zh: "在一个平台上提供多种AI模型访问的服务，包括Claude、GPT等。",
      },
      category: "platform",
      tags: ["multi-model", "quora", "comparison"],
      region: "global",
    },
    {
      id: "huggingchat",
      name: "HuggingChat",
      url: "https://huggingface.co/chat",
      icon: "🤗",
      description: {
        en: "Free and open source alternative to ChatGPT powered by open models from Hugging Face.",
        zh: "由Hugging Face的开源模型提供支持的ChatGPT的免费开源替代品。",
      },
      category: "llm",
      tags: ["open-source", "free", "huggingface"],
      region: "global",
    },
    {
      id: "pi",
      name: "Pi",
      url: "https://pi.ai",
      icon: "π",
      description: {
        en: "Personal AI assistant focused on being a supportive and empathetic conversation partner.",
        zh: "个人AI助手，专注于成为一个支持和富有同理心的对话伙伴。",
      },
      category: "llm",
      tags: ["personal", "empathetic", "inflection"],
      region: "global",
    },
    {
      id: "phind",
      name: "Phind",
      url: "https://phind.com",
      icon: "🔎",
      description: {
        en: "AI search assistant specialized in programming and technical topics with code examples.",
        zh: "专注于编程和技术主题的AI搜索助手，提供代码示例。",
      },
      category: "search",
      tags: ["programming", "code", "technical"],
      region: "global",
    },
    {
      id: "you",
      name: "You.com",
      url: "https://you.com",
      icon: "👤",
      description: {
        en: "AI search engine that combines web search with conversational AI capabilities.",
        zh: "AI搜索引擎，结合了网络搜索和对话式AI功能。",
      },
      category: "search",
      tags: ["search", "web", "conversational"],
      region: "global",
    },

    // Chinese AI Assistants
    {
      id: "deepseek",
      name: "DeepSeek",
      url: "https://chat.deepseek.com",
      icon: "🌊",
      description: {
        en: "Advanced AI assistant with strong capabilities in code generation and problem solving.",
        zh: "先进的AI助手，在代码生成和问题解决方面具有强大能力。",
      },
      category: "llm",
      tags: ["code", "problem-solving", "chinese"],
      region: "both",
    },
    {
      id: "kimi",
      name: "Kimi",
      url: "https://kimi.moonshot.cn",
      icon: "🌙",
      description: {
        en: "Moonshot AI's conversational assistant with strong capabilities in Chinese language and knowledge.",
        zh: "Moonshot AI的对话助手，在中文语言和知识方面具有强大能力。",
      },
      category: "llm",
      tags: ["moonshot", "chinese", "knowledge"],
      region: "china",
    },
    {
      id: "doubao",
      name: "豆包 (Doubao)",
      url: "https://www.doubao.com",
      icon: "🫘",
      description: {
        en: "ByteDance's AI assistant with strong capabilities in Chinese language, culture and creative content.",
        zh: "字节跳动的AI助手，在中文语言、文化和创意内容方面具有强大能力。",
      },
      category: "llm",
      tags: ["bytedance", "chinese", "creative"],
      region: "china",
    },
    {
      id: "tongyi",
      name: "通义千问 (Tongyi Qianwen)",
      url: "https://qianwen.aliyun.com",
      icon: "🧩",
      description: {
        en: "Alibaba's AI assistant with strong capabilities in Chinese language and business knowledge.",
        zh: "阿里巴巴的AI助手，在中文语言和商业知识方面具有强大能力。",
      },
      category: "llm",
      tags: ["alibaba", "chinese", "business"],
      region: "china",
    },
    {
      id: "ernie",
      name: "文心一言 (Ernie Bot)",
      url: "https://yiyan.baidu.com",
      icon: "🧠",
      description: {
        en: "Baidu's AI assistant with strong capabilities in Chinese language, knowledge and search integration.",
        zh: "百度的AI助手，在中文语言、知识和搜索集成方面具有强大能力。",
      },
      category: "llm",
      tags: ["baidu", "chinese", "search"],
      region: "china",
    },
    {
      id: "minimax",
      name: "MiniMax",
      url: "https://www.minimaxi.com",
      icon: "🤏",
      description: {
        en: "Chinese AI assistant focused on efficiency and practical applications with strong multimodal capabilities.",
        zh: "专注于效率和实际应用的中国AI助手，具有强大的多模态能力。",
      },
      category: "llm",
      tags: ["chinese", "multimodal", "practical"],
      region: "china",
    },
    {
      id: "xinghuo",
      name: "星火认知 (Spark)",
      url: "https://xinghuo.xfyun.cn",
      icon: "✨",
      description: {
        en: "iFLYTEK's AI assistant with strong capabilities in speech recognition and Chinese language understanding.",
        zh: "科大讯飞的AI助手，在语音识别和中文语言理解方面具有强大能力。",
      },
      category: "llm",
      tags: ["iflytek", "chinese", "speech"],
      region: "china",
    },
    {
      id: "tiangong",
      name: "天工 (Tiangong)",
      url: "https://tiangong.kunlun.com",
      icon: "🔨",
      description: {
        en: "Kunlun's AI assistant with capabilities in Chinese language understanding and creative content generation.",
        zh: "昆仑万维的AI助手，在中文语言理解和创意内容生成方面具有能力。",
      },
      category: "llm",
      tags: ["kunlun", "chinese", "creative"],
      region: "china",
    },

    // Specialized AI Assistants
    {
      id: "chatpdf",
      name: "ChatPDF",
      url: "https://www.chatpdf.com",
      icon: "📄",
      description: {
        en: "AI assistant specialized in analyzing and answering questions about PDF documents.",
        zh: "专门分析PDF文档并回答相关问题的AI助手。",
      },
      category: "specialized",
      tags: ["pdf", "documents", "research"],
      region: "global",
    },
    {
      id: "elicit",
      name: "Elicit",
      url: "https://elicit.org",
      icon: "🔬",
      description: {
        en: "AI research assistant that helps with literature review and finding relevant papers.",
        zh: "AI研究助手，帮助进行文献综述和查找相关论文。",
      },
      category: "specialized",
      tags: ["research", "academic", "papers"],
      region: "global",
    },
    {
      id: "codeium",
      name: "Codeium",
      url: "https://codeium.com",
      icon: "💻",
      description: {
        en: "AI coding assistant with free tier that helps developers write and understand code.",
        zh: "具有免费层级的AI编码助手，帮助开发人员编写和理解代码。",
      },
      category: "coding",
      tags: ["code", "programming", "free"],
      region: "global",
    },
    {
      id: "github-copilot",
      name: "GitHub Copilot",
      url: "https://github.com/features/copilot",
      icon: "👨‍💻",
      description: {
        en: "AI pair programmer that helps you write code faster with suggestions and explanations.",
        zh: "AI配对程序员，通过建议和解释帮助您更快地编写代码。",
      },
      category: "coding",
      tags: ["github", "microsoft", "code"],
      region: "global",
    },
    {
      id: "cursor",
      name: "Cursor",
      url: "https://cursor.sh",
      icon: "📝",
      description: {
        en: "AI-powered code editor built on VSCode with integrated AI assistance for coding.",
        zh: "基于VSCode构建的AI驱动代码编辑器，集成了AI编码辅助功能。",
      },
      category: "coding",
      tags: ["editor", "vscode", "coding"],
      region: "global",
    },
    {
      id: "jasper",
      name: "Jasper",
      url: "https://www.jasper.ai",
      icon: "✍️",
      description: {
        en: "AI writing assistant specialized in marketing and business content creation.",
        zh: "专注于营销和商业内容创作的AI写作助手。",
      },
      category: "writing",
      tags: ["marketing", "business", "content"],
      region: "global",
    },
    {
      id: "writesonic",
      name: "Writesonic",
      url: "https://writesonic.com",
      icon: "📝",
      description: {
        en: "AI writing tool for creating marketing copy, blog posts, and other content.",
        zh: "用于创建营销文案、博客文章和其他内容的AI写作工具。",
      },
      category: "writing",
      tags: ["marketing", "copy", "content"],
      region: "global",
    },
  ]

  useEffect(() => {
    setIsClient(true)
  }, [])

  const categories = [
    { id: "all", name: { en: "All Assistants", zh: "所有助手" } },
    { id: "llm", name: { en: "General LLMs", zh: "通用大语言模型" } },
    { id: "search", name: { en: "Search Assistants", zh: "搜索助手" } },
    { id: "coding", name: { en: "Coding Assistants", zh: "编程助手" } },
    { id: "writing", name: { en: "Writing Assistants", zh: "写作助手" } },
    { id: "specialized", name: { en: "Specialized Tools", zh: "专业工具" } },
    { id: "platform", name: { en: "AI Platforms", zh: "AI平台" } },
  ]

  const regions = [
    { id: "all", name: { en: "All Regions", zh: "所有地区" } },
    { id: "global", name: { en: "Global", zh: "全球可用" } },
    { id: "china", name: { en: "China Focused", zh: "中国特色" } },
  ]

  // Filter assistants based on category, region, and search query
  const filteredAssistants = aiAssistants.filter((assistant) => {
    // Filter by category
    if (activeCategory !== "all" && assistant.category !== activeCategory) {
      return false
    }

    // Filter by region
    if (activeRegion !== "all") {
      if (assistant.region !== activeRegion && assistant.region !== "both") {
        return false
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const nameMatch = assistant.name.toLowerCase().includes(query)
      const descMatch =
        language === "zh"
          ? assistant.description.zh.toLowerCase().includes(query)
          : assistant.description.en.toLowerCase().includes(query)
      const tagMatch = assistant.tags.some((tag) => tag.toLowerCase().includes(query))

      if (!nameMatch && !descMatch && !tagMatch) return false
    }

    return true
  })

  if (!isClient) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-neutral-200 dark:bg-neutral-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        {/* Search bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === "zh" ? "搜索AI助手..." : "Search AI assistants..."}
            className="w-full py-2 px-4 pl-10 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600 transition-all duration-300"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Filter controls */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`neumorphic-button px-3 py-1.5 rounded-lg whitespace-nowrap ${
                  activeCategory === category.id ? "neumorphic-button-active" : ""
                }`}
              >
                {getMenuText(category.name)}
              </button>
            ))}
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2">
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => setActiveRegion(region.id)}
                className={`neumorphic-button px-3 py-1.5 rounded-lg whitespace-nowrap ${
                  activeRegion === region.id ? "neumorphic-button-active" : ""
                }`}
              >
                {getMenuText(region.name)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-neutral-500 dark:text-neutral-400">
        {language === "zh"
          ? `显示 ${filteredAssistants.length} 个AI助手`
          : `Showing ${filteredAssistants.length} AI assistants`}
      </div>

      {/* AI assistants grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssistants.map((assistant) => (
          <a
            key={assistant.id}
            href={assistant.url}
            target="_blank"
            rel="noopener noreferrer"
            className="neumorphic-card p-4 rounded-lg hover:translate-y-[-5px] transition-transform duration-300 group relative"
          >
            <div className="flex items-start mt-4">
              <div className="text-3xl mr-3">{assistant.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-100">{assistant.name}</h3>
                  <ExternalLink size={16} className="text-neutral-500" />
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  {language === "zh" ? assistant.description.zh : assistant.description.en}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {assistant.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 bg-neutral-200 dark:bg-neutral-700 rounded-full text-neutral-600 dark:text-neutral-300"
                    >
                      {tag}
                    </span>
                  ))}
                  {assistant.region && assistant.region !== "both" && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        assistant.region === "global"
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                      }`}
                    >
                      {assistant.region === "global"
                        ? language === "zh"
                          ? "全球"
                          : "Global"
                        : language === "zh"
                          ? "中国"
                          : "China"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {filteredAssistants.length === 0 && (
        <div className="text-center p-8 neumorphic-card rounded-lg">
          <p className="text-neutral-600 dark:text-neutral-400">
            {language === "zh"
              ? "没有找到匹配的AI助手。请尝试不同的搜索词或筛选条件。"
              : "No matching AI assistants found. Try different search terms or filters."}
          </p>
        </div>
      )}
    </div>
  )
}
