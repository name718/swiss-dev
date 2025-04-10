"use client"

import { useState, useEffect } from "react"
import { ExternalLink, Search, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

type AIWebsite = {
  id: string
  name: string
  url: string
  icon: string
  description: {
    en: string
    zh: string
  }
  category: string
}

export function AIToolsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isClient, setIsClient] = useState(false)
  const { language, getMenuText } = useLanguage()

  const aiWebsites: AIWebsite[] = [
    // AI Assistants Category
    {
      id: "chatgpt",
      name: "ChatGPT",
      url: "https://chat.openai.com",
      icon: "🧠",
      description: {
        en: "OpenAI's conversational AI model that can engage in natural language dialogues.",
        zh: "OpenAI的对话式AI模型，可以进行自然语言对话。",
      },
      category: "assistant",
    },
    {
      id: "claude",
      name: "Claude",
      url: "https://claude.ai",
      icon: "🔮",
      description: {
        en: "Anthropic's AI assistant designed to be helpful, harmless, and honest.",
        zh: "Anthropic的AI助手，设计为有帮助、无害和诚实。",
      },
      category: "assistant",
    },
    {
      id: "gemini",
      name: "Gemini",
      url: "https://gemini.google.com",
      icon: "💎",
      description: {
        en: "Google's multimodal AI that can understand and generate text, images, and more.",
        zh: "Google的多模态AI，可以理解和生成文本、图像等内容。",
      },
      category: "assistant",
    },
    {
      id: "perplexity",
      name: "Perplexity",
      url: "https://perplexity.ai",
      icon: "🔍",
      description: {
        en: "AI-powered search engine that provides comprehensive answers with citations.",
        zh: "AI驱动的搜索引擎，提供带有引用的全面答案。",
      },
      category: "assistant",
    },
    {
      id: "deepseek",
      name: "DeepSeek",
      url: "https://chat.deepseek.com",
      icon: "🌊",
      description: {
        en: "Advanced AI assistant with strong capabilities in code generation and problem solving.",
        zh: "先进的AI助手，在代码生成和问题解决方面具有强大能力。",
      },
      category: "assistant",
    },
    {
      id: "kimi",
      name: "Kimi",
      url: "https://kimi.moonshot.cn",
      icon: "🌙",
      description: {
        en: "Moonshot AI's conversational assistant with strong capabilities in Chinese language.",
        zh: "Moonshot AI的对话助手，在中文语言方面具有强大能力。",
      },
      category: "assistant",
    },
    {
      id: "doubao",
      name: "豆包 (Doubao)",
      url: "https://www.doubao.com",
      icon: "🫘",
      description: {
        en: "ByteDance's AI assistant with strong capabilities in Chinese language and culture.",
        zh: "字节跳动的AI助手，在中文语言和文化方面具有强大能力。",
      },
      category: "assistant",
    },
    {
      id: "tongyi",
      name: "通义千问 (Tongyi Qianwen)",
      url: "https://qianwen.aliyun.com",
      icon: "🧩",
      description: {
        en: "Alibaba's AI assistant with strong capabilities in Chinese language and knowledge.",
        zh: "阿里巴巴的AI助手，在中文语言和知识方面具有强大能力。",
      },
      category: "assistant",
    },
    {
      id: "ernie",
      name: "文心一言 (Ernie Bot)",
      url: "https://yiyan.baidu.com",
      icon: "🔮",
      description: {
        en: "Baidu's AI assistant with strong capabilities in Chinese language and knowledge.",
        zh: "百度的AI助手，在中文语言和知识方面具有强大能力。",
      },
      category: "assistant",
    },
    {
      id: "copilot",
      name: "Microsoft Copilot",
      url: "https://copilot.microsoft.com",
      icon: "🚀",
      description: {
        en: "Microsoft's AI assistant powered by OpenAI's models, integrated with Microsoft services.",
        zh: "微软的AI助手，由OpenAI的模型提供支持，与微软服务集成。",
      },
      category: "assistant",
    },
    {
      id: "poe",
      name: "Poe",
      url: "https://poe.com",
      icon: "📝",
      description: {
        en: "Platform that provides access to multiple AI models in one place.",
        zh: "在一个平台上提供多种AI模型访问的服务。",
      },
      category: "assistant",
    },

    // Creative AI Category
    {
      id: "midjourney",
      name: "Midjourney",
      url: "https://midjourney.com",
      icon: "🎨",
      description: {
        en: "AI art generator that creates stunning images from text descriptions.",
        zh: "AI艺术生成器，可以根据文本描述创建令人惊叹的图像。",
      },
      category: "creative",
    },
    {
      id: "dalle",
      name: "DALL-E",
      url: "https://openai.com/dall-e-3",
      icon: "🖼️",
      description: {
        en: "OpenAI's image generation model that creates realistic images from text prompts.",
        zh: "OpenAI的图像生成模型，可以根据文本提示创建逼真的图像。",
      },
      category: "creative",
    },
    {
      id: "stable-diffusion",
      name: "Stable Diffusion",
      url: "https://stability.ai",
      icon: "🌈",
      description: {
        en: "Open-source image generation model that can create detailed visuals from text.",
        zh: "开源图像生成模型，可以根据文本创建详细的视觉效果。",
      },
      category: "creative",
    },
    {
      id: "runway",
      name: "Runway",
      url: "https://runwayml.com",
      icon: "🎬",
      description: {
        en: "Creative suite with AI tools for video editing, generation, and visual effects.",
        zh: "创意套件，包含用于视频编辑、生成和视觉效果的AI工具。",
      },
      category: "creative",
    },
    {
      id: "leonardo",
      name: "Leonardo.AI",
      url: "https://leonardo.ai",
      icon: "🎭",
      description: {
        en: "AI image generator with advanced features for creating and editing images.",
        zh: "具有高级功能的AI图像生成器，用于创建和编辑图像。",
      },
      category: "creative",
    },
    {
      id: "elevenlabs",
      name: "ElevenLabs",
      url: "https://elevenlabs.io",
      icon: "🔊",
      description: {
        en: "AI voice generator with realistic text-to-speech capabilities.",
        zh: "具有逼真文本转语音功能的AI语音生成器。",
      },
      category: "creative",
    },

    // Developer Tools Category
    {
      id: "huggingface",
      name: "Hugging Face",
      url: "https://huggingface.co",
      icon: "🤗",
      description: {
        en: "Platform for sharing and using machine learning models and datasets.",
        zh: "用于共享和使用机器学习模型和数据集的平台。",
      },
      category: "developer",
    },
    {
      id: "replicate",
      name: "Replicate",
      url: "https://replicate.com",
      icon: "♾️",
      description: {
        en: "Platform for running machine learning models in the cloud with an API.",
        zh: "通过API在云中运行机器学习模型的平台。",
      },
      category: "developer",
    },
    {
      id: "vercel-ai",
      name: "Vercel AI SDK",
      url: "https://sdk.vercel.ai",
      icon: "▲",
      description: {
        en: "Tools for building AI-powered applications with React and Next.js.",
        zh: "使用React和Next.js构建AI驱动应用程序的工具。",
      },
      category: "developer",
    },
    {
      id: "langchain",
      name: "LangChain",
      url: "https://langchain.com",
      icon: "⛓️",
      description: {
        en: "Framework for developing applications powered by language models.",
        zh: "用于开发由语言模型驱动的应用程序的框架。",
      },
      category: "developer",
    },
    {
      id: "v0",
      name: "v0 by Vercel",
      url: "https://v0.dev",
      icon: "🧩",
      description: {
        en: "AI-powered UI component generator that creates React and Tailwind code.",
        zh: "AI驱动的UI组件生成器，创建React和Tailwind代码。",
      },
      category: "developer",
    },
    {
      id: "github-copilot",
      name: "GitHub Copilot",
      url: "https://github.com/features/copilot",
      icon: "👨‍💻",
      description: {
        en: "AI pair programmer that helps you write code faster with suggestions.",
        zh: "AI配对程序员，通过建议帮助您更快地编写代码。",
      },
      category: "developer",
    },
  ]

  useEffect(() => {
    setIsClient(true)
  }, [])

  const categories = [
    { id: "all", name: { en: "All AI Tools", zh: "所有AI工具" } },
    { id: "assistant", name: { en: "AI Assistants", zh: "AI助手" } },
    { id: "creative", name: { en: "Creative AI", zh: "创意AI" } },
    { id: "developer", name: { en: "Developer Tools", zh: "开发者工具" } },
  ]

  // Filter websites based on category and search query
  const filteredWebsites = aiWebsites.filter((site) => {
    // Filter by category
    if (activeCategory !== "all" && site.category !== activeCategory) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const nameMatch = site.name.toLowerCase().includes(query)
      const descMatch =
        language === "zh"
          ? site.description.zh.toLowerCase().includes(query)
          : site.description.en.toLowerCase().includes(query)

      return nameMatch || descMatch
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
            placeholder={language === "zh" ? "搜索AI工具..." : "Search AI tools..."}
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
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-neutral-500 dark:text-neutral-400">
        {language === "zh" ? `显示 ${filteredWebsites.length} 个AI工具` : `Showing ${filteredWebsites.length} AI tools`}
      </div>

      {/* AI tools grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWebsites.map((site) => (
          <a
            key={site.id}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="neumorphic-card p-4 rounded-lg hover:translate-y-[-5px] transition-transform duration-300 group relative"
          >
            <div className="flex items-start mt-4">
              <div className="text-3xl mr-3">{site.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-100">{site.name}</h3>
                  <ExternalLink size={16} className="text-neutral-500" />
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  {language === "zh" ? site.description.zh : site.description.en}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>

      {filteredWebsites.length === 0 && (
        <div className="text-center p-8 neumorphic-card rounded-lg">
          <p className="text-neutral-600 dark:text-neutral-400">
            {language === "zh"
              ? "没有找到匹配的AI工具。请尝试不同的搜索词或筛选条件。"
              : "No matching AI tools found. Try different search terms or filters."}
          </p>
        </div>
      )}
    </div>
  )
}
