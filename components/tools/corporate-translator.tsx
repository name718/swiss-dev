"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 职场黑话词典
const corporateJargon = {
  // 人话 -> 黑话
  toJargon: {
    今天要按时下班: "我将通过优化时间矩阵实现工作生活双象限赋能",
    这个任务很简单: "这是一个低复杂度高确定性的交付项",
    我不想做: "基于当前资源配置和优先级排序，建议将此事项暂缓处理",
    这个想法很蠢: "这个方案的可行性和ROI有待进一步评估",
    我不知道: "这个问题需要进一步调研和数据支撑",
    出问题了: "我们遇到了一些挑战性的技术壁垒",
    我很忙: "我目前的带宽已经饱和",
    这不是我的工作: "这超出了我的职责范围和KPI指标",
    我需要加薪: "希望对我的价值贡献进行重新评估",
    这个会议没必要: "建议优化沟通机制提升协同效率",
  },
  // 黑话 -> 人话
  fromJargon: {
    我们要对齐颗粒度: "我也不知道要干嘛先开会吧",
    打通上下游: "甩锅给其他部门",
    赋能: "强制你干活",
    抓手: "背锅的人",
    闭环: "别再来烦我了",
    向上管理: "拍领导马屁",
    降本增效: "准备裁员",
    灵活用工: "不给你交社保",
    去中心化: "互相甩锅",
    敏捷开发: "天天改需求",
    用户画像: "瞎猜用户需求",
    引爆点: "制造焦虑",
    生态: "割韭菜的地方",
    私域流量: "骚扰你的朋友和家人",
    增长黑客: "投机取巧",
    向前兼容: "修补漏洞",
    垂直领域: "小众到没人用",
    差异化竞争: "抄不到别人的作业",
    持续迭代: "永远做不完",
    深度整合: "强行捆绑",
  },
  // 触发词
  triggerWords: ["赋能", "抓手", "闭环", "对齐", "颗粒度", "向上管理", "降本增效", "打通", "生态", "私域"],
}

// 自定义黑话生成函数
function generateJargon(input: string): string {
  // 检查是否有直接匹配
  if (corporateJargon.toJargon[input]) {
    return corporateJargon.toJargon[input]
  }

  // 如果没有直接匹配，生成一些通用的黑话
  const prefixes = [
    "从战略高度来看，",
    "基于数据驱动的思维，",
    "为了实现业务闭环，",
    "考虑到全局的协同效应，",
    "立足长期主义视角，",
  ]

  const middleParts = [
    "我们需要对齐认知，",
    "建议搭建赋能平台，",
    "应该构建生态矩阵，",
    "可以打通上下游壁垒，",
    "必须实现降本增效，",
  ]

  const suffixes = [
    "形成差异化竞争力。",
    "打造可持续增长飞轮。",
    "实现价值共创共赢。",
    "提升用户心智占位。",
    "确保业务持续正向发展。",
  ]

  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const randomMiddle = middleParts[Math.floor(Math.random() * middleParts.length)]
  const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)]

  return randomPrefix + randomMiddle + randomSuffix
}

// 自定义人话翻译函数
function translateToPlain(input: string): string {
  // 检查是否有直接匹配
  if (corporateJargon.fromJargon[input]) {
    return corporateJargon.fromJargon[input]
  }

  // 检查是否包含触发词
  for (const word of corporateJargon.triggerWords) {
    if (input.includes(word)) {
      return `这句话包含"${word}"，很可能是在胡说八道。`
    }
  }

  // 如果没有匹配，返回通用翻译
  if (input.length > 20) {
    return "这是一段废话，可以忽略。"
  } else {
    return "这可能是正常的人话。"
  }
}

