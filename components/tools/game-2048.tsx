"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react"

// Define tile type
type Tile = {
  value: number
  id: string
  mergedFrom: string[] | null
  isNew: boolean
}

// Define grid type
type Grid = (Tile | null)[][]

// Define direction type
type Direction = "up" | "down" | "left" | "right"

export function Game2048() {
  const [grid, setGrid] = useState<Grid>([])
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [keepPlaying, setKeepPlaying] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)

  // Initialize the game
  const initializeGame = useCallback(() => {
    const newGrid: Grid = Array(4)
      .fill(null)
      .map(() => Array(4).fill(null))

    // Add two initial tiles
    addRandomTile(newGrid)
    addRandomTile(newGrid)

    setGrid(newGrid)
    setScore(0)
    setGameOver(false)
    setWon(false)
    setKeepPlaying(false)
    setMessage(null)

    // Load best score from localStorage
    const savedBestScore = localStorage.getItem("game2048BestScore")
    if (savedBestScore) {
      setBestScore(Number.parseInt(savedBestScore))
    }
  }, [])

  // Generate a random tile
  const addRandomTile = (grid: Grid) => {
    const emptyCells: { row: number; col: number }[] = []

    // Find all empty cells
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (!grid[row][col]) {
          emptyCells.push({ row, col })
        }
      }
    }

    // If there are empty cells, add a random tile
    if (emptyCells.length > 0) {
      const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)]
      const value = Math.random() < 0.9 ? 2 : 4 // 90% chance of 2, 10% chance of 4
      grid[row][col] = {
        value,
        id: `${row}-${col}-${Date.now()}`,
        mergedFrom: null,
        isNew: true,
      }
    }
  }

  // Check if the game is over
  const checkGameOver = (grid: Grid) => {
    // Check if the grid is full
    let isFull = true
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (!grid[row][col]) {
          isFull = false
          break
        }
      }
      if (!isFull) break
    }

    if (!isFull) return false

    // Check if there are any possible moves
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const tile = grid[row][col]
        if (tile) {
          // Check adjacent cells
          if (
            (row < 3 && grid[row + 1][col]?.value === tile.value) ||
            (col < 3 && grid[row][col + 1]?.value === tile.value)
          ) {
            return false
          }
        }
      }
    }

    return true
  }

  // Move tiles in a direction
  const moveTiles = (direction: Direction) => {
    if (gameOver && !keepPlaying) return

    // Create a copy of the grid
    const newGrid: Grid = JSON.parse(JSON.stringify(grid))

    // Reset the "new" and "mergedFrom" flags
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (newGrid[row][col]) {
          newGrid[row][col]!.isNew = false
          newGrid[row][col]!.mergedFrom = null
        }
      }
    }

    let moved = false
    let scoreIncrease = 0

    // Process the grid based on direction
    if (direction === "left") {
      for (let row = 0; row < 4; row++) {
        const result = processTilesLine(newGrid[row])
        newGrid[row] = result.line
        moved = moved || result.moved
        scoreIncrease += result.score
      }
    } else if (direction === "right") {
      for (let row = 0; row < 4; row++) {
        const reversedLine = [...newGrid[row]].reverse()
        const result = processTilesLine(reversedLine)
        newGrid[row] = result.line.reverse()
        moved = moved || result.moved
        scoreIncrease += result.score
      }
    } else if (direction === "up") {
      for (let col = 0; col < 4; col++) {
        const line = [newGrid[0][col], newGrid[1][col], newGrid[2][col], newGrid[3][col]]
        const result = processTilesLine(line)
        for (let row = 0; row < 4; row++) {
          newGrid[row][col] = result.line[row]
        }
        moved = moved || result.moved
        scoreIncrease += result.score
      }
    } else if (direction === "down") {
      for (let col = 0; col < 4; col++) {
        const line = [newGrid[0][col], newGrid[1][col], newGrid[2][col], newGrid[3][col]].reverse()
        const result = processTilesLine(line)
        const reversedLine = result.line.reverse()
        for (let row = 0; row < 4; row++) {
          newGrid[row][col] = reversedLine[row]
        }
        moved = moved || result.moved
        scoreIncrease += result.score
      }
    }

    // If tiles moved, add a new random tile
    if (moved) {
      addRandomTile(newGrid)

      // Update score
      const newScore = score + scoreIncrease
      setScore(newScore)

      // Update best score
      if (newScore > bestScore) {
        setBestScore(newScore)
        localStorage.setItem("game2048BestScore", newScore.toString())
      }

      // Check for 2048 tile
      if (!won && !keepPlaying) {
        for (let row = 0; row < 4; row++) {
          for (let col = 0; col < 4; col++) {
            if (newGrid[row][col]?.value === 2048) {
              setWon(true)
              setMessage("You won! 🎉")
              break
            }
          }
          if (won) break
        }
      }

      // Check if game is over
      if (checkGameOver(newGrid)) {
        setGameOver(true)
        setMessage("Game over! 😢")
      }
    }

    setGrid(newGrid)
  }

  // Process a line of tiles (for moving and merging)
  const processTilesLine = (line: (Tile | null)[]) => {
    const newLine: (Tile | null)[] = [null, null, null, null]
    let moved = false
    let score = 0

    // Remove nulls and get only the tiles
    const tiles = line.filter((tile) => tile !== null) as Tile[]

    // Process tiles
    let position = 0
    for (let i = 0; i < tiles.length; i++) {
      const current = tiles[i]

      // If there's a next tile and it has the same value, merge them
      if (i < tiles.length - 1 && tiles[i + 1].value === current.value) {
        const merged = {
          value: current.value * 2,
          id: `${current.id}-${tiles[i + 1].id}`,
          mergedFrom: [current.id, tiles[i + 1].id],
          isNew: false,
        }
        newLine[position] = merged
        position++
        i++ // Skip the next tile since we merged it

        // Add to score
        score += merged.value

        moved = true
      } else {
        // Just move the tile
        newLine[position] = { ...current }
        if (position !== i || line[position] !== current) {
          moved = true
        }
        position++
      }
    }

    return { line: newLine, moved, score }
  }

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver && !keepPlaying) return

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault()
          moveTiles("up")
          break
        case "ArrowDown":
          e.preventDefault()
          moveTiles("down")
          break
        case "ArrowLeft":
          e.preventDefault()
          moveTiles("left")
          break
        case "ArrowRight":
          e.preventDefault()
          moveTiles("right")
          break
      }
    },
    [gameOver, keepPlaying, grid, score, bestScore],
  )

  // Handle touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y

    // Determine the direction of the swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > 20) {
        moveTiles("right")
      } else if (deltaX < -20) {
        moveTiles("left")
      }
    } else {
      // Vertical swipe
      if (deltaY > 20) {
        moveTiles("down")
      } else if (deltaY < -20) {
        moveTiles("up")
      }
    }

    setTouchStart(null)
  }

  // Initialize the game on mount
  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  // Add keyboard event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  // Get the background color for a tile
  const getTileColor = (value: number) => {
    const colors: Record<number, string> = {
      2: "bg-amber-100 dark:bg-amber-900/70 text-neutral-800 dark:text-neutral-100",
      4: "bg-amber-200 dark:bg-amber-800/70 text-neutral-800 dark:text-neutral-100",
      8: "bg-orange-200 dark:bg-orange-800/70 text-neutral-800 dark:text-neutral-100",
      16: "bg-orange-300 dark:bg-orange-700/70 text-neutral-800 dark:text-neutral-100",
      32: "bg-red-300 dark:bg-red-700/70 text-white",
      64: "bg-red-400 dark:bg-red-600/70 text-white",
      128: "bg-yellow-300 dark:bg-yellow-700/70 text-neutral-800 dark:text-neutral-100",
      256: "bg-yellow-400 dark:bg-yellow-600/70 text-neutral-800 dark:text-neutral-100",
      512: "bg-green-400 dark:bg-green-600/70 text-white",
      1024: "bg-blue-400 dark:bg-blue-600/70 text-white",
      2048: "bg-purple-400 dark:bg-purple-600/70 text-white",
    }

    return colors[value] || "bg-purple-500 dark:bg-purple-500/70 text-white"
  }

  // Get the font size for a tile
  const getTileFontSize = (value: number) => {
    if (value < 100) return "text-2xl"
    if (value < 1000) return "text-xl"
    return "text-lg"
  }

  // Continue playing after winning
  const continueGame = () => {
    setKeepPlaying(true)
    setMessage(null)
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">2048</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Join the tiles, get to <span className="font-bold">2048</span>!
          </p>
        </div>
        <div className="flex space-x-2">
          <div className="neumorphic-display px-3 py-2 rounded-lg">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">SCORE</div>
            <div className="text-xl font-bold text-neutral-800 dark:text-neutral-100">{score}</div>
          </div>
          <div className="neumorphic-display px-3 py-2 rounded-lg">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">BEST</div>
            <div className="text-xl font-bold text-neutral-800 dark:text-neutral-100">{bestScore}</div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={initializeGame}
          className="neumorphic-button px-4 py-2 rounded-lg flex items-center gap-2 text-neutral-700 dark:text-neutral-300"
        >
          <RotateCcw size={16} />
          <span>New Game</span>
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-center">
          <p className="text-lg font-bold text-neutral-800 dark:text-neutral-100">{message}</p>
          {won && !keepPlaying && (
            <button
              onClick={continueGame}
              className="mt-2 neumorphic-button px-4 py-1 rounded-lg text-sm text-neutral-700 dark:text-neutral-300"
            >
              Keep playing
            </button>
          )}
        </div>
      )}

      <div
        className="neumorphic-card p-4 rounded-xl bg-neutral-200 dark:bg-neutral-700 mb-4"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="grid grid-cols-4 gap-3">
          {Array(4)
            .fill(null)
            .flatMap((_, rowIndex) =>
              Array(4)
                .fill(null)
                .map((_, colIndex) => {
                  const tile = grid[rowIndex]?.[colIndex]
                  return (
                    <div
                      key={`cell-${rowIndex}-${colIndex}`}
                      className="relative aspect-square rounded-lg bg-neutral-300/50 dark:bg-neutral-600/50"
                    >
                      {tile && (
                        <div
                          className={`absolute inset-0 flex items-center justify-center rounded-lg ${getTileColor(
                            tile.value,
                          )} ${getTileFontSize(tile.value)} font-bold ${
                            tile.isNew ? "animate-scaleUp" : tile.mergedFrom ? "animate-pop" : ""
                          }`}
                        >
                          {tile.value}
                        </div>
                      )}
                    </div>
                  )
                }),
            )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
        <div className="col-start-2">
          <button
            onClick={() => moveTiles("up")}
            className="neumorphic-button w-full p-3 rounded-lg flex justify-center"
            aria-label="Move Up"
          >
            <ArrowUp size={24} />
          </button>
        </div>
        <div className="col-start-1 col-end-4 grid grid-cols-3 gap-2">
          <button
            onClick={() => moveTiles("left")}
            className="neumorphic-button w-full p-3 rounded-lg flex justify-center"
            aria-label="Move Left"
          >
            <ArrowLeft size={24} />
          </button>
          <button
            onClick={() => moveTiles("down")}
            className="neumorphic-button w-full p-3 rounded-lg flex justify-center"
            aria-label="Move Down"
          >
            <ArrowDown size={24} />
          </button>
          <button
            onClick={() => moveTiles("right")}
            className="neumorphic-button w-full p-3 rounded-lg flex justify-center"
            aria-label="Move Right"
          >
            <ArrowRight size={24} />
          </button>
        </div>
      </div>

      <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
        <p className="mb-1">
          <strong>How to play:</strong> Use arrow keys or swipe to move tiles. When two tiles with the same number
          touch, they merge into one!
        </p>
      </div>
    </div>
  )
}
