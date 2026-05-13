import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// POST /api/feedback — admin leaves feedback on a submission
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
  const { submissionId, body: feedbackBody } = body;

  if (!submissionId || !feedbackBody) {
    return NextResponse.json(
      { error: "submissionId and body are required" },
      { status: 400 }
    );
  }

  const submission = await db.submission.findUnique({ where: { id: submissionId } });
  if (!submission) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }

  const feedback = await db.feedback.create({
    data: {
      submissionId,
      authorId: session.user.id,
      body: feedbackBody,
    },
  });

  return NextResponse.json({ feedback }, { status: 201 });
}

// GET /api/feedback?submissionId=xxx
export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const submissionId = url.searchParams.get("submissionId");

  if (!submissionId) {
    return NextResponse.json({ error: "submissionId is required" }, { status: 400 });
  }

  const items = await db.feedback.findMany({
    where: { submissionId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ feedback: items });
}
