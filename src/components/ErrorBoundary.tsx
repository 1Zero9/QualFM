import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // Intentionally silent in UI; avoid exposing technical details to visitors.
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '6rem 1rem 2rem', maxWidth: '760px', margin: '0 auto' }}>
          <h1 style={{ margin: 0 }}>Something went wrong</h1>
          <p style={{ marginTop: '0.8rem' }}>
            Please use the links below to continue browsing.
          </p>
          <p>
            <Link to="/">Home</Link> | <Link to="/privacy-policy">Privacy Policy</Link> |{' '}
            <Link to="/terms">Terms &amp; Conditions</Link>
          </p>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
