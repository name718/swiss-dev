"use client"

import { useState } from "react"

export function MarkdownGuide() {
  const [activeTab, setActiveTab] = useState("basics")

  const markdownExamples = {
    basics: [
      { syntax: "# Heading 1", description: "Creates a top-level heading" },
      { syntax: "## Heading 2", description: "Creates a second-level heading" },
      { syntax: "### Heading 3", description: "Creates a third-level heading" },
      { syntax: "**Bold text**", description: "Makes text bold" },
      { syntax: "*Italic text*", description: "Makes text italic" },
      { syntax: "~~Strikethrough~~", description: "Strikes through text" },
    ],
    lists: [
      { syntax: "- Item 1\n- Item 2\n- Item 3", description: "Creates an unordered list" },
      { syntax: "1. First item\n2. Second item\n3. Third item", description: "Creates an ordered list" },
      { syntax: "- [ ] Task\n- [x] Completed task", description: "Creates a task list" },
      { syntax: "- Main item\n  - Sub-item\n  - Another sub-item", description: "Creates nested lists" },
    ],
    links: [
      { syntax: "[Link text](https://example.com)", description: "Creates a hyperlink" },
      { syntax: "![Alt text](image-url.jpg)", description: "Embeds an image" },
      { syntax: "<https://example.com>", description: "Creates an automatic link" },
      { syntax: "[Reference link][ref]\n\n[ref]: https://example.com", description: "Creates a reference-style link" },
    ],
    code: [
      { syntax: "`inline code`", description: "Formats text as code inline" },
      { syntax: "```\ncode block\n```", description: "Creates a code block" },
      { syntax: "```javascript\nconst x = 'code';\n```", description: "Creates a syntax-highlighted code block" },
      {
        syntax: "    // Indented code block\n    function example() {\n      return true;\n    }",
        description: "Creates an indented code block",
      },
    ],
    tables: [
      {
        syntax: "| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n| Cell 3   | Cell 4   |",
        description: "Creates a simple table",
      },
      {
        syntax: "| Left | Center | Right |\n|:-----|:------:|------:|\n|Left  |Center  |Right  |",
        description: "Creates a table with column alignment",
      },
    ],
  }

  const tabs = [
    { id: "basics", label: "Basics" },
    { id: "lists", label: "Lists" },
    { id: "links", label: "Links" },
    { id: "code", label: "Code" },
    { id: "tables", label: "Tables" },
  ]

  return (
    <div>
      <div className="flex space-x-1 mb-4 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`neumorphic-button px-3 py-1.5 rounded-lg whitespace-nowrap text-sm ${
              activeTab === tab.id ? "neumorphic-button-active" : ""
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {markdownExamples[activeTab as keyof typeof markdownExamples].map((example, index) => (
          <div key={index} className="neumorphic-card p-4 rounded-lg">
            <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{example.description}</div>
            <pre className="bg-neutral-50 dark:bg-neutral-700 p-3 rounded-md text-sm overflow-x-auto">
              <code>{example.syntax}</code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  )
}

