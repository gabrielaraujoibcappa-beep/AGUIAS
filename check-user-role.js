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

async function checkUserRole() {
    // Get all users to help debug
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('❌ Error fetching profiles:', error.message);
        return;
    }

    console.log('\n📋 Todos os usuários no sistema:\n');
    console.log('─'.repeat(80));

    profiles.forEach((profile, index) => {
        console.log(`${index + 1}. ${profile.full_name || 'Sem nome'}`);
        console.log(`   Email: ${profile.email}`);
        console.log(`   Role: ${profile.role || 'NÃO DEFINIDO'}`);
        console.log(`   ID: ${profile.id}`);
        console.log('─'.repeat(80));
    });

    const mentors = profiles.filter(p => p.role === 'mentor');
    const students = profiles.filter(p => p.role === 'student');
    const noRole = profiles.filter(p => !p.role);

    console.log('\n📊 Resumo:');
    console.log(`   Total de usuários: ${profiles.length}`);
    console.log(`   Mentores: ${mentors.length}`);
    console.log(`   Alunos: ${students.length}`);
    console.log(`   Sem role definido: ${noRole.length}`);

    if (noRole.length > 0) {
        console.log('\n⚠️  ATENÇÃO: Existem usuários sem role definido!');
        console.log('   Esses usuários não conseguirão acessar páginas protegidas.\n');
    }
}

checkUserRole();
