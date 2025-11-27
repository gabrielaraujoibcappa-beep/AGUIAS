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

async function verifyTables() {
    console.log('Logging in...');
    const { data: { user }, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'dev@vibe.com',
        password: 'developer123'
    });

    if (loginError) {
        console.error('Login failed:', loginError.message);
        return;
    }

    console.log('Verifying "checkins" table...');
    const { data, error } = await supabase
        .from('checkins')
        .select('count', { count: 'exact', head: true });

    if (error) {
        console.error('Error accessing checkins table:', error);
        console.error('Message:', error.message);
        console.error('Code:', error.code);
        console.error('Hint:', error.hint);
    } else {
        console.log('✅ "checkins" table exists and is accessible.');
    }
}

verifyTables();
