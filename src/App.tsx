import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import { Button } from './shared/components'
import { usePortalHandoff } from './shared/hooks/usePortalHandoff'
import { navigateToPortal } from './utils/portal-handoff'
import { getPortalConfig } from './config/portal-integration'

function DashboardHome() {
  const { handoffState, hasHandoff, isLoading } = usePortalHandoff()
  const config = getPortalConfig()

  if (isLoading) {
    return <div className="loading">🔄 Loading handoff state...</div>
  }

  return (
    <div className="dashboard-page">
      <h2>🏠 Dashboard Home</h2>
      
      {hasHandoff && (
        <div className="handoff-info">
          <h3>✅ Handoff State Received</h3>
          <pre>{JSON.stringify(handoffState, null, 2)}</pre>
        </div>
      )}

      <div className="integration-demo">
        <h3>🔗 Portal Integration</h3>
        <p>Navigate to xCloud Portal:</p>
        <div className="button-group">
          <Button onClick={() => navigateToPortal('landing')}>
            Go to Portal Landing
          </Button>
          <Button 
            variant="secondary"
            onClick={() => navigateToPortal('auth')}
          >
            Go to Portal Auth
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigateToPortal('profile', { 
              returnUrl: '/deployments',
              context: { from: 'dashboard' }
            })}
          >
            Go to Portal Profile (with return)
          </Button>
        </div>
      </div>

      <div className="config-info">
        <h3>⚙️ Configuration</h3>
        <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
        <p><strong>Portal URL:</strong> {config.portalUrl}</p>
        <p><strong>Dashboard URL:</strong> {config.dashboardUrl}</p>
      </div>
    </div>
  )
}

function Deployments() {
  return (
    <div className="dashboard-page">
      <h2>🚀 Deployments</h2>
      <p>Manage your deployments here.</p>
      <Link to="/">← Back to Home</Link>
    </div>
  )
}

function Analytics() {
  return (
    <div className="dashboard-page">
      <h2>📊 Analytics</h2>
      <p>View your analytics here.</p>
      <Link to="/">← Back to Home</Link>
    </div>
  )
}

function Team() {
  return (
    <div className="dashboard-page">
      <h2>👥 Team</h2>
      <p>Manage your team here.</p>
      <Link to="/">← Back to Home</Link>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <h1>🎨 xCloud Dashboard</h1>
          <p className="subtitle">Web interface for managing deployments, analytics and team collaboration</p>
          <nav className="app-nav">
            <Link to="/">Home</Link>
            <Link to="/deployments">Deployments</Link>
            <Link to="/analytics">Analytics</Link>
            <Link to="/team">Team</Link>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/deployments" element={<Deployments />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/team" element={<Team />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>🔗 <strong>Portal Integration:</strong> Ready for bidirectional handoff</p>
          <p>📚 <a href="https://pagecloudv1.github.io/xcloud-docs/" target="_blank" rel="noopener noreferrer">Documentation</a></p>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App

