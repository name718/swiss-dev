export const menuConfig = {
  siteName: "全能工具盒",
  mainMenu: [
    {
      category: "开发工具",
      icon: "💻",
      subItems: [
        {
          name: "JSON工具",
          tools: [
            { name: "JSON格式化", route: "/json-formatter" },
            { name: "JSON验证", route: "/json-validator" },
            { name: "JSON转XML", route: "/json-to-xml" },
            { name: "JSON转YAML", route: "/json-to-yaml" },
            { name: "JSON压缩", route: "/json-minify" },
          ],
        },
        {
          name: "编码/解码",
          tools: [
            { name: "URL编码/解码", route: "/url-encode" },
            { name: "Base64编码", route: "/base64-encode" },
            { name: "HTML实体编码", route: "/html-encode" },
          ],
        },
        {
          name: "数据转换",
          tools: [
            { name: "进制转换", route: "/base-converter" },
            { name: "时间戳转换", route: "/timestamp" },
            { name: "单位转换", route: "/unit-converter" },
          ],
        },
      ],
    },
    {
      category: "文本工具",
      icon: "📝",
      subItems: [
        {
          name: "Markdown工具",
          tools: [
            { name: "MD编辑器", route: "/markdown-editor" },
            { name: "MD转HTML", route: "/markdown-to-html" },
            { name: "MD表格生成器", route: "/markdown-table" },
          ],
        },
        {
          name: "文本处理",
          tools: [
            { name: "文本差异对比", route: "/text-diff" },
            { name: "正则测试", route: "/regex-tester" },
            { name: "大小写转换", route: "/text-case" },
          ],
        },
      ],
    },
    {
      category: "计算工具",
      icon: "🧮",
      subItems: [
        {
          name: "计算器",
          tools: [
            { name: "科学计算器", route: "/calculator" },
            { name: "程序员计算器", route: "/programmer-calculator" },
            { name: "货币换算", route: "/currency-converter" },
          ],
        },
        {
          name: "加密/哈希",
          tools: [
            { name: "MD5生成器", route: "/md5-generator" },
            { name: "SHA加密", route: "/sha-generator" },
            { name: "AES加密", route: "/aes-encrypt" },
          ],
        },
      ],
    },
    {
      category: "实用工具",
      icon: "🛠️",
      subItems: [
        {
          name: "剪贴板工具",
          tools: [
            { name: "多剪贴板", route: "/multi-clipboard" },
            { name: "历史记录", route: "/clipboard-history" },
          ],
        },
        {
          name: "游戏娱乐",
          tools: [
            { name: "2048游戏", route: "/game-2048" },
            { name: "扫雷", route: "/minesweeper" },
            { name: "数独", route: "/sudoku" },
          ],
        },
        {
          name: "放松板块",
          tools: [
            { name: "白噪音", route: "/white-noise" },
            { name: "呼吸练习", route: "/breathing-exercise" },
          ],
        },
      ],
    },
    {
      category: "网络工具",
      icon: "🌐",
      subItems: [
        {
          name: "翻译工具",
          tools: [
            { name: "多语言翻译", route: "/translator" },
            { name: "文本朗读", route: "/text-to-speech" },
          ],
        },
        {
          name: "网络测试",
          tools: [
            { name: "IP查询", route: "/ip-lookup" },
            { name: "Ping测试", route: "/ping-test" },
          ],
        },
      ],
    },
  ],
  quickAccess: [
    { name: "计算器", route: "/calculator", icon: "🧮" },
    { name: "JSON格式化", route: "/json-formatter", icon: "{}" },
    { name: "MD编辑器", route: "/markdown-editor", icon: "📝" },
    { name: "进制转换", route: "/base-converter", icon: "⟲" },
    { name: "2048游戏", route: "/game-2048", icon: "🎮" },
    { name: "翻译", route: "/translator", icon: "🌐" },
  ],
  settings: {
    darkMode: true,
    saveHistory: true,
    defaultRoute: "/dashboard",
  },
}

