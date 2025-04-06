"use client"

import { useState } from "react"

export function Translator() {
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [sourceLanguage, setSourceLanguage] = useState("en")
  const [targetLanguage, setTargetLanguage] = useState("zh")

  const languages = [
    { code: "en", name: "English" },
    { code: "zh", name: "Chinese" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "ru", name: "Russian" },
  ]

  // Mock translation function (in a real app, this would call an API)
  const translateText = () => {
    // This is just a mock implementation
    if (!sourceText.trim()) {
      setTranslatedText("")
      return
    }

    // Simple mock translation
    if (sourceLanguage === "en" && targetLanguage === "zh") {
      // English to Chinese mock
      setTranslatedText(`[${sourceText} - 翻译成中文]`)
    } else if (sourceLanguage === "zh" && targetLanguage === "en") {
      // Chinese to English mock
      setTranslatedText(`[${sourceText} - translated to English]`)
    } else {
      // Generic mock
      setTranslatedText(`[${sourceText} - translated from ${sourceLanguage} to ${targetLanguage}]`)
    }
  }

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage)
    setTargetLanguage(sourceLanguage)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <select
          value={sourceLanguage}
          onChange={(e) => setSourceLanguage(e.target.value)}
          className="neumorphic-button px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 focus:outline-none"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>

        <button onClick={swapLanguages} className="neumorphic-icon-button p-2 rounded-lg" aria-label="Swap languages">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 16V4m0 0L3 8m4-4l4 4"></path>
            <path d="M17 8v12m0 0l4-4m-4 4l-4-4"></path>
          </svg>
        </button>

        <select
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          className="neumorphic-button px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 focus:outline-none"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="source-text" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Source Text
        </label>
        <textarea
          id="source-text"
          className="w-full h-24 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600"
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder="Enter text to translate..."
        />
      </div>

      <button
        onClick={translateText}
        className="neumorphic-button w-full px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
      >
        Translate
      </button>

      <div className="space-y-2">
        <label htmlFor="translated-text" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Translated Text
        </label>
        <textarea
          id="translated-text"
          className="w-full h-24 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100 focus:outline-none"
          value={translatedText}
          readOnly
          placeholder="Translation will appear here..."
        />
      </div>
    </div>
  )
}

