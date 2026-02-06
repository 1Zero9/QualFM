import { Link } from 'react-router-dom'
import { Award, Handshake, Clock, BadgeCheck } from 'lucide-react'
import './About.css'

function About() {
  const credentials = [
    'Safe Electric QC Registered',
    'F-Gas Registered',
    'Fully qualified mechanical and electrical trades personnel',
    'Independent compliance and regulatory control inspections'
  ]

  return (
    <div className="about-page">
      <section className="page-hero">
        <h1>About QualFM</h1>
        <p>Quality, compliance and value across every site we support</p>
      </section>

      <section className="about-content">
        <div className="about-intro">
          <img
            src="https://images.unsplash.com/photo-1761037850943-d91b3866ec22?auto=format&fit=crop&w=1600&q=80"
            alt="Facilities professional working on site"
            className="about-feature-image"
          />
          <h2>Who We Are</h2>
          <p>
            QualFM Ltd was established in December 2024 by Richard Seaver.
            With 25 years of delivery experience across telecoms, healthcare
            and pharmaceutical environments, QualFM was built to provide
            practical facilities and maintenance support with strong customer
            service and dependable technical execution.
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

        <div className="about-values">
          <h2>Compliance Credentials</h2>
          <div className="card-grid">
            {credentials.map((credential) => (
              <div className="card" key={credential}>
                <BadgeCheck className="card-icon" size={24} strokeWidth={1.5} />
                <p>{credential}</p>
              </div>
            ))}
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
