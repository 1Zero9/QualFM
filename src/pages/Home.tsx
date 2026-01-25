import { Link } from 'react-router-dom'
import './Home.css'

const services = [
  {
    icon: '🏢',
    title: 'Facilities Management',
    description: 'Complete FM solutions tailored to your needs'
  },
  {
    icon: '🔧',
    title: 'Building Maintenance',
    description: 'Preventive and reactive maintenance services'
  },
  {
    icon: '❄️',
    title: 'HVAC Services',
    description: 'Climate control and air quality management'
  },
  {
    icon: '✨',
    title: 'Cleaning Services',
    description: 'Professional commercial cleaning solutions'
  },
  {
    icon: '🛡️',
    title: 'Security Solutions',
    description: 'Comprehensive security and access control'
  },
  {
    icon: '⚡',
    title: 'Energy Management',
    description: 'Sustainable energy solutions and monitoring'
  }
]

const sectors = [
  { icon: '🏛️', name: 'Commercial', image: '/images/sectors/commercial.jpg' },
  { icon: '🏥', name: 'Healthcare', image: '/images/sectors/healthcare.jpg' },
  { icon: '🎓', name: 'Education', image: '/images/sectors/education.jpg' },
  { icon: '🛒', name: 'Retail', image: '/images/sectors/retail.jpg' },
  { icon: '🏭', name: 'Industrial', image: '/images/sectors/industrial.jpg' },
  { icon: '🏛️', name: 'Government', image: '/images/sectors/government.jpg' }
]

const stats = [
  { value: '15+', label: 'Years Experience' },
  { value: '500+', label: 'Projects Delivered' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '24/7', label: 'Support Available' }
]

function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <img src="/images/van-background-bg1.png" alt="" className="hero-bg-image" />
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
          <img
            src="/images/qualfm-mainlogo-trans.png"
            alt="QualFM"
            className="hero-logo"
          />
          <h1 className="hero-title">Quality Facilities Management</h1>
          <p className="hero-subtitle">
            Making your spaces work better for you
          </p>
          <div className="hero-ctas">
            <Link to="/contact" className="hero-cta-primary">
              Get in Touch
            </Link>
            <Link to="/services" className="hero-cta-secondary">
              Our Services
            </Link>
          </div>
        </div>

        <div className="hero-scroll-indicator">
          <span></span>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="section-header">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Comprehensive facilities management solutions
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <Link
              to="/services"
              key={index}
              className="service-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="service-icon">{service.icon}</span>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <span className="service-arrow">→</span>
            </Link>
          ))}
        </div>

        <div className="section-cta">
          <Link to="/services" className="button-secondary">
            View All Services
          </Link>
        </div>
      </section>

      {/* Sectors Section */}
      <section className="sectors-section">
        <div className="section-header">
          <h2 className="section-title">Sectors We Serve</h2>
          <p className="section-subtitle">
            Expertise across diverse industries
          </p>
        </div>

        <div className="sectors-scroll">
          <div className="sectors-track">
            {sectors.map((sector, index) => (
              <Link
                to="/sectors"
                key={index}
                className="sector-card"
              >
                <span className="sector-icon">{sector.icon}</span>
                <span className="sector-name">{sector.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-section">
        <div className="section-header">
          <h2 className="section-title">Why QualFM?</h2>
        </div>

        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon">🎯</div>
            <h3>Tailored Solutions</h3>
            <p>Customized services that fit your specific requirements and budget</p>
          </div>
          <div className="why-card">
            <div className="why-icon">⚡</div>
            <h3>Rapid Response</h3>
            <p>24/7 support with guaranteed response times for emergencies</p>
          </div>
          <div className="why-card">
            <div className="why-icon">🌱</div>
            <h3>Sustainable Practices</h3>
            <p>Environmentally conscious solutions that reduce your carbon footprint</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Facilities?</h2>
          <p className="cta-subtitle">
            Let's discuss how we can help optimize your space
          </p>
          <Link to="/contact" className="cta-button-large">
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
