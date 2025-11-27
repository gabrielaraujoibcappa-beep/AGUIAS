import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendFeedbackEmail(to: string, studentName: string, mentorName: string, feedbackPreview: string) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY is not set. Email sending skipped.');
        return;
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Vibe Mentoria <onboarding@resend.dev>', // Use 'onboarding@resend.dev' for testing without a domain
            to: [to],
            subject: `Novo Feedback de ${mentorName}`,
            html: `
                <div style="font-family: sans-serif; color: #333;">
                    <h1>Olá, ${studentName}!</h1>
                    <p>Seu mentor, <strong>${mentorName}</strong>, acabou de enviar um novo feedback sobre o seu check-in.</p>
                    
                    <div style="background-color: #f4f4f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
                        <p style="font-style: italic; color: #555;">"${feedbackPreview}..."</p>
                    </div>

                    <p>Acesse a plataforma para ler o feedback completo e ver as próximas orientações.</p>
                    
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" style="background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        Ver Feedback
                    </a>
                </div>
            `,
        });

        if (error) {
            console.error('Error sending email:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Exception sending email:', error);
        return { success: false, error };
    }
}
