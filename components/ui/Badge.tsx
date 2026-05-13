import type { ReactNode } from "react";

type Variant =
  | "default"
  | "black"
  | "gold"
  | "outline"
  | "muted";

const variantClasses: Record<Variant, string> = {
  default: "bg-gray-100 text-gray-700",
  black: "bg-black text-white",
  gold: "bg-[#c9a84c] text-white",
  outline: "border border-black text-black",
  muted: "bg-[#f5f5f5] text-gray-600",
};

export function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function statusBadge(status: string) {
  const map: Record<string, { label: string; variant: Variant }> = {
    // Intern status
    ACTIVE: { label: "Active", variant: "black" },
    ALUMNI: { label: "Alumni", variant: "muted" },
    INACTIVE: { label: "Inactive", variant: "outline" },
    // Task status
    TODO: { label: "To Do", variant: "muted" },
    IN_PROGRESS: { label: "In Progress", variant: "outline" },
    DONE: { label: "Done", variant: "black" },
    // Submission status
    PENDING: { label: "Pending", variant: "muted" },
    APPROVED: { label: "Approved", variant: "black" },
    REVISION_NEEDED: { label: "Revision Needed", variant: "gold" },
    // Application status
    REVIEWING: { label: "Reviewing", variant: "outline" },
    ACCEPTED: { label: "Accepted", variant: "black" },
    REJECTED: { label: "Rejected", variant: "muted" },
  };
  const entry = map[status] ?? { label: status, variant: "default" as Variant };
  return <Badge variant={entry.variant}>{entry.label}</Badge>;
}
