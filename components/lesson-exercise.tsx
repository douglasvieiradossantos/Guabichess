"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChessEngine } from "@/lib/chess/engine"
import { Chessboard } from "@/components/chess/chessboard"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, Lightbulb } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface LessonExerciseProps {
  lessonId: string
  courseId: string
  fenInicial: string
  movimentosCorretos: string
  dicas: string
  nextLessonId?: string
}

export function LessonExercise({
  lessonId,
  courseId,
  fenInicial,
  movimentosCorretos,
  dicas,
  nextLessonId,
}: LessonExerciseProps) {
  const [engine] = useState(() => {
    const eng = new ChessEngine()
    if (fenInicial) {
      eng.loadFromFEN(fenInicial)
    }
    return eng
  })
  const [showHint, setShowHint] = useState(false)
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const hints = dicas ? JSON.parse(dicas) : []
  const correctMoves = movimentosCorretos ? JSON.parse(movimentosCorretos) : []

  const handleMove = () => {
    // Verificar se o movimento foi correto
    const lastMove = engine.moveHistory[engine.moveHistory.length - 1]

    if (!lastMove) return

    // Verificar se o movimento corresponde ao esperado
    const isCorrect = correctMoves.some(
      (move: any) =>
        move.from.row === lastMove.from.row &&
        move.from.col === lastMove.from.col &&
        move.to.row === lastMove.to.row &&
        move.to.col === lastMove.to.col,
    )

    if (isCorrect) {
      setStatus("success")
      setMessage("Excelente! Você resolveu o exercício corretamente!")
      handleComplete()
    } else {
      setStatus("error")
      setMessage("Movimento incorreto. Tente novamente!")
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Marcar lição como concluída
      await supabase.from("lesson_progress").upsert(
        {
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" },
      )

      // Navegar para próxima lição após 2 segundos
      setTimeout(() => {
        if (nextLessonId) {
          router.push(`/cursos/${courseId}/licao/${nextLessonId}`)
        } else {
          router.push(`/cursos/${courseId}`)
        }
      }, 2000)
    } catch (error) {
      console.error("Erro ao completar exercício:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetExercise = () => {
    engine.loadFromFEN(fenInicial)
    setStatus("pending")
    setMessage("")
    setShowHint(false)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Tabuleiro */}
      <Card>
        <CardHeader>
          <CardTitle>Tabuleiro de Exercício</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Chessboard engine={engine} onMove={handleMove} />

          {status === "success" && (
            <Alert className="border-green-500 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-600">{message}</AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert className="border-red-500 bg-red-500/10">
              <XCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-600">{message}</AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Button onClick={resetExercise} variant="outline" className="w-full bg-transparent">
              Tentar Novamente
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Dicas e Instruções */}
      <Card>
        <CardHeader>
          <CardTitle>Instruções</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Objetivo:</h3>
            <p className="text-muted-foreground">Encontre o melhor movimento nesta posição.</p>
          </div>

          {hints.length > 0 && (
            <div>
              <Button variant="outline" onClick={() => setShowHint(!showHint)} className="mb-2 w-full">
                <Lightbulb className="mr-2 h-4 w-4" />
                {showHint ? "Esconder Dicas" : "Ver Dicas"}
              </Button>

              {showHint && (
                <div className="space-y-2">
                  {hints.map((hint: string, index: number) => (
                    <Alert key={index}>
                      <Lightbulb className="h-4 w-4" />
                      <AlertDescription>{hint}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-2">Status:</h3>
            <div className="flex items-center gap-2">
              {status === "pending" && <span className="text-muted-foreground">Aguardando seu movimento...</span>}
              {status === "success" && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Exercício Concluído!</span>
                </div>
              )}
              {status === "error" && (
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">Tente novamente</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
