"use client"

import { useState, useEffect, useRef } from "react"
import Editor, { type Monaco } from "@monaco-editor/react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/components/theme-context"
import { Download, Copy, Play, FileCode2, Settings, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// 支持的语言列表
const LANGUAGES = [
  { id: "javascript", name: "JavaScript" },
  { id: "typescript", name: "TypeScript" },
  { id: "html", name: "HTML" },
  { id: "css", name: "CSS" },
  { id: "json", name: "JSON" },
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
  { id: "csharp", name: "C#" },
  { id: "cpp", name: "C++" },
  { id: "go", name: "Go" },
  { id: "rust", name: "Rust" },
  { id: "php", name: "PHP" },
  { id: "ruby", name: "Ruby" },
  { id: "swift", name: "Swift" },
  { id: "kotlin", name: "Kotlin" },
  { id: "sql", name: "SQL" },
  { id: "markdown", name: "Markdown" },
  { id: "yaml", name: "YAML" },
  { id: "xml", name: "XML" },
  { id: "shell", name: "Shell/Bash" },
]

// 主题列表
const THEMES = [
  { id: "vs", name: "Light" },
  { id: "vs-dark", name: "Dark" },
  { id: "hc-black", name: "High Contrast Dark" },
  { id: "hc-light", name: "High Contrast Light" },
]

// 代码示例
const CODE_EXAMPLES: Record<string, string> = {
  javascript: `// JavaScript Example
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate the 10th Fibonacci number
const result = fibonacci(10);
console.log(\`The 10th Fibonacci number is: \${result}\`);

// Using modern JavaScript features
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
console.log('Doubled numbers:', doubled);

// Async/await example
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
`,
  typescript: `// TypeScript Example
interface Person {
  name: string;
  age: number;
  email?: string;
}

class Employee implements Person {
  constructor(
    public name: string,
    public age: number,
    public email: string,
    private department: string,
    protected salary: number
  ) {}

  public getDetails(): string {
    return \`\${this.name} (\${this.age}) works in \${this.department}\`;
  }

  public static createEmployee(name: string, age: number): Employee {
    return new Employee(name, age, \`\${name.toLowerCase()}@company.com\`, 'IT', 50000);
  }
}

// Generic function example
function getFirstElement<T>(array: T[]): T | undefined {
  return array.length > 0 ? array[0] : undefined;
}

const numbers: number[] = [1, 2, 3, 4, 5];
const firstNumber = getFirstElement(numbers);
console.log(firstNumber);

// Using type guards
function isString(value: any): value is string {
  return typeof value === 'string';
}

function processValue(value: string | number) {
  if (isString(value)) {
    return value.toUpperCase();
  }
  return value * 2;
}
`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HTML Example</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    header {
      background-color: #f4f4f4;
      padding: 20px;
      text-align: center;
      margin-bottom: 20px;
      border-radius: 5px;
    }
    .container {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }
    .card {
      flex: 1 1 300px;
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 15px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    footer {
      margin-top: 30px;
      text-align: center;
      color: #666;
    }
  </style>
</head>
<body>
  <header>
    <h1>Welcome to My Website</h1>
    <p>A simple HTML example with modern features</p>
  </header>
  
  <main>
    <section class="container">
      <div class="card">
        <h2>Card One</h2>
        <p>This is the first card with some sample content.</p>
        <button>Learn More</button>
      </div>
      <div class="card">
        <h2>Card Two</h2>
        <p>This is the second card with different content.</p>
        <button>Learn More</button>
      </div>
      <div class="card">
        <h2>Card Three</h2>
        <p>This is the third card with unique information.</p>
        <button>Learn More</button>
      </div>
    </section>
  </main>
  
  <footer>
    <p>&copy; 2023 My Website. All rights reserved.</p>
  </footer>
</body>
</html>`,
  css: `/* Modern CSS Example */

/* Variables */
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --dark-color: #2c3e50;
  --light-color: #ecf0f1;
  --danger-color: #e74c3c;
  --font-main: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  --border-radius: 4px;
  --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-main);
  line-height: 1.6;
  color: var(--dark-color);
  background-color: var(--light-color);
  padding: var(--spacing-lg);
}

/* Container with max-width and center alignment */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

/* Flexbox layout */
.flex-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.flex-item {
  flex: 1 1 300px;
  padding: var(--spacing-md);
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

/* Grid layout */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
  margin: var(--spacing-lg) 0;
}

.grid-item {
  background-color: white;
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

/* Button styles */
.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #2980b9;
}

.btn-secondary {
  background-color: var(--secondary-color);
}

.btn-secondary:hover {
  background-color: #27ae60;
}

/* Media queries for responsive design */
@media (max-width: 768px) {
  .flex-item, .grid-item {
    flex-basis: 100%;
  }
  
  .grid-container {
    grid-template-columns: 1fr;
  }
}

/* Animation example */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 1s ease-in;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #2980b9;
}`,
  json: `{
  "company": {
    "name": "Tech Innovations Inc.",
    "founded": 2010,
    "location": {
      "city": "San Francisco",
      "state": "CA",
      "country": "USA",
      "coordinates": {
        "latitude": 37.7749,
        "longitude": -122.4194
      }
    },
    "employees": 250,
    "public": false
  },
  "products": [
    {
      "id": "p001",
      "name": "Smart Home Hub",
      "category": "IoT",
      "price": 129.99,
      "features": [
        "Voice Control",
        "Smart Device Integration",
        "Energy Monitoring",
        "Mobile App"
      ],
      "specifications": {
        "dimensions": {
          "height": 110,
          "width": 110,
          "depth": 35
        },
        "weight": 220,
        "connectivity": ["WiFi", "Bluetooth", "Zigbee"],
        "powerSupply": "5V DC"
      },
      "inStock": true,
      "releaseDate": "2022-03-15"
    },
    {
      "id": "p002",
      "name": "Health Tracker Pro",
      "category": "Wearables",
      "price": 89.95,
      "features": [
        "Heart Rate Monitoring",
        "Sleep Tracking",
        "Step Counter",
        "Water Resistant"
      ],
      "specifications": {
        "dimensions": {
          "height": 45,
          "width": 38,
          "depth": 10
        },
        "weight": 32,
        "connectivity": ["Bluetooth"],
        "batteryLife": "7 days"
      },
      "inStock": true,
      "releaseDate": "2022-06-22"
    }
  ],
  "partnerships": [
    {
      "partner": "Global Tech Solutions",
      "type": "Research",
      "projects": 3,
      "active": true
    },
    {
      "partner": "University of Technology",
      "type": "Education",
      "projects": 2,
      "active": true
    },
    {
      "partner": "Innovative Startups Inc.",
      "type": "Investment",
      "projects": 5,
      "active": false
    }
  ],
  "financials": {
    "years": {
      "2020": {
        "revenue": 5200000,
        "expenses": 4100000,
        "profit": 1100000
      },
      "2021": {
        "revenue": 7800000,
        "expenses": 5900000,
        "profit": 1900000
      },
      "2022": {
        "revenue": 9500000,
        "expenses": 7200000,
        "profit": 2300000
      }
    },
    "currency": "USD",
    "fiscalYearEnd": "December"
  }
}`,
  python: `# Python Example
