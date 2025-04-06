"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { JsonFormatter } from "./tools/json-formatter"
import { Calculator } from "./tools/calculator"
import { ProgrammerCalculator } from "./tools/programmer-calculator"
import { CurrencyConverter } from "./tools/currency-converter"
import { MD5Generator } from "./tools/md5-generator"
import { SHAGenerator } from "./tools/sha-generator"
import { AESEncrypt } from "./tools/aes-encrypt"
import { MarkdownGuide } from "./tools/markdown-guide"
import { Translator } from "./tools/translator"
import { ProductivityTools } from "./tools/productivity-tools"
import { GripVertical } from "lucide-react"

// Define the card type
type ToolCard = {
  id: string
  title: string
  component: React.ReactNode
  size: "small" | "medium" | "large"
}

export function CardGrid() {
  // Initial cards configuration
  const initialCards: ToolCard[] = [
    { id: "json", title: "JSON Formatter", component: <JsonFormatter />, size: "medium" },
    { id: "calculator", title: "Scientific Calculator", component: <Calculator />, size: "small" },
    {
      id: "programmer-calculator",
      title: "Programmer Calculator",
      component: <ProgrammerCalculator />,
      size: "medium",
    },
    { id: "currency-converter", title: "Currency Converter", component: <CurrencyConverter />, size: "medium" },
    { id: "md5", title: "MD5 Generator", component: <MD5Generator />, size: "medium" },
    { id: "sha", title: "SHA Generator", component: <SHAGenerator />, size: "medium" },
    { id: "aes", title: "AES Encryption", component: <AESEncrypt />, size: "large" },
    { id: "markdown", title: "Markdown Guide", component: <MarkdownGuide />, size: "medium" },
    { id: "translator", title: "Translator", component: <Translator />, size: "medium" },
    { id: "productivity", title: "摸鱼 Tools", component: <ProductivityTools />, size: "large" },
  ]

  // State for cards and dragging
  const [cards, setCards] = useState<ToolCard[]>(initialCards)
  const [draggedCard, setDraggedCard] = useState<string | null>(null)
  const [draggedOver, setDraggedOver] = useState<string | null>(null)

  // Load saved card order from localStorage on component mount
  useEffect(() => {
    const savedLayout = localStorage.getItem("devToolkitLayout")
    if (savedLayout) {
      try {
        const savedCards = JSON.parse(savedLayout)
        // Ensure all required cards exist (in case we've added new ones since last save)
        const mergedCards = initialCards.map((card) => {
          const savedCard = savedCards.find((sc: ToolCard) => sc.id === card.id)
          return savedCard || card
        })
        setCards(mergedCards)
      } catch (e) {
        console.error("Error loading saved layout:", e)
        setCards(initialCards)
      }
    }
  }, [])

  // Save card order to localStorage when it changes
  useEffect(() => {
    const layoutData = cards.map((card) => ({ id: card.id, size: card.size }))
    localStorage.setItem("devToolkitLayout", JSON.stringify(layoutData))
  }, [cards])

  // Handle drag start
  const handleDragStart = (id: string) => {
    setDraggedCard(id)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    setDraggedOver(id)
  }

  // Handle drop to reorder cards
  const handleDrop = (targetId: string) => {
    if (!draggedCard || draggedCard === targetId) {
      setDraggedCard(null)
      setDraggedOver(null)
      return
    }

    const draggedIndex = cards.findIndex((card) => card.id === draggedCard)
    const targetIndex = cards.findIndex((card) => card.id === targetId)

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const newCards = [...cards]
      const [draggedItem] = newCards.splice(draggedIndex, 1)
      newCards.splice(targetIndex, 0, draggedItem)
      setCards(newCards)
    }

    setDraggedCard(null)
    setDraggedOver(null)
  }

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedCard(null)
    setDraggedOver(null)
  }

  // Resize card
  const resizeCard = (id: string) => {
    const sizes: { [key: string]: "small" | "medium" | "large" } = {
      small: "medium",
      medium: "large",
      large: "small",
    }

    setCards(cards.map((card) => (card.id === id ? { ...card, size: sizes[card.size] } : card)))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div
          key={card.id}
          draggable
          onDragStart={() => handleDragStart(card.id)}
          onDragOver={(e) => handleDragOver(e, card.id)}
          onDrop={() => handleDrop(card.id)}
          onDragEnd={handleDragEnd}
          className={`
            neumorphic-card rounded-xl bg-neutral-100 dark:bg-neutral-800 transition-all duration-300
            ${draggedOver === card.id ? "border-2 border-dashed border-neutral-400" : ""}
            ${card.size === "small" ? "col-span-1" : card.size === "medium" ? "col-span-1 md:col-span-1 lg:col-span-1" : "col-span-1 md:col-span-2 lg:col-span-2"}
          `}
        >
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center transition-colors duration-300">
            <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-100 flex items-center transition-colors duration-300">
              <GripVertical size={18} className="mr-2 cursor-move text-neutral-400" />
              {card.title}
            </h3>
            <button
              onClick={() => resizeCard(card.id)}
              className="neumorphic-icon-button p-1.5 rounded-md text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-all duration-300"
              data-tooltip="Resize card"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3v3a2 2 0 0 1-2 2H3"></path>
                <path d="M21 8h-3a2 2 0 0 1-2-2V3"></path>
                <path d="M3 16h3a2 2 0 0 1 2 2v3"></path>
                <path d="M16 21v-3a2 2 0 0 1 2-2h3"></path>
              </svg>
            </button>
          </div>
          <div className="p-6 transition-all duration-300">{card.component}</div>
        </div>
      ))}
    </div>
  )
}

