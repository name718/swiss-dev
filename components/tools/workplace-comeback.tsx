"use client"

import { useState } from "react"
import { Copy } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function WorkplaceComeback() {
  const { language } = useLanguage()
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Predefined response library
  const responseLibrary = {
    // Work hours related
    下班: [
      "我在赶明天的方案呢~",
      "效率高也有错吗？😏",
      "今天任务提前完成了，正好可以准备明天的工作",
      "我这不是想提前解决问题，避免明天加班嘛",
      "刚才在思考工作问题，现在想通了准备去实践一下",
      "我把今天的工作都提前规划好了，所以完成得比较快",
      "我觉得工作效率比工作时长更重要",
      "我今天早到了一会儿，所以现在正好平衡一下",
    ],
    加班: [
      "加班是为了更好的不加班",
      "我把加班当作自我提升的机会",
      "能者多劳，我很荣幸",
      "这个项目太有挑战性了，我很享受这个过程",
      "多一点时间，多一点完美",
      "我觉得这个项目值得我多投入一些时间",
      "现在多付出一点，未来会更轻松",
      "我想确保明天的汇报万无一失",
    ],
    迟到: [
      "我在路上就开始处理邮件了",
      "堵车的时候我在听工作相关的播客充电",
      "我调整了工作时间，会在晚上补回来的",
      "今天早上远程参加了一个重要会议",
      "我刚才在思考项目方案，已经有了新的想法",
      "我已经提前通知了团队，并做好了工作安排",
      "我把今天的会议记录都整理好发给大家了",
      "我已经在路上处理了几个紧急问题",
    ],

    // Salary related
    工资: [
      "钱少活多，但成长快啊！",
      "要不您看看行业薪资？",
      "我更看重的是这里的发展机会",
      "薪资是动力，但不是全部",
      "我相信公司会根据我的贡献给予合理的回报",
      "我觉得能力提升了，薪资自然会跟上",
      "我更关注能否持续学习新技能",
      "我相信公司的薪酬体系是公平合理的",
    ],
    加薪: [
      "我希望我的价值能被公平地认可",
      "我最近的工作成果是否达到了加薪的标准？",
      "我想了解一下我需要达到什么目标才能获得加薪",
      "我相信公司有完善的薪资增长体系",
      "我更关注如何为公司创造更多价值",
      "我希望能和您讨论一下我的职业发展路径",
      "我想知道在哪些方面还需要提升才能获得更好的回报",
      "我相信付出和回报终究会成正比",
    ],
    奖金: [
      "奖金是锦上添花，成长才是雪中送炭",
      "我相信付出总会有回报的",
      "我更看重的是团队的整体表现",
      "奖金是对过去的肯定，我更期待未来的挑战",
      "能为公司创造价值本身就很有成就感",
      "我相信公司会公平地分配奖金",
      "我会继续努力，不管有没有额外奖励",
      "团队的成功比个人的奖金更重要",
    ],

    // Performance related
    绩效: [
      "感谢您的反馈，我会努力改进",
      "我想了解一下具体哪些方面需要提升",
      "这是我成长的好机会",
      "我已经制定了提升计划，希望得到您的指导",
      "我相信下一次评估会看到我的进步",
      "您的建议对我非常宝贵",
      "我会把这次评估作为前进的动力",
      "我希望能和您一起制定改进计划",
    ],
    失误: [
      "这是我的责任，我已经总结了经验教训",
      "感谢指出，我会立即改正并避免再次发生",
      "我已经想好了解决方案",
      "这个错误让我学到了很多，不会再犯",
      "我会把这次经历转化为提升自己的机会",
      "我已经分析了失误原因，并制定了预防措施",
      "我会向团队分享这个教训，避免大家重复犯错",
      "我会负责到底，确保问题得到彻底解决",
    ],
    能力: [
      "我正在不断学习提升中",
      "我很清楚自己的不足，也在积极改进",
      "感谢您的坦诚，这对我的成长很重要",
      "我已经制定了能力提升计划",
      "我相信通过努力，我能达到您的期望",
      "我会利用业余时间提升自己的专业技能",
      "我已经报名了相关培训课程",
      "我正在向团队中的优秀同事学习",
    ],

    // Project related
    项目: [
      "这个项目的挑战正是我想要的",
      "我已经开始研究相关资料了",
      "我对这个项目充满信心",
      "我已经想好了几个可行的方案",
      "这个项目对我的成长很有帮助",
      "我会全力以赴完成这个项目",
      "我已经做了详细的项目计划",
      "我很期待能在这个项目中展示我的能力",
    ],
    deadline: [
      "我会合理安排时间，确保按期完成",
      "我已经制定了详细的时间表",
      "如果有困难，我会提前沟通",
      "挑战越大，成就感越强",
      "我会尽全力按时高质量地完成",
      "我已经开始着手准备了",
      "我会每天汇报进度，确保不延期",
      "我已经预留了缓冲时间应对突发情况",
    ],
    质量: [
      "我始终把质量放在首位",
      "我会对自己的工作负责到底",
      "高标准才有高质量，我完全理解",
      "我会不断检查和优化",
      "追求卓越是我的工作准则",
      "我会确保每个细节都经过仔细检查",
      "我已经设计了完善的质量检查流程",
      "我会邀请同事帮我复核工作成果",
    ],

    // Colleague related
    同事: [
      "团队合作是成功的关键",
      "我会积极沟通，解决分歧",
      "每个人都有自己的优势，我们可以互补",
      "我会尽力协调好团队关系",
      "我相信通过坦诚沟通可以解决问题",
      "我会主动承担责任，不推卸给他人",
      "我尊重每位同事的工作和贡献",
      "我会尽力创造和谐的工作氛围",
    ],
    竞争: [
      "良性竞争可以促进团队进步",
      "我更关注如何提升自己而不是击败他人",
      "合作大于竞争，团队成功才是真成功",
      "我相信每个人都有自己的发展轨迹",
      "我希望和同事们一起成长",
      "竞争是为了让团队更强大，而不是个人荣誉",
      "我会用实力说话，而不是内部政治",
      "我相信真正的竞争力来自持续学习",
    ],
    冲突: [
      "我会保持冷静，寻求建设性的解决方案",
      "不同观点可以带来更全面的思考",
      "我尊重不同意见，也希望表达自己的看法",
      "我会尽力找到对双方都有利的解决方案",
      "沟通是解决冲突的最佳方式",
      "我会换位思考，理解对方的立场",
      "我相信通过坦诚对话可以消除误会",
      "我会把注意力放在问题本身，而不是个人情绪",
    ],

    // Leadership related
    领导: [
      "我很感谢您的指导和支持",
      "您的反馈对我非常宝贵",
      "我会认真思考您的建议",
      "我希望能更多地向您学习",
      "您的经验对我的成长很重要",
      "我会努力达到您的期望",
      "我很珍惜您给我的这个机会",
      "我会用实际行动证明您的信任没有错",
    ],
    批评: [
      "感谢您的坦诚反馈，这对我很重要",
      "我会认真反思并改进",
      "您指出的问题很到位，我会立即调整",
      "批评是最好的礼物，谢谢您",
      "我很重视您的意见，会努力做得更好",
      "这是我成长的机会，感谢您的指导",
      "我会把您的批评转化为进步的动力",
      "我理解您的期望，会努力达到标准",
    ],
    升职: [
      "我会不断提升自己的能力和价值",
      "我希望通过实际贡献证明自己",
      "我正在积极准备承担更多责任",
      "我相信机会是留给有准备的人",
      "我会向您学习管理经验",
      "我已经在主动承担一些额外的工作",
      "我希望能得到更多锻炼的机会",
      "我相信公司会公平地评估每个人的贡献",
    ],

    // Work-life balance
    休假: [
      "我已经安排好了工作交接",
      "我会确保休假期间不影响团队工作",
      "适当的休息可以提高工作效率",
      "我会在休假前完成所有紧急任务",
      "我已经提前完成了本周的工作目标",
      "我会保持联系，处理紧急事务",
      "我相信团队可以短暂地承担我的工作",
      "休息好了才能更好地工作",
    ],
    压力: [
      "我正在学习更好的时间管理方法",
      "压力也是一种动力，我会调整好心态",
      "我会合理规划工作，避免过度疲劳",
      "我相信通过有效沟通可以减轻压力",
      "我已经制定了应对高压的策略",
      "我会保持健康的生活方式来应对压力",
      "我会把大任务分解成小目标，逐步完成",
      "我相信挑战过后会成长得更快",
    ],
    加班费: [
      "我更看重的是工作经验和能力提升",
      "我理解公司的政策和规定",
      "我相信公司会合理补偿我的额外付出",
      "我会合理安排工作，提高效率",
      "我希望能和您讨论一下加班的补偿方案",
      "我相信公司会公平对待每位员工的付出",
      "我更关注的是项目的成功完成",
      "我希望能找到平衡工作效率和时间的方法",
    ],

    // Default responses
    default: [
      "这个问题我需要想想...",
      "您希望我如何改进？",
      "感谢您的反馈，我会认真考虑",
      "这是个好问题，让我思考一下",
      "我理解您的顾虑，我会努力做得更好",
      "您的建议对我很重要",
      "我会把这个问题放在心上",
      "我明白了，会认真对待这个问题",
      "谢谢您的提醒，我会注意的",
      "我会从这个角度重新思考问题",
      "我很感谢您能直接指出这个问题",
      "我会认真反思并改进",
      "您的意见对我很有价值",
      "我会努力达到您的期望",
      "我理解您的立场，也希望表达我的想法",
    ],
  }

  // Generate answer based on input question
  const generateAnswer = () => {
    if (!question.trim()) return

    setIsAnimating(true)

    // Find matching keywords
    let foundResponse = false
    let response = ""

    // Check for keywords in the question
    for (const [keyword, responses] of Object.entries(responseLibrary)) {
      if (question.includes(keyword)) {
        // Get a random response for this keyword
        const randomIndex = Math.floor(Math.random() * responses.length)
        response = responses[randomIndex]
        foundResponse = true
        break
      }
    }

    // If no keyword matched, use default responses
    if (!foundResponse) {
      const defaultResponses = responseLibrary["default"]
      const randomIndex = Math.floor(Math.random() * defaultResponses.length)
      response = defaultResponses[randomIndex]
    }

    // Set the answer with a slight delay for animation effect
    setTimeout(() => {
      setAnswer(response)
      setShowResult(true)
      setIsAnimating(false)
    }, 500)
  }

  // Copy answer to clipboard
  const copyToClipboard = () => {
    if (!answer) return

    navigator.clipboard.writeText(answer).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const shareToWechat = () => {
    if (!answer) return

    // In a real app, this would use WeChat sharing API
    // For now, we'll just copy the text to clipboard and show a message
    const text = `问题：${question}\n高情商回答：${answer}`
    navigator.clipboard.writeText(text).then(() => {
      alert("内容已复制，请粘贴到微信分享")
    })
  }

  const shareToXiaohongshu = () => {
    if (!answer) return

    // In a real app, this would use Xiaohongshu sharing API
    // For now, we'll just copy the text to clipboard and show a message
    const text = `职场情商指南 ✨\n\n问题：${question}\n高情商回答：${answer}\n\n#职场 #情商 #职场沟通 #职场技巧`
    navigator.clipboard.writeText(text).then(() => {
      alert("内容已复制，请粘贴到小红书分享")
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 inline-block">
          AI 嘴替：专治职场PUA
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 mt-2">
          {language === "zh"
            ? "输入职场刁难问题，立即获得高情商回复"
            : "Enter workplace difficult questions, get smart responses instantly"}
        </p>
      </div>

      <div className="neumorphic-card p-6 rounded-xl bg-neutral-800 dark:bg-neutral-900 mb-6">
        <div className="mb-4">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="输入老板的刁难问题，如：你下班这么早？"
            className="w-full p-4 rounded-lg bg-neutral-700 dark:bg-neutral-800 border border-neutral-600 dark:border-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          onClick={generateAnswer}
          disabled={isAnimating || !question.trim()}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 transform ${
            isAnimating ? "opacity-70 scale-95" : "hover:scale-[1.02] active:scale-95"
          } bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isAnimating ? "生成中..." : "生成高情商回复"}
        </button>
      </div>

      {showResult && (
        <div className={`transition-opacity duration-500 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
          <div className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">高情商回复：</div>

          <div className="neumorphic-card p-5 rounded-xl bg-gradient-to-r from-purple-900/30 to-blue-900/30 mb-4">
            <div className="flex">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                AI
              </div>
              <div className="ml-3 bg-neutral-700 dark:bg-neutral-800 p-4 rounded-lg max-w-[calc(100%-3rem)]">
                <p className="text-white">{answer}</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={copyToClipboard}
              className="flex-1 py-2 px-4 rounded-lg bg-neutral-700 dark:bg-neutral-800 text-white hover:bg-neutral-600 dark:hover:bg-neutral-700 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <Copy size={18} />
              <span>{copied ? "已复制" : "复制回复"}</span>
            </button>

            <button
              onClick={shareToWechat}
              className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.328.328 0 0 0 .186-.059l2.114-1.225a.94.94 0 0 1 .433-.13c.075 0 .149.015.223.045A9.628 9.628 0 0 0 8.691 16.875c4.8 0 8.691-3.288 8.691-7.344 0-4.056-3.891-7.343-8.691-7.343zm-5.285 7.35c0-.537.432-.972.964-.972.533 0 .965.435.965.971 0 .537-.432.972-.965.972-.532 0-.964-.435-.964-.972zm5.285.972c-.533 0-.965-.435-.965-.972 0-.536.432-.971.965-.971.533 0 .965.435.965.971 0 .537-.432.972-.965.972zm5.285-.972c0 .537-.432.972-.965.972-.533 0-.965-.435-.965-.972 0-.536.432-.971.965-.971.533 0 .965.435.965.971zm-.579 3.265l.143-.093c1.412-1.028 2.246-2.51 2.246-4.135 0-3.208-3.067-5.813-6.839-5.813S1.61 5.368 1.61 8.575c0 3.207 3.067 5.812 6.839 5.812.723 0 1.42-.09 2.07-.256l.163-.053c.161-.053.327-.08.492-.08.254 0 .497.06.712.172l1.387.804c.036.02.075.031.115.031a.18.18 0 0 0 .179-.179c0-.045-.018-.089-.03-.132l-.256-.97a.365.365 0 0 1 .132-.41z" />
              </svg>
              <span>分享到微信</span>
            </button>

            <button
              onClick={shareToXiaohongshu}
              className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9.24V7h4v3.76c1.21.67 2 1.97 2 3.44 0 2.21-1.79 4-4 4s-4-1.79-4-4c0-1.47.79-2.77 2-3.44zM12 9V7h-2v2h2zm0 5.7c.94 0 1.7-.76 1.7-1.7 0-.94-.76-1.7-1.7-1.7-.94 0-1.7.76-1.7 1.7 0 .94.76 1.7 1.7 1.7z" />
              </svg>
              <span>分享到小红书</span>
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 text-sm text-neutral-500 dark:text-neutral-400">
        <h3 className="font-medium mb-2">使用提示：</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>输入包含关键词如"下班"、"工资"、"加班"、"领导"、"同事"等的问题</li>
          <li>每次点击都会随机生成不同的回复</li>
          <li>复制按钮可以快速复制回复内容</li>
          <li>分享按钮可以将问题和回答分享到社交媒体</li>
        </ul>
      </div>
    </div>
  )
}
