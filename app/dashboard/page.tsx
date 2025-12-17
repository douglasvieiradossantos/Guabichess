import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { Crown, BookOpen, Trophy, Target } from "lucide-react"
import { LogoutButton } from "@/components/logout-button"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: coursesInProgress } = await supabase
    .from("course_progress")
    .select("course_id, progress_percentage, courses(titulo, descricao)")
    .eq("user_id", user.id)
    .gt("progress_percentage", 0)
    .lt("progress_percentage", 100)
    .limit(3)

  const userName = profile?.nome || user.email?.split("@")[0] || "Usuário"
  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
              <Crown className="h-6 w-6" />
              ClubedeXadrezGuabiruba
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-balance">Bem-vindo de volta, {userName.split(" ")[0]}!</h1>
          <p className="text-muted-foreground">Continue seu treinamento de xadrez</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cursos em Andamento</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">2 novos esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Puzzles Resolvidos</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">+12 hoje</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Conquistas</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Próximo em 5 puzzles</p>
            </CardContent>
          </Card>
        </div>

        {/* Course Cards */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Seus Cursos</h2>
            <Button asChild variant="outline">
              <Link href="/cursos">Ver Todos os Cursos</Link>
            </Button>
          </div>

          {coursesInProgress && coursesInProgress.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {coursesInProgress.map((item: any) => (
                <Card key={item.course_id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-balance">{item.courses.titulo}</CardTitle>
                    <CardDescription className="text-pretty">{item.courses.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="font-medium">{item.progress_percentage}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${item.progress_percentage}%` }}
                        />
                      </div>
                      <Button asChild className="w-full mt-4">
                        <Link href={`/cursos/${item.course_id}`}>Continuar</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Nenhum curso em andamento</h3>
                <p className="text-muted-foreground mb-4">Comece um curso para aparecer aqui</p>
                <Button asChild>
                  <Link href="/cursos">Explorar Cursos</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3 mt-8">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">Praticar Livre</h3>
                  <p className="text-muted-foreground">Jogue livremente no tabuleiro</p>
                </div>
                <Button asChild size="lg" className="gap-2">
                  <Link href="/jogar">
                    <Crown className="h-5 w-5" />
                    Jogar
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">Vs Computador</h3>
                  <p className="text-muted-foreground">Desafie a IA em 3 níveis</p>
                </div>
                <Button asChild size="lg" variant="outline" className="gap-2 bg-transparent">
                  <Link href="/jogar-computador">
                    <Trophy className="h-5 w-5" />
                    Jogar
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-amber-500/10 to-amber-500/5 border-amber-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">Resolver Puzzles</h3>
                  <p className="text-muted-foreground">Melhore suas táticas</p>
                </div>
                <Button asChild size="lg" variant="outline" className="gap-2 bg-transparent">
                  <Link href="/puzzles">
                    <Target className="h-5 w-5" />
                    Puzzles
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
