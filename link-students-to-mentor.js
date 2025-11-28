const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')
const path = require('path')

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing environment variables!')
    console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function linkStudentsToMentor() {
    console.log('🔗 Vinculando alunos ao mentor...\n')

    try {
        // 1. Buscar o mentor
        const { data: mentors, error: mentorError } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'mentor')

        if (mentorError) {
            console.error('❌ Erro ao buscar mentor:', mentorError)
            return
        }

        if (!mentors || mentors.length === 0) {
            console.error('❌ Nenhum mentor encontrado!')
            console.log('💡 Execute create-mentor-user.js primeiro para criar um mentor.')
            return
        }

        const mentor = mentors[0]
        console.log(`✅ Mentor encontrado: ${mentor.full_name} (${mentor.email})`)
        console.log(`   ID: ${mentor.id}\n`)

        // 2. Buscar todos os alunos
        const { data: students, error: studentsError } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'student')

        if (studentsError) {
            console.error('❌ Erro ao buscar alunos:', studentsError)
            return
        }

        if (!students || students.length === 0) {
            console.log('⚠️  Nenhum aluno encontrado para vincular.')
            return
        }

        console.log(`📋 ${students.length} aluno(s) encontrado(s):\n`)

        // 3. Criar relacionamentos
        let created = 0
        let existing = 0
        let errors = 0

        for (const student of students) {
            console.log(`   Processando: ${student.full_name} (${student.email})`)

            // Verificar se já existe relacionamento
            const { data: existingRel } = await supabase
                .from('relationships')
                .select('*')
                .eq('mentor_id', mentor.id)
                .eq('student_id', student.id)
                .single()

            if (existingRel) {
                console.log(`   ✓ Relacionamento já existe`)
                existing++
                continue
            }

            // Criar novo relacionamento
            const { error: insertError } = await supabase
                .from('relationships')
                .insert({
                    mentor_id: mentor.id,
                    student_id: student.id
                })

            if (insertError) {
                console.log(`   ❌ Erro ao criar relacionamento:`, insertError.message)
                errors++
            } else {
                console.log(`   ✅ Relacionamento criado com sucesso!`)
                created++
            }
        }

        console.log('\n' + '='.repeat(60))
        console.log('📊 RESUMO:')
        console.log('='.repeat(60))
        console.log(`✅ Relacionamentos criados: ${created}`)
        console.log(`ℹ️  Relacionamentos já existentes: ${existing}`)
        if (errors > 0) {
            console.log(`❌ Erros: ${errors}`)
        }
        console.log('='.repeat(60))

        if (created > 0) {
            console.log('\n🎉 Agora os check-ins dos alunos devem aparecer na tela do mentor!')
        }

    } catch (error) {
        console.error('❌ Erro inesperado:', error)
    }
}

// Executar
linkStudentsToMentor()
