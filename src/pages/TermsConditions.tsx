import './Legal.css'

function TermsConditions() {
  return (
    <div className="legal-page">
      <section className="page-hero legal-hero">
        <h1>Terms &amp; Conditions</h1>
        <p>General terms for use of the QualFM website.</p>
      </section>

      <section className="legal-content">
        <article>
          <h2>Website Use</h2>
          <p>
            Content on this site is provided for general information about QualFM services and capabilities.
            It may be updated without notice.
          </p>
        </article>

        <article>
          <h2>No Contractual Offer</h2>
          <p>
            Website content does not constitute a binding offer. Service scope, timelines, and pricing are
            confirmed through direct engagement and agreed documentation.
          </p>
        </article>

        <article>
          <h2>Intellectual Property</h2>
          <p>
            Logos, branding, and content on this site remain the property of their respective owners unless
            otherwise stated.
          </p>
        </article>

        <article>
          <h2>External Links</h2>
          <p>
            This website may link to third-party websites. QualFM is not responsible for third-party content
            or privacy practices.
          </p>
        </article>

        <article>
          <h2>Contact</h2>
          <p>
            For terms-related queries, contact <a href="mailto:service@qualfm.ie">service@qualfm.ie</a>.
          </p>
        </article>
      </section>
    </div>
  )
}

export default TermsConditions
