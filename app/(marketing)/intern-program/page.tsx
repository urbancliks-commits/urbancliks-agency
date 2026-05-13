import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Intern Program — Urbanclicks Media",
  description:
    "Launch your social media career with the Urbanclicks intern program. Based in Abu Dhabi and Al Ain, UAE.",
};

const PERKS = [
  "Work on live client campaigns from day one",
  "Direct mentorship from experienced content strategists",
  "Certificate of completion for your portfolio",
  "Real deliverables to showcase to future employers",
  "Flexible remote-first schedule",
  "Exposure to the UAE's fast-growing digital market",
  "Networking with UAE brands and creatives",
];

const OPEN_ROLES = [
  {
    title: "Content Creator",
    desc: "Write copy, develop content concepts, and manage editorial calendars for client accounts.",
  },
  {
    title: "Social Media Coordinator",
    desc: "Schedule posts, engage with communities, report on metrics, and manage posting pipelines.",
  },
  {
    title: "Video Producer",
    desc: "Script, shoot, and edit short-form video content (Reels, TikToks, Shorts) for client brands.",
  },
  {
    title: "Brand Strategist",
    desc: "Research markets, develop brand positioning, and create strategy decks for client briefs.",
  },
];

export default function InternProgramPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-black text-white px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-4">
            Intern Program
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight mb-6">
            Start your journey<br />in UAE social media.
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            The Urbanclicks intern program gives motivated students and recent
            graduates hands-on experience building brands in one of the Middle
            East&apos;s most dynamic digital markets.
          </p>
        </div>
      </section>

      {/* Learn + Eligibility */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-bold mb-6">What you&apos;ll learn</h2>
            <ul className="space-y-3">
              {PERKS.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-black rounded-full flex-shrink-0 mt-1.5" />
                  <span className="text-sm text-gray-600">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Who should apply</h2>
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>
                — Final-year students or recent graduates in Marketing,
                Communications, Media, Design, or a related field
              </p>
              <p>
                — Strong written and verbal communication skills (Arabic a
                bonus, but not required)
              </p>
              <p>— Genuine interest in social media, content, and brand-building</p>
              <p>— Based in or able to work remotely from the UAE</p>
              <p>
                — Ability to commit to a minimum of 3 months, part-time or
                full-time
              </p>
              <p>— A portfolio, a side project, or a strong point of view</p>
            </div>
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="bg-[#f5f5f5] px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-10">
            Open roles
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {OPEN_ROLES.map((role) => (
              <div
                key={role.title}
                className="bg-white border border-[#e5e5e5] p-6 hover:border-black transition-colors"
              >
                <h3 className="font-semibold mb-2">{role.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{role.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/apply"
              className="inline-block bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-10">
            The process
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            {[
              { step: "01", label: "Apply", desc: "Fill in the application form — it takes 5 minutes." },
              { step: "02", label: "Review", desc: "We review applications every week." },
              { step: "03", label: "Interview", desc: "A 30-minute chat with our team." },
              { step: "04", label: "Start", desc: "Onboard and begin working on real campaigns." },
            ].map((s) => (
              <div key={s.step} className="border-t border-black pt-6">
                <p className="text-xs font-semibold text-[#c9a84c] mb-2">{s.step}</p>
                <p className="font-semibold mb-2">{s.label}</p>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
