const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')
const path = require('path')

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing environment variables!')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testCheckinInsert() {
    console.log('🧪 Testando inserção de check-in...\n')

    try {
        // 1. Login como estudante
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: 'dev@vibe.com',
            password: 'developer123'
        })

        if (authError) {
            console.error('❌ Erro no login:', authError.message)
            return
        }

        console.log('✅ Login bem-sucedido')
        console.log(`   Usuário: ${authData.user.email}`)
        console.log(`   ID: ${authData.user.id}\n`)

        // 2. Tentar inserir um check-in de teste
        const testCheckin = {
            student_id: authData.user.id,
            month_year: '2025-11-01',
            month_summary: 'Teste de check-in',
            revenue: 5000,
            fixed_expenses: 1000,
            variable_expenses: 500,
            profit: 3500,
            sales_count: 10,
            posts_instagram: 15,
            stories_instagram: 30,
            videos_posted: 5,
            daily_interactions: 50,
            content_calendar_used: true,
            action_plan_status: '100%',
            next_month_goals: 'Aumentar vendas',
            next_month_revenue_goal: 6000,
            confidence_level: 8,
            hours_dedicated_daily: 6,
            traffic_invested: false,
            ai_prompts_used: false
        }

        console.log('📝 Tentando inserir check-in...')
        const { data: insertData, error: insertError } = await supabase
            .from('checkins')
            .insert(testCheckin)
            .select()

        if (insertError) {
            console.error('\n❌ ERRO AO INSERIR:')
            console.error('   Código:', insertError.code)
            console.error('   Mensagem:', insertError.message)
            console.error('   Detalhes:', insertError.details)
            console.error('   Dica:', insertError.hint)
            console.error('\n   Objeto completo:', JSON.stringify(insertError, null, 2))
            return
        }

        console.log('\n✅ CHECK-IN INSERIDO COM SUCESSO!')
        console.log('   ID:', insertData[0].id)
        console.log('   Mês/Ano:', insertData[0].month_year)
        console.log('   Faturamento:', insertData[0].revenue)

        // 3. Verificar se o check-in foi realmente salvo
        const { data: checkData, error: checkError } = await supabase
            .from('checkins')
            .select('*')
            .eq('id', insertData[0].id)
            .single()

        if (checkError) {
            console.error('\n⚠️  Erro ao verificar:', checkError.message)
        } else {
            console.log('\n✅ Verificação: Check-in encontrado no banco!')
        }

    } catch (error) {
        console.error('\n❌ Erro inesperado:', error)
    }
}

testCheckinInsert()
