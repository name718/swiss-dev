"use client"

import { useState, useRef } from "react"
import { Copy, Download, Share2, Check, X, RefreshCw } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import html2canvas from "html2canvas"

// 预设的离职原因库
const resignationReasons = {
  salary: {
    en: "I hope to explore opportunities that better align with my current market value",
    zh: "希望探索更适合当前市场价值的机会",
  },
  leadership: {
    en: "I'm seeking a more effective collaboration model and management style",
    zh: "寻求更高效的协作模式和管理风格",
  },
  overtime: {
    en: "I'm looking for a better work-life balance",
    zh: "寻求更好的工作与生活平衡",
  },
  growth: {
    en: "I'm pursuing opportunities that offer more room for professional growth and skill development",
    zh: "追求能提供更多职业成长和技能发展空间的机会",
  },
  culture: {
    en: "I'm seeking an environment that better aligns with my personal values and working style",
    zh: "寻找更符合我个人价值观和工作方式的环境",
  },
  relocation: {
    en: "Due to personal circumstances, I need to relocate to a different area",
    zh: "由于个人情况，我需要搬迁到其他地区",
  },
}

// 梗图URL
const memeImages = [
  "/placeholder.svg?height=300&width=400",
  "/placeholder.svg?height=300&width=400",
  "/placeholder.svg?height=300&width=400",
]

