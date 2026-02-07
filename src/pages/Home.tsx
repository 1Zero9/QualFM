import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ArrowRight, BadgeCheck, MapPin, Phone, Quote, Star, Wrench } from 'lucide-react'
import { clients } from '../data/clients'
import './Home.css'

const servicePillars = [
  'Integrated Facilities & Maintenance Management',
  'Fitout Projects up to EUR 1.5m',
  'Electrical Planned, Preventative & Reactive Maintenance',
  'Mechanical Maintenance and Water Treatment',
  'Building Fabric & Soft Services',
  'Independent Compliance Auditing'
]

const sectors = [
  'Commercial Offices',
  'Telecom and Critical Environments',
  'Healthcare',
  'Pharmaceutical',
  'Industrial Sites',
  'Retail and Public-Facing Premises'
]

const testimonials = [
  {
    quote: "QualFM transformed how we manage our facilities. Their team is responsive, professional, and truly understands our needs.",
    author: "Sarah O'Connell",
    company: "Operations Manager, Northpoint Business Campus"
  },
  {
    quote: "Reliable, efficient, and always going above and beyond. We couldn't ask for a better FM partner.",
    author: "Michael Byrne",
    company: "Facilities Director, CareWell Health Group"
  },
  {
    quote: "The level of service and attention to detail from QualFM is outstanding. They've made facility management effortless.",
    author: "Niamh Gallagher",
    company: "Property Manager, Connacht Retail Estates"
  }
]

const trustPoints = [
  'Safe Electric QC Registered',
  'F-Gas Registered',
  'Fully Qualified Mechanical and Electrical Trades Personnel',
  'Nationwide Coverage'
]

function Home() {
  const [isMotionComplete, setIsMotionComplete] = useState(false)

  return (
    <div className="home-page">
      <div className="home-motion-band">
        <div className={`home-motion-video-wrap ${isMotionComplete ? 'is-complete' : ''}`} aria-hidden="true">
          <video
            className="home-motion-video"
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={() => setIsMotionComplete(true)}
          >
            <source src="/images/background/stock/walkthrough.mp4" type="video/mp4" />
          </video>
        </div>

        <section className="hero">
        <div className="hero-layout">
          <div className="hero-copy">
            <img src="/images/qualfm-mainlogo-trans.png" alt="QualFM" className="hero-logo" />
            <p className="hero-kicker">Quality - Compliance - Value</p>
            <h1>Facilities support that keeps your business running</h1>
            <p className="hero-text">
              QualFM helps clients outsource non-core facilities services so they can focus on core business operations.
              We deliver planned, preventative and reactive support with compliance at the center.
            </p>
            <div className="hero-actions">
              <Link to="/services" className="hero-primary">
                View Services
                <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="hero-secondary">Contact Richard</Link>
            </div>
          </div>

          <aside className="hero-panel">
            <h2>Why QualFM</h2>
            <ul>
              <li>
                <Wrench size={16} />
                <span>Integrated FM and technical maintenance delivery</span>
              </li>
              <li>
                <BadgeCheck size={16} />
                <span>Safe Electric QC and F-Gas registered</span>
              </li>
              <li>
                <MapPin size={16} />
                <span>Based in Portrane, serving sites nationwide</span>
              </li>
              <li>
                <Phone size={16} />
                <a href="tel:+353868216215">+353 86 821 6215</a>
              </li>
              <li>
                <BadgeCheck size={16} />
                <span>Fitout project delivery up to EUR 1.5m</span>
              </li>
              <li>
                <Wrench size={16} />
                <span>Planned preventative and reactive response model</span>
              </li>
              <li>
                <BadgeCheck size={16} />
                <span>Independent compliance auditing and reporting</span>
              </li>
            </ul>
          </aside>
        </div>
      </section>

        <section className="home-section core-services-section">
        <div className="section-inner">
          <h2>Core Services</h2>
          <div className="pillars-grid">
            {servicePillars.map((pillar) => (
              <article key={pillar} className="pillar-card">
                <p>{pillar}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      </div>

      <section className="home-section home-section-soft">
        <div className="section-inner">
          <h2>Sectors We Support</h2>
          <p>
            Our team has deep experience in telecoms, healthcare and pharmaceutical operations,
            with active support across office, industrial and public-facing environments.
          </p>
          <div className="sector-tags">
            {sectors.map((sector) => (
              <span key={sector}>{sector}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-inner">
          <div className="feedback-intro">
            <h2>Client Feedback</h2>
            <p>What clients say about working with QualFM.</p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <article key={testimonial.author} className="testimonial-card">
                <div className="testimonial-stars" aria-hidden="true">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
                <Quote size={18} className="testimonial-quote-icon" />
                <blockquote>{testimonial.quote}</blockquote>
                <p className="testimonial-name">{testimonial.author}</p>
                <p className="testimonial-role">{testimonial.company}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section-soft">
        <div className="section-inner">
          <h2>Trust and Compliance</h2>
          <div className="trust-points">
            {trustPoints.map((point) => (
              <span key={point}>{point}</span>
            ))}
          </div>
          <p className="home-closing">
            Established in December 2024 by Richard Seaver, QualFM combines 25 years of sector experience with
            a practical service model focused on customer care, quality workmanship and dependable compliance.
          </p>
          <Link to="/about" className="inline-link">Read our story</Link>
        </div>
      </section>

      <section className="home-section">
        <div className="section-inner">
          <h2>Our Clients</h2>
          <p>Selected client sites (click logo to visit).</p>
          <div className="clients-logo-grid">
            {clients.map((client) => (
              <a
                key={client.websiteUrl}
                href={client.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="client-logo-card"
                aria-label={`Visit ${client.name}`}
                title={client.name}
              >
                <img src={client.logoSrc} alt={client.logoAlt} loading="lazy" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
