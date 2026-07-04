import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-forest">404</p>
      <h1 className="mt-2 text-3xl font-bold uppercase italic text-navy">Page not found</h1>
      <p className="mt-3 max-w-md text-ink/70">
        That page doesn&apos;t exist or has moved. Try the homepage, or get in
        touch if you were looking for something specific.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="rounded-full bg-forest px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-forest/85">
          Homepage
        </Link>
        <Link href="/contact" className="rounded-full border border-ink/20 px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-ink hover:bg-ink/5">
          Contact
        </Link>
      </div>
    </main>
  );
}
