import { z } from "zod"

export const checkinSchema = z.object({
  // 1. Seleção do Período
  month: z.string().min(1, "Selecione o mês"),
  year: z.string().min(1, "Selecione o ano"),

  // 2. Reflexão Inicial
  month_summary: z.string().min(10, "Faça um resumo de pelo menos 10 caracteres"),
  challenges_financial: z.string().optional(),
  challenges_time: z.string().optional(),
  challenges_processes: z.string().optional(),

  // 3. Sua Saúde Financeira
  revenue: z.coerce.number().min(0, "O valor não pode ser negativo"),
  fixed_expenses: z.coerce.number().min(0),
  variable_expenses: z.coerce.number().min(0),
  profit: z.coerce.number(),
  sales_count: z.coerce.number().int().min(0),

  // 4. Seu Alcance e Conversão
  traffic_invested: z.boolean().default(false),
  traffic_amount: z.coerce.number().min(0).optional(),
  traffic_platforms: z.array(z.string()).optional(),
  active_campaigns: z.coerce.number().int().min(0).optional(),
  leads_sales_traffic: z.coerce.number().int().min(0).optional(),

  // 5. Sua Voz Online
  posts_instagram: z.coerce.number().int().min(0),
  stories_instagram: z.coerce.number().int().min(0),
  videos_posted: z.coerce.number().int().min(0),
  daily_interactions: z.coerce.number().int().min(0),
  content_calendar_used: z.boolean().default(false),

  // 6. Seu Plano em Ação
  action_plan_status: z.enum(["100%", "Parcialmente", "Não realizei"]),
  action_plan_execution_details: z.string().optional(),
  next_month_goals: z.string().min(5, "Defina pelo menos uma meta"),
  next_month_revenue_goal: z.coerce.number().min(0),
  confidence_level: z.coerce.number().min(1).max(10),

  // 7. Perguntas Adicionais & Produtividade
  hours_dedicated_daily: z.coerce.number().min(0).max(24),
  tools_used: z.array(z.string()).optional(),
  biggest_learning: z.string().optional(),

  // 8. Sua Parceria com IA
  ai_prompts_used: z.boolean().default(false),
  ai_areas: z.array(z.string()).optional(),
  ai_gains: z.string().optional(),

  // 9. Apoio e Desenvolvimento
  skills_to_develop: z.string().optional(),
  demotivators: z.string().optional(),
  external_factors: z.string().optional(),
  whatsapp_participation: z.string().optional(),
  support_needed: z.string().optional(),
  feedback: z.string().optional(),
}).superRefine((data, ctx) => {
  // Validação Condicional: Tráfego
  if (data.traffic_invested) {
    if (!data.traffic_amount || data.traffic_amount <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe o valor investido",
        path: ["traffic_amount"],
      })
    }
    if (!data.traffic_platforms || data.traffic_platforms.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione pelo menos uma plataforma",
        path: ["traffic_platforms"],
      })
    }
  }

  // Validação Condicional: IA
  if (data.ai_prompts_used) {
    if (!data.ai_areas || data.ai_areas.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione as áreas onde usou IA",
        path: ["ai_areas"],
      })
    }
    if (!data.ai_gains || data.ai_gains.length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Descreva os ganhos com IA",
        path: ["ai_gains"],
      })
    }
  }
})

export type CheckinFormData = z.infer<typeof checkinSchema>
