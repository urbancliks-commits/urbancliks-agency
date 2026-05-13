import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { InternCard } from "@/components/dashboard/InternCard";
import Link from "next/link";

export const metadata = { title: "Interns — Urbanclicks Dashboard" };

export default async function InternsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") redirect("/dashboard");

  const interns = await db.internProfile.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { tasks: true, submissions: true } },
    },
  });

  const activeCount = interns.filter((i) => i.status === "ACTIVE").length;
  const alumniCount = interns.filter((i) => i.status === "ALUMNI").length;

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Interns</h1>
          <p className="text-sm text-gray-500 mt-1">
            {activeCount} active · {alumniCount} alumni
          </p>
        </div>
        <Link
          href="/dashboard/interns/new"
          className="bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          + Add Intern
        </Link>
      </div>

      {interns.length === 0 ? (
        <div className="bg-white border border-[#e5e5e5] p-12 text-center">
          <p className="text-gray-400 text-sm mb-4">No interns yet.</p>
          <Link
            href="/dashboard/interns/new"
            className="text-sm font-medium hover:underline"
          >
            Add your first intern →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {interns.map((intern) => (
            <InternCard key={intern.id} intern={intern} />
          ))}
        </div>
      )}
    </div>
  );
}
