"use client"

import { useState } from "react"

export function Calculator() {
  const [display, setDisplay] = useState("0")
  const [memory, setMemory] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

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
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? digit : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.")
      setWaitingForOperand(false)
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".")
    }
  }

  const performOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(display)

    if (memory === null) {
      setMemory(inputValue)
    } else if (operation) {
      const result = calculate(memory, inputValue, operation)
      setMemory(result)
      setDisplay(String(result))
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
      case "^":
        return Math.pow(a, b)
      default:
        return b
    }
  }

  const calculateResult = () => {
    if (!memory || !operation) return

    const inputValue = Number.parseFloat(display)
    const result = calculate(memory, inputValue, operation)
    setDisplay(String(result))
    setMemory(null)
    setOperation(null)
    setWaitingForOperand(true)
  }

  const specialFunction = (func: string) => {
    const inputValue = Number.parseFloat(display)
    let result: number

    switch (func) {
      case "sqrt":
        result = Math.sqrt(inputValue)
        break
      case "sin":
        result = Math.sin(inputValue * (Math.PI / 180))
        break
      case "cos":
        result = Math.cos(inputValue * (Math.PI / 180))
        break
      case "tan":
        result = Math.tan(inputValue * (Math.PI / 180))
        break
      case "log":
        result = Math.log10(inputValue)
        break
      case "ln":
        result = Math.log(inputValue)
        break
      default:
        return
    }

    setDisplay(String(result))
    setWaitingForOperand(true)
  }

  const buttons = [
    { text: "C", action: clearDisplay, className: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" },
    { text: "AC", action: clearAll, className: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" },
    { text: "√", action: () => specialFunction("sqrt") },
    { text: "÷", action: () => performOperation("÷") },
    { text: "7", action: () => inputDigit("7") },
    { text: "8", action: () => inputDigit("8") },
    { text: "9", action: () => inputDigit("9") },
    { text: "×", action: () => performOperation("×") },
    { text: "4", action: () => inputDigit("4") },
    { text: "5", action: () => inputDigit("5") },
    { text: "6", action: () => inputDigit("6") },
    { text: "-", action: () => performOperation("-") },
    { text: "1", action: () => inputDigit("1") },
    { text: "2", action: () => inputDigit("2") },
    { text: "3", action: () => inputDigit("3") },
    { text: "+", action: () => performOperation("+") },
    { text: "0", action: () => inputDigit("0"), className: "col-span-2" },
    { text: ".", action: inputDecimal },
    {
      text: "=",
      action: calculateResult,
      className: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    },
  ]

  return (
    <div className="max-w-xs mx-auto">
      <div className="neumorphic-display mb-4 p-3 h-14 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 flex items-center justify-end overflow-hidden">
        <span className="text-2xl font-mono text-neutral-800 dark:text-neutral-100 truncate">{display}</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {buttons.map((button, index) => (
          <button
            key={index}
            onClick={button.action}
            className={`neumorphic-button p-3 rounded-lg text-center ${button.className || ""}`}
          >
            {button.text}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 mt-2">
        <button onClick={() => specialFunction("sin")} className="neumorphic-button p-2 rounded-lg text-center text-sm">
          sin
        </button>
        <button onClick={() => specialFunction("cos")} className="neumorphic-button p-2 rounded-lg text-center text-sm">
          cos
        </button>
        <button onClick={() => specialFunction("tan")} className="neumorphic-button p-2 rounded-lg text-center text-sm">
          tan
        </button>
        <button onClick={() => specialFunction("log")} className="neumorphic-button p-2 rounded-lg text-center text-sm">
          log
        </button>
        <button onClick={() => specialFunction("ln")} className="neumorphic-button p-2 rounded-lg text-center text-sm">
          ln
        </button>
        <button onClick={() => performOperation("^")} className="neumorphic-button p-2 rounded-lg text-center text-sm">
          x^y
        </button>
      </div>
    </div>
  )
}
