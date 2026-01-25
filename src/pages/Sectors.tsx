import { Link } from 'react-router-dom'
import './Sectors.css'

const sectors = [
  {
    icon: '🏛️',
    title: 'Commercial & Office',
    description: 'Keeping workplaces productive, comfortable and well-maintained.'
  },
  {
    icon: '🏥',
    title: 'Healthcare',
    description: 'Supporting healthcare facilities with compliant, reliable FM services.'
  },
  {
    icon: '🎓',
    title: 'Education',
    description: 'Creating safe, clean learning environments for students and staff.'
  },
  {
    icon: '🛒',
    title: 'Retail',
    description: 'Maintaining retail spaces that enhance the customer experience.'
  },
  {
    icon: '🏭',
    title: 'Industrial',
    description: 'Robust facilities management for manufacturing and industrial sites.'
  },
  {
    icon: '🏛️',
    title: 'Government',
    description: 'Trusted partner for public sector facilities management.'
  }
]

function Sectors() {
  return (
    <div className="sectors-page">
      <section className="page-hero">
        <h1>Sectors We Serve</h1>
        <p>Expertise across diverse industries</p>
      </section>

      <section className="sectors-content">
        <div className="sectors-grid">
          {sectors.map((sector, index) => (
            <div key={index} className="sector-card">
              <span className="sector-icon">{sector.icon}</span>
              <h3>{sector.title}</h3>
              <p>{sector.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="sectors-cta">
        <h2>Your Sector Not Listed?</h2>
        <p>We work across all industries - let's discuss your needs</p>
        <Link to="/contact" className="cta-button">Get in Touch</Link>
      </section>
    </div>
  )
}

export default Sectors
