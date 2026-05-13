import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/interns/[id]
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { internProfile: true },
  });

  const isAdmin = user?.role === "ADMIN";
  const isOwnProfile = user?.internProfile?.id === id;

  if (!isAdmin && !isOwnProfile) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const intern = await db.internProfile.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      tasks: { orderBy: { dueDate: "asc" } },
      submissions: {
        include: {
          task: { select: { title: true } },
          feedbackItems: true,
        },
      },
    },
  });

  if (!intern) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ intern });
}

// PATCH /api/interns/[id] — update status, bio, role, etc.
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { status, role, bio, portfolioUrl, startDate } = body;

  const updated = await db.internProfile.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(role && { role }),
      ...(bio !== undefined && { bio }),
      ...(portfolioUrl !== undefined && { portfolioUrl }),
      ...(startDate && { startDate: new Date(startDate) }),
    },
    include: { user: { select: { name: true, email: true } } },
  });

  return NextResponse.json({ intern: updated });
}

// DELETE /api/interns/[id]
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.internProfile.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
