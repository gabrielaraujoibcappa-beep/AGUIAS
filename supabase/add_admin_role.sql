-- 🔓 LIBERAR PAPEL 'ADMIN' (Rodar no SQL Editor do Supabase)

-- 1. Remove a restrição antiga que só aceitava 'mentor' ou 'student'
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_role_check;

-- 2. Adiciona a nova restrição aceitando 'admin'
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_role_check
CHECK (role IN ('mentor', 'student', 'admin'));

-- 3. (Opcional) Se quiser atualizar o usuário que deu erro agora:
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE email = 'gabrielalves6p@gmail.com';
