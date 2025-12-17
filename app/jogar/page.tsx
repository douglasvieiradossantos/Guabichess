"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ChessEngine } from "@/lib/chess/engine"
import { Chessboard } from "@/components/chess/chessboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Crown, RotateCcw, Home, Trophy, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function JogarPage() {
  const [engine] = useState(() => new ChessEngine())
  const [gameState, setGameState] = useState({
    currentTurn: "white" as "white" | "black",
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    moveCount: 0,
  })
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }
      setUser(user)
    }
    getUser()
  }, [router])

  const handleMove = () => {
    setGameState({
      currentTurn: engine.currentTurn,
      isCheck: engine.isCheck,
      isCheckmate: engine.isCheckmate,
      isStalemate: engine.isStalemate,
      moveCount: engine.moveHistory.length,
    })
  }

  const handleReset = () => {
    engine.reset()
    setGameState({
      currentTurn: "white",
      isCheck: false,
      isCheckmate: false,
      isStalemate: false,
      moveCount: 0,
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Crown className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-primary">
              <Crown className="h-6 w-6" />
              XadrezMestre
            </Link>
            <Button asChild variant="ghost">
              <Link href="/dashboard">
                <Home className="h-5 w-5 mr-2" />
                Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 text-balance">Jogar Xadrez</h1>
            <p className="text-muted-foreground">Pratique suas habilidades no tabuleiro</p>
          </div>

          <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-start">
            {/* Painel de informações */}
            <div className="space-y-4 lg:order-2">
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Partida</CardTitle>
                  <CardDescription>Acompanhe o jogo em tempo real</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Turno atual:</span>
                    <span className="font-bold capitalize">
                      {gameState.currentTurn === "white" ? "Brancas" : "Pretas"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Jogadas:</span>
                    <span className="font-bold">{gameState.moveCount}</span>
                  </div>

                  {gameState.isCheck && !gameState.isCheckmate && (
                    <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-semibold">Xeque!</span>
                    </div>
                  )}

                  {gameState.isCheckmate && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                      <Trophy className="h-5 w-5" />
                      <span className="font-semibold">
                        Xeque-mate! {gameState.currentTurn === "white" ? "Pretas" : "Brancas"} vencem!
                      </span>
                    </div>
                  )}

                  {gameState.isStalemate && (
                    <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-semibold">Empate por afogamento!</span>
                    </div>
                  )}

                  <Button onClick={handleReset} variant="outline" className="w-full bg-transparent">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reiniciar Partida
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Como Jogar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>1. Clique em uma peça para selecioná-la</p>
                  <p>2. Os movimentos possíveis serão destacados</p>
                  <p>3. Clique no destino para mover a peça</p>
                  <p>4. As brancas sempre começam</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabuleiro */}
            <div className="flex justify-center lg:justify-start lg:order-1">
              <Chessboard engine={engine} onMove={handleMove} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
