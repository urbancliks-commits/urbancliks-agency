import Link from "next/link";
import { statusBadge } from "@/components/ui/Badge";

type Intern = {
  id: string;
  role: string;
  status: string;
  startDate: Date;
  user: { name: string; email: string };
  _count?: { tasks: number; submissions: number };
};

export function InternCard({ intern }: { intern: Intern }) {
  return (
    <Link
      href={`/dashboard/interns/${intern.id}`}
      className="block bg-white border border-[#e5e5e5] p-5 hover:border-black transition-colors group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-sm group-hover:underline">
            {intern.user.name}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{intern.user.email}</p>
        </div>
        {statusBadge(intern.status)}
      </div>

      <p className="text-xs text-gray-600 mb-4">{intern.role}</p>

      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span>
          {intern._count?.tasks ?? 0} task{(intern._count?.tasks ?? 0) !== 1 ? "s" : ""}
        </span>
        <span>
          {intern._count?.submissions ?? 0} submission
          {(intern._count?.submissions ?? 0) !== 1 ? "s" : ""}
        </span>
        <span className="ml-auto">
          Since{" "}
          {new Date(intern.startDate).toLocaleDateString("en-AE", {
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
    </Link>
  );
}
