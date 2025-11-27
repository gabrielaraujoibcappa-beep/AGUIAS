-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  role text check (role in ('mentor', 'student')) default 'student',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create relationships table (Mentor <-> Student)
create table public.relationships (
  id uuid default uuid_generate_v4() primary key,
  mentor_id uuid references public.profiles(id) not null,
  student_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(mentor_id, student_id)
);

-- Create goals table
create table public.goals (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.profiles(id) not null,
  title text not null,
  status text check (status in ('pending', 'completed')) default 'pending',
  deadline timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create checkins table (The Quiz)
create table public.checkins (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.profiles(id) not null,
  
  -- 1. Seleção do Período
  month_year date not null, -- Stores the first day of the reference month
  
  -- 2. Reflexão Inicial
  month_summary text,
  challenges_financial text,
  challenges_time text,
  challenges_processes text,
  
  -- 3. Sua Saúde Financeira
  revenue decimal(12,2),
  fixed_expenses decimal(12,2),
  variable_expenses decimal(12,2),
  profit decimal(12,2),
  sales_count integer,
  
  -- 4. Seu Alcance e Conversão
  traffic_invested boolean default false,
  traffic_amount decimal(12,2),
  traffic_platforms text[], -- Array of strings e.g. ['Google Ads', 'Meta Ads']
  active_campaigns integer,
  leads_sales_traffic integer,
  
  -- 5. Sua Voz Online
  posts_instagram integer,
  stories_instagram integer,
  videos_posted integer,
  daily_interactions integer,
  content_calendar_used boolean default false,
  
  -- 6. Seu Plano em Ação
  action_plan_status text check (action_plan_status in ('100%', 'Parcialmente', 'Não realizei')),
  action_plan_execution_details text,
  next_month_goals text,
  next_month_revenue_goal decimal(12,2),
  confidence_level integer check (confidence_level between 1 and 10),
  
  -- 7. Perguntas Adicionais & Produtividade
  hours_dedicated_daily integer,
  tools_used text[], -- Array e.g. ['Google Agenda', 'Notion']
  biggest_learning text,
  
  -- 8. Sua Parceria com IA
  ai_prompts_used boolean default false,
  ai_areas text[], -- Array e.g. ['Criação', 'Análise']
  ai_gains text,
  
  -- 9. Apoio e Desenvolvimento
  skills_to_develop text,
  demotivators text,
  external_factors text,
  whatsapp_participation text,
  support_needed text,
  feedback text,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.relationships enable row level security;
alter table public.goals enable row level security;
alter table public.checkins enable row level security;

-- Policies for Profiles
-- Public profiles are viewable by everyone (or just authenticated users, depending on strictness)
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

-- Users can insert their own profile
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

-- Users can update own profile
create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Policies for Relationships
-- Mentors can see their relationships
create policy "Mentors can see their relationships"
  on public.relationships for select
  using ( auth.uid() = mentor_id );

-- Students can see their relationships
create policy "Students can see their relationships"
  on public.relationships for select
  using ( auth.uid() = student_id );

-- Policies for Goals
-- Students can see their own goals
create policy "Students can see their own goals"
  on public.goals for select
  using ( auth.uid() = student_id );

-- Mentors can see goals of their students
create policy "Mentors can see goals of their students"
  on public.goals for select
  using ( 
    exists (
      select 1 from public.relationships
      where mentor_id = auth.uid() and student_id = public.goals.student_id
    )
  );

-- Students can insert/update their own goals
create policy "Students can manage their own goals"
  on public.goals for all
  using ( auth.uid() = student_id );

-- Policies for Checkins
-- Students can see their own checkins
create policy "Students can see their own checkins"
  on public.checkins for select
  using ( auth.uid() = student_id );

-- Mentors can see checkins of their students
create policy "Mentors can see checkins of their students"
  on public.checkins for select
  using ( 
    exists (
      select 1 from public.relationships
      where mentor_id = auth.uid() and student_id = public.checkins.student_id
    )
  );

-- Students can insert their own checkins
create policy "Students can insert their own checkins"
  on public.checkins for insert
  with check ( auth.uid() = student_id );
