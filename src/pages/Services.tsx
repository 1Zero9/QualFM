import { Link } from 'react-router-dom'
import { Building2, Wrench, Thermometer, Sparkles, Shield, Zap } from 'lucide-react'
import './Services.css'

const services = [
  {
    slug: 'integrated-facilities-maintenance-management',
    icon: Building2,
    title: 'Integrated Facilities & Maintenance Management',
    description: 'Turnkey outsourced FM delivery with dedicated management, technicians and compliance-first service.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
    imageAlt: 'Modern office hallway',
    highlights: [
      'Designed for clients transitioning from in-house maintenance teams.',
      'Dedicated FM professionals for office, telecom, healthcare and critical environments.',
      'Planned, preventative and reactive maintenance delivered nationwide.'
    ],
    capabilities: [
      'Maintenance schedule management and statutory task tracking',
      'Soft services coordination and contractor governance',
      'Client reporting, service KPIs and compliance audits'
    ]
  },
  {
    slug: 'fitout-projects',
    icon: Wrench,
    title: 'Fitout Projects',
    description: 'From concept to handover for office fitouts, retrofits and energy upgrade projects.',
    image: 'https://images.unsplash.com/photo-1762008312967-beaf3f59984e?auto=format&fit=crop&w=1600&q=80',
    imageAlt: 'Office interior with geometric lighting',
    highlights: [
      'Experience in live working environments across commercial, pharmaceutical and healthcare facilities.',
      'Project values up to EUR 1.5m with structured delivery controls.',
      'End-to-end delivery from client engagement and design through occupation.'
    ],
    capabilities: [
      'Site surveys, scope definition and budget control',
      'Design coordination with specialist subcontractors',
      'PSDS and PSCS support through project lifecycle'
    ]
  },
  {
    slug: 'electrical-services',
    icon: Thermometer,
    title: 'Electrical Services',
    description: 'Inspection, design, installation and fault diagnostics for safe and efficient electrical systems.',
    image: 'https://images.unsplash.com/photo-1761037850943-d91b3866ec22?auto=format&fit=crop&w=1600&q=80',
    imageAlt: 'Technician working in a workshop',
    highlights: [
      'Registered Safe Electric QC member delivery standards.',
      'Periodic inspections, thermal imaging and compliance reporting.',
      'Nationwide electrical maintenance and breakdown response.'
    ],
    capabilities: [
      'Electrical installation and system modifications',
      'Emergency lighting, fire alarm and access control systems',
      'Fault finding, diagnostics and planned maintenance schedules'
    ]
  },
  {
    slug: 'mechanical-services',
    icon: Shield,
    title: 'Mechanical Services',
    description: 'Mechanical maintenance covering plumbing, HVAC plant, water systems and specialist assets.',
    image: 'https://images.unsplash.com/photo-1765850262030-1ae93e474473?auto=format&fit=crop&w=1600&q=80',
    imageAlt: 'Industrial ventilation and building systems',
    highlights: [
      'Fully qualified mechanical personnel with broad asset expertise.',
      'Water treatment, certification and legionella risk management.',
      'Critical system support for pumps, boilers, AHUs and suppression systems.'
    ],
    capabilities: [
      'Boilers, pumps, sprinkler systems and air handling maintenance',
      'Closed-loop corrosion control and independent lab certification',
      'Sterilisation, filtration, ventilation and preventive system care'
    ]
  },
  {
    slug: 'soft-services-building-fabric',
    icon: Zap,
    title: 'Soft Services & Building Fabric',
    description: 'Practical, high-availability building support services that keep sites safe and presentable.',
    image: 'https://images.unsplash.com/photo-1758304481470-e575d1d44efa?auto=format&fit=crop&w=1600&q=80',
    imageAlt: 'Industrial and commercial buildings viewed from above',
    highlights: [
      'Integrated soft services delivered as part of a single FM contract.',
      'Responsive delivery for planned upkeep and reactive callouts.',
      'Consistent site standards across nationwide portfolios.'
    ],
    capabilities: [
      'Roof maintenance, drainage, glazing and locksmith services',
      'Landscaping, pest control, painting and decorating',
      'Security fencing, power washing and window cleaning'
    ]
  },
  {
    slug: 'compliance-auditing',
    icon: Sparkles,
    title: 'Compliance Auditing',
    description: 'Independent building compliance and regulatory control inspections with clear reporting.',
    image: 'https://images.unsplash.com/photo-1764885415563-8b868745e9e2?auto=format&fit=crop&w=1600&q=80',
    imageAlt: 'Healthcare facility entrance',
    highlights: [
      'Independent compliance checks to reduce regulatory risk.',
      'Action-focused reports that support corrective planning.',
      'Aligned to client governance and statutory requirements.'
    ],
    capabilities: [
      'Building control inspections and compliance reporting',
      'Risk-led prioritisation of remedial actions',
      'Support for audit readiness across property portfolios'
    ]
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
