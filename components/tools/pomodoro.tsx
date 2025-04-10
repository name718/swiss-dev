"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, Coffee, Volume2, VolumeX } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

type TimerMode = "work" | "shortBreak" | "longBreak"

export function Pomodoro() {
  const { language } = useLanguage()
  const [mode, setMode] = useState<TimerMode>("work")
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false)
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState({
    workTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    longBreakInterval: 4,
  })

  // Audio references
  const timerCompleteAudioRef = useRef<HTMLAudioElement | null>(null)
  const tickAudioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio elements
  useEffect(() => {
    timerCompleteAudioRef.current = new Audio()
    tickAudioRef.current = new Audio()

    return () => {
      timerCompleteAudioRef.current = null
      tickAudioRef.current = null
    }
  }, [])

  // Play sound effect
  const playSound = (sound: HTMLAudioElement | null) => {
    if (soundEnabled && sound) {
      if (sound.src && sound.src !== window.location.href) {
        sound.currentTime = 0
        sound.play().catch((e) => {
          console.log("Sound not available")
        })
      }
    }
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          // Play tick sound on every minute
          if (prevTime % 60 === 0 && prevTime > 0) {
            playSound(tickAudioRef.current)
          }
          return prevTime - 1
        })
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      // Timer completed
      playSound(timerCompleteAudioRef.current)

      if (mode === "work") {
        // Increment completed pomodoros
        const newCompletedCount = completedPomodoros + 1
        setCompletedPomodoros(newCompletedCount)

        // Determine if it's time for a long break
        if (newCompletedCount % settings.longBreakInterval === 0) {
          setMode("longBreak")
          setTimeLeft(settings.longBreakTime * 60)
        } else {
          setMode("shortBreak")
          setTimeLeft(settings.shortBreakTime * 60)
        }
      } else {
        // Break completed, back to work
        setMode("work")
        setTimeLeft(settings.workTime * 60)
      }

      // Optionally auto-start the next timer
      // setIsActive(true)

      // Or pause between sessions
      setIsActive(false)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, mode, completedPomodoros, settings])

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Start or pause timer
  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  // Reset timer
  const resetTimer = () => {
    setIsActive(false)

    // Reset to the appropriate time based on current mode
    if (mode === "work") {
      setTimeLeft(settings.workTime * 60)
    } else if (mode === "shortBreak") {
      setTimeLeft(settings.shortBreakTime * 60)
    } else {
      setTimeLeft(settings.longBreakTime * 60)
    }
  }

  // Change timer mode
  const changeMode = (newMode: TimerMode) => {
    setIsActive(false)
    setMode(newMode)

    if (newMode === "work") {
      setTimeLeft(settings.workTime * 60)
    } else if (newMode === "shortBreak") {
      setTimeLeft(settings.shortBreakTime * 60)
    } else {
      setTimeLeft(settings.longBreakTime * 60)
    }
  }

  // Save settings
  const saveSettings = (newSettings: typeof settings) => {
    setSettings(newSettings)
    setShowSettings(false)

    // Update current timer based on new settings
    if (mode === "work") {
      setTimeLeft(newSettings.workTime * 60)
    } else if (mode === "shortBreak") {
      setTimeLeft(newSettings.shortBreakTime * 60)
    } else {
      setTimeLeft(newSettings.longBreakTime * 60)
    }

    // Reset active state
    setIsActive(false)
  }

  // Get progress percentage
  const getProgressPercentage = (): number => {
    let totalTime
    if (mode === "work") {
      totalTime = settings.workTime * 60
    } else if (mode === "shortBreak") {
      totalTime = settings.shortBreakTime * 60
    } else {
      totalTime = settings.longBreakTime * 60
    }

    return ((totalTime - timeLeft) / totalTime) * 100
  }

  // Get color based on current mode
  const getModeColor = (): string => {
    if (mode === "work") {
      return "from-red-500 to-red-600 dark:from-red-600 dark:to-red-700"
    } else if (mode === "shortBreak") {
      return "from-green-500 to-green-600 dark:from-green-600 dark:to-green-700"
    } else {
      return "from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700"
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
            {language === "zh" ? "番茄钟" : "Pomodoro Timer"}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {language === "zh" ? "专注工作，定时休息" : "Focus on work with timed breaks"}
          </p>
        </div>
        <div className="neumorphic-display px-3 py-2 rounded-lg">
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {language === "zh" ? "已完成" : "COMPLETED"}
          </div>
          <div className="text-lg font-mono font-bold text-neutral-800 dark:text-neutral-100">{completedPomodoros}</div>
        </div>
      </div>

      {/* Mode selector */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => changeMode("work")}
          className={`neumorphic-button flex-1 py-2 rounded-lg ${
            mode === "work"
              ? "neumorphic-button-active bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
              : ""
          }`}
        >
          {language === "zh" ? "工作" : "Work"}
        </button>
        <button
          onClick={() => changeMode("shortBreak")}
          className={`neumorphic-button flex-1 py-2 rounded-lg ${
            mode === "shortBreak"
              ? "neumorphic-button-active bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
              : ""
          }`}
        >
          {language === "zh" ? "短休息" : "Short Break"}
        </button>
        <button
          onClick={() => changeMode("longBreak")}
          className={`neumorphic-button flex-1 py-2 rounded-lg ${
            mode === "longBreak"
              ? "neumorphic-button-active bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              : ""
          }`}
        >
          {language === "zh" ? "长休息" : "Long Break"}
        </button>
      </div>

      {/* Timer display */}
      <div className="neumorphic-card p-6 rounded-xl mb-6 relative overflow-hidden">
        {/* Progress bar */}
        <div
          className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${getModeColor()}`}
          style={{ width: `${getProgressPercentage()}%`, transition: "width 1s linear" }}
        ></div>

        <div className="text-center">
          <div className="text-6xl font-mono font-bold text-neutral-800 dark:text-neutral-100 mb-4">
            {formatTime(timeLeft)}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={toggleTimer}
              className={`neumorphic-button p-4 rounded-full ${
                isActive
                  ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                  : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
              }`}
              aria-label={isActive ? "Pause" : "Start"}
            >
              {isActive ? <Pause size={24} /> : <Play size={24} />}
            </button>

            <button onClick={resetTimer} className="neumorphic-button p-4 rounded-full" aria-label="Reset">
              <RotateCcw size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Current mode indicator */}
      <div className="neumorphic-card p-4 rounded-xl mb-6">
        <div className="flex items-center">
          {mode === "work" ? (
            <>
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-neutral-700 dark:text-neutral-300">
                {language === "zh" ? "专注工作中" : "Focus Time"}
              </span>
            </>
          ) : mode === "shortBreak" ? (
            <>
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <Coffee className="mr-2 text-green-500" size={18} />
              <span className="text-neutral-700 dark:text-neutral-300">
                {language === "zh" ? "短暂休息中" : "Short Break"}
              </span>
            </>
          ) : (
            <>
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <Coffee className="mr-2 text-blue-500" size={18} />
              <span className="text-neutral-700 dark:text-neutral-300">
                {language === "zh" ? "长时间休息中" : "Long Break"}
              </span>
            </>
          )}

          <div className="ml-auto flex space-x-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="neumorphic-icon-button p-2 rounded-lg"
              aria-label={soundEnabled ? "Mute" : "Unmute"}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="neumorphic-icon-button p-2 rounded-lg"
              aria-label="Settings"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="neumorphic-card p-4 rounded-xl mb-6">
          <h4 className="font-medium mb-4 text-neutral-700 dark:text-neutral-300">
            {language === "zh" ? "设置" : "Settings"}
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                {language === "zh" ? "工作时间 (分钟)" : "Work Time (minutes)"}
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.workTime}
                onChange={(e) => setSettings({ ...settings, workTime: Number(e.target.value) })}
                className="w-full p-2 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                {language === "zh" ? "短休息时间 (分钟)" : "Short Break Time (minutes)"}
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.shortBreakTime}
                onChange={(e) => setSettings({ ...settings, shortBreakTime: Number(e.target.value) })}
                className="w-full p-2 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                {language === "zh" ? "长休息时间 (分钟)" : "Long Break Time (minutes)"}
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.longBreakTime}
                onChange={(e) => setSettings({ ...settings, longBreakTime: Number(e.target.value) })}
                className="w-full p-2 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                {language === "zh" ? "长休息间隔 (番茄数)" : "Long Break Interval (pomodoros)"}
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.longBreakInterval}
                onChange={(e) => setSettings({ ...settings, longBreakInterval: Number(e.target.value) })}
                className="w-full p-2 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setShowSettings(false)} className="neumorphic-button px-4 py-2 rounded-lg">
                {language === "zh" ? "取消" : "Cancel"}
              </button>

              <button
                onClick={() => saveSettings(settings)}
                className="neumorphic-button px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              >
                {language === "zh" ? "保存" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="text-sm text-neutral-600 dark:text-neutral-400">
        <h4 className="font-medium mb-1 text-neutral-700 dark:text-neutral-300">
          {language === "zh" ? "番茄工作法提示" : "Pomodoro Technique Tips"}:
        </h4>
        <ul className="list-disc list-inside space-y-1">
          <li>{language === "zh" ? "专注工作25分钟" : "Focus on work for 25 minutes"}</li>
          <li>{language === "zh" ? "休息5分钟" : "Take a 5-minute break"}</li>
          <li>
            {language === "zh"
              ? "每完成4个番茄钟，休息15-30分钟"
              : "After 4 pomodoros, take a longer 15-30 minute break"}
          </li>
          <li>{language === "zh" ? "工作时间内避免干扰和打断" : "Avoid distractions during work periods"}</li>
        </ul>
      </div>
    </div>
  )
}
