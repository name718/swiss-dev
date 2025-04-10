"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

// Define tetromino shapes
const TETROMINOES = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: "bg-cyan-500 dark:bg-cyan-400",
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "bg-blue-500 dark:bg-blue-400",
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "bg-orange-500 dark:bg-orange-400",
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "bg-yellow-500 dark:bg-yellow-400",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: "bg-green-500 dark:bg-green-400",
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "bg-purple-500 dark:bg-purple-400",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: "bg-red-500 dark:bg-red-400",
  },
}

// Game constants
const ROWS = 20
const COLS = 10
const POINTS = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,
  SOFT_DROP: 1,
  HARD_DROP: 2,
}
const LEVEL_SPEED = {
  1: 800,
  2: 720,
  3: 630,
  4: 550,
  5: 470,
  6: 380,
  7: 300,
  8: 220,
  9: 130,
  10: 100,
  11: 80,
  12: 80,
  13: 70,
  14: 70,
  15: 60,
}

// Create empty board
const createEmptyBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill(0))

// Create empty cell colors
const createEmptyCellColors = () => Array.from({ length: ROWS }, () => Array(COLS).fill(""))

// Tetris component
export function Tetris() {
  const { language } = useLanguage()
  const [board, setBoard] = useState(createEmptyBoard())
  const [cellColors, setCellColors] = useState(createEmptyCellColors())
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lines, setLines] = useState(0)
  const [nextPiece, setNextPiece] = useState<keyof typeof TETROMINOES>("T")
  const [currentPiece, setCurrentPiece] = useState<keyof typeof TETROMINOES>("T")
  const [position, setPosition] = useState({ x: 3, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [dropTime, setDropTime] = useState<number | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [highScore, setHighScore] = useState(0)
  const [showControls, setShowControls] = useState(false)

  // Audio references
  const moveAudioRef = useRef<HTMLAudioElement | null>(null)
  const rotateAudioRef = useRef<HTMLAudioElement | null>(null)
  const dropAudioRef = useRef<HTMLAudioElement | null>(null)
  const clearAudioRef = useRef<HTMLAudioElement | null>(null)
  const gameOverAudioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio elements
  useEffect(() => {
    // Create audio elements but don't set sources since they might not exist
    moveAudioRef.current = new Audio()
    rotateAudioRef.current = new Audio()
    dropAudioRef.current = new Audio()
    clearAudioRef.current = new Audio()
    gameOverAudioRef.current = new Audio()

    // Try to set sources, but this might fail if files don't exist
    try {
      // In a real implementation, these files would need to exist
      // For now, we'll just create the Audio objects without sources
      // This prevents errors when trying to play sounds

      // Load high score from localStorage
      const savedHighScore = localStorage.getItem("tetrisHighScore")
      if (savedHighScore) {
        setHighScore(Number.parseInt(savedHighScore, 10))
      }
    } catch (e) {
      console.log("Could not initialize sound files")
    }

    return () => {
      // Cleanup audio elements
      moveAudioRef.current = null
      rotateAudioRef.current = null
      dropAudioRef.current = null
      clearAudioRef.current = null
      gameOverAudioRef.current = null
    }
  }, [])

  // Play sound effect
  const playSound = (sound: HTMLAudioElement | null) => {
    if (soundEnabled && sound) {
      // Check if the sound has a valid source before playing
      if (sound.src && sound.src !== window.location.href) {
        sound.currentTime = 0
        sound.play().catch((e) => {
          // Silently handle the error - sound will just not play
          console.log("Sound not available")
        })
      }
    }
  }

  // Generate random tetromino
  const randomTetromino = (): keyof typeof TETROMINOES => {
    const shapes = Object.keys(TETROMINOES) as Array<keyof typeof TETROMINOES>
    return shapes[Math.floor(Math.random() * shapes.length)]
  }

  // Reset game - define this function first
  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard())
    setCellColors(createEmptyCellColors())
    setGameOver(false)
    setIsPaused(false)
    setScore(0)
    setLevel(1)
    setLines(0)
    const newNextPiece = randomTetromino()
    setNextPiece(newNextPiece)
    setCurrentPiece(randomTetromino())
    setPosition({ x: 3, y: 0 })
    setRotation(0)
    setDropTime(LEVEL_SPEED[1 as keyof typeof LEVEL_SPEED])
    setGameStarted(true)
  }, [])

  // Now we can safely reference resetGame
  const resetGameCallback = useCallback(() => resetGame(), [resetGame])

  // Start game
  const startGame = () => {
    if (!gameStarted) {
      resetGame()
    } else if (isPaused) {
      setIsPaused(false)
      setDropTime(LEVEL_SPEED[level as keyof typeof LEVEL_SPEED])
    }
  }

  // Pause game
  const pauseGame = () => {
    if (!gameOver && gameStarted) {
      setIsPaused(!isPaused)
      setDropTime(isPaused ? LEVEL_SPEED[level as keyof typeof LEVEL_SPEED] : null)
    }
  }

  // Get current tetromino
  const getCurrentTetromino = () => {
    return TETROMINOES[currentPiece].shape
  }

  // Get current tetromino color
  const getCurrentTetrominoColor = () => {
    return TETROMINOES[currentPiece].color
  }

  // Rotate tetromino
  const rotate = (matrix: number[][]) => {
    // Transpose matrix
    const rotated = matrix.map((_, i) => matrix.map((row) => row[i]))
    // Reverse each row to get a rotated matrix
    return rotated.map((row) => row.reverse())
  }

  // Check if position is valid
  const isValidPosition = (tetromino: number[][], pos: { x: number; y: number } = position, rot: number = rotation) => {
    // Get the rotated tetromino
    let rotatedTetromino = tetromino
    for (let i = 0; i < rot; i++) {
      rotatedTetromino = rotate(rotatedTetromino)
    }

    // Check if the tetromino is within bounds and not colliding with other pieces
    for (let y = 0; y < rotatedTetromino.length; y++) {
      for (let x = 0; x < rotatedTetromino[y].length; x++) {
        if (rotatedTetromino[y][x] !== 0) {
          const boardX = pos.x + x
          const boardY = pos.y + y

          // Check if out of bounds
          if (boardX < 0 || boardX >= COLS || boardY >= ROWS) {
            return false
          }

          // Check if colliding with another piece on the board
          if (boardY >= 0 && board[boardY][boardX] !== 0) {
            return false
          }
        }
      }
    }

    return true
  }

  // Move tetromino left
  const moveLeft = () => {
    if (!isPaused && !gameOver && gameStarted) {
      const newPos = { ...position, x: position.x - 1 }
      if (isValidPosition(getCurrentTetromino(), newPos)) {
        setPosition(newPos)
        playSound(moveAudioRef.current)
      }
    }
  }

  // Move tetromino right
  const moveRight = () => {
    if (!isPaused && !gameOver && gameStarted) {
      const newPos = { ...position, x: position.x + 1 }
      if (isValidPosition(getCurrentTetromino(), newPos)) {
        setPosition(newPos)
        playSound(moveAudioRef.current)
      }
    }
  }

  // Check for completed lines
  const checkForCompletedLines = (board: number[][]) => {
    let completedLines = 0
    for (let y = 0; y < ROWS; y++) {
      if (board[y].every((cell) => cell !== 0)) {
        completedLines++
      }
    }
    return completedLines
  }

  // Clear completed lines
  const clearLines = (numLines: number) => {
    // Update score based on number of lines cleared
    let pointsEarned = 0
    switch (numLines) {
      case 1:
        pointsEarned = POINTS.SINGLE * level
        break
      case 2:
        pointsEarned = POINTS.DOUBLE * level
        break
      case 3:
        pointsEarned = POINTS.TRIPLE * level
        break
      case 4:
        pointsEarned = POINTS.TETRIS * level
        break
    }

    setScore((prev) => prev + pointsEarned)
    setLines((prev) => {
      const newLines = prev + numLines
      // Level up every 10 lines
      if (Math.floor(newLines / 10) > Math.floor(prev / 10)) {
        const newLevel = Math.min(Math.floor(newLines / 10) + 1, 15)
        setLevel(newLevel)
        setDropTime(LEVEL_SPEED[newLevel as keyof typeof LEVEL_SPEED])
      }
      return newLines
    })

    // Create a new board with cleared lines
    const newBoard = [...board]
    const newCellColors = [...cellColors]

    // Remove completed lines
    for (let y = ROWS - 1; y >= 0; y--) {
      if (newBoard[y].every((cell) => cell !== 0)) {
        // Remove the line
        newBoard.splice(y, 1)
        newCellColors.splice(y, 1)
        // Add a new empty line at the top
        newBoard.unshift(Array(COLS).fill(0))
        newCellColors.unshift(Array(COLS).fill(""))
        // Since we removed a line, we need to check the same y index again
        y++
      }
    }

    setBoard(newBoard)
    setCellColors(newCellColors)
    playSound(clearAudioRef.current)
  }

  // Forward declaration of placeTetromino
  const placeTetromino = useCallback(() => {
    // Get the current tetromino and its rotation
    let rotatedTetromino = getCurrentTetromino()
    for (let i = 0; i < rotation; i++) {
      rotatedTetromino = rotate(rotatedTetromino)
    }

    // Create a new board with the tetromino placed
    const newBoard = [...board]
    const newCellColors = [...cellColors]
    const color = getCurrentTetrominoColor()

    for (let y = 0; y < rotatedTetromino.length; y++) {
      for (let x = 0; x < rotatedTetromino[y].length; x++) {
        if (rotatedTetromino[y][x] !== 0) {
          const boardY = position.y + y
          const boardX = position.x + x

          // If placing a piece above the board, game over
          if (boardY < 0) {
            setGameOver(true)
            setDropTime(null)
            playSound(gameOverAudioRef.current)

            // Update high score if needed
            if (score > highScore) {
              setHighScore(score)
              localStorage.setItem("tetrisHighScore", score.toString())
            }
            return
          }

          newBoard[boardY][boardX] = 1
          newCellColors[boardY][boardX] = color
        }
      }
    }

    setBoard(newBoard)
    setCellColors(newCellColors)

    // Check for completed lines
    const completedLines = checkForCompletedLines(newBoard)
    if (completedLines > 0) {
      clearLines(completedLines)
    }

    // Set next piece
    setCurrentPiece(nextPiece)
    setNextPiece(randomTetromino())
    setPosition({ x: 3, y: 0 })
    setRotation(0)
  }, [
    board,
    cellColors,
    position,
    rotation,
    score,
    highScore,
    nextPiece,
    getCurrentTetromino,
    setGameOver,
    setDropTime,
    gameOverAudioRef,
    setHighScore,
    clearLines,
    checkForCompletedLines,
    randomTetromino,
  ])
  const moveDownFn = useCallback(() => {
    if (!isPaused && !gameOver && gameStarted) {
      const newPos = { ...position, y: position.y + 1 }
      if (isValidPosition(getCurrentTetromino(), newPos)) {
        setPosition(newPos)
        setScore((prev) => prev + POINTS.SOFT_DROP)
        return true
      } else {
        // If can't move down, place the tetromino
        placeTetromino()
        return false
      }
    }
    return false
  }, [isPaused, gameOver, gameStarted, position, setScore, placeTetromino, getCurrentTetromino, setPosition])

  // Hard drop tetromino
  const hardDrop = () => {
    if (!isPaused && !gameOver && gameStarted) {
      let newY = position.y
      let dropDistance = 0
      while (isValidPosition(getCurrentTetromino(), { ...position, y: newY + 1 })) {
        newY++
        dropDistance++
      }
      setPosition({ ...position, y: newY })
      setScore((prev) => prev + POINTS.HARD_DROP * dropDistance)
      placeTetromino()
      playSound(dropAudioRef.current)
    }
  }

  // Rotate tetromino
  const rotateTetromino = () => {
    if (!isPaused && !gameOver && gameStarted) {
      const newRotation = (rotation + 1) % 4
      if (isValidPosition(getCurrentTetromino(), position, newRotation)) {
        setRotation(newRotation)
        playSound(rotateAudioRef.current)
      } else {
        // Wall kick - try to move the piece left or right if rotation against wall
        const kicks = [1, -1, 2, -2]
        for (const kick of kicks) {
          if (isValidPosition(getCurrentTetromino(), { ...position, x: position.x + kick }, newRotation)) {
            setPosition({ ...position, x: position.x + kick })
            setRotation(newRotation)
            playSound(rotateAudioRef.current)
            break
          }
        }
      }
    }
  }

  // Handle key presses
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver) return

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault()
          moveLeft()
          break
        case "ArrowRight":
          e.preventDefault()
          moveRight()
          break
        case "ArrowDown":
          e.preventDefault()
          moveDownFn()
          break
        case "ArrowUp":
          e.preventDefault()
          rotateTetromino()
          break
        case " ":
          e.preventDefault()
          hardDrop()
          break
        case "p":
        case "P":
          e.preventDefault()
          pauseGame()
          break
        case "r":
        case "R":
          e.preventDefault()
          resetGameCallback()
          break
      }
    },
    [gameOver, moveRight, moveDownFn, rotateTetromino, hardDrop, pauseGame, resetGameCallback, moveLeft],
  )

  // Set up keyboard event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  // Drop tetromino automatically
  useEffect(() => {
    if (!dropTime) return

    const dropTetromino = () => {
      if (!isPaused && !gameOver) {
        moveDownFn()
      }
    }

    const timerId = setInterval(dropTetromino, dropTime)
    return () => {
      clearInterval(timerId)
    }
  }, [dropTime, isPaused, gameOver, moveDownFn])

  // Render the game board with the current tetromino
  const renderBoard = () => {
    // Create a copy of the board to render
    const displayBoard = board.map((row) => [...row])
    const displayColors = cellColors.map((row) => [...row])

    // Add the current tetromino to the display board
    if (gameStarted && !gameOver) {
      let rotatedTetromino = getCurrentTetromino()
      for (let i = 0; i < rotation; i++) {
        rotatedTetromino = rotate(rotatedTetromino)
      }

      const color = getCurrentTetrominoColor()

      // Calculate shadow position (ghost piece)
      let shadowY = position.y
      while (isValidPosition(rotatedTetromino, { ...position, y: shadowY + 1 })) {
        shadowY++
      }

      // Add shadow (ghost piece)
      for (let y = 0; y < rotatedTetromino.length; y++) {
        for (let x = 0; x < rotatedTetromino[y].length; x++) {
          if (rotatedTetromino[y][x] !== 0) {
            const boardY = shadowY + y
            const boardX = position.x + x
            if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
              if (displayBoard[boardY][boardX] === 0) {
                displayBoard[boardY][boardX] = 2 // 2 represents shadow
                displayColors[boardY][boardX] = color.replace("bg-", "bg-opacity-30 bg-")
              }
            }
          }
        }
      }

      // Add current tetromino
      for (let y = 0; y < rotatedTetromino.length; y++) {
        for (let x = 0; x < rotatedTetromino[y].length; x++) {
          if (rotatedTetromino[y][x] !== 0) {
            const boardY = position.y + y
            const boardX = position.x + x
            if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
              displayBoard[boardY][boardX] = 1
              displayColors[boardY][boardX] = color
            }
          }
        }
      }
    }

    return (
      <div className="grid grid-cols-10 gap-px bg-neutral-300 dark:bg-neutral-700 p-px rounded-lg">
        {displayBoard.flat().map((cell, index) => (
          <div
            key={index}
            className={`aspect-square ${
              cell === 0
                ? "bg-neutral-100 dark:bg-neutral-800"
                : cell === 2
                  ? displayColors[Math.floor(index / COLS)][index % COLS]
                  : displayColors[Math.floor(index / COLS)][index % COLS]
            }`}
          ></div>
        ))}
      </div>
    )
  }

  // Render the next piece preview
  const renderNextPiece = () => {
    const tetromino = TETROMINOES[nextPiece].shape
    const color = TETROMINOES[nextPiece].color
    const size = tetromino.length

    return (
      <div
        className={`grid gap-px bg-neutral-300 dark:bg-neutral-700 p-px rounded-lg mx-auto`}
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          width: `${size * 20}px`,
          height: `${size * 20}px`,
        }}
      >
        {tetromino.flat().map((cell, index) => (
          <div key={index} className={`${cell ? color : "bg-neutral-100 dark:bg-neutral-800"}`}></div>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
            {language === "zh" ? "俄罗斯方块" : "Tetris"}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {language === "zh" ? "经典俄罗斯方块游戏" : "The classic Tetris game"}
          </p>
        </div>
        <div className="flex space-x-2">
          <div className="neumorphic-display px-3 py-2 rounded-lg">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">{language === "zh" ? "分数" : "SCORE"}</div>
            <div className="text-lg font-mono font-bold text-neutral-800 dark:text-neutral-100">{score}</div>
          </div>
          <div className="neumorphic-display px-3 py-2 rounded-lg">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">{language === "zh" ? "等级" : "LEVEL"}</div>
            <div className="text-lg font-mono font-bold text-neutral-800 dark:text-neutral-100">{level}</div>
          </div>
          <div className="neumorphic-display px-3 py-2 rounded-lg">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">{language === "zh" ? "行数" : "LINES"}</div>
            <div className="text-lg font-mono font-bold text-neutral-800 dark:text-neutral-100">{lines}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="neumorphic-card p-4 rounded-xl">{renderBoard()}</div>
        </div>

        <div className="md:w-48">
          <div className="neumorphic-card p-4 rounded-xl mb-4">
            <h4 className="text-center text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
              {language === "zh" ? "下一个" : "NEXT"}
            </h4>
            {renderNextPiece()}
          </div>

          <div className="neumorphic-card p-4 rounded-xl mb-4">
            <h4 className="text-center text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
              {language === "zh" ? "最高分" : "HIGH SCORE"}
            </h4>
            <div className="text-center font-mono text-lg font-bold text-neutral-800 dark:text-neutral-100">
              {highScore}
            </div>
          </div>

          <div className="space-y-2">
            {!gameStarted ? (
              <button
                onClick={startGame}
                className="neumorphic-button w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
              >
                <Play size={18} />
                <span>{language === "zh" ? "开始游戏" : "Start Game"}</span>
              </button>
            ) : (
              <button
                onClick={pauseGame}
                className="neumorphic-button w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2"
              >
                {isPaused ? <Play size={18} /> : <Pause size={18} />}
                <span>{isPaused ? (language === "zh" ? "继续" : "Resume") : language === "zh" ? "暂停" : "Pause"}</span>
              </button>
            )}

            <button
              onClick={resetGame}
              className="neumorphic-button w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              <span>{language === "zh" ? "重新开始" : "Restart"}</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="neumorphic-button w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              <span>
                {soundEnabled
                  ? language === "zh"
                    ? "关闭声音"
                    : "Mute Sound"
                  : language === "zh"
                    ? "开启声音"
                    : "Enable Sound"}
              </span>
            </button>

            <button
              onClick={() => setShowControls(!showControls)}
              className="neumorphic-button w-full py-2 px-4 rounded-lg"
            >
              {language === "zh" ? "显示控制" : "Show Controls"}
            </button>
          </div>
        </div>
      </div>

      {/* Game status message */}
      {gameOver && (
        <div className="mt-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-center">
          {language === "zh" ? "游戏结束！" : "Game Over!"}
        </div>
      )}

      {isPaused && !gameOver && (
        <div className="mt-4 p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-center">
          {language === "zh" ? "游戏已暂停" : "Game Paused"}
        </div>
      )}

      {/* Controls */}
      {showControls && (
        <div className="mt-4 neumorphic-card p-4 rounded-xl">
          <h4 className="font-medium mb-2 text-neutral-700 dark:text-neutral-300">
            {language === "zh" ? "游戏控制" : "Game Controls"}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center mb-2">
                <div className="neumorphic-button w-10 h-10 flex items-center justify-center mr-2">
                  <ChevronLeft size={20} />
                </div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {language === "zh" ? "向左移动" : "Move Left"}
                </span>
              </div>
              <div className="flex items-center mb-2">
                <div className="neumorphic-button w-10 h-10 flex items-center justify-center mr-2">
                  <ChevronRight size={20} />
                </div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {language === "zh" ? "向右移动" : "Move Right"}
                </span>
              </div>
              <div className="flex items-center mb-2">
                <div className="neumorphic-button w-10 h-10 flex items-center justify-center mr-2">
                  <ChevronDown size={20} />
                </div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {language === "zh" ? "向下移动" : "Move Down"}
                </span>
              </div>
              <div className="flex items-center mb-2">
                <div className="neumorphic-button w-10 h-10 flex items-center justify-center mr-2">
                  <ChevronUp size={20} />
                </div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {language === "zh" ? "旋转方块" : "Rotate"}
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center mb-2">
                <div className="neumorphic-button px-3 py-2 flex items-center justify-center mr-2">
                  <span className="text-sm">Space</span>
                </div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {language === "zh" ? "快速下落" : "Hard Drop"}
                </span>
              </div>
              <div className="flex items-center mb-2">
                <div className="neumorphic-button w-10 h-10 flex items-center justify-center mr-2">
                  <span className="text-sm">P</span>
                </div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {language === "zh" ? "暂停游戏" : "Pause Game"}
                </span>
              </div>
              <div className="flex items-center mb-2">
                <div className="neumorphic-button w-10 h-10 flex items-center justify-center mr-2">
                  <span className="text-sm">R</span>
                </div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {language === "zh" ? "重新开始" : "Restart Game"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
        <h4 className="font-medium mb-1 text-neutral-700 dark:text-neutral-300">
          {language === "zh" ? "如何玩" : "How to play"}:
        </h4>
        <ul className="list-disc list-inside space-y-1">
          <li>{language === "zh" ? "使用方向键移动和旋转方块" : "Use arrow keys to move and rotate pieces"}</li>
          <li>{language === "zh" ? "完成一行或多行以获得分数" : "Complete rows to score points"}</li>
          <li>{language === "zh" ? "游戏会随着等级提高而加快" : "Game speeds up as you level up"}</li>
          <li>{language === "zh" ? "当方块堆到顶部时游戏结束" : "Game ends when pieces stack to the top"}</li>
        </ul>
      </div>
    </div>
  )
}
