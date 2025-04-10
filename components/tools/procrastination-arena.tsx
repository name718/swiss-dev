"use client"

import { useState, useEffect, useRef } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Clock, Skull, Trash2, Plus, Play, Pause, SkipForward, Award, Calendar, AlertTriangle, X } from "lucide-react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { Howl } from "howler"

// 定义任务类型
type Task = {
  id: string
  title: string
  description: string
  deadline: Date
  complexity: "simple" | "complex" // 简单或复杂
  completed: boolean
  createdAt: Date
  pomodorosCompleted: number
  monsterSize: number // 怪物大小，随拖延时间增长
  weaponsUnlocked: string[] // 解锁的武器
}

// 武器类型
type Weapon = {
  id: string
  name: { en: string; zh: string }
  damage: number
  unlockPomodoros: number
  icon: string
  model: string // 3D模型路径
  effect: string // 特效类型
}

// 预定义武器列表
const WEAPONS: Weapon[] = [
  {
    id: "sword",
    name: { en: "Decapitation Sword", zh: "斩首大刀" },
    damage: 25,
    unlockPomodoros: 1,
    icon: "🗡️",
    model: "/models/sword.glb", // 这些路径是示例，实际应用需要提供真实模型
    effect: "slash",
  },
  {
    id: "flamethrower",
    name: { en: "Flamethrower", zh: "火焰喷射器" },
    damage: 15,
    unlockPomodoros: 2,
    icon: "🔥",
    model: "/models/flamethrower.glb",
    effect: "burn",
  },
  {
    id: "hammer",
    name: { en: "Crushing Hammer", zh: "粉碎之锤" },
    damage: 40,
    unlockPomodoros: 3,
    icon: "🔨",
    model: "/models/hammer.glb",
    effect: "crush",
  },
  {
    id: "chainsaw",
    name: { en: "Bloodthirsty Chainsaw", zh: "嗜血电锯" },
    damage: 35,
    unlockPomodoros: 4,
    icon: "⚙️",
    model: "/models/chainsaw.glb",
    effect: "tear",
  },
  {
    id: "laser",
    name: { en: "Disintegration Laser", zh: "分解激光" },
    damage: 50,
    unlockPomodoros: 5,
    icon: "⚡",
    model: "/models/laser.glb",
    effect: "disintegrate",
  },
]

// 音效路径
const SOUNDS = {
  taskAdded: "/sounds/task_added.mp3",
  taskCompleted: "/sounds/task_completed.mp3",
  monsterGrowth: "/sounds/monster_growth.mp3",
  weaponUnlocked: "/sounds/weapon_unlocked.mp3",
  pomodoroStart: "/sounds/pomodoro_start.mp3",
  pomodoroEnd: "/sounds/pomodoro_end.mp3",
  monsterAttack: "/sounds/monster_attack.mp3",
  monsterDeath: "/sounds/monster_death.mp3",
  backgroundAmbient: "/sounds/background_ambient.mp3",
  alarmSiren: "/sounds/alarm_siren.mp3",
}

