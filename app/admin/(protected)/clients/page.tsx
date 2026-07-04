/* eslint-disable @next/next/no-img-element */
import { asc } from "drizzle-orm";
import { clients, db } from "@/lib/db";
import {
  deleteClient,
  saveClient,
  setClientPublished,
} from "@/lib/admin/actions";
import { siteContent } from "@/lib/content";
import {
  Badge,
  PageHeader,
  btnDanger,
  btnGhost,
  btnPrimary,
  inputCls,
  labelCls,
} from "../ui";

export const metadata = { title: "Clients" };

function ClientForm({ client }: { client?: typeof clients.$inferSelect }) {
  return (
    <form
      action={saveClient}
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
      encType="multipart/form-data"
    >
      {client && <input type="hidden" name="id" value={client.id} />}
      <label className={labelCls}>
        Client name *
        <input
          name="name"
          required
          defaultValue={client?.name}
          className={inputCls}
          placeholder="Acme Ltd"
        />
      </label>
      <label className={labelCls}>
        Website (optional)
        <input
          name="websiteUrl"
          type="url"
          defaultValue={client?.websiteUrl}
          className={inputCls}
          placeholder="https://example.com"
        />
      </label>
      <label className={labelCls}>
        Logo {client ? "(leave empty to keep current)" : "*"}
        <input type="file" name="imageFile" accept="image/*" className={inputCls} />
      </label>
      <label className={labelCls}>
        Sort order
        <input type="number" name="sort" defaultValue={client?.sort ?? 0} className={inputCls} />
      </label>
      <div className="self-end">
        <button className={btnPrimary}>{client ? "Save" : "Add client"}</button>
      </div>
    </form>
  );
}

export default async function ClientsPage() {
  const all = await db.select().from(clients).orderBy(asc(clients.sort), asc(clients.id));
  const usingDefaults = all.filter((c) => c.published).length === 0;

  return (
    <div>
      <PageHeader
        title="Clients"
        subtitle="Logos shown in the homepage client strip. Published clients appear in sort order."
      />

      {usingDefaults && (
        <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          No published clients here yet, so the site is showing its{" "}
          {siteContent.clients.length} built-in defaults. Add and publish
          clients below to take over.
        </div>
      )}

      <div className="mt-6 space-y-4">
        {all.map((client) => (
          <details key={client.id} className="rounded-xl border border-ink/10 bg-white shadow-sm">
            <summary className="flex cursor-pointer flex-wrap items-center gap-3 p-4">
              <span className="flex h-12 w-20 shrink-0 items-center justify-center rounded-lg border border-ink/10 bg-white p-1">
                <img
                  src={client.logoUrl}
                  alt=""
                  className="max-h-10 max-w-full object-contain"
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-navy">{client.name}</p>
                {client.websiteUrl && (
                  <p className="truncate text-xs text-ink/60">{client.websiteUrl}</p>
                )}
              </div>
              {client.published ? <Badge tone="live">Published</Badge> : <Badge tone="amber">Draft</Badge>}
              <span className="flex gap-2">
                <form action={setClientPublished.bind(null, client.id, !client.published)}>
                  <button className={btnGhost}>{client.published ? "Unpublish" : "Publish"}</button>
                </form>
                <form action={deleteClient.bind(null, client.id)}>
                  <button className={btnDanger}>Delete</button>
                </form>
              </span>
            </summary>
            <div className="border-t border-ink/10 p-4">
              <ClientForm client={client} />
            </div>
          </details>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-ink/10 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-navy">New client</h2>
        <ClientForm />
      </div>
    </div>
  );
}
