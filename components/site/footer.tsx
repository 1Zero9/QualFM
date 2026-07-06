/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/news", label: "News" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t-4 border-forest bg-navy text-white">
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <span className="inline-block rounded-xl bg-white px-4 py-2.5">
            <Image
              src="/images/qualfm-logo-tight.png"
              alt="QualFM — Facilities & Maintenance Services"
              width={150}
              height={50}
              className="h-9 w-auto"
            />
          </span>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            Quality, compliance and value across integrated facilities and
            maintenance services nationwide.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white/90">
            Quick links
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-1.5 text-white/70 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white/90">
            Contact
          </h2>
          <div className="mt-4 space-y-3 text-sm text-white/70">
            <a
              href="tel:+353868216215"
              className="flex items-center gap-2.5 transition hover:text-white"
            >
              <Phone size={15} className="shrink-0 text-forest" /> +353 86 821 6215
            </a>
            <a
              href="mailto:richard@qualfm.ie"
              className="flex items-center gap-2.5 transition hover:text-white"
            >
              <Mail size={15} className="shrink-0 text-forest" /> richard@qualfm.ie
            </a>
            <a
              href="mailto:service@qualfm.ie"
              className="flex items-center gap-2.5 transition hover:text-white"
            >
              <Mail size={15} className="shrink-0 text-forest" /> service@qualfm.ie
            </a>
            <p className="flex items-center gap-2.5">
              <MapPin size={15} className="shrink-0 text-forest" /> Portrane, Dublin,
              Ireland
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1120px] flex-col items-center gap-3 px-4 py-5 text-center text-xs text-white/60 md:flex-row md:justify-between md:px-6 md:text-left">
          <p>© {new Date().getFullYear()} QualFM Ltd. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <Link href="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </Link>
            <span aria-hidden>·</span>
            <Link href="/terms" className="hover:text-white">
              Terms &amp; Conditions
            </Link>
            <span aria-hidden>·</span>
            <a
              href="https://1zero9.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white"
              aria-label="Built by 1Zero9 Studio"
            >
              <img src="/images/109-logo-circle1.png" alt="" className="h-4 w-4" />
              Built by 1Zero9 Studio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
