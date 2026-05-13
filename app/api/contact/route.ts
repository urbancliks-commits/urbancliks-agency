import { NextResponse } from "next/server";

// POST /api/contact — public, simple log / future email integration
export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, subject, message } = body;

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  // Log for now — integrate with email service (Resend, SendGrid) as needed
  console.log("[Contact form]", { name, email, subject });

  return NextResponse.json({ success: true }, { status: 200 });
}
