-- 1. Update profiles table constraint to allow 'admin' role
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('mentor', 'student', 'admin'));

-- 2. Create Policy: Admins can view all profiles
create policy "Admins can view all profiles"
  on public.profiles for select
  using ( 
    auth.uid() in (
      select id from public.profiles where role = 'admin'
    )
  );

-- 3. Create Policy: Admins can update any profile (to promote/demote)
create policy "Admins can update any profile"
  on public.profiles for update
  using ( 
    auth.uid() in (
      select id from public.profiles where role = 'admin'
    )
  );

-- 4. Create Policy: Admins can view all relationships
create policy "Admins can view all relationships"
  on public.relationships for select
  using ( 
    auth.uid() in (
      select id from public.profiles where role = 'admin'
    )
  );

-- 5. Create Policy: Admins can insert relationships
create policy "Admins can insert relationships"
  on public.relationships for insert
  with check ( 
    auth.uid() in (
      select id from public.profiles where role = 'admin'
    )
  );

-- 6. Create Policy: Admins can delete relationships
create policy "Admins can delete relationships"
  on public.relationships for delete
  using ( 
    auth.uid() in (
      select id from public.profiles where role = 'admin'
    )
  );
