-- 📧 CONFIRMAR EMAIL DO MENTOR (Rodar no SQL Editor do Supabase)

-- Este comando confirma manualmente o email do mentor para permitir o login
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email = 'mentor_vibe@vibe.com';

-- Opcional: Confirmar também o aluno dev@vibe.com se necessário
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email = 'dev@vibe.com';
