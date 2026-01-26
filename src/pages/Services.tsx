import { Link } from 'react-router-dom'
import { Building2, Wrench, Thermometer, Sparkles, Shield, Zap } from 'lucide-react'
import './Services.css'

const services = [
  {
    slug: 'facilities-management',
    icon: Building2,
    title: 'Facilities Management',
    description: 'Complete end-to-end facilities management solutions tailored to your business needs.'
  },
  {
    slug: 'building-maintenance',
    icon: Wrench,
    title: 'Building Maintenance',
    description: 'Preventive and reactive maintenance services to keep your building in top condition.'
  },
  {
    slug: 'hvac',
    icon: Thermometer,
    title: 'HVAC Services',
    description: 'Heating, ventilation and air conditioning installation, maintenance and repairs.'
  },
  {
    slug: 'cleaning',
    icon: Sparkles,
    title: 'Cleaning Services',
    description: 'Professional commercial cleaning to maintain a healthy, productive environment.'
  },
  {
    slug: 'security',
    icon: Shield,
    title: 'Security Solutions',
    description: 'Comprehensive security systems, access control and monitoring services.'
  },
  {
    slug: 'energy-management',
    icon: Zap,
    title: 'Energy Management',
    description: 'Sustainable energy solutions to reduce costs and environmental impact.'
  }
]

export { services }

function Services() {
  return (
    <div className="services-page">
      <section className="page-hero">
        <h1>Our Services</h1>
        <p>Comprehensive facilities management solutions</p>
      </section>

      <section className="services-content">
        <div className="card-grid">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <Link to={`/services/${service.slug}`} key={index} className="card">
                <IconComponent className="card-icon" size={24} strokeWidth={1.5} />
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="cta-section">
        <h2>Need a Custom Solution?</h2>
        <p>We tailor our services to meet your specific requirements</p>
        <Link to="/contact" className="cta-button">Get in Touch</Link>
      </section>
    </div>
  )
}

export default Services
