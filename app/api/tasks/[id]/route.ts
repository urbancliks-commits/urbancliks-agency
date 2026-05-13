import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/tasks/[id]
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const task = await db.internTask.findUnique({
    where: { id },
    include: {
      assignedTo: { include: { user: { select: { name: true } } } },
      submissions: {
        include: { feedbackItems: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ task });
}

// PATCH /api/tasks/[id] — update status, assignee, etc.
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { internProfile: true },
  });

  const body = await request.json();
  const { title, description, status, assignedToId, dueDate } = body;

  const isAdmin = user?.role === "ADMIN";

  // Interns can only update status of their own tasks
  if (!isAdmin) {
    const task = await db.internTask.findUnique({ where: { id } });
    if (task?.assignedToId !== user?.internProfile?.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (Object.keys(body).some((k) => k !== "status")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const updated = await db.internTask.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(status && { status }),
      ...(assignedToId !== undefined && { assignedToId: assignedToId || null }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
    },
    include: {
      assignedTo: { include: { user: { select: { name: true } } } },
    },
  });

  return NextResponse.json({ task: updated });
}

// DELETE /api/tasks/[id] — admin only
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

  await db.internTask.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
