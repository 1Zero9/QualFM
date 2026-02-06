import { Link, useParams } from 'react-router-dom'
import { services } from './Services'
import './About.css'
import './Services.css'

function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>()
  const service = services.find(s => s.slug === slug)

  if (!service) {
    return (
      <div className="about-page">
        <section className="page-hero">
          <h1>Service Not Found</h1>
          <p>The service you're looking for doesn't exist</p>
        </section>
        <section className="about-content">
          <div className="about-intro">
            <Link to="/services" className="back-link">← Back to Services</Link>
          </div>
        </section>
      </div>
    )
  }

  const IconComponent = service.icon

  return (
    <div className="about-page">
      <section className="page-hero">
        <h1>{service.title}</h1>
        <p>{service.description}</p>
      </section>

      <section className="about-content">
        <div className="about-intro">
          <Link to="/services" className="back-link">← Back to Services</Link>
          <img src={service.image} alt={service.imageAlt} className="service-detail-image" />
          <div className="detail-icon">
            <IconComponent size={48} strokeWidth={1.5} />
          </div>
          <h2>Service Overview</h2>
          <p>{service.description}</p>
        </div>

        <div className="service-detail-grid">
          <article className="service-detail-card">
            <h3>Why Clients Choose This</h3>
            <ul>
              {service.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </article>

          <article className="service-detail-card">
            <h3>Typical Scope</h3>
            <ul>
              {service.capabilities.map((capability) => (
                <li key={capability}>{capability}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="cta-section">
        <h2>Interested in {service.title}?</h2>
        <Link to="/contact" className="cta-button">Get in Touch</Link>
      </section>
    </div>
  )
}

export default ServiceDetail
