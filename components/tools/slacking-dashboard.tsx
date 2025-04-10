"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Clock, Volume2, VolumeX, RefreshCw, Coffee, Briefcase } from "lucide-react"

export function SlackingDashboard() {
  const { t } = useLanguage()
  const [weekProgress, setWeekProgress] = useState(0)
  const [dayProgress, setDayProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [currentTip, setCurrentTip] = useState("")
  const [isChangingTip, setIsChangingTip] = useState(false)
  const [currentDay, setCurrentDay] = useState("")
  const [currentDate, setCurrentDate] = useState("")
  const [currentTime, setCurrentTime] = useState("")
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [energyLevel, setEnergyLevel] = useState(0)
  const [tipCategory, setTipCategory] = useState("all")
  const [showConfetti, setShowConfetti] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 摸鱼小贴士库 - 按类别组织
  const slackingTips = useMemo(
    () => ({
      meeting: [
        "假装在开会：戴上耳机对着黑屏的Zoom点头",
        "会议占位：在会议室放一件外套，表示你'马上回来'",
        "电话会议：戴着耳机自言自语，假装在重要通话",
        "会议战术：提前5分钟进入会议室，看起来很积极",
        '会议延长：提出"我有一个问题"，拖延会议结束时间',
        "会议笔记：认真记笔记，实际上在画涂鸦",
        "视频会议：将背景设为办公环境，实际在咖啡厅",
        "会议贡献：准备一两个问题，显得你很投入",
      ],
      computer: [
        "文件整理：把桌面文件夹拖来拖去，看起来很忙",
        "代码审查：盯着GitHub，不时点点头或摇头",
        "键盘侠：快速敲击键盘，实际上只是在记事本打乱码",
        "文档研究：打开一份长文档，慢慢滚动，偶尔点头",
        "邮件整理：花20分钟给邮箱分类，看起来很专注",
        "设备问题：声称电脑很慢，需要'等它处理'",
        "系统更新：声称必须等待Windows更新完成",
        "文件同步：盯着进度条，实际上在看短视频",
        "专业搜索：在搜索引擎输入长查询，看起来在研究",
        "电池焦虑：声称笔记本快没电，需要找充电器",
      ],
      movement: [
        "战略性喝水：每小时起身接水一次",
        "紧急演练：突然抓起手机说'我接个重要电话'",
        "战略性打印：去打印机等待一份并不存在的文件",
        "专业散步：拿着笔记本在办公室走动，看起来在思考",
        "咖啡战术：频繁去茶水间，每次停留5-10分钟",
        "文件传递：主动提出帮同事送文件到其他部门",
        "设备检查：定期检查打印机、复印机是否正常工作",
        "办公用品：经常去办公用品区，慢慢挑选需要的物品",
        '同事咨询：走到同事桌前进行"工作讨论"',
        "午餐延长：提前15分钟出发，晚15分钟返回",
      ],
      mental: [
        "专业发呆：盯着屏幕，眉头微皱，看起来在思考难题",
        "学习时间：打开技术文档，实际上在看八卦新闻",
        "数据分析：盯着Excel表格，实际上在玩数独",
        "研究竞品：浏览其他公司网站，实则在网购",
        "笔记整理：认真抄写已有笔记，看起来很勤奋",
        "团队沟通：在Slack上发表情包，算作'团队建设'",
        "创意时间：声称需要安静环境进行头脑风暴",
        '职业发展：浏览LinkedIn，声称在"拓展人脉"',
        "行业研究：阅读行业新闻，实际是在看娱乐八卦",
        "自我提升：参加在线培训，同时刷短视频",
      ],
      excuse: [
        "迟到借口：'早高峰地铁延误了20分钟'",
        "早退理由：'需要去银行办理业务，下班前银行就关门了'",
        "请假神器：'家里水管爆了，需要等维修工'",
        "会议缺席：'抱歉，我有个冲突的客户电话'",
        "任务延期：'等待第三方数据，无法继续推进'",
        "工作推迟：'我需要其他部门的输入才能完成'",
        "责任转移：'服务器问题导致我无法访问文件'",
        "进度缓慢：'这个比预期的复杂得多'",
        "无法联系：'信号不好，没收到你的消息'",
        "拒绝加班：'今晚有重要的家庭聚会'",
      ],
    }),
    [],
  )

  // 所有类别的小贴士合并
  const allTips = useMemo(() => Object.values(slackingTips).flat(), [slackingTips])

  // 初始化
  useEffect(() => {
    // 初始化能量等级
    const storedEnergy = localStorage.getItem("slackingEnergy")
    if (storedEnergy) {
      setEnergyLevel(Number.parseInt(storedEnergy))
    } else {
      setEnergyLevel(50) // 默认能量值
    }

    // 绘制五彩纸屑
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }
  }, []) // 空依赖数组，只在组件挂载时运行一次

  // 设置初始小贴士
  useEffect(() => {
    const tips = tipCategory === "all" ? allTips : slackingTips[tipCategory as keyof typeof slackingTips]
    setCurrentTip(tips[Math.floor(Math.random() * tips.length)])
  }, [tipCategory, allTips, slackingTips]) // 只在tipCategory变化时更新

  // 计算工作时间进度
  useEffect(() => {
    const calculateProgress = () => {
      const now = new Date()
      const day = now.getDay() // 0是周日，1是周一，...，6是周六
      const hour = now.getHours()
      const minute = now.getMinutes()
      const second = now.getSeconds()

      // 设置当前日期和时间
      const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
      setCurrentDay(days[day])
      setCurrentDate(`${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`)
      setCurrentTime(
        `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`,
      )

      // 如果是周末，进度为0或100%
      if (day === 0 || day === 6) {
        setWeekProgress(100)
        setDayProgress(100)
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
        return
      }

      // 计算本周工作进度（周一到周五，每天9点到18点）
      // 一周工作时间 = 5天 * 9小时 = 45小时
      const workDaysPassed = day - 1 // 已经过去的工作日数量
      let hoursPassed = 0

      if (hour < 9) {
        // 还没开始工作
        hoursPassed = workDaysPassed * 9
      } else if (hour >= 18) {
        // 今天工作已结束
        hoursPassed = workDaysPassed * 9 + 9
      } else {
        // 工作中
        hoursPassed = workDaysPassed * 9 + (hour - 9) + minute / 60 + second / 3600
      }

      const weekProgressValue = Math.min(100, (hoursPassed / 45) * 100)
      setWeekProgress(weekProgressValue)

      // 计算今天工作进度
      let dayProgressValue = 0
      if (hour < 9) {
        dayProgressValue = 0
      } else if (hour >= 18) {
        dayProgressValue = 100
      } else {
        const minutesSinceMorning = (hour - 9) * 60 + minute + second / 60
        dayProgressValue = (minutesSinceMorning / (9 * 60)) * 100
      }
      setDayProgress(dayProgressValue)

      // 计算距离下班还有多久
      if (hour >= 18 || day === 0 || day === 6) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
      } else {
        const secondsUntilEnd = (18 - hour - 1) * 3600 + (60 - minute - 1) * 60 + (60 - second)
        const hoursLeft = Math.floor(secondsUntilEnd / 3600)
        const minutesLeft = Math.floor((secondsUntilEnd % 3600) / 60)
        const secondsLeft = secondsUntilEnd % 60
        setTimeLeft({ hours: hoursLeft, minutes: minutesLeft, seconds: secondsLeft })
      }
    }

    calculateProgress()
    const intervalId = setInterval(calculateProgress, 1000)

    return () => clearInterval(intervalId)
  }, [])

  // 随机获取新的摸鱼小贴士
  const getNewTip = () => {
    if (isChangingTip) return // 防止重复点击

    setIsChangingTip(true)

    // 增加能量值
    const newEnergy = Math.min(energyLevel + 5, 100)
    setEnergyLevel(newEnergy)
    localStorage.setItem("slackingEnergy", newEnergy.toString())

    // 如果能量值达到100，显示庆祝效果
    if (newEnergy >= 100) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
      // 重置能量值
      setEnergyLevel(0)
      localStorage.setItem("slackingEnergy", "0")
    }

    setTimeout(() => {
      const tips = tipCategory === "all" ? allTips : slackingTips[tipCategory as keyof typeof slackingTips]
      let newTip = currentTip
      while (newTip === currentTip && tips.length > 1) {
        newTip = tips[Math.floor(Math.random() * tips.length)]
      }
      setCurrentTip(newTip)
      setIsChangingTip(false)
    }, 500)
  }

  // 切换声音
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
  }

  // 切换小贴士类别
  const changeTipCategory = (category: string) => {
    if (category === tipCategory) return // 防止重复点击同一类别
    setTipCategory(category)
  }

  // 绘制五彩纸屑 - 只在showConfetti变化且为true时执行一次
  useEffect(() => {
    if (!showConfetti || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 简单的五彩纸屑效果
    const confettiCount = 100
    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"]

    for (let i = 0; i < confettiCount; i++) {
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 10 + 5,
        Math.random() * 10 + 5,
      )
    }
  }, [showConfetti])

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* 五彩纸屑画布 */}
      {showConfetti && <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-50" />}

      {/* 标题 */}
      <div className="mb-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
          摸鱼能量充电站
        </h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">
          高效摸鱼，快乐工作 | {currentDay} {currentDate}
        </p>
      </div>

      {/* 主要内容区 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 左侧：时间和进度 */}
        <div className="md:col-span-2 space-y-6">
          {/* 当前时间卡片 */}
          <div className="neumorphic-card p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-900/30">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300 flex items-center">
                <Clock className="mr-2" size={20} />
                当前时间
              </h2>
              <div className="text-3xl font-mono font-bold text-blue-800 dark:text-blue-200">{currentTime}</div>
            </div>

            {/* 下班倒计时 */}
            <div className="mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-blue-600 dark:text-blue-400">下班倒计时</span>
                <span className="font-mono font-bold text-blue-700 dark:text-blue-300">
                  {timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0
                    ? `${timeLeft.hours}小时 ${timeLeft.minutes}分钟 ${timeLeft.seconds}秒`
                    : "已下班"}
                </span>
              </div>
              <div className="w-full h-3 bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${dayProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* 周进度卡片 */}
          <div className="neumorphic-card p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-900/30">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300 flex items-center">
                <Briefcase className="mr-2" size={20} />
                本周进度
              </h2>
              <div className="text-2xl font-mono font-bold text-purple-800 dark:text-purple-200">
                {weekProgress.toFixed(1)}%
              </div>
            </div>

            {/* 周进度条 */}
            <div className="w-full h-4 bg-purple-100 dark:bg-purple-900/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${weekProgress}%` }}
              ></div>
            </div>

            {/* 周进度图示 */}
            <div className="mt-4 grid grid-cols-5 gap-1">
              {["周一", "周二", "周三", "周四", "周五"].map((day, index) => {
                const dayNumber = index + 1
                const currentDayNumber = new Date().getDay()
                const isPast = dayNumber < currentDayNumber
                const isCurrent = dayNumber === currentDayNumber

                return (
                  <div key={day} className="text-center">
                    <div
                      className={`h-2 rounded-full ${
                        isPast
                          ? "bg-purple-500"
                          : isCurrent
                            ? "bg-gradient-to-r from-purple-500 to-pink-500"
                            : "bg-purple-200 dark:bg-purple-800/30"
                      }`}
                    ></div>
                    <span
                      className={`text-xs mt-1 block ${
                        isCurrent
                          ? "font-bold text-purple-700 dark:text-purple-300"
                          : "text-purple-600 dark:text-purple-400"
                      }`}
                    >
                      {day}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 右侧：能量和小贴士 */}
        <div className="space-y-6">
          {/* 摸鱼能量卡片 */}
          <div className="neumorphic-card p-6 rounded-xl bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border border-green-100 dark:border-green-900/30">
            <h2 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-3 flex items-center">
              <Coffee className="mr-2" size={20} />
              摸鱼能量
            </h2>

            {/* 能量条 */}
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-green-600 dark:text-green-400">能量值</span>
              <span className="font-mono font-bold text-green-700 dark:text-green-300">{energyLevel}%</span>
            </div>
            <div className="w-full h-4 bg-green-100 dark:bg-green-900/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${energyLevel}%` }}
              ></div>
            </div>

            <div className="mt-3 text-xs text-green-600 dark:text-green-400">
              获取摸鱼小贴士可增加能量值，能量满时将获得特殊奖励！
            </div>
          </div>

          {/* 声音控制 */}
          <div className="flex justify-end">
            <button
              onClick={toggleSound}
              className="neumorphic-button p-2 rounded-lg text-neutral-600 dark:text-neutral-400"
              aria-label={soundEnabled ? "关闭声音" : "开启声音"}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* 摸鱼小贴士区域 */}
      <div className="mt-6 neumorphic-card p-6 rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-700">
        {/* 小贴士类别选择 */}
        <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => changeTipCategory("all")}
            className={`neumorphic-button px-3 py-1.5 rounded-lg text-sm ${
              tipCategory === "all" ? "neumorphic-button-active" : ""
            }`}
          >
            全部小贴士
          </button>
          <button
            onClick={() => changeTipCategory("meeting")}
            className={`neumorphic-button px-3 py-1.5 rounded-lg text-sm ${
              tipCategory === "meeting" ? "neumorphic-button-active" : ""
            }`}
          >
            会议战术
          </button>
          <button
            onClick={() => changeTipCategory("computer")}
            className={`neumorphic-button px-3 py-1.5 rounded-lg text-sm ${
              tipCategory === "computer" ? "neumorphic-button-active" : ""
            }`}
          >
            电脑技巧
          </button>
          <button
            onClick={() => changeTipCategory("movement")}
            className={`neumorphic-button px-3 py-1.5 rounded-lg text-sm ${
              tipCategory === "movement" ? "neumorphic-button-active" : ""
            }`}
          >
            移动战略
          </button>
          <button
            onClick={() => changeTipCategory("mental")}
            className={`neumorphic-button px-3 py-1.5 rounded-lg text-sm ${
              tipCategory === "mental" ? "neumorphic-button-active" : ""
            }`}
          >
            心理战术
          </button>
          <button
            onClick={() => changeTipCategory("excuse")}
            className={`neumorphic-button px-3 py-1.5 rounded-lg text-sm ${
              tipCategory === "excuse" ? "neumorphic-button-active" : ""
            }`}
          >
            借口大全
          </button>
        </div>

        <h3 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-neutral-100">今日摸鱼小贴士</h3>
        <div className="min-h-[80px] flex items-center">
          <p
            className={`text-lg text-neutral-700 dark:text-neutral-300 transition-opacity duration-500 ${isChangingTip ? "opacity-0" : "opacity-100"}`}
          >
            {currentTip}
          </p>
        </div>
        <div className="flex items-center mt-4">
          <button
            onClick={getNewTip}
            disabled={isChangingTip}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/20 active:scale-95 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <RefreshCw size={18} className="mr-2" />
            换一个摸鱼技巧
          </button>
        </div>
      </div>

      {/* 摸鱼小提示 */}
      <div className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">
        <h4 className="font-medium mb-2">摸鱼小提示：</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>工作日进度基于周一至周五，每天9:00-18:00的工作时间</li>
          <li>获取摸鱼小贴士可以增加摸鱼能量，能量满时会有惊喜</li>
          <li>不同类别的小贴士适用于不同场景，灵活运用效果更佳</li>
          <li>记得适度摸鱼，保持工作与休息的平衡</li>
        </ul>
      </div>
    </div>
  )
}
