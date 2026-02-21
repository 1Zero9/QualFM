import { Link } from 'react-router-dom'
import { Award, BadgeCheck, Handshake } from 'lucide-react'
import { siteContent } from '../content/siteContent'
import BuilderMarker from '../components/BuilderMarker'
import './About.css'

function About() {
  const content = siteContent.about
  const valueIcons = [Award, BadgeCheck, Handshake]

  return (
    <div className="about-page">
      <section className="page-hero">
        <BuilderMarker blockId="BLOCK:about.hero" label="about.hero" />
        <h1>{content.hero.title}</h1>
        <p>{content.hero.subtitle}</p>
      </section>

      <section className="about-content">
        <div className="about-intro">
          <BuilderMarker blockId="BLOCK:about.intro" label="about.intro" />
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
          <BuilderMarker blockId="BLOCK:about.values" label="about.values" />
          <h2>{content.values.title}</h2>
          <div className="card-grid card-grid-3">
            {content.values.cards.map((card, index) => {
              const Icon = valueIcons[index % valueIcons.length]
              return (
                <div className="card" key={card.id}>
                  <Icon className="card-icon" size={24} strokeWidth={1.5} />
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="about-values">
          <BuilderMarker blockId="BLOCK:about.approach" label="about.approach" />
          <h2>{content.approach.title}</h2>
          <ul className="about-approach-list">
            {content.approach.points.map((point) => (
              <li key={point.id}>{point.text}</li>
            ))}
          </ul>
        </div>

        <div className="about-values">
          <BuilderMarker blockId="BLOCK:about.scope" label="about.scope" />
          <h2>{content.scope.title}</h2>
          {content.scope.paragraphs.map((paragraph) => (
            <p key={paragraph.id}>{paragraph.text}</p>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <BuilderMarker blockId="BLOCK:about.cta" label="about.cta" />
        <h2>{content.cta.title}</h2>
        <Link to="/contact" className="cta-button">{content.cta.button}</Link>
      </section>
    </div>
  )
}

export default About
