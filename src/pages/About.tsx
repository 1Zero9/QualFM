import { Link } from 'react-router-dom'
import { Award, Handshake, Clock } from 'lucide-react'
import './About.css'

function About() {
  return (
    <div className="about-page">
      <section className="page-hero">
        <h1>About QualFM</h1>
        <p>Quality facilities management you can trust</p>
      </section>

      <section className="about-content">
        <div className="about-intro">
          <h2>Who We Are</h2>
          <p>
            QualFM provides comprehensive facilities management services
            to businesses across Ireland. We partner with our clients to
            deliver tailored solutions that keep their buildings running
            smoothly and efficiently.
          </p>
        </div>

        <div className="about-values">
          <h2>Our Values</h2>
          <div className="card-grid card-grid-3">
            <div className="card">
              <Award className="card-icon" size={24} strokeWidth={1.5} />
              <h3>Quality</h3>
              <p>Excellence in every service we deliver</p>
            </div>
            <div className="card">
              <Handshake className="card-icon" size={24} strokeWidth={1.5} />
              <h3>Partnership</h3>
              <p>Working alongside our clients as trusted partners</p>
            </div>
            <div className="card">
              <Clock className="card-icon" size={24} strokeWidth={1.5} />
              <h3>Reliability</h3>
              <p>Consistent, dependable service you can count on</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Work Together?</h2>
        <Link to="/contact" className="cta-button">Get in Touch</Link>
      </section>
    </div>
  )
}

export default About
