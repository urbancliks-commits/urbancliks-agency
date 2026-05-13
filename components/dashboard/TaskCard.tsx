import { statusBadge } from "@/components/ui/Badge";

type Task = {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  status: string;
  assignedTo: { user: { name: string } } | null;
};

export function TaskCard({ task }: { task: Task }) {
  const isOverdue =
    task.dueDate &&
    task.status !== "DONE" &&
    new Date(task.dueDate) < new Date();

  return (
    <div className="bg-white border border-[#e5e5e5] p-4 hover:border-gray-400 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-medium leading-snug">{task.title}</p>
        {statusBadge(task.status)}
      </div>

      {task.description && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{task.assignedTo?.user.name ?? "Unassigned"}</span>
        {task.dueDate && (
          <span className={isOverdue ? "text-red-500 font-medium" : ""}>
            {isOverdue ? "Overdue · " : ""}
            {new Date(task.dueDate).toLocaleDateString("en-AE", {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </div>
    </div>
  );
}
