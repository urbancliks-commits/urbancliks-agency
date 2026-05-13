import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#e5e5e5] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <p className="text-base font-bold tracking-tight mb-3">
              URBANCLICKS<span className="text-[#c9a84c]">.</span>
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Content strategy and social media management for brands that want to grow in the UAE.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Navigation
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                { href: "/services", label: "Services" },
                { href: "/about", label: "About" },
                { href: "/intern-program", label: "Intern Program" },
                { href: "/apply", label: "Apply" },
                { href: "/contact", label: "Contact" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-gray-500 hover:text-black transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Get in touch
            </p>
            <p className="text-sm text-gray-500">Abu Dhabi &amp; Al Ain, UAE</p>
            <p className="text-sm text-gray-500 mt-1.5">hello@urbanclicks.ae</p>
            <Link
              href="/login"
              className="text-xs text-gray-400 hover:text-black mt-6 inline-block transition-colors"
            >
              Admin Login →
            </Link>
          </div>
        </div>

        <div className="border-t border-[#e5e5e5] mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © 2025 Urbanclicks Media. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">Abu Dhabi &amp; Al Ain, UAE</p>
        </div>
      </div>
    </footer>
  );
}
