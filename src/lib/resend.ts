import { Resend } from "resend";

let resendClient: Resend | null = null;

export function getResend(): Resend {
  if (resendClient) return resendClient;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is required");
  }

  resendClient = new Resend(apiKey);
  return resendClient;
}

const FROM_ADDRESS = process.env.RESEND_FROM || "Problem Board <hello@problemboard.app>";

// ── Welcome email ──────────────────────────────────────────────────────────

export async function sendWelcomeEmail(to: string, displayName: string) {
  const resend = getResend();

  return resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "Welcome to Problem Board",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background-color:#FAFAF8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1A1A18;">
  <div style="max-width:480px;margin:0 auto;padding:48px 24px;">
    <div style="margin-bottom:32px;">
      <span style="font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#1A1A18;">Problem Board</span>
    </div>

    <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.2;margin:0 0 16px;color:#1A1A18;">
      Welcome, ${displayName}
    </h1>

    <p style="font-size:15px;line-height:1.6;color:#6B6B65;margin:0 0 24px;">
      You're in. Problem Board surfaces the problems real people would pay to solve — ranked by demand, not hype.
    </p>

    <div style="background:#fff;border:1px solid #E0DFDB;border-radius:12px;padding:24px;margin-bottom:24px;">
      <p style="font-size:13px;color:#9C9C95;font-family:monospace;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 12px;">
        Get started
      </p>
      <ul style="list-style:none;padding:0;margin:0;">
        <li style="font-size:14px;color:#6B6B65;padding:6px 0;border-bottom:1px solid #E0DFDB;">
          <strong style="color:#1A1A18;">Browse problems</strong> — see what people actually need
        </li>
        <li style="font-size:14px;color:#6B6B65;padding:6px 0;border-bottom:1px solid #E0DFDB;">
          <strong style="color:#1A1A18;">Vote &ldquo;I'd pay&rdquo;</strong> — signal real demand
        </li>
        <li style="font-size:14px;color:#6B6B65;padding:6px 0;">
          <strong style="color:#1A1A18;">Submit a problem</strong> — something you'd pay to fix
        </li>
      </ul>
    </div>

    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://problemboard.app"}"
       style="display:inline-block;background:#2D6A4F;color:#fff;font-size:14px;font-weight:500;padding:10px 24px;border-radius:8px;text-decoration:none;">
      Open Problem Board
    </a>

    <p style="font-size:12px;color:#9C9C95;margin-top:32px;line-height:1.5;">
      You're receiving this because you signed up for Problem Board.<br>
      No spam — we only send what matters.
    </p>
  </div>
</body>
</html>`,
  });
}

// ── Upgrade confirmation ───────────────────────────────────────────────────

export async function sendUpgradeEmail(
  to: string,
  displayName: string,
  plan: "pro" | "team"
) {
  const resend = getResend();

  const planNames = { pro: "Builder", team: "Studio" };
  const planName = planNames[plan];

  return resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: `You're now on ${planName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background-color:#FAFAF8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1A1A18;">
  <div style="max-width:480px;margin:0 auto;padding:48px 24px;">
    <div style="margin-bottom:32px;">
      <span style="font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#1A1A18;">Problem Board</span>
    </div>

    <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.2;margin:0 0 16px;color:#1A1A18;">
      Welcome to ${planName}, ${displayName}
    </h1>

    <p style="font-size:15px;line-height:1.6;color:#6B6B65;margin:0 0 24px;">
      Your account has been upgraded. Here's what's new:
    </p>

    <div style="background:#fff;border:1px solid #E0DFDB;border-radius:12px;padding:24px;margin-bottom:24px;">
      ${plan === "pro" ? `
      <ul style="list-style:none;padding:0;margin:0;">
        <li style="font-size:14px;color:#6B6B65;padding:6px 0;border-bottom:1px solid #E0DFDB;">
          <span style="color:#2D6A4F;margin-right:8px;">&#10003;</span> Unlimited problem submissions
        </li>
        <li style="font-size:14px;color:#6B6B65;padding:6px 0;border-bottom:1px solid #E0DFDB;">
          <span style="color:#2D6A4F;margin-right:8px;">&#10003;</span> Full &ldquo;would pay&rdquo; signals with price ranges
        </li>
        <li style="font-size:14px;color:#6B6B65;padding:6px 0;border-bottom:1px solid #E0DFDB;">
          <span style="color:#2D6A4F;margin-right:8px;">&#10003;</span> Daily Reddit-sourced problems in your inbox
        </li>
        <li style="font-size:14px;color:#6B6B65;padding:6px 0;">
          <span style="color:#2D6A4F;margin-right:8px;">&#10003;</span> Builder badge on your profile
        </li>
      </ul>` : `
      <ul style="list-style:none;padding:0;margin:0;">
        <li style="font-size:14px;color:#6B6B65;padding:6px 0;border-bottom:1px solid #E0DFDB;">
          <span style="color:#2D6A4F;margin-right:8px;">&#10003;</span> Everything in Builder, plus:
        </li>
        <li style="font-size:14px;color:#6B6B65;padding:6px 0;border-bottom:1px solid #E0DFDB;">
          <span style="color:#2D6A4F;margin-right:8px;">&#10003;</span> Up to 5 team members
        </li>
        <li style="font-size:14px;color:#6B6B65;padding:6px 0;border-bottom:1px solid #E0DFDB;">
          <span style="color:#2D6A4F;margin-right:8px;">&#10003;</span> Export data &amp; API access
        </li>
        <li style="font-size:14px;color:#6B6B65;padding:6px 0;">
          <span style="color:#2D6A4F;margin-right:8px;">&#10003;</span> Weekly trend reports via email
        </li>
      </ul>`}
    </div>

    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://problemboard.app"}"
       style="display:inline-block;background:#2D6A4F;color:#fff;font-size:14px;font-weight:500;padding:10px 24px;border-radius:8px;text-decoration:none;">
      Start exploring
    </a>

    <p style="font-size:12px;color:#9C9C95;margin-top:32px;line-height:1.5;">
      Questions? Reply to this email — a real person reads it.
    </p>
  </div>
</body>
</html>`,
  });
}

// ── Daily problem digest ───────────────────────────────────────────────────

export async function sendDailyDigestEmail(
  to: string,
  displayName: string,
  problem: {
    title: string;
    description: string;
    category: string;
    wouldPayScore: number;
    funToBuildScore: number;
    redditUrl: string;
    problemUrl: string;
  }
) {
  const resend = getResend();

  return resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: `Today's top problem: ${problem.title}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background-color:#FAFAF8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1A1A18;">
  <div style="max-width:480px;margin:0 auto;padding:48px 24px;">
    <div style="margin-bottom:32px;">
      <span style="font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#1A1A18;">Problem Board</span>
      <span style="font-family:monospace;font-size:11px;color:#9C9C95;margin-left:8px;">/daily</span>
    </div>

    <p style="font-size:13px;color:#9C9C95;font-family:monospace;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 8px;">
      Today's Problem
    </p>

    <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.3;margin:0 0 16px;color:#1A1A18;">
      ${problem.title}
    </h1>

    <div style="background:#fff;border:1px solid #E0DFDB;border-radius:12px;padding:24px;margin-bottom:20px;">
      <p style="font-size:14px;line-height:1.6;color:#6B6B65;margin:0 0 16px;">
        ${problem.description.slice(0, 300)}${problem.description.length > 300 ? "..." : ""}
      </p>

      <div style="display:flex;gap:16px;padding-top:12px;border-top:1px solid #E0DFDB;">
        <div>
          <span style="font-family:monospace;font-size:11px;color:#9C9C95;text-transform:uppercase;">Would pay</span>
          <div style="font-family:monospace;font-size:18px;color:#B45309;font-weight:500;">${problem.wouldPayScore}/10</div>
        </div>
        <div>
          <span style="font-family:monospace;font-size:11px;color:#9C9C95;text-transform:uppercase;">Fun to build</span>
          <div style="font-family:monospace;font-size:18px;color:#2D6A4F;font-weight:500;">${problem.funToBuildScore}/10</div>
        </div>
      </div>
    </div>

    <div style="margin-bottom:24px;">
      <a href="${problem.problemUrl}"
         style="display:inline-block;background:#2D6A4F;color:#fff;font-size:14px;font-weight:500;padding:10px 24px;border-radius:8px;text-decoration:none;margin-right:8px;">
        View on Problem Board
      </a>
      <a href="${problem.redditUrl}"
         style="display:inline-block;background:#fff;color:#6B6B65;font-size:14px;font-weight:500;padding:10px 24px;border-radius:8px;text-decoration:none;border:1px solid #E0DFDB;">
        Reddit thread
      </a>
    </div>

    <p style="font-size:12px;color:#9C9C95;margin-top:32px;line-height:1.5;">
      You're receiving this as a Builder or Studio member.<br>
      <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://problemboard.app"}/settings" style="color:#9C9C95;">Unsubscribe from daily digest</a>
    </p>
  </div>
</body>
</html>`,
  });
}
