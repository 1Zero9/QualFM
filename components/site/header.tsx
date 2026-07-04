"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/news", label: "News" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy text-white shadow-lg">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          className="flex items-baseline gap-0.5"
          onClick={() => setOpen(false)}
          aria-label="QualFM home"
        >
          <span className="text-2xl font-bold italic tracking-tight text-white">
            Qual<span className="text-emerald-300">FM</span>
          </span>
          <span className="ml-2 hidden text-[10px] font-medium uppercase tracking-widest text-white/50 sm:block">
            Facilities &amp; Maintenance
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-wide transition ${
                pathname === link.href
                  ? "bg-white/15 text-white"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="tel:+353868216215"
            className="hidden items-center gap-2 text-sm font-medium text-white/80 hover:text-white lg:flex"
          >
            <Phone size={15} /> +353 86 821 6215
          </a>
          <Link
            href="/contact"
            className="hidden rounded-full bg-forest px-5 py-2 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-forest/85 md:block"
          >
            Get a quote
          </Link>
          <button
            className="rounded-lg p-2 hover:bg-white/10 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-navy px-4 pb-6 pt-2 md:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-4 py-3 text-base font-semibold ${
                pathname === link.href ? "bg-white/15 text-white" : "text-white/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-full bg-forest px-5 py-3 text-center text-sm font-bold uppercase tracking-wide text-white"
          >
            Get a quote
          </Link>
          <a
            href="tel:+353868216215"
            className="mt-3 flex items-center justify-center gap-2 text-sm text-white/80"
          >
            <Phone size={15} /> +353 86 821 6215
          </a>
        </nav>
      )}
    </header>
  );
}
