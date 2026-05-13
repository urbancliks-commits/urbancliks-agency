import type { Metadata } from "next";
import { ApplyForm } from "@/components/marketing/ApplyForm";

export const metadata: Metadata = {
  title: "Apply — Urbanclicks Media",
  description:
    "Apply to intern at Urbanclicks Media in Abu Dhabi and Al Ain, UAE.",
};

export default function ApplyPage() {
  return (
    <div>
      <section className="border-b border-[#e5e5e5] px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Applications open
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Apply to intern at Urbanclicks.
          </h1>
          <p className="text-gray-600 max-w-xl">
            Fill in the form below. We review applications every week and aim to
            respond within 5 business days.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto">
          <ApplyForm />
        </div>
      </section>
    </div>
  );
}
