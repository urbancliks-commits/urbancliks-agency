import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { statusBadge } from "@/components/ui/Badge";
import Link from "next/link";

export const metadata = { title: "Dashboard — Urbanclicks Media" };

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { internProfile: true },
  });

  const isAdmin = user?.role === "ADMIN";
  const internProfile = user?.internProfile;

  if (!isAdmin && !internProfile) {
    return (
      <div className="p-8">
        <p className="text-gray-500 text-sm">
          Your intern profile has not been set up yet. Please contact your admin.
        </p>
      </div>
    );
  }

  // Admin stats
  if (isAdmin) {
    const [activeInterns, totalTasks, doneTasks, totalSubmissions] =
      await Promise.all([
        db.internProfile.count({ where: { status: "ACTIVE" } }),
        db.internTask.count(),
        db.internTask.count({ where: { status: "DONE" } }),
        db.submission.count(),
      ]);

    const approvalRate =
      totalSubmissions > 0
        ? Math.round(
            ((await db.submission.count({ where: { status: "APPROVED" } })) /
              totalSubmissions) *
              100
          )
        : 0;

    const recentSubmissions = await db.submission.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        task: { select: { title: true } },
        intern: { include: { user: { select: { name: true } } } },
      },
    });

    const internsWithCounts = await db.internProfile.findMany({
      where: { status: "ACTIVE" },
      include: {
        user: { select: { name: true } },
        _count: { select: { tasks: true, submissions: true } },
      },
      take: 5,
    });

    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back. Here&apos;s what&apos;s happening.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard label="Active Interns" value={activeInterns} />
          <StatsCard
            label="Tasks"
            value={totalTasks}
            sub={`${doneTasks} done`}
          />
          <StatsCard label="Submissions" value={totalSubmissions} />
          <StatsCard
            label="Approval Rate"
            value={`${approvalRate}%`}
            sub="of submissions approved"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent submissions */}
          <div className="bg-white border border-[#e5e5e5]">
            <div className="px-6 py-4 border-b border-[#e5e5e5] flex items-center justify-between">
              <h2 className="font-semibold text-sm">Recent Submissions</h2>
              <Link
                href="/dashboard/submissions"
                className="text-xs text-gray-400 hover:text-black"
              >
                View all →
              </Link>
            </div>
            <div className="divide-y divide-[#e5e5e5]">
              {recentSubmissions.length === 0 ? (
                <p className="px-6 py-8 text-sm text-gray-400">
                  No submissions yet.
                </p>
              ) : (
                recentSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="px-6 py-3.5 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {sub.task.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {sub.intern.user.name}
                      </p>
                    </div>
                    {statusBadge(sub.status)}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active interns */}
          <div className="bg-white border border-[#e5e5e5]">
            <div className="px-6 py-4 border-b border-[#e5e5e5] flex items-center justify-between">
              <h2 className="font-semibold text-sm">Active Interns</h2>
              <Link
                href="/dashboard/interns"
                className="text-xs text-gray-400 hover:text-black"
              >
                View all →
              </Link>
            </div>
            <div className="divide-y divide-[#e5e5e5]">
              {internsWithCounts.length === 0 ? (
                <p className="px-6 py-8 text-sm text-gray-400">
                  No active interns.
                </p>
              ) : (
                internsWithCounts.map((intern) => (
                  <Link
                    key={intern.id}
                    href={`/dashboard/interns/${intern.id}`}
                    className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-[#f5f5f5] transition-colors"
                  >
                    <p className="text-sm font-medium">{intern.user.name}</p>
                    <div className="flex gap-3 text-xs text-gray-400">
                      <span>{intern._count.tasks} tasks</span>
                      <span>{intern._count.submissions} subs</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Intern view
  const myTasks = await db.internTask.findMany({
    where: { assignedToId: internProfile!.id },
    orderBy: { dueDate: "asc" },
  });

  const mySubmissions = await db.submission.findMany({
    where: { internId: internProfile!.id },
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { task: { select: { title: true } } },
  });

  const doneTasks = myTasks.filter((t) => t.status === "DONE").length;
  const approvedSubs = mySubmissions.filter(
    (s) => s.status === "APPROVED"
  ).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome, {session.user.name}.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard label="My Tasks" value={myTasks.length} />
        <StatsCard label="Completed" value={doneTasks} />
        <StatsCard label="Submissions" value={mySubmissions.length} />
        <StatsCard label="Approved" value={approvedSubs} />
      </div>

      <div className="bg-white border border-[#e5e5e5]">
        <div className="px-6 py-4 border-b border-[#e5e5e5] flex items-center justify-between">
          <h2 className="font-semibold text-sm">My Tasks</h2>
          <Link
            href="/dashboard/tasks"
            className="text-xs text-gray-400 hover:text-black"
          >
            View all →
          </Link>
        </div>
        <div className="divide-y divide-[#e5e5e5]">
          {myTasks.length === 0 ? (
            <p className="px-6 py-8 text-sm text-gray-400">
              No tasks assigned yet.
            </p>
          ) : (
            myTasks.slice(0, 6).map((task) => (
              <div
                key={task.id}
                className="px-6 py-3.5 flex items-center justify-between gap-4"
              >
                <p className="text-sm font-medium">{task.title}</p>
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
    </div>
  );
}
