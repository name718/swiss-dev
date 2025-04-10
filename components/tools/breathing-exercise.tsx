"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, Settings, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

type BreathingPattern = {
  name: { en: string; zh: string }
  description: { en: string; zh: string }
  inhale: number
  hold1: number
  exhale: number
  hold2: number
  color: string
}

export function BreathingExercise() {
  const { language, t } = useLanguage()
  const [isActive, setIsActive] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<"inhale" | "hold1" | "exhale" | "hold2">("inhale")
  const [timeLeft, setTimeLeft] = useState(0)
  const [cycles, setCycles] = useState(0)
  const [targetCycles, setTargetCycles] = useState(3)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedPattern, setSelectedPattern] = useState(0)
  const circleRef = useRef<SVGCircleElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  // Breathing patterns
  const breathingPatterns: BreathingPattern[] = [
    {
      name: { en: "4-7-8 Relaxing Breath", zh: "4-7-8 放松呼吸法" },
      description: {
        en: "Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds",
        zh: "吸气4秒，屏息7秒，呼气8秒",
      },
      inhale: 4,
      hold1: 7,
      exhale: 8,
      hold2: 0,
      color: "from-blue-400 to-purple-500",
    },
    {
      name: { en: "Box Breathing", zh: "方块呼吸法" },
      description: {
        en: "Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds",
        zh: "吸气4秒，屏息4秒，呼气4秒，屏息4秒",
      },
      inhale: 4,
      hold1: 4,
      exhale: 4,
      hold2: 4,
      color: "from-green-400 to-teal-500",
    },
    {
      name: { en: "Deep Calm", zh: "深度平静" },
      description: {
        en: "Inhale for 5 seconds, hold for 2 seconds, exhale for 7 seconds",
        zh: "吸气5秒，屏息2秒，呼气7秒",
      },
      inhale: 5,
      hold1: 2,
      exhale: 7,
      hold2: 0,
      color: "from-indigo-400 to-blue-500",
    },
  ]

  // Get current pattern
  const currentPattern = breathingPatterns[selectedPattern]

  // Calculate total cycle time
  const totalCycleTime = currentPattern.inhale + currentPattern.hold1 + currentPattern.exhale + currentPattern.hold2

  // Start or pause breathing exercise
  const toggleExercise = () => {
    if (!isActive) {
      setCurrentPhase("inhale")
      setTimeLeft(currentPattern.inhale)
      setCycles(0)
    }
    setIsActive(!isActive)
  }

  // Reset breathing exercise
  const resetExercise = () => {
    setIsActive(false)
    setCurrentPhase("inhale")
    setTimeLeft(currentPattern.inhale)
    setCycles(0)
  }

  // Change breathing pattern
  const changePattern = (index: number) => {
    setSelectedPattern(index)
    resetExercise()
  }

  // Get phase text
  const getPhaseText = (): string => {
    switch (currentPhase) {
      case "inhale":
        return language === "zh" ? "吸气" : "Inhale"
      case "hold1":
        return language === "zh" ? "屏息" : "Hold"
      case "exhale":
        return language === "zh" ? "呼气" : "Exhale"
      case "hold2":
        return language === "zh" ? "屏息" : "Hold"
      default:
        return ""
    }
  }

  // Get animation for the circle
  useEffect(() => {
    if (circleRef.current && isActive) {
      let animation: string
      const circle = circleRef.current

      // Reset any existing animations
      circle.style.animation = "none"
      // Trigger reflow
      void circle.offsetWidth

      switch (currentPhase) {
        case "inhale":
          animation = `breatheIn ${currentPattern.inhale}s ease-in-out forwards`
          break
        case "hold1":
        case "hold2":
          animation = `none`
          break
        case "exhale":
          animation = `breatheOut ${currentPattern.exhale}s ease-in-out forwards`
          break
        default:
          animation = "none"
      }

      circle.style.animation = animation
    }
  }, [currentPhase, isActive, currentPattern])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      // Move to next phase
      switch (currentPhase) {
        case "inhale":
          if (currentPattern.hold1 > 0) {
            setCurrentPhase("hold1")
            setTimeLeft(currentPattern.hold1)
          } else {
            setCurrentPhase("exhale")
            setTimeLeft(currentPattern.exhale)
          }
          break
        case "hold1":
          setCurrentPhase("exhale")
          setTimeLeft(currentPattern.exhale)
          break
        case "exhale":
          if (currentPattern.hold2 > 0) {
            setCurrentPhase("hold2")
            setTimeLeft(currentPattern.hold2)
          } else {
            // Complete one cycle
            const newCycles = cycles + 1
            setCycles(newCycles)

            if (newCycles >= targetCycles) {
              // Exercise complete
              setIsActive(false)
            } else {
              // Start next cycle
              setCurrentPhase("inhale")
              setTimeLeft(currentPattern.inhale)
            }
          }
          break
        case "hold2":
          // Complete one cycle
          const newCycles = cycles + 1
          setCycles(newCycles)

          if (newCycles >= targetCycles) {
            // Exercise complete
            setIsActive(false)
          } else {
            // Start next cycle
            setCurrentPhase("inhale")
            setTimeLeft(currentPattern.inhale)
          }
          break
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, currentPhase, cycles, targetCycles, currentPattern])

  // Add text animation
  useEffect(() => {
    if (textRef.current && isActive) {
      const text = textRef.current

      // Reset any existing animations
      text.style.animation = "none"
      // Trigger reflow
      void text.offsetWidth

      switch (currentPhase) {
        case "inhale":
          text.style.animation = `fadeIn ${currentPattern.inhale}s ease-in-out forwards`
          break
        case "exhale":
          text.style.animation = `fadeOut ${currentPattern.exhale}s ease-in-out forwards`
          break
        default:
          text.style.animation = "none"
      }
    }
  }, [currentPhase, isActive, currentPattern])

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
            {language === "zh" ? "呼吸练习" : "Breathing Exercise"}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {language === "zh" ? "通过引导呼吸减轻压力和焦虑" : "Reduce stress and anxiety with guided breathing"}
          </p>
        </div>
        <div className="neumorphic-display px-3 py-2 rounded-lg">
          <div className="text-xs text-neutral-500 dark:text-neutral-400">{language === "zh" ? "周期" : "CYCLES"}</div>
          <div className="text-lg font-mono font-bold text-neutral-800 dark:text-neutral-100">
            {cycles}/{targetCycles}
          </div>
        </div>
      </div>

      {/* Breathing pattern selector */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {breathingPatterns.map((pattern, index) => (
          <button
            key={index}
            onClick={() => changePattern(index)}
            className={`neumorphic-button py-2 px-3 rounded-lg whitespace-nowrap ${
              selectedPattern === index ? "neumorphic-button-active" : ""
            }`}
          >
            {language === "zh" ? pattern.name.zh : pattern.name.en}
          </button>
        ))}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="neumorphic-icon-button p-2 rounded-lg"
          aria-label={language === "zh" ? "设置" : "Settings"}
        >
          <Settings size={18} />
        </button>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="neumorphic-card p-4 rounded-xl mb-6 relative">
          <button
            onClick={() => setShowSettings(false)}
            className="absolute top-2 right-2 neumorphic-icon-button p-1.5 rounded-lg"
            aria-label="Close"
          >
            <X size={16} />
          </button>

          <h4 className="font-medium mb-4 text-neutral-700 dark:text-neutral-300">
            {language === "zh" ? "设置" : "Settings"}
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                {language === "zh" ? "目标周期数" : "Target Cycles"}
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={targetCycles}
                onChange={(e) => setTargetCycles(Number(e.target.value))}
                className="w-full p-2 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* Breathing visualization */}
      <div className="neumorphic-card p-6 rounded-xl mb-6 relative overflow-hidden">
        <div className="flex flex-col items-center justify-center">
          {/* Breathing circle */}
          <div className="relative w-64 h-64 mb-4">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="breathingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" className={`stop-color-start ${currentPattern.color.split(" ")[0]}`} />
                  <stop offset="100%" className={`stop-color-end ${currentPattern.color.split(" ")[1]}`} />
                </linearGradient>
              </defs>
              <circle
                ref={circleRef}
                cx="50"
                cy="50"
                r="30"
                fill="none"
                stroke="url(#breathingGradient)"
                strokeWidth="2"
                className="transition-all duration-300"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#breathingGradient)"
                strokeWidth="0.5"
                strokeDasharray="1,3"
                className="opacity-50"
              />
            </svg>

            {/* Phase text */}
            <div
              ref={textRef}
              className="absolute inset-0 flex items-center justify-center text-2xl font-medium text-neutral-700 dark:text-neutral-300"
            >
              {getPhaseText()}
            </div>

            {/* Timer */}
            <div className="absolute bottom-0 left-0 right-0 text-center text-3xl font-mono font-bold text-neutral-800 dark:text-neutral-100">
              {timeLeft}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={toggleExercise}
              className={`neumorphic-button p-4 rounded-full ${
                isActive
                  ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                  : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
              }`}
              aria-label={isActive ? "Pause" : "Start"}
            >
              {isActive ? <Pause size={24} /> : <Play size={24} />}
            </button>

            <button onClick={resetExercise} className="neumorphic-button p-4 rounded-full" aria-label="Reset">
              <RotateCcw size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Pattern description */}
      <div className="neumorphic-card p-4 rounded-xl mb-6">
        <h4 className="font-medium mb-2 text-neutral-700 dark:text-neutral-300">
          {language === "zh" ? "当前模式" : "Current Pattern"}
        </h4>
        <p className="text-neutral-600 dark:text-neutral-400">
          {language === "zh" ? currentPattern.description.zh : currentPattern.description.en}
        </p>
      </div>

      {/* Instructions */}
      <div className="text-sm text-neutral-600 dark:text-neutral-400">
        <h4 className="font-medium mb-1 text-neutral-700 dark:text-neutral-300">
          {language === "zh" ? "呼吸练习提示" : "Breathing Exercise Tips"}:
        </h4>
        <ul className="list-disc list-inside space-y-1">
          <li>{language === "zh" ? "找一个安静舒适的地方坐下" : "Find a quiet and comfortable place to sit"}</li>
          <li>{language === "zh" ? "保持背部挺直，肩膀放松" : "Keep your back straight and shoulders relaxed"}</li>
          <li>
            {language === "zh"
              ? "通过鼻子吸气，通过嘴巴呼气"
              : "Breathe in through your nose and out through your mouth"}
          </li>
          <li>
            {language === "zh" ? "专注于你的呼吸，让思绪平静下来" : "Focus on your breath and let your thoughts settle"}
          </li>
        </ul>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes breatheIn {
          from {
            r: 30;
            opacity: 0.7;
          }
          to {
            r: 45;
            opacity: 1;
          }
        }
        
        @keyframes breatheOut {
          from {
            r: 45;
            opacity: 1;
          }
          to {
            r: 30;
            opacity: 0.7;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0.5;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0.5;
            transform: scale(0.8);
          }
        }
      `}</style>
    </div>
  )
}
