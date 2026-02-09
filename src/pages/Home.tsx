import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ArrowRight, BadgeCheck, MapPin, Phone, Quote, Star, Wrench } from 'lucide-react'
import { clients } from '../data/clients'
import { siteContent } from '../content/siteContent'
import './Home.css'

function Home() {
  const [isMotionComplete, setIsMotionComplete] = useState(false)
  const content = siteContent.home

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
              <p className="hero-kicker">{content.hero.kicker}</p>
              <h1>{content.hero.title}</h1>
              <p className="hero-text">{content.hero.body}</p>
              <div className="hero-actions">
                <Link to="/services" className="hero-primary">
                  {content.hero.primaryCta}
                  <ArrowRight size={18} />
                </Link>
                <Link to="/contact" className="hero-secondary">{content.hero.secondaryCta}</Link>
              </div>
            </div>

            <aside className="hero-panel">
              <h2>{content.hero.whyTitle}</h2>
              <ul>
                <li>
                  <Wrench size={16} />
                  <span>{content.hero.whyPoints[0].text}</span>
                </li>
                <li>
                  <BadgeCheck size={16} />
                  <span>{content.hero.whyPoints[1].text}</span>
                </li>
                <li>
                  <MapPin size={16} />
                  <span>{content.hero.whyPoints[2].text}</span>
                </li>
                <li>
                  <Phone size={16} />
                  <a href="tel:+353868216215">{content.hero.whyPoints[3].text}</a>
                </li>
                <li>
                  <BadgeCheck size={16} />
                  <span>{content.hero.whyPoints[4].text}</span>
                </li>
                <li>
                  <Wrench size={16} />
                  <span>{content.hero.whyPoints[5].text}</span>
                </li>
                <li>
                  <BadgeCheck size={16} />
                  <span>{content.hero.whyPoints[6].text}</span>
                </li>
              </ul>
            </aside>
          </div>
        </section>

        <section className="home-section core-services-section">
          <div className="section-inner">
            <h2>{content.coreServices.title}</h2>
            <div className="pillars-grid">
              {content.coreServices.pillars.map((pillar) => (
                <article key={pillar.id} className="pillar-card">
                  <p>{pillar.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="home-section home-section-soft">
        <div className="section-inner">
          <h2>{content.sectors.title}</h2>
          <p>{content.sectors.intro}</p>
          <div className="sector-tags">
            {content.sectors.tags.map((sector) => (
              <span key={sector.id}>{sector.text}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-inner">
          <div className="feedback-intro">
            <h2>{content.feedback.title}</h2>
            <p>{content.feedback.intro}</p>
          </div>

          <div className="testimonials-grid">
            {content.feedback.testimonials.map((testimonial) => (
              <article key={testimonial.id} className="testimonial-card">
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
          <h2>{content.trust.title}</h2>
          <div className="trust-points">
            {content.trust.points.map((point) => (
              <span key={point.id}>{point.text}</span>
            ))}
          </div>
          <p className="home-closing">{content.trust.closing}</p>
          <Link to="/about" className="inline-link">{content.trust.linkText}</Link>
        </div>
      </section>

      <section className="home-section">
        <div className="section-inner">
          <h2>{content.clients.title}</h2>
          <p>{content.clients.intro}</p>
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
