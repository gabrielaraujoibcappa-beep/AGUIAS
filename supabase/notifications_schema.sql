-- Create notifications table
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  message text not null,
  link text,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.notifications enable row level security;

-- Policies
-- Users can see their own notifications
create policy "Users can see their own notifications"
  on public.notifications for select
  using ( auth.uid() = user_id );

-- Users can update their own notifications (mark as read)
create policy "Users can update their own notifications"
  on public.notifications for update
  using ( auth.uid() = user_id );

-- Mentors (or system) can insert notifications
-- For simplicity, allowing any authenticated user to insert for now, 
-- but in production this should be restricted to system/functions or specific roles.
create policy "System can insert notifications"
  on public.notifications for insert
  with check ( true ); 
