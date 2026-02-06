import { Link } from 'react-router-dom'
import { Building, HeartPulse, RadioTower, Pill, Factory, ShoppingCart } from 'lucide-react'
import './Sectors.css'

const sectors = [
  {
    slug: 'commercial',
    icon: Building,
    title: 'Commercial & Office',
    description: 'Keeping workplaces productive, comfortable and well-maintained.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80'
  },
  {
    slug: 'healthcare',
    icon: HeartPulse,
    title: 'Healthcare',
    description: 'Supporting healthcare facilities with compliant, reliable FM services.',
    image: 'https://images.unsplash.com/photo-1764885415563-8b868745e9e2?auto=format&fit=crop&w=1600&q=80'
  },
  {
    slug: 'telecom-critical-environments',
    icon: RadioTower,
    title: 'Telecom & Critical Environments',
    description: 'Technical FM support for uptime-critical infrastructure and specialist sites.',
    image: 'https://images.unsplash.com/photo-1765850262030-1ae93e474473?auto=format&fit=crop&w=1600&q=80'
  },
  {
    slug: 'pharmaceutical',
    icon: Pill,
    title: 'Pharmaceutical',
    description: 'Controlled, quality-led maintenance for regulated life-science operations.',
    image: 'https://images.unsplash.com/photo-1762008312967-beaf3f59984e?auto=format&fit=crop&w=1600&q=80'
  },
  {
    slug: 'industrial',
    icon: Factory,
    title: 'Industrial & Manufacturing',
    description: 'Robust facilities management for manufacturing and industrial operations.',
    image: 'https://images.unsplash.com/photo-1758304481470-e575d1d44efa?auto=format&fit=crop&w=1600&q=80'
  },
  {
    slug: 'retail-public',
    icon: ShoppingCart,
    title: 'Retail & Public-Facing Sites',
    description: 'Reliable support that protects customer experience and front-of-house standards.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80'
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
        <div className="card-grid">
          {sectors.map((sector, index) => {
            const IconComponent = sector.icon
            return (
              <Link to={`/sectors/${sector.slug}`} key={index} className="card">
                <IconComponent className="card-icon" size={24} strokeWidth={1.5} />
                <h3>{sector.title}</h3>
                <p>{sector.description}</p>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="cta-section">
        <h2>Your Sector Not Listed?</h2>
        <p>We work across all industries - let's discuss your needs</p>
        <Link to="/contact" className="cta-button">Get in Touch</Link>
      </section>
    </div>
  )
}

export default Sectors
