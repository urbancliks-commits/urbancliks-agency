import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubmissionRow } from "@/components/dashboard/SubmissionRow";
import { SubmissionActions } from "@/components/dashboard/SubmissionActions";

export const metadata = { title: "Submissions — Urbanclicks Dashboard" };

export default async function SubmissionsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

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
      feedbackItems: { orderBy: { createdAt: "asc" } },
    },
  });

  const pendingCount = submissions.filter((s) => s.status === "PENDING").length;
  const approvedCount = submissions.filter((s) => s.status === "APPROVED").length;
  const revisionCount = submissions.filter(
    (s) => s.status === "REVISION_NEEDED"
  ).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Submissions</h1>
        <p className="text-sm text-gray-500 mt-1">
          {pendingCount} pending · {approvedCount} approved · {revisionCount} needs revision
        </p>
      </div>

      <div className="bg-white border border-[#e5e5e5]">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-6 py-3 border-b border-[#e5e5e5] bg-[#f5f5f5]">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Task / Intern
          </p>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Work
          </p>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Date
          </p>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Status
          </p>
        </div>

        {submissions.length === 0 ? (
          <p className="px-6 py-12 text-sm text-gray-400 text-center">
            No submissions yet.
          </p>
        ) : (
          <div className="divide-y divide-[#e5e5e5]">
            {submissions.map((sub) => (
              <div key={sub.id}>
                <SubmissionRow submission={sub} />

                {/* Feedback thread */}
                {sub.feedbackItems.length > 0 && (
                  <div className="px-6 pb-3 pl-10 space-y-1.5 border-t border-[#f5f5f5]">
                    {sub.feedbackItems.map((fb) => (
                      <div key={fb.id} className="flex gap-2 text-xs text-gray-500 py-1">
                        <span className="text-gray-300 flex-shrink-0">↳</span>
                        <p>{fb.body}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Admin: status update buttons (client component) */}
                {isAdmin && (
                  <SubmissionActions
                    submissionId={sub.id}
                    currentStatus={sub.status}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
