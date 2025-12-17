-- Criar tabela de progresso de puzzles
create table if not exists public.puzzle_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  puzzle_id text not null,
  completed boolean default false,
  moves_taken integer,
  time_taken integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, puzzle_id)
);

-- Habilitar Row Level Security
alter table public.puzzle_progress enable row level security;

-- Políticas RLS para puzzle_progress
create policy "Usuários podem ver seu próprio progresso"
  on public.puzzle_progress for select
  using (auth.uid() = user_id);

create policy "Usuários podem inserir seu próprio progresso"
  on public.puzzle_progress for insert
  with check (auth.uid() = user_id);

create policy "Usuários podem atualizar seu próprio progresso"
  on public.puzzle_progress for update
  using (auth.uid() = user_id);
