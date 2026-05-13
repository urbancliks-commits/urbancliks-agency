"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = "APPROVED" | "REVISION_NEEDED" | "PENDING";

const ACTIONS: { status: Status; label: string }[] = [
  { status: "APPROVED", label: "Approve" },
  { status: "REVISION_NEEDED", label: "Request Revision" },
  { status: "PENDING", label: "Reset to Pending" },
];

export function SubmissionActions({
  submissionId,
  currentStatus,
}: {
  submissionId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function updateStatus(status: Status) {
    setLoading(status);
    try {
      await fetch(`/api/submissions/${submissionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  const actions = ACTIONS.filter((a) => a.status !== currentStatus);

  return (
    <div className="px-6 pb-4 flex items-center gap-2 flex-wrap">
      {actions.map((action) => (
        <button
          key={action.status}
          onClick={() => updateStatus(action.status)}
          disabled={loading !== null}
          className={`text-xs px-3 py-1 border transition-colors disabled:opacity-50 ${
            action.status === "APPROVED"
              ? "border-black hover:bg-black hover:text-white"
              : action.status === "REVISION_NEEDED"
                ? "border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-white"
                : "border-gray-300 text-gray-500 hover:border-black hover:text-black"
          }`}
        >
          {loading === action.status ? "Updating..." : action.label}
        </button>
      ))}
    </div>
  );
}
