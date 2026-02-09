import { Link } from 'react-router-dom'
import { Award, BadgeCheck, Handshake } from 'lucide-react'
import { siteContent } from '../content/siteContent'
import './About.css'

function About() {
  const content = siteContent.about

  return (
    <div className="about-page">
      <section className="page-hero">
        <h1>{content.hero.title}</h1>
        <p>{content.hero.subtitle}</p>
      </section>

      <section className="about-content">
        <div className="about-intro">
          <img
            src="/images/background/stock/shop-fitout1.png"
            alt="Facilities professional working on site"
            className="about-feature-image"
          />
          <h2>{content.intro.title}</h2>
          {content.intro.paragraphs.map((paragraph) => (
            <p key={paragraph.id}>{paragraph.text}</p>
          ))}
        </div>

        <div className="about-values">
          <h2>{content.values.title}</h2>
          <div className="card-grid card-grid-3">
            <div className="card">
              <Award className="card-icon" size={24} strokeWidth={1.5} />
              <h3>{content.values.cards[0].title}</h3>
              <p>{content.values.cards[0].text}</p>
            </div>
            <div className="card">
              <BadgeCheck className="card-icon" size={24} strokeWidth={1.5} />
              <h3>{content.values.cards[1].title}</h3>
              <p>{content.values.cards[1].text}</p>
            </div>
            <div className="card">
              <Handshake className="card-icon" size={24} strokeWidth={1.5} />
              <h3>{content.values.cards[2].title}</h3>
              <p>{content.values.cards[2].text}</p>
            </div>
          </div>
        </div>

        <div className="about-values">
          <h2>{content.approach.title}</h2>
          <ul className="about-approach-list">
            {content.approach.points.map((point) => (
              <li key={point.id}>{point.text}</li>
            ))}
          </ul>
        </div>

        <div className="about-values">
          <h2>{content.scope.title}</h2>
          {content.scope.paragraphs.map((paragraph) => (
            <p key={paragraph.id}>{paragraph.text}</p>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2>{content.cta.title}</h2>
        <Link to="/contact" className="cta-button">{content.cta.button}</Link>
      </section>
    </div>
  )
}

export default About
