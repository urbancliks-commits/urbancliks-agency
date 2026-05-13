"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Intern = {
  id: string;
  role: string;
  user: { name: string };
};

export default function NewTaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [interns, setInterns] = useState<Intern[]>([]);

  useEffect(() => {
    fetch("/api/interns")
      .then((r) => r.json())
      .then((data) => setInterns(data.interns ?? []))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to create task");
      router.push("/dashboard/tasks");
      router.refresh();
    } catch {
      setError("Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">New Task</h1>
        <p className="text-sm text-gray-500 mt-1">Assign a task to an intern.</p>
      </div>

      <div className="max-w-lg bg-white border border-[#e5e5e5] p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
              Title *
            </label>
            <input
              name="title"
              required
              className="w-full border border-[#e5e5e5] px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              className="w-full border border-[#e5e5e5] px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
              Assign To
            </label>
            <select
              name="assignedToId"
              className="w-full border border-[#e5e5e5] px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-white"
            >
              <option value="">Unassigned</option>
              {interns.map((intern) => (
                <option key={intern.id} value={intern.id}>
                  {intern.user.name} — {intern.role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
              Due Date
            </label>
            <input
              name="dueDate"
              type="date"
              className="w-full border border-[#e5e5e5] px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
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
              {loading ? "Creating..." : "Create Task"}
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
