import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  XCircle, CheckCircle, AlertTriangle, ChevronRight, GitCommit,
  GitBranch, Clock, User, FileCode, X
} from 'lucide-react'
import {
  PR, CHANGE_SUMMARY, CHANGED_FILES, SELECTED_TESTS, COVERAGE_LINES,
  EVIDENCE_LEDGER, CI_STEPS, IMPACT_GRAPH_NODES, IMPACT_GRAPH_EDGES
} from '../data/mockData'

type TabId = 'summary' | 'change' | 'impact' | 'tests' | 'coverage' | 'evidence' | 'ci'

export default function PRReport() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = (searchParams.get('tab') as TabId) || 'summary'
  const navigate = useNavigate()
  const [selectedTest, setSelectedTest] = useState<typeof SELECTED_TESTS[0] | null>(null)
  const [testFilter, setTestFilter] = useState<'all' | 'selected' | 'failed' | 'not-selected'>('all')
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [ciExpandedStep, setCiExpandedStep] = useState<number | null>(4) // Expand pytest step by default

  const setTab = (tab: TabId) => setSearchParams({ tab })

  const filteredTests = SELECTED_TESTS.filter(t => {
    if (testFilter === 'selected') return t.selected
    if (testFilter === 'failed') return t.result === 'FAIL'
    if (testFilter === 'not-selected') return !t.selected
    return true
  })

  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'change', label: 'Change', count: CHANGE_SUMMARY.filesChanged },
    { id: 'impact', label: 'Impact', count: CHANGE_SUMMARY.functionsAffected },
    { id: 'tests', label: 'Tests', count: CHANGE_SUMMARY.selectedTests },
    { id: 'coverage', label: 'Coverage' },
    { id: 'evidence', label: 'Evidence', count: EVIDENCE_LEDGER.length },
    { id: 'ci', label: 'CI' },
  ]

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div className="breadcrumb" style={{ marginBottom: 16 }}>
        <span className="breadcrumb-item" onClick={() => navigate('/pull-requests')}>Pull Requests</span>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-item current">PR #{PR.number}</span>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-item current">Change Report</span>
      </div>

      {/* PR Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span className="badge badge-fail" style={{ fontSize: 12, padding: '3px 10px' }}>GATE: FAIL</span>
              <span className="badge badge-high" style={{ fontSize: 12, padding: '3px 10px' }}>RISK: HIGH</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
                {PR.title}
              </h1>
              <button 
                className="btn btn-primary" 
                style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px' }}
                onClick={() => navigate('/ide?step=2')}
              >
                <FileCode size={14} />
                Open in IDE to Fix
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                <GitPullRequest size={12} />
                <span style={{ fontFamily: 'var(--font-mono)' }}>#{PR.number}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                <GitBranch size={12} />
                <span style={{ fontFamily: 'var(--font-mono)' }}>{PR.branch}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                <GitCommit size={12} />
                <span style={{ fontFamily: 'var(--font-mono)' }}>{PR.commit}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                <User size={12} />
                <span>{PR.author.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                <Clock size={12} />
                <span>Analyzed 09:18 UTC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gate banner */}
        <div className="gate-banner fail">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <XCircle size={18} style={{ color: 'var(--red)', flexShrink: 0 }} />
            <div>
              <div className="gate-banner-title">WHY THIS CHANGE IS BLOCKED</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 12, color: 'var(--red-text)', fontWeight: 600 }}>1.</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--red-text)' }}>test_refund_failure</span>{' '}
                    FAILED — a directly relevant selected test failed on revision {' '}
                    <span style={{ fontFamily: 'var(--font-mono)' }}>a92f31e</span>.
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 12, color: 'var(--red-text)', fontWeight: 600 }}>2.</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    The retry exhaustion branch (
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--yellow-text)' }}>payments/service.py:159-167</span>
                    ) has no validated regression test evidence.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 1, background: 'var(--border-subtle)', borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
        {[
          { label: 'Files Changed', value: CHANGE_SUMMARY.filesChanged, color: '' },
          { label: 'Functions Affected', value: CHANGE_SUMMARY.functionsAffected, color: '' },
          { label: 'Relevant Tests', value: CHANGE_SUMMARY.relevantTests, color: '' },
          { label: 'Selected Tests', value: CHANGE_SUMMARY.selectedTests, color: 'blue' },
          { label: 'Changed Coverage', value: `${CHANGE_SUMMARY.changedCodeCoverage}%`, color: 'green' },
          { label: 'Confidence', value: `${CHANGE_SUMMARY.confidence}%`, color: 'blue' },
          { label: 'Selective Runtime', value: CHANGE_SUMMARY.selectiveRuntime, color: '' },
          { label: 'Full Suite', value: CHANGE_SUMMARY.fullSuiteRuntime, color: '' },
        ].map((m, i) => (
          <div key={i} className="metric-card" style={{ padding: '10px 12px' }}>
            <div className="metric-label" style={{ fontSize: 9, marginBottom: 3 }}>{m.label}</div>
            <div className={`metric-value ${m.color}`} style={{ fontSize: 16 }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Evidence chain */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <span className="card-title">Evidence Chain</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Click any step to view details</span>
        </div>
        <div style={{ padding: '14px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto' }}>
            {[
              { label: 'CHANGE', icon: '⚡', status: 'done', tab: 'change' },
              { label: 'IMPACT', icon: '🔗', status: 'done', tab: 'impact' },
              { label: 'SELECTION', icon: '🎯', status: 'done', tab: 'tests' },
              { label: 'EXECUTION', icon: '▶', status: 'done', tab: 'ci' },
              { label: 'COVERAGE', icon: '📊', status: 'warn', tab: 'coverage' },
              { label: 'QUALITY GATE', icon: '🔴', status: 'fail', tab: 'summary' },
            ].map((step, i, arr) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  onClick={() => setTab(step.tab as TabId)}
                  style={{
                    background: step.status === 'fail' ? 'var(--red-dim)' : step.status === 'warn' ? 'var(--yellow-dim)' : 'var(--bg-overlay)',
                    border: `1px solid ${step.status === 'fail' ? '#4a1515' : step.status === 'warn' ? '#3d2a0a' : 'var(--border-default)'}`,
                    borderRadius: 6,
                    padding: '6px 12px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: step.status === 'fail' ? 'var(--red-text)' : step.status === 'warn' ? 'var(--yellow-text)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.12s ease',
                  }}
                >
                  <span>{step.icon}</span>
                  {step.label}
                </div>
                {i < arr.length - 1 && (
                  <ChevronRight size={14} style={{ color: 'var(--text-muted)', margin: '0 4px', flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-list" style={{ marginBottom: 20 }}>
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`tab-item${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setTab(tab.id as TabId)}
          >
            {tab.label}
            {tab.count != null && <span className="tab-count">{tab.count}</span>}
          </div>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'summary' && <SummaryTab />}
      {activeTab === 'change' && <ChangeTab />}
      {activeTab === 'impact' && <ImpactTab selectedNode={selectedNode} setSelectedNode={setSelectedNode} />}
      {activeTab === 'tests' && (
        <TestsTab
          filter={testFilter}
          setFilter={setTestFilter}
          filteredTests={filteredTests}
          selectedTest={selectedTest}
          setSelectedTest={setSelectedTest}
        />
      )}
      {activeTab === 'coverage' && <CoverageTab />}
      {activeTab === 'evidence' && <EvidenceTab />}
      {activeTab === 'ci' && <CITab expandedStep={ciExpandedStep} setExpandedStep={setCiExpandedStep} />}
    </div>
  )
}

function GitPullRequest({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>
}

// ===== SUMMARY TAB =====
function SummaryTab() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Blocking reasons */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Blocking Reasons</span>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: 'rgba(240, 68, 56, 0.06)', border: '1px solid rgba(240, 68, 56, 0.2)', borderRadius: 8, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <XCircle size={14} style={{ color: 'var(--red)' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--red-text)' }}>FAILED TEST — Execution evidence</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', background: 'var(--bg-overlay)', padding: '1px 5px', borderRadius: 3 }}>EXEC-184-11</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--red-text)' }}>test_refund_failure</span> failed on revision{' '}
                  <span style={{ fontFamily: 'var(--font-mono)' }}>a92f31e</span>. The test expected{' '}
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue-text)' }}>result.success</span> to be{' '}
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--red-text)' }}>False</span>, but{' '}
                  <span style={{ fontFamily: 'var(--font-mono)' }}>PaymentService.refund()</span>{' '}
                  now raises <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--yellow-text)' }}>TransientGatewayError</span>{' '}
                  before returning a result.
                </div>
              </div>

              <div style={{ background: 'rgba(245, 166, 35, 0.06)', border: '1px solid rgba(245, 166, 35, 0.2)', borderRadius: 8, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <AlertTriangle size={14} style={{ color: 'var(--yellow)' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--yellow-text)' }}>MATERIAL TESTING GAP — Coverage evidence</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', background: 'var(--bg-overlay)', padding: '1px 5px', borderRadius: 3 }}>COV-184-12</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  The retry exhaustion branch (
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--yellow-text)' }}>payments/service.py:159-167</span>
                  ) has zero coverage evidence after all 24 selected tests executed. This newly introduced code path handles{' '}
                  <span style={{ fontFamily: 'var(--font-mono)' }}>RetryExhaustedException</span>{' '}
                  and has no validated regression test.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Evidence timeline */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Analysis Timeline</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>a92f31e</span>
          </div>
          <div style={{ padding: '16px 20px' }}>
            <div className="evidence-chain">
              {[
                { dot: 'neutral', label: 'Change analyzed', sub: '8 files · +126/-38 lines · 17 functions affected', time: '08:42:14', id: 'CHG-184-02' },
                { dot: 'neutral', label: 'Impact mapped', sub: '42 relevant tests found via TIA engine', time: '08:42:21', id: 'IMP-184-05' },
                { dot: 'neutral', label: '24 tests selected', sub: 'Confidence target 90% · Estimated 4m 12s · -84% vs full suite', time: '08:42:28', id: 'PRED-184-09' },
                { dot: 'neutral', label: '24 tests executed', sub: 'pytest · ubuntu-latest · 4m 07s', time: '09:01:14', id: 'EXEC-184-10' },
                { dot: 'warn', label: '1 gap unresolved', sub: 'retry exhaustion branch · lines 159-167 uncovered', time: '09:05:28', id: 'COV-184-12' },
                { dot: 'fail', label: 'Quality Gate: FAIL', sub: '2 blocking reasons · test failure + material gap', time: '09:05:33', id: 'GATE-184-14' },
              ].map((step, i, arr) => (
                <div key={i} className="evidence-step">
                  <div className="evidence-step-connector">
                    <div className={`evidence-dot ${step.dot}`} />
                    {i < arr.length - 1 && <div className="evidence-line" />}
                  </div>
                  <div className="evidence-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{step.label}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', background: 'var(--bg-overlay)', padding: '1px 5px', borderRadius: 3 }}>{step.id}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{step.sub}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{step.time} UTC</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* What Auracle is NOT saying */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Core Principle</span>
          </div>
          <div style={{ padding: '12px 16px' }}>
            <div style={{ background: 'rgba(79, 127, 255, 0.06)', border: '1px solid rgba(79, 127, 255, 0.15)', borderRadius: 6, padding: '10px 12px', marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--blue-text)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI ASSISTS · EVIDENCE DECIDES</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                23 tests passed. This does NOT make the change safe. Auracle examines what changed, what was covered, what gaps remain, and what the actual execution results show — not just whether a green badge appeared.
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              The AI Copilot explains this structured evidence. It does not invent test results or coverage facts.
            </div>
          </div>
        </div>

        {/* Test results summary */}
        <div className="card">
          <div className="card-header"><span className="card-title">Test Execution Summary</span></div>
          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Relevant tests found</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>42</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Tests selected</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>24</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Tests passed</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--green)' }}>23</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Tests failed</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--red)' }}>1</span>
            </div>
            <div style={{ height: 1, background: 'var(--border-subtle)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Changed-code coverage</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--green)' }}>88%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Branch coverage</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--yellow)' }}>81%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Material gaps</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--red)' }}>1</span>
            </div>
            <div style={{ height: 1, background: 'var(--border-subtle)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Runtime saved</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--green)' }}>84%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Full suite</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'line-through' }}>312 tests · 26m 48s</span>
            </div>
          </div>
        </div>

        {/* Auracle verdict */}
        <div className="card">
          <div className="card-header"><span className="card-title">Quality Gate Evidence</span></div>
          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { check: false, label: 'Selected test passed', detail: 'test_refund_failure FAILED' },
              { check: false, label: 'No material testing gaps', detail: '1 unresolved gap (lines 159-167)' },
              { check: true, label: 'Changed coverage ≥ 80%', detail: '88% observed' },
              { check: true, label: 'Confidence ≥ 90%', detail: '92% selection confidence' },
              { check: true, label: 'Most selected tests passed', detail: '23/24 passed' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {item.check
                  ? <CheckCircle size={13} style={{ color: 'var(--green)', flexShrink: 0 }} />
                  : <XCircle size={13} style={{ color: 'var(--red)', flexShrink: 0 }} />
                }
                <span style={{ fontSize: 12, color: item.check ? 'var(--text-secondary)' : 'var(--text-primary)', fontWeight: item.check ? 400 : 500 }}>
                  {item.label}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto', textAlign: 'right' }}>{item.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== CHANGE TAB =====
function ChangeTab() {
  const [selectedFile, setSelectedFile] = useState(CHANGED_FILES[0])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 }}>
      {/* File list */}
      <div className="card" style={{ height: 'fit-content' }}>
        <div className="card-header"><span className="card-title">Changed Files</span></div>
        <div>
          {CHANGED_FILES.map((file, i) => (
            <div
              key={i}
              onClick={() => setSelectedFile(file)}
              style={{
                padding: '8px 12px',
                borderBottom: i < CHANGED_FILES.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                cursor: 'pointer',
                background: selectedFile.path === file.path ? 'var(--bg-overlay)' : 'transparent',
                transition: 'background 0.1s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <FileCode size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {file.path.split('/').pop()}
                </span>
                {file.isMainChange && <span className="badge badge-red" style={{ fontSize: 9, padding: '0 4px' }}>main</span>}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 2 }}>{file.path}</div>
              <div style={{ display: 'flex', gap: 8, fontSize: 10 }}>
                <span style={{ color: 'var(--green-text)' }}>+{file.added}</span>
                <span style={{ color: 'var(--red-text)' }}>-{file.deleted}</span>
                <span style={{ color: 'var(--text-muted)', marginLeft: 'auto' }}>{file.classification}</span>
              </div>
              {file.gaps > 0 && (
                <div style={{ marginTop: 4, fontSize: 10, color: 'var(--yellow-text)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AlertTriangle size={9} /> {file.gaps} coverage gap
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Diff viewer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-primary)' }}>{selectedFile.path}</span>
              <span className="badge badge-muted">{selectedFile.language}</span>
              <span className="badge badge-muted">{selectedFile.classification}</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--green-text)', fontFamily: 'var(--font-mono)' }}>+{selectedFile.added}</span>
              <span style={{ fontSize: 11, color: 'var(--red-text)', fontFamily: 'var(--font-mono)' }}>-{selectedFile.deleted}</span>
            </div>
          </div>
          <div style={{ padding: '0 0 8px' }}>
            {selectedFile.changedSymbols.length > 0 && (
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Changed symbols:</span>
                {selectedFile.changedSymbols.map((s, i) => (
                  <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--blue-text)', background: 'var(--bg-overlay)', padding: '1px 6px', borderRadius: 3 }}>
                    {s}
                  </span>
                ))}
              </div>
            )}
            <div className="code-viewer" style={{ border: 'none', borderRadius: 0 }}>
              <div style={{ overflowX: 'auto' }}>
                {selectedFile.diff.split('\n').map((line, i) => {
                  const isAdd = line.startsWith('+') && !line.startsWith('+++')
                  const isDel = line.startsWith('-') && !line.startsWith('---')
                  const isHunk = line.startsWith('@@')
                  return (
                    <div key={i} style={{
                      display: 'flex',
                      background: isAdd ? 'rgba(45, 217, 138, 0.08)' : isDel ? 'rgba(240, 68, 56, 0.08)' : isHunk ? 'rgba(79, 127, 255, 0.08)' : 'transparent',
                      minHeight: 20,
                    }}>
                      <div style={{ width: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontFamily: 'var(--font-mono)', color: isAdd ? 'var(--green-text)' : isDel ? 'var(--red-text)' : 'var(--text-muted)', flexShrink: 0 }}>
                        {isAdd ? '+' : isDel ? '-' : isHunk ? '' : ' '}
                      </div>
                      <div style={{ padding: '2px 8px', fontSize: 11.5, fontFamily: 'var(--font-mono)', color: isAdd ? '#aaffcc' : isDel ? '#ffaaaa' : isHunk ? '#7aa5ff' : '#c9d1d9', whiteSpace: 'pre', overflow: 'hidden' }}>
                        {line.startsWith('+') || line.startsWith('-') ? line.slice(1) : line}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Coverage for this file */}
        <div className="card">
          <div className="card-header"><span className="card-title">Coverage for this file</span></div>
          <div style={{ padding: '10px 16px', display: 'flex', gap: 16, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Changed-code coverage</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: selectedFile.coverage >= 90 ? 'var(--green)' : selectedFile.coverage >= 70 ? 'var(--yellow)' : 'var(--red)' }}>
                {selectedFile.coverage}%
              </div>
            </div>
            {selectedFile.gaps > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--yellow-dim)', border: '1px solid rgba(245, 166, 35, 0.3)', borderRadius: 6, padding: '6px 10px' }}>
                <AlertTriangle size={12} style={{ color: 'var(--yellow)' }} />
                <span style={{ fontSize: 12, color: 'var(--yellow-text)' }}>{selectedFile.gaps} material testing gap</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== IMPACT TAB =====
function ImpactTab({ selectedNode, setSelectedNode }: { selectedNode: string | null, setSelectedNode: (n: string | null) => void }) {
  const node = IMPACT_GRAPH_NODES.find(n => n.id === selectedNode)
  const relatedEdges = IMPACT_GRAPH_EDGES.filter(e => e.source === selectedNode || e.target === selectedNode)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
      {/* Graph */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Dependency / Impact Graph</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="badge badge-blue">Changed</span>
            <span className="badge badge-green">Test</span>
            <span className="badge badge-muted">Function</span>
          </div>
        </div>
        <div style={{ position: 'relative', height: 520, background: '#080a0f', margin: 1, borderRadius: 6, overflow: 'hidden' }}>
          {/* SVG edges */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            {IMPACT_GRAPH_EDGES.map((edge, i) => {
              const src = IMPACT_GRAPH_NODES.find(n => n.id === edge.source)
              const tgt = IMPACT_GRAPH_NODES.find(n => n.id === edge.target)
              if (!src || !tgt) return null
              const isHighlighted = selectedNode && (edge.source === selectedNode || edge.target === selectedNode)
              return (
                <line key={i}
                  x1={src.x + 60} y1={src.y + 14}
                  x2={tgt.x + 60} y2={tgt.y + 14}
                  stroke={isHighlighted ? '#4f7fff' : '#252b3b'}
                  strokeWidth={isHighlighted ? 2 : 1}
                  strokeDasharray={edge.type === 'historically_associated' ? '4,4' : edge.type === 'covered_by' ? '3,2' : 'none'}
                  opacity={selectedNode && !isHighlighted ? 0.2 : 1}
                />
              )
            })}
          </svg>

          {/* Nodes */}
          {IMPACT_GRAPH_NODES.map((n, i) => {
            const isSelected = selectedNode === n.id
            const isRelated = IMPACT_GRAPH_EDGES.some(e => (e.source === selectedNode && e.target === n.id) || (e.target === selectedNode && e.source === n.id))
            const isDim = selectedNode && !isSelected && !isRelated

            return (
              <div
                key={i}
                onClick={() => setSelectedNode(isSelected ? null : n.id)}
                style={{
                  position: 'absolute',
                  left: n.x,
                  top: n.y,
                  background: n.type === 'test' ? (n.result === 'FAIL' ? 'rgba(240,68,56,0.12)' : 'rgba(45,217,138,0.08)') : n.changed ? 'rgba(79,127,255,0.12)' : '#111827',
                  border: `1px solid ${isSelected ? '#4f7fff' : n.type === 'test' ? (n.result === 'FAIL' ? '#4a1515' : '#1a4a30') : n.changed ? 'var(--accent-dim)' : 'var(--border-strong)'}`,
                  borderRadius: 6,
                  padding: '5px 10px',
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  color: n.type === 'test' ? (n.result === 'FAIL' ? 'var(--red-text)' : 'var(--green-text)') : n.changed ? 'var(--blue-text)' : 'var(--text-secondary)',
                  zIndex: isSelected ? 10 : 1,
                  opacity: isDim ? 0.25 : 1,
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 0 0 2px rgba(79,127,255,0.3)' : 'none',
                  maxWidth: 160,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {n.type === 'test' && n.result === 'FAIL' && <span style={{ marginRight: 4 }}>✗</span>}
                {n.type === 'test' && n.result === 'PASS' && <span style={{ marginRight: 4 }}>✓</span>}
                {n.changed && n.type !== 'test' && <span style={{ marginRight: 4, color: 'var(--accent)' }}>●</span>}
                {n.id.split('.').pop() || n.id}
              </div>
            )
          })}

          {/* Legend */}
          <div style={{ position: 'absolute', bottom: 12, left: 12, fontSize: 10, color: 'var(--text-muted)', display: 'flex', gap: 12 }}>
            <span>─── calls/depends</span>
            <span>- - - history/coverage</span>
            <span style={{ color: 'var(--accent)' }}>● changed</span>
          </div>
        </div>
      </div>

      {/* Inspector */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Inspector</span>
        </div>
        {selectedNode && node ? (
          <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Symbol</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-primary)', wordBreak: 'break-all' }}>{node.id}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>File</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--blue-text)' }}>{node.file}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Type</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <span className={`badge badge-${node.type === 'test' ? 'green' : 'blue'}`}>{node.type}</span>
                {node.changed && <span className="badge badge-blue">changed</span>}
                {node.result && <span className={`badge badge-${node.result === 'FAIL' ? 'fail' : 'pass'}`}>{node.result}</span>}
              </div>
            </div>
            {relatedEdges.length > 0 && (
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Relationships</div>
                {relatedEdges.map((edge, i) => (
                  <div key={i} style={{ fontSize: 11, color: 'var(--text-secondary)', padding: '4px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--text-muted)', marginRight: 6 }}>
                      {edge.source === selectedNode ? '→' : '←'}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue-text)' }}>
                      {edge.source === selectedNode ? edge.target : edge.source}
                    </span>
                    <span style={{ color: 'var(--text-muted)', float: 'right', fontSize: 10, fontStyle: 'italic' }}>{edge.type.replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
            <div style={{ marginBottom: 8, fontSize: 18 }}>👆</div>
            Click a node to inspect its relationships, evidence, and change state.
          </div>
        )}

        {/* TIA summary */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '12px 16px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>Impact Signals</div>
          {[
            { label: 'Direct dependency', count: 5 },
            { label: 'Coverage relationship', count: 8 },
            { label: 'Call graph relationship', count: 4 },
            { label: 'Historical association', count: 3 },
          ].map((sig, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 5 }}>
              <span style={{ color: 'var(--text-secondary)' }}>{sig.label}</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{sig.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ===== TESTS TAB =====
function TestsTab({ filter, setFilter, filteredTests, selectedTest, setSelectedTest }: any) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div className="filter-bar">
          {[
            { id: 'all', label: 'All (42)' },
            { id: 'selected', label: 'Selected (24)' },
            { id: 'failed', label: 'Failed (1)' },
            { id: 'not-selected', label: 'Not Selected (18)' },
          ].map(f => (
            <div key={f.id} className={`filter-option${filter === f.id ? ' active' : ''}`} onClick={() => setFilter(f.id)}>
              {f.label}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>
          Showing {filteredTests.length} tests · Model v0.6.3 · Confidence 92%
        </div>
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>Rank</th>
                <th>Test</th>
                <th style={{ width: 90 }}>Impact Score</th>
                <th style={{ width: 90 }}>Fail Prob.</th>
                <th style={{ width: 80 }}>Coverage</th>
                <th style={{ width: 80 }}>Duration</th>
                <th style={{ width: 70 }}>Selected</th>
                <th style={{ width: 70 }}>Result</th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.map((test: typeof SELECTED_TESTS[0]) => (
                <tr
                  key={test.id}
                  onClick={() => setSelectedTest(selectedTest?.id === test.id ? null : test)}
                  className={`${test.selected ? 'selected-row' : ''} ${test.result === 'FAIL' ? 'fail-row' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: 11 }}>#{test.rank}</td>
                  <td>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: test.result === 'FAIL' ? 'var(--red-text)' : 'var(--text-primary)', marginBottom: 2 }}>
                      {test.name}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{test.file}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ flex: 1, height: 4, background: 'var(--bg-overlay)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${test.impactScore * 100}%`, background: test.impactScore > 0.8 ? 'var(--accent)' : test.impactScore > 0.5 ? 'var(--yellow)' : 'var(--text-muted)', borderRadius: 2 }} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-primary)', width: 30 }}>{test.impactScore.toFixed(2)}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: test.failureProbability > 0.7 ? 'var(--red-text)' : test.failureProbability > 0.3 ? 'var(--yellow-text)' : 'var(--text-secondary)' }}>
                      {(test.failureProbability * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${test.coverageRelationship === 'direct' ? 'blue' : test.coverageRelationship === 'dependency' ? 'muted' : test.coverageRelationship === 'historical' ? 'purple' : 'muted'}`} style={{ fontSize: 9 }}>
                      {test.coverageRelationship}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{test.duration}</td>
                  <td>
                    {test.selected
                      ? <CheckCircle size={13} style={{ color: 'var(--accent)' }} />
                      : <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>—</span>
                    }
                  </td>
                  <td>
                    {test.result === 'PASS' && <span className="badge badge-pass" style={{ fontSize: 9 }}>PASS</span>}
                    {test.result === 'FAIL' && <span className="badge badge-fail" style={{ fontSize: 9 }}>FAIL</span>}
                    {!test.result && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>not run</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Test detail drawer */}
      {selectedTest && (
        <>
          <div className="drawer-overlay" onClick={() => setSelectedTest(null)} />
          <div className="drawer">
            <div className="drawer-header">
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-primary)', marginBottom: 2 }}>{selectedTest.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{selectedTest.file}</div>
              </div>
              <button className="btn btn-ghost" onClick={() => setSelectedTest(null)}>
                <X size={14} />
              </button>
            </div>
            <div className="drawer-body">
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                <span className={`badge badge-${selectedTest.result === 'FAIL' ? 'fail' : selectedTest.result === 'PASS' ? 'pass' : 'muted'}`}>
                  {selectedTest.result || 'NOT RUN'}
                </span>
                {selectedTest.selected && <span className="badge badge-blue">SELECTED</span>}
                <span className="badge badge-muted">Rank #{selectedTest.rank}</span>
                <span className="badge badge-purple">Model v0.6.3</span>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Scores</div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>Impact score</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)' }}>{selectedTest.impactScore}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>Failure prob.</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: selectedTest.failureProbability > 0.7 ? 'var(--red)' : 'var(--yellow)' }}>
                      {(selectedTest.failureProbability * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>Duration</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{selectedTest.duration}</div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Why Selected</div>
                {selectedTest.reasons.map((reason: string, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--green)', flexShrink: 0 }}>✓</span>
                    <span>{reason}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Historical Relationship</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic' }}>{selectedTest.historicalRelationship}</div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Coverage Relationship</div>
                <span className={`badge badge-${selectedTest.coverageRelationship === 'direct' ? 'blue' : 'muted'}`}>
                  {selectedTest.coverageRelationship}
                </span>
              </div>

              {selectedTest.result === 'FAIL' && (
                <div style={{ background: 'var(--red-dim)', border: '1px solid #4a1515', borderRadius: 6, padding: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--red-text)', marginBottom: 6 }}>Failure Details</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#ffaaaa', lineHeight: 1.7 }}>
                    AssertionError: DID NOT RAISE {'<class \'Exception\'>'}
                    <br />test expected PaymentService.refund() to raise
                    <br />an exception, but it returned normally.
                    <br /><br />
                    <span style={{ color: 'var(--text-muted)' }}>tests/test_refund.py:44</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ===== COVERAGE TAB =====
function CoverageTab() {
  const [hoveredLine, setHoveredLine] = useState<number | null>(null)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Coverage metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--border-subtle)', borderRadius: 8, overflow: 'hidden' }}>
          {[
            { label: 'Repository Coverage', value: '87%', color: 'blue', note: 'global' },
            { label: 'Changed-Code Coverage', value: '88%', color: 'green', note: 'primary metric' },
            { label: 'Changed Branch Coverage', value: '81%', color: 'yellow', note: 'branches only' },
            { label: 'Material Gaps', value: '1', color: 'red', note: 'unresolved' },
          ].map((m, i) => (
            <div key={i} className="metric-card" style={{ textAlign: 'center' }}>
              <div className="metric-label">{m.label}</div>
              <div className={`metric-value ${m.color}`}>{m.value}</div>
              <div className="metric-sub">{m.note}</div>
            </div>
          ))}
        </div>

        {/* Warning: changed coverage vs global */}
        <div className="warn-box">
          <AlertTriangle size={13} style={{ color: 'var(--yellow)', flexShrink: 0, marginTop: 1 }} />
          <div>
            <span style={{ fontWeight: 600, color: 'var(--yellow-text)' }}>Change-aware coverage is the primary signal.</span>{' '}
            Repository coverage (87%) does not reveal that the retry exhaustion branch is uncovered.
            Changed-code coverage shows 88%, but branch coverage reveals the gap at 81%.
          </div>
        </div>

        {/* Source coverage viewer */}
        <div className="card">
          <div className="card-header">
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-primary)' }}>payments/service.py</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>PaymentService.refund()</span>
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div className="coverage-dot covered" /> covered</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div className="coverage-dot uncovered" /> uncovered</span>
            </div>
          </div>
          <div className="code-viewer" style={{ border: 'none', borderRadius: 0 }}>
            {COVERAGE_LINES.map((line, i) => (
              <div
                key={i}
                className={`code-line ${line.status}`}
                onMouseEnter={() => setHoveredLine(line.line)}
                onMouseLeave={() => setHoveredLine(null)}
                style={{ cursor: line.status !== 'neutral' ? 'pointer' : 'default', position: 'relative' }}
              >
                <div className="code-line-number">{line.line}</div>
                <div className="code-line-gutter">
                  {line.status === 'covered' && <div className="coverage-dot covered" />}
                  {line.status === 'uncovered' && <div className="coverage-dot uncovered" />}
                </div>
                <div className="code-line-content">
                  {line.added && <span style={{ color: '#2dd98a', marginRight: 4, fontSize: 10 }}>+</span>}
                  {line.content}
                </div>
                {/* Tooltip */}
                {hoveredLine === line.line && line.status === 'covered' && line.coveredBy.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    left: 60,
                    top: '100%',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 6,
                    padding: '6px 10px',
                    zIndex: 100,
                    fontSize: 11,
                    color: 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  }}>
                    Covered by: {line.coveredBy.map(t => <span key={t} style={{ fontFamily: 'var(--font-mono)', color: 'var(--green-text)', marginLeft: 4 }}>{t}</span>)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Gap callout */}
          <div style={{ padding: '12px 16px', background: 'rgba(245, 166, 35, 0.06)', borderTop: '1px solid rgba(245, 166, 35, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <AlertTriangle size={14} style={{ color: 'var(--yellow)', flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--yellow-text)', marginBottom: 4 }}>
                  MATERIAL GAP · Lines 159-167 · Retry exhaustion branch
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  The code path reached when all retry attempts are exhausted has zero coverage.
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}> RetryExhaustedException</span> is raised here,
                  but no test validates this behavior. Evidence ID: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>COV-184-12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: file coverage table */}
      <div className="card" style={{ height: 'fit-content' }}>
        <div className="card-header"><span className="card-title">Changed Files Coverage</span></div>
        <div>
          {CHANGED_FILES.map((file, i) => (
            <div key={i} style={{ padding: '9px 14px', borderBottom: i < CHANGED_FILES.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>
                  {file.path}
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, color: file.coverage >= 90 ? 'var(--green)' : file.coverage >= 70 ? 'var(--yellow)' : 'var(--red)', flexShrink: 0, marginLeft: 8 }}>
                  {file.coverage}%
                </span>
              </div>
              <div className="cov-bar-track">
                <div className="cov-bar-fill" style={{
                  width: `${file.coverage}%`,
                  background: file.coverage >= 90 ? 'var(--green)' : file.coverage >= 70 ? 'var(--yellow)' : 'var(--red)'
                }} />
              </div>
              {file.gaps > 0 && (
                <div style={{ fontSize: 10, color: 'var(--yellow-text)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <AlertTriangle size={9} /> 1 gap
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ===== EVIDENCE TAB =====
function EvidenceTab() {
  const [selected, setSelected] = useState<string | null>(null)
  const selectedEvidence = EVIDENCE_LEDGER.find(e => e.id === selected)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
      <div className="card">
        <div className="card-header">
          <span className="card-title">Evidence Ledger</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <span className="badge badge-blue">OBSERVED FACT</span>
            <span className="badge badge-purple">MODEL PREDICTION</span>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 120 }}>ID</th>
                <th style={{ width: 130 }}>Type</th>
                <th style={{ width: 100 }}>Category</th>
                <th style={{ width: 100 }}>Source</th>
                <th>Fact (summary)</th>
                <th style={{ width: 90 }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {EVIDENCE_LEDGER.map((ev) => (
                <tr
                  key={ev.id}
                  onClick={() => setSelected(selected === ev.id ? null : ev.id)}
                  style={{ cursor: 'pointer', background: selected === ev.id ? 'var(--bg-overlay)' : undefined }}
                >
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)' }}>{ev.id}</span>
                  </td>
                  <td>
                    <span className={`badge ${ev.type === 'OBSERVED_FACT' ? 'badge-blue' : 'badge-purple'}`} style={{ fontSize: 9 }}>
                      {ev.type === 'OBSERVED_FACT' ? 'OBSERVED' : 'PREDICTED'}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-muted" style={{ fontSize: 9 }}>{ev.category}</span>
                  </td>
                  <td style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{ev.source}</td>
                  <td style={{ fontSize: 11, color: 'var(--text-secondary)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ev.fact}
                  </td>
                  <td style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                    {ev.timestamp.split('T')[1].replace('Z', '')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail */}
      <div className="card" style={{ height: 'fit-content' }}>
        <div className="card-header"><span className="card-title">Evidence Detail</span></div>
        {selectedEvidence ? (
          <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>{selectedEvidence.id}</span>
              <span className={`badge ${selectedEvidence.type === 'OBSERVED_FACT' ? 'badge-blue' : 'badge-purple'}`}>
                {selectedEvidence.type}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              {[
                { label: 'Source', value: selectedEvidence.source },
                { label: 'Revision', value: selectedEvidence.revision },
                { label: 'Timestamp', value: selectedEvidence.timestamp },
                { label: 'Category', value: selectedEvidence.category },
                { label: 'Confidence', value: selectedEvidence.confidence ? `${(selectedEvidence.confidence * 100).toFixed(0)}%` : 'N/A (observed)' },
              ].map((row, i) => (
                <div key={i}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{row.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{row.value}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Fact</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.7, background: 'var(--bg-base)', borderRadius: 6, padding: 10, border: '1px solid var(--border-subtle)' }}>
                {selectedEvidence.fact}
              </div>
            </div>

            {selectedEvidence.linkedEvidence.length > 0 && (
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Linked Evidence</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {selectedEvidence.linkedEvidence.map(id => (
                    <div key={id} className="evidence-chip" onClick={() => setSelected(id)}>{id}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
            <div style={{ marginBottom: 8, fontSize: 18 }}>📋</div>
            Click an evidence record to see its full detail and trace backwards.
          </div>
        )}

        {/* Gate trace */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gate Traceability</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>GATE-184-14</span>{' → '}
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>EXEC-184-11</span>{' → '}
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>COV-184-12</span>{' → '}
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>RISK-184-13</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== CI TAB =====
function CITab({ expandedStep, setExpandedStep }: { expandedStep: number | null, setExpandedStep: (n: number | null) => void }) {
  return (
    <div>
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="card-title">GitHub Actions</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>auracle.yml · Run #247</span>
          </div>
          <span className="badge badge-fail">FAILED</span>
        </div>

        <div style={{ padding: '12px 0' }}>
          {CI_STEPS.map((step, i) => (
            <div key={i}>
              <div
                onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '8px 16px',
                  cursor: 'pointer',
                  background: expandedStep === i ? 'var(--bg-elevated)' : 'transparent',
                  transition: 'background 0.1s',
                }}
              >
                {step.status === 'success'
                  ? <CheckCircle size={15} style={{ color: 'var(--green)', flexShrink: 0 }} />
                  : <XCircle size={15} style={{ color: 'var(--red)', flexShrink: 0 }} />
                }
                <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {step.name}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{step.duration}</span>
                <ChevronRight size={12} style={{ color: 'var(--text-muted)', transform: expandedStep === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
              </div>

              {expandedStep === i && (
                <div style={{ padding: '0 16px 12px' }}>
                  <div className="terminal">
                    <div className="terminal-header">
                      <div className="terminal-dot" style={{ background: '#ff5f57' }} />
                      <div className="terminal-dot" style={{ background: '#ffbd2e' }} />
                      <div className="terminal-dot" style={{ background: '#28ca41' }} />
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 6 }}>{step.name}</span>
                    </div>
                    <div className="terminal-body">
                      {step.output.split('\n').map((line, j) => (
                        <div key={j} className={`terminal-line ${
                          line.includes('FAILED') || line.includes('error') || line.includes('exit code 1') ? 'fail' :
                          line.includes('PASSED') || line.includes('Done') || line.includes('complete') ? 'success' :
                          line.includes('auracle') || line.includes('pytest') ? 'cmd' :
                          line.includes('WARNING') ? 'warn' :
                          line.startsWith('  ') || line.startsWith('    ') ? 'dim' :
                          'highlight'
                        }`}>
                          {line || '\u00a0'}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-subtle)', background: 'var(--red-dim)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--red-text)' }}>
            Process completed with exit code 1 · 2 blocking reasons · Gate: FAIL
          </div>
        </div>
      </div>
    </div>
  )
}
