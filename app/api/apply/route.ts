import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/apply — public, no auth required
export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, roleInterest, portfolioUrl, coverNote } = body;

  if (!name || !email || !roleInterest || !coverNote) {
    return NextResponse.json(
      { error: "name, email, roleInterest, and coverNote are required" },
      { status: 400 }
    );
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const application = await db.application.create({
    data: {
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      roleInterest: String(roleInterest).trim(),
      portfolioUrl: portfolioUrl ? String(portfolioUrl).trim() : null,
      coverNote: String(coverNote).trim(),
    },
  });

  return NextResponse.json({ application }, { status: 201 });
}
