import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { TaskCard } from "@/components/dashboard/TaskCard";
import Link from "next/link";

export const metadata = { title: "Tasks — Urbanclicks Dashboard" };

const COLUMNS = [
  { key: "TODO", label: "To Do" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "DONE", label: "Done" },
] as const;

export default async function TasksPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

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
    },
  });

  const grouped = Object.fromEntries(
    COLUMNS.map((col) => [
      col.key,
      tasks.filter((t) => t.status === col.key),
    ])
  ) as Record<(typeof COLUMNS)[number]["key"], typeof tasks>;

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-sm text-gray-500 mt-1">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""}
            {!isAdmin && " assigned to you"}
          </p>
        </div>
        {isAdmin && (
          <Link
            href="/dashboard/tasks/new"
            className="bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            + New Task
          </Link>
        )}
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {COLUMNS.map((col) => (
          <div key={col.key}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                {col.label}
              </p>
              <span className="text-xs text-gray-400">
                {grouped[col.key].length}
              </span>
            </div>
            <div className="space-y-3">
              {grouped[col.key].length === 0 ? (
                <div className="bg-white border border-dashed border-[#e5e5e5] p-6 text-center">
                  <p className="text-xs text-gray-400">No tasks</p>
                </div>
              ) : (
                grouped[col.key].map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
