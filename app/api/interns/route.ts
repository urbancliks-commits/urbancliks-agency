import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/interns — list all intern profiles (admin only)
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const interns = await db.internProfile.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { tasks: true, submissions: true } },
    },
  });

  return NextResponse.json({ interns });
}

// POST /api/interns — create user + intern profile (admin only)
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (admin?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { name, email, password, role, startDate, bio, portfolioUrl } = body;

  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Create user via Better Auth sign-up
  const signUpResult = await auth.api.signUpEmail({
    body: { name, email, password },
    asResponse: false,
  });

  if (!signUpResult?.user) {
    return NextResponse.json({ error: "Failed to create user account" }, { status: 400 });
  }

  // Set role to INTERN explicitly
  await db.user.update({
    where: { id: signUpResult.user.id },
    data: { role: "INTERN" },
  });

  const internProfile = await db.internProfile.create({
    data: {
      userId: signUpResult.user.id,
      role,
      startDate: startDate ? new Date(startDate) : new Date(),
      bio: bio || null,
      portfolioUrl: portfolioUrl || null,
    },
    include: { user: { select: { name: true, email: true } } },
  });

  return NextResponse.json({ intern: internProfile }, { status: 201 });
}
