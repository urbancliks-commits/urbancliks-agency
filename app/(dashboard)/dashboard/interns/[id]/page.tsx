import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { statusBadge } from "@/components/ui/Badge";
import Link from "next/link";

export default async function InternDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (user?.role !== "ADMIN") redirect("/dashboard");

  const intern = await db.internProfile.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      tasks: { orderBy: { dueDate: "asc" } },
      submissions: {
        orderBy: { createdAt: "desc" },
        include: {
          task: { select: { title: true } },
          feedbackItems: { orderBy: { createdAt: "desc" } },
        },
      },
    },
  });

  if (!intern) notFound();

  const doneTasks = intern.tasks.filter((t) => t.status === "DONE").length;
  const approvedSubs = intern.submissions.filter(
    (s) => s.status === "APPROVED"
  ).length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <Link
            href="/dashboard/interns"
            className="text-xs text-gray-400 hover:text-black mb-3 inline-block"
          >
            ← All Interns
          </Link>
          <h1 className="text-2xl font-bold">{intern.user.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{intern.user.email}</p>
        </div>
        {statusBadge(intern.status)}
      </div>

      {/* Profile card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-[#e5e5e5] p-6 col-span-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Profile
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-400 mb-1">Role</p>
              <p className="font-medium">{intern.role}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Start Date</p>
              <p className="font-medium">
                {new Date(intern.startDate).toLocaleDateString("en-AE", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            {intern.portfolioUrl && (
              <div className="col-span-2">
                <p className="text-xs text-gray-400 mb-1">Portfolio</p>
                <a
                  href={intern.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline"
                >
                  {intern.portfolioUrl}
                </a>
              </div>
            )}
            {intern.bio && (
              <div className="col-span-2">
                <p className="text-xs text-gray-400 mb-1">Bio</p>
                <p className="text-gray-700 leading-relaxed">{intern.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="space-y-4">
          <div className="bg-white border border-[#e5e5e5] p-5">
            <p className="text-xs text-gray-400 mb-1">Tasks</p>
            <p className="text-2xl font-bold">{intern.tasks.length}</p>
            <p className="text-xs text-gray-400 mt-1">{doneTasks} completed</p>
          </div>
          <div className="bg-white border border-[#e5e5e5] p-5">
            <p className="text-xs text-gray-400 mb-1">Submissions</p>
            <p className="text-2xl font-bold">{intern.submissions.length}</p>
            <p className="text-xs text-gray-400 mt-1">{approvedSubs} approved</p>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="bg-white border border-[#e5e5e5] mb-6">
        <div className="px-6 py-4 border-b border-[#e5e5e5] flex items-center justify-between">
          <h2 className="font-semibold text-sm">Assigned Tasks</h2>
          <Link
            href="/dashboard/tasks"
            className="text-xs text-gray-400 hover:text-black"
          >
            Manage →
          </Link>
        </div>
        <div className="divide-y divide-[#e5e5e5]">
          {intern.tasks.length === 0 ? (
            <p className="px-6 py-6 text-sm text-gray-400">No tasks assigned.</p>
          ) : (
            intern.tasks.map((task) => (
              <div
                key={task.id}
                className="px-6 py-3.5 flex items-center justify-between gap-4"
              >
                <p className="text-sm">{task.title}</p>
                <div className="flex items-center gap-3">
                  {task.dueDate && (
                    <span className="text-xs text-gray-400">
                      {new Date(task.dueDate).toLocaleDateString("en-AE", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                  {statusBadge(task.status)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Submissions */}
      <div className="bg-white border border-[#e5e5e5]">
        <div className="px-6 py-4 border-b border-[#e5e5e5]">
          <h2 className="font-semibold text-sm">Submissions & Feedback</h2>
        </div>
        <div className="divide-y divide-[#e5e5e5]">
          {intern.submissions.length === 0 ? (
            <p className="px-6 py-6 text-sm text-gray-400">No submissions yet.</p>
          ) : (
            intern.submissions.map((sub) => (
              <div key={sub.id} className="px-6 py-5">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <p className="text-sm font-medium">{sub.task.title}</p>
                    <a
                      href={sub.workUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-500 hover:text-black underline"
                    >
                      View work
                    </a>
                  </div>
                  {statusBadge(sub.status)}
                </div>

                {sub.notes && (
                  <p className="text-xs text-gray-500 mb-3 italic">
                    &ldquo;{sub.notes}&rdquo;
                  </p>
                )}

                {sub.feedbackItems.length > 0 && (
                  <div className="mt-3 pl-4 border-l border-[#e5e5e5] space-y-2">
                    {sub.feedbackItems.map((fb) => (
                      <div key={fb.id}>
                        <p className="text-xs text-gray-700">{fb.body}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(fb.createdAt).toLocaleDateString("en-AE", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
