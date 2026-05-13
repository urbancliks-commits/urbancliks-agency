import type { Metadata } from "next";
import { ContactForm } from "@/components/marketing/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Urbanclicks Media",
  description: "Get in touch with Urbanclicks Media. Based in Abu Dhabi and Al Ain, UAE.",
};

export default function ContactPage() {
  return (
    <div>
      <section className="border-b border-[#e5e5e5] px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Contact
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Let&apos;s talk.
          </h1>
          <p className="text-gray-600 max-w-xl">
            Questions about our services, a project brief, or just want to say
            hello — we&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact details */}
          <div>
            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                Email
              </p>
              <a
                href="mailto:hello@urbanclicks.ae"
                className="text-lg font-medium hover:text-gray-600 transition-colors"
              >
                hello@urbanclicks.ae
              </a>
            </div>

            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                Location
              </p>
              <p className="text-gray-700">Abu Dhabi, United Arab Emirates</p>
              <p className="text-gray-700">Al Ain, United Arab Emirates</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                Response time
              </p>
              <p className="text-gray-700 text-sm">
                We aim to reply within 2 business days. For urgent matters,
                drop us a message on Instagram.
              </p>
            </div>
          </div>

          {/* Form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
