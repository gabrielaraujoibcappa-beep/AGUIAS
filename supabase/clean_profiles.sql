-- Clean up orphaned profiles that might be blocking new user creation
delete from public.profiles where email = 'mentor_admin@vibe.com';
delete from public.profiles where email = 'mentor2@vibe.com';
delete from public.profiles where email = 'mentor@vibe.com';
