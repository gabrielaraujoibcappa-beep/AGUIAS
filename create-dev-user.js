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
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

console.log('URL:', supabaseUrl.substring(0, 15) + '...');
console.log('Key:', supabaseKey.substring(0, 5) + '...');

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
    }
});

async function createDevUser() {
    const email = 'dev@vibe.com';
    const password = 'developer123';

    console.log(`Creating user: ${email}...`);

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: 'Developer User',
            }
        }
    });

    if (error) {
        console.error('Error creating user:', error.message);
        return;
    }

    if (data.user) {
        console.log('User created/fetched successfully!');
        console.log('ID:', data.user.id);

        // Create profile
        // Note: If RLS is strict, this might fail if we are not logged in as the user.
        // But signUp returns a session, so the client should be authenticated as the new user.

        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: data.user.id,
                email: email,
                full_name: 'Developer User',
                role: 'student',
                avatar_url: 'https://github.com/shadcn.png'
            });

        if (profileError) {
            console.error('Error creating/updating profile:', profileError.message);
        } else {
            console.log('Profile created/updated successfully.');
        }

        console.log('\n✅ Login Credentials:');
        console.log('Email:', email);
        console.log('Password:', password);
    }
}

createDevUser();
