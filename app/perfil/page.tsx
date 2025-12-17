import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Calendar, Award } from "lucide-react"
import { LogoutButton } from "@/components/logout-button"
import { ProfileForm } from "@/components/profile-form"

export default async function PerfilPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirect=/perfil")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", user.id).single()

  const { data: puzzleStats } = await supabase.from("puzzle_progress").select("score").eq("user_id", user.id).single()

  const { count: totalGames } = await supabase
    .from("game_history")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const totalPuzzleScore = puzzleStats?.score || 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
            <p className="text-gray-600">Gerencie suas informações pessoais</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Coluna Esquerda - Avatar e Info Básica */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {user.email?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle>{profile?.full_name || "Aluno"}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Membro desde {new Date(user.created_at).toLocaleDateString("pt-BR")}</span>
                </div>
                <LogoutButton />
              </CardContent>
            </Card>

            {/* Estatísticas Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Pontos Puzzles</span>
                  <span className="font-bold text-primary">{totalPuzzleScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Partidas Jogadas</span>
                  <span className="font-bold text-primary">{totalGames || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Nível</span>
                  <span className="font-bold text-accent">
                    {totalPuzzleScore > 1000 ? "Avançado" : totalPuzzleScore > 500 ? "Intermediário" : "Iniciante"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita - Formulário de Edição */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Atualize suas informações de perfil</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm fullName={profile?.full_name} bio={profile?.bio} email={user.email || ""} />

              <div className="mt-8 pt-8 border-t">
                <h3 className="font-semibold mb-4 text-destructive">Zona de Perigo</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ações irreversíveis que afetam permanentemente sua conta
                </p>
                <Button variant="destructive" size="sm" disabled>
                  Excluir Conta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
