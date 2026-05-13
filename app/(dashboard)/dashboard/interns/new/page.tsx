"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ROLE_OPTIONS = [
  "Content Creator",
  "Social Media Coordinator",
  "Video Producer",
  "Brand Strategist",
];

export default function NewInternPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/interns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to create intern");
      }

      router.push("/dashboard/interns");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Add Intern</h1>
        <p className="text-sm text-gray-500 mt-1">
          Create a user account and intern profile.
        </p>
      </div>

      <div className="max-w-lg bg-white border border-[#e5e5e5] p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
              Full Name *
            </label>
            <input
              name="name"
              required
              className="w-full border border-[#e5e5e5] px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
              Email Address *
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full border border-[#e5e5e5] px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
              Temporary Password *
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="w-full border border-[#e5e5e5] px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              placeholder="Min. 8 characters"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
              Role *
            </label>
            <select
              name="role"
              required
              className="w-full border border-[#e5e5e5] px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-white"
            >
              <option value="">Select a role...</option>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
              Start Date
            </label>
            <input
              name="startDate"
              type="date"
              className="w-full border border-[#e5e5e5] px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              rows={3}
              className="w-full border border-[#e5e5e5] px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
              Portfolio URL
            </label>
            <input
              name="portfolioUrl"
              type="url"
              className="w-full border border-[#e5e5e5] px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              placeholder="https://..."
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-6 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Intern"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-black border border-[#e5e5e5] hover:border-black transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
