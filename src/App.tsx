import './index.css'
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, GitBranch, GitPullRequest, Zap, CheckSquare,
  BarChart2, Activity, History, Bot, Settings, ChevronRight,
  Search, Bell, Play, RotateCcw, X, AlertCircle, Database
} from 'lucide-react'
import { useState, useRef } from 'react'
import { DEMO_STEPS, REPO } from './data/mockData'

// Pages
import Overview from './pages/Overview'
import Repositories from './pages/Repositories'
import PullRequests from './pages/PullRequests'
import ChangeImpact from './pages/ChangeImpact'
import TestSelection from './pages/TestSelection'
import Coverage from './pages/Coverage'
import TestHealth from './pages/TestHealth'
import HistoryPage from './pages/HistoryPage'
import Copilot from './pages/Copilot'
import SettingsPage from './pages/Settings'
import Install from './pages/Install'
import IDE from './pages/IDE'
import PRReport from './pages/PRReport'

function AppShell() {
  const [demoOpen, setDemoOpen] = useState(false)
  const [demoStep, setDemoStep] = useState(0)
  const navigate = useNavigate()

  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const panelRef = useRef<HTMLDivElement>(null)

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, .demo-step-dot')) return
    setIsDragging(true)
    dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
    if (panelRef.current) panelRef.current.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    setPos({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y })
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false)
    if (panelRef.current) panelRef.current.releasePointerCapture(e.pointerId)
  }

  const currentStep = DEMO_STEPS[demoStep]

  const handleDemoNext = () => {
    const next = demoStep + 1
    if (next < DEMO_STEPS.length) {
      setDemoStep(next)
      navigate(DEMO_STEPS[next].route)
    }
  }

  const handleDemoPrev = () => {
    const prev = demoStep - 1
    if (prev >= 0) {
      setDemoStep(prev)
      navigate(DEMO_STEPS[prev].route)
    }
  }

  const handleDemoOpen = () => {
    setDemoStep(0)
    setDemoOpen(true)
    navigate(DEMO_STEPS[0].route)
  }

  const handleDemoReset = () => {
    setDemoStep(0)
    navigate(DEMO_STEPS[0].route)
  }

  const handleDemoGotoStep = (idx: number) => {
    setDemoStep(idx)
    navigate(DEMO_STEPS[idx].route)
  }

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark">A</div>
          <span className="sidebar-logo-text">Auracle</span>
          <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>v0.6.3</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <NavLink to="/" end className={({isActive}) => `nav-item${isActive ? ' active' : ''}`}>
              <LayoutDashboard size={14} /><span>Overview</span>
            </NavLink>
            <NavLink to="/repositories" className={({isActive}) => `nav-item${isActive ? ' active' : ''}`}>
              <Database size={14} /><span>Repositories</span>
            </NavLink>
            <NavLink to="/pull-requests" className={({isActive}) => `nav-item${isActive ? ' active' : ''}`}>
              <GitPullRequest size={14} /><span>Pull Requests</span>
              <span className="nav-badge">1</span>
            </NavLink>
          </div>

          <div className="nav-section">
            <div className="nav-section-label">Analysis</div>
            <NavLink to="/change-impact" className={({isActive}) => `nav-item${isActive ? ' active' : ''}`}>
              <Zap size={14} /><span>Change Impact</span>
            </NavLink>
            <NavLink to="/test-selection" className={({isActive}) => `nav-item${isActive ? ' active' : ''}`}>
              <CheckSquare size={14} /><span>Test Selection</span>
            </NavLink>
            <NavLink to="/coverage" className={({isActive}) => `nav-item${isActive ? ' active' : ''}`}>
              <BarChart2 size={14} /><span>Coverage</span>
            </NavLink>
          </div>

          <div className="nav-section">
            <div className="nav-section-label">Intelligence</div>
            <NavLink to="/test-health" className={({isActive}) => `nav-item${isActive ? ' active' : ''}`}>
              <Activity size={14} /><span>Test Health</span>
            </NavLink>
            <NavLink to="/history" className={({isActive}) => `nav-item${isActive ? ' active' : ''}`}>
              <History size={14} /><span>History</span>
            </NavLink>
            <NavLink to="/copilot" className={({isActive}) => `nav-item${isActive ? ' active' : ''}`}>
              <Bot size={14} /><span>AI Copilot</span>
              <span className="nav-badge blue">AI</span>
            </NavLink>
          </div>

          <div className="nav-section" style={{ marginTop: 'auto' }}>
            <NavLink to="/settings" className={({isActive}) => `nav-item${isActive ? ' active' : ''}`}>
              <Settings size={14} /><span>Settings</span>
            </NavLink>
          </div>
        </nav>

        {/* Sidebar footer — model status */}
        <div style={{
          padding: '10px 12px',
          borderTop: '1px solid var(--border-subtle)',
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
      </aside>

      {/* Main */}
      <div className="main-area">
        {/* Topbar */}
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

            {/* User avatar */}
            <div className="avatar" style={{ width: 26, height: 26, fontSize: 10, cursor: 'pointer' }}>MC</div>

            {/* Demo button */}
            <button className="btn btn-demo" onClick={handleDemoOpen}>
              <Play size={11} />
              Present Demo
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="content-area">
          <Routes>
            <Route path="/" element={<Overview onOpenPR={() => navigate('/pull-requests/184/report')} />} />
            <Route path="/repositories" element={<Repositories />} />
            <Route path="/pull-requests" element={<PullRequests />} />
            <Route path="/pull-requests/184" element={<PullRequests />} />
            <Route path="/pull-requests/184/report" element={<PRReport />} />
            <Route path="/change-impact" element={<ChangeImpact />} />
            <Route path="/test-selection" element={<TestSelection />} />
            <Route path="/coverage" element={<Coverage />} />
            <Route path="/test-health" element={<TestHealth />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/copilot" element={<Copilot />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/install" element={<Install />} />
            <Route path="/ide" element={<IDE />} />
          </Routes>
        </div>
      </div>

      {/* Demo overlay */}
      {demoOpen && (
        <div className="demo-overlay">
          <div 
            ref={panelRef}
            className="demo-panel animate-slide-up"
            style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* Step indicators */}
            <div className="demo-step-indicator">
              {DEMO_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`demo-step-dot${i === demoStep ? ' active' : i < demoStep ? ' done' : ''}`}
                  onClick={() => handleDemoGotoStep(i)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>

            {/* Step header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                  Step {demoStep + 1} of {DEMO_STEPS.length}
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 8 }}>
                  {currentStep.title}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {currentStep.description}
                </div>
              </div>
              <button className="btn btn-ghost" onClick={() => setDemoOpen(false)} style={{ flexShrink: 0 }}>
                <X size={14} />
              </button>
            </div>

            {/* Presenter notes */}
            <div style={{
              background: 'rgba(255, 196, 77, 0.06)',
              border: '1px solid rgba(255, 196, 77, 0.15)',
              borderRadius: 6,
              padding: '10px 12px',
              marginBottom: 16,
              display: 'flex',
              gap: 8,
              alignItems: 'flex-start'
            }}>
              <AlertCircle size={13} style={{ color: 'var(--yellow)', flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--yellow)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Presenter Notes</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{currentStep.presenterNotes}</div>
              </div>
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button className="btn btn-secondary" onClick={handleDemoReset} style={{ gap: 4 }}>
                <RotateCcw size={11} />
                Reset
              </button>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn btn-secondary"
                  onClick={handleDemoPrev}
                  disabled={demoStep === 0}
                  style={{ opacity: demoStep === 0 ? 0.4 : 1 }}
                >
                  ← Previous
                </button>
                <button
                  className="btn btn-primary"
                  onClick={demoStep === DEMO_STEPS.length - 1 ? () => setDemoOpen(false) : handleDemoNext}
                >
                  {demoStep === DEMO_STEPS.length - 1 ? 'Finish' : 'Next →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
