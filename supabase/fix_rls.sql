-- Fix Infinite Recursion in RLS Policies

-- 1. Create a function to check if the user is an admin
-- SECURITY DEFINER means it runs with the privileges of the creator (bypassing RLS)
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- 2. Update Profiles Policies to use the function

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles" on public.profiles for select using ( is_admin() );

drop policy if exists "Admins can update any profile" on public.profiles;
create policy "Admins can update any profile" on public.profiles for update using ( is_admin() );

-- 3. Update Relationships Policies

drop policy if exists "Admins can view all relationships" on public.relationships;
create policy "Admins can view all relationships" on public.relationships for select using ( is_admin() );

drop policy if exists "Admins can insert relationships" on public.relationships;
create policy "Admins can insert relationships" on public.relationships for insert with check ( is_admin() );

drop policy if exists "Admins can delete relationships" on public.relationships;
create policy "Admins can delete relationships" on public.relationships for delete using ( is_admin() );
