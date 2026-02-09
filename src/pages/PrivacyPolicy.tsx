import { siteContent } from '../content/siteContent'
import BuilderMarker from '../components/BuilderMarker'
import './Legal.css'

function PrivacyPolicy() {
  const content = siteContent.privacyPolicy

  return (
    <div className="legal-page">
      <section className="page-hero legal-hero">
        <BuilderMarker blockId="BLOCK:privacyPolicy.hero" label="privacyPolicy.hero" />
        <h1>{content.hero.title}</h1>
        <p>{content.hero.subtitle}</p>
      </section>

      <section className="legal-content">
        {content.sections.map((section) => (
          <article key={section.id}>
            <BuilderMarker blockId={`BLOCK:privacyPolicy.sections[id=${section.id}]`} label={`privacy.${section.id}`} />
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </section>
    </div>
  )
}

export default PrivacyPolicy
