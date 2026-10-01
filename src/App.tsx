import './index.css'
import { BrowserRouter, Routes, Route, NavLink, useNavigate, useLocation, Navigate } from 'react-router-dom'
import {
  GitBranch, GitPullRequest, Zap, CheckSquare,
  Activity, History, Bot, Settings, ChevronRight,
  Search, Bell, Database
} from 'lucide-react'
import { REPO } from './data/mockData'

// Pages
import Overview from './pages/Overview'
import Repositories from './pages/Repositories'
import PullRequests from './pages/PullRequests'
import ChangeImpact from './pages/ChangeImpact'
// Removed TestSelection
import Coverage from './pages/Coverage'
import TestHealth from './pages/TestHealth'
import HistoryPage from './pages/HistoryPage'
import Copilot from './pages/Copilot'
import SettingsPage from './pages/Settings'
import Install from './pages/Install'
import IDE from './pages/IDE'
import PRReport from './pages/PRReport'
import GitHubPR from './pages/GitHubPR'
import TestNeeds from './pages/TestNeeds'
import RegressionPlan from './pages/RegressionPlan'
import Execution from './pages/Execution'
import { DemoProvider } from './context/DemoScenarioContext'


function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const isFullscreen = location.pathname.startsWith('/ide') || location.pathname.startsWith('/github') || location.pathname.startsWith('/install-auracle')

  return (
    <div className={isFullscreen ? "fullscreen-app" : "app-shell"} style={isFullscreen ? { width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' } : {}}>
      {/* Sidebar */}
      {!isFullscreen && (
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark">A</div>
          <span className="sidebar-logo-text">Auracle</span>
          <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>v0.6.3</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-label">Workspace</div>
            <NavLink to="/repositories" className={({isActive}) => `nav-item${isActive ? ' active' : ''}`}>
              <Database size={14} /><span>Repositories</span>
            </NavLink>
            <NavLink to="/pull-requests" className={({isActive}) => `nav-item${isActive ? ' active' : ''}`}>
              <GitPullRequest size={14} /><span>Changes</span>
              <span className="nav-badge">1</span>
            </NavLink>
          </div>

          <div className="nav-section">
            <div className="nav-section-label">Current Change</div>
            <NavLink to="/pull-requests/184/report" className={({isActive}) => `nav-item${isActive ? ' active' : ''}`}>
              <Zap size={14} /><span>Change Report</span>
            </NavLink>
            <NavLink to="/change-impact" className={({isActive}) => `nav-item${isActive ? ' active' : ''}`}>
              <Zap size={14} /><span>Impact</span>
            </NavLink>
            <NavLink to="/test-needs" className={({isActive}) => `nav-item${isActive ? ' active' : ''}`}>
              <CheckSquare size={14} /><span>Test Needs</span>
            </NavLink>
            <NavLink to="/regression-plan" className={({isActive}) => `nav-item${isActive ? ' active' : ''}`}>
              <CheckSquare size={14} /><span>Regression Plan</span>
            </NavLink>
            <NavLink to="/execution" className={({isActive}) => `nav-item${isActive ? ' active' : ''}`}>
              <Activity size={14} /><span>Execution</span>
            </NavLink>
          </div>

          <div className="nav-section">
            <div className="nav-section-label">Evaluation</div>
            <NavLink to="/history" className={({isActive}) => `nav-item${isActive ? ' active' : ''}`}>
              <History size={14} /><span>History / Model Eval</span>
            </NavLink>
          </div>

          <div className="nav-section">
            <div className="nav-section-label">More</div>
            <NavLink to="/copilot" className={({isActive}) => `nav-item${isActive ? ' active' : ''}`}>
              <Bot size={14} /><span>Ask Auracle</span>
              <span className="nav-badge blue">AI</span>
            </NavLink>
          </div>

          <div className="nav-section" style={{ marginTop: 'auto' }}>
            <div className="nav-section-label">System</div>
            <NavLink to="/settings" className={({isActive}) => `nav-item${isActive ? ' active' : ''}`}>
              <Settings size={14} /><span>Settings</span>
            </NavLink>
          </div>
        </nav>

        {/* Sidebar footer — model status */}
        <div style={{
          padding: '10px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Model</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{REPO.modelVersion}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Last sync</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{REPO.lastSync}</span>
          </div>
        </div>

        {/* User profile at the bottom */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.03)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          cursor: 'pointer',
          background: 'rgba(255, 255, 255, 0.01)'
        }}>
          <div className="avatar" style={{ width: 32, height: 32, fontSize: 12, background: '#f5a623', color: '#0f172a' }}>AH</div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Ahmed</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>developer</span>
          </div>
          <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: 16, lineHeight: 0.5, marginBottom: 8, letterSpacing: '2px' }}>...</span>
        </div>
      </aside>
      )}

      {/* Main */}
      <div className={isFullscreen ? "" : "main-area"} style={isFullscreen ? { flex: 1, display: 'flex', flexDirection: 'column', height: '100%' } : {}}>
        {/* Topbar */}
        {!isFullscreen && (
        <header className="topbar">
          {/* Repo selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 6,
            cursor: 'pointer',
            minWidth: 180
          }}>
            <GitBranch size={12} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-mono)' }}>acme/payments-api</span>
            <ChevronRight size={10} style={{ color: 'var(--text-muted)', marginLeft: 'auto' }} />
          </div>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={12} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="search-input"
              placeholder="Search tests, files, PRs..."
              style={{ paddingLeft: 30 }}
            />
          </div>

          {/* Status badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div className="running-dot" />
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>PR #184 analyzing</span>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Install link */}
            <NavLink to="/install" className={({isActive}) => `btn btn-ghost${isActive ? ' active' : ''}`} style={{ fontSize: 11 }}>
              Setup
            </NavLink>
            <NavLink to="/ide" className={({isActive}) => `btn btn-ghost${isActive ? ' active' : ''}`} style={{ fontSize: 11 }}>
              IDE View
            </NavLink>

            {/* Notifications */}
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={15} style={{ color: 'var(--text-secondary)' }} />
              <div style={{
                position: 'absolute',
                top: -3,
                right: -3,
                width: 7,
                height: 7,
                background: 'var(--red)',
                borderRadius: '50%',
                border: '1.5px solid var(--bg-surface)'
              }} />
            </div>
          </div>
        </header>
        )}

        {/* Content */}
        <div className={isFullscreen ? "" : "content-area"} style={isFullscreen ? { flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' } : {}}>
          <Routes>
            <Route path="/" element={<Navigate to="/ide" replace />} />
            <Route path="/overview" element={<Overview onOpenPR={() => navigate('/pull-requests/184/report')} />} />
            <Route path="/repositories" element={<Repositories />} />
            <Route path="/pull-requests" element={<PullRequests />} />
            <Route path="/pull-requests/184" element={<PullRequests />} />
            <Route path="/pull-requests/184/report" element={<PRReport />} />
            <Route path="/github/pr/184" element={<GitHubPR />} />
            <Route path="/change-impact" element={<ChangeImpact />} />
            <Route path="/test-selection" element={<RegressionPlan />} />
            <Route path="/regression-plan" element={<RegressionPlan />} />
            <Route path="/test-needs" element={<TestNeeds />} />
            <Route path="/execution" element={<Execution />} />
            <Route path="/coverage" element={<Coverage />} />
            <Route path="/test-health" element={<TestHealth />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/copilot" element={<Copilot />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/install" element={<Install />} />
            <Route path="/ide" element={<IDE />} />
            <Route path="/install-auracle" element={<IDE />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <DemoProvider>
        <AppShell />
      </DemoProvider>
    </BrowserRouter>
  )
}
