import { Mail, MapPin, Phone } from "lucide-react";
import { siteContent } from "@/lib/content";
import { ContactForm } from "./contact-form";

export const metadata = {
  title: "Contact QualFM | Facilities Management Enquiries Ireland",
  description:
    "Get in touch with QualFM for facilities management, planned maintenance, reactive works, and fitout project enquiries anywhere in Ireland.",
};

export default function ContactPage() {
  const content = siteContent.contact;

  return (
    <>
      <section className="bg-navy py-16 text-center">
        <div className="mx-auto max-w-[760px] px-4">
          <h1 className="text-3xl font-bold text-white md:text-5xl">
            {content.hero.title}
          </h1>
          <p className="mt-3 text-white/80">{content.hero.subtitle}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1120px] grid-cols-1 gap-10 px-4 py-14 md:grid-cols-5 md:px-6">
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold text-navy">{content.direct.title}</h2>
          <p className="mt-2 text-sm text-ink/70">{content.direct.intro}</p>
          <div className="mt-6 space-y-4">
            <a href="tel:+353868216215" className="flex items-center gap-3 rounded-xl bg-white p-4 text-sm font-semibold text-ink shadow-sm transition hover:shadow-md">
              <span className="flex size-10 items-center justify-center rounded-full bg-teal-soft text-forest"><Phone size={17} /></span>
              {content.direct.phone}
            </a>
            <a href={`mailto:${content.direct.emailPrimary}`} className="flex items-center gap-3 rounded-xl bg-white p-4 text-sm font-semibold text-ink shadow-sm transition hover:shadow-md">
              <span className="flex size-10 items-center justify-center rounded-full bg-teal-soft text-forest"><Mail size={17} /></span>
              {content.direct.emailPrimary}
            </a>
            <a href={`mailto:${content.direct.emailSecondary}`} className="flex items-center gap-3 rounded-xl bg-white p-4 text-sm font-semibold text-ink shadow-sm transition hover:shadow-md">
              <span className="flex size-10 items-center justify-center rounded-full bg-teal-soft text-forest"><Mail size={17} /></span>
              {content.direct.emailSecondary}
            </a>
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 text-sm font-semibold text-ink shadow-sm">
              <span className="flex size-10 items-center justify-center rounded-full bg-teal-soft text-forest"><MapPin size={17} /></span>
              {content.direct.address}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm md:col-span-3 md:p-8">
          <h2 className="text-xl font-bold text-navy">{content.form.title}</h2>
          <p className="mt-2 text-sm text-ink/70">{content.form.intro}</p>
          <div className="mt-6">
            <ContactForm buttonLabel={content.form.button} />
          </div>
        </div>
      </section>
    </>
  );
}
