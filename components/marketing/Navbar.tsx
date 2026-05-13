import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b border-[#e5e5e5] bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-base font-bold tracking-tight"
          >
            URBANCLICKS<span className="text-[#c9a84c]">.</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/services"
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              Services
            </Link>
            <Link
              href="/about"
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              About
            </Link>
            <Link
              href="/intern-program"
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              Intern Program
            </Link>
            <Link
              href="/contact"
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              Contact
            </Link>
          </div>

          <Link
            href="/apply"
            className="text-sm bg-black text-white px-5 py-2 hover:bg-gray-800 transition-colors font-medium"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </nav>
  );
}
