import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      <Sidebar isAdmin={isAdmin} />
      <main className="flex-1 overflow-auto min-w-0">{children}</main>
    </div>
  );
}
