import type { FormEvent } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import './Contact.css'

function Contact() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const message = String(formData.get('message') ?? '').trim()

    const subject = encodeURIComponent(`Website enquiry from ${name || 'QualFM visitor'}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )

    window.location.href = `mailto:service@qualfm.ie?subject=${subject}&body=${body}`
  }

  return (
    <div className="contact-page">
      <section className="page-hero contact-hero">
        <h1>Contact</h1>
        <p>Talk to QualFM about your facilities and maintenance requirements</p>
      </section>

      <section className="contact-shell">
        <article className="contact-panel">
          <h2>Direct Contact</h2>
          <p>Reach our team directly for service enquiries, planned works and project requests.</p>

          <div className="contact-list">
            <p><strong>Richard Seaver</strong></p>
            <p>
              <Phone size={16} />
              <a href="tel:+353868216215">+353 86 821 6215</a>
            </p>
            <p>
              <Mail size={16} />
              <a href="mailto:richard@qualfm.ie">richard@qualfm.ie</a>
            </p>
            <p>
              <Mail size={16} />
              <a href="mailto:service@qualfm.ie">service@qualfm.ie</a>
            </p>
            <p>
              <MapPin size={16} />
              <span>Middlefield Stables, Portrane, Co. Dublin, K36 T189</span>
            </p>
          </div>
        </article>

        <article className="contact-panel">
          <h2>Send An Enquiry</h2>
          <p>This form opens your email app and prepares the message to service@qualfm.ie.</p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={6} required></textarea>
            </div>

            <button type="submit" className="cta-button">Email QualFM</button>
          </form>
        </article>
      </section>
    </div>
  )
}

export default Contact
