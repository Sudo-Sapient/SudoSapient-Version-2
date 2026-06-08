import { NextResponse } from "next/server";

// TODO: wire to Resend (or your transactional mail provider of choice).
// Env: RESEND_API_KEY, CONTACT_INBOX.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, project, budget } = body ?? {};

    if (!name || !email || !project) {
      return NextResponse.json(
        { ok: false, error: "missing_fields" },
        { status: 400 }
      );
    }

    // For now: log on the server so it's visible in dev/Vercel logs.
    console.info("[contact] new submission", {
      name,
      email,
      project,
      budget,
      at: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "bad_request" },
      { status: 400 }
    );
  }
}
