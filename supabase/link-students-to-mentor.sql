-- Script para vincular todos os alunos ao mentor
-- Execute este script no SQL Editor do Supabase

-- 1. Primeiro, vamos ver quantos mentores e alunos temos
SELECT 
  'Mentores' as tipo,
  COUNT(*) as quantidade
FROM profiles 
WHERE role = 'mentor'
UNION ALL
SELECT 
  'Alunos' as tipo,
  COUNT(*) as quantidade
FROM profiles 
WHERE role = 'student';

-- 2. Criar relacionamentos entre o mentor e todos os alunos
-- Isso usa INSERT ... ON CONFLICT para evitar duplicatas
INSERT INTO relationships (mentor_id, student_id)
SELECT 
  m.id as mentor_id,
  s.id as student_id
FROM 
  profiles m
  CROSS JOIN profiles s
WHERE 
  m.role = 'mentor'
  AND s.role = 'student'
ON CONFLICT (mentor_id, student_id) DO NOTHING;

-- 3. Verificar os relacionamentos criados
SELECT 
  m.full_name as mentor,
  m.email as mentor_email,
  s.full_name as aluno,
  s.email as aluno_email,
  r.created_at
FROM relationships r
JOIN profiles m ON r.mentor_id = m.id
JOIN profiles s ON r.student_id = s.id
ORDER BY r.created_at DESC;
