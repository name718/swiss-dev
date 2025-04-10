"use client"

import { useState, useEffect } from "react"
import { RefreshCw, Clock, Zap, HelpCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

type SudokuGrid = (number | null)[][]
type CellNotes = Set<number>[][][]

export function Sudoku() {
  const [grid, setGrid] = useState<SudokuGrid>([])
  const [solution, setSolution] = useState<SudokuGrid>([])
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [gameStatus, setGameStatus] = useState<"playing" | "paused" | "completed">("playing")
  const [timer, setTimer] = useState(0)
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)
  const [originalCells, setOriginalCells] = useState<boolean[][]>([])
  const [notes, setNotes] = useState<CellNotes>([])
  const [notesMode, setNotesMode] = useState(false)
  const [mistakes, setMistakes] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const { t } = useLanguage()

  // Initialize a new game
  const initializeGame = (diff: "easy" | "medium" | "hard" = difficulty) => {
    // Stop the timer if it's running
    if (timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    }

    // Reset game state
    setTimer(0)
    setMistakes(0)
    setGameStatus("playing")
    setSelectedCell(null)
    setShowHint(false)

    // Generate a new Sudoku puzzle
    const { puzzle, solution: sol } = generateSudoku(diff)
    setGrid(puzzle)
    setSolution(sol)

    // Mark original cells
    const original = Array(9)
      .fill(null)
      .map(() => Array(9).fill(false))
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row][col] !== null) {
          original[row][col] = true
        }
      }
    }
    setOriginalCells(original)

    // Initialize notes
    const newNotes: CellNotes = Array(9)
      .fill(null)
      .map(() =>
        Array(9)
          .fill(null)
          .map(() =>
            Array(3)
              .fill(null)
              .map(() => new Set<number>()),
          ),
      )
    setNotes(newNotes)

    // Start the timer
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1)
    }, 1000)
    setTimerInterval(interval)
  }

  // Generate a Sudoku puzzle
  const generateSudoku = (diff: "easy" | "medium" | "hard") => {
    // Create a solved Sudoku grid
    const solution = createSolvedGrid()

    // Create a puzzle by removing numbers from the solution
    let cellsToRemove
    switch (diff) {
      case "easy":
        cellsToRemove = 35 // Remove ~35 cells for easy
        break
      case "medium":
        cellsToRemove = 45 // Remove ~45 cells for medium
        break
      case "hard":
        cellsToRemove = 55 // Remove ~55 cells for hard
        break
      default:
        cellsToRemove = 45
    }

    const puzzle = JSON.parse(JSON.stringify(solution)) as SudokuGrid
    const positions = []

    // Create a list of all positions
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        positions.push([row, col])
      }
    }

    // Shuffle the positions
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[positions[i], positions[j]] = [positions[j], positions[i]]
    }

    // Remove numbers from the puzzle
    for (let i = 0; i < cellsToRemove; i++) {
      if (i < positions.length) {
        const [row, col] = positions[i]
        puzzle[row][col] = null
      }
    }

    return { puzzle, solution }
  }

  // Create a solved Sudoku grid
  const createSolvedGrid = (): SudokuGrid => {
    // Start with an empty grid
    const grid: SudokuGrid = Array(9)
      .fill(null)
      .map(() => Array(9).fill(null))

    // Fill the grid using backtracking
    fillGrid(grid)

    return grid
  }

  // Fill the grid using backtracking
  const fillGrid = (grid: SudokuGrid): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === null) {
          // Try each number 1-9
          const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

          // Shuffle the numbers for randomness
          for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[numbers[i], numbers[j]] = [numbers[j], numbers[i]]
          }

          for (const num of numbers) {
            if (isValidPlacement(grid, row, col, num)) {
              grid[row][col] = num

              if (fillGrid(grid)) {
                return true
              }

              grid[row][col] = null
            }
          }

          return false
        }
      }
    }

    return true
  }

  // Check if a number can be placed in a cell
  const isValidPlacement = (grid: SudokuGrid, row: number, col: number, num: number): boolean => {
    // Check row
    for (let c = 0; c < 9; c++) {
      if (grid[row][c] === num) {
        return false
      }
    }

    // Check column
    for (let r = 0; r < 9; r++) {
      if (grid[r][col] === num) {
        return false
      }
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3
    const boxCol = Math.floor(col / 3) * 3

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (grid[boxRow + r][boxCol + c] === num) {
          return false
        }
      }
    }

    return true
  }

  // Handle cell selection
  const handleCellSelect = (row: number, col: number) => {
    if (gameStatus === "completed") return

    if (gameStatus === "paused") {
      setGameStatus("playing")
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1)
      }, 1000)
      setTimerInterval(interval)
    }

    setSelectedCell([row, col])
  }

  // Handle number input
  const handleNumberInput = (num: number) => {
    if (!selectedCell || gameStatus !== "playing") return

    const [row, col] = selectedCell

    // If the cell is original, don't allow changes
    if (originalCells[row][col]) return

    if (notesMode) {
      // Handle notes mode
      const newNotes = [...notes]
      const noteRow = Math.floor(num - 1) / 3
      const noteCol = (num - 1) % 3

      if (newNotes[row][col][noteRow].has(num)) {
        newNotes[row][col][noteRow].delete(num)
      } else {
        newNotes[row][col][noteRow].add(num)
      }

      setNotes(newNotes)
    } else {
      // Handle normal mode
      const newGrid = [...grid]

      // Check if the number is correct
      if (num === solution[row][col]) {
        newGrid[row][col] = num

        // Clear notes for this cell
        const newNotes = [...notes]
        newNotes[row][col] = Array(3)
          .fill(null)
          .map(() => new Set<number>())
        setNotes(newNotes)

        // Check if the puzzle is completed
        let completed = true
        for (let r = 0; r < 9; r++) {
          for (let c = 0; c < 9; c++) {
            if (newGrid[r][c] !== solution[r][c]) {
              completed = false
              break
            }
          }
          if (!completed) break
        }

        if (completed) {
          setGameStatus("completed")
          if (timerInterval) {
            clearInterval(timerInterval)
            setTimerInterval(null)
          }
        }
      } else {
        // Wrong number
        setMistakes(mistakes + 1)

        // Flash the cell to indicate a mistake
        newGrid[row][col] = num
        setGrid(newGrid)

        setTimeout(() => {
          const resetGrid = [...newGrid]
          resetGrid[row][col] = null
          setGrid(resetGrid)
        }, 500)

        return
      }

      setGrid(newGrid)
    }
  }

  // Toggle notes mode
  const toggleNotesMode = () => {
    setNotesMode(!notesMode)
  }

  // Pause the game
  const pauseGame = () => {
    if (gameStatus === "playing") {
      setGameStatus("paused")
      if (timerInterval) {
        clearInterval(timerInterval)
        setTimerInterval(null)
      }
    } else if (gameStatus === "paused") {
      setGameStatus("playing")
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1)
      }, 1000)
      setTimerInterval(interval)
    }
  }

  // Show a hint
  const showHintForCell = () => {
    if (!selectedCell || gameStatus !== "playing") return

    const [row, col] = selectedCell

    // If the cell is already filled, don't show a hint
    if (grid[row][col] !== null) return

    setShowHint(true)

    // Hide the hint after 2 seconds
    setTimeout(() => {
      setShowHint(false)
    }, 2000)
  }

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Initialize the game on mount
  useEffect(() => {
    initializeGame()

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval)
      }
    }
  }, [])

  // Get cell background color
  const getCellBackground = (row: number, col: number) => {
    if (selectedCell && selectedCell[0] === row && selectedCell[1] === col) {
      return "bg-blue-100 dark:bg-blue-900/30"
    }

    if (selectedCell) {
      const [selectedRow, selectedCol] = selectedCell

      // Highlight the same row, column, and box
      if (
        selectedRow === row ||
        selectedCol === col ||
        (Math.floor(selectedRow / 3) === Math.floor(row / 3) && Math.floor(selectedCol / 3) === Math.floor(col / 3))
      ) {
        return "bg-blue-50 dark:bg-blue-900/10"
      }
    }

    return ""
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">Sudoku</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{t("sudoku.fill.grid")}</p>
        </div>
        <div className="flex space-x-2">
          <div className="neumorphic-display px-3 py-2 rounded-lg flex items-center">
            <Clock size={16} className="mr-1 text-neutral-500 dark:text-neutral-400" />
            <div className="text-lg font-mono font-bold text-neutral-800 dark:text-neutral-100">
              {formatTime(timer)}
            </div>
          </div>
          <div className="neumorphic-display px-3 py-2 rounded-lg">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">{t("sudoku.mistakes")}</div>
            <div className="text-lg font-bold text-neutral-800 dark:text-neutral-100">{mistakes}</div>
          </div>
        </div>
      </div>

      <div className="mb-4 flex space-x-2">
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}
          className="neumorphic-button px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
        >
          <option value="easy">{t("sudoku.easy")}</option>
          <option value="medium">{t("sudoku.medium")}</option>
          <option value="hard">{t("sudoku.hard")}</option>
        </select>
        <button
          onClick={() => initializeGame(difficulty)}
          className="neumorphic-button px-4 py-2 rounded-lg flex items-center gap-2 text-neutral-700 dark:text-neutral-300"
        >
          <RefreshCw size={16} />
          <span>{t("sudoku.new.game")}</span>
        </button>
        <button
          onClick={pauseGame}
          className="neumorphic-button px-4 py-2 rounded-lg text-neutral-700 dark:text-neutral-300"
        >
          {gameStatus === "paused" ? t("sudoku.resume") : t("sudoku.pause")}
        </button>
      </div>

      {gameStatus === "paused" ? (
        <div className="neumorphic-card p-6 rounded-xl mb-4 flex items-center justify-center">
          <p className="text-xl font-bold text-neutral-800 dark:text-neutral-100">{t("sudoku.game.paused")}</p>
        </div>
      ) : (
        <div className="neumorphic-card p-2 md:p-4 rounded-xl mb-4">
          <div className="grid grid-cols-9 gap-0.5 md:gap-1">
            {Array(9)
              .fill(null)
              .map((_, rowIndex) =>
                Array(9)
                  .fill(null)
                  .map((_, colIndex) => {
                    const value = grid[rowIndex]?.[colIndex]
                    const isOriginal = originalCells[rowIndex]?.[colIndex]
                    const isSelected = selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex
                    const showHintValue = showHint && isSelected

                    return (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        className={`aspect-square flex items-center justify-center text-lg font-medium rounded
                          ${getCellBackground(rowIndex, colIndex)}
                          ${
                            (rowIndex + 1) % 3 === 0 && rowIndex < 8
                              ? "border-b-2 border-neutral-300 dark:border-neutral-600"
                              : ""
                          }
                          ${
                            (colIndex + 1) % 3 === 0 && colIndex < 8
                              ? "border-r-2 border-neutral-300 dark:border-neutral-600"
                              : ""
                          }
                          ${
                            isOriginal
                              ? "text-neutral-800 dark:text-neutral-100 font-bold"
                              : "text-blue-600 dark:text-blue-400"
                          }
                        `}
                        onClick={() => handleCellSelect(rowIndex, colIndex)}
                      >
                        {value ? (
                          value
                        ) : showHintValue ? (
                          <span className="text-green-500 dark:text-green-400 animate-pulse">
                            {solution[rowIndex][colIndex]}
                          </span>
                        ) : (
                          <div className="grid grid-cols-3 gap-0 w-full h-full p-0.5">
                            {Array(9)
                              .fill(null)
                              .map((_, noteIndex) => {
                                const noteRow = Math.floor(noteIndex / 3)
                                const noteCol = noteIndex % 3
                                const noteValue = noteIndex + 1
                                const hasNote = notes[rowIndex]?.[colIndex]?.[noteRow]?.has(noteValue)

                                return (
                                  <div key={noteIndex} className="flex items-center justify-center">
                                    {hasNote && (
                                      <span className="text-[0.5rem] text-neutral-500 dark:text-neutral-400">
                                        {noteValue}
                                      </span>
                                    )}
                                  </div>
                                )
                              })}
                          </div>
                        )}
                      </button>
                    )
                  }),
              )}
          </div>
        </div>
      )}

      {gameStatus === "completed" ? (
        <div className="neumorphic-card p-6 rounded-xl mb-4 text-center">
          <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">{t("sudoku.puzzle.completed")}</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            {t("sudoku.time")}: {formatTime(timer)} | {t("sudoku.mistakes")}: {mistakes}
          </p>
          <button
            onClick={() => initializeGame(difficulty)}
            className="neumorphic-button px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={16} />
            <span>{t("sudoku.play.again")}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberInput(num)}
              className="neumorphic-button py-3 rounded-lg text-lg font-medium text-neutral-700 dark:text-neutral-300"
              disabled={gameStatus !== "playing"}
            >
              {num}
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={toggleNotesMode}
          className={`neumorphic-button px-4 py-2 rounded-lg flex items-center gap-2 ${
            notesMode ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : ""
          }`}
          disabled={gameStatus !== "playing"}
        >
          <Zap size={16} />
          <span>{notesMode ? t("sudoku.notes.on") : t("sudoku.notes.off")}</span>
        </button>
        <button
          onClick={showHintForCell}
          className="neumorphic-button px-4 py-2 rounded-lg flex items-center gap-2"
          disabled={gameStatus !== "playing" || !selectedCell || grid[selectedCell[0]][selectedCell[1]] !== null}
        >
          <HelpCircle size={16} />
          <span>{t("sudoku.hint")}</span>
        </button>
      </div>
    </div>
  )
}
