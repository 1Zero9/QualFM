import { Link } from 'react-router-dom'
import { Award, BadgeCheck, Handshake } from 'lucide-react'
import './About.css'

function About() {
  const approachPoints = [
    'Established in December 2024 by Richard Seaver',
    '25 years of delivery experience across telecoms, healthcare and pharmaceutical sectors',
    'Built around quality service, top-class customer care and dependable compliance',
    'Strong client alignment through practical understanding of operational goals'
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
            src="/images/background/stock/shop-fitout1.png"
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
          <p>
            Our goals are to deliver high-quality services with an emphasis on top-class customer service,
            quality workmanship and compliance through a dedicated team of professionals and technicians.
          </p>
          <p>
            We work closely with customers to build a meaningful understanding of their business and align
            delivery with strategic goals.
          </p>
        </div>

        <div className="about-values">
          <h2>Our Values</h2>
          <div className="card-grid card-grid-3">
            <div className="card">
              <Award className="card-icon" size={24} strokeWidth={1.5} />
              <h3>Quality</h3>
              <p>Consistent workmanship and service delivery standards on every site.</p>
            </div>
            <div className="card">
              <BadgeCheck className="card-icon" size={24} strokeWidth={1.5} />
              <h3>Compliance</h3>
              <p>Regulatory alignment, safety, and audit-ready operational controls.</p>
            </div>
            <div className="card">
              <Handshake className="card-icon" size={24} strokeWidth={1.5} />
              <h3>Value</h3>
              <p>Practical solutions that protect performance, cost, and continuity.</p>
            </div>
          </div>
        </div>

        <div className="about-values">
          <h2>Our Approach</h2>
          <ul className="about-approach-list">
            {approachPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>

        <div className="about-values">
          <h2>Scope We Serve</h2>
          <p>
            QualFM supports commercial offices, telecom and critical environments, healthcare,
            pharmaceutical facilities and other regulated or public-facing sites nationwide.
          </p>
          <p>
            Detailed technical capabilities, service line items and compliance credentials are listed
            on the Services page to avoid duplication across the website.
          </p>
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
