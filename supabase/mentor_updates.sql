-- Create mentor_notes table
create table public.mentor_notes (
  id uuid default uuid_generate_v4() primary key,
  mentor_id uuid references public.profiles(id) not null,
  student_id uuid references public.profiles(id) not null,
  note text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.mentor_notes enable row level security;

-- Policies for Mentor Notes
-- Mentors can manage (select, insert, update, delete) their own notes
create policy "Mentors can manage their own notes"
  on public.mentor_notes for all
  using ( auth.uid() = mentor_id );
