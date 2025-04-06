"use client"

import { useState, useEffect } from "react"

export function AnalogClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  // Calculate the rotation angles for the clock hands
  const secondsRatio = time.getSeconds() / 60
  const minutesRatio = (secondsRatio + time.getMinutes()) / 60
  const hoursRatio = (minutesRatio + time.getHours()) / 12

  // Convert ratios to degrees
  const hourDegrees = hoursRatio * 360
  const minuteDegrees = minutesRatio * 360
  const secondDegrees = secondsRatio * 360

  return (
    <div className="relative">
      <div className="neumorphic-watch relative w-12 h-12 md:w-16 md:h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 transition-all duration-300 flex items-center justify-center">
        {/* Watch bezel */}
        <div className="absolute inset-0.5 rounded-full border-2 border-neutral-200 dark:border-neutral-700 transition-colors duration-300" />

        {/* Watch face */}
        <div className="absolute inset-[0.35rem] rounded-full bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300 flex items-center justify-center">
          {/* Hour markers */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-neutral-800 dark:bg-neutral-200 transition-colors duration-300"
              style={{
                transform: `rotate(${i * 30}deg) translateY(-40%)`,
                height: i % 3 === 0 ? "0.5rem" : "0.25rem",
                width: i % 3 === 0 ? "0.125rem" : "0.0625rem",
                left: "calc(50% - 0.0625rem)",
                top: "50%",
              }}
            />
          ))}

          {/* Brand name */}
          <div className="absolute text-[0.4rem] md:text-[0.5rem] font-light text-neutral-600 dark:text-neutral-400 top-[35%] transition-colors duration-300">
            DevTools
          </div>

          {/* Hour hand */}
          <div
            className="absolute w-[0.125rem] h-[30%] bg-neutral-800 dark:bg-neutral-200 rounded-full origin-bottom transition-transform duration-300"
            style={{
              transform: `rotate(${hourDegrees}deg)`,
              bottom: "50%",
              left: "calc(50% - 0.0625rem)",
            }}
          />

          {/* Minute hand */}
          <div
            className="absolute w-[0.09rem] h-[40%] bg-neutral-700 dark:bg-neutral-300 rounded-full origin-bottom transition-transform duration-300"
            style={{
              transform: `rotate(${minuteDegrees}deg)`,
              bottom: "50%",
              left: "calc(50% - 0.045rem)",
            }}
          />

          {/* Second hand */}
          <div
            className="absolute w-[0.05rem] h-[45%] bg-red-500 rounded-full origin-bottom"
            style={{
              transform: `rotate(${secondDegrees}deg)`,
              bottom: "50%",
              left: "calc(50% - 0.025rem)",
              transition: "transform 0.1s cubic-bezier(0.4, 2.08, 0.55, 0.44)",
            }}
          />

          {/* Center pin */}
          <div className="absolute w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-red-500 z-10" />
        </div>

        {/* Watch crown */}
        <div className="absolute w-1 h-2 bg-neutral-300 dark:bg-neutral-600 rounded-sm right-[-0.25rem] top-[45%] transition-colors duration-300" />
      </div>

      {/* Watch strap top */}
      <div className="absolute w-6 md:w-8 h-3 md:h-4 bg-neutral-200 dark:bg-neutral-700 top-[-0.75rem] md:top-[-1rem] left-[25%] rounded-t-lg transition-colors duration-300" />

      {/* Watch strap bottom */}
      <div className="absolute w-6 md:w-8 h-3 md:h-4 bg-neutral-200 dark:bg-neutral-700 bottom-[-0.75rem] md:bottom-[-1rem] left-[25%] rounded-b-lg transition-colors duration-300" />
    </div>
  )
}

