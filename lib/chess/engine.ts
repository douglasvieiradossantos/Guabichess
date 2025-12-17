// Sistema de xadrez completo com validação de movimentos

export type PieceType = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king"
export type PieceColor = "white" | "black"
export type Position = { row: number; col: number }

export interface Piece {
  type: PieceType
  color: PieceColor
  hasMoved?: boolean
}

export interface Move {
  from: Position
  to: Position
  piece: Piece
  capturedPiece?: Piece
  isEnPassant?: boolean
  isCastling?: boolean
  isPromotion?: boolean
}

export class ChessEngine {
  board: (Piece | null)[][]
  currentTurn: PieceColor
  moveHistory: Move[]
  isCheck: boolean
  isCheckmate: boolean
  isStalemate: boolean

  constructor() {
    this.board = this.initializeBoard()
    this.currentTurn = "white"
    this.moveHistory = []
    this.isCheck = false
    this.isCheckmate = false
    this.isStalemate = false
  }

  initializeBoard(): (Piece | null)[][] {
    const board: (Piece | null)[][] = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null))

    // Peças pretas
    const blackPieces: PieceType[] = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"]
    blackPieces.forEach((type, col) => {
      board[0][col] = { type, color: "black", hasMoved: false }
    })
    for (let col = 0; col < 8; col++) {
      board[1][col] = { type: "pawn", color: "black", hasMoved: false }
    }

    // Peças brancas
    const whitePieces: PieceType[] = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"]
    whitePieces.forEach((type, col) => {
      board[7][col] = { type, color: "white", hasMoved: false }
    })
    for (let col = 0; col < 8; col++) {
      board[6][col] = { type: "pawn", color: "white", hasMoved: false }
    }

    return board
  }

  getPiece(pos: Position): Piece | null {
    return this.board[pos.row][pos.col]
  }

  isValidPosition(pos: Position): boolean {
    return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8
  }

  isValidMove(from: Position, to: Position): boolean {
    const piece = this.getPiece(from)
    if (!piece || piece.color !== this.currentTurn) return false
    if (!this.isValidPosition(to)) return false

    const targetPiece = this.getPiece(to)
    if (targetPiece && targetPiece.color === piece.color) return false

    const possibleMoves = this.getPossibleMoves(from)
    return possibleMoves.some((move) => move.row === to.row && move.col === to.col)
  }

  getPossibleMoves(from: Position): Position[] {
    const piece = this.getPiece(from)
    if (!piece) return []

    let moves: Position[] = []

    switch (piece.type) {
      case "pawn":
        moves = this.getPawnMoves(from, piece)
        break
      case "knight":
        moves = this.getKnightMoves(from, piece)
        break
      case "bishop":
        moves = this.getBishopMoves(from, piece)
        break
      case "rook":
        moves = this.getRookMoves(from, piece)
        break
      case "queen":
        moves = this.getQueenMoves(from, piece)
        break
      case "king":
        moves = this.getKingMoves(from, piece)
        break
    }

    // Filtrar movimentos que deixariam o rei em xeque
    return moves.filter((to) => !this.wouldBeInCheck(from, to, piece.color))
  }

  getPawnMoves(from: Position, piece: Piece): Position[] {
    const moves: Position[] = []
    const direction = piece.color === "white" ? -1 : 1
    const startRow = piece.color === "white" ? 6 : 1

    // Movimento para frente
    const forward = { row: from.row + direction, col: from.col }
    if (this.isValidPosition(forward) && !this.getPiece(forward)) {
      moves.push(forward)

      // Movimento duplo inicial
      if (from.row === startRow) {
        const doubleForward = { row: from.row + 2 * direction, col: from.col }
        if (!this.getPiece(doubleForward)) {
          moves.push(doubleForward)
        }
      }
    }

    // Capturas diagonais
    const captureLeft = { row: from.row + direction, col: from.col - 1 }
    const captureRight = { row: from.row + direction, col: from.col + 1 }

    if (this.isValidPosition(captureLeft)) {
      const target = this.getPiece(captureLeft)
      if (target && target.color !== piece.color) {
        moves.push(captureLeft)
      }
    }

    if (this.isValidPosition(captureRight)) {
      const target = this.getPiece(captureRight)
      if (target && target.color !== piece.color) {
        moves.push(captureRight)
      }
    }

    return moves
  }

  getKnightMoves(from: Position, piece: Piece): Position[] {
    const moves: Position[] = []
    const offsets = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ]

    offsets.forEach(([rowOffset, colOffset]) => {
      const to = { row: from.row + rowOffset, col: from.col + colOffset }
      if (this.isValidPosition(to)) {
        const target = this.getPiece(to)
        if (!target || target.color !== piece.color) {
          moves.push(to)
        }
      }
    })

    return moves
  }

  getBishopMoves(from: Position, piece: Piece): Position[] {
    return this.getLineMoves(from, piece, [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ])
  }

  getRookMoves(from: Position, piece: Piece): Position[] {
    return this.getLineMoves(from, piece, [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ])
  }

  getQueenMoves(from: Position, piece: Piece): Position[] {
    return this.getLineMoves(from, piece, [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ])
  }

  getLineMoves(from: Position, piece: Piece, directions: number[][]): Position[] {
    const moves: Position[] = []

    directions.forEach(([rowDir, colDir]) => {
      let row = from.row + rowDir
      let col = from.col + colDir

      while (row >= 0 && row < 8 && col >= 0 && col < 8) {
        const target = this.getPiece({ row, col })

        if (!target) {
          moves.push({ row, col })
        } else {
          if (target.color !== piece.color) {
            moves.push({ row, col })
          }
          break
        }

        row += rowDir
        col += colDir
      }
    })

    return moves
  }

  getKingMoves(from: Position, piece: Piece): Position[] {
    const moves: Position[] = []
    const offsets = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ]

    offsets.forEach(([rowOffset, colOffset]) => {
      const to = { row: from.row + rowOffset, col: from.col + colOffset }
      if (this.isValidPosition(to)) {
        const target = this.getPiece(to)
        if (!target || target.color !== piece.color) {
          moves.push(to)
        }
      }
    })

    return moves
  }

  wouldBeInCheck(from: Position, to: Position, color: PieceColor): boolean {
    // Simular movimento
    const originalPiece = this.getPiece(from)
    const capturedPiece = this.getPiece(to)

    this.board[to.row][to.col] = originalPiece
    this.board[from.row][from.col] = null

    const inCheck = this.isKingInCheck(color)

    // Desfazer movimento
    this.board[from.row][from.col] = originalPiece
    this.board[to.row][to.col] = capturedPiece

    return inCheck
  }

  isKingInCheck(color: PieceColor): boolean {
    // Encontrar posição do rei
    let kingPos: Position | null = null
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col]
        if (piece && piece.type === "king" && piece.color === color) {
          kingPos = { row, col }
          break
        }
      }
      if (kingPos) break
    }

    if (!kingPos) return false

    // Verificar se alguma peça inimiga pode capturar o rei
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col]
        if (piece && piece.color !== color) {
          const moves = this.getPossibleMovesWithoutCheckValidation({ row, col })
          if (moves.some((move) => move.row === kingPos!.row && move.col === kingPos!.col)) {
            return true
          }
        }
      }
    }

    return false
  }

  getPossibleMovesWithoutCheckValidation(from: Position): Position[] {
    const piece = this.getPiece(from)
    if (!piece) return []

    switch (piece.type) {
      case "pawn":
        return this.getPawnMoves(from, piece)
      case "knight":
        return this.getKnightMoves(from, piece)
      case "bishop":
        return this.getBishopMoves(from, piece)
      case "rook":
        return this.getRookMoves(from, piece)
      case "queen":
        return this.getQueenMoves(from, piece)
      case "king":
        return this.getKingMoves(from, piece)
      default:
        return []
    }
  }

  makeMove(from: Position, to: Position): boolean {
    if (!this.isValidMove(from, to)) return false

    const piece = this.getPiece(from)!
    const capturedPiece = this.getPiece(to)

    // Fazer o movimento
    this.board[to.row][to.col] = { ...piece, hasMoved: true }
    this.board[from.row][from.col] = null

    // Registrar movimento
    this.moveHistory.push({
      from,
      to,
      piece,
      capturedPiece: capturedPiece || undefined,
    })

    // Trocar turno
    this.currentTurn = this.currentTurn === "white" ? "black" : "white"

    // Verificar xeque e xeque-mate
    this.isCheck = this.isKingInCheck(this.currentTurn)
    this.isCheckmate = this.isCheck && !this.hasLegalMoves(this.currentTurn)
    this.isStalemate = !this.isCheck && !this.hasLegalMoves(this.currentTurn)

    return true
  }

  hasLegalMoves(color: PieceColor): boolean {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col]
        if (piece && piece.color === color) {
          const moves = this.getPossibleMoves({ row, col })
          if (moves.length > 0) return true
        }
      }
    }
    return false
  }

  reset(): void {
    this.board = this.initializeBoard()
    this.currentTurn = "white"
    this.moveHistory = []
    this.isCheck = false
    this.isCheckmate = false
    this.isStalemate = false
  }
}
