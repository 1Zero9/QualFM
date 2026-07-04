/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <p className="text-lg font-bold uppercase italic">QualFM</p>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            Quality, compliance and value across integrated facilities and
            maintenance services nationwide.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white/90">Quick links</h4>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <Link href="/" className="text-white/70 hover:text-white">Home</Link>
            <Link href="/services" className="text-white/70 hover:text-white">Services</Link>
            <Link href="/projects" className="text-white/70 hover:text-white">Projects</Link>
            <Link href="/news" className="text-white/70 hover:text-white">News</Link>
            <Link href="/about" className="text-white/70 hover:text-white">About</Link>
            <Link href="/contact" className="text-white/70 hover:text-white">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white/90">Contact</h4>
          <div className="mt-3 space-y-1.5 text-sm text-white/70">
            <p><a href="mailto:richard@qualfm.ie" className="hover:text-white">richard@qualfm.ie</a></p>
            <p><a href="mailto:service@qualfm.ie" className="hover:text-white">service@qualfm.ie</a></p>
            <p><a href="tel:+353868216215" className="hover:text-white">+353 86 821 6215</a></p>
            <p>Dublin, Ireland</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-white/60 md:px-6">
          <p>© {new Date().getFullYear()} QualFM Ltd. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <span aria-hidden>·</span>
            <Link href="/terms" className="hover:text-white">Terms &amp; Conditions</Link>
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
