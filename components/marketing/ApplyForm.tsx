"use client";

import { useState } from "react";

const ROLE_OPTIONS = [
  "Content Creator",
  "Social Media Coordinator",
  "Video Producer",
  "Brand Strategist",
];

export function ApplyForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Submission failed");
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-black p-10 text-center">
        <p className="text-xl font-semibold mb-2">Application received.</p>
        <p className="text-gray-500 text-sm">
          We review applications every week. We&apos;ll be in touch within 5 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
          Full Name *
        </label>
        <input
          name="name"
          required
          className="w-full border border-[#e5e5e5] px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
          placeholder="Your full name"
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
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
          Role Interest *
        </label>
        <select
          name="roleInterest"
          required
          className="w-full border border-[#e5e5e5] px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-white appearance-none"
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
          Portfolio / LinkedIn URL
        </label>
        <input
          name="portfolioUrl"
          type="url"
          className="w-full border border-[#e5e5e5] px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
          Cover Note *
        </label>
        <textarea
          name="coverNote"
          required
          rows={5}
          className="w-full border border-[#e5e5e5] px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"
          placeholder="Tell us why you want to intern at Urbanclicks and what you bring to the team..."
        />
      </div>

      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-black text-white py-3 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}
