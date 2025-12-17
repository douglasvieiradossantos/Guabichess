import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, Circle, PlayCircle, FileText, Video, Target } from "lucide-react"

const tipoIcons: Record<string, any> = {
  video: Video,
  texto: FileText,
  exercicio: Target,
  quiz: Circle,
}

export default async function CursoDetalhePage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirect=/cursos")
  }

  const { id } = await params

  // Buscar informações do curso
  const { data: course } = await supabase.from("courses").select("*").eq("id", id).single()

  if (!course) {
    redirect("/cursos")
  }

  // Buscar lições do curso
  const { data: lessons } = await supabase.from("lessons").select("*").eq("course_id", id).order("ordem")

  // Buscar progresso do usuário nas lições
  const { data: lessonProgress } = await supabase
    .from("lesson_progress")
    .select("lesson_id, completed")
    .eq("user_id", user.id)

  const completedMap = new Map(lessonProgress?.map((p) => [p.lesson_id, p.completed]) || [])

  // Calcular progresso total
  const totalLessons = lessons?.length || 0
  const completedLessons = lessons?.filter((l) => completedMap.get(l.id))?.length || 0
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  // Atualizar ou criar progresso do curso
  await supabase.from("course_progress").upsert(
    {
      user_id: user.id,
      course_id: id,
      progress_percentage: progressPercentage,
      last_accessed: new Date().toISOString(),
    },
    { onConflict: "user_id,course_id" },
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/cursos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar aos Cursos
          </Link>
        </Button>

        {/* Header do Curso */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between mb-2">
              <div>
                <CardTitle className="text-3xl mb-2 text-balance">{course.titulo}</CardTitle>
                <CardDescription className="text-lg text-pretty">{course.descricao}</CardDescription>
              </div>
              <Badge>{course.duracao_estimada} minutos</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progresso do Curso</span>
                <span className="font-medium">
                  {completedLessons} de {totalLessons} lições ({progressPercentage}%)
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Lista de Lições */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Lições</h2>
          <div className="space-y-4">
            {lessons?.map((lesson, index) => {
              const TipoIcon = tipoIcons[lesson.tipo] || FileText
              const isCompleted = completedMap.get(lesson.id) || false

              return (
                <Card
                  key={lesson.id}
                  className={`hover:shadow-md transition-shadow ${isCompleted ? "border-green-500/50" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {/* Número da Lição */}
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className="h-8 w-8 text-green-500" />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                            {index + 1}
                          </div>
                        )}
                      </div>

                      {/* Informações da Lição */}
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <TipoIcon className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline" className="text-xs">
                            {lesson.tipo}
                          </Badge>
                          {lesson.duracao && (
                            <span className="text-xs text-muted-foreground">{lesson.duracao} min</span>
                          )}
                        </div>
                        <h3 className="font-semibold text-lg mb-1 text-balance">{lesson.titulo}</h3>
                        <p className="text-sm text-muted-foreground text-pretty">{lesson.descricao}</p>
                      </div>

                      {/* Botão de Ação */}
                      <div className="flex-shrink-0">
                        <Button asChild>
                          <Link href={`/cursos/${id}/licao/${lesson.id}`}>
                            {isCompleted ? "Revisar" : "Iniciar"}
                            <PlayCircle className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
