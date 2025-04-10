"use client"

import { useState } from "react"

export function ProgrammerCalculator() {
  const [display, setDisplay] = useState("0")
  const [baseMode, setBaseMode] = useState<"HEX" | "DEC" | "OCT" | "BIN">("DEC")
  const [memory, setMemory] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  // Convert display value based on current base mode
  const getDecimalValue = (): number => {
    switch (baseMode) {
      case "HEX":
        return Number.parseInt(display, 16)
      case "DEC":
        return Number.parseInt(display, 10)
      case "OCT":
        return Number.parseInt(display, 8)
      case "BIN":
        return Number.parseInt(display, 2)
      default:
        return Number.parseInt(display, 10)
    }
  }

  // Format display value based on current base mode
  const formatValue = (value: number): string => {
    if (isNaN(value)) return "Error"

    switch (baseMode) {
      case "HEX":
        return value.toString(16).toUpperCase()
      case "DEC":
        return value.toString(10)
      case "OCT":
        return value.toString(8)
      case "BIN":
        return value.toString(2)
      default:
        return value.toString(10)
    }
  }

  const clearDisplay = () => {
    setDisplay("0")
    setWaitingForOperand(false)
  }

  const clearAll = () => {
    setDisplay("0")
    setMemory(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const inputDigit = (digit: string) => {
    // Check if digit is valid for current base
    const isValidDigit = (): boolean => {
      if (baseMode === "BIN" && !["0", "1"].includes(digit)) return false
      if (baseMode === "OCT" && Number.parseInt(digit) >= 8) return false
      if (baseMode === "DEC" && Number.parseInt(digit) >= 10) return false
      return true
    }

    if (!isValidDigit()) return

    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? digit : display + digit)
    }
  }

  const performOperation = (nextOperation: string) => {
    const inputValue = getDecimalValue()

    if (memory === null) {
      setMemory(inputValue)
    } else if (operation) {
      const result = calculate(memory, inputValue, operation)
      setMemory(result)
      setDisplay(formatValue(result))
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case "+":
        return a + b
      case "-":
        return a - b
      case "×":
        return a * b
      case "÷":
        return a / b
      case "AND":
        return a & b
      case "OR":
        return a | b
      case "XOR":
        return a ^ b
      case "<<":
        return a << b
      case ">>":
        return a >> b
      default:
        return b
    }
  }

  const calculateResult = () => {
    if (!memory || !operation) return

    const inputValue = getDecimalValue()
    const result = calculate(memory, inputValue, operation)
    setDisplay(formatValue(result))
    setMemory(null)
    setOperation(null)
    setWaitingForOperand(true)
  }

  const performBitwiseOperation = (op: string) => {
    const value = getDecimalValue()
    let result: number

    switch (op) {
      case "NOT":
        result = ~value
        break
      case "LSH1":
        result = value << 1
        break
      case "RSH1":
        result = value >> 1
        break
      default:
        return
    }

    setDisplay(formatValue(result))
    setWaitingForOperand(true)
  }

  const changeBase = (newBase: "HEX" | "DEC" | "OCT" | "BIN") => {
    if (baseMode === newBase) return

    try {
      const decimalValue = getDecimalValue()
      setBaseMode(newBase)
      setDisplay(formatValue(decimalValue))
    } catch (e) {
      setDisplay("Error")
    }
  }

  // Define buttons based on current base mode
  const getButtons = () => {
    const baseButtons = [
      {
        text: "HEX",
        action: () => changeBase("HEX"),
        className: baseMode === "HEX" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "",
      },
      {
        text: "DEC",
        action: () => changeBase("DEC"),
        className: baseMode === "DEC" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "",
      },
      {
        text: "OCT",
        action: () => changeBase("OCT"),
        className: baseMode === "OCT" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "",
      },
      {
        text: "BIN",
        action: () => changeBase("BIN"),
        className: baseMode === "BIN" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "",
      },
    ]

    const hexButtons = [
      { text: "A", action: () => inputDigit("A"), disabled: baseMode !== "HEX" },
      { text: "B", action: () => inputDigit("B"), disabled: baseMode !== "HEX" },
      { text: "C", action: () => inputDigit("C"), disabled: baseMode !== "HEX" },
      { text: "D", action: () => inputDigit("D"), disabled: baseMode !== "HEX" },
      { text: "E", action: () => inputDigit("E"), disabled: baseMode !== "HEX" },
      { text: "F", action: () => inputDigit("F"), disabled: baseMode !== "HEX" },
    ]

    const operationButtons = [
      { text: "AND", action: () => performOperation("AND") },
      { text: "OR", action: () => performOperation("OR") },
      { text: "XOR", action: () => performOperation("XOR") },
      { text: "NOT", action: () => performBitwiseOperation("NOT") },
      { text: "<<", action: () => performOperation("<<") },
      { text: ">>", action: () => performOperation(">>") },
    ]

    const standardButtons = [
      { text: "C", action: clearDisplay, className: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" },
      { text: "AC", action: clearAll, className: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" },
      { text: "÷", action: () => performOperation("÷") },
      { text: "×", action: () => performOperation("×") },
      { text: "7", action: () => inputDigit("7"), disabled: baseMode === "BIN" },
      { text: "8", action: () => inputDigit("8"), disabled: baseMode === "BIN" || baseMode === "OCT" },
      { text: "9", action: () => inputDigit("9"), disabled: baseMode === "BIN" || baseMode === "OCT" },
      { text: "-", action: () => performOperation("-") },
      { text: "4", action: () => inputDigit("4"), disabled: baseMode === "BIN" },
      { text: "5", action: () => inputDigit("5"), disabled: baseMode === "BIN" },
      { text: "6", action: () => inputDigit("6"), disabled: baseMode === "BIN" },
      { text: "+", action: () => performOperation("+") },
      { text: "1", action: () => inputDigit("1") },
      { text: "2", action: () => inputDigit("2"), disabled: baseMode === "BIN" },
      { text: "3", action: () => inputDigit("3"), disabled: baseMode === "BIN" },
      {
        text: "=",
        action: calculateResult,
        className: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
      },
      { text: "0", action: () => inputDigit("0"), className: "col-span-2" },
    ]

    return { baseButtons, hexButtons, operationButtons, standardButtons }
  }

  const { baseButtons, hexButtons, operationButtons, standardButtons } = getButtons()

  return (
    <div className="max-w-md mx-auto">
      <div className="neumorphic-display mb-4 p-3 h-14 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 flex items-center justify-end overflow-hidden">
        <span className="text-2xl font-mono text-neutral-800 dark:text-neutral-100 truncate">{display}</span>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-2">
        {baseButtons.map((button, index) => (
          <button
            key={index}
            onClick={button.action}
            className={`neumorphic-button p-2 rounded-lg text-center text-sm ${button.className || ""}`}
          >
            {button.text}
          </button>
        ))}
      </div>

      {baseMode === "HEX" && (
        <div className="grid grid-cols-6 gap-2 mb-2">
          {hexButtons.map((button, index) => (
            <button
              key={index}
              onClick={button.action}
              disabled={button.disabled}
              className={`neumorphic-button p-2 rounded-lg text-center text-sm ${button.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {button.text}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 mb-2">
        {operationButtons.map((button, index) => (
          <button key={index} onClick={button.action} className="neumorphic-button p-2 rounded-lg text-center text-sm">
            {button.text}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {standardButtons.map((button, index) => (
          <button
            key={index}
            onClick={button.action}
            disabled={button.disabled}
            className={`neumorphic-button p-2 rounded-lg text-center ${button.className || ""} ${button.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {button.text}
          </button>
        ))}
      </div>
    </div>
  )
}
