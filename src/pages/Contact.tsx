import type { FormEvent } from 'react'
import { useState } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import { siteContent } from '../content/siteContent'
import './Contact.css'

function Contact() {
  const content = siteContent.contact
  const [directMailLink, setDirectMailLink] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  function buildMailtoLink(name: string, email: string, message: string) {
    const subjectText = name
      ? content.form.subjectTemplate.replace('{name}', name)
      : content.form.subjectFallback
    const subject = encodeURIComponent(subjectText)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)
    return `mailto:${content.direct.emailSecondary}?subject=${subject}&body=${body}`
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget

    const formData = new FormData(form)
    const name = String(formData.get('name') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const message = String(formData.get('message') ?? '').trim()
    const mailtoUrl = buildMailtoLink(name, email, message)
    setDirectMailLink(mailtoUrl)
    setSubmitStatus('idle')
    setSubmitMessage('')
    setIsSubmitting(true)

    const subject = name
      ? content.form.subjectTemplate.replace('{name}', name)
      : content.form.subjectFallback

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, subject })
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null
        setSubmitStatus('error')
        setSubmitMessage(payload?.error || `Unable to send your message right now (HTTP ${response.status}).`)
        return
      }

      form.reset()
      setSubmitStatus('success')
      setSubmitMessage('Thanks, your enquiry has been sent. We will respond shortly.')
      setDirectMailLink('')
    } catch {
      setSubmitStatus('error')
      setSubmitMessage('Unable to send your message right now (network error).')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="contact-page">
      <section className="page-hero contact-hero">
        <h1>{content.hero.title}</h1>
        <p>{content.hero.subtitle}</p>
      </section>

      <section className="contact-shell">
        <article className="contact-panel">
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
          <h2>{content.form.title}</h2>
          <p>{content.form.intro}</p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <p id="contact-form-help" className="form-help">
              Submitting sends your enquiry directly to our team.
            </p>
            <div className="form-group">
              <label htmlFor="name">{content.form.nameLabel}</label>
              <input type="text" id="name" name="name" autoComplete="name" required />
            </div>

            <div className="form-group">
              <label htmlFor="email">{content.form.emailLabel}</label>
              <input type="email" id="email" name="email" autoComplete="email" required />
            </div>

            <div className="form-group">
              <label htmlFor="message">{content.form.messageLabel}</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                minLength={20}
                aria-describedby="contact-form-help"
                required
              ></textarea>
            </div>

            <button type="submit" className="cta-button" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : content.form.button}
            </button>
          </form>
          {submitStatus !== 'idle' && (
            <p className={`form-status ${submitStatus === 'success' ? 'is-success' : 'is-error'}`}>
              {submitMessage}
            </p>
          )}
          {submitStatus === 'error' && directMailLink && (
            <p className="fallback-mailto">
              Need a fallback? <a href={directMailLink}>Open message in your email app</a>.
            </p>
          )}
        </article>
      </section>
    </div>
  )
}

export default Contact
