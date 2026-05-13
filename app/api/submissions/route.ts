import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/submissions
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { internProfile: true },
  });

  const isAdmin = user?.role === "ADMIN";

  const submissions = await db.submission.findMany({
    where: isAdmin ? {} : { internId: user?.internProfile?.id },
    orderBy: { createdAt: "desc" },
    include: {
      task: { select: { title: true } },
      intern: { include: { user: { select: { name: true } } } },
      feedbackItems: { orderBy: { createdAt: "desc" } },
    },
  });

  return NextResponse.json({ submissions });
}

// POST /api/submissions — intern submits work
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { internProfile: true },
  });

  if (!user?.internProfile) {
    return NextResponse.json({ error: "No intern profile" }, { status: 403 });
  }

  const body = await request.json();
  const { taskId, workUrl, notes } = body;

  if (!taskId || !workUrl) {
    return NextResponse.json({ error: "taskId and workUrl are required" }, { status: 400 });
  }

  // Verify task is assigned to this intern
  const task = await db.internTask.findUnique({ where: { id: taskId } });
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
  if (task.assignedToId !== user.internProfile.id && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const submission = await db.submission.create({
    data: {
      taskId,
      internId: user.internProfile.id,
      workUrl,
      notes: notes || null,
    },
    include: {
      task: { select: { title: true } },
      intern: { include: { user: { select: { name: true } } } },
    },
  });

  return NextResponse.json({ submission }, { status: 201 });
}
