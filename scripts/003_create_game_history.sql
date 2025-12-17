-- Criar tabela de histórico de partidas
create table if not exists public.game_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  opponent text not null,
  result text not null check (result in ('vitória', 'derrota', 'empate')),
  moves_count integer,
  duration integer,
  difficulty text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar Row Level Security
alter table public.game_history enable row level security;

-- Políticas RLS para game_history
create policy "Usuários podem ver seu próprio histórico"
  on public.game_history for select
  using (auth.uid() = user_id);

create policy "Usuários podem inserir seu próprio histórico"
  on public.game_history for insert
  with check (auth.uid() = user_id);
