"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Crown, ArrowLeft, RotateCcw, Trophy, Target, Clock } from "lucide-react"
import Link from "next/link"
import { ChessEngine } from "@/lib/chess/engine"
import { ChessAI, type Difficulty } from "@/lib/chess/ai"
import { Chessboard } from "@/components/chess/chessboard"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"

export default function JogarComputadorPage() {
  const [engine, setEngine] = useState<ChessEngine | null>(null)
  const [ai, setAI] = useState<ChessAI | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty>("medio")
  const [gameStarted, setGameStarted] = useState(false)
  const [moveCount, setMoveCount] = useState(0)
  const [thinkingTime, setThinkingTime] = useState(0)
  const [isThinking, setIsThinking] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = "/login?redirect=/jogar-computador"
        return
      }

      setIsAuthenticated(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return

    const newEngine = new ChessEngine()
    setEngine(newEngine)
    setAI(new ChessAI(difficulty, newEngine))
  }, [isAuthenticated])

  const startGame = () => {
    if (!engine) return
    engine.reset()
    setAI(new ChessAI(difficulty, engine))
    setGameStarted(true)
    setMoveCount(0)
    setThinkingTime(0)
  }

  const handlePlayerMove = () => {
    if (!engine || !ai || !gameStarted) return

    setMoveCount((prev) => prev + 1)

    // Verificar se o jogo terminou
    if (engine.isCheckmate || engine.isStalemate) {
      return
    }

    // IA joga após o jogador
    if (engine.currentTurn === "black") {
      setIsThinking(true)
      const startTime = Date.now()

      // Adicionar delay realista baseado na dificuldade
      const thinkingDelay = difficulty === "facil" ? 500 : difficulty === "medio" ? 1000 : 1500

      setTimeout(() => {
        const aiMove = ai.getBestMove()
        if (aiMove) {
          engine.makeMove(aiMove.from, aiMove.to)
          setMoveCount((prev) => prev + 1)
        }
        const endTime = Date.now()
        setThinkingTime(endTime - startTime)
        setIsThinking(false)
      }, thinkingDelay)
    }
  }

  const resetGame = () => {
    if (!engine) return
    engine.reset()
    if (ai) {
      ai.engine = engine
    }
    setGameStarted(false)
    setMoveCount(0)
    setThinkingTime(0)
  }

  const changeDifficulty = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty)
    if (engine) {
      setAI(new ChessAI(newDifficulty, engine))
    }
  }

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case "facil":
        return "bg-green-500"
      case "medio":
        return "bg-yellow-500"
      case "dificil":
        return "bg-red-500"
    }
  }

  const getGameStatus = () => {
    if (!engine || !gameStarted) return null

    if (engine.isCheckmate) {
      return (
        <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500">
          <Trophy className="h-5 w-5 mr-2" />
          {engine.currentTurn === "white" ? "Computador Venceu!" : "Você Venceu!"}
        </Badge>
      )
    }

    if (engine.isStalemate) {
      return (
        <Badge variant="outline" className="text-lg px-4 py-2">
          Empate!
        </Badge>
      )
    }

    if (engine.isCheck) {
      return (
        <Badge variant="destructive" className="text-lg px-4 py-2">
          <Target className="h-5 w-5 mr-2" />
          Xeque!
        </Badge>
      )
    }

    if (isThinking) {
      return (
        <Badge variant="secondary" className="text-lg px-4 py-2 animate-pulse">
          <Clock className="h-5 w-5 mr-2 animate-spin" />
          Computador pensando...
        </Badge>
      )
    }

    return (
      <Badge variant="outline" className="text-lg px-4 py-2">
        {engine.currentTurn === "white" ? "Sua vez (Brancas)" : "Vez do Computador (Pretas)"}
      </Badge>
    )
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Crown className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Verificando acesso...</p>
        </div>
      </div>
    )
  }

  if (!engine) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Crown className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Carregando tabuleiro...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:text-primary/80 transition">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Voltar ao Dashboard</span>
            </Link>

            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
              <Crown className="h-6 w-6" />
              XadrezMestre
            </Link>

            <div className="w-32" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 text-balance">Jogar Contra o Computador</h1>
            <p className="text-muted-foreground text-lg">Teste suas habilidades contra a IA</p>
          </div>

          <div className="grid lg:grid-cols-[1fr_350px] gap-8">
            {/* Tabuleiro */}
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-4">{getGameStatus()}</div>

              <Chessboard engine={engine} onMove={handlePlayerMove} />

              <div className="flex gap-4">
                {!gameStarted ? (
                  <Button size="lg" onClick={startGame} className="gap-2">
                    <Crown className="h-5 w-5" />
                    Iniciar Partida
                  </Button>
                ) : (
                  <Button size="lg" variant="outline" onClick={resetGame} className="gap-2 bg-transparent">
                    <RotateCcw className="h-5 w-5" />
                    Nova Partida
                  </Button>
                )}
              </div>
            </div>

            {/* Painel Lateral */}
            <div className="space-y-6">
              {/* Configurações */}
              <Card>
                <CardHeader>
                  <CardTitle>Configurações</CardTitle>
                  <CardDescription>Ajuste a dificuldade do computador</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Dificuldade</label>
                    <Select value={difficulty} onValueChange={(value) => changeDifficulty(value as Difficulty)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facil">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getDifficultyColor("facil")}`} />
                            Fácil
                          </div>
                        </SelectItem>
                        <SelectItem value="medio">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getDifficultyColor("medio")}`} />
                            Médio
                          </div>
                        </SelectItem>
                        <SelectItem value="dificil">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getDifficultyColor("dificil")}`} />
                            Difícil
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 border-t space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nível Selecionado:</span>
                      <span className="font-medium capitalize">{difficulty}</span>
                    </div>
                    {difficulty === "facil" && (
                      <p className="text-xs text-muted-foreground">
                        A IA faz movimentos aleatórios, ideal para iniciantes
                      </p>
                    )}
                    {difficulty === "medio" && (
                      <p className="text-xs text-muted-foreground">
                        A IA prioriza capturas e proteção, desafio moderado
                      </p>
                    )}
                    {difficulty === "dificil" && (
                      <p className="text-xs text-muted-foreground">
                        A IA usa estratégia avançada, para jogadores experientes
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Estatísticas */}
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas da Partida</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Movimentos:</span>
                    <span className="text-2xl font-bold">{moveCount}</span>
                  </div>

                  {thinkingTime > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Último tempo de resposta:</span>
                      <span className="font-medium">{(thinkingTime / 1000).toFixed(1)}s</span>
                    </div>
                  )}

                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Você joga com:</span>
                      <span className="font-medium">Peças Brancas ♔</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Computador joga com:</span>
                      <span className="font-medium">Peças Pretas ♚</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dicas */}
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-base">Dicas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Clique em uma peça para ver os movimentos possíveis</li>
                    <li>• Controle o centro do tabuleiro</li>
                    <li>• Desenvolva suas peças rapidamente</li>
                    <li>• Proteja seu rei com roque</li>
                    <li>• Pense antes de mover!</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
