import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
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
      <Link to="/" className="contact-backdrop" aria-label="Back to home" />

      <div className="contact-content">
        <Link to="/" className="back-link">&larr; Back</Link>
        <img src="/images/qualfm-mainlogo-trans.png" alt="QualFM" className="contact-logo" />
        <h1>Contact Us</h1>
        <p>Get in touch with QualFM Ltd</p>

        <div className="contact-direct">
          <p><strong>Richard Seaver</strong></p>
          <p><a href="tel:+353868216215">+353 86 821 6215</a></p>
          <p><a href="mailto:richard@qualfm.ie">richard@qualfm.ie</a></p>
          <p><a href="mailto:service@qualfm.ie">service@qualfm.ie</a></p>
          <p>Middlefield Stables, Portrane, Co. Dublin, K36 T189</p>
        </div>

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
            <textarea id="message" name="message" rows={5} required></textarea>
          </div>

          <button type="submit" className="cta-button">Send Message</button>
        </form>
      </div>
    </div>
  )
}

export default Contact
