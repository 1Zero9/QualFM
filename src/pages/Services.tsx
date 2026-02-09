import { Link } from 'react-router-dom'
import { BadgeCheck, BriefcaseBusiness, ShieldCheck, Wrench } from 'lucide-react'
import { siteContent } from '../content/siteContent'
import './Services.css'

function Services() {
  const content = siteContent.services

  return (
    <div className="services-page">
      <section className="page-hero services-hero">
        <h1>{content.hero.title}</h1>
        <p>{content.hero.subtitle}</p>
      </section>

      <section className="services-content">
        <div className="services-intro">
          <div>
            <h2>{content.intro.title}</h2>
            <p>{content.intro.body}</p>
            <p className="services-intro-note">{content.intro.note}</p>
          </div>
          <img
            src="/images/background/stock/shop-fitout2.png"
            alt="Facilities engineer at work"
          />
        </div>

        <div className="services-grid">
          {content.groups.map((service) => (
            <article key={service.id} className="service-card">
              <h3>{service.title}</h3>
              <p>{service.summary}</p>
              <ul>
                {service.points.map((point) => (
                  <li key={point.id}>{point.text}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="services-credentials">
        <div className="services-credentials-inner">
          <h2>{content.credentials.title}</h2>
          <div className="credential-grid">
            {content.credentials.items.map((credential) => (
              <article key={credential.id} className="credential-item">
                <BadgeCheck size={18} />
                <span>{credential.text}</span>
              </article>
            ))}
          </div>
          <div className="services-flags">
            <span>
              <Wrench size={16} />
              {content.credentials.flags[0].text}
            </span>
            <span>
              <BriefcaseBusiness size={16} />
              {content.credentials.flags[1].text}
            </span>
            <span>
              <ShieldCheck size={16} />
              {content.credentials.flags[2].text}
            </span>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>{content.cta.title}</h2>
        <p>{content.cta.body}</p>
        <Link to="/contact" className="cta-button">{content.cta.button}</Link>
      </section>
    </div>
  )
}

export default Services
