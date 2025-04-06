"use client"

import { useState, useEffect } from "react"

export function Clock() {
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
    return `${hours}:${minutes}:${seconds}`
  }

  return (
    <div className="neumorphic-display px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 transition-all duration-300">
      <span className="font-mono text-xl text-neutral-800 dark:text-neutral-100">{formatTime(time)}</span>
    </div>
  )
}

