"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

const NAV_LINKS = [
  { href: "/dashboard", label: "Overview", exact: true },
  { href: "/dashboard/interns", label: "Interns" },
  { href: "/dashboard/tasks", label: "Tasks" },
  { href: "/dashboard/calendar", label: "Calendar" },
  { href: "/dashboard/submissions", label: "Submissions" },
];

export function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  const links = isAdmin
    ? NAV_LINKS
    : NAV_LINKS.filter((l) => l.href !== "/dashboard/interns");

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <aside className="w-56 min-h-screen border-r border-[#e5e5e5] bg-white flex flex-col flex-shrink-0">
      <div className="px-5 py-5 border-b border-[#e5e5e5]">
        <Link href="/" className="text-sm font-bold tracking-tight">
          URBANCLICKS<span className="text-[#c9a84c]">.</span>
        </Link>
        <p className="text-xs text-gray-400 mt-0.5">
          {isAdmin ? "Admin Portal" : "Intern Portal"}
        </p>
      </div>

      <nav className="flex-1 px-3 py-4">
        <div className="space-y-0.5">
          {links.map((link) => {
            const active = link.exact
              ? pathname === link.href
              : pathname === link.href || pathname.startsWith(link.href + "/");

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-3 py-2 text-sm rounded transition-colors ${
                  active
                    ? "bg-black text-white"
                    : "text-gray-600 hover:text-black hover:bg-[#f5f5f5]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="px-5 py-4 border-t border-[#e5e5e5]">
        <button
          onClick={handleSignOut}
          className="text-xs text-gray-400 hover:text-black transition-colors"
        >
          Sign out →
        </button>
      </div>
    </aside>
  );
}
