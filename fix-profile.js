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

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixProfile() {
    console.log('Logging in as dev@vibe.com...');
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'dev@vibe.com',
        password: 'developer123'
    });

    if (error) {
        console.error('Login failed:', error.message);
        return;
    }

    console.log('Logged in. User ID:', data.user.id);
    console.log('Upserting profile...');

    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: data.user.id,
            email: 'dev@vibe.com',
            full_name: 'Developer User',
            role: 'student',
            avatar_url: 'https://github.com/shadcn.png'
        });

    if (profileError) {
        console.error('Error creating profile:', profileError);
    } else {
        console.log('✅ Profile created successfully!');
    }
}

fixProfile();