export function ResignationReasonGenerator() {
  const { language, t } = useLanguage()
  const [selectedReason, setSelectedReason] = useState<string | null>(null)
  const [generatedReason, setGeneratedReason] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedMeme, setSelectedMeme] = useState<string | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const reasonCardRef = useRef<HTMLDivElement>(null)

  // 重置状态
  const resetState = () => {
    setSelectedReason(null)
    setGeneratedReason("")
    setSelectedMeme(null)
    setCopied(false)
  }

  // 生成离职原因
  const generateReason = () => {
    if (!selectedReason) return

    setIsGenerating(true)

    // 模拟生成过程
    setTimeout(() => {
      const reason = resignationReasons[selectedReason as keyof typeof resignationReasons]
      setGeneratedReason(language === "zh" ? reason.zh : reason.en)

      // 随机选择一张梗图
      const randomIndex = Math.floor(Math.random() * memeImages.length)
      setSelectedMeme(memeImages[randomIndex])

      setIsGenerating(false)

      // 滚动到结果区域
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 100)
    }, 1000)
  }

  // 复制到剪贴板
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReason).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // 下载图片
  const downloadImage = async () => {
    if (!reasonCardRef.current) return

    try {
      const canvas = await html2canvas(reasonCardRef.current, {
        backgroundColor: null,
        scale: 2,
      })

      const link = document.createElement("a")
      link.download = "elegant-resignation.png"
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch (error) {
      console.error("Error generating image:", error)
    }
  }

  // 分享
  const shareResult = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: language === "zh" ? "我的优雅离职理由" : "My Elegant Resignation Reason",
          text: generatedReason,
        })
      } catch (error) {
        console.error("Error sharing:", error)
        // 如果分享失败，回退到复制
        copyToClipboard()
      }
    } else {
      // 不支持分享API，回退到复制
      copyToClipboard()
    }
  }

  // 获取本地化文本
  const getText = (textObj: { en: string; zh: string }) => {
    return language === "zh" ? textObj.zh : textObj.en
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* 标题和说明 */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
          {language === "zh" ? "离职原因生成器" : "Resignation Reason Generator"}
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          {language === "zh"
            ? "将真实离职原因转化为专业、体面的表述，优雅告别职场"
            : "Transform your real resignation reasons into professional, dignified expressions"}
        </p>
      </div>

      {/* 主要内容 */}
      <div className="space-y-8">
        {/* 步骤1：选择离职原因 */}
        <div className="neumorphic-card p-4 md:p-6 rounded-xl bg-neutral-100 dark:bg-neutral-800">
          <h3 className="text-lg md:text-xl font-semibold mb-4 text-neutral-800 dark:text-neutral-100">
            {language === "zh" ? "步骤1：选择你的真实离职原因" : "Step 1: Select your real resignation reason"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <button
              className={`p-4 rounded-xl text-left transition-all ${
                selectedReason === "salary"
                  ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-500"
                  : "neumorphic-button hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50"
              }`}
              onClick={() => setSelectedReason("salary")}
            >
              <div className="font-medium mb-1 text-neutral-900 dark:text-neutral-100">
                {language === "zh" ? "工资太低" : "Salary Too Low"}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                {language === "zh" ? "薪资不符合我的价值" : "Not getting paid what I'm worth"}
              </div>
            </button>

            <button
              className={`p-4 rounded-xl text-left transition-all ${
                selectedReason === "leadership"
                  ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-500"
                  : "neumorphic-button hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50"
              }`}
              onClick={() => setSelectedReason("leadership")}
            >
              <div className="font-medium mb-1 text-neutral-900 dark:text-neutral-100">
                {language === "zh" ? "领导是SB" : "Bad Leadership"}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                {language === "zh" ? "管理问题和冲突" : "Management issues and conflicts"}
              </div>
            </button>

            <button
              className={`p-4 rounded-xl text-left transition-all ${
                selectedReason === "overtime"
                  ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-500"
                  : "neumorphic-button hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50"
              }`}
              onClick={() => setSelectedReason("overtime")}
            >
              <div className="font-medium mb-1 text-neutral-900 dark:text-neutral-100">
                {language === "zh" ? "加班太多" : "Too Much Overtime"}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                {language === "zh" ? "没有工作与生活平衡" : "No work-life balance"}
              </div>
            </button>

            <button
              className={`p-4 rounded-xl text-left transition-all ${
                selectedReason === "growth"
                  ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-500"
                  : "neumorphic-button hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50"
              }`}
              onClick={() => setSelectedReason("growth")}
            >
              <div className="font-medium mb-1 text-neutral-900 dark:text-neutral-100">
                {language === "zh" ? "没有成长空间" : "No Growth Opportunities"}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                {language === "zh" ? "职业发展停滞" : "Career stagnation"}
              </div>
            </button>

            <button
              className={`p-4 rounded-xl text-left transition-all ${
                selectedReason === "culture"
                  ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-500"
                  : "neumorphic-button hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50"
              }`}
              onClick={() => setSelectedReason("culture")}
            >
              <div className="font-medium mb-1 text-neutral-900 dark:text-neutral-100">
                {language === "zh" ? "公司文化有毒" : "Toxic Culture"}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                {language === "zh" ? "不健康的工作环境" : "Unhealthy workplace environment"}
              </div>
            </button>

            <button
              className={`p-4 rounded-xl text-left transition-all ${
                selectedReason === "relocation"
                  ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-500"
                  : "neumorphic-button hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50"
              }`}
              onClick={() => setSelectedReason("relocation")}
            >
              <div className="font-medium mb-1 text-neutral-900 dark:text-neutral-100">
                {language === "zh" ? "需要搬家" : "Relocation"}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                {language === "zh" ? "搬到其他地方" : "Moving to a different location"}
              </div>
            </button>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={generateReason}
              disabled={!selectedReason || isGenerating}
              className={`px-6 py-3 rounded-xl font-medium text-white transition-all ${
                !selectedReason || isGenerating
                  ? "bg-neutral-400 dark:bg-neutral-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 shadow-lg hover:shadow-green-500/20"
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center">
                  <RefreshCw size={18} className="mr-2 animate-spin" />
                  {language === "zh" ? "生成中..." : "Generating..."}
                </span>
              ) : language === "zh" ? (
                "生成专业理由"
              ) : (
                "Generate Professional Reason"
              )}
            </button>
          </div>
        </div>

        {/* 步骤2：生成结果 */}
        {generatedReason && (
          <div ref={resultRef} className="neumorphic-card p-4 md:p-6 rounded-xl bg-neutral-100 dark:bg-neutral-800">
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-neutral-800 dark:text-neutral-100">
              {language === "zh" ? "步骤2：你的专业离职理由" : "Step 2: Your Professional Resignation Reason"}
            </h3>

            <div ref={reasonCardRef} className="bg-white dark:bg-neutral-800 rounded-xl p-4 md:p-6 shadow-md mb-6">
              <div className="text-center mb-4">
                <h4 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                  {language === "zh" ? "优雅的告别" : "Elegant Exit"}
                </h4>
                <p className="text-neutral-800 dark:text-neutral-200 text-lg md:text-xl font-medium">
                  {generatedReason}
                </p>
              </div>

              {selectedMeme && (
                <div className="flex justify-center mt-4">
                  <img
                    src={selectedMeme || "/placeholder.svg"}
                    alt={language === "zh" ? "优雅退场梗图" : "Elegant exit meme"}
                    className="max-w-full h-auto rounded-xl shadow-sm"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={copyToClipboard}
                className="neumorphic-button px-4 py-2 rounded-xl flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                <span>
                  {copied ? (language === "zh" ? "已复制！" : "Copied!") : language === "zh" ? "复制文本" : "Copy Text"}
                </span>
              </button>

              <button
                onClick={downloadImage}
                className="neumorphic-button px-4 py-2 rounded-xl flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                <Download size={18} />
                <span>{language === "zh" ? "下载图片" : "Download Image"}</span>
              </button>

              <button
                onClick={shareResult}
                className="neumorphic-button px-4 py-2 rounded-xl flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                <Share2 size={18} />
                <span>{language === "zh" ? "分享" : "Share"}</span>
              </button>

              <button
                onClick={resetState}
                className="neumorphic-button px-4 py-2 rounded-xl flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                <X size={18} />
                <span>{language === "zh" ? "重置" : "Reset"}</span>
              </button>
            </div>
          </div>
        )}

        {/* 提示和建议 */}
        <div className="neumorphic-card p-4 md:p-6 rounded-xl bg-neutral-100 dark:bg-neutral-800">
          <h3 className="text-lg md:text-xl font-semibold mb-4 text-neutral-800 dark:text-neutral-100">
            {language === "zh" ? "专业离职的小贴士" : "Tips for a Professional Resignation"}
          </h3>

          <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
            <li className="flex items-start">
              <span className="inline-block w-4 h-4 rounded-full bg-green-500 mt-1.5 mr-2"></span>
              <span>
                {language === "zh" ? "按照合同规定提供适当的通知期" : "Give proper notice period as per your contract"}
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-4 h-4 rounded-full bg-green-500 mt-1.5 mr-2"></span>
              <span>
                {language === "zh" ? "对你所获得的机会表示感谢" : "Express gratitude for the opportunities you've had"}
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-4 h-4 rounded-full bg-green-500 mt-1.5 mr-2"></span>
              <span>{language === "zh" ? "主动提出帮助交接工作" : "Offer to help with the transition"}</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-4 h-4 rounded-full bg-green-500 mt-1.5 mr-2"></span>
              <span>{language === "zh" ? "保持积极和专业的语气" : "Keep the tone positive and professional"}</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-4 h-4 rounded-full bg-green-500 mt-1.5 mr-2"></span>
              <span>
                {language === "zh"
                  ? "避免破坏关系 - 你可能需要他们的推荐"
                  : "Avoid burning bridges - you may need references"}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
