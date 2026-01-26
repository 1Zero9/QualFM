import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Wrench, Shield, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import './Home.css'

const services = [
  {
    icon: Building2,
    title: 'Facilities Management',
    description: 'Complete end-to-end FM solutions',
    link: '/services'
  },
  {
    icon: Wrench,
    title: 'Building Maintenance',
    description: 'Preventive and reactive maintenance',
    link: '/services'
  },
  {
    icon: Shield,
    title: 'Security Solutions',
    description: 'Comprehensive security systems',
    link: '/services'
  }
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <img src="/images/qualfm-mainlogo-trans.png" alt="QualFM" className="hero-logo" />
          <p className="hero-tagline">Quality Facilities Management</p>
          <Link to="/contact" className="hero-cta">Contact Us</Link>
        </div>
      </section>

      {/* Services CTA Section */}
      <section className="home-services">
        <h2>What We Do</h2>
        <div className="services-preview">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <Link to={service.link} key={index} className="service-preview-card">
                <IconComponent className="service-preview-icon" size={28} strokeWidth={1.5} />
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </Link>
            )
          })}
        </div>
        <Link to="/services" className="section-cta">View All Services</Link>
      </section>

      {/* Sectors CTA */}
      <section className="home-sectors">
        <div className="sectors-content">
          <h2>Industries We Serve</h2>
          <p>From healthcare to retail, we deliver tailored FM solutions across diverse sectors.</p>
          <Link to="/sectors" className="section-cta section-cta-light">Explore Sectors</Link>
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
            <Quote className="quote-icon" size={32} strokeWidth={1} />
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

      {/* About CTA */}
      <section className="home-about">
        <h2>Why Choose QualFM?</h2>
        <p>We're committed to delivering quality, reliability, and partnership in everything we do.</p>
        <Link to="/about" className="section-cta">Learn About Us</Link>
      </section>

      {/* Final CTA */}
      <section className="home-cta">
        <h2>Ready to Get Started?</h2>
        <p>Let's discuss how we can support your facility management needs.</p>
        <Link to="/contact" className="hero-cta">Get in Touch</Link>
      </section>
    </div>
  )
}

export default Home
