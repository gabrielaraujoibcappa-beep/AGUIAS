-- 🛠️ FERRAMENTAS ADMINISTRATIVAS (Rodar no SQL Editor do Supabase)

-- 1. PROMOVER UM USUÁRIO A MENTOR
-- Substitua 'email_do_mentor@exemplo.com' pelo email real
UPDATE public.profiles
SET role = 'mentor'
WHERE email = 'email_do_mentor@exemplo.com';

-- 2. VINCULAR UM ALUNO A UM MENTOR
-- Substitua os emails abaixo pelos reais
DO $$
DECLARE
    v_mentor_email text := 'mentor_vibe@vibe.com'; -- Email do Mentor
    v_student_email text := 'aluno@exemplo.com';   -- Email do Aluno
    v_mentor_id uuid;
    v_student_id uuid;
BEGIN
    -- Busca ID do Mentor
    SELECT id INTO v_mentor_id FROM public.profiles WHERE email = v_mentor_email;
    
    -- Busca ID do Aluno
    SELECT id INTO v_student_id FROM public.profiles WHERE email = v_student_email;

    IF v_mentor_id IS NOT NULL AND v_student_id IS NOT NULL THEN
        -- Cria o vínculo
        INSERT INTO public.relationships (mentor_id, student_id)
        VALUES (v_mentor_id, v_student_id)
        ON CONFLICT (mentor_id, student_id) DO NOTHING;
        
        RAISE NOTICE 'Sucesso! % vinculado a %', v_student_email, v_mentor_email;
    ELSE
        RAISE NOTICE 'Erro: Mentor ou Aluno não encontrado.';
    END IF;
END $$;
