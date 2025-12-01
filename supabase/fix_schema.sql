-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Tables (IF NOT EXISTS)

create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  role text check (role in ('mentor', 'student', 'admin')) default 'student',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.relationships (
  id uuid default uuid_generate_v4() primary key,
  mentor_id uuid references public.profiles(id) not null,
  student_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(mentor_id, student_id)
);

create table if not exists public.goals (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.profiles(id) not null,
  title text not null,
  status text check (status in ('pending', 'completed')) default 'pending',
  deadline timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.checkins (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.profiles(id) not null,
  
  month_year date not null,
  month_summary text,
  challenges_financial text,
  challenges_time text,
  challenges_processes text,
  
  revenue decimal(12,2),
  fixed_expenses decimal(12,2),
  variable_expenses decimal(12,2),
  profit decimal(12,2),
  sales_count integer,
  
  traffic_invested boolean default false,
  traffic_amount decimal(12,2),
  traffic_platforms text[],
  active_campaigns integer,
  leads_sales_traffic integer,
  
  posts_instagram integer,
  stories_instagram integer,
  videos_posted integer,
  daily_interactions integer,
  content_calendar_used boolean default false,
  
  action_plan_status text check (action_plan_status in ('100%', 'Parcialmente', 'Não realizei')),
  action_plan_execution_details text,
  next_month_goals text,
  next_month_revenue_goal decimal(12,2),
  confidence_level integer check (confidence_level between 1 and 10),
  
  hours_dedicated_daily integer,
  tools_used text[],
  biggest_learning text,
  
  ai_prompts_used boolean default false,
  ai_areas text[],
  ai_gains text,
  
  skills_to_develop text,
  demotivators text,
  external_factors text,
  whatsapp_participation text,
  support_needed text,
  feedback text,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable RLS
alter table public.profiles enable row level security;
alter table public.relationships enable row level security;
alter table public.goals enable row level security;
alter table public.checkins enable row level security;

-- 3. Policies (Drop and Recreate to be safe)

-- Profiles
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone" on public.profiles for select using ( true );

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile" on public.profiles for insert with check ( auth.uid() = id );

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using ( auth.uid() = id );

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles" on public.profiles for select using ( auth.uid() in (select id from public.profiles where role = 'admin') );

drop policy if exists "Admins can update any profile" on public.profiles;
create policy "Admins can update any profile" on public.profiles for update using ( auth.uid() in (select id from public.profiles where role = 'admin') );

-- Relationships
drop policy if exists "Mentors can see their relationships" on public.relationships;
create policy "Mentors can see their relationships" on public.relationships for select using ( auth.uid() = mentor_id );

drop policy if exists "Students can see their relationships" on public.relationships;
create policy "Students can see their relationships" on public.relationships for select using ( auth.uid() = student_id );

drop policy if exists "Admins can view all relationships" on public.relationships;
create policy "Admins can view all relationships" on public.relationships for select using ( auth.uid() in (select id from public.profiles where role = 'admin') );

drop policy if exists "Admins can insert relationships" on public.relationships;
create policy "Admins can insert relationships" on public.relationships for insert with check ( auth.uid() in (select id from public.profiles where role = 'admin') );

drop policy if exists "Admins can delete relationships" on public.relationships;
create policy "Admins can delete relationships" on public.relationships for delete using ( auth.uid() in (select id from public.profiles where role = 'admin') );

-- Goals
drop policy if exists "Students can see their own goals" on public.goals;
create policy "Students can see their own goals" on public.goals for select using ( auth.uid() = student_id );

drop policy if exists "Mentors can see goals of their students" on public.goals;
create policy "Mentors can see goals of their students" on public.goals for select using ( exists (select 1 from public.relationships where mentor_id = auth.uid() and student_id = public.goals.student_id) );

drop policy if exists "Students can manage their own goals" on public.goals;
create policy "Students can manage their own goals" on public.goals for all using ( auth.uid() = student_id );

-- Checkins
drop policy if exists "Students can see their own checkins" on public.checkins;
create policy "Students can see their own checkins" on public.checkins for select using ( auth.uid() = student_id );

drop policy if exists "Mentors can see checkins of their students" on public.checkins;
create policy "Mentors can see checkins of their students" on public.checkins for select using ( exists (select 1 from public.relationships where mentor_id = auth.uid() and student_id = public.checkins.student_id) );

drop policy if exists "Students can insert their own checkins" on public.checkins;
create policy "Students can insert their own checkins" on public.checkins for insert with check ( auth.uid() = student_id );
