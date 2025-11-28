const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load env vars
const envPath = path.resolve(__dirname, '.env.local');
let env = {};

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            let value = parts.slice(1).join('=').trim();
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            env[key] = value;
        }
    });
} catch (e) {
    console.error('Could not read .env.local');
    process.exit(1);
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function showMentorCredentials() {
    console.log('\n🔐 CREDENCIAIS DE ACESSO - VIBE MENTORIA\n');
    console.log('═'.repeat(60));

    // Fetch mentor users
    const { data: mentors, error } = await supabase
        .from('profiles')
        .select('email, full_name, role')
        .eq('role', 'mentor');

    if (error) {
        console.error('❌ Erro ao buscar mentores:', error.message);
        return;
    }

    if (mentors.length === 0) {
        console.log('⚠️  Nenhum usuário mentor encontrado no banco de dados!');
        console.log('\n💡 Execute o script create-mentor-user.js para criar um mentor.');
        return;
    }

    console.log('\n👨‍🏫 USUÁRIOS MENTOR DISPONÍVEIS:\n');

    mentors.forEach((mentor, index) => {
        console.log(`${index + 1}. ${mentor.full_name || 'Sem nome'}`);
        console.log(`   📧 Email: ${mentor.email}`);

        // Show password if it's the default mentor user
        if (mentor.email === 'mentor_vibe@vibe.com') {
            console.log(`   🔑 Senha: mentor123`);
        } else if (mentor.email === 'gabrielalves6p@gmail.com') {
            console.log(`   🔑 Senha: (sua senha pessoal)`);
        } else {
            console.log(`   🔑 Senha: (verifique com o administrador)`);
        }
        console.log('');
    });

    console.log('═'.repeat(60));
    console.log('\n📝 INSTRUÇÕES PARA ACESSAR O PAINEL DO MENTOR:\n');
    console.log('1. Faça LOGOUT da conta atual');
    console.log('2. Faça LOGIN com uma das credenciais de mentor acima');
    console.log('3. Acesse a rota /mentor');
    console.log('4. Você verá o "Painel do Mentor" com estatísticas e alunos\n');

    // Fetch student users for reference
    const { data: students } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('role', 'student')
        .limit(3);

    if (students && students.length > 0) {
        console.log('═'.repeat(60));
        console.log('\n👨‍🎓 USUÁRIOS ALUNO (para referência):\n');
        students.forEach((student, index) => {
            console.log(`${index + 1}. ${student.full_name || 'Sem nome'}`);
            console.log(`   📧 Email: ${student.email}`);
            if (student.email === 'dev@vibe.com') {
                console.log(`   🔑 Senha: developer123`);
            }
            console.log('');
        });
    }
}

showMentorCredentials();
