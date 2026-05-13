import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

export const metadata: Metadata = {
  title: "Urbanclicks Media — Content Strategy & Social Media, UAE",
  description:
    "Content strategy and social media management for brands in Abu Dhabi and Al Ain, UAE. Apply to our intern program.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-black text-white px-4 sm:px-6 lg:px-8 py-24 sm:py-36">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-5">
              Abu Dhabi &amp; Al Ain, UAE
            </p>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-none mb-6">
              Content that<br />moves markets.
            </h1>
            <p className="text-lg text-gray-400 max-w-xl mb-10 leading-relaxed">
              Urbanclicks Media is a content strategy and social media management
              agency built for UAE brands that want to grow.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/services"
                className="bg-white text-black px-7 py-3 text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Our Services
              </Link>
              <Link
                href="/intern-program"
                className="border border-white text-white px-7 py-3 text-sm font-medium hover:bg-white hover:text-black transition-colors"
              >
                Intern Program
              </Link>
            </div>
          </div>
        </section>

        {/* Services overview */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-12">
              What we do
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Content Strategy",
                  desc: "Data-driven content planning aligned with your brand goals and UAE audience.",
                },
                {
                  title: "Social Media Management",
                  desc: "End-to-end management across Instagram, TikTok, LinkedIn, and beyond.",
                },
                {
                  title: "Short-Form Video",
                  desc: "Reels, TikToks, and Shorts that capture attention and drive real results.",
                },
                {
                  title: "Brand Identity",
                  desc: "Visual and verbal identity systems that give your brand consistency everywhere.",
                },
              ].map((s) => (
                <div key={s.title} className="border-t border-black pt-6">
                  <h3 className="font-semibold mb-3">{s.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <Link href="/services" className="text-sm font-medium hover:underline">
                View all services →
              </Link>
            </div>
          </div>
        </section>

        {/* Location banner */}
        <section className="bg-[#f5f5f5] px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                Where we work
              </p>
              <p className="text-2xl font-bold">Abu Dhabi &amp; Al Ain.</p>
              <p className="text-gray-600 mt-2 text-sm">
                UAE-based, globally-minded. We know the local market inside out.
              </p>
            </div>
            <Link
              href="/about"
              className="text-sm font-medium border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors flex-shrink-0"
            >
              Our Story
            </Link>
          </div>
        </section>

        {/* Intern CTA */}
        <section className="px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Intern Program
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-5">
              Launch your career<br />in social media.
            </h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
              Join the Urbanclicks intern program. Work on real campaigns, build
              your portfolio, and grow inside the UAE&apos;s fastest-moving digital
              industry.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/apply"
                className="bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Apply as Intern
              </Link>
              <Link href="/intern-program" className="text-sm font-medium hover:underline">
                Learn more →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
