import { Link } from 'react-router-dom'
import { Building, HeartPulse, GraduationCap, ShoppingCart, Factory, Landmark } from 'lucide-react'
import './Sectors.css'

const sectors = [
  {
    slug: 'commercial',
    icon: Building,
    title: 'Commercial & Office',
    description: 'Keeping workplaces productive, comfortable and well-maintained.'
  },
  {
    slug: 'healthcare',
    icon: HeartPulse,
    title: 'Healthcare',
    description: 'Supporting healthcare facilities with compliant, reliable FM services.'
  },
  {
    slug: 'education',
    icon: GraduationCap,
    title: 'Education',
    description: 'Creating safe, clean learning environments for students and staff.'
  },
  {
    slug: 'retail',
    icon: ShoppingCart,
    title: 'Retail',
    description: 'Maintaining retail spaces that enhance the customer experience.'
  },
  {
    slug: 'industrial',
    icon: Factory,
    title: 'Industrial',
    description: 'Robust facilities management for manufacturing and industrial sites.'
  },
  {
    slug: 'government',
    icon: Landmark,
    title: 'Government',
    description: 'Trusted partner for public sector facilities management.'
  }
]

export { sectors }

function Sectors() {
  return (
    <div className="sectors-page">
      <section className="page-hero">
        <h1>Sectors We Serve</h1>
        <p>Expertise across diverse industries</p>
      </section>

      <section className="sectors-content">
        <div className="sectors-grid">
          {sectors.map((sector, index) => {
            const IconComponent = sector.icon
            return (
              <Link to={`/sectors/${sector.slug}`} key={index} className="sector-card">
                <IconComponent className="sector-icon" size={32} strokeWidth={1.5} />
                <h3>{sector.title}</h3>
                <p>{sector.description}</p>
              </Link>
            )
          })}
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
