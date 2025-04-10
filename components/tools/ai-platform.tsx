"use client"

import { useState } from "react"
import { ExternalLink } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

type AIPlatform = {
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

export function AIPlatform() {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const { language, getMenuText } = useLanguage()

  const aiPlatforms: AIPlatform[] = [
    // General AI Platforms
    {
      id: "chatgpt",
      name: "ChatGPT",
      url: "https://chat.openai.com",
      icon: "🧠",
      description: {
        en: "OpenAI's conversational AI model that can engage in natural language dialogues.",
        zh: "OpenAI的对话式AI模型，可以进行自然语言对话。",
      },
      category: "general",
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
      category: "general",
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
      category: "general",
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
      category: "general",
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
      category: "search",
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
      category: "general",
    },

    // Chinese AI Platforms
    {
      id: "deepseek",
      name: "DeepSeek",
      url: "https://chat.deepseek.com",
      icon: "🌊",
      description: {
        en: "Advanced AI assistant with strong capabilities in code generation and problem solving.",
        zh: "先进的AI助手，在代码生成和问题解决方面具有强大能力。",
      },
      category: "general",
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
      category: "general",
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
      category: "general",
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
      category: "general",
    },
    {
      id: "ernie",
      name: "文心一言 (Ernie Bot)",
      url: "https://yiyan.baidu.com",
      icon: "🧠",
      description: {
        en: "Baidu's AI assistant with strong capabilities in Chinese language and knowledge.",
        zh: "百度的AI助手，在中文语言和知识方面具有强大能力。",
      },
      category: "general",
    },

    // Creative AI Platforms
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

    // Developer Platforms
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
  ]

  const categories = [
    { id: "all", name: { en: "All Platforms", zh: "所有平台" } },
    { id: "general", name: { en: "General AI", zh: "通用AI" } },
    { id: "creative", name: { en: "Creative AI", zh: "创意AI" } },
    { id: "developer", name: { en: "Developer Tools", zh: "开发者工具" } },
    { id: "search", name: { en: "Search AI", zh: "搜索AI" } },
  ]

  const filteredPlatforms =
    activeCategory === "all" ? aiPlatforms : aiPlatforms.filter((site) => site.category === activeCategory)

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlatforms.map((platform) => (
          <a
            key={platform.id}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="neumorphic-card p-4 rounded-lg hover:translate-y-[-5px] transition-transform duration-300"
          >
            <div className="flex items-start">
              <div className="text-3xl mr-3">{platform.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-100">{platform.name}</h3>
                  <ExternalLink size={16} className="text-neutral-500" />
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  {language === "zh" ? platform.description.zh : platform.description.en}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
