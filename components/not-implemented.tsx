"use client"

import { AlertTriangle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface NotImplementedProps {
  toolName: string
}

export function NotImplemented({ toolName }: NotImplementedProps) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertTriangle size={64} className="text-amber-500 dark:text-amber-400 mb-6" />
      <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
        {t("feature.under.development")}
      </h3>
      <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-6">
        {`"${toolName}" ${t("feature.under.development.message")}`}
      </p>
      <div className="neumorphic-card p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 max-w-md">
        <p className="text-sm text-amber-700 dark:text-amber-300">{t("feature.under.development.note")}</p>
      </div>
    </div>
  )
}
