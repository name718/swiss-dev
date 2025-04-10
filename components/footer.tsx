"use client"

import { Github, Twitter, Linkedin } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function Footer() {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 py-6 transition-colors duration-300 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-neutral-600 dark:text-neutral-400 text-sm transition-colors duration-300">
              © {currentYear} {t("app.name")}. {t("footer.rights")}.
            </p>
            <p className="text-neutral-500 dark:text-neutral-500 text-xs mt-1 transition-colors duration-300">
              {t("footer.disclaimer")}
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex space-x-4">
              <a
                href="https://github.com/name718"
                className="neumorphic-icon-button p-2 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-all duration-300"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={18} />
              </a>
              <a
                href="#"
                className="neumorphic-icon-button p-2 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="neumorphic-icon-button p-2 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 text-sm transition-colors duration-300"
              >
                {t("footer.privacy")}
              </a>
              <a
                href="#"
                className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 text-sm transition-colors duration-300"
              >
                {t("footer.terms")}
              </a>
              <a
                href="#"
                className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 text-sm transition-colors duration-300"
              >
                {t("footer.contact")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
