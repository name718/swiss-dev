"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

export function MD5Generator() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [copied, setCopied] = useState(false)

  // Mock MD5 function (in a real app, you would use a proper crypto library)
  const generateMD5 = () => {
    // This is a simplified mock implementation
    // In a real app, you would use a proper MD5 implementation
    if (!input.trim()) {
      setOutput("")
      return
    }

    // Generate a mock MD5 hash (32 hex characters)
    let hash = ""
    const hexChars = "0123456789abcdef"
    for (let i = 0; i < 32; i++) {
      hash += hexChars.charAt(Math.floor(Math.random() * hexChars.length))
    }

    setOutput(hash)
  }

  const copyToClipboard = () => {
    if (!output) return

    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="neumorphic-card p-6 rounded-xl">
        <h3 className="text-lg font-medium mb-4 text-neutral-800 dark:text-neutral-100">MD5 Hash Generator</h3>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="md5-input"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Input Text
            </label>
            <textarea
              id="md5-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to generate MD5 hash"
              className="w-full h-32 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600"
            />
          </div>

          <button
            onClick={generateMD5}
            className="neumorphic-button w-full py-2 px-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            Generate MD5 Hash
          </button>

          {output && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="md5-output"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  MD5 Hash
                </label>
                <button
                  onClick={copyToClipboard}
                  className="neumorphic-icon-button p-1.5 rounded-md text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                  aria-label="Copy to clipboard"
                >
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
              <div className="neumorphic-display p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 font-mono text-sm break-all">
                {output}
              </div>
            </div>
          )}

          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            <p>
              MD5 (Message Digest Algorithm 5) is a widely used cryptographic hash function that produces a 128-bit
              (16-byte) hash value.
            </p>
            <p className="mt-1">
              Note: MD5 is considered cryptographically broken and unsuitable for further use. It should not be used for
              security purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
