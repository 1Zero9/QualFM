import { useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Contact from './pages/Contact'
import './App.css'

function App() {
  const location = useLocation()
  const showContact = location.pathname === '/contact'

  return (
    <div className="app">
      <main className="main">
        <Home />
        {showContact && <Contact />}
      </main>

      <footer className="footer">
        <p>&copy; 2025 QualFM. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
