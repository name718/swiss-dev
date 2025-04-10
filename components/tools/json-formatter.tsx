"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronRight, ChevronDown, Copy, Check, Code, FileCode, Minimize, Maximize, RefreshCw } from "lucide-react"

type JsonNode = {
  key: string
  value: any
  type: string
  expanded: boolean
  path: string
  children?: JsonNode[]
  isArrayItem?: boolean
  arrayIndex?: number
}

export function JsonFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<JsonNode | null>(null)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [indentSize, setIndentSize] = useState(2)
  const [viewMode, setViewMode] = useState<"tree" | "raw">("tree")
  const [expandAll, setExpandAll] = useState(false)
  const [rawOutput, setRawOutput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Process JSON when input changes
  useEffect(() => {
    if (!input.trim()) {
      setOutput(null)
      setRawOutput("")
      setError("")
      return
    }

    try {
      // Try to parse the JSON
      const parsed = JSON.parse(input)
      setRawOutput(JSON.stringify(parsed, null, indentSize))

      // Convert to tree structure
      const rootNode = createJsonTree(parsed, "", "$")
      setOutput(rootNode)
      setError("")
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`)
      setOutput(null)
      setRawOutput("")
    }
  }, [input, indentSize])

  // Create a tree structure from JSON
  const createJsonTree = (
    value: any,
    key: string,
    path: string,
    isArrayItem = false,
    arrayIndex?: number,
  ): JsonNode => {
    const type = Array.isArray(value) ? "array" : typeof value

    if (type === "object" && value !== null) {
      const isArray = Array.isArray(value)
      const entries = isArray ? value.map((item, index) => [index.toString(), item]) : Object.entries(value)

      const children = entries.map(([k, v], index) => {
        const childPath = isArray ? `${path}[${index}]` : `${path}.${k}`
        return createJsonTree(v, k, childPath, isArray, isArray ? index : undefined)
      })

      return {
        key,
        value: isArray ? `Array(${children.length})` : `Object(${Object.keys(value).length})`,
        type,
        expanded: true,
        path,
        children,
        isArrayItem,
        arrayIndex,
      }
    }

    // Handle primitive values
    return {
      key,
      value: value === null ? "null" : value,
      type: value === null ? "null" : typeof value,
      expanded: true,
      path,
      isArrayItem,
      arrayIndex,
    }
  }

  // Toggle node expansion
  const toggleNode = (path: string) => {
    if (!output) return

    const toggleNodeRecursive = (node: JsonNode): JsonNode => {
      if (node.path === path) {
        return { ...node, expanded: !node.expanded }
      }

      if (node.children) {
        return {
          ...node,
          children: node.children.map(toggleNodeRecursive),
        }
      }

      return node
    }

    setOutput(toggleNodeRecursive(output))
  }

  // Toggle all nodes
  const toggleAllNodes = () => {
    if (!output) return

    const newExpandAll = !expandAll
    setExpandAll(newExpandAll)

    const toggleAllNodesRecursive = (node: JsonNode): JsonNode => {
      if (node.children) {
        return {
          ...node,
          expanded: newExpandAll,
          children: node.children.map(toggleAllNodesRecursive),
        }
      }

      return { ...node, expanded: newExpandAll }
    }

    setOutput(toggleAllNodesRecursive(output))
  }

  // Format JSON
  const formatJson = () => {
    try {
      if (!input.trim()) {
        setOutput(null)
        setRawOutput("")
        setError("")
        return
      }

      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, indentSize)
      setInput(formatted)
      setRawOutput(formatted)

      // Convert to tree structure
      const rootNode = createJsonTree(parsed, "", "$")
      setOutput(rootNode)
      setError("")
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`)
      setOutput(null)
      setRawOutput("")
    }
  }

  // Validate JSON
  const validateJson = () => {
    try {
      if (!input.trim()) {
        setOutput(null)
        setRawOutput("")
        setError("")
        return
      }

      JSON.parse(input)
      setError("JSON is valid")
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`)
    }
  }

  // Minify JSON
  const minifyJson = () => {
    try {
      if (!input.trim()) {
        setOutput(null)
        setRawOutput("")
        setError("")
        return
      }

      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setInput(minified)
      setRawOutput(minified)

      // Convert to tree structure
      const rootNode = createJsonTree(parsed, "", "$")
      setOutput(rootNode)
      setError("")
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`)
      setOutput(null)
      setRawOutput("")
    }
  }

  // Copy output to clipboard
  const copyOutput = () => {
    if (viewMode === "raw" && rawOutput) {
      navigator.clipboard
        .writeText(rawOutput)
        .then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
        .catch((err) => {
          setError(`Failed to copy: ${err.message}`)
        })
    } else if (output) {
      const jsonString = JSON.stringify(JSON.parse(input), null, indentSize)
      navigator.clipboard
        .writeText(jsonString)
        .then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
        .catch((err) => {
          setError(`Failed to copy: ${err.message}`)
        })
    }
  }

  // Clear all
  const clearAll = () => {
    setInput("")
    setOutput(null)
    setRawOutput("")
    setError("")
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  // Insert sample JSON
  const insertSample = () => {
    const sample = {
      name: "Zhang San",
      age: 30,
      isStudent: false,
      hobbies: ["Reading", "Travel", "Programming"],
      address: {
        city: "Beijing",
        postalCode: "100000",
      },
    }

    setInput(JSON.stringify(sample, null, 2))
  }

  // Render a JSON node
  const renderJsonNode = (node: JsonNode, level = 0) => {
    const indent = level * 16
    const hasChildren = node.children && node.children.length > 0
    const isArrayItem = node.isArrayItem

    return (
      <div key={node.path} style={{ paddingLeft: node.key ? indent : 0 }} className="py-0.5">
        <div className="flex items-start">
          {hasChildren && (
            <button
              onClick={() => toggleNode(node.path)}
              className="p-1 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 focus:outline-none"
              aria-label={node.expanded ? "Collapse" : "Expand"}
            >
              {node.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}

          {!hasChildren && <div className="w-6"></div>}

          <div className="flex-1 overflow-hidden">
            {/* Display array index or object key */}
            {node.key && !node.isArrayItem && (
              <span className="text-blue-600 dark:text-blue-400 mr-1">"{node.key}":</span>
            )}

            {/* Display array index for array items */}
            {isArrayItem && typeof node.arrayIndex === "number" && (
              <span className="text-purple-600 dark:text-purple-400 mr-1">[{node.arrayIndex}]:</span>
            )}

            {/* Display the value based on its type */}
            {node.type === "string" ? (
              <span className="text-green-600 dark:text-green-400">"{node.value}"</span>
            ) : node.type === "number" ? (
              <span className="text-orange-600 dark:text-orange-400">{node.value}</span>
            ) : node.type === "boolean" ? (
              <span className="text-purple-600 dark:text-purple-400">{String(node.value)}</span>
            ) : node.type === "null" ? (
              <span className="text-red-600 dark:text-red-400">null</span>
            ) : node.type === "array" ? (
              <span className="text-neutral-600 dark:text-neutral-400">{node.value}</span>
            ) : node.type === "object" ? (
              <span className="text-neutral-600 dark:text-neutral-400">{node.value}</span>
            ) : (
              <span className="text-neutral-600 dark:text-neutral-400">{String(node.value)}</span>
            )}
          </div>
        </div>

        {hasChildren && node.expanded && (
          <div className="mt-0.5">{node.children!.map((child) => renderJsonNode(child, level + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="json-input" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              JSON Input
            </label>
            <button onClick={insertSample} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              Insert Sample
            </button>
          </div>
          <textarea
            id="json-input"
            ref={textareaRef}
            className="w-full h-64 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600 font-mono text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"example": "Paste your JSON here"}'
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={formatJson}
          className="neumorphic-button px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center gap-2"
        >
          <FileCode size={16} />
          <span>Format</span>
        </button>
        <button
          onClick={validateJson}
          className="neumorphic-button px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center gap-2"
        >
          <Code size={16} />
          <span>Validate</span>
        </button>
        <button
          onClick={minifyJson}
          className="neumorphic-button px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center gap-2"
        >
          <Minimize size={16} />
          <span>Minify</span>
        </button>
        <button
          onClick={clearAll}
          className="neumorphic-button px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center gap-2"
        >
          <RefreshCw size={16} />
          <span>Clear</span>
        </button>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-2">
            <label htmlFor="indent-size" className="text-sm text-neutral-600 dark:text-neutral-400">
              Indent:
            </label>
            <select
              id="indent-size"
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className="neumorphic-button px-2 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm"
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="8">8 spaces</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="view-mode" className="text-sm text-neutral-600 dark:text-neutral-400">
              View:
            </label>
            <select
              id="view-mode"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as "tree" | "raw")}
              className="neumorphic-button px-2 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm"
            >
              <option value="tree">Tree</option>
              <option value="raw">Raw</option>
            </select>
          </div>

          {output && (
            <>
              <button
                onClick={toggleAllNodes}
                className="neumorphic-button p-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                title={expandAll ? "Collapse All" : "Expand All"}
              >
                {expandAll ? <Minimize size={16} /> : <Maximize size={16} />}
              </button>

              <button
                onClick={copyOutput}
                className="neumorphic-button p-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                title="Copy to clipboard"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div
          className={`p-3 rounded-lg ${error.includes("valid") || error.includes("Copied") ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"}`}
        >
          {error}
        </div>
      )}

      {(output || rawOutput) && (
        <div className="space-y-2">
          <label htmlFor="json-output" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {viewMode === "tree" ? "JSON Tree View" : "Formatted JSON"}
          </label>

          <div className="w-full h-80 overflow-auto rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100 font-mono text-sm p-3">
            {viewMode === "tree" && output ? (
              <div className="json-tree">{renderJsonNode(output)}</div>
            ) : (
              <pre className="whitespace-pre-wrap">
                <code>{rawOutput}</code>
              </pre>
            )}
          </div>
        </div>
      )}

      <div className="text-xs text-neutral-500 dark:text-neutral-400">
        <p>Tips:</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Click on the arrows to expand/collapse nodes in tree view</li>
          <li>Use the "Expand All" / "Collapse All" button to toggle all nodes at once</li>
          <li>Switch between Tree and Raw view modes for different visualization</li>
          <li>Adjust indentation size to your preference</li>
        </ul>
      </div>
    </div>
  )
}
