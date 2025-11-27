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

async function testInsert() {
    console.log('Logging in...');
    const { data: { user }, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'dev@vibe.com',
        password: 'developer123'
    });

    if (loginError) {
        console.error('Login failed:', loginError.message);
        return;
    }

    console.log('Attempting insert...');
    const { data, error } = await supabase.from('checkins').insert({
        student_id: user.id,
        month_year: '2023-11-01',
        month_summary: 'Test summary',
        revenue: 1000.00,
        confidence_level: 8
    }).select();

    if (error) {
        console.error('Insert failed:', JSON.stringify(error, null, 2));
    } else {
        console.log('✅ Insert successful!', data);
    }
}

testInsert();
