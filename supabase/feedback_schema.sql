-- Create checkin_feedback table
create table public.checkin_feedback (
  id uuid default uuid_generate_v4() primary key,
  checkin_id uuid references public.checkins(id) not null,
  mentor_id uuid references public.profiles(id) not null,
  content text not null,
  guidelines text[], -- Array of strings for "Novas Diretrizes"
  read_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.checkin_feedback enable row level security;

-- Policies
-- Mentors can insert feedback
create policy "Mentors can insert feedback"
  on public.checkin_feedback for insert
  with check ( auth.uid() = mentor_id );

-- Mentors can view their own feedback
create policy "Mentors can view their own feedback"
  on public.checkin_feedback for select
  using ( auth.uid() = mentor_id );

-- Students can view feedback for their checkins
create policy "Students can view feedback for their checkins"
  on public.checkin_feedback for select
  using ( 
    exists (
      select 1 from public.checkins
      where id = public.checkin_feedback.checkin_id
      and student_id = auth.uid()
    )
  );

-- Students can update read status (update read_at)
create policy "Students can mark feedback as read"
  on public.checkin_feedback for update
  using ( 
    exists (
      select 1 from public.checkins
      where id = public.checkin_feedback.checkin_id
      and student_id = auth.uid()
    )
  );
