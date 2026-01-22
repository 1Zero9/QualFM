import './App.css'

function App() {
  return (
    <div className="app">
      <main className="main">
        <section className="hero">
          <img src="/images/qualfm-mainlogo.png" alt="QualFM" className="logo" />
          <button className="cta-button">Get Started</button>
        </section>

        <section className="features">
          <div className="feature">
            <h3>Feature One</h3>
            <p>Description of the first feature goes here.</p>
          </div>
          <div className="feature">
            <h3>Feature Two</h3>
            <p>Description of the second feature goes here.</p>
          </div>
          <div className="feature">
            <h3>Feature Three</h3>
            <p>Description of the third feature goes here.</p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2025 QualFM. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
