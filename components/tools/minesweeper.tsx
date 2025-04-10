"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { RefreshCw, Flag, Clock, Smile, Frown, Meh } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

// Define cell type
type Cell = {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborMines: number
}

// Define difficulty levels
type Difficulty = "beginner" | "intermediate" | "expert" | "custom"

// Define difficulty settings
type DifficultySettings = {
  rows: number
  cols: number
  mines: number
}

// Define game state
type GameState = "playing" | "won" | "lost"

export function Minesweeper() {
  const { language } = useLanguage()

  // Difficulty settings
  const difficultySettings: Record<Difficulty, DifficultySettings> = {
    beginner: { rows: 9, cols: 9, mines: 10 },
    intermediate: { rows: 16, cols: 16, mines: 40 },
    expert: { rows: 16, cols: 30, mines: 99 },
    custom: { rows: 12, cols: 12, mines: 20 }, // Default custom settings
  }

  // State
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner")
  const [settings, setSettings] = useState<DifficultySettings>(difficultySettings.beginner)
  const [grid, setGrid] = useState<Cell[][]>([])
  const [gameState, setGameState] = useState<GameState>("playing")
  const [firstClick, setFirstClick] = useState(true)
  const [flagCount, setFlagCount] = useState(0)
  const [timer, setTimer] = useState(0)
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)
  const [customSettings, setCustomSettings] = useState<DifficultySettings>(difficultySettings.custom)
  const [showCustomSettings, setShowCustomSettings] = useState(false)
  const [faceExpression, setFaceExpression] = useState<"smile" | "meh" | "frown">("smile")

  // Initialize the game
  const initializeGame = useCallback(() => {
    const { rows, cols, mines } = settings

    // Create empty grid
    const newGrid: Cell[][] = Array(rows)
      .fill(null)
      .map(() =>
        Array(cols)
          .fill(null)
          .map(() => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            neighborMines: 0,
          })),
      )

    setGrid(newGrid)
    setGameState("playing")
    setFirstClick(true)
    setFlagCount(0)
    setTimer(0)
    setFaceExpression("smile")

    // Clear any existing timer
    if (timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    }
  }, [settings, timerInterval])

  // Place mines after first click
  const placeMines = (grid: Cell[][], firstRow: number, firstCol: number) => {
    const { rows, cols, mines } = settings
    const newGrid = JSON.parse(JSON.stringify(grid)) as Cell[][]

    // Create a list of all possible mine positions (excluding the first click and its neighbors)
    const possiblePositions: [number, number][] = []

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Skip the first click position and its neighbors
        if (Math.abs(r - firstRow) <= 1 && Math.abs(c - firstCol) <= 1) {
          continue
        }
        possiblePositions.push([r, c])
      }
    }

    // Shuffle the positions
    for (let i = possiblePositions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[possiblePositions[i], possiblePositions[j]] = [possiblePositions[j], possiblePositions[i]]
    }

    // Place mines
    const mineCount = Math.min(mines, possiblePositions.length)
    for (let i = 0; i < mineCount; i++) {
      const [r, c] = possiblePositions[i]
      newGrid[r][c].isMine = true
    }

    // Calculate neighbor mines
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (newGrid[r][c].isMine) continue

        let count = 0
        // Check all 8 neighbors
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue

            const nr = r + dr
            const nc = c + dc

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newGrid[nr][nc].isMine) {
              count++
            }
          }
        }

        newGrid[r][c].neighborMines = count
      }
    }

    return newGrid
  }

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    if (gameState !== "playing" || grid[row][col].isFlagged || grid[row][col].isRevealed) {
      return
    }

    // Start timer on first click
    if (firstClick) {
      setFirstClick(false)

      // Place mines (avoiding the first click)
      const newGrid = placeMines(grid, row, col)
      setGrid(newGrid)

      // Start timer
      const interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
      setTimerInterval(interval)

      // Reveal the clicked cell and its neighbors
      revealCell(newGrid, row, col)
      return
    }

    // If clicked on a mine, game over
    if (grid[row][col].isMine) {
      const newGrid = [...grid]

      // Reveal all mines
      for (let r = 0; r < settings.rows; r++) {
        for (let c = 0; c < settings.cols; c++) {
          if (newGrid[r][c].isMine) {
            newGrid[r][c].isRevealed = true
          }
        }
      }

      // Mark the clicked mine as red
      newGrid[row][col].isRevealed = true

      setGrid(newGrid)
      setGameState("lost")
      setFaceExpression("frown")

      // Stop timer
      if (timerInterval) {
        clearInterval(timerInterval)
        setTimerInterval(null)
      }

      return
    }

    // Otherwise, reveal the cell
    revealCell([...grid], row, col)
  }

  // Reveal a cell and its neighbors if it has no adjacent mines
  const revealCell = (grid: Cell[][], row: number, col: number) => {
    const { rows, cols } = settings

    // If out of bounds, already revealed, or flagged, return
    if (row < 0 || row >= rows || col < 0 || col >= cols || grid[row][col].isRevealed || grid[row][col].isFlagged) {
      return
    }

    // Reveal the cell
    grid[row][col].isRevealed = true

    // If it has no adjacent mines, reveal its neighbors
    if (grid[row][col].neighborMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          revealCell(grid, row + dr, col + dc)
        }
      }
    }

    setGrid([...grid])

    // Check if the game is won
    checkWinCondition(grid)
  }

  // Handle right-click (flag)
  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault()

    if (gameState !== "playing" || grid[row][col].isRevealed) {
      return
    }

    const newGrid = [...grid]

    // Toggle flag
    newGrid[row][col].isFlagged = !newGrid[row][col].isFlagged

    // Update flag count
    setFlagCount((prevCount) => (newGrid[row][col].isFlagged ? prevCount + 1 : prevCount - 1))

    setGrid(newGrid)
  }

  // Handle chord (middle-click or both left+right click)
  const handleChord = (row: number, col: number) => {
    if (gameState !== "playing" || !grid[row][col].isRevealed || grid[row][col].neighborMines === 0) {
      return
    }

    const { rows, cols } = settings
    const newGrid = JSON.parse(JSON.stringify(grid)) as Cell[][]

    // Count flags around the cell
    let flagCount = 0
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue

        const nr = row + dr
        const nc = col + dc

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newGrid[nr][nc].isFlagged) {
          flagCount++
        }
      }
    }

    // If the number of flags matches the number of mines, reveal all non-flagged neighbors
    if (flagCount === grid[row][col].neighborMines) {
      let hitMine = false

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue

          const nr = row + dr
          const nc = col + dc

          if (
            nr >= 0 &&
            nr < rows &&
            nc >= 0 &&
            nc < cols &&
            !newGrid[nr][nc].isFlagged &&
            !newGrid[nr][nc].isRevealed
          ) {
            if (newGrid[nr][nc].isMine) {
              hitMine = true
              newGrid[nr][nc].isRevealed = true // Reveal the mine that was hit
            } else {
              revealCell(newGrid, nr, nc)
            }
          }
        }
      }

      // If a mine was hit, game over
      if (hitMine) {
        // Reveal all mines
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (newGrid[r][c].isMine) {
              newGrid[r][c].isRevealed = true
            }
          }
        }

        setGrid(newGrid)
        setGameState("lost")
        setFaceExpression("frown")

        // Stop timer
        if (timerInterval) {
          clearInterval(timerInterval)
          setTimerInterval(null)
        }
      } else {
        setGrid(newGrid)
        checkWinCondition(newGrid)
      }
    }
  }

  // Check if the game is won
  const checkWinCondition = (grid: Cell[][]) => {
    const { rows, cols, mines } = settings

    // Count revealed cells
    let revealedCount = 0
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c].isRevealed) {
          revealedCount++
        }
      }
    }

    // If all non-mine cells are revealed, the game is won
    if (revealedCount === rows * cols - mines) {
      // Flag all mines
      const newGrid = [...grid]
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (newGrid[r][c].isMine && !newGrid[r][c].isFlagged) {
            newGrid[r][c].isFlagged = true
            setFlagCount((prev) => prev + 1)
          }
        }
      }

      setGrid(newGrid)
      setGameState("won")
      setFaceExpression("smile")

      // Stop timer
      if (timerInterval) {
        clearInterval(timerInterval)
        setTimerInterval(null)
      }
    }
  }

  // Change difficulty
  const changeDifficulty = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty)

    if (newDifficulty === "custom") {
      setShowCustomSettings(true)
    } else {
      setSettings(difficultySettings[newDifficulty])
      setShowCustomSettings(false)
    }
  }

  // Apply custom settings
  const applyCustomSettings = () => {
    // Validate custom settings
    const validatedSettings = {
      rows: Math.min(Math.max(customSettings.rows, 5), 24),
      cols: Math.min(Math.max(customSettings.cols, 5), 30),
      mines: Math.min(
        Math.max(customSettings.mines, 1),
        Math.floor(customSettings.rows * customSettings.cols * 0.85), // Max 85% mines
      ),
    }

    setCustomSettings(validatedSettings)
    setSettings(validatedSettings)
    setShowCustomSettings(false)
  }

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Initialize game on mount and when settings change
  useEffect(() => {
    initializeGame()

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval)
      }
    }
  }, [settings, initializeGame, timerInterval])

  // Get cell color based on neighbor mines
  const getCellColor = (cell: Cell) => {
    if (!cell.isRevealed) return ""

    if (cell.isMine) {
      return "bg-red-500 dark:bg-red-600"
    }

    if (cell.neighborMines === 0) {
      return "bg-neutral-200 dark:bg-neutral-700"
    }

    const colors = [
      "", // 0 mines (already handled above)
      "text-blue-600 dark:text-blue-400", // 1 mine
      "text-green-600 dark:text-green-400", // 2 mines
      "text-red-600 dark:text-red-400", // 3 mines
      "text-purple-600 dark:text-purple-400", // 4 mines
      "text-yellow-600 dark:text-yellow-400", // 5 mines
      "text-teal-600 dark:text-teal-400", // 6 mines
      "text-pink-600 dark:text-pink-400", // 7 mines
      "text-gray-600 dark:text-gray-400", // 8 mines
    ]

    return colors[cell.neighborMines] || ""
  }

  // Get face icon based on game state
  const getFaceIcon = () => {
    switch (faceExpression) {
      case "smile":
        return <Smile size={24} />
      case "meh":
        return <Meh size={24} />
      case "frown":
        return <Frown size={24} />
    }
  }

  // Mouse down handler to change face expression
  const handleMouseDown = () => {
    if (gameState === "playing") {
      setFaceExpression("meh")
    }
  }

  // Mouse up handler to restore face expression
  const handleMouseUp = () => {
    if (gameState === "playing") {
      setFaceExpression("smile")
    }
  }

  return (
    <div
      className="max-w-4xl mx-auto"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
            {language === "zh" ? "扫雷" : "Minesweeper"}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {language === "zh" ? "找出所有地雷，小心不要踩到它们！" : "Find all mines without stepping on any!"}
          </p>
        </div>
        <div className="flex space-x-2">
          <div className="neumorphic-display px-3 py-2 rounded-lg flex items-center">
            <Flag size={16} className="mr-1 text-red-500" />
            <div className="text-lg font-mono font-bold text-neutral-800 dark:text-neutral-100">
              {settings.mines - flagCount}
            </div>
          </div>
          <div className="neumorphic-display px-3 py-2 rounded-lg flex items-center">
            <Clock size={16} className="mr-1 text-neutral-500 dark:text-neutral-400" />
            <div className="text-lg font-mono font-bold text-neutral-800 dark:text-neutral-100">
              {formatTime(timer)}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <select
          value={difficulty}
          onChange={(e) => changeDifficulty(e.target.value as Difficulty)}
          className="neumorphic-button px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
        >
          <option value="beginner">{language === "zh" ? "初级" : "Beginner"}</option>
          <option value="intermediate">{language === "zh" ? "中级" : "Intermediate"}</option>
          <option value="expert">{language === "zh" ? "专家" : "Expert"}</option>
          <option value="custom">{language === "zh" ? "自定义" : "Custom"}</option>
        </select>

        <button
          onClick={initializeGame}
          className="neumorphic-button px-4 py-2 rounded-lg flex items-center gap-2 text-neutral-700 dark:text-neutral-300"
        >
          <RefreshCw size={16} />
          <span>{language === "zh" ? "新游戏" : "New Game"}</span>
        </button>

        <button
          className={`neumorphic-button px-4 py-2 rounded-lg flex items-center justify-center ${
            gameState === "won"
              ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
              : gameState === "lost"
                ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                : ""
          }`}
          onClick={initializeGame}
        >
          {getFaceIcon()}
        </button>
      </div>

      {/* Custom settings modal */}
      {showCustomSettings && (
        <div className="mb-4 neumorphic-card p-4 rounded-lg">
          <h4 className="text-lg font-medium mb-3 text-neutral-800 dark:text-neutral-100">
            {language === "zh" ? "自定义设置" : "Custom Settings"}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                {language === "zh" ? "行数" : "Rows"}
              </label>
              <input
                type="number"
                min="5"
                max="24"
                value={customSettings.rows}
                onChange={(e) =>
                  setCustomSettings({
                    ...customSettings,
                    rows: Number(e.target.value),
                  })
                }
                className="w-full p-2 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                {language === "zh" ? "列数" : "Columns"}
              </label>
              <input
                type="number"
                min="5"
                max="30"
                value={customSettings.cols}
                onChange={(e) =>
                  setCustomSettings({
                    ...customSettings,
                    cols: Number(e.target.value),
                  })
                }
                className="w-full p-2 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                {language === "zh" ? "地雷数" : "Mines"}
              </label>
              <input
                type="number"
                min="1"
                max={Math.floor(customSettings.rows * customSettings.cols * 0.85)}
                value={customSettings.mines}
                onChange={(e) =>
                  setCustomSettings({
                    ...customSettings,
                    mines: Number(e.target.value),
                  })
                }
                className="w-full p-2 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowCustomSettings(false)}
              className="neumorphic-button px-4 py-2 rounded-lg text-neutral-700 dark:text-neutral-300"
            >
              {language === "zh" ? "取消" : "Cancel"}
            </button>

            <button
              onClick={applyCustomSettings}
              className="neumorphic-button px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            >
              {language === "zh" ? "应用" : "Apply"}
            </button>
          </div>
        </div>
      )}

      {/* Game board */}
      <div className="neumorphic-card p-4 rounded-xl overflow-auto">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${settings.cols}, minmax(28px, 1fr))`,
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={`
                  aspect-square flex items-center justify-center text-sm font-bold
                  ${
                    cell.isRevealed
                      ? `neumorphic-display ${getCellColor(cell)}`
                      : "neumorphic-button hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  }
                  ${cell.isFlagged ? "bg-amber-50 dark:bg-amber-900/20" : ""}
                  transition-all duration-150
                `}
                onClick={() => {
                  if (cell.isRevealed && cell.neighborMines > 0) {
                    handleChord(rowIndex, colIndex)
                  } else {
                    handleCellClick(rowIndex, colIndex)
                  }
                }}
                onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
                onAuxClick={(e) => {
                  if (e.button === 1) {
                    // Middle mouse button
                    handleChord(rowIndex, colIndex)
                  }
                }}
                disabled={gameState !== "playing" && !cell.isRevealed}
              >
                {cell.isRevealed ? (
                  cell.isMine ? (
                    <span className="text-lg">💣</span>
                  ) : cell.neighborMines > 0 ? (
                    cell.neighborMines
                  ) : null
                ) : cell.isFlagged ? (
                  <Flag size={14} className="text-red-500" />
                ) : null}
              </button>
            )),
          )}
        </div>
      </div>

      {/* Game status message */}
      {gameState !== "playing" && (
        <div
          className={`mt-4 p-3 rounded-lg text-center ${
            gameState === "won"
              ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
              : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300"
          }`}
        >
          {gameState === "won"
            ? language === "zh"
              ? "恭喜！你找到了所有地雷！"
              : "Congratulations! You found all the mines!"
            : language === "zh"
              ? "游戏结束！你踩到了地雷！"
              : "Game over! You stepped on a mine!"}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
        <h4 className="font-medium mb-1 text-neutral-700 dark:text-neutral-300">
          {language === "zh" ? "如何玩" : "How to play"}:
        </h4>
        <ul className="list-disc list-inside space-y-1">
          <li>{language === "zh" ? "左键点击揭示方块" : "Left-click to reveal a cell"}</li>
          <li>{language === "zh" ? "右键点击标记地雷" : "Right-click to flag a mine"}</li>
          <li>
            {language === "zh"
              ? "双击已揭示的数字方块快速揭示周围方块"
              : "Double-click on revealed numbers to quickly reveal surrounding cells"}
          </li>
          <li>{language === "zh" ? "第一次点击永远是安全的" : "Your first click is always safe"}</li>
        </ul>
      </div>
    </div>
  )
}
