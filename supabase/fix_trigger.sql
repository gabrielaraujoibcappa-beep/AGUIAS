-- Drop the trigger first to be safe
drop trigger if exists on_auth_user_created on auth.users;

-- Recreate the function with robust logic and SECURITY DEFINER
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'full_name', 'New User'),
    coalesce(new.raw_user_meta_data->>'avatar_url', null),
    'student' -- Default to student, we update to mentor later
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name;
    
  return new;
end;
$$ language plpgsql security definer;

-- Recreate the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
