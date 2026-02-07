import './Legal.css'

function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <section className="page-hero legal-hero">
        <h1>Privacy Policy</h1>
        <p>How QualFM handles information submitted through this website.</p>
      </section>

      <section className="legal-content">
        <article>
          <h2>Information We Collect</h2>
          <p>
            We collect contact details that you voluntarily provide through enquiries, such as your name,
            email address, phone number, and message content.
          </p>
        </article>

        <article>
          <h2>How We Use Information</h2>
          <p>
            We use submitted information to respond to your enquiries, discuss service requirements,
            and provide requested information about QualFM services.
          </p>
        </article>

        <article>
          <h2>Data Sharing</h2>
          <p>
            We do not sell personal data. Information may be shared only where required for service delivery,
            legal obligations, or trusted operational support.
          </p>
        </article>

        <article>
          <h2>Retention</h2>
          <p>
            We retain enquiry data only for as long as needed for business, legal, and compliance purposes.
          </p>
        </article>

        <article>
          <h2>Your Rights</h2>
          <p>
            You may request access, correction, or deletion of your personal data by contacting
            <a href="mailto:service@qualfm.ie"> service@qualfm.ie</a>.
          </p>
        </article>
      </section>
    </div>
  )
}

export default PrivacyPolicy
