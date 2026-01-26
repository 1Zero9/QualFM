import { Link, useParams } from 'react-router-dom'
import { services } from './Services'
import './About.css'

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
          <div className="detail-icon">
            <IconComponent size={48} strokeWidth={1.5} />
          </div>
          <h2>About This Service</h2>
          <p>
            {service.description} Our experienced team delivers professional
            {service.title.toLowerCase()} solutions tailored to your specific needs.
            We work closely with clients to ensure optimal results and complete satisfaction.
          </p>
        </div>
      </section>

      <section className="about-cta">
        <h2>Interested in {service.title}?</h2>
        <Link to="/contact" className="cta-button">Get in Touch</Link>
      </section>
    </div>
  )
}

export default ServiceDetail
