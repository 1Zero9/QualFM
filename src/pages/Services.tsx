import { Link } from 'react-router-dom'
import './Services.css'

const services = [
  {
    icon: '🏢',
    title: 'Facilities Management',
    description: 'Complete end-to-end facilities management solutions tailored to your business needs.'
  },
  {
    icon: '🔧',
    title: 'Building Maintenance',
    description: 'Preventive and reactive maintenance services to keep your building in top condition.'
  },
  {
    icon: '❄️',
    title: 'HVAC Services',
    description: 'Heating, ventilation and air conditioning installation, maintenance and repairs.'
  },
  {
    icon: '✨',
    title: 'Cleaning Services',
    description: 'Professional commercial cleaning to maintain a healthy, productive environment.'
  },
  {
    icon: '🛡️',
    title: 'Security Solutions',
    description: 'Comprehensive security systems, access control and monitoring services.'
  },
  {
    icon: '⚡',
    title: 'Energy Management',
    description: 'Sustainable energy solutions to reduce costs and environmental impact.'
  }
]

function Services() {
  return (
    <div className="services-page">
      <section className="page-hero">
        <h1>Our Services</h1>
        <p>Comprehensive facilities management solutions</p>
      </section>

      <section className="services-content">
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <span className="service-icon">{service.icon}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="services-cta">
        <h2>Need a Custom Solution?</h2>
        <p>We tailor our services to meet your specific requirements</p>
        <Link to="/contact" className="cta-button">Get in Touch</Link>
      </section>
    </div>
  )
}

export default Services
