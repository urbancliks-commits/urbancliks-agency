"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again or email us directly.");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-black p-8 text-center">
        <p className="text-xl font-semibold mb-2">Message sent.</p>
        <p className="text-gray-500 text-sm">We&apos;ll get back to you within 2 business days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
            Name *
          </label>
          <input
            name="name"
            required
            className="w-full border border-[#e5e5e5] px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
            Email *
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full border border-[#e5e5e5] px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
          Subject *
        </label>
        <input
          name="subject"
          required
          className="w-full border border-[#e5e5e5] px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
          Message *
        </label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full border border-[#e5e5e5] px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"
        />
      </div>

      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-black text-white py-3 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
