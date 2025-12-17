// Banco de dados de puzzles táticos com diferentes níveis

export interface ChessPuzzle {
  id: string
  name: string
  fen: string // Notação FEN para configurar o tabuleiro
  solution: string[] // Sequência de movimentos esperados em notação algebraica
  difficulty: "iniciante" | "intermediário" | "avançado"
  theme: string
  description: string
  points: number
}

export const puzzles: ChessPuzzle[] = [
  // PUZZLES INICIANTES
  {
    id: "puzzle-001",
    name: "Mate em 1 - Básico",
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 1",
    solution: ["Qxf7#"],
    difficulty: "iniciante",
    theme: "Mate em 1",
    description: "Dê xeque-mate em um movimento!",
    points: 50,
  },
  {
    id: "puzzle-002",
    name: "Ganhar a Dama",
    fen: "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 0 1",
    solution: ["Bxf7+", "Kxf7", "Qd5+"],
    difficulty: "iniciante",
    theme: "Ganhar material",
    description: "Force o rei a capturar e ganhe a dama adversária",
    points: 50,
  },
  {
    id: "puzzle-003",
    name: "Garfo com Cavalo",
    fen: "r1bqkb1r/pppp1ppp/2n5/4p3/2BnP3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
    solution: ["Nxe5", "Nxe5", "Bxf7+"],
    difficulty: "iniciante",
    theme: "Garfo",
    description: "Use um garfo para ganhar material",
    points: 50,
  },

  // PUZZLES INTERMEDIÁRIOS
  {
    id: "puzzle-004",
    name: "Mate do Corredor",
    fen: "6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1",
    solution: ["Ra8#"],
    difficulty: "intermediário",
    theme: "Mate em 1",
    description: "Aplique o famoso mate do corredor",
    points: 100,
  },
  {
    id: "puzzle-005",
    name: "Sacrifício de Dama",
    fen: "r1b1kb1r/pppp1ppp/2n2q2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 1",
    solution: ["Bxf7+", "Kxf7", "Ng5+", "Kg8", "Qd5+"],
    difficulty: "intermediário",
    theme: "Sacrifício",
    description: "Sacrifique o bispo para atacar o rei",
    points: 100,
  },
  {
    id: "puzzle-006",
    name: "Ataque Duplo",
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1",
    solution: ["Ng5", "d5", "Qh5", "g6", "Qxc5"],
    difficulty: "intermediário",
    theme: "Ataque duplo",
    description: "Ameace duas peças ao mesmo tempo",
    points: 100,
  },

  // PUZZLES AVANÇADOS
  {
    id: "puzzle-007",
    name: "Mate de Anastasia",
    fen: "5rk1/6pp/8/8/8/8/5PPP/R4RK1 w - - 0 1",
    solution: ["Ra8", "Kh7", "Rf7", "Rg8", "Rxg7#"],
    difficulty: "avançado",
    theme: "Mate em 5",
    description: "Execute o padrão de mate de Anastasia",
    points: 200,
  },
  {
    id: "puzzle-008",
    name: "Combinação Brilhante",
    fen: "r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQR1K1 w - - 0 1",
    solution: ["Bxf7+", "Rxf7", "Ng5", "Rf8", "Qd5+", "Kh8", "Qxc5"],
    difficulty: "avançado",
    theme: "Combinação",
    description: "Uma sequência brilhante para ganhar material",
    points: 200,
  },
  {
    id: "puzzle-009",
    name: "Mate Sufocado",
    fen: "6rk/5Npp/8/8/8/8/5PPP/6K1 w - - 0 1",
    solution: ["Nf6+", "Kh8", "Ng6#"],
    difficulty: "avançado",
    theme: "Mate sufocado",
    description: "O rei é sufocado por suas próprias peças",
    points: 200,
  },
]

// Função para converter FEN em estrutura de tabuleiro
export function fenToBoard(fen: string): (any | null)[][] {
  const board: (any | null)[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null))

  const pieceMap: Record<string, { type: string; color: "white" | "black" }> = {
    p: { type: "pawn", color: "black" },
    r: { type: "rook", color: "black" },
    n: { type: "knight", color: "black" },
    b: { type: "bishop", color: "black" },
    q: { type: "queen", color: "black" },
    k: { type: "king", color: "black" },
    P: { type: "pawn", color: "white" },
    R: { type: "rook", color: "white" },
    N: { type: "knight", color: "white" },
    B: { type: "bishop", color: "white" },
    Q: { type: "queen", color: "white" },
    K: { type: "king", color: "white" },
  }

  const rows = fen.split(" ")[0].split("/")

  rows.forEach((row, rowIndex) => {
    let colIndex = 0
    for (const char of row) {
      if (char >= "1" && char <= "8") {
        colIndex += Number.parseInt(char)
      } else {
        const piece = pieceMap[char]
        if (piece) {
          board[rowIndex][colIndex] = { ...piece, hasMoved: true }
        }
        colIndex++
      }
    }
  })

  return board
}

// Função para obter puzzles por dificuldade
export function getPuzzlesByDifficulty(difficulty: ChessPuzzle["difficulty"]): ChessPuzzle[] {
  return puzzles.filter((p) => p.difficulty === difficulty)
}

// Função para obter puzzle aleatório
export function getRandomPuzzle(difficulty?: ChessPuzzle["difficulty"]): ChessPuzzle {
  const filteredPuzzles = difficulty ? getPuzzlesByDifficulty(difficulty) : puzzles
  const randomIndex = Math.floor(Math.random() * filteredPuzzles.length)
  return filteredPuzzles[randomIndex]
}