export function ProcrastinationArena() {
  const { t, language } = useLanguage()
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: new Date(),
    complexity: "simple" as "simple" | "complex",
  })
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [pomodoroActive, setPomodoroActive] = useState(false)
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60) // 25分钟，以秒为单位
  const [breakTime, setBreakTime] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [showKillMode, setShowKillMode] = useState(false)
  const [currentWeapon, setCurrentWeapon] = useState<Weapon | null>(null)

  // Three.js 相关引用
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const monsterRef = useRef<THREE.Object3D | null>(null)
  const composerRef = useRef<EffectComposer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // 音效引用
  const soundsRef = useRef<Record<string, Howl>>({})

  // 初始化
  useEffect(() => {
    // 从localStorage加载任务
    const savedTasks = localStorage.getItem("procrastinationArenaTasks")
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks)
        // 转换日期字符串为Date对象
        const tasksWithDates = parsedTasks.map((task: any) => ({
          ...task,
          deadline: new Date(task.deadline),
          createdAt: new Date(task.createdAt),
        }))
        setTasks(tasksWithDates)
      } catch (e) {
        console.error("Error loading tasks:", e)
      }
    }

    // 初始化音效
    Object.entries(SOUNDS).forEach(([key, path]) => {
      soundsRef.current[key] = new Howl({
        src: [path],
        volume: 0.5,
        preload: true,
      })
    })

    // 背景音乐循环播放
    soundsRef.current.backgroundAmbient.loop(true)
    soundsRef.current.backgroundAmbient.volume(0.2)
    // soundsRef.current.backgroundAmbient.play() // 用户交互后再播放

    // 清理函数
    return () => {
      // 停止所有音效
      Object.values(soundsRef.current).forEach((sound) => {
        sound.stop()
      })

      // 清理Three.js资源
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
    }
  }, [])

  // 保存任务到localStorage
  useEffect(() => {
    localStorage.setItem("procrastinationArenaTasks", JSON.stringify(tasks))
  }, [tasks])

  // 初始化3D场景
  useEffect(() => {
    if (!canvasRef.current || showKillMode) return

    // 创建场景
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x111111)
    sceneRef.current = scene

    // 添加雾效，增加恐怖氛围
    scene.fog = new THREE.FogExp2(0x000000, 0.05)

    // 创建相机
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5
    cameraRef.current = camera

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true })
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    rendererRef.current = renderer

    // 添加轨道控制
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controlsRef.current = controls

    // 添加灯光
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xff0000, 1)
    directionalLight.position.set(5, 5, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // 添加后期处理
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
    composer.addPass(bloomPass)
    composerRef.current = composer

    // 添加地面
    const groundGeometry = new THREE.PlaneGeometry(20, 20)
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.8,
      metalness: 0.2,
    })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -2
    ground.receiveShadow = true
    scene.add(ground)

    // 如果有选中的任务，加载对应的怪物模型
    if (selectedTask) {
      loadMonsterModel(selectedTask)
    } else {
      // 默认加载一个占位模型
      const geometry = new THREE.SphereGeometry(1, 32, 32)
      const material = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        roughness: 0.5,
        metalness: 0.5,
        emissive: 0x330000,
      })
      const defaultMonster = new THREE.Mesh(geometry, material)
      defaultMonster.castShadow = true
      scene.add(defaultMonster)
      monsterRef.current = defaultMonster

      // 添加粒子效果
      addParticleEffect(scene)
    }

    // 动画循环
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate)

      if (monsterRef.current) {
        monsterRef.current.rotation.y += 0.01
        // 添加呼吸效果
        const scale = 1 + Math.sin(Date.now() * 0.001) * 0.05
        monsterRef.current.scale.set(scale, scale, scale)
      }

      controls.update()
      composer.render()
    }
    animate()

    // 窗口大小调整处理
    const handleResize = () => {
      if (!canvasRef.current) return
      const width = canvasRef.current.clientWidth
      const height = canvasRef.current.clientHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()

      renderer.setSize(width, height)
      composer.setSize(width, height)
    }

    window.addEventListener("resize", handleResize)

    // 清理函数
    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      scene.clear()
      renderer.dispose()
    }
  }, [selectedTask, showKillMode])

  // 加载怪物模型
  const loadMonsterModel = (task: Task) => {
    if (!sceneRef.current) return

    // 清除现有的怪物模型
    if (monsterRef.current) {
      sceneRef.current.remove(monsterRef.current)
      monsterRef.current = null
    }

    // 根据任务复杂度选择不同的怪物模型
    if (task.complexity === "simple") {
      // 简单任务 - 史莱姆
      const geometry = new THREE.SphereGeometry(1, 32, 32)
      const material = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        roughness: 0.3,
        metalness: 0.7,
        transparent: true,
        opacity: 0.8,
        emissive: 0x003300,
      })
      const slime = new THREE.Mesh(geometry, material)
      slime.castShadow = true
      slime.scale.set(task.monsterSize, task.monsterSize * 0.7, task.monsterSize)
      sceneRef.current.add(slime)
      monsterRef.current = slime

      // 添加眼睛
      const eyeGeometry = new THREE.SphereGeometry(0.2, 16, 16)
      const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
      const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
      leftEye.position.set(-0.3, 0.5, 0.7)
      slime.add(leftEye)

      const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
      rightEye.position.set(0.3, 0.5, 0.7)
      slime.add(rightEye)

      // 添加嘴巴
      const mouthGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.1)
      const mouthMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })
      const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial)
      mouth.position.set(0, 0.2, 0.7)
      slime.add(mouth)
    } else {
      // 复杂任务 - 机械巨龙
      // 这里使用几何体组合创建一个简单的机械龙
      const bodyGeometry = new THREE.BoxGeometry(2, 1, 3)
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        roughness: 0.2,
        metalness: 0.8,
        emissive: 0x222222,
      })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.castShadow = true

      // 头部
      const headGeometry = new THREE.ConeGeometry(0.7, 1.5, 4)
      const headMaterial = new THREE.MeshStandardMaterial({
        color: 0xaa0000,
        roughness: 0.3,
        metalness: 0.7,
        emissive: 0x330000,
      })
      const head = new THREE.Mesh(headGeometry, headMaterial)
      head.rotation.x = Math.PI / 2
      head.position.set(0, 0.5, 1.5)
      body.add(head)

      // 眼睛
      const eyeGeometry = new THREE.SphereGeometry(0.2, 16, 16)
      const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
      const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
      leftEye.position.set(-0.3, 0.3, 0.5)
      head.add(leftEye)

      const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
      rightEye.position.set(0.3, 0.3, 0.5)
      head.add(rightEye)

      // 翅膀
      const wingGeometry = new THREE.BoxGeometry(3, 0.1, 1)
      const wingMaterial = new THREE.MeshStandardMaterial({
        color: 0x444444,
        roughness: 0.5,
        metalness: 0.5,
      })
      const leftWing = new THREE.Mesh(wingGeometry, wingMaterial)
      leftWing.position.set(-1.5, 0.5, 0)
      leftWing.rotation.z = Math.PI / 6
      body.add(leftWing)

      const rightWing = new THREE.Mesh(wingGeometry, wingMaterial)
      rightWing.position.set(1.5, 0.5, 0)
      rightWing.rotation.z = -Math.PI / 6
      body.add(rightWing)

      // 尾巴
      const tailGeometry = new THREE.CylinderGeometry(0.2, 0.05, 2)
      const tailMaterial = new THREE.MeshStandardMaterial({
        color: 0x666666,
        roughness: 0.3,
        metalness: 0.7,
      })
      const tail = new THREE.Mesh(tailGeometry, tailMaterial)
      tail.position.set(0, 0, -2)
      tail.rotation.x = Math.PI / 2
      body.add(tail)

      // 根据拖延时间添加额外的攻击部件
      const hoursOverdue = Math.max(0, Math.floor((new Date().getTime() - task.deadline.getTime()) / (1000 * 60 * 60)))

      for (let i = 0; i < Math.min(hoursOverdue, 10); i++) {
        // 添加随机武器部件
        const weaponTypes = ["spike", "saw", "laser", "cannon"]
        const weaponType = weaponTypes[Math.floor(Math.random() * weaponTypes.length)]

        let weaponGeometry, weaponMaterial

        if (weaponType === "spike") {
          weaponGeometry = new THREE.ConeGeometry(0.2, 0.8, 8)
          weaponMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            roughness: 0.3,
            metalness: 0.7,
            emissive: 0x330000,
          })
        } else if (weaponType === "saw") {
          weaponGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16)
          weaponMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            roughness: 0.2,
            metalness: 0.9,
          })
        } else if (weaponType === "laser") {
          weaponGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.6)
          weaponMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            roughness: 0.1,
            metalness: 0.9,
            emissive: 0x003333,
          })
        } else {
          weaponGeometry = new THREE.SphereGeometry(0.25, 16, 16)
          weaponMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.3,
            metalness: 0.8,
          })
        }

        const weapon = new THREE.Mesh(weaponGeometry, weaponMaterial)

        // 随机位置
        const angle = (i / 10) * Math.PI * 2
        const radius = 1.2
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius * 0.5 + 0.5
        const z = (Math.random() - 0.5) * 3

        weapon.position.set(x, y, z)
        weapon.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)

        body.add(weapon)
      }

      // 设置整体大小
      const scale = 0.5 + task.monsterSize * 0.2
      body.scale.set(scale, scale, scale)

      sceneRef.current.add(body)
      monsterRef.current = body
    }

    // 添加粒子效果
    addParticleEffect(sceneRef.current)
  }

  // 添加粒子效果
  const addParticleEffect = (scene: THREE.Scene) => {
    const particleCount = 1000
    const particles = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20
      positions[i + 1] = (Math.random() - 0.5) * 20
      positions[i + 2] = (Math.random() - 0.5) * 20
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3))

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xff0000,
      size: 0.05,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    })

    const particleSystem = new THREE.Points(particles, particleMaterial)
    scene.add(particleSystem)
  }

  // 添加新任务
  const addTask = () => {
    if (!newTask.title) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      deadline: newTask.deadline,
      complexity: newTask.complexity,
      completed: false,
      createdAt: new Date(),
      pomodorosCompleted: 0,
      monsterSize: 1, // 初始大小
      weaponsUnlocked: [],
    }

    setTasks([...tasks, task])
    setNewTask({
      title: "",
      description: "",
      deadline: new Date(),
      complexity: "simple",
    })
    setShowAddTask(false)

    // 播放添加任务音效
    soundsRef.current.taskAdded?.play()
  }

  // 删除任务
  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
    if (selectedTask?.id === id) {
      setSelectedTask(null)
    }
  }

  // 完成任务
  const completeTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: true,
            }
          : task,
      ),
    )

    // 播放任务完成音效
    soundsRef.current.taskCompleted?.play()
    soundsRef.current.monsterDeath?.play()

    // 如果是当前选中的任务，触发击杀动画
    if (selectedTask?.id === id) {
      setShowKillMode(true)
      setTimeout(() => {
        setShowKillMode(false)
        setSelectedTask(null)
      }, 5000) // 5秒后返回
    }
  }

  // 选择任务
  const selectTask = (task: Task) => {
    setSelectedTask(task)
    // 播放怪物咆哮音效
    soundsRef.current.monsterAttack?.play()
  }

  // 开始番茄钟
  const startPomodoro = () => {
    if (!selectedTask) return
    setPomodoroActive(true)
    // 播放番茄钟开始音效
    soundsRef.current.pomodoroStart?.play()
  }

  // 暂停番茄钟
  const pausePomodoro = () => {
    setPomodoroActive(false)
  }

  // 跳过番茄钟
  const skipPomodoro = () => {
    if (!selectedTask) return

    // 完成一个番茄钟
    const updatedTasks = tasks.map((task) =>
      task.id === selectedTask.id
        ? {
            ...task,
            pomodorosCompleted: task.pomodorosCompleted + 1,
          }
        : task,
    )

    setTasks(updatedTasks)
    setSelectedTask({
      ...selectedTask,
      pomodorosCompleted: selectedTask.pomodorosCompleted + 1,
    })

    // 检查是否解锁新武器
    const unlockedWeapons = WEAPONS.filter((weapon) => weapon.unlockPomodoros <= selectedTask.pomodorosCompleted + 1)
    const newWeapons = unlockedWeapons.filter((weapon) => !selectedTask.weaponsUnlocked.includes(weapon.id))

    if (newWeapons.length > 0) {
      // 解锁新武器
      const updatedTasksWithWeapons = updatedTasks.map((task) =>
        task.id === selectedTask.id
          ? {
              ...task,
              weaponsUnlocked: [...task.weaponsUnlocked, ...newWeapons.map((w) => w.id)],
            }
          : task,
      )
      setTasks(updatedTasksWithWeapons)
      setSelectedTask({
        ...selectedTask,
        pomodorosCompleted: selectedTask.pomodorosCompleted + 1,
        weaponsUnlocked: [...selectedTask.weaponsUnlocked, ...newWeapons.map((w) => w.id)],
      })

      // 播放武器解锁音效
      soundsRef.current.weaponUnlocked?.play()

      // 设置当前武器为新解锁的武器中的第一个
      setCurrentWeapon(newWeapons[0])
    }

    // 重置番茄钟
    setPomodoroTime(25 * 60)
    setPomodoroActive(false)
    setBreakTime(true)

    // 播放番茄钟结束音效
    soundsRef.current.pomodoroEnd?.play()

    // 5分钟后自动结束休息
    setTimeout(
      () => {
        setBreakTime(false)
      },
      5 * 60 * 1000,
    )
  }

  // 番茄钟计时器
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (pomodoroActive && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (pomodoroTime === 0) {
      skipPomodoro()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [pomodoroActive, pomodoroTime])

  // 更新怪物大小（基于拖延时间）
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const updatedTasks = tasks.map((task) => {
        if (task.completed) return task

        // 计算拖延时间
        const deadlineTime = task.deadline.getTime()
        const currentTime = now.getTime()
        const isOverdue = currentTime > deadlineTime

        if (isOverdue) {
          // 每小时增加10%的大小
          const hoursOverdue = Math.floor((currentTime - deadlineTime) / (1000 * 60 * 60))
          const newSize = 1 + hoursOverdue * 0.1

          // 如果大小变化，播放怪物生长音效
          if (newSize > task.monsterSize) {
            soundsRef.current.monsterGrowth?.play()

            // 如果严重逾期，播放警报声
            if (hoursOverdue > 24) {
              soundsRef.current.alarmSiren?.play()
            }
          }

          return {
            ...task,
            monsterSize: newSize,
          }
        }
        return task
      })

      setTasks(updatedTasks)

      // 更新选中任务的状态
      if (selectedTask) {
        const updatedTask = updatedTasks.find((task) => task.id === selectedTask.id)
        if (updatedTask && updatedTask.monsterSize !== selectedTask.monsterSize) {
          setSelectedTask(updatedTask)
        }
      }
    }, 60 * 1000) // 每分钟检查一次

    return () => clearInterval(interval)
  }, [tasks, selectedTask])

  // 格式化时间
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // 计算任务状态
  const getTaskStatus = (task: Task): "upcoming" | "due-soon" | "overdue" | "completed" => {
    if (task.completed) return "completed"

    const now = new Date()
    const deadlineTime = task.deadline.getTime()
    const currentTime = now.getTime()
    const hoursDifference = (deadlineTime - currentTime) / (1000 * 60 * 60)

    if (hoursDifference < 0) return "overdue"
    if (hoursDifference < 24) return "due-soon"
    return "upcoming"
  }

  // 获取武器名称
  const getWeaponName = (weaponId: string): string => {
    const weapon = WEAPONS.find((w) => w.id === weaponId)
    return weapon ? (language === "zh" ? weapon.name.zh : weapon.name.en) : weaponId
  }

  // 渲染击杀模式
  const renderKillMode = () => {
    if (!selectedTask) return null

    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
        <div className="text-red-500 text-4xl font-bold mb-8 animate-pulse">
          {language === "zh" ? "处决时刻" : "EXECUTION TIME"}
        </div>

        <div className="relative w-full max-w-2xl h-96 mb-8">
          {/* 这里可以放置一个血腥的击杀动画或图像 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-8xl animate-bounce-soft">{selectedTask.complexity === "simple" ? "🟢" : "🐉"}</div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-8xl animate-spin-slow opacity-70">💥</div>
          </div>

          {currentWeapon && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-8xl animate-bounce">{currentWeapon.icon}</div>
            </div>
          )}

          {/* 血液效果 */}
          <div className="absolute inset-0 bg-red-900/20 animate-pulse"></div>

          {/* 粒子效果 */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-red-600 rounded-full"
                style={{
                  width: `${Math.random() * 20 + 5}px`,
                  height: `${Math.random() * 20 + 5}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.7 + 0.3,
                  transform: `scale(${Math.random() * 2 + 1})`,
                  animation: `fadeOut ${Math.random() * 2 + 1}s ease-out forwards`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="text-green-500 text-2xl font-bold mb-4">
          {language === "zh" ? "任务已完成！" : "TASK COMPLETED!"}
        </div>

        <div className="text-white text-xl mb-8">{selectedTask.title}</div>

        <button
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors"
          onClick={() => {
            setShowKillMode(false)
            setSelectedTask(null)
          }}
        >
          {language === "zh" ? "返回任务列表" : "RETURN TO TASKS"}
        </button>
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-[80vh] relative">
      {/* 血腥击杀模式 */}
      {showKillMode && renderKillMode()}

      <div className="neumorphic-card p-4 rounded-xl mb-6">
        <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
          {language === "zh" ? "拖延症斗兽场" : "Procrastination Arena"}
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          {language === "zh"
            ? "将你的任务转化为怪物，通过专注工作来获取武器并击败它们。拖延越久，怪物越强大！"
            : "Transform your tasks into monsters and defeat them by focusing on your work. The longer you procrastinate, the stronger they become!"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 任务列表 */}
        <div className="neumorphic-card p-4 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
              {language === "zh" ? "任务列表" : "Task List"}
            </h3>
            <button
              className="neumorphic-button p-2 rounded-lg"
              onClick={() => setShowAddTask(!showAddTask)}
              aria-label={showAddTask ? "Cancel" : "Add task"}
            >
              {showAddTask ? <X size={20} /> : <Plus size={20} />}
            </button>
          </div>

          {/* 添加任务表单 */}
          {showAddTask && (
            <div className="mb-4 p-4 neumorphic-inset rounded-lg">
              <div className="mb-3">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  {language === "zh" ? "任务名称" : "Task Title"}
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full p-2 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100"
                  placeholder={language === "zh" ? "输入任务名称..." : "Enter task title..."}
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  {language === "zh" ? "任务描述" : "Description"}
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full p-2 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100"
                  placeholder={language === "zh" ? "输入任务描述..." : "Enter description..."}
                  rows={2}
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  {language === "zh" ? "截止日期" : "Deadline"}
                </label>
                <input
                  type="datetime-local"
                  value={newTask.deadline.toISOString().slice(0, 16)}
                  onChange={(e) => setNewTask({ ...newTask, deadline: new Date(e.target.value) })}
                  className="w-full p-2 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  {language === "zh" ? "任务复杂度" : "Complexity"}
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="complexity"
                      checked={newTask.complexity === "simple"}
                      onChange={() => setNewTask({ ...newTask, complexity: "simple" })}
                      className="mr-2"
                    />
                    <span className="text-sm">{language === "zh" ? "简单 (史莱姆)" : "Simple (Slime)"}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="complexity"
                      checked={newTask.complexity === "complex"}
                      onChange={() => setNewTask({ ...newTask, complexity: "complex" })}
                      className="mr-2"
                    />
                    <span className="text-sm">{language === "zh" ? "复杂 (机械巨龙)" : "Complex (Mech Dragon)"}</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="neumorphic-button px-4 py-2 rounded-lg mr-2" onClick={() => setShowAddTask(false)}>
                  {language === "zh" ? "取消" : "Cancel"}
                </button>
                <button
                  className="neumorphic-button px-4 py-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400"
                  onClick={addTask}
                >
                  {language === "zh" ? "添加任务" : "Add Task"}
                </button>
              </div>
            </div>
          )}

          {/* 任务列表 */}
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                {language === "zh" ? "没有任务，添加一个吧！" : "No tasks yet. Add one!"}
              </div>
            ) : (
              tasks.map((task) => {
                const status = getTaskStatus(task)
                return (
                  <div
                    key={task.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedTask?.id === task.id ? "neumorphic-button-active" : "neumorphic-button"
                    } ${
                      status === "overdue"
                        ? "border-l-4 border-red-500"
                        : status === "due-soon"
                          ? "border-l-4 border-yellow-500"
                          : status === "completed"
                            ? "border-l-4 border-green-500 opacity-50"
                            : ""
                    }`}
                    onClick={() => !task.completed && selectTask(task)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4
                          className={`font-medium ${
                            task.completed
                              ? "line-through text-neutral-500 dark:text-neutral-500"
                              : "text-neutral-800 dark:text-neutral-100"
                          }`}
                        >
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{task.description}</p>
                        )}
                        <div className="flex items-center mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                          <Calendar size={14} className="mr-1" />
                          {task.deadline.toLocaleDateString()}{" "}
                          {task.deadline.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          {status === "overdue" && !task.completed && (
                            <span className="ml-2 text-red-500 flex items-center">
                              <AlertTriangle size={14} className="mr-1" />
                              {language === "zh" ? "已逾期" : "Overdue"}
                            </span>
                          )}
                        </div>

                        {/* 武器和番茄钟计数 */}
                        <div className="flex items-center mt-2 text-xs">
                          <div className="flex items-center mr-3 text-green-600 dark:text-green-400">
                            <Clock size={14} className="mr-1" />
                            {task.pomodorosCompleted}
                          </div>

                          {task.weaponsUnlocked.length > 0 && (
                            <div className="flex items-center text-red-600 dark:text-red-400">
                              <Skull size={14} className="mr-1" />
                              {task.weaponsUnlocked.length}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {!task.completed && (
                          <button
                            className="neumorphic-icon-button p-1 rounded-lg text-green-600 dark:text-green-400"
                            onClick={(e) => {
                              e.stopPropagation()
                              completeTask(task.id)
                            }}
                            aria-label="Complete task"
                          >
                            <Award size={16} />
                          </button>
                        )}
                        <button
                          className="neumorphic-icon-button p-1 rounded-lg text-red-600 dark:text-red-400"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteTask(task.id)
                          }}
                          aria-label="Delete task"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* 3D怪物展示 */}
        <div className="neumorphic-card p-4 rounded-xl lg:col-span-2">
          {selectedTask ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">{selectedTask.title}</h3>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  {selectedTask.complexity === "simple"
                    ? language === "zh"
                      ? "史莱姆"
                      : "Slime"
                    : language === "zh"
                      ? "机械巨龙"
                      : "Mech Dragon"}
                </div>
              </div>

              {/* 番茄钟控制 */}
              <div className="mb-4 p-4 neumorphic-inset rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-neutral-800 dark:text-neutral-100">
                    {language === "zh" ? "番茄钟处决模式" : "Pomodoro Execution Mode"}
                  </h4>
                  <div className="text-2xl font-mono font-bold text-red-600 dark:text-red-400">
                    {formatTime(pomodoroTime)}
                  </div>
                </div>

                <div className="flex justify-center gap-3 mt-3">
                  {!pomodoroActive ? (
                    <button
                      className="neumorphic-button px-4 py-2 rounded-lg flex items-center"
                      onClick={startPomodoro}
                      disabled={breakTime}
                    >
                      <Play size={18} className="mr-2" />
                      {language === "zh" ? "开始专注" : "Start Focus"}
                    </button>
                  ) : (
                    <button
                      className="neumorphic-button px-4 py-2 rounded-lg flex items-center"
                      onClick={pausePomodoro}
                    >
                      <Pause size={18} className="mr-2" />
                      {language === "zh" ? "暂停" : "Pause"}
                    </button>
                  )}
                  <button
                    className="neumorphic-button px-4 py-2 rounded-lg flex items-center"
                    onClick={skipPomodoro}
                    disabled={breakTime}
                  >
                    <SkipForward size={18} className="mr-2" />
                    {language === "zh" ? "跳过" : "Skip"}
                  </button>
                </div>

                {breakTime && (
                  <div className="mt-3 text-center text-green-600 dark:text-green-400">
                    {language === "zh" ? "休息时间！" : "Break time!"}
                  </div>
                )}
              </div>

              {/* 武器库 */}
              <div className="mb-4">
                <h4 className="font-medium text-neutral-800 dark:text-neutral-100 mb-2">
                  {language === "zh" ? "解锁的武器" : "Unlocked Weapons"}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTask.weaponsUnlocked.length === 0 ? (
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      {language === "zh" ? "完成番茄钟来解锁武器" : "Complete pomodoros to unlock weapons"}
                    </div>
                  ) : (
                    selectedTask.weaponsUnlocked.map((weaponId) => {
                      const weapon = WEAPONS.find((w) => w.id === weaponId)
                      return (
                        <button
                          key={weaponId}
                          className={`neumorphic-button px-3 py-2 rounded-lg text-sm flex items-center ${
                            currentWeapon?.id === weaponId ? "neumorphic-button-active" : ""
                          }`}
                          onClick={() => setCurrentWeapon(weapon || null)}
                        >
                          <span className="mr-2">{weapon?.icon}</span>
                          {getWeaponName(weaponId)}
                        </button>
                      )
                    })
                  )}
                </div>
              </div>

              {/* 3D画布 */}
              <div className="relative w-full h-[300px] rounded-lg overflow-hidden neumorphic-inset">
                <canvas ref={canvasRef} className="w-full h-full" />

                {/* 怪物信息覆盖层 */}
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs p-2 rounded">
                  <div>
                    {language === "zh" ? "怪物大小" : "Monster Size"}: {selectedTask.monsterSize.toFixed(1)}x
                  </div>
                  {selectedTask.complexity === "complex" && (
                    <div>
                      {language === "zh" ? "攻击部件" : "Attack Parts"}:{" "}
                      {Math.max(
                        0,
                        Math.floor((new Date().getTime() - selectedTask.deadline.getTime()) / (1000 * 60 * 60)),
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <div className="text-6xl mb-4">👹</div>
              <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-2">
                {language === "zh" ? "选择一个任务" : "Select a Task"}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-center max-w-md">
                {language === "zh"
                  ? "从左侧选择一个任务来查看其怪物形态。完成番茄钟来解锁武器，然后击败它们！"
                  : "Select a task from the left to view its monster form. Complete pomodoros to unlock weapons, then defeat them!"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 自定义样式 */}
      <style jsx>{`
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-20px); }
        }
      `}</style>
    </div>
  )
}
