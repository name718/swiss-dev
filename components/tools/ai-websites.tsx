"use client"

import { useState } from "react"
import { ExternalLink } from "lucide-react"

type AIWebsite = {
  name: string
  url: string
  icon: string
  description: string
  category: string
}

export function AIWebsites() {
  const [activeCategory, setActiveCategory] = useState<string>("all")

  const aiWebsites: AIWebsite[] = [
    {
      name: "ChatGPT",
      url: "https://chat.openai.com",
      icon: "🧠",
      description: "OpenAI's conversational AI model that can engage in natural language dialogues.",
      category: "assistant",
    },
    {
      name: "Claude",
      url: "https://claude.ai",
      icon: "🔮",
      description: "Anthropic's AI assistant designed to be helpful, harmless, and honest.",
      category: "assistant",
    },
    {
      name: "Gemini",
      url: "https://gemini.google.com",
      icon: "💎",
      description: "Google's multimodal AI that can understand and generate text, images, and more.",
      category: "assistant",
    },
    {
      name: "Perplexity",
      url: "https://perplexity.ai",
      icon: "🔍",
      description: "AI-powered search engine that provides comprehensive answers with citations.",
      category: "assistant",
    },
    {
      name: "Midjourney",
      url: "https://midjourney.com",
      icon: "🎨",
      description: "AI art generator that creates stunning images from text descriptions.",
      category: "creative",
    },
    {
      name: "DALL-E",
      url: "https://openai.com/dall-e-3",
      icon: "🖼️",
      description: "OpenAI's image generation model that creates realistic images from text prompts.",
      category: "creative",
    },
    {
      name: "Stable Diffusion",
      url: "https://stability.ai",
      icon: "🌈",
      description: "Open-source image generation model that can create detailed visuals from text.",
      category: "creative",
    },
    {
      name: "Runway",
      url: "https://runwayml.com",
      icon: "🎬",
      description: "Creative suite with AI tools for video editing, generation, and visual effects.",
      category: "creative",
    },
    {
      name: "Hugging Face",
      url: "https://huggingface.co",
      icon: "🤗",
      description: "Platform for sharing and using machine learning models and datasets.",
      category: "developer",
    },
    {
      name: "Replicate",
      url: "https://replicate.com",
      icon: "♾️",
      description: "Platform for running machine learning models in the cloud with an API.",
      category: "developer",
    },
    {
      name: "Vercel AI SDK",
      url: "https://sdk.vercel.ai",
      icon: "▲",
      description: "Tools for building AI-powered applications with React and Next.js.",
      category: "developer",
    },
    {
      name: "LangChain",
      url: "https://langchain.com",
      icon: "⛓️",
      description: "Framework for developing applications powered by language models.",
      category: "developer",
    },
  ]

  const categories = [
    { id: "all", name: "All AI Tools" },
    { id: "assistant", name: "AI Assistants" },
    { id: "creative", name: "Creative AI" },
    { id: "developer", name: "Developer Tools" },
  ]

  const filteredWebsites =
    activeCategory === "all" ? aiWebsites : aiWebsites.filter((site) => site.category === activeCategory)

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
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWebsites.map((site) => (
          <a
            key={site.name}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="neumorphic-card p-4 rounded-lg hover:translate-y-[-5px] transition-transform duration-300"
          >
            <div className="flex items-start">
              <div className="text-3xl mr-3">{site.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-100">{site.name}</h3>
                  <ExternalLink size={16} className="text-neutral-500" />
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{site.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
