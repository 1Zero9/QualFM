import { Link } from 'react-router-dom'
import './Contact.css'

function Contact() {
  return (
    <div className="contact-page">
      <Link to="/" className="contact-backdrop" aria-label="Back to home" />

      <div className="contact-content">
        <Link to="/" className="back-link">&larr; Back</Link>
        <img src="/images/qualfm-mainlogo-trans.png" alt="QualFM" className="contact-logo" />
        <h1>Contact Us</h1>
        <p>Get in touch with QualFM</p>

        <form className="contact-form">
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
