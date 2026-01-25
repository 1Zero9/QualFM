import { Link } from 'react-router-dom'
import './Home.css'

const services = [
  {
    icon: '🏢',
    title: 'Facilities Management',
    description: 'End-to-end FM solutions'
  },
  {
    icon: '🔧',
    title: 'Building Maintenance',
    description: 'Preventive & reactive care'
  },
  {
    icon: '❄️',
    title: 'HVAC Services',
    description: 'Climate & air quality'
  },
  {
    icon: '✨',
    title: 'Cleaning Services',
    description: 'Commercial cleaning'
  },
  {
    icon: '🛡️',
    title: 'Security Solutions',
    description: 'Access & monitoring'
  },
  {
    icon: '⚡',
    title: 'Energy Management',
    description: 'Efficiency & sustainability'
  }
]

const sectors = [
  { icon: '🏛️', name: 'Commercial' },
  { icon: '🏥', name: 'Healthcare' },
  { icon: '🎓', name: 'Education' },
  { icon: '🛒', name: 'Retail' },
  { icon: '🏭', name: 'Industrial' },
  { icon: '🏛️', name: 'Government' }
]

function Home() {
  return (
    <div className="home">
      {/* Hero Section - Mobile First, Impact Focus */}
      <section className="hero">
        <div className="hero-background"></div>

        <div className="hero-content">
          <img
            src="/images/qualfm-mainlogo-trans.png"
            alt="QualFM"
            className="hero-logo"
          />

          <p className="hero-tagline">
            Quality Facilities Management
          </p>

          <Link to="/contact" className="hero-cta">
            Get in Touch
          </Link>
        </div>
      </section>

      {/* Services - Simple on Mobile */}
      <section className="services-section">
        <h2 className="section-title">Our Services</h2>

        <div className="services-list">
          {services.map((service, index) => (
            <div key={index} className="service-item">
              <span className="service-icon">{service.icon}</span>
              <div className="service-text">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sectors - Horizontal scroll mobile */}
      <section className="sectors-section">
        <h2 className="section-title">Sectors We Serve</h2>

        <div className="sectors-scroll">
          {sectors.map((sector, index) => (
            <div key={index} className="sector-chip">
              <span className="sector-icon">{sector.icon}</span>
              <span className="sector-name">{sector.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Work Together?</h2>
        <p>Let's discuss your facilities management needs</p>
        <Link to="/contact" className="cta-button-large">
          Contact Us
        </Link>
      </section>
    </div>
  )
}

export default Home
