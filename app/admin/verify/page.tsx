export const metadata = { title: "Confirm sign-in", robots: { index: false } };

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-forest">
          QualFM Admin
        </p>
        <h1 className="mt-1 text-2xl font-bold text-navy">Confirm sign-in</h1>
        {token ? (
          <>
            <p className="mt-2 text-sm text-ink/70">
              Click below to finish signing in. This confirms it was you, not
              your email client, that opened the link.
            </p>
            <form action="/api/auth/verify" method="post" className="mt-6">
              <input type="hidden" name="token" value={token} />
              <button
                type="submit"
                className="w-full rounded-lg bg-forest px-4 py-2.5 font-semibold text-white transition hover:bg-forest/90"
              >
                Confirm sign-in
              </button>
            </form>
          </>
        ) : (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            Missing sign-in token. Request a new link from the sign-in page.
          </p>
        )}
      </div>
    </main>
  );
}
