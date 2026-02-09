import { siteContent } from '../content/siteContent'
import './Legal.css'

function TermsConditions() {
  const content = siteContent.termsConditions

  return (
    <div className="legal-page">
      <section className="page-hero legal-hero">
        <h1>{content.hero.title}</h1>
        <p>{content.hero.subtitle}</p>
      </section>

      <section className="legal-content">
        {content.sections.map((section) => (
          <article key={section.id}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </section>
    </div>
  )
}

export default TermsConditions
