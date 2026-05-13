import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/submissions/[id]
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const submission = await db.submission.findUnique({
    where: { id },
    include: {
      task: { select: { title: true } },
      intern: { include: { user: { select: { name: true } } } },
      feedbackItems: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!submission) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ submission });
}

// PATCH /api/submissions/[id] — update status (admin) or handle redirect pattern
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

  // Support GET-style status update via query param for simple link-based actions
  const url = new URL(request.url);
  const statusParam = url.searchParams.get("status");
  const redirectUrl = url.searchParams.get("redirect");

  const body = request.headers.get("content-type")?.includes("application/json")
    ? await request.json()
    : {};

  const status = body.status ?? statusParam;

  if (!status) {
    return NextResponse.json({ error: "status is required" }, { status: 400 });
  }

  const updated = await db.submission.update({
    where: { id },
    data: { status },
    include: {
      task: { select: { title: true } },
      intern: { include: { user: { select: { name: true } } } },
    },
  });

  if (redirectUrl) redirect(redirectUrl);
  return NextResponse.json({ submission: updated });
}

// Also handle GET with status param (for simple link clicks from server components)
export async function GET_STATUS(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return PATCH(request, { params });
}
