export const menuConfig = {
  siteName: {
    en: "DevTools Hub",
    zh: "开发工具集",
  },
  mainMenu: [
    // 代码工具 - 放在第一位
    {
      category: {
        en: "Code Tools",
        zh: "代码工具",
      },
      icon: "💻",
      subItems: [
        {
          name: {
            en: "Formatters & Validators",
            zh: "格式化与验证",
          },
          tools: [
            { name: { en: "JSON Formatter", zh: "JSON格式化" }, route: "/json-formatter" },
            { name: { en: "Code Beautifier", zh: "代码美化" }, route: "/code-beautifier" },
            { name: { en: "HTML Formatter", zh: "HTML格式化" }, route: "/html-formatter" },
            { name: { en: "CSS Formatter", zh: "CSS格式化" }, route: "/css-formatter" },
            { name: { en: "RegEx Tester", zh: "正则表达式测试" }, route: "/regex-tester" },
          ],
        },
        {
          name: {
            en: "Converters",
            zh: "转换工具",
          },
          tools: [
            { name: { en: "Base Converter", zh: "进制转换" }, route: "/base-converter" },
            { name: { en: "JSON to YAML", zh: "JSON转YAML" }, route: "/json-to-yaml" },
            { name: { en: "JSON to XML", zh: "JSON转XML" }, route: "/json-to-xml" },
            { name: { en: "CSV to JSON", zh: "CSV转JSON" }, route: "/csv-to-json" },
          ],
        },
        {
          name: {
            en: "Calculators",
            zh: "计算工具",
          },
          tools: [
            { name: { en: "Programmer Calculator", zh: "程序员计算器" }, route: "/programmer-calculator" },
            { name: { en: "Scientific Calculator", zh: "科学计算器" }, route: "/calculator" },
            { name: { en: "Color Converter", zh: "颜色转换器" }, route: "/color-converter" },
            { name: { en: "Aspect Ratio Calculator", zh: "宽高比计算器" }, route: "/aspect-ratio-calculator" },
          ],
        },
        {
          name: {
            en: "Editors",
            zh: "编辑器",
          },
          tools: [
            { name: { en: "Code Editor", zh: "代码编辑器" }, route: "/code-editor" },
            { name: { en: "Markdown Editor", zh: "Markdown编辑器" }, route: "/markdown-editor" },
          ],
        },
      ],
    },
    // 职场工具 - 放在第二位
    {
      category: {
        en: "Workplace Tools",
        zh: "职场工具",
      },
      icon: "💼",
      tools: [
        { name: { en: "Workplace Comeback Simulator", zh: "职场嘴替模拟器" }, route: "/workplace-comeback" },
        { name: { en: "Slacking Progress Dashboard", zh: "摸鱼进度看板" }, route: "/slacking-dashboard" },
        { name: { en: "Resignation Reason Generator", zh: "离职原因生成器" }, route: "/resignation-reason" },
        { name: { en: "Procrastination Arena", zh: "拖延症斗兽场" }, route: "/procrastination-arena" },
        { name: { en: "Corporate Translator", zh: "消息废话翻译官" }, route: "/corporate-translator" },
      ],
      subItems: [], // Empty subItems array to maintain compatibility
    },
    // AI工具 - 放在第三位
    {
      category: {
        en: "AI Tools",
        zh: "AI工具",
      },
      icon: "🤖",
      route: "/ai-tools", // Direct route to AI tools page
      subItems: [], // Empty subItems array
    },
    // 游戏与休闲 - 放在第四位
    {
      category: {
        en: "Games & Relaxation",
        zh: "游戏与休闲",
      },
      icon: "🎮",
      subItems: [
        {
          name: {
            en: "Games",
            zh: "游戏",
          },
          tools: [
            { name: { en: "2048 Game", zh: "2048游戏" }, route: "/game-2048" },
            { name: { en: "Sudoku", zh: "数独" }, route: "/sudoku" },
            { name: { en: "Minesweeper", zh: "扫雷" }, route: "/minesweeper" },
            { name: { en: "Tetris", zh: "俄罗斯方块" }, route: "/tetris" },
          ],
        },
        {
          name: {
            en: "Relaxation",
            zh: "放松工具",
          },
          tools: [
            { name: { en: "White Noise", zh: "白噪音" }, route: "/white-noise" },
            { name: { en: "Breathing Exercise", zh: "呼吸练习" }, route: "/breathing-exercise" },
            { name: { en: "Eye Rest Timer", zh: "护眼提醒" }, route: "/eye-rest" },
          ],
        },
      ],
    },
    // 其他原有菜单项保持不变
    {
      category: {
        en: "Crypto & Security",
        zh: "加密与安全",
      },
      icon: "🔐",
      subItems: [
        {
          name: {
            en: "Hash Generators",
            zh: "哈希生成器",
          },
          tools: [
            { name: { en: "MD5 Generator", zh: "MD5生成器" }, route: "/md5-generator" },
            { name: { en: "SHA Generator", zh: "SHA生成器" }, route: "/sha-generator" },
            { name: { en: "Hash Generator", zh: "哈希生成器" }, route: "/hash-generator" },
          ],
        },
        {
          name: {
            en: "Encryption",
            zh: "加密工具",
          },
          tools: [
            { name: { en: "AES Encryption", zh: "AES加密" }, route: "/aes-encrypt" },
            { name: { en: "JWT Decoder", zh: "JWT解码" }, route: "/jwt-decoder" },
            { name: { en: "Password Generator", zh: "密码生成器" }, route: "/password-generator" },
          ],
        },
        {
          name: {
            en: "Encoders/Decoders",
            zh: "编码/解码",
          },
          tools: [
            { name: { en: "URL Encoder", zh: "URL编码" }, route: "/url-encoder" },
            { name: { en: "Base64 Encoder", zh: "Base64编码" }, route: "/base64-encoder" },
            { name: { en: "HTML Entity Encoder", zh: "HTML实体编码" }, route: "/html-entity-encoder" },
          ],
        },
      ],
    },
    {
      category: {
        en: "Text & Documents",
        zh: "文本与文档",
      },
      icon: "📝",
      subItems: [
        {
          name: {
            en: "Markdown Tools",
            zh: "Markdown工具",
          },
          tools: [
            { name: { en: "Markdown Editor", zh: "Markdown编辑器" }, route: "/markdown-editor" },
            { name: { en: "Markdown Guide", zh: "Markdown指南" }, route: "/markdown-guide" },
            { name: { en: "Markdown to HTML", zh: "Markdown转HTML" }, route: "/markdown-to-html" },
          ],
        },
        {
          name: {
            en: "Text Processing",
            zh: "文本处理",
          },
          tools: [
            { name: { en: "Text Diff Checker", zh: "文本差异对比" }, route: "/text-diff" },
            { name: { en: "Case Converter", zh: "大小写转换" }, route: "/text-case" },
            { name: { en: "Character Counter", zh: "字符计数器" }, route: "/character-counter" },
            { name: { en: "Translator", zh: "翻译工具" }, route: "/translator" },
          ],
        },
        {
          name: {
            en: "Generators",
            zh: "生成器",
          },
          tools: [
            { name: { en: "UUID Generator", zh: "UUID生成器" }, route: "/uuid-generator" },
            { name: { en: "Lorem Ipsum", zh: "占位文本生成" }, route: "/lorem-ipsum" },
            { name: { en: "Code Snippet Library", zh: "代码片段库" }, route: "/code-snippets" },
          ],
        },
      ],
    },
    {
      category: {
        en: "Network Tools",
        zh: "网络工具",
      },
      icon: "🌐",
      subItems: [
        {
          name: {
            en: "HTTP Tools",
            zh: "HTTP工具",
          },
          tools: [
            { name: { en: "API Tester", zh: "API测试器" }, route: "/api-tester", isExternalLink: true },
            { name: { en: "HTTP Status Codes", zh: "HTTP状态码" }, route: "/http-status-codes", isExternalLink: true },
            { name: { en: "CORS Tester", zh: "CORS测试器" }, route: "/cors-tester", isExternalLink: true },
          ],
        },
        {
          name: {
            en: "DNS & IP Tools",
            zh: "DNS与IP工具",
          },
          tools: [
            { name: { en: "IP Lookup", zh: "IP查询" }, route: "/ip-lookup", isExternalLink: true },
            { name: { en: "DNS Lookup", zh: "DNS查询" }, route: "/dns-lookup", isExternalLink: true },
            { name: { en: "SSL Checker", zh: "SSL检查器" }, route: "/ssl-checker", isExternalLink: true },
          ],
        },
      ],
    },
    {
      category: {
        en: "Productivity",
        zh: "生产力工具",
      },
      icon: "⏱️",
      subItems: [
        {
          name: {
            en: "Time Management",
            zh: "时间管理",
          },
          tools: [
            { name: { en: "Pomodoro Timer", zh: "番茄钟" }, route: "/pomodoro" },
            { name: { en: "Productivity Tools", zh: "生产力工具" }, route: "/productivity-tools" },
            { name: { en: "Meeting Timer", zh: "会议计时器" }, route: "/meeting-timer" },
          ],
        },
        {
          name: {
            en: "Note Taking",
            zh: "笔记工具",
          },
          tools: [
            { name: { en: "Quick Notes", zh: "快速笔记" }, route: "/quick-notes" },
            { name: { en: "Task List", zh: "任务列表" }, route: "/task-list" },
            { name: { en: "Meeting Notes", zh: "会议记录" }, route: "/meeting-notes" },
          ],
        },
        {
          name: {
            en: "Currency & Finance",
            zh: "货币与金融",
          },
          tools: [
            { name: { en: "Currency Converter", zh: "货币换算" }, route: "/currency-converter" },
            { name: { en: "Tip Calculator", zh: "小费计算器" }, route: "/tip-calculator" },
            { name: { en: "Discount Calculator", zh: "折扣计算器" }, route: "/discount-calculator" },
          ],
        },
      ],
    },
  ],
  quickAccess: [
    { name: { en: "JSON Formatter", zh: "JSON格式化" }, route: "/json-formatter", icon: "{}" },
    { name: { en: "Markdown Editor", zh: "Markdown编辑器" }, route: "/markdown-editor", icon: "📝" },
    { name: { en: "Programmer Calculator", zh: "程序员计算器" }, route: "/programmer-calculator", icon: "🧮" },
    { name: { en: "Base Converter", zh: "进制转换" }, route: "/base-converter", icon: "⟲" },
    { name: { en: "Pomodoro Timer", zh: "番茄钟" }, route: "/pomodoro", icon: "⏱️" },
    { name: { en: "2048 Game", zh: "2048游戏" }, route: "/game-2048", icon: "🎮" },
    { name: { en: "AI Assistants", zh: "AI工具" }, route: "/ai-tools", icon: "🤖" },
    { name: { en: "Workplace Comeback", zh: "职场工具" }, route: "/workplace-comeback", icon: "💼" },
    { name: { en: "Code Editor", zh: "代码编辑器" }, route: "/code-editor", icon: "💻" },
  ],
  settings: {
    darkMode: true,
    saveHistory: true,
    defaultRoute: "/dashboard",
  },
}