import os
import json
from typing import List, Dict, Optional, Union, Any
from dataclasses import dataclass
from datetime import datetime, timedelta
import requests

@dataclass
class User:
    """Class representing a user in the system."""
    id: int
    username: str
    email: str
    created_at: datetime
    is_active: bool = True
    last_login: Optional[datetime] = None
    
    def __post_init__(self):
        if isinstance(self.created_at, str):
            self.created_at = datetime.fromisoformat(self.created_at)
        if isinstance(self.last_login, str) and self.last_login:
            self.last_login = datetime.fromisoformat(self.last_login)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert user object to dictionary."""
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "created_at": self.created_at.isoformat(),
            "is_active": self.is_active,
            "last_login": self.last_login.isoformat() if self.last_login else None
        }
    
    def days_since_creation(self) -> int:
        """Calculate days since user was created."""
        return (datetime.now() - self.created_at).days


class UserRepository:
    """Repository for managing users."""
    
    def __init__(self, data_file: str = "users.json"):
        self.data_file = data_file
        self.users: List[User] = []
        self._load_data()
    
    def _load_data(self) -> None:
        """Load user data from file if it exists."""
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, "r") as f:
                    users_data = json.load(f)
                self.users = [User(**user_data) for user_data in users_data]
            except (json.JSONDecodeError, KeyError) as e:
                print(f"Error loading user data: {e}")
                self.users = []
        else:
            self.users = []
    
    def save_data(self) -> None:
        """Save user data to file."""
        with open(self.data_file, "w") as f:
            json.dump([user.to_dict() for user in self.users], f, indent=2)
    
    def add_user(self, user: User) -> User:
        """Add a new user."""
        if any(u.email == user.email for u in self.users):
            raise ValueError(f"User with email {user.email} already exists")
        
        self.users.append(user)
        self.save_data()
        return user
    
    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        for user in self.users:
            if user.id == user_id:
                return user
        return None
    
    def get_active_users(self) -> List[User]:
        """Get all active users."""
        return [user for user in self.users if user.is_active]
    
    def deactivate_user(self, user_id: int) -> bool:
        """Deactivate a user."""
        user = self.get_user_by_id(user_id)
        if user:
            user.is_active = False
            self.save_data()
            return True
        return False


# Example usage
if __name__ == "__main__":
    # Create repository
    repo = UserRepository()
    
    # Add some users
    new_user = User(
        id=1,
        username="johndoe",
        email="john@example.com",
        created_at=datetime.now() - timedelta(days=30)
    )
    
    try:
        repo.add_user(new_user)
        print(f"Added user: {new_user.username}")
    except ValueError as e:
        print(e)
    
    # Get active users
    active_users = repo.get_active_users()
    print(f"Active users: {len(active_users)}")
    
    # Fetch data from an API
    try:
        response = requests.get("https://jsonplaceholder.typicode.com/users")
        if response.status_code == 200:
            api_users = response.json()
            print(f"Fetched {len(api_users)} users from API")
        else:
            print(f"API request failed with status code {response.status_code}")
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
`,
}

// 默认代码
const DEFAULT_CODE = `// Welcome to the Code Editor
// Select a language from the dropdown above to get started
// or write your code here

console.log("Hello, World!");
`

// 编辑器选项
const DEFAULT_OPTIONS = {
  fontSize: 14,
  minimap: { enabled: true },
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  wordWrap: "on",
}

export default function CodeEditor() {
  const { theme } = useTheme()
  const [language, setLanguage] = useState("javascript")
  const [code, setCode] = useState(DEFAULT_CODE)
  const [editorTheme, setEditorTheme] = useState("vs-dark")
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [activeTab, setActiveTab] = useState("editor")
  const [editorOptions, setEditorOptions] = useState(DEFAULT_OPTIONS)
  const { toast } = useToast()
  const editorRef = useRef<any>(null)
  const monacoRef = useRef<Monaco | null>(null)

  // 当语言改变时，加载对应的示例代码
  useEffect(() => {
    if (CODE_EXAMPLES[language]) {
      setCode(CODE_EXAMPLES[language])
    }
  }, [language])

  // 根据应用主题设置编辑器主题
  useEffect(() => {
    setEditorTheme(theme === "dark" ? "vs-dark" : "vs")
  }, [theme])

  // 处理编辑器挂载
  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

    // 设置自定义主题
    monaco.editor.defineTheme("custom-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#1a1b26",
        "editor.foreground": "#a9b1d6",
        "editor.lineHighlightBackground": "#292e42",
        "editorCursor.foreground": "#c0caf5",
        "editorWhitespace.foreground": "#3b4261",
      },
    })

    // 应用自定义主题
    if (theme === "dark") {
      monaco.editor.setTheme("custom-dark")
      setEditorTheme("custom-dark")
    }
  }

  // 运行代码
  const runCode = () => {
    setIsRunning(true)
    setActiveTab("output")
    setOutput("Running code...\n")

    // 简单的JavaScript执行环境
    if (language === "javascript") {
      try {
        // 创建一个安全的控制台对象来捕获输出
        const capturedOutput: string[] = []
        const mockConsole = {
          log: (...args: any[]) => {
            capturedOutput.push(args.map((arg) => String(arg)).join(" "))
          },
          error: (...args: any[]) => {
            capturedOutput.push(`Error: ${args.map((arg) => String(arg)).join(" ")}`)
          },
          warn: (...args: any[]) => {
            capturedOutput.push(`Warning: ${args.map((arg) => String(arg)).join(" ")}`)
          },
        }

        // 使用Function构造函数创建一个新的作用域来执行代码
        const executeCode = new Function("console", code)
        executeCode(mockConsole)

        // 显示输出
        setOutput(capturedOutput.join("\n"))
      } catch (error: any) {
        setOutput(`Execution Error: ${error.message}`)
      }
    } else {
      // 对于其他语言，显示模拟输出
      setOutput(
        `[${language.toUpperCase()} Execution]\nCode execution for ${language} is simulated in this demo.\n\nTo run ${language} code, you would need a backend service or integration with a compiler/interpreter.`,
      )
    }

    setIsRunning(false)
  }

  // 复制代码到剪贴板
  const copyCode = () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue()
      navigator.clipboard.writeText(code)
      toast({
        title: "Copied to clipboard",
        description: "Code has been copied to your clipboard",
      })
    }
  }

  // 下载代码
  const downloadCode = () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue()
      const blob = new Blob([code], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `code.${language}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  // 格式化代码
  const formatCode = () => {
    if (editorRef.current && monacoRef.current) {
      editorRef.current.getAction("editor.action.formatDocument").run()
      toast({
        title: "Code formatted",
        description: "Your code has been formatted",
      })
    }
  }

  // 更新编辑器选项
  const updateEditorOption = (option: string, value: any) => {
    setEditorOptions((prev) => ({
      ...prev,
      [option]: value,
    }))
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[500px] w-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-xl border-2 border-gray-300 dark:border-gray-500">
      {/* 工具栏 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 bg-gray-100 dark:bg-gray-900 border-b-2 border-gray-300 dark:border-gray-500">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px] h-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-500">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-500">
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.id} value={lang.id} className="text-gray-900 dark:text-white">
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={editorTheme} onValueChange={setEditorTheme}>
            <SelectTrigger className="w-[150px] h-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-500">
              <SelectValue placeholder="Select Theme" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-500">
              {THEMES.map((theme) => (
                <SelectItem key={theme.id} value={theme.id} className="text-gray-900 dark:text-white">
                  {theme.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            className="h-8 bg-white dark:bg-gray-800 border-gray-400 dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
            onClick={() => setActiveTab(activeTab === "editor" ? "settings" : "editor")}
          >
            <Settings className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 bg-white dark:bg-gray-800 border-gray-400 dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
            onClick={formatCode}
          >
            <FileCode2 className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Format</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 bg-white dark:bg-gray-800 border-gray-400 dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
            onClick={copyCode}
          >
            <Copy className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Copy</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 bg-white dark:bg-gray-800 border-gray-400 dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
            onClick={downloadCode}
          >
            <Download className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Download</span>
          </Button>
          <Button
            variant="default"
            size="sm"
            className="h-8 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
            onClick={runCode}
            disabled={isRunning}
          >
            <Play className="h-4 w-4 mr-1" />
            <span>Run</span>
          </Button>
        </div>
      </div>

      {/* 主要内容区域 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mx-2 mt-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white border border-transparent dark:border-gray-600">
          <TabsTrigger value="editor" className="flex items-center">
            <FileCode2 className="h-4 w-4 mr-1" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="output" className="flex items-center">
            <Play className="h-4 w-4 mr-1" />
            Output
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="flex-1 p-0 m-0">
          <div className="h-full w-full">
            <Editor
              height="100%"
              language={language}
              value={code}
              theme={editorTheme}
              onChange={(value) => setCode(value || "")}
              onMount={handleEditorDidMount}
              options={editorOptions}
            />
          </div>
        </TabsContent>

        <TabsContent value="output" className="flex-1 p-0 m-0">
          <div className="h-full w-full bg-gray-900 text-gray-100 p-4 font-mono text-sm overflow-auto border-t border-gray-700">
            <pre>{output}</pre>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="flex-1 p-4 overflow-auto bg-white dark:bg-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Editor Settings</h3>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Font Size</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="10"
                    max="24"
                    value={editorOptions.fontSize}
                    onChange={(e) => updateEditorOption("fontSize", Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm">{editorOptions.fontSize}px</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="minimap"
                  checked={editorOptions.minimap.enabled}
                  onChange={(e) => updateEditorOption("minimap", { enabled: e.target.checked })}
                />
                <label htmlFor="minimap" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Show Minimap
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="wordWrap"
                  checked={editorOptions.wordWrap === "on"}
                  onChange={(e) => updateEditorOption("wordWrap", e.target.checked ? "on" : "off")}
                />
                <label htmlFor="wordWrap" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Word Wrap
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tab Size</label>
                <Select
                  value={String(editorOptions.tabSize)}
                  onValueChange={(value) => updateEditorOption("tabSize", Number(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tab Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 spaces</SelectItem>
                    <SelectItem value="4">4 spaces</SelectItem>
                    <SelectItem value="8">8 spaces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Keyboard Shortcuts</h3>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="font-medium text-gray-800 dark:text-gray-200">Format Document</div>
                  <div className="font-mono text-blue-600 dark:text-blue-400">Shift + Alt + F</div>

                  <div className="font-medium text-gray-800 dark:text-gray-200">Find</div>
                  <div className="font-mono text-blue-600 dark:text-blue-400">Ctrl + F</div>

                  <div className="font-medium text-gray-800 dark:text-gray-200">Replace</div>
                  <div className="font-mono text-blue-600 dark:text-blue-400">Ctrl + H</div>

                  <div className="font-medium text-gray-800 dark:text-gray-200">Save</div>
                  <div className="font-mono text-blue-600 dark:text-blue-400">Ctrl + S</div>

                  <div className="font-medium text-gray-800 dark:text-gray-200">Comment Line</div>
                  <div className="font-mono text-blue-600 dark:text-blue-400">Ctrl + /</div>

                  <div className="font-medium text-gray-800 dark:text-gray-200">Indent</div>
                  <div className="font-mono text-blue-600 dark:text-blue-400">Tab</div>

                  <div className="font-medium text-gray-800 dark:text-gray-200">Outdent</div>
                  <div className="font-mono text-blue-600 dark:text-blue-400">Shift + Tab</div>

                  <div className="font-medium text-gray-800 dark:text-gray-200">Go to Line</div>
                  <div className="font-mono text-blue-600 dark:text-blue-400">Ctrl + G</div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full bg-white dark:bg-gray-800 border-gray-400 dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
                onClick={() => {
                  setEditorOptions(DEFAULT_OPTIONS)
                  toast({
                    title: "Settings reset",
                    description: "Editor settings have been reset to defaults",
                  })
                }}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Reset to Defaults
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