export function CorporateTranslator() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [mode, setMode] = useState("toJargon") // toJargon 或 fromJargon
  const [isRecording, setIsRecording] = useState(false)
  const [recordedText, setRecordedText] = useState("")
  const [recentTranslations, setRecentTranslations] = useState<{ input: string; output: string }[]>([])
  // 在实际应用中，这里会使用 audioRef 来引用音频元素
  // const audioRef = useRef<HTMLAudioElement | null>(null)

  // 模拟语音识别
  useEffect(() => {
    if (isRecording) {
      const timer = setTimeout(() => {
        const fakeSpeech = [
          "我们需要对齐一下业务目标",
          "这个项目需要打通上下游",
          "我们要赋能团队成员",
          "这个需求要尽快闭环",
        ]
        const randomSpeech = fakeSpeech[Math.floor(Math.random() * fakeSpeech.length)]
        setRecordedText(randomSpeech)

        // 检测触发词并显示提示，而不是播放音效
        const hasTriggerWord = corporateJargon.triggerWords.some((word) => randomSpeech.includes(word))
        if (hasTriggerWord) {
          console.log("检测到触发词，在真实环境中会播放拍桌音效")
          // 在这里我们只显示一个提示，而不是尝试播放可能不存在的音频
        }

        setIsRecording(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isRecording])

  // 翻译函数
  const translateText = () => {
    if (!inputText.trim()) {
      setOutputText("")
      return
    }

    let result = ""
    if (mode === "toJargon") {
      result = generateJargon(inputText)
    } else {
      result = translateToPlain(inputText)
    }

    setOutputText(result)

    // 添加到最近翻译
    setRecentTranslations((prev) => {
      const newTranslations = [{ input: inputText, output: result }, ...prev]
      return newTranslations.slice(0, 5) // 只保留最近5条
    })
  }

  // 开始录音
  const startRecording = () => {
    setIsRecording(true)
    setRecordedText("")
  }

  // 使用录音结果
  const useRecordedText = () => {
    if (recordedText) {
      setInputText(recordedText)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="translate" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="translate">翻译模式</TabsTrigger>
          <TabsTrigger value="meeting">会议同传</TabsTrigger>
          <TabsTrigger value="extension">插件概念</TabsTrigger>
        </TabsList>

        <TabsContent value="translate" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setMode("toJargon")}
                className={`neumorphic-button px-4 py-2 rounded-lg ${
                  mode === "toJargon" ? "bg-neutral-200 dark:bg-neutral-700" : "bg-neutral-100 dark:bg-neutral-800"
                }`}
              >
                人话 → 黑话
              </button>
              <button
                onClick={() => setMode("fromJargon")}
                className={`neumorphic-button px-4 py-2 rounded-lg ${
                  mode === "fromJargon" ? "bg-neutral-200 dark:bg-neutral-700" : "bg-neutral-100 dark:bg-neutral-800"
                }`}
              >
                黑话 → 人话
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="input-text" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {mode === "toJargon" ? "输入人话" : "输入职场黑话"}
            </label>
            <textarea
              id="input-text"
              className="w-full h-24 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={mode === "toJargon" ? "输入普通人话..." : "输入职场黑话..."}
            />
          </div>

          <button
            onClick={translateText}
            className="neumorphic-button w-full px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
          >
            翻译
          </button>

          <div className="space-y-2">
            <label htmlFor="output-text" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {mode === "toJargon" ? "翻译后的黑话" : "翻译后的人话"}
            </label>
            <textarea
              id="output-text"
              className="w-full h-24 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100 focus:outline-none"
              value={outputText}
              readOnly
              placeholder="翻译结果将显示在这里..."
            />
          </div>

          {recentTranslations.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">最近翻译</h3>
              <div className="space-y-2">
                {recentTranslations.map((item, index) => (
                  <div key={index} className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-sm">
                    <div className="font-medium">{item.input}</div>
                    <div className="text-neutral-500 dark:text-neutral-400">↓</div>
                    <div>{item.output}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="meeting" className="space-y-4">
          <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-center">
            <h3 className="text-lg font-medium mb-4">会议室同传模式</h3>

            <div className="mb-4">
              {isRecording ? (
                <div className="animate-pulse text-red-500 dark:text-red-400 mb-2">正在录音...</div>
              ) : (
                <button
                  onClick={startRecording}
                  className="neumorphic-button px-6 py-3 rounded-full bg-neutral-100 dark:bg-neutral-700"
                >
                  <span className="flex items-center">
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
                      className="mr-2"
                    >
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" x2="12" y1="19" y2="22"></line>
                    </svg>
                    开始录音
                  </span>
                </button>
              )}
            </div>

            {recordedText && (
              <div className="mb-4">
                <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-700 text-left mb-2">
                  <div className="font-medium">检测到的语音:</div>
                  <div className="mt-1">{recordedText}</div>
                </div>

                <div className="p-3 rounded-lg bg-neutral-200 dark:bg-neutral-600 text-left">
                  <div className="font-medium">人话翻译:</div>
                  <div className="mt-1">{translateToPlain(recordedText)}</div>
                </div>

                <button
                  onClick={useRecordedText}
                  className="neumorphic-button px-4 py-2 mt-2 rounded-lg bg-neutral-100 dark:bg-neutral-800"
                >
                  使用这段文本
                </button>
              </div>
            )}

            <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-4">
              <p>当检测到"赋能"、"抓手"、"闭环"等词语时，将自动触发拍桌音效</p>
            </div>

            {/* 在实际应用中，这里会加载真实的音频文件 */}
            {/* <audio ref={audioRef} src="/table-slam.mp3" /> */}
          </div>
        </TabsContent>

        <TabsContent value="extension" className="space-y-4">
          <div className="p-6 rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 shadow-lg">
            <h3 className="text-xl font-bold mb-6 text-center">跨平台植入插件</h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* 左侧：功能介绍 */}
              <div className="space-y-4">
                <div className="flex items-center p-4 rounded-xl bg-white dark:bg-neutral-700 shadow-sm transition-all hover:shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mr-4 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-lg">企业微信/钉钉插件</div>
                    <div className="text-neutral-500 dark:text-neutral-400">
                      自动为消息添加翻译悬浮窗，一键识破职场套路
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-4 rounded-xl bg-white dark:bg-neutral-700 shadow-sm transition-all hover:shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center mr-4 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-lg">长按消息生成阴阳怪气版本</div>
                    <div className="text-neutral-500 dark:text-neutral-400">一键转换为讽刺语气，暗爽不露痕迹</div>
                  </div>
                </div>

                <div className="flex items-center p-4 rounded-xl bg-white dark:bg-neutral-700 shadow-sm transition-all hover:shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center mr-4 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-lg">黑话防火墙</div>
                    <div className="text-neutral-500 dark:text-neutral-400">
                      自动过滤邮件和文档中的职场黑话，还原本质
                    </div>
                  </div>
                </div>
              </div>

              {/* 右侧：演示效果 */}
              <div className="bg-white dark:bg-neutral-700 rounded-xl p-4 shadow-md">
                <div className="flex items-center justify-between mb-3 border-b pb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2">
                      <span className="font-bold text-blue-500 dark:text-blue-300">张</span>
                    </div>
                    <span className="font-medium">张经理</span>
                  </div>
                  <div className="text-xs text-neutral-500">10:30</div>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900 max-w-[90%] ml-auto">
                      <p className="text-sm">我们需要对齐一下业务目标，打通上下游，实现降本增效</p>
                    </div>
                    <div className="absolute top-full right-0 mt-1 p-3 rounded-lg bg-white dark:bg-neutral-600 shadow-lg text-sm w-full z-10 border-l-2 border-red-500">
                      <div className="flex items-center mb-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-red-500 mr-1"
                        >
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                          <line x1="12" y1="9" x2="12" y2="13"></line>
                          <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        <span className="font-bold text-red-500">人话翻译:</span>
                      </div>
                      <p>我也不知道要干嘛，先开会吧，准备裁员</p>
                    </div>
                  </div>

                  <div className="mt-12 relative">
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900 max-w-[90%]">
                      <p className="text-sm">我们需要赋能团队，提高工作效率</p>
                    </div>
                    <div className="absolute top-full left-0 mt-1 p-3 rounded-lg bg-white dark:bg-neutral-600 shadow-lg text-sm w-full z-10 border-l-2 border-red-500">
                      <div className="flex items-center mb-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-red-500 mr-1"
                        >
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                          <line x1="12" y1="9" x2="12" y2="13"></line>
                          <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        <span className="font-bold text-red-500">人话翻译:</span>
                      </div>
                      <p>强制你干活，不给加班费</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center mt-16 border-t pt-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="输入消息..."
                      className="w-full p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="ml-2 p-2 rounded-full bg-blue-500 text-white">
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
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button className="neumorphic-button px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                安装浏览器插件
              </button>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">* 概念演示，插件尚未开发</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
