"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Copy, Check, RefreshCw } from "lucide-react"

type BaseType = "binary" | "octal" | "decimal" | "hexadecimal" | "base64" | "ascii"

export function BaseConverter() {
  const [input, setInput] = useState<string>("")
  const [inputBase, setInputBase] = useState<BaseType>("decimal")
  const [outputs, setOutputs] = useState<Record<BaseType, string>>({
    binary: "",
    octal: "",
    decimal: "",
    hexadecimal: "",
    base64: "",
    ascii: "",
  })
  const [copied, setCopied] = useState<Record<BaseType, boolean>>({
    binary: false,
    octal: false,
    decimal: false,
    hexadecimal: false,
    base64: false,
    ascii: false,
  })
  const [error, setError] = useState<string>("")

  // Base options
  const baseOptions: { value: BaseType; label: string; regex: RegExp }[] = [
    { value: "binary", label: "Binary (Base 2)", regex: /^[01]*$/ },
    { value: "octal", label: "Octal (Base 8)", regex: /^[0-7]*$/ },
    { value: "decimal", label: "Decimal (Base 10)", regex: /^[0-9]*$/ },
    { value: "hexadecimal", label: "Hexadecimal (Base 16)", regex: /^[0-9A-Fa-f]*$/ },
    { value: "base64", label: "Base64", regex: /^[A-Za-z0-9+/=]*$/ },
    { value: "ascii", label: "ASCII Text", regex: /^[\x00-\xFF]*$/ },
  ]

  // Convert input to all bases
  useEffect(() => {
    if (!input) {
      setOutputs({
        binary: "",
        octal: "",
        decimal: "",
        hexadecimal: "",
        base64: "",
        ascii: "",
      })
      setError("")
      return
    }

    try {
      // Validate input against the selected base's regex
      const baseOption = baseOptions.find((option) => option.value === inputBase)
      if (!baseOption?.regex.test(input)) {
        setError(`Invalid characters for ${baseOption?.label}`)
        return
      }

      setError("")

      // Convert to decimal first
      let decimalValue: number

      if (inputBase === "binary") {
        decimalValue = Number.parseInt(input, 2)
      } else if (inputBase === "octal") {
        decimalValue = Number.parseInt(input, 8)
      } else if (inputBase === "decimal") {
        decimalValue = Number.parseInt(input, 10)
      } else if (inputBase === "hexadecimal") {
        decimalValue = Number.parseInt(input, 16)
      } else if (inputBase === "base64") {
        // Base64 to decimal requires multiple steps
        try {
          const decoded = atob(input)
          let result = 0
          for (let i = 0; i < decoded.length; i++) {
            result = result * 256 + decoded.charCodeAt(i)
          }
          decimalValue = result
        } catch (e) {
          setError("Invalid Base64 input")
          return
        }
      } else if (inputBase === "ascii") {
        // ASCII to decimal
        let result = 0
        for (let i = 0; i < input.length; i++) {
          result = result * 256 + input.charCodeAt(i)
        }
        decimalValue = result
      } else {
        decimalValue = 0
      }

      // Check if the conversion resulted in a valid number
      if (isNaN(decimalValue)) {
        setError("Conversion resulted in an invalid number")
        return
      }

      // Convert decimal to all other bases
      const newOutputs = {
        binary: decimalValue.toString(2),
        octal: decimalValue.toString(8),
        decimal: decimalValue.toString(10),
        hexadecimal: decimalValue.toString(16).toUpperCase(),
        base64: btoa(
          String.fromCharCode(
            ...new Uint8Array(
              decimalValue
                .toString()
                .split("")
                .map((char) => char.charCodeAt(0)),
            ),
          ),
        ),
        ascii: String.fromCharCode(
          ...decimalValue
            .toString()
            .split("")
            .map((char) => Number.parseInt(char, 10)),
        ),
      }

      // Special case for ASCII - if the input is ASCII, show the original input
      if (inputBase === "ascii") {
        newOutputs.ascii = input
      }

      // Special case for Base64 - if the input is Base64, show the original input
      if (inputBase === "base64") {
        newOutputs.base64 = input
      }

      setOutputs(newOutputs)
    } catch (e) {
      setError("Error during conversion: " + (e as Error).message)
    }
  }, [input, inputBase])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  // Handle base change
  const handleBaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInputBase(e.target.value as BaseType)
  }

  // Copy output to clipboard
  const copyToClipboard = (base: BaseType) => {
    navigator.clipboard.writeText(outputs[base]).then(() => {
      const newCopied = { ...copied }
      newCopied[base] = true
      setCopied(newCopied)

      setTimeout(() => {
        const resetCopied = { ...copied }
        resetCopied[base] = false
        setCopied(resetCopied)
      }, 2000)
    })
  }

  // Reset all fields
  const resetFields = () => {
    setInput("")
    setInputBase("decimal")
    setOutputs({
      binary: "",
      octal: "",
      decimal: "",
      hexadecimal: "",
      base64: "",
      ascii: "",
    })
    setError("")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <label htmlFor="base-input" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Input
          </label>
          <input
            id="base-input"
            type="text"
            value={input}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600"
            placeholder="Enter a value to convert..."
          />
        </div>

        <div className="md:w-1/3 space-y-2">
          <label htmlFor="base-select" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Input Base
          </label>
          <select
            id="base-select"
            value={inputBase}
            onChange={handleBaseChange}
            className="w-full p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600"
          >
            {baseOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={resetFields}
          className="neumorphic-button px-4 py-2 rounded-lg flex items-center gap-2 text-neutral-700 dark:text-neutral-300"
        >
          <RefreshCw size={16} />
          <span>Reset</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">{error}</div>
      )}

      <div className="space-y-3">
        <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-100">Conversions</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {baseOptions.map((option) => (
            <div key={option.value} className="neumorphic-card p-3 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{option.label}</span>
                <button
                  onClick={() => copyToClipboard(option.value)}
                  className="neumorphic-icon-button p-1.5 rounded-md text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                  disabled={!outputs[option.value]}
                  title="Copy to clipboard"
                >
                  {copied[option.value] ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
              <div className="neumorphic-display p-2 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 font-mono text-sm break-all min-h-[2rem] flex items-center">
                {outputs[option.value] || "-"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-neutral-500 dark:text-neutral-400">
        <p>
          Base conversion allows you to convert numbers between different numeral systems, such as binary (base 2),
          octal (base 8), decimal (base 10), and hexadecimal (base 16).
        </p>
      </div>
    </div>
  )
}
