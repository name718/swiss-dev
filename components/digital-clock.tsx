"use client"

import { useState, useEffect } from "react"

export function DigitalClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    const seconds = date.getSeconds().toString().padStart(2, "0")
    return { hours, minutes, seconds }
  }

  const { hours, minutes, seconds } = formatTime(time)

  return (
    <div className="neumorphic-display px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center transition-all duration-300">
      <div className="flex items-center">
        <div className="flex flex-col items-center">
          <div className="text-xs text-neutral-500 dark:text-neutral-400">HH</div>
          <div className="text-2xl font-mono font-bold text-neutral-800 dark:text-neutral-100">{hours}</div>
        </div>

        <div className="mx-1 text-2xl font-bold text-neutral-600 dark:text-neutral-400 animate-pulse">:</div>

        <div className="flex flex-col items-center">
          <div className="text-xs text-neutral-500 dark:text-neutral-400">MM</div>
          <div className="text-2xl font-mono font-bold text-neutral-800 dark:text-neutral-100">{minutes}</div>
        </div>

        <div className="mx-1 text-2xl font-bold text-neutral-600 dark:text-neutral-400 animate-pulse">:</div>

        <div className="flex flex-col items-center">
          <div className="text-xs text-neutral-500 dark:text-neutral-400">SS</div>
          <div className="text-2xl font-mono font-bold text-neutral-800 dark:text-neutral-100">{seconds}</div>
        </div>
      </div>
    </div>
  )
}
