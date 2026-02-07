import { Link } from 'react-router-dom'
import { BadgeCheck, BriefcaseBusiness, ShieldCheck, Wrench } from 'lucide-react'
import './Services.css'

const serviceGroups = [
  {
    title: 'Integrated Facilities & Maintenance Management',
    summary:
      'Let your problem be ours. A turnkey outsourced model for clients transitioning from in-house maintenance to dedicated FM support.',
    points: [
      'Planned, preventative and reactive maintenance nationwide',
      'Dedicated management and technician teams for seamless transition from in-house to outsourced',
      'Turnkey facilities and maintenance solution with compliance-focused delivery'
    ]
  },
  {
    title: 'Fitout Projects',
    summary:
      'Office fitouts, plant/equipment retrofit and energy upgrades in commercial, pharmaceutical and healthcare facilities, including live environments.',
    points: [
      'Project management from initial client engagement, through design, completion and handover',
      'PSDS and PSCS resources available',
      'Fitout project values delivered up to EUR 1.5m'
    ]
  },
  {
    title: 'Electrical Services',
    summary:
      'Inspection, design, installation and diagnostics delivered by qualified electrical professionals nationwide.',
    points: [
      'Periodic inspections, reporting and thermal imaging',
      'Electrical system design, modifications and installation',
      'Lighting retrofit, lighting application and selection',
      'Access control, fire alarm and Vesda smoke detection',
      'Emergency lighting, air conditioning and ventilation systems',
      'Equipment breakdown response, repairs, renewals and parts/components',
      'Fault finding, diagnosis, troubleshooting and pre-planned maintenance',
      'Filter cleaning/changing, site surveys and asset registers'
    ]
  },
  {
    title: 'Mechanical Services',
    summary:
      'Critical mechanical maintenance and asset reliability for operational continuity, water safety and compliance.',
    points: [
      'Plumbing services, pumps/pressurisation systems and lift maintenance',
      'Boiler maintenance, sprinkler systems and gas fire suppression',
      'Air handling units, filtration, extract/supply air fans',
      'Diesel fuel storage and polishing systems',
      'Water treatment and sterilization of water systems',
      'Maintenance and corrosion control of closed loop systems',
      'Independent lab analysis and certification',
      'Legionella risk management and closed-loop heating/cooling treatment',
      'Fall arrest and prevention systems, plus asset registers'
    ]
  },
  {
    title: 'Soft Services & Building Fabric',
    summary:
      'Integrated building fabric and soft service support to maintain site standards across portfolios.',
    points: [
      'Roof maintenance and drainage services',
      'Security and boundary fencing',
      'Landscaping, power washing and pest control services',
      'Painting and decorating',
      'Furniture upholstery and upholstery cleaning',
      'Window cleaning, glazing services and locksmith services',
      'Shopfront repair'
    ]
  },
  {
    title: 'Compliance Auditing',
    summary:
      'Independent building compliance and regulatory control inspections and reporting.',
    points: [
      'Audit-ready inspections and reporting',
      'Reduces regulatory risk of non-compliance through compliance building control',
      'Clear prioritisation of corrective actions to support governance'
    ]
  }
]

const credentials = [
  'Safe Electric QC Registered',
  'F-Gas Registered',
  'Fully Qualified Mechanical & Electrical Trades Personnel',
  'Detailed planned preventative/proactive maintenance schedules'
]

function Services() {
  return (
    <div className="services-page">
      <section className="page-hero services-hero">
        <h1>Services</h1>
        <p>Practical, compliance-led facilities support designed for business continuity</p>
      </section>

      <section className="services-content">
        <div className="services-intro">
          <div>
            <h2>What We Do Best</h2>
            <p>
              Facilities management professionals to manage office space, critical telecom and healthcare
              environments and soft services nationwide. We provide meaningful support aligned to client
              operations, from reactive response through to structured preventative maintenance.
            </p>
            <p className="services-intro-note">
              This page is the primary source for detailed service scope and compliance credentials.
            </p>
          </div>
          <img
            src="/images/background/stock/shop-fitout2.png"
            alt="Facilities engineer at work"
          />
        </div>

        <div className="services-grid">
          {serviceGroups.map((service) => (
            <article key={service.title} className="service-card">
              <h3>{service.title}</h3>
              <p>{service.summary}</p>
              <ul>
                {service.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="services-credentials">
        <div className="services-credentials-inner">
          <h2>Standards And Credentials</h2>
          <div className="credential-grid">
            {credentials.map((credential) => (
              <article key={credential} className="credential-item">
                <BadgeCheck size={18} />
                <span>{credential}</span>
              </article>
            ))}
          </div>
          <div className="services-flags">
            <span>
              <Wrench size={16} />
              Mechanical & electrical maintenance
            </span>
            <span>
              <BriefcaseBusiness size={16} />
              Fitouts and project delivery
            </span>
            <span>
              <ShieldCheck size={16} />
              Compliance and risk reduction
            </span>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Need Reliable FM Support?</h2>
        <p>Speak with our team about your site, project or portfolio requirements.</p>
        <Link to="/contact" className="cta-button">Contact QualFM</Link>
      </section>
    </div>
  )
}

export default Services
