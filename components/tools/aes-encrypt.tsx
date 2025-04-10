"use client"

import { useState } from "react"
import { Copy, Check, Lock, Unlock, Eye, EyeOff } from "lucide-react"

export function AESEncrypt() {
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt")
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)
  const [bits, setBits] = useState<"128" | "192" | "256">("256")

  // Mock AES function (in a real app, you would use a proper crypto library)
  const processAES = () => {
    if (!input.trim() || !password.trim()) {
      setOutput("")
      return
    }

    // This is just a mock implementation
    if (mode === "encrypt") {
      // In a real app, this would use actual AES encryption
      const mockEncrypted = btoa(input) // Simple base64 encoding as a mock
      setOutput(mockEncrypted)
    } else {
      try {
        // In a real app, this would use actual AES decryption
        const mockDecrypted = atob(input) // Simple base64 decoding as a mock
        setOutput(mockDecrypted)
      } catch (e) {
        setOutput("Error: Invalid input for decryption")
      }
    }
  }

  const copyToClipboard = () => {
    if (!output) return

    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const toggleMode = () => {
    setMode(mode === "encrypt" ? "decrypt" : "encrypt")
    setInput("")
    setOutput("")
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="neumorphic-card p-6 rounded-xl">
        <h3 className="text-lg font-medium mb-4 text-neutral-800 dark:text-neutral-100">AES Encryption/Decryption</h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="grid grid-cols-2 gap-2 w-1/2">
              <button
                onClick={() => setMode("encrypt")}
                className={`neumorphic-button py-2 px-3 rounded-lg flex items-center justify-center gap-1 ${
                  mode === "encrypt" ? "neumorphic-button-active" : ""
                }`}
              >
                <Lock size={16} />
                <span>Encrypt</span>
              </button>
              <button
                onClick={() => setMode("decrypt")}
                className={`neumorphic-button py-2 px-3 rounded-lg flex items-center justify-center gap-1 ${
                  mode === "decrypt" ? "neumorphic-button-active" : ""
                }`}
              >
                <Unlock size={16} />
                <span>Decrypt</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1">
              {(["128", "192", "256"] as const).map((bitSize) => (
                <button
                  key={bitSize}
                  onClick={() => setBits(bitSize)}
                  className={`neumorphic-button py-1 px-2 rounded-lg text-xs ${
                    bits === bitSize ? "neumorphic-button-active" : ""
                  }`}
                >
                  {bitSize} bit
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="aes-input"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
            >
              {mode === "encrypt" ? "Text to Encrypt" : "Text to Decrypt"}
            </label>
            <textarea
              id="aes-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "encrypt" ? "Enter text to encrypt" : "Enter text to decrypt"}
              className="w-full h-24 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600"
            />
          </div>

          <div>
            <label
              htmlFor="aes-password"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="aes-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter encryption/decryption password"
                className="w-full p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            onClick={processAES}
            className="neumorphic-button w-full py-2 px-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            {mode === "encrypt" ? "Encrypt" : "Decrypt"}
          </button>

          {output && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="aes-output"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  {mode === "encrypt" ? "Encrypted Text" : "Decrypted Text"}
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
              AES (Advanced Encryption Standard) is a symmetric encryption algorithm widely used to secure sensitive
              data.
            </p>
            <p className="mt-1">
              AES-256 is considered highly secure and is used by governments and organizations worldwide to protect
              classified information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
