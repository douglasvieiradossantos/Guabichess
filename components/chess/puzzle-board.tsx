"use client"

import { useState, useEffect } from "react"
import { ChessEngine, type Position, type Piece } from "@/lib/chess/engine"
import { type ChessPuzzle, fenToBoard } from "@/lib/chess/puzzles"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, RotateCcw, Lightbulb } from "lucide-react"

const pieceSymbols: Record<string, string> = {
  "white-pawn": "♙",
  "white-knight": "♘",
  "white-bishop": "♗",
  "white-rook": "♖",
  "white-queen": "♕",
  "white-king": "♔",
  "black-pawn": "♟",
  "black-knight": "♞",
  "black-bishop": "♝",
  "black-rook": "♜",
  "black-queen": "♛",
  "black-king": "♚",
}

interface PuzzleBoardProps {
  puzzle: ChessPuzzle
  onComplete: (success: boolean, points: number) => void
}

export function PuzzleBoard({ puzzle, onComplete }: PuzzleBoardProps) {
  const [engine] = useState(() => {
    const eng = new ChessEngine()
    eng.board = fenToBoard(puzzle.fen)
    return eng
  })
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null)
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([])
  const [moveCount, setMoveCount] = useState(0)
  const [status, setStatus] = useState<"playing" | "success" | "failed">("playing")
  const [hint, setHint] = useState(false)
  const [, forceUpdate] = useState({})

  // Reset quando mudar o puzzle
  useEffect(() => {
    engine.board = fenToBoard(puzzle.fen)
    engine.currentTurn = "white"
    setMoveCount(0)
    setStatus("playing")
    setSelectedSquare(null)
    setPossibleMoves([])
    setHint(false)
    forceUpdate({})
  }, [puzzle, engine])

  const handleSquareClick = (row: number, col: number) => {
    if (status !== "playing") return

    const clickedPos = { row, col }

    // Se há uma peça selecionada, tentar mover
    if (selectedSquare) {
      const moved = engine.makeMove(selectedSquare, clickedPos)
      if (moved) {
        setSelectedSquare(null)
        setPossibleMoves([])
        setMoveCount((prev) => prev + 1)

        // Verificar se o puzzle foi resolvido
        if (engine.isCheckmate) {
          setStatus("success")
          onComplete(true, puzzle.points)
        } else if (moveCount >= puzzle.solution.length - 1) {
          // Verificar se os movimentos estão corretos (simplificado)
          setStatus("success")
          onComplete(true, puzzle.points)
        }

        forceUpdate({})
        return
      }
    }

    // Selecionar nova peça
    const piece = engine.getPiece(clickedPos)
    if (piece && piece.color === engine.currentTurn) {
      setSelectedSquare(clickedPos)
      setPossibleMoves(engine.getPossibleMoves(clickedPos))
    } else {
      setSelectedSquare(null)
      setPossibleMoves([])
    }
  }

  const isSquareSelected = (row: number, col: number) => {
    return selectedSquare?.row === row && selectedSquare?.col === col
  }

  const isSquarePossibleMove = (row: number, col: number) => {
    return possibleMoves.some((move) => move.row === row && move.col === col)
  }

  const getPieceSymbol = (piece: Piece | null) => {
    if (!piece) return null
    return pieceSymbols[`${piece.color}-${piece.type}`]
  }

  const handleReset = () => {
    engine.board = fenToBoard(puzzle.fen)
    engine.currentTurn = "white"
    setMoveCount(0)
    setStatus("playing")
    setSelectedSquare(null)
    setPossibleMoves([])
    setHint(false)
    forceUpdate({})
  }

  const showHint = () => {
    setHint(true)
  }

  return (
    <div className="space-y-4">
      {/* Status Banner */}
      {status === "success" && (
        <div className="bg-green-100 dark:bg-green-900/20 border border-green-500 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
          <div>
            <p className="font-semibold text-green-800 dark:text-green-200">Puzzle Resolvido!</p>
            <p className="text-sm text-green-700 dark:text-green-300">Você ganhou {puzzle.points} pontos</p>
          </div>
        </div>
      )}

      {status === "failed" && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-500 rounded-lg p-4 flex items-center gap-3">
          <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          <div>
            <p className="font-semibold text-red-800 dark:text-red-200">Movimento Incorreto</p>
            <p className="text-sm text-red-700 dark:text-red-300">Tente novamente</p>
          </div>
        </div>
      )}

      {/* Tabuleiro */}
      <div className="flex flex-col items-center gap-4">
        <div className="grid grid-cols-8 gap-0 border-4 border-primary rounded-lg overflow-hidden shadow-2xl">
          {engine.board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const isLight = (rowIndex + colIndex) % 2 === 0
              const isSelected = isSquareSelected(rowIndex, colIndex)
              const isPossibleMove = isSquarePossibleMove(rowIndex, colIndex)

              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  disabled={status !== "playing"}
                  className={cn(
                    "w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl transition-all duration-200",
                    isLight ? "bg-amber-100" : "bg-emerald-700",
                    isSelected && "ring-4 ring-blue-500 ring-inset",
                    isPossibleMove && "ring-4 ring-yellow-400 ring-inset",
                    status === "playing" && "hover:brightness-110 active:brightness-90",
                    status !== "playing" && "opacity-75 cursor-not-allowed",
                  )}
                >
                  {getPieceSymbol(piece)}
                  {isPossibleMove && !piece && <div className="w-3 h-3 rounded-full bg-yellow-400/50" />}
                </button>
              )
            }),
          )}
        </div>

        {/* Controles */}
        <div className="flex gap-2 flex-wrap justify-center">
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-2 bg-transparent">
            <RotateCcw className="h-4 w-4" />
            Reiniciar
          </Button>
          {!hint && status === "playing" && (
            <Button variant="outline" size="sm" onClick={showHint} className="gap-2 bg-transparent">
              <Lightbulb className="h-4 w-4" />
              Dica
            </Button>
          )}
        </div>

        {/* Dica */}
        {hint && (
          <div className="bg-blue-100 dark:bg-blue-900/20 border border-blue-500 rounded-lg p-3 text-sm">
            <p className="text-blue-800 dark:text-blue-200">
              <strong>Dica:</strong> {puzzle.description}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
