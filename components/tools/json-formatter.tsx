"use client"

import { useState } from "react"

export function JsonFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")

  const formatJson = () => {
    try {
      if (!input.trim()) {
        setOutput("")
        setError("")
        return
      }

      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setError("")
    } catch (e) {
      setError("Invalid JSON: " + (e as Error).message)
      setOutput("")
    }
  }

  const validateJson = () => {
    try {
      if (!input.trim()) {
        setOutput("")
        setError("")
        return
      }

      JSON.parse(input)
      setError("JSON is valid")
      setOutput("")
    } catch (e) {
      setError("Invalid JSON: " + (e as Error).message)
      setOutput("")
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="json-input" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          JSON Input
        </label>
        <textarea
          id="json-input"
          className="w-full h-32 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"example": "Paste your JSON here"}'
        />
      </div>

      <div className="flex space-x-2">
        <button
          onClick={formatJson}
          className="neumorphic-button px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
        >
          Format
        </button>
        <button
          onClick={validateJson}
          className="neumorphic-button px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
        >
          Validate
        </button>
      </div>

      {error && (
        <div
          className={`p-3 rounded-lg ${error.includes("valid") ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"}`}
        >
          {error}
        </div>
      )}

      {output && (
        <div className="space-y-2">
          <label htmlFor="json-output" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Formatted JSON
          </label>
          <pre className="w-full h-32 p-3 overflow-auto rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100">
            <code>{output}</code>
          </pre>
        </div>
      )}
    </div>
  )
}

