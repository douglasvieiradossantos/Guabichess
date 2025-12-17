import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { HeaderUserMenu } from "@/components/header-user-menu"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="text-4xl transition-transform group-hover:scale-110">♔</div>
              <div>
                <div className="text-2xl font-bold text-foreground">XadrezMestre</div>
                <div className="text-xs text-muted-foreground">Aprenda e jogue online</div>
              </div>
            </Link>
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="#estudar" className="text-foreground hover:text-primary transition-colors font-medium">
                Estudar em Casa
              </Link>
              <Link href="#material" className="text-foreground hover:text-primary transition-colors font-medium">
                Material para Professores e Treinadores
              </Link>
              <Link href="#jogar" className="text-foreground hover:text-primary transition-colors font-medium">
                Jogar Agora
              </Link>
              <Link href="#teste" className="text-foreground hover:text-primary transition-colors font-medium">
                Teste de Nível
              </Link>
              <div className="flex items-center gap-3">
                <HeaderUserMenu />
              </div>
            </nav>
          </div>
        </div>
      </header>

      <section className="py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Aprenda Xadrez Online de Forma Interativa
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              Cursos online e interativos para todas as idades. Recomendado para iniciantes, amadores, jogadores de
              clube e crianças. Lições gratuitas e premium de grandes mestres.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-10">
                Começar Grátis
              </Button>
              <Button size="lg" variant="outline" className="text-base px-10 bg-transparent">
                Ver Cursos
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t">
              {[
                { number: "5M+", label: "Estudantes" },
                { number: "15.000+", label: "Escolas" },
                { number: "50M+", label: "Partidas" },
                { number: "100+", label: "Lições" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20" id="estudar">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="overflow-hidden border-2 hover:shadow-xl transition-shadow">
              <div className="bg-chart-1/10 p-8 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Estudar em Casa</h3>
              </div>
              <CardContent className="p-8">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl mt-0.5">•</span>
                    <span className="text-muted-foreground leading-relaxed">
                      Cursos online e interativos para idades de 5 a 99 anos
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl mt-0.5">•</span>
                    <span className="text-muted-foreground leading-relaxed">
                      Recomendado para iniciantes absolutos, amadores, jogadores de clube e crianças
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl mt-0.5">•</span>
                    <span className="text-muted-foreground leading-relaxed">
                      Lições gratuitas e premium de grandes mestres
                    </span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-chart-1 hover:bg-chart-1/90">Explorar Lições</Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-2 hover:shadow-xl transition-shadow" id="material">
              <div className="bg-chart-2/10 p-8 text-center">
                <div className="text-6xl mb-4">👨‍🏫</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Material para Professores e Treinadores</h3>
              </div>
              <CardContent className="p-8">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl mt-0.5">•</span>
                    <span className="text-muted-foreground leading-relaxed">
                      Planos de aula completos com exercícios e atividades prontas
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl mt-0.5">•</span>
                    <span className="text-muted-foreground leading-relaxed">
                      Material didático descargável para impressão e uso em sala
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl mt-0.5">•</span>
                    <span className="text-muted-foreground leading-relaxed">
                      Recursos de avaliação e acompanhamento de progresso dos alunos
                    </span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-chart-2 hover:bg-chart-2/90">Acessar Material</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/10" id="jogar">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Múltiplas Formas de Aprender e Jogar
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Desenvolva suas habilidades através de diferentes métodos de aprendizado
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              {
                title: "Jogar Online",
                description: "Jogue partidas ao vivo com jogadores do seu nível em todo o mundo",
                icon: "♟️",
              },
              {
                title: "Treinamento Tático",
                description: "Resolva milhares de quebra-cabeças estruturados para progresso gradual",
                icon: "🎯",
              },
              {
                title: "Vídeo Aulas",
                description: "Assista lições de grandes mestres e melhore sua compreensão",
                icon: "🎬",
              },
              {
                title: "Análise de Partidas",
                description: "Analise suas partidas com ferramentas poderosas e aprenda com erros",
                icon: "📊",
              },
            ].map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all group border">
                <CardContent className="p-6">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4 text-balance">
            O Que Nossos Usuários Dizem
          </h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            Depoimentos reais de alunos que transformaram seu jogo de xadrez
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "William",
                role: "Professor de Física",
                location: "Escócia",
                quote:
                  "Estou muito impressionado com suas excelentes lições de xadrez. É como ter um ótimo e gentil professor ao seu lado. Posso sentir que estou progredindo bem e amando ainda mais o xadrez.",
              },
              {
                name: "Brian",
                role: "Chefe de Divisão",
                location: "Maryland, EUA",
                quote:
                  "Eu realmente amo trabalhar nas minhas lições e isso me traz muita satisfação! Sempre quis aprender a jogar xadrez de verdade. Encontrar o programa XadrezMestre foi exatamente o que eu precisava!",
              },
              {
                name: "Erick",
                role: "Gerente Financeiro",
                location: "Panamá",
                quote:
                  "XadrezMestre é o primeiro curso que sigo regularmente e após terminar o Curso para Iniciantes, consigo vencer o programa de xadrez Nível 1.",
              },
              {
                name: "Damir",
                role: "Engenheiro (aposentado)",
                location: "Canadá",
                quote:
                  "O treinamento tático neste site é bem estruturado para progresso gradual. O feedback fornecido é altamente motivador. Simplesmente não conseguia parar de resolver!",
              },
              {
                name: "Ana Paula",
                role: "Estudante",
                location: "São Paulo, Brasil",
                quote:
                  "Os vídeos são muito bem explicados e as lições interativas tornam tudo mais fácil de entender. Já melhorei muito em poucos meses!",
              },
              {
                name: "Carlos",
                role: "Professor de Matemática",
                location: "Rio de Janeiro, Brasil",
                quote:
                  "Uso o XadrezMestre com meus alunos na escola. A plataforma é perfeita para ensinar lógica e estratégia através do xadrez.",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-6 italic leading-relaxed text-balance">
                    "{testimonial.quote}"
                  </p>
                  <div className="border-t pt-4">
                    <p className="font-bold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-muted-foreground mt-1">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground" id="teste">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">Quão Bom Você É no Xadrez?</h2>
            <p className="text-xl mb-8 opacity-95 leading-relaxed">
              Faça nosso teste de nível agora mesmo e descubra qual curso é ideal para você. Completamente grátis e sem
              compromisso!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-10 py-6">
                Fazer Teste de Nível
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-6 bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10"
              >
                Ver Todos os Cursos
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="text-3xl">♔</div>
                <div>
                  <div className="text-xl font-bold text-foreground">XadrezMestre</div>
                  <div className="text-xs text-muted-foreground">Aprenda e jogue online</div>
                </div>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Plataforma completa de ensino de xadrez online com cursos interativos, lições de grandes mestres e
                ferramentas para todas as idades.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Aprender</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Cursos para Iniciantes
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Cursos Intermediários
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Cursos Avançados
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Vídeo Aulas
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Praticar</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Jogar Online
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Quebra-Cabeças
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Treinamento Tático
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Torneios
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Central de Ajuda
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Para Escolas
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Para Pais
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 XadrezMestre. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-primary transition-colors">
                Termos de Uso
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Política de Privacidade
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
