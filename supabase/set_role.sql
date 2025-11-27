-- 👑 DEFINIR PAPEL DO USUÁRIO (Rodar no SQL Editor do Supabase)

-- Atualmente, os papéis aceitos são: 'mentor' ou 'student'.
-- O papel de 'mentor' dá acesso ao Painel Administrativo.

-- 1. Promover para MENTOR (Admin)
UPDATE public.profiles
SET role = 'mentor'
WHERE email = 'seu_email@exemplo.com'; -- <--- COLOQUE O EMAIL AQUI

-- 2. Rebaixar para ALUNO
-- UPDATE public.profiles
-- SET role = 'student'
-- WHERE email = 'seu_email@exemplo.com';
