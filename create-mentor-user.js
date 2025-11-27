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

async function createMentorUser() {
    const email = 'mentor_vibe@vibe.com';
    const password = 'mentor123';
    const studentEmail = 'dev@vibe.com';

    console.log(`Creating mentor: ${email}...`);

    // 1. Sign Up Mentor
    let authUser = null;
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: 'Mentor User',
            }
        }
    });

    if (authError) {
        console.error('❌ Signup failed with error:', authError);
        console.error('Message:', authError.message);

        console.log('Attempting login in case user exists...');
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (loginError) {
            console.error('❌ Login also failed:', loginError.message);
            return;
        }
        console.log('✅ Login successful (user existed).');
        authUser = loginData.user;
    } else {
        authUser = authData.user;
    }

    if (authUser) {
        const mentorId = authUser.id;
        console.log('Mentor auth ID:', mentorId);

        // 2. Create/Update Profile
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: mentorId,
                email: email,
                full_name: 'Mentor User',
                role: 'mentor',
                avatar_url: 'https://github.com/shadcn.png'
            });

        if (profileError) {
            console.error('Error creating mentor profile:', profileError);
            console.error('Error details:', JSON.stringify(profileError, null, 2));
            // Try to just update role if insert failed (maybe it exists but RLS blocks insert?)
            console.log('Trying to update role only...');
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ role: 'mentor' })
                .eq('id', mentorId);

            if (updateError) {
                console.error('Update also failed:', updateError);
            } else {
                console.log('Role updated to mentor successfully.');
            }
        }
        console.log('Mentor profile created.');

        // 3. Find Student ID
        const { data: studentData, error: studentError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', studentEmail)
            .single();

        if (studentError || !studentData) {
            console.error('Could not find student dev@vibe.com to link.');
        } else {
            const studentId = studentData.id;
            console.log('Found student ID:', studentId);

            // 4. Create Relationship
            const { error: relError } = await supabase
                .from('relationships')
                .upsert({
                    mentor_id: mentorId,
                    student_id: studentId
                }, { onConflict: 'mentor_id, student_id' });

            if (relError) {
                console.error('Error creating relationship:', relError.message);
            } else {
                console.log('✅ Relationship created: Mentor <-> Student');
            }
        }

        console.log('\n✅ Mentor Credentials:');
        console.log('Email:', email);
        console.log('Password:', password);

    } else {
        console.log('User creation returned no ID (maybe confirmation pending?)');
    }
}

createMentorUser();
