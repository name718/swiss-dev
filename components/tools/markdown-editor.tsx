"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  LinkIcon,
  Image,
  Code,
  Quote,
  Undo,
  Redo,
  Eye,
  EyeOff,
  Copy,
  Check,
} from "lucide-react"

export function MarkdownEditor() {
  const [markdown, setMarkdown] = useState<string>("")
  const [preview, setPreview] = useState<string>("")
  const [showPreview, setShowPreview] = useState<boolean>(true)
  const [copied, setCopied] = useState<boolean>(false)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)

  // Initialize with sample markdown if empty
  useEffect(() => {
    if (!markdown) {
      const sampleMarkdown = `# Markdown Editor

## Basic formatting

**Bold text** and *italic text*

## Lists

- Item 1
- Item 2
  - Nested item

1. Ordered item 1
2. Ordered item 2

## Links and Images

[Link to example](https://example.com)

![Image description](https://via.placeholder.com/150)

## Code

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

## Blockquotes

> This is a blockquote.
> It can span multiple lines.
`
      setMarkdown(sampleMarkdown)
      addToHistory(sampleMarkdown)
    }
  }, [])

  // Simple markdown to HTML conversion
  useEffect(() => {
    const convertMarkdownToHtml = (md: string) => {
      // This is a very simplified markdown parser
      // In a real app, you would use a library like marked or remark
      let html = md
        // Headers
        .replace(/^### (.*$)/gim, "<h3>$1</h3>")
        .replace(/^## (.*$)/gim, "<h2>$1</h2>")
        .replace(/^# (.*$)/gim, "<h1>$1</h1>")
        // Bold and italic
        .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/gim, "<em>$1</em>")
        // Links
        .replace(/\[(.*?)\]$$(.*?)$$/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        // Images
        .replace(/!\[(.*?)\]$$(.*?)$$/gim, '<img alt="$1" src="$2" style="max-width: 100%;" />')
        // Lists
        .replace(/^\s*- (.*$)/gim, "<ul><li>$1</li></ul>")
        .replace(/^\s*\d+\. (.*$)/gim, "<ol><li>$1</li></ol>")
        // Code blocks
        .replace(/```([\s\S]*?)```/gim, "<pre><code>$1</code></pre>")
        // Inline code
        .replace(/`(.*?)`/gim, "<code>$1</code>")
        // Blockquotes
        .replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>")
        // Line breaks
        .replace(/\n/gim, "<br />")

      // Fix nested lists (very simplified)
      html = html.replace(/<\/ul>\s*<ul>/gim, "")
      html = html.replace(/<\/ol>\s*<ol>/gim, "")

      return html
    }

    setPreview(convertMarkdownToHtml(markdown))
  }, [markdown])

  // Add to history for undo/redo
  const addToHistory = (text: string) => {
    // If we're not at the end of the history, truncate it
    const newHistory = historyIndex < history.length - 1 ? history.slice(0, historyIndex + 1) : [...history]

    // Add the new state to history
    newHistory.push(text)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  // Handle text changes with debounced history
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setMarkdown(newText)

    // Add to history after a short delay to avoid too many history entries
    const timeoutId = setTimeout(() => {
      addToHistory(newText)
    }, 1000)

    return () => clearTimeout(timeoutId)
  }

  // Insert markdown syntax at cursor position
  const insertMarkdown = (syntax: string, placeholder = "") => {
    const textarea = document.getElementById("markdown-editor") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = markdown.substring(start, end) || placeholder

    let newText
    if (syntax === "**" || syntax === "*" || syntax === "`") {
      // For inline formatting
      newText = markdown.substring(0, start) + syntax + selectedText + syntax + markdown.substring(end)
    } else if (syntax === "- " || syntax === "1. ") {
      // For lists
      newText = markdown.substring(0, start) + syntax + selectedText + markdown.substring(end)
    } else if (syntax === "[](url)") {
      // For links
      newText = markdown.substring(0, start) + "[" + selectedText + "](url)" + markdown.substring(end)
    } else if (syntax === "![](url)") {
      // For images
      newText = markdown.substring(0, start) + "![" + selectedText + "](url)" + markdown.substring(end)
    } else if (syntax === "```\n\n```") {
      // For code blocks
      newText = markdown.substring(0, start) + "```\n" + selectedText + "\n```" + markdown.substring(end)
    } else if (syntax === "> ") {
      // For blockquotes
      newText = markdown.substring(0, start) + "> " + selectedText + markdown.substring(end)
    } else {
      // For headings
      newText = markdown.substring(0, start) + syntax + " " + selectedText + markdown.substring(end)
    }

    setMarkdown(newText)
    addToHistory(newText)

    // Set focus back to textarea
    textarea.focus()
  }

  // Undo and redo functions
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setMarkdown(history[historyIndex - 1])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setMarkdown(history[historyIndex + 1])
    }
  }

  // Copy markdown to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-1 neumorphic-card rounded-lg">
        <button
          onClick={() => insertMarkdown("# ", "Heading")}
          className="neumorphic-button p-2 rounded-lg"
          title="Heading 1"
        >
          <Heading1 size={18} />
        </button>
        <button
          onClick={() => insertMarkdown("## ", "Heading")}
          className="neumorphic-button p-2 rounded-lg"
          title="Heading 2"
        >
          <Heading2 size={18} />
        </button>
        <button
          onClick={() => insertMarkdown("### ", "Heading")}
          className="neumorphic-button p-2 rounded-lg"
          title="Heading 3"
        >
          <Heading3 size={18} />
        </button>
        <div className="mx-1 border-r border-neutral-300 dark:border-neutral-700"></div>
        <button
          onClick={() => insertMarkdown("**", "Bold text")}
          className="neumorphic-button p-2 rounded-lg"
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => insertMarkdown("*", "Italic text")}
          className="neumorphic-button p-2 rounded-lg"
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <div className="mx-1 border-r border-neutral-300 dark:border-neutral-700"></div>
        <button
          onClick={() => insertMarkdown("- ", "List item")}
          className="neumorphic-button p-2 rounded-lg"
          title="Unordered List"
        >
          <List size={18} />
        </button>
        <button
          onClick={() => insertMarkdown("1. ", "List item")}
          className="neumorphic-button p-2 rounded-lg"
          title="Ordered List"
        >
          <ListOrdered size={18} />
        </button>
        <div className="mx-1 border-r border-neutral-300 dark:border-neutral-700"></div>
        <button
          onClick={() => insertMarkdown("[](url)", "Link text")}
          className="neumorphic-button p-2 rounded-lg"
          title="Link"
        >
          <LinkIcon size={18} />
        </button>
        <button
          onClick={() => insertMarkdown("![](url)", "Image description")}
          className="neumorphic-button p-2 rounded-lg"
          title="Image"
        >
          <Image size={18} />
        </button>
        <div className="mx-1 border-r border-neutral-300 dark:border-neutral-700"></div>
        <button
          onClick={() => insertMarkdown("`", "Code")}
          className="neumorphic-button p-2 rounded-lg"
          title="Inline Code"
        >
          <Code size={18} />
        </button>
        <button
          onClick={() => insertMarkdown("```\n\n```", "Code block")}
          className="neumorphic-button p-2 rounded-lg"
          title="Code Block"
        >
          <Code size={18} className="mr-1" />
          <Code size={18} />
        </button>
        <button
          onClick={() => insertMarkdown("> ", "Blockquote")}
          className="neumorphic-button p-2 rounded-lg"
          title="Blockquote"
        >
          <Quote size={18} />
        </button>
        <div className="flex-grow"></div>
        <button
          onClick={undo}
          className={`neumorphic-button p-2 rounded-lg ${historyIndex <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={historyIndex <= 0}
          title="Undo"
        >
          <Undo size={18} />
        </button>
        <button
          onClick={redo}
          className={`neumorphic-button p-2 rounded-lg ${historyIndex >= history.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={historyIndex >= history.length - 1}
          title="Redo"
        >
          <Redo size={18} />
        </button>
        <div className="mx-1 border-r border-neutral-300 dark:border-neutral-700"></div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="neumorphic-button p-2 rounded-lg"
          title={showPreview ? "Hide Preview" : "Show Preview"}
        >
          {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        <button onClick={copyToClipboard} className="neumorphic-button p-2 rounded-lg" title="Copy Markdown">
          {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
        </button>
      </div>

      <div className={`grid ${showPreview ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"} gap-4`}>
        {/* Editor */}
        <div className="space-y-2">
          <label htmlFor="markdown-editor" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Markdown
          </label>
          <textarea
            id="markdown-editor"
            value={markdown}
            onChange={handleChange}
            className="w-full h-[400px] p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600"
            placeholder="Type your markdown here..."
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Preview</label>
            <div
              className="w-full h-[400px] p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100 overflow-auto"
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          </div>
        )}
      </div>

      <div className="text-xs text-neutral-500 dark:text-neutral-400">
        <p>
          Markdown is a lightweight markup language that you can use to add formatting elements to plaintext text
          documents.
        </p>
      </div>
    </div>
  )
}
