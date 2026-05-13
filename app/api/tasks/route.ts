import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/tasks
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { internProfile: true },
  });

  const isAdmin = user?.role === "ADMIN";

  const tasks = await db.internTask.findMany({
    where: isAdmin ? {} : { assignedToId: user?.internProfile?.id },
    orderBy: { createdAt: "desc" },
    include: {
      assignedTo: { include: { user: { select: { name: true } } } },
      _count: { select: { submissions: true } },
    },
  });

  return NextResponse.json({ tasks });
}

// POST /api/tasks — admin only
export async function POST(request: Request) {
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
  const { title, description, assignedToId, dueDate } = body;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const task = await db.internTask.create({
    data: {
      title,
      description: description || null,
      assignedToId: assignedToId || null,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
    include: {
      assignedTo: { include: { user: { select: { name: true } } } },
    },
  });

  return NextResponse.json({ task }, { status: 201 });
}
