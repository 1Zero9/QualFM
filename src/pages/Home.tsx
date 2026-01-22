import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <section className="hero">
      <img src="/images/qualfm-mainlogo-trans.png" alt="QualFM" className="logo" />
      <Link to="/contact" className="cta-button">Contact Us</Link>
    </section>
  )
}

export default Home
