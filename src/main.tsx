import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import { AdminSessionProvider } from './admin/AdminSessionContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AdminSessionProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </AdminSessionProvider>
    </BrowserRouter>
  </StrictMode>,
)
