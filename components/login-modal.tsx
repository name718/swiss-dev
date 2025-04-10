"use client"

import type React from "react"

import { useState } from "react"
import { X, Lock, Eye, EyeOff, Mail, Github } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (email: string, password: string, remember: boolean) => void
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const { language } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isRegisterMode, setIsRegisterMode] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(email, password, remember)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode)
    // 清空表单
    setEmail("")
    setPassword("")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800 shadow-xl neumorphic-card">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          aria-label="Close login"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-neutral-100">
          {isRegisterMode ? (language === "zh" ? "创建账户" : "Create Account") : language === "zh" ? "登录" : "Login"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {language === "zh" ? "邮箱" : "Email"}
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-500"
                placeholder={language === "zh" ? "输入您的邮箱" : "Enter your email"}
                required
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {language === "zh" ? "密码" : "Password"}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-500"
                placeholder={language === "zh" ? "输入您的密码" : "Enter your password"}
                required
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {isRegisterMode && (
            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                {language === "zh" ? "确认密码" : "Confirm Password"}
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-500"
                  placeholder={language === "zh" ? "再次输入密码" : "Confirm your password"}
                  required={isRegisterMode}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
                {language === "zh" ? "记住我" : "Remember me"}
              </label>
            </div>
            {!isRegisterMode && (
              <a
                href="#"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {language === "zh" ? "忘记密码？" : "Forgot password?"}
              </a>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 neumorphic-button-primary"
          >
            {isRegisterMode ? (language === "zh" ? "注册" : "Register") : language === "zh" ? "登录" : "Login"}
          </button>

          <div className="relative flex items-center justify-center mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-300 dark:border-neutral-600"></div>
            </div>
            <div className="relative px-4 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-500 dark:text-neutral-400">
              {language === "zh" ? "或继续使用" : "or continue with"}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              className="flex items-center justify-center py-2 px-4 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 font-medium transition-colors duration-200 neumorphic-button"
            >
              <Github className="mr-2" size={18} />
              {language === "zh" ? "使用 GitHub 登录" : "Sign in with GitHub"}
            </button>
          </div>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {isRegisterMode
                ? language === "zh"
                  ? "已有账户？登录"
                  : "Already have an account? Login"
                : language === "zh"
                  ? "没有账户？注册"
                  : "Don't have an account? Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
