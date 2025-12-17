"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface LessonContentProps {
  content: string
  lessonId: string
  courseId: string
  nextLessonId?: string
}

export function LessonContent({ content, lessonId, courseId, nextLessonId }: LessonContentProps) {
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

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

      setCompleted(true)

      // Navegar para próxima lição ou voltar ao curso
      setTimeout(() => {
        if (nextLessonId) {
          router.push(`/cursos/${courseId}/licao/${nextLessonId}`)
        } else {
          router.push(`/cursos/${courseId}`)
        }
      }, 1500)
    } catch (error) {
      console.error("Erro ao completar lição:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-8">
          <div
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br />") }}
          />
        </CardContent>
      </Card>

      <div className="flex justify-center">
        {completed ? (
          <div className="flex items-center gap-2 text-green-600 text-lg font-medium">
            <CheckCircle className="h-6 w-6" />
            Lição Concluída!
          </div>
        ) : (
          <Button size="lg" onClick={handleComplete} disabled={loading}>
            {loading ? "Salvando..." : "Marcar como Concluída"}
          </Button>
        )}
      </div>
    </div>
  )
}
