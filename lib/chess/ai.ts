import type { ChessEngine, Position, Move } from "./engine"

export type Difficulty = "facil" | "medio" | "dificil"

export class ChessAI {
  difficulty: Difficulty
  engine: ChessEngine

  constructor(difficulty: Difficulty, engine: ChessEngine) {
    this.difficulty = difficulty
    this.engine = engine
  }

  // Obter melhor movimento baseado na dificuldade
  getBestMove(): Move | null {
    const allMoves = this.getAllPossibleMoves()
    if (allMoves.length === 0) return null

    switch (this.difficulty) {
      case "facil":
        return this.getRandomMove(allMoves)
      case "medio":
        return this.getMediumMove(allMoves)
      case "dificil":
        return this.getDifficultMove(allMoves)
      default:
        return this.getRandomMove(allMoves)
    }
  }

  // Obter todos os movimentos possíveis para a cor atual
  private getAllPossibleMoves(): Move[] {
    const moves: Move[] = []

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.engine.getPiece({ row, col })
        if (piece && piece.color === this.engine.currentTurn) {
          const possibleMoves = this.engine.getPossibleMoves({ row, col })
          possibleMoves.forEach((to) => {
            moves.push({
              from: { row, col },
              to,
              piece,
              capturedPiece: this.engine.getPiece(to) || undefined,
            })
          })
        }
      }
    }

    return moves
  }

  // Modo Fácil: movimento aleatório
  private getRandomMove(moves: Move[]): Move {
    return moves[Math.floor(Math.random() * moves.length)]
  }

  // Modo Médio: prioriza capturas e proteção
  private getMediumMove(moves: Move[]): Move {
    // Priorizar capturas
    const captures = moves.filter((move) => move.capturedPiece)
    if (captures.length > 0 && Math.random() > 0.3) {
      // 70% de chance de escolher captura
      return captures[Math.floor(Math.random() * captures.length)]
    }

    // Caso contrário, movimento aleatório com pequena avaliação
    const scoredMoves = moves.map((move) => ({
      move,
      score: this.evaluateMove(move),
    }))

    scoredMoves.sort((a, b) => b.score - a.score)

    // Escolher entre os top 5 movimentos
    const topMoves = scoredMoves.slice(0, Math.min(5, scoredMoves.length))
    return topMoves[Math.floor(Math.random() * topMoves.length)].move
  }

  // Modo Difícil: usa minimax simplificado
  private getDifficultMove(moves: Move[]): Move {
    let bestMove = moves[0]
    let bestScore = Number.NEGATIVE_INFINITY

    for (const move of moves) {
      const score = this.evaluateMoveWithLookahead(move, 2)
      if (score > bestScore) {
        bestScore = score
        bestMove = move
      }
    }

    return bestMove
  }

  // Avaliar movimento com profundidade (minimax simplificado)
  private evaluateMoveWithLookahead(move: Move, depth: number): number {
    // Fazer movimento temporário
    const originalPiece = this.engine.getPiece(move.from)
    const capturedPiece = this.engine.getPiece(move.to)

    this.engine.board[move.to.row][move.to.col] = originalPiece
    this.engine.board[move.from.row][move.from.col] = null

    let score = this.evaluatePosition()

    // Se ainda há profundidade, avaliar resposta do oponente
    if (depth > 0) {
      const currentTurn = this.engine.currentTurn
      this.engine.currentTurn = currentTurn === "white" ? "black" : "white"

      const opponentMoves = this.getAllPossibleMoves()
      let worstScore = Number.POSITIVE_INFINITY

      for (const oppMove of opponentMoves.slice(0, 5)) {
        // Limitar a 5 movimentos
        const oppScore = this.evaluateMoveWithLookahead(oppMove, depth - 1)
        if (oppScore < worstScore) {
          worstScore = oppScore
        }
      }

      score = worstScore

      this.engine.currentTurn = currentTurn
    }

    // Desfazer movimento
    this.engine.board[move.from.row][move.from.col] = originalPiece
    this.engine.board[move.to.row][move.to.col] = capturedPiece

    return score
  }

  // Avaliar posição atual do tabuleiro
  private evaluatePosition(): number {
    let score = 0

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.engine.getPiece({ row, col })
        if (!piece) continue

        const pieceValue = this.getPieceValue(piece.type)
        const positionBonus = this.getPositionBonus(piece.type, row, col, piece.color)

        if (piece.color === this.engine.currentTurn) {
          score += pieceValue + positionBonus
        } else {
          score -= pieceValue + positionBonus
        }
      }
    }

    return score
  }

  // Avaliar movimento simples
  private evaluateMove(move: Move): number {
    let score = 0

    // Captura vale mais
    if (move.capturedPiece) {
      score += this.getPieceValue(move.capturedPiece.type) * 10
    }

    // Movimento de peça valiosa para o centro
    const centerBonus = this.getCenterControlBonus(move.to)
    score += centerBonus

    // Desenvolvimento de peças
    if (move.piece.type === "knight" || move.piece.type === "bishop") {
      score += 5
    }

    return score
  }

  // Valores das peças
  private getPieceValue(type: string): number {
    const values: Record<string, number> = {
      pawn: 10,
      knight: 30,
      bishop: 30,
      rook: 50,
      queen: 90,
      king: 900,
    }
    return values[type] || 0
  }

  // Bônus de posição
  private getPositionBonus(type: string, row: number, col: number, color: string): number {
    // Bonificação por controle do centro
    const centerDistance = Math.abs(3.5 - row) + Math.abs(3.5 - col)
    const centerBonus = (7 - centerDistance) * 0.5

    // Bonificação específica por tipo de peça
    if (type === "pawn") {
      // Peões avançados valem mais
      const advancement = color === "white" ? 7 - row : row
      return advancement * 0.5 + centerBonus
    }

    if (type === "knight" || type === "bishop") {
      // Cavalos e bispos no centro
      return centerBonus * 2
    }

    return centerBonus
  }

  // Bônus por controle do centro
  private getCenterControlBonus(pos: Position): number {
    const centerSquares = [
      { row: 3, col: 3 },
      { row: 3, col: 4 },
      { row: 4, col: 3 },
      { row: 4, col: 4 },
    ]

    const isCenter = centerSquares.some((square) => square.row === pos.row && square.col === pos.col)
    return isCenter ? 10 : 0
  }
}
