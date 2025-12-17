import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { BookOpen, Target, Crown, Lightbulb, Flag, Zap, ArrowLeft } from "lucide-react"

const iconMap: Record<string, any> = {
  BookOpen,
  Target,
  Crown,
  Lightbulb,
  Flag,
  Zap,
}

const nivelLabels: Record<string, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
}

const nivelColors: Record<string, string> = {
  iniciante: "bg-green-500",
  intermediario: "bg-yellow-500",
  avancado: "bg-red-500",
}

export default async function CursosPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirect=/cursos")
  }

  // Buscar todos os cursos
  const { data: courses } = await supabase.from("courses").select("*").order("ordem")

  // Buscar progresso do usuário
  const { data: progressData } = await supabase
    .from("course_progress")
    .select("course_id, progress_percentage")
    .eq("user_id", user.id)

  const progressMap = new Map(progressData?.map((p) => [p.course_id, p.progress_percentage]) || [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Link>
          </Button>
          <h1 className="text-4xl font-bold mb-2 text-balance">Cursos de Xadrez</h1>
          <p className="text-muted-foreground">Escolha um curso e comece a aprender</p>
        </div>

        {/* Filtros por Nível */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Por Nível</h2>

          {["iniciante", "intermediario", "avancado"].map((nivel) => {
            const cursosDoNivel = courses?.filter((c) => c.nivel === nivel) || []
            if (cursosDoNivel.length === 0) return null

            return (
              <div key={nivel} className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={nivelColors[nivel]}>{nivelLabels[nivel]}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {cursosDoNivel.length} {cursosDoNivel.length === 1 ? "curso" : "cursos"}
                  </span>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {cursosDoNivel.map((course) => {
                    const Icon = iconMap[course.icone || "BookOpen"]
                    const progress = progressMap.get(course.id) || 0

                    return (
                      <Card key={course.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <div
                              className={`p-3 rounded-lg bg-${course.cor || "blue"}-500/10 text-${course.cor || "blue"}-500`}
                            >
                              <Icon className="h-6 w-6" />
                            </div>
                            <Badge variant="outline">{course.duracao_estimada}min</Badge>
                          </div>
                          <CardTitle className="text-balance">{course.titulo}</CardTitle>
                          <CardDescription className="text-pretty">{course.descricao}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {progress > 0 ? (
                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Progresso</span>
                                <span className="font-medium">{progress}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                          ) : (
                            <div className="mb-4 text-sm text-muted-foreground">Ainda não iniciado</div>
                          )}
                          <Button asChild className="w-full">
                            <Link href={`/cursos/${course.id}`}>{progress > 0 ? "Continuar" : "Começar Curso"}</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
