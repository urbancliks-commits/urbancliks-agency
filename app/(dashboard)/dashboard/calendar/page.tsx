import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { statusBadge } from "@/components/ui/Badge";

export const metadata = { title: "Calendar — Urbanclicks Dashboard" };

function getWeekDays(baseDate: Date): Date[] {
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() - ((baseDate.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default async function CalendarPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { internProfile: true },
  });

  const isAdmin = user?.role === "ADMIN";

  const tasks = await db.internTask.findMany({
    where: {
      dueDate: { not: null },
      ...(isAdmin ? {} : { assignedToId: user?.internProfile?.id }),
    },
    orderBy: { dueDate: "asc" },
    include: {
      assignedTo: { include: { user: { select: { name: true } } } },
    },
  });

  const today = new Date();
  const weekDays = getWeekDays(today);

  const tasksWithDue = tasks.filter((t) => t.dueDate !== null);
  const noDateTasks = isAdmin
    ? await db.internTask.findMany({
        where: { dueDate: null },
        include: {
          assignedTo: { include: { user: { select: { name: true } } } },
        },
        take: 10,
      })
    : [];

  const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-sm text-gray-500 mt-1">
          Tasks due this week and upcoming.
        </p>
      </div>

      {/* Weekly view */}
      <div className="bg-white border border-[#e5e5e5] mb-6">
        <div className="px-6 py-4 border-b border-[#e5e5e5]">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Week of{" "}
            {weekDays[0].toLocaleDateString("en-AE", {
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="grid grid-cols-7 divide-x divide-[#e5e5e5]">
          {weekDays.map((day, idx) => {
            const isToday = isSameDay(day, today);
            const dayTasks = tasksWithDue.filter(
              (t) => t.dueDate && isSameDay(new Date(t.dueDate), day)
            );

            return (
              <div key={day.toISOString()} className="min-h-32">
                {/* Day header */}
                <div
                  className={`px-3 py-3 border-b border-[#e5e5e5] ${isToday ? "bg-black" : ""}`}
                >
                  <p
                    className={`text-xs font-semibold ${isToday ? "text-white" : "text-gray-400"}`}
                  >
                    {DAY_LABELS[idx]}
                  </p>
                  <p
                    className={`text-lg font-bold ${isToday ? "text-white" : ""}`}
                  >
                    {day.getDate()}
                  </p>
                </div>

                {/* Tasks for this day */}
                <div className="px-2 py-2 space-y-1.5">
                  {dayTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`px-2 py-1.5 text-xs leading-snug ${
                        task.status === "DONE"
                          ? "bg-[#f5f5f5] text-gray-400 line-through"
                          : "bg-black text-white"
                      }`}
                    >
                      <p className="font-medium truncate">{task.title}</p>
                      {task.assignedTo && (
                        <p className="opacity-70 truncate text-[10px]">
                          {task.assignedTo.user.name}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming tasks */}
      <div className="bg-white border border-[#e5e5e5]">
        <div className="px-6 py-4 border-b border-[#e5e5e5]">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            All tasks with due dates
          </p>
        </div>
        <div className="divide-y divide-[#e5e5e5]">
          {tasksWithDue.length === 0 ? (
            <p className="px-6 py-8 text-sm text-gray-400">
              No tasks with due dates.
            </p>
          ) : (
            tasksWithDue.map((task) => (
              <div
                key={task.id}
                className="px-6 py-4 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-sm font-medium">{task.title}</p>
                  {task.assignedTo && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {task.assignedTo.user.name}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(task.dueDate!).toLocaleDateString("en-AE", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  {statusBadge(task.status)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* No-date tasks (admin only) */}
      {isAdmin && noDateTasks.length > 0 && (
        <div className="bg-white border border-[#e5e5e5] mt-6">
          <div className="px-6 py-4 border-b border-[#e5e5e5]">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Tasks without due dates
            </p>
          </div>
          <div className="divide-y divide-[#e5e5e5]">
            {noDateTasks.map((task) => (
              <div
                key={task.id}
                className="px-6 py-4 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-sm font-medium">{task.title}</p>
                  {task.assignedTo && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {task.assignedTo.user.name}
                    </p>
                  )}
                </div>
                {statusBadge(task.status)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
