import type { FormEvent } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import { siteContent } from '../content/siteContent'
import BuilderMarker from '../components/BuilderMarker'
import './Contact.css'

function Contact() {
  const content = siteContent.contact

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const message = String(formData.get('message') ?? '').trim()

    const subjectText = name
      ? content.form.subjectTemplate.replace('{name}', name)
      : content.form.subjectFallback

    const subject = encodeURIComponent(subjectText)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )

    window.location.href = `mailto:${content.direct.emailSecondary}?subject=${subject}&body=${body}`
  }

  return (
    <div className="contact-page">
      <section className="page-hero contact-hero">
        <BuilderMarker blockId="BLOCK:contact.hero" label="contact.hero" />
        <h1>{content.hero.title}</h1>
        <p>{content.hero.subtitle}</p>
      </section>

      <section className="contact-shell">
        <article className="contact-panel">
          <BuilderMarker blockId="BLOCK:contact.direct" label="contact.direct" />
          <h2>{content.direct.title}</h2>
          <p>{content.direct.intro}</p>

          <div className="contact-list">
            <p><strong>{content.direct.name}</strong></p>
            <p>
              <Phone size={16} />
              <a href={`tel:${content.direct.phone.replace(/\s+/g, '')}`}>{content.direct.phone}</a>
            </p>
            <p>
              <Mail size={16} />
              <a href={`mailto:${content.direct.emailPrimary}`}>{content.direct.emailPrimary}</a>
            </p>
            <p>
              <Mail size={16} />
              <a href={`mailto:${content.direct.emailSecondary}`}>{content.direct.emailSecondary}</a>
            </p>
            <p>
              <MapPin size={16} />
              <span>{content.direct.address}</span>
            </p>
          </div>
        </article>

        <article className="contact-panel">
          <BuilderMarker blockId="BLOCK:contact.form" label="contact.form" />
          <h2>{content.form.title}</h2>
          <p>{content.form.intro}</p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">{content.form.nameLabel}</label>
              <input type="text" id="name" name="name" required />
            </div>

            <div className="form-group">
              <label htmlFor="email">{content.form.emailLabel}</label>
              <input type="email" id="email" name="email" required />
            </div>

            <div className="form-group">
              <label htmlFor="message">{content.form.messageLabel}</label>
              <textarea id="message" name="message" rows={6} required></textarea>
            </div>

            <button type="submit" className="cta-button">{content.form.button}</button>
          </form>
        </article>
      </section>
    </div>
  )
}

export default Contact
