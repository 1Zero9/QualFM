import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Wrench, Building, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import './Home.css'

const backgroundImages = [
  '/images/background/van-background-bg1.png',
  '/images/background/hoi-an-and-da-nang-photographer-Voj5EHsWguc-unsplash.jpg',
  '/images/background/hoi-an-and-da-nang-photographer-jV2Wdl1HOs4-unsplash.jpg',
  '/images/background/kate-sade-9809oTun-G8-unsplash.jpg',
  '/images/background/mar-ko-pQ5hSOrkYgE-unsplash.jpg',
  '/images/background/muneer-ahmed-ok-qS6O4CG0r_k-unsplash.jpg',
  '/images/background/xiaoman-wang-uZGOr_hlOfc-unsplash.jpg'
]

const testimonials = [
  {
    quote: "QualFM transformed how we manage our facilities. Their team is responsive, professional, and truly understands our needs.",
    author: "Operations Manager",
    company: "Dublin Office Complex"
  },
  {
    quote: "Reliable, efficient, and always going above and beyond. We couldn't ask for a better FM partner.",
    author: "Facilities Director",
    company: "Healthcare Provider"
  },
  {
    quote: "The level of service and attention to detail from QualFM is outstanding. They've made facility management effortless.",
    author: "Property Manager",
    company: "Retail Group"
  }
]

function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [currentBackground, setCurrentBackground] = useState(0)

  useEffect(() => {
    const testimonialTimer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(testimonialTimer)
  }, [])

  useEffect(() => {
    const backgroundTimer = setInterval(() => {
      setCurrentBackground((prev) => (prev + 1) % backgroundImages.length)
    }, 8000)
    return () => clearInterval(backgroundTimer)
  }, [])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="home-page">
      {/* Rotating Background */}
      <div className="home-backgrounds">
        {backgroundImages.map((img, index) => (
          <div
            key={img}
            className={`home-bg-image ${index === currentBackground ? 'active' : ''}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className="home-bg-overlay" />
      </div>

      {/* Hero Section with all CTAs */}
      <section className="hero">
        <div className="hero-content">
          <img src="/images/qualfm-mainlogo-trans.png" alt="QualFM" className="hero-logo" />
          <p className="hero-tagline">Quality Facilities Management</p>

          <div className="hero-ctas">
            <Link to="/about" className="hero-cta-card">
              <Users size={24} strokeWidth={1.5} />
              <span>About Us</span>
            </Link>
            <Link to="/services" className="hero-cta-card">
              <Wrench size={24} strokeWidth={1.5} />
              <span>Services</span>
            </Link>
            <Link to="/sectors" className="hero-cta-card">
              <Building size={24} strokeWidth={1.5} />
              <span>Sectors</span>
            </Link>
          </div>

          <Link to="/contact" className="hero-contact-btn">Contact Us</Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="home-testimonials">
        <h2>What Our Clients Say</h2>
        <div className="testimonial-carousel">
          <button className="carousel-btn carousel-btn-prev" onClick={prevTestimonial} aria-label="Previous testimonial">
            <ChevronLeft size={24} />
          </button>

          <div className="testimonial-slide">
            <Quote className="quote-icon" size={28} strokeWidth={1} />
            <blockquote>{testimonials[currentTestimonial].quote}</blockquote>
            <div className="testimonial-author">
              <strong>{testimonials[currentTestimonial].author}</strong>
              <span>{testimonials[currentTestimonial].company}</span>
            </div>
          </div>

          <button className="carousel-btn carousel-btn-next" onClick={nextTestimonial} aria-label="Next testimonial">
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="testimonial-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentTestimonial ? 'active' : ''}`}
              onClick={() => setCurrentTestimonial(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
