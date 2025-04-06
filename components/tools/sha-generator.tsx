"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

export function SHAGenerator() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [shaType, setShaType] = useState<"SHA-1" | "SHA-256" | "SHA-384" | "SHA-512">("SHA-256")
  const [copied, setCopied] = useState(false)

  // Mock SHA function (in a real app, you would use a proper crypto library)
  const generateSHA = () => {
    if (!input.trim()) {
      setOutput("")
      return
    }

    // Generate a mock SHA hash based on the selected type
    let hashLength: number
    switch (shaType) {
      case "SHA-1":
        hashLength = 40
        break
      case "SHA-256":
        hashLength = 64
        break
      case "SHA-384":
        hashLength = 96
        break
      case "SHA-512":
        hashLength = 128
        break
      default:
        hashLength = 64
    }

    // Generate a mock hash with the appropriate length
    let hash = ""
    const hexChars = "0123456789abcdef"
    for (let i = 0; i < hashLength; i++) {
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
        <h3 className="text-lg font-medium mb-4 text-neutral-800 dark:text-neutral-100">SHA Hash Generator</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              SHA Algorithm
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setShaType(type)}
                  className={`neumorphic-button py-2 px-3 rounded-lg text-sm ${
                    shaType === type ? "neumorphic-button-active" : ""
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="sha-input"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Input Text
            </label>
            <textarea
              id="sha-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Enter text to generate ${shaType} hash`}
              className="w-full h-32 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600"
            />
          </div>

          <button
            onClick={generateSHA}
            className="neumorphic-button w-full py-2 px-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            Generate {shaType} Hash
          </button>

          {output && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="sha-output"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  {shaType} Hash
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
            <p>SHA (Secure Hash Algorithm) is a family of cryptographic hash functions designed by the NSA.</p>
            <p className="mt-1">
              SHA-256 and above are considered secure for most applications. SHA-1 is no longer considered secure
              against well-funded attackers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

