-- Criar tabelas para o sistema de cursos

-- Tabela de cursos
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  nivel TEXT NOT NULL CHECK (nivel IN ('iniciante', 'intermediario', 'avancado')),
  categoria TEXT NOT NULL CHECK (categoria IN ('aberturas', 'taticas', 'meio-jogo', 'finais')),
  duracao_estimada INTEGER, -- em minutos
  ordem INTEGER DEFAULT 0,
  icone TEXT,
  cor TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabela de lições
CREATE TABLE IF NOT EXISTS lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  conteudo TEXT, -- Conteúdo em markdown ou HTML
  tipo TEXT NOT NULL CHECK (tipo IN ('video', 'texto', 'exercicio', 'quiz')),
  ordem INTEGER DEFAULT 0,
  duracao INTEGER, -- em minutos
  fen_inicial TEXT, -- Posição FEN se for exercício
  movimentos_corretos TEXT, -- JSON com sequência de movimentos corretos
  dicas TEXT, -- JSON com dicas para o aluno
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabela de progresso do usuário nos cursos
CREATE TABLE IF NOT EXISTS course_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, course_id)
);

-- Tabela de progresso do usuário nas lições
CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  attempts INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  UNIQUE(user_id, lesson_id)
);

-- Habilitar RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para courses (todos podem ler)
CREATE POLICY "Courses são visíveis para todos" ON courses
  FOR SELECT USING (true);

-- Políticas de RLS para lessons (todos podem ler)
CREATE POLICY "Lessons são visíveis para todos" ON lessons
  FOR SELECT USING (true);

-- Políticas de RLS para course_progress
CREATE POLICY "Usuários podem ver seu próprio progresso" ON course_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seu próprio progresso" ON course_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu próprio progresso" ON course_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas de RLS para lesson_progress
CREATE POLICY "Usuários podem ver seu próprio progresso de lições" ON lesson_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seu próprio progresso de lições" ON lesson_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu próprio progresso de lições" ON lesson_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Inserir cursos de exemplo
INSERT INTO courses (titulo, descricao, nivel, categoria, duracao_estimada, ordem, icone, cor) VALUES
('Fundamentos do Xadrez', 'Aprenda as regras básicas e movimentos das peças', 'iniciante', 'taticas', 120, 1, 'BookOpen', 'blue'),
('Táticas Essenciais', 'Domine os padrões táticos fundamentais', 'iniciante', 'taticas', 180, 2, 'Target', 'green'),
('Aberturas para Iniciantes', 'Conheça as principais aberturas e seus objetivos', 'iniciante', 'aberturas', 150, 3, 'Crown', 'purple'),
('Meio-Jogo Estratégico', 'Desenvolva seu planejamento estratégico', 'intermediario', 'meio-jogo', 240, 4, 'Lightbulb', 'amber'),
('Finais de Partida', 'Aprenda a finalizar com precisão', 'intermediario', 'finais', 200, 5, 'Flag', 'red'),
('Táticas Avançadas', 'Combinações complexas e sacrifícios', 'avancado', 'taticas', 300, 6, 'Zap', 'indigo');

-- Inserir lições de exemplo para o curso "Fundamentos do Xadrez"
INSERT INTO lessons (course_id, titulo, descricao, conteudo, tipo, ordem, duracao) 
SELECT id, 'Introdução ao Xadrez', 'História e objetivo do jogo', 
'# Bem-vindo ao Xadrez!

O xadrez é um jogo milenar de estratégia jogado entre dois oponentes em um tabuleiro de 64 casas. O objetivo é dar **xeque-mate** no rei adversário.

## O que você vai aprender:
- Movimentação das peças
- Regras especiais
- Táticas básicas
- Estratégia fundamental

Vamos começar sua jornada no mundo do xadrez!', 
'texto', 1, 10
FROM courses WHERE titulo = 'Fundamentos do Xadrez';

INSERT INTO lessons (course_id, titulo, descricao, conteudo, tipo, ordem, duracao) 
SELECT id, 'Movimento do Peão', 'Como o peão se move e captura', 
'# O Peão

O peão é a peça mais numerosa do tabuleiro. Cada jogador começa com 8 peões.

## Regras de Movimento:
- Move-se **1 casa para frente**
- No primeiro movimento, pode avançar **2 casas**
- Captura na **diagonal** (1 casa)
- **Promoção**: ao chegar na última fileira, vira outra peça (geralmente Dama)

## Regras Especiais:
- **En Passant**: captura especial quando o peão adversário avança 2 casas

O peão pode parecer fraco, mas é a alma do xadrez!', 
'texto', 2, 15
FROM courses WHERE titulo = 'Fundamentos do Xadrez';

INSERT INTO lessons (course_id, titulo, descricao, tipo, ordem, duracao, fen_inicial, movimentos_corretos, dicas) 
SELECT id, 'Exercício: Promovendo o Peão', 'Pratique a promoção do peão', 
'Mova seu peão até a última fileira e promova-o para uma Dama!', 
'exercicio', 3, 5,
'4k3/P7/8/8/8/8/8/4K3 w - - 0 1',
'[{"from": {"row": 1, "col": 0}, "to": {"row": 0, "col": 0}}]',
'["Peões na 7ª fileira estão a um movimento da promoção", "Escolha a Dama na maioria dos casos"]'
FROM courses WHERE titulo = 'Fundamentos do Xadrez';

INSERT INTO lessons (course_id, titulo, descricao, conteudo, tipo, ordem, duracao) 
SELECT id, 'Movimento da Torre', 'Como a torre se move no tabuleiro', 
'# A Torre

A torre é uma peça poderosa que controla linhas e colunas inteiras.

## Regras de Movimento:
- Move-se **horizontalmente** ou **verticalmente**
- Pode mover **qualquer número de casas**
- Não pode pular outras peças
- Captura a peça que estiver em seu caminho

## Dicas Estratégicas:
- Torres são mais fortes em **colunas abertas**
- **Duplicar torres** na mesma coluna é muito poderoso
- Torres protegem peões avançados

Cada jogador começa com 2 torres nos cantos do tabuleiro.', 
'texto', 4, 15
FROM courses WHERE titulo = 'Fundamentos do Xadrez';

INSERT INTO lessons (course_id, titulo, descricao, conteudo, tipo, ordem, duracao) 
SELECT id, 'Movimento do Cavalo', 'O único que pula peças', 
'# O Cavalo

O cavalo é a única peça que pode pular outras peças!

## Regras de Movimento:
- Move-se em **formato de "L"**: 2 casas em uma direção e 1 perpendicular
- Pode **pular** peças (suas ou adversárias)
- Captura a peça no destino final

## Características:
- Muito útil em posições **fechadas**
- **Garfo de cavalo**: ataca duas peças ao mesmo tempo
- De uma casa branca, sempre vai para uma preta (e vice-versa)

O cavalo no centro do tabuleiro controla até 8 casas!', 
'texto', 5, 15
FROM courses WHERE titulo = 'Fundamentos do Xadrez';
