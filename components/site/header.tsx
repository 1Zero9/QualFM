"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";
  const showMobileBarLogo = !isHome || scrolled;

  return (
    <header className="sticky top-0 z-50 bg-navy md:border-b md:border-ink/10 md:bg-white md:shadow-sm">
      <div className="relative mx-auto flex h-16 max-w-[1120px] items-center justify-between gap-4 px-4 md:h-20 md:px-6">
        {/* Desktop: logo left */}
        <Link
          href="/"
          className="hidden items-center md:flex"
          onClick={() => setOpen(false)}
          aria-label="QualFM home"
        >
          <Image
            src="/images/qualfm-logo-tight.png"
            alt="QualFM — Facilities & Maintenance Services"
            width={168}
            height={56}
            priority
            className="h-12 w-auto"
          />
        </Link>

        {/* Mobile: phone left */}
        <a
          href="tel:+353868216215"
          className="rounded-lg p-2 text-white hover:bg-white/10 md:hidden"
          aria-label="Call QualFM"
        >
          <Phone size={20} />
        </a>

        {/* Mobile: centered logo — hidden at top of homepage, shown on scroll or other pages */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          aria-label="QualFM home"
          tabIndex={showMobileBarLogo ? 0 : -1}
          aria-hidden={!showMobileBarLogo}
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white px-2.5 py-1 shadow-sm transition-opacity duration-300 md:hidden ${
            showMobileBarLogo ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <Image
            src="/images/qualfm-logo-tight.png"
            alt="QualFM — Facilities & Maintenance Services"
            width={126}
            height={42}
            className="h-7 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                pathname === link.href
                  ? "bg-teal-soft text-forest"
                  : "text-ink/70 hover:bg-teal-soft/60 hover:text-navy"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="tel:+353868216215"
            className="hidden items-center gap-2 text-sm font-medium text-ink/70 hover:text-navy lg:flex"
          >
            <Phone size={15} /> +353 86 821 6215
          </a>
          <Link
            href="/contact"
            className="hidden rounded-lg bg-forest px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-forest/90 md:block"
          >
            Contact Us
          </Link>
          <button
            className="rounded-lg p-2 text-white hover:bg-white/10 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
      <nav
        className={`fixed inset-y-0 right-0 z-50 flex w-3/4 flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Mobile menu"
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-4 py-4">
          <Image
            src="/images/qualfm-logo-tight.png"
            alt="QualFM"
            width={108}
            height={36}
            className="h-9 w-auto"
          />
          <button
            className="rounded-lg p-2 text-navy hover:bg-teal-soft"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            tabIndex={open ? 0 : -1}
          >
            <X size={22} />
          </button>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto px-4 pb-8 pt-4">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className={`block rounded-lg px-4 py-3 text-base font-semibold ${
                pathname === link.href ? "bg-teal-soft text-forest" : "text-ink/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            className="mt-4 block rounded-lg bg-forest px-5 py-3 text-center text-sm font-semibold text-white"
          >
            Contact Us
          </Link>
          <a
            href="tel:+353868216215"
            tabIndex={open ? 0 : -1}
            className="mt-4 flex items-center justify-center gap-2 text-sm text-ink/70"
          >
            <Phone size={15} /> +353 86 821 6215
          </a>
        </div>
      </nav>
    </header>
  );
}
