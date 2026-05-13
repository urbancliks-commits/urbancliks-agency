import { statusBadge } from "@/components/ui/Badge";

type Submission = {
  id: string;
  workUrl: string;
  notes: string | null;
  status: string;
  createdAt: Date;
  task: { title: string };
  intern: { user: { name: string } };
};

export function SubmissionRow({ submission }: { submission: Submission }) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-6 py-4 hover:bg-[#f5f5f5] transition-colors">
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{submission.task.title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{submission.intern.user.name}</p>
      </div>

      <a
        href={submission.workUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-gray-500 hover:text-black underline"
      >
        View work
      </a>

      <span className="text-xs text-gray-400 whitespace-nowrap">
        {new Date(submission.createdAt).toLocaleDateString("en-AE", {
          month: "short",
          day: "numeric",
        })}
      </span>

      {statusBadge(submission.status)}
    </div>
  );
}
