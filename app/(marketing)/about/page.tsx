import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Urbanclicks Media",
  description: "Built for brands in the UAE. Learn about Urbanclicks Media's story and mission.",
};

export default function AboutPage() {
  return (
    <div>
      {/* Header */}
      <section className="border-b border-[#e5e5e5] px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Our story
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Built for brands in the UAE.
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
            Urbanclicks Media was founded to bridge the gap between
            international-quality content production and the unique cultural
            pulse of the UAE market.
          </p>
        </div>
      </section>

      {/* Mission + Approach */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-bold mb-5">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              We help UAE brands — from local SMEs in Al Ain to ambitious
              startups in Abu Dhabi — create content that resonates locally and
              scales globally. Every strategy we build is rooted in cultural
              intelligence and platform expertise.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              We believe the UAE market deserves agencies that genuinely
              understand it — not just translate international playbooks and hope
              for the best.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-5">Our Approach</h2>
            <p className="text-gray-600 leading-relaxed">
              We&apos;re not a one-size-fits-all agency. We embed ourselves in
              your brand, understand your audience deeply, and craft content
              strategies that are built to perform — not just look good.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              From Abu Dhabi&apos;s government-adjacent sectors to Al Ain&apos;s
              heritage and hospitality scene, we know how to speak to every
              corner of the Emirates.
            </p>
          </div>
        </div>
      </section>

      {/* Stats banner */}
      <section className="bg-black text-white px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
            {[
              { stat: "UAE-Based", label: "Abu Dhabi & Al Ain" },
              { stat: "100%", label: "Culturally-aware content" },
              { stat: "Full-stack", label: "Strategy to publishing" },
            ].map((item) => (
              <div key={item.stat} className="border-t border-gray-700 pt-8">
                <p className="text-3xl font-bold text-[#c9a84c] mb-2">
                  {item.stat}
                </p>
                <p className="text-gray-400 text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-12">
            What drives us
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Authenticity",
                desc: "We don't produce content for the sake of it. Every piece has a purpose tied to your brand goals.",
              },
              {
                title: "Cultural fluency",
                desc: "We speak the language of the UAE — Arabic, English, and everything in between.",
              },
              {
                title: "Platform mastery",
                desc: "Each platform has its own rules. We build for Instagram, TikTok, LinkedIn, and beyond — not just one.",
              },
              {
                title: "Transparency",
                desc: "Clear reporting, honest timelines, no vanity metrics. You always know what's happening.",
              },
              {
                title: "Intern-first talent",
                desc: "We grow our own talent through our intern program — keeping our team fresh, hungry, and local.",
              },
              {
                title: "Continuous growth",
                desc: "We test, learn, and iterate. The UAE digital market moves fast — so do we.",
              },
            ].map((v) => (
              <div key={v.title} className="border-t border-black pt-6">
                <h3 className="font-semibold mb-3">{v.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
