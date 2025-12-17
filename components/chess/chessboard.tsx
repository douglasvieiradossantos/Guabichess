"use client"

import { useState } from "react"
import type { ChessEngine, Position, Piece } from "@/lib/chess/engine"
import { cn } from "@/lib/utils"

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

interface ChessboardProps {
  engine: ChessEngine
  onMove?: () => void
}

export function Chessboard({ engine, onMove }: ChessboardProps) {
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null)
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([])
  const [, forceUpdate] = useState({})

  const handleSquareClick = (row: number, col: number) => {
    const clickedPos = { row, col }

    // Se há uma peça selecionada, tentar mover
    if (selectedSquare) {
      const moved = engine.makeMove(selectedSquare, clickedPos)
      if (moved) {
        setSelectedSquare(null)
        setPossibleMoves([])
        forceUpdate({})
        onMove?.()
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

  return (
    <div className="inline-block">
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
                className={cn(
                  "w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-4xl sm:text-5xl transition-all duration-200",
                  isLight ? "bg-amber-100" : "bg-emerald-700",
                  isSelected && "ring-4 ring-blue-500 ring-inset",
                  isPossibleMove && "ring-4 ring-yellow-400 ring-inset",
                  "hover:brightness-110 active:brightness-90",
                )}
              >
                {getPieceSymbol(piece)}
                {isPossibleMove && !piece && <div className="w-4 h-4 rounded-full bg-yellow-400/50" />}
              </button>
            )
          }),
        )}
      </div>
    </div>
  )
}
