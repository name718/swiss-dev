"use client"

import { useState } from "react"
import { Clock, Coffee, Timer } from "lucide-react"

export function ProductivityTools() {
  const [activeTab, setActiveTab] = useState("pomodoro")
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25)
  const [pomodoroSeconds, setPomodoroSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [breakType, setBreakType] = useState("short") // 'short' or 'long'

  // Mock function for starting/pausing the timer
  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  // Mock function for resetting the timer
  const resetTimer = () => {
    setPomodoroMinutes(25)
    setPomodoroSeconds(0)
    setIsRunning(false)
  }

  // Mock function for taking a break
  const takeBreak = (type: string) => {
    setBreakType(type)
    if (type === "short") {
      setPomodoroMinutes(5)
    } else {
      setPomodoroMinutes(15)
    }
    setPomodoroSeconds(0)
    setIsRunning(false)
  }

  return (
    <div>
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab("pomodoro")}
          className={`neumorphic-button px-3 py-1.5 rounded-lg flex items-center gap-1 ${
            activeTab === "pomodoro" ? "neumorphic-button-active" : ""
          }`}
        >
          <Timer size={16} />
          <span>Pomodoro</span>
        </button>
        <button
          onClick={() => setActiveTab("break")}
          className={`neumorphic-button px-3 py-1.5 rounded-lg flex items-center gap-1 ${
            activeTab === "break" ? "neumorphic-button-active" : ""
          }`}
        >
          <Coffee size={16} />
          <span>摸鱼 Break</span>
        </button>
        <button
          onClick={() => setActiveTab("clock")}
          className={`neumorphic-button px-3 py-1.5 rounded-lg flex items-center gap-1 ${
            activeTab === "clock" ? "neumorphic-button-active" : ""
          }`}
        >
          <Clock size={16} />
          <span>World Clock</span>
        </button>
      </div>

      {activeTab === "pomodoro" && (
        <div className="text-center">
          <div className="neumorphic-display inline-block px-8 py-4 rounded-xl mb-4">
            <span className="text-4xl font-mono">
              {String(pomodoroMinutes).padStart(2, "0")}:{String(pomodoroSeconds).padStart(2, "0")}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={toggleTimer}
              className={`neumorphic-button py-2 rounded-lg ${isRunning ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" : "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"}`}
            >
              {isRunning ? "Pause" : "Start"}
            </button>
            <button onClick={resetTimer} className="neumorphic-button py-2 rounded-lg">
              Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => takeBreak("short")} className="neumorphic-button py-2 rounded-lg text-sm">
              Short Break (5m)
            </button>
            <button onClick={() => takeBreak("long")} className="neumorphic-button py-2 rounded-lg text-sm">
              Long Break (15m)
            </button>
          </div>
        </div>
      )}

      {activeTab === "break" && (
        <div className="space-y-4">
          <p className="text-center text-neutral-700 dark:text-neutral-300">
            Take a break! Here are some relaxing activities:
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="neumorphic-card p-3 rounded-lg text-center">
              <Coffee className="mx-auto mb-2" size={24} />
              <p className="text-sm">Coffee Break</p>
            </div>
            <div className="neumorphic-card p-3 rounded-lg text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto mb-2"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <p className="text-sm">Meditation</p>
            </div>
            <div className="neumorphic-card p-3 rounded-lg text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto mb-2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
              <p className="text-sm">Stretch</p>
            </div>
            <div className="neumorphic-card p-3 rounded-lg text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto mb-2"
              >
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
              </svg>
              <p className="text-sm">Music</p>
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Remember: Taking breaks improves productivity!
            </p>
          </div>
        </div>
      )}

      {activeTab === "clock" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="neumorphic-card p-3 rounded-lg">
              <p className="text-sm font-medium mb-1">New York</p>
              <p className="text-lg font-mono">
                {new Date().toLocaleTimeString("en-US", { timeZone: "America/New_York" })}
              </p>
            </div>
            <div className="neumorphic-card p-3 rounded-lg">
              <p className="text-sm font-medium mb-1">London</p>
              <p className="text-lg font-mono">
                {new Date().toLocaleTimeString("en-US", { timeZone: "Europe/London" })}
              </p>
            </div>
            <div className="neumorphic-card p-3 rounded-lg">
              <p className="text-sm font-medium mb-1">Tokyo</p>
              <p className="text-lg font-mono">{new Date().toLocaleTimeString("en-US", { timeZone: "Asia/Tokyo" })}</p>
            </div>
            <div className="neumorphic-card p-3 rounded-lg">
              <p className="text-sm font-medium mb-1">Sydney</p>
              <p className="text-lg font-mono">
                {new Date().toLocaleTimeString("en-US", { timeZone: "Australia/Sydney" })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
