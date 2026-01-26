import { Link, useParams } from 'react-router-dom'
import { sectors } from './Sectors'
import './About.css'

function SectorDetail() {
  const { slug } = useParams<{ slug: string }>()
  const sector = sectors.find(s => s.slug === slug)

  if (!sector) {
    return (
      <div className="about-page">
        <section className="page-hero">
          <h1>Sector Not Found</h1>
          <p>The sector you're looking for doesn't exist</p>
        </section>
        <section className="about-content">
          <div className="about-intro">
            <Link to="/sectors" className="back-link">← Back to Sectors</Link>
          </div>
        </section>
      </div>
    )
  }

  const IconComponent = sector.icon

  return (
    <div className="about-page">
      <section className="page-hero">
        <h1>{sector.title}</h1>
        <p>{sector.description}</p>
      </section>

      <section className="about-content">
        <div className="about-intro">
          <Link to="/sectors" className="back-link">← Back to Sectors</Link>
          <div className="detail-icon">
            <IconComponent size={48} strokeWidth={1.5} />
          </div>
          <h2>Our Expertise in {sector.title}</h2>
          <p>
            {sector.description} We understand the unique challenges and requirements
            of the {sector.title.toLowerCase()} sector and deliver tailored facilities
            management solutions that meet industry standards and exceed expectations.
          </p>
        </div>
      </section>

      <section className="cta-section">
        <h2>Need FM Support for {sector.title}?</h2>
        <Link to="/contact" className="cta-button">Get in Touch</Link>
      </section>
    </div>
  )
}

export default SectorDetail
