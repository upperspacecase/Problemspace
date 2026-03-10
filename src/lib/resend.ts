import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMagicLinkEmail(email: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const magicLink = `${baseUrl}/auth/verify?token=${token}`;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "ProblemSpace <onboarding@resend.dev>",
    to: email,
    subject: "Your login link for ProblemSpace",
    html: `
      <div style="font-family: 'DM Sans', system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
        <h1 style="font-family: 'Space Grotesk', system-ui, sans-serif; font-size: 24px; font-weight: 700; color: #F1F5F9; margin-bottom: 8px;">
          ProblemSpace
        </h1>
        <p style="color: #94A3B8; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
          Click the link below to sign in. This link expires in 15 minutes.
        </p>
        <a href="${magicLink}" style="display: inline-block; background-color: #818CF8; color: white; padding: 12px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; text-decoration: none;">
          Sign in to ProblemSpace
        </a>
        <p style="color: #64748B; font-size: 13px; line-height: 1.6; margin-top: 24px;">
          If you didn't request this, you can safely ignore this email.
        </p>
        <p style="color: #64748B; font-size: 13px; margin-top: 16px;">
          Or copy this link: <span style="color: #94A3B8; word-break: break-all;">${magicLink}</span>
        </p>
      </div>
    `,
  });
}
