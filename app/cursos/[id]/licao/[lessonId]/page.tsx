import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { LessonContent } from "@/components/lesson-content"
import { LessonExercise } from "@/components/lesson-exercise"

export default async function LicaoPage({
  params,
}: {
  params: { id: string; lessonId: string }
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { id: courseId, lessonId } = await params

  // Buscar lição
  const { data: lesson } = await supabase.from("lessons").select("*").eq("id", lessonId).single()

  if (!lesson) {
    redirect(`/cursos/${courseId}`)
  }

  // Buscar progresso
  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .single()

  // Buscar próxima lição
  const { data: nextLesson } = await supabase
    .from("lessons")
    .select("id")
    .eq("course_id", courseId)
    .gt("ordem", lesson.ordem)
    .order("ordem")
    .limit(1)
    .single()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <Button asChild variant="ghost">
            <Link href={`/cursos/${courseId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Curso
            </Link>
          </Button>

          {progress?.completed && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Concluída</span>
            </div>
          )}
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl text-balance">{lesson.titulo}</CardTitle>
            <p className="text-muted-foreground text-pretty">{lesson.descricao}</p>
          </CardHeader>
        </Card>

        {/* Conteúdo da Lição */}
        {lesson.tipo === "exercicio" ? (
          <LessonExercise
            lessonId={lessonId}
            courseId={courseId}
            fenInicial={lesson.fen_inicial}
            movimentosCorretos={lesson.movimentos_corretos}
            dicas={lesson.dicas}
            nextLessonId={nextLesson?.id}
          />
        ) : (
          <LessonContent
            content={lesson.conteudo}
            lessonId={lessonId}
            courseId={courseId}
            nextLessonId={nextLesson?.id}
          />
        )}

        {/* Navegação */}
        <div className="mt-8 flex justify-between">
          <Button asChild variant="outline">
            <Link href={`/cursos/${courseId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Lista de Lições
            </Link>
          </Button>

          {nextLesson && (
            <Button asChild>
              <Link href={`/cursos/${courseId}/licao/${nextLesson.id}`}>
                Próxima Lição
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
