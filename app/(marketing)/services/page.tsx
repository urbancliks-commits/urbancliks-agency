import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services — Urbanclicks Media",
  description:
    "Content strategy, social media management, short-form video, and brand identity for UAE brands.",
};

const SERVICES = [
  {
    number: "01",
    title: "Content Strategy",
    description:
      "We build data-informed content strategies that align with your business goals. From audience research to content pillars, editorial calendars, and performance tracking — we cover the full strategy lifecycle so your team always knows what to create and why.",
    deliverables: [
      "In-depth content audit",
      "Audience persona development",
      "Platform-specific strategy",
      "30/60/90-day editorial calendar",
      "Monthly performance review",
    ],
  },
  {
    number: "02",
    title: "Social Media Management",
    description:
      "End-to-end management of your social media presence. We handle content creation, copywriting, scheduling, community management, influencer coordination, and monthly reporting — so you can focus on running your business.",
    deliverables: [
      "Daily content scheduling",
      "Community management & DM responses",
      "Hashtag & SEO strategy",
      "Monthly analytics report",
      "A/B copy testing",
    ],
  },
  {
    number: "03",
    title: "Short-Form Video",
    description:
      "Short-form video is the highest-ROI content format in 2025. We produce Reels, TikToks, and YouTube Shorts that hook viewers in the first 2 seconds and are optimised for the UAE audience — from concept and scripting through to final edit.",
    deliverables: [
      "Concept & scripting",
      "On-location or remote filming",
      "Professional editing & colour grading",
      "Captions, hooks & platform optimisation",
      "Performance analytics",
    ],
  },
  {
    number: "04",
    title: "Brand Identity",
    description:
      "Your brand is more than a logo. We build complete visual and verbal identity systems — tone of voice, colour palettes, typography, templates — that give your brand consistency and recognition across every digital touchpoint.",
    deliverables: [
      "Logo & visual identity system",
      "Comprehensive brand guidelines",
      "Tone of voice & messaging framework",
      "Social media content templates",
      "Brand onboarding deck",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div>
      {/* Header */}
      <section className="border-b border-[#e5e5e5] px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Services
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            What we offer.
          </h1>
        </div>
      </section>

      {/* Service list */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {SERVICES.map((service, i) => (
          <div
            key={service.number}
            className={`py-16 ${i < SERVICES.length - 1 ? "border-b border-[#e5e5e5]" : ""}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <p className="text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-4">
                  {service.number}
                </p>
                <h2 className="text-2xl font-bold mb-5">{service.title}</h2>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-5">
                  Deliverables
                </p>
                <ul className="space-y-3">
                  {service.deliverables.map((d) => (
                    <li key={d} className="flex items-center gap-3 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-[#c9a84c] rounded-full flex-shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="bg-black text-white px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to grow?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Let&apos;s talk about what Urbanclicks Media can do for your brand in
            the UAE market.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-black px-8 py-3 text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
