"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { Crown, LogOut, Trophy, Star, Zap, ArrowRight, Target, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { puzzles, type ChessPuzzle } from "@/lib/chess/puzzles"
import { PuzzleBoard } from "@/components/chess/puzzle-board"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function PuzzlesPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPuzzle, setSelectedPuzzle] = useState<ChessPuzzle | null>(null)
  const [totalPoints, setTotalPoints] = useState(0)
  const [solvedPuzzles, setSolvedPuzzles] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<"todos" | "iniciante" | "intermediário" | "avançado">("todos")
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
      setLoading(false)

      const savedPoints = localStorage.getItem("puzzlePoints")
      const savedSolved = localStorage.getItem("solvedPuzzles")
      if (savedPoints) setTotalPoints(Number.parseInt(savedPoints))
      if (savedSolved) setSolvedPuzzles(new Set(JSON.parse(savedSolved)))
    }
    getUser()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const handlePuzzleComplete = (success: boolean, points: number) => {
    if (success && selectedPuzzle) {
      const newTotal = totalPoints + points
      const newSolved = new Set(solvedPuzzles).add(selectedPuzzle.id)

      setTotalPoints(newTotal)
      setSolvedPuzzles(newSolved)

      localStorage.setItem("puzzlePoints", newTotal.toString())
      localStorage.setItem("solvedPuzzles", JSON.stringify(Array.from(newSolved)))

      setTimeout(() => {
        setSelectedPuzzle(null)
      }, 2000)
    }
  }

  const selectPuzzle = (puzzle: ChessPuzzle) => {
    setSelectedPuzzle(puzzle)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const filteredPuzzles = filter === "todos" ? puzzles : puzzles.filter((p) => p.difficulty === filter)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Target className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Carregando puzzles...</p>
        </div>
      </div>
    )
  }

  const initials =
    user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() ||
    user?.email?.[0].toUpperCase() ||
    "U"

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-primary">
              <Crown className="h-6 w-6" />
              XadrezMestre
            </Link>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="font-bold text-primary">{totalPoints} pts</span>
              </div>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
                </Avatar>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-balance">Puzzles Táticos</h1>
          <p className="text-muted-foreground">Resolva puzzles para melhorar suas habilidades táticas</p>

          <div className="grid gap-4 md:grid-cols-3 mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pontos Totais</p>
                    <p className="text-2xl font-bold text-primary">{totalPoints}</p>
                  </div>
                  <Trophy className="h-10 w-10 text-primary/20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Puzzles Resolvidos</p>
                    <p className="text-2xl font-bold">{solvedPuzzles.size}</p>
                  </div>
                  <Target className="h-10 w-10 text-green-500/20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                    <p className="text-2xl font-bold">
                      {puzzles.length > 0 ? Math.round((solvedPuzzles.size / puzzles.length) * 100) : 0}%
                    </p>
                  </div>
                  <Star className="h-10 w-10 text-yellow-500/20" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Área do Puzzle Ativo */}
        {selectedPuzzle && (
          <Card className="mb-8 border-2 border-primary">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{selectedPuzzle.name}</CardTitle>
                  <CardDescription className="text-base mt-2">{selectedPuzzle.description}</CardDescription>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge
                    variant={
                      selectedPuzzle.difficulty === "iniciante"
                        ? "default"
                        : selectedPuzzle.difficulty === "intermediário"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {selectedPuzzle.difficulty}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Zap className="h-3 w-3" />
                    {selectedPuzzle.points} pts
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <PuzzleBoard puzzle={selectedPuzzle} onComplete={handlePuzzleComplete} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filtros */}
        {!selectedPuzzle && (
          <div className="mb-6">
            <div className="flex gap-2 flex-wrap">
              <Button variant={filter === "todos" ? "default" : "outline"} onClick={() => setFilter("todos")} size="sm">
                Todos
              </Button>
              <Button
                variant={filter === "iniciante" ? "default" : "outline"}
                onClick={() => setFilter("iniciante")}
                size="sm"
              >
                Iniciante
              </Button>
              <Button
                variant={filter === "intermediário" ? "default" : "outline"}
                onClick={() => setFilter("intermediário")}
                size="sm"
              >
                Intermediário
              </Button>
              <Button
                variant={filter === "avançado" ? "default" : "outline"}
                onClick={() => setFilter("avançado")}
                size="sm"
              >
                Avançado
              </Button>
            </div>
          </div>
        )}

        {/* Lista de Puzzles */}
        {!selectedPuzzle && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPuzzles.map((puzzle) => {
              const isSolved = solvedPuzzles.has(puzzle.id)
              return (
                <Card
                  key={puzzle.id}
                  className={cn(
                    "hover:shadow-lg transition-all cursor-pointer",
                    isSolved && "bg-green-50 dark:bg-green-950/20 border-green-500/50",
                  )}
                  onClick={() => selectPuzzle(puzzle)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg">{puzzle.name}</CardTitle>
                      {isSolved && <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />}
                    </div>
                    <CardDescription>{puzzle.theme}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Badge
                          variant={
                            puzzle.difficulty === "iniciante"
                              ? "default"
                              : puzzle.difficulty === "intermediário"
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-xs"
                        >
                          {puzzle.difficulty}
                        </Badge>
                        <Badge variant="outline" className="gap-1 text-xs">
                          <Zap className="h-3 w-3" />
                          {puzzle.points}
                        </Badge>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
