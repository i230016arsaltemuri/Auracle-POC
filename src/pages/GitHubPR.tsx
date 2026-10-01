import { useNavigate } from 'react-router-dom'
import { GitPullRequest, X, GitCommit, XCircle, CheckCircle, Check, Folder, File, Play, Pause, Loader, Bot } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useDemo } from '../context/DemoScenarioContext'

export default function GitHubPR() {
  const navigate = useNavigate()
  const { phase, setPhase } = useDemo()
  const [activeRepoTab, setActiveRepoTab] = useState('Pull requests')
  const [activePRTab, setActivePRTab] = useState('Conversation')
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [overlayText, setOverlayText] = useState('')
  const [isPaused, setIsPaused] = useState(false)
  const [auraclePanelOpen, setAuraclePanelOpen] = useState(false)
  const [isLegacyCIRunning, setIsLegacyCIRunning] = useState(phase === 'NO_AURACLE')
  const [legacyCIText, setLegacyCIText] = useState(phase === 'NO_AURACLE' ? 'Running regression suite (ETA: ~1h 45m)...' : 'Successful in 1h 45m — 14,204 tests passed')
  
  useEffect(() => {
    if (phase === 'NO_AURACLE') {
      setIsLegacyCIRunning(true)
      setLegacyCIText('Running regression suite (ETA: ~1h 45m)...')
    } else {
      setIsLegacyCIRunning(false)
      setLegacyCIText('Successful in 1h 45m — 14,204 tests passed')
    }
  }, [phase])

  const isPausedRef = useRef(false)
  const togglePause = (e: React.MouseEvent) => {
    e.stopPropagation()
    const nextPaused = !isPausedRef.current
    setIsPaused(nextPaused)
    isPausedRef.current = nextPaused
  }

  // Simulate CI running when landing on the PR initially
  const [isCIRunning, setIsCIRunning] = useState(phase === "CHANGE_CREATED")
  useEffect(() => {
    if (phase === "CHANGE_CREATED") {
      const timer = setTimeout(() => {
        setIsCIRunning(false)
        setPhase("ANALYSIS_REVIEW")
      }, 3000)
      return () => clearTimeout(timer)
    } else {
        setIsCIRunning(false)
    }
  }, [phase, setPhase])

  const playJourney = async () => {
    setIsAutoPlaying(true)
    const sleep = async (ms: number) => {
      let elapsed = 0;
      const tick = 100;
      while (elapsed < ms) {
        if (!isPausedRef.current) {
          elapsed += tick;
        }
        await new Promise(r => setTimeout(r, tick));
      }
    }
    
    if (phase === 'NO_AURACLE') {
      setOverlayText('Ahmed: "Let\'s let CI run the regression suite. It takes 1h 45m, so let\'s fast forward..."')
      await sleep(3500)
      setIsLegacyCIRunning(false)
      setLegacyCIText('Successful in 1h 45m — 14,204 tests passed')
      await sleep(1000)
      setOverlayText('Ahmed: "Wait, it passed? I added a new retry exhaustion branch..."')
      await sleep(4000)
      setOverlayText('Ahmed: "The existing regression suite doesn\'t know about my new code or dependencies. It didn\'t even test it!"')
      await sleep(4500)
      setOverlayText('Ahmed: "Green CI is dangerously misleading here. I need change-aware regression analysis. I\'ll install Auracle."')
      await sleep(4500)
      setOverlayText('')
      setIsAutoPlaying(false)
      navigate('/ide?step=install')
    } else if (phase === 'ANALYSIS_REVIEW') {
      setOverlayText('Ahmed: "Wait, why did my PR fail? Oh, Auracle found something."')
      await sleep(3500)
      setOverlayText('Ahmed: "Let me review the Regression Plan."')
      await sleep(2500)
      setOverlayText('')
      setIsAutoPlaying(false)
      navigate('/pull-requests/184/report')
    } else if (phase === 'CHANGE_CREATED') {
      setOverlayText('Ahmed: "Let\'s see what Auracle finds this time..."')
      await sleep(3500)
      setOverlayText('')
      setIsAutoPlaying(false)
    }
  }

  return (
    <div style={{ backgroundColor: '#0d1117', height: '100%', overflowY: 'auto', color: '#c9d1d9', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"' }}>
      {/* Top Navigation Bar */}
      <div style={{ backgroundColor: '#010409', borderBottom: '1px solid #21262d', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 32, height: 32, backgroundColor: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <GitPullRequest size={20} color="#24292f" />
        </div>
        <span style={{ fontWeight: 600, fontSize: 14 }}>acme / payments-api</span>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px' }}>
        
        {/* Repo Tabs */}
        <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid #21262d', paddingBottom: 0, marginBottom: 24, fontSize: 14 }}>
          <span onClick={() => setActiveRepoTab('Code')} style={{ fontWeight: activeRepoTab === 'Code' ? 600 : 400, color: '#c9d1d9', borderBottom: activeRepoTab === 'Code' ? '2px solid #f78166' : '2px solid transparent', paddingBottom: 8, cursor: 'pointer' }}>Code</span>
          <span onClick={() => setActiveRepoTab('Pull requests')} style={{ fontWeight: activeRepoTab === 'Pull requests' ? 600 : 400, color: '#c9d1d9', borderBottom: activeRepoTab === 'Pull requests' ? '2px solid #f78166' : '2px solid transparent', paddingBottom: 8, cursor: 'pointer' }}>Pull requests <span style={{ backgroundColor: '#161b22', padding: '2px 8px', borderRadius: 12, fontSize: 12, marginLeft: 4 }}>1</span></span>
          <span onClick={() => setActiveRepoTab('Actions')} style={{ fontWeight: activeRepoTab === 'Actions' ? 600 : 400, color: '#c9d1d9', borderBottom: activeRepoTab === 'Actions' ? '2px solid #f78166' : '2px solid transparent', paddingBottom: 8, cursor: 'pointer' }}>Actions</span>
        </div>

        {activeRepoTab === 'Pull requests' && (
        <>
            {/* PR Title Area */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 32, fontWeight: 400, marginBottom: 8 }}>
            Add guarded retry to refund processing <span style={{ color: '#8b949e', fontWeight: 300 }}>#184</span>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
            <span style={{ backgroundColor: phase === 'MERGED' ? '#8957e5' : '#238636', color: '#ffffff', padding: '5px 12px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, fontSize: 14 }}>
              <GitPullRequest size={16} />
              {phase === 'MERGED' ? 'Merged' : 'Open'}
            </span>
            <span style={{ color: '#8b949e', marginLeft: 4 }}>
              <strong style={{ color: '#c9d1d9' }}>ahmeddev</strong> wants to merge 1 commit into <code style={{ backgroundColor: '#161b22', padding: '3px 6px', borderRadius: 6, color: '#c9d1d9', fontSize: 13 }}>main</code> from <code style={{ backgroundColor: '#161b22', padding: '3px 6px', borderRadius: 6, color: '#c9d1d9', fontSize: 13 }}>feat/refund-retry-policy</code>
            </span>
          </div>
        </div>

        {/* PR Tabs */}
        <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid #21262d', paddingBottom: 0, marginBottom: 24, fontSize: 14 }}>
          <span onClick={() => setActivePRTab('Conversation')} style={{ fontWeight: activePRTab === 'Conversation' ? 600 : 400, color: '#c9d1d9', borderBottom: activePRTab === 'Conversation' ? '2px solid #f78166' : '2px solid transparent', paddingBottom: 12, cursor: 'pointer' }}>Conversation</span>
          <span onClick={() => setActivePRTab('Commits')} style={{ fontWeight: activePRTab === 'Commits' ? 600 : 400, color: '#c9d1d9', borderBottom: activePRTab === 'Commits' ? '2px solid #f78166' : '2px solid transparent', paddingBottom: 12, cursor: 'pointer' }}>Commits <span style={{ backgroundColor: '#161b22', padding: '2px 8px', borderRadius: 12, fontSize: 12, marginLeft: 4 }}>1</span></span>
          <span onClick={() => setActivePRTab('Checks')} style={{ fontWeight: activePRTab === 'Checks' ? 600 : 400, color: '#c9d1d9', borderBottom: activePRTab === 'Checks' ? '2px solid #f78166' : '2px solid transparent', paddingBottom: 12, cursor: 'pointer' }}>Checks <span style={{ backgroundColor: '#161b22', padding: '2px 8px', borderRadius: 12, fontSize: 12, marginLeft: 4 }}>2</span></span>
          <span onClick={() => setActivePRTab('Files changed')} style={{ fontWeight: activePRTab === 'Files changed' ? 600 : 400, color: '#c9d1d9', borderBottom: activePRTab === 'Files changed' ? '2px solid #f78166' : '2px solid transparent', paddingBottom: 12, cursor: 'pointer' }}>Files changed <span style={{ backgroundColor: '#161b22', padding: '2px 8px', borderRadius: 12, fontSize: 12, marginLeft: 4 }}>8</span></span>
        </div>

        {/* Main Content Area */}
        {activePRTab === 'Conversation' && (
        <div style={{ display: 'flex', gap: 32 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            
            {/* Vertical Timeline Line */}
            <div style={{ position: 'absolute', left: 20, top: 40, bottom: 80, width: 2, backgroundColor: '#21262d', zIndex: 0 }} />

            {/* PR Description Comment */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 32, position: 'relative', zIndex: 1 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#f5a623', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontWeight: 'bold', flexShrink: 0 }}>
                AD
              </div>
              <div style={{ flex: 1, border: '1px solid #30363d', borderRadius: 6, position: 'relative', backgroundColor: '#0d1117' }}>
                <div style={{ position: 'absolute', left: -7, top: 11, width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderRight: '7px solid #30363d' }} />
                <div style={{ position: 'absolute', left: -6, top: 12, width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderRight: '6px solid #161b22' }} />
                
                <div style={{ backgroundColor: '#161b22', padding: '8px 16px', borderBottom: '1px solid #30363d', borderTopLeftRadius: 6, borderTopRightRadius: 6, color: '#8b949e', fontSize: 13, display: 'flex', alignItems: 'center' }}>
                  <strong style={{ color: '#c9d1d9', marginRight: 4 }}>ahmeddev</strong> commented 12 minutes ago
                </div>
                <div style={{ padding: 16, fontSize: 14, lineHeight: 1.5, color: '#c9d1d9' }}>
                  Introduces retry handling for transient payment gateway errors in the refund flow. The retry policy is guarded by a configurable maximum retry count and exponential backoff.
                </div>
              </div>
            </div>

            {/* Checks Timeline - Commits */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, position: 'relative', zIndex: 1 }}>
              <div style={{ marginLeft: 26, display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 32, height: 32, backgroundColor: '#161b22', border: '1px solid #21262d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translateX(-22px)' }}>
                  <GitCommit size={16} color="#8b949e" />
                </div>
              </div>
              <div style={{ paddingTop: 6, fontSize: 13, color: '#8b949e', flex: 1, transform: 'translateX(-22px)' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#f5a623', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontWeight: 'bold', fontSize: 9, verticalAlign: 'middle', marginRight: 8 }}>MC</div>
                <strong style={{ color: '#c9d1d9' }}>ahmeddev</strong> added a commit: 
                <code style={{ marginLeft: 8, color: '#58a6ff', fontFamily: 'monospace' }}>a92f31e</code> Add guarded retry to refund processing
              </div>
            </div>

            {/* Status Checks Block */}
            <div style={{ border: '1px solid #30363d', borderRadius: 6, marginLeft: 56, position: 'relative', zIndex: 1, backgroundColor: '#0d1117' }}>
              <div style={{ padding: 16, backgroundColor: '#161b22', borderBottom: '1px solid #30363d', borderTopLeftRadius: 6, borderTopRightRadius: 6, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                {isCIRunning ? (
                  <>
                    <Loader size={20} color="#d2a8ff" className="spin" style={{ marginTop: 2 }} />
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: 15, color: '#c9d1d9' }}>Some checks haven't completed yet</strong>
                      <div style={{ fontSize: 13, color: '#8b949e', marginTop: 4 }}>1 pending check</div>
                    </div>
                  </>
                ) : phase === 'NO_AURACLE' ? (
                  <>
                    {isLegacyCIRunning ? <Loader size={20} color="#d2a8ff" className="spin" style={{ marginTop: 2 }} /> : <CheckCircle size={20} color="#238636" style={{ marginTop: 2 }} />}
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: 15, color: '#c9d1d9' }}>{isLegacyCIRunning ? 'Some checks haven\'t completed yet' : 'All checks have passed'}</strong>
                      <div style={{ fontSize: 13, color: '#8b949e', marginTop: 4 }}>{isLegacyCIRunning ? '1 pending and 2 successful checks' : '3 successful checks'}</div>
                    </div>
                  </>
                ) : phase === 'ANALYSIS_REVIEW' || phase === 'CANDIDATE_GENERATED' || phase === 'CANDIDATE_ACCEPTED' ? (
                  <>
                    <XCircle size={20} color="#f85149" style={{ marginTop: 2 }} />
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: 15, color: '#c9d1d9' }}>Some checks were not successful</strong>
                      <div style={{ fontSize: 13, color: '#8b949e', marginTop: 4 }}>1 failing and 2 successful checks</div>
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} color="#238636" style={{ marginTop: 2 }} />
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: 15, color: '#c9d1d9' }}>All checks have passed</strong>
                      <div style={{ fontSize: 13, color: '#8b949e', marginTop: 4 }}>3 successful checks</div>
                    </div>
                  </>
                )}
              </div>
              
              <div style={{ borderBottom: '1px solid #30363d' }}>
                <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, borderBottom: '1px solid #30363d' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Check size={16} color="#238636" />
                    <strong style={{ color: '#c9d1d9' }}>build / Node (pull_request)</strong>
                    <span style={{ color: '#8b949e' }}>Successful in 45s</span>
                  </div>
                </div>
                <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, borderBottom: '1px solid #30363d' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Check size={16} color="#238636" />
                    <strong style={{ color: '#c9d1d9' }}>lint / ESLint (pull_request)</strong>
                    <span style={{ color: '#8b949e' }}>Successful in 12s</span>
                  </div>
                </div>
                
                {phase !== 'NO_AURACLE' && (
                <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, borderBottom: '1px solid #30363d' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {isCIRunning ? (
                        <Loader size={16} color="#d2a8ff" className="spin" />
                    ) : phase === 'ANALYSIS_REVIEW' || phase === 'CANDIDATE_GENERATED' || phase === 'CANDIDATE_ACCEPTED' ? <X size={16} color="#f85149" /> : <Check size={16} color="#238636" />}
                    <strong style={{ color: '#c9d1d9' }}>Auracle Regression Analysis</strong>
                    {isCIRunning ? (
                      <span style={{ color: '#8b949e' }}>Running analysis...</span>
                    ) : phase === 'ANALYSIS_REVIEW' || phase === 'CANDIDATE_GENERATED' || phase === 'CANDIDATE_ACCEPTED' ? (
                      <span style={{ color: '#8b949e' }}>Failing after 4m 12s — GATE: FAIL / REVIEW REQUIRED</span>
                    ) : (
                      <span style={{ color: '#8b949e' }}>Successful in 1m 02s — SATISFIED WITHIN SUPPORTED SCOPE</span>
                    )}
                  </div>
                  {!isCIRunning && (
                  <button 
                    onClick={() => setAuraclePanelOpen(v => !v)}
                    style={{ backgroundColor: 'transparent', border: 'none', color: '#58a6ff', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}
                  >
                    {auraclePanelOpen ? 'Hide' : 'Details'}
                  </button>
                  )}
                </div>
                )}
              </div>

              {/* Inline Auracle Report Panel */}
              {auraclePanelOpen && phase !== 'NO_AURACLE' && (
              <div style={{ margin: '0 16px 16px', backgroundColor: '#010409', border: '1px solid #30363d', borderRadius: 8, overflow: 'hidden' }}>
                {/* Panel Header */}
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #30363d', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0d1117' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: (phase === 'ANALYSIS_REVIEW' || phase === 'CANDIDATE_GENERATED' || phase === 'CANDIDATE_ACCEPTED') ? '#f85149' : '#238636' }} />
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#c9d1d9', fontFamily: 'monospace' }}>Auracle Regression Analysis</span>
                    <span style={{ fontSize: 11, backgroundColor: (phase === 'ANALYSIS_REVIEW' || phase === 'CANDIDATE_GENERATED' || phase === 'CANDIDATE_ACCEPTED') ? 'rgba(248,81,73,0.15)' : 'rgba(35,134,54,0.15)', color: (phase === 'ANALYSIS_REVIEW' || phase === 'CANDIDATE_GENERATED' || phase === 'CANDIDATE_ACCEPTED') ? '#f85149' : '#3fb950', padding: '2px 8px', borderRadius: 12, fontWeight: 600 }}>GATE: {(phase === 'ANALYSIS_REVIEW' || phase === 'CANDIDATE_GENERATED' || phase === 'CANDIDATE_ACCEPTED') ? 'FAIL' : 'PASS'}</span>
                  </div>
                  <button onClick={() => navigate('/pull-requests/184/report')} style={{ backgroundColor: '#238636', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                    Open in Auracle Dashboard →
                  </button>
                </div>

                {/* Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid #21262d' }}>
                  {[
                    { label: 'Files Changed', value: '8' },
                    { label: 'Functions Affected', value: '17' },
                    { label: 'Tests Selected', value: '24' },
                    { label: 'Uncovered Branches', value: (phase === 'ANALYSIS_REVIEW' || phase === 'CANDIDATE_GENERATED' || phase === 'CANDIDATE_ACCEPTED') ? '1' : '0', alert: (phase === 'ANALYSIS_REVIEW' || phase === 'CANDIDATE_GENERATED' || phase === 'CANDIDATE_ACCEPTED') },
                  ].map((stat, i) => (
                    <div key={i} style={{ padding: '14px 16px', borderRight: i < 3 ? '1px solid #21262d' : 'none', textAlign: 'center' }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: stat.alert ? '#f85149' : '#c9d1d9' }}>{stat.value}</div>
                      <div style={{ fontSize: 11, color: '#8b949e', marginTop: 2 }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Changed files */}
                <div style={{ padding: 16, borderBottom: '1px solid #21262d' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#8b949e', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Changed Files</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 13 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #21262d', color: '#c9d1d9' }}>
                      <span>src/payments/service.py</span>
                      <span style={{ color: '#3fb950' }}>+2 <span style={{ color: '#f85149' }}>-0</span></span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', color: '#c9d1d9' }}>
                      <span>src/payments/models.py</span>
                      <span style={{ color: '#3fb950' }}>+1 <span style={{ color: '#f85149' }}>-0</span></span>
                    </div>
                  </div>
                </div>

                {/* Gate Failure Reason */}
                {(phase === 'ANALYSIS_REVIEW' || phase === 'CANDIDATE_GENERATED' || phase === 'CANDIDATE_ACCEPTED') && (
                <div style={{ padding: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#8b949e', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gate Failure Reason</div>
                  <div style={{ backgroundColor: 'rgba(248,81,73,0.08)', border: '1px solid rgba(248,81,73,0.3)', borderRadius: 6, padding: 12, fontFamily: 'monospace', fontSize: 13 }}>
                    <div style={{ color: '#f85149', fontWeight: 600, marginBottom: 6 }}>⚠ Test Failure</div>
                    <div style={{ color: '#c9d1d9', marginBottom: 12 }}>test_refund_failure FAILED — a directly relevant selected test failed</div>
                    <div style={{ color: '#f85149', fontWeight: 600, marginBottom: 6 }}>⚠ Material Testing Gap</div>
                    <div style={{ color: '#c9d1d9' }}>service.py:159-167 — <code style={{ color: '#f85149' }}>retry exhaustion branch uncovered</code></div>
                  </div>
                </div>
                )}
              </div>
              )}

              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, borderBottomLeftRadius: 6, borderBottomRightRadius: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {isLegacyCIRunning ? <Loader size={16} color="#d2a8ff" className="spin" /> : <Check size={16} color="#238636" />}
                  <strong style={{ color: '#c9d1d9' }}>CI / regression-suite (pull_request)</strong>
                  <span style={{ color: '#8b949e' }}>{legacyCIText}</span>
                </div>
                <button onClick={() => {}} style={{ backgroundColor: 'transparent', border: 'none', color: '#58a6ff', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
                  Details
                </button>
              </div>
            </div>

            {phase === 'NO_AURACLE' && (
            <div style={{ marginTop: 24, marginLeft: 56, padding: 20, border: '1px solid #30363d', borderRadius: 6, backgroundColor: '#161b22', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#21262d', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={20} color="#58a6ff" />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, color: '#c9d1d9', margin: '0 0 4px 0' }}>Get deeper change-aware regression analysis with Auracle</h3>
                  <p style={{ fontSize: 13, color: '#8b949e', margin: 0 }}>Green CI doesn't mean your change is safe. Ensure you haven't missed any material testing gaps.</p>
                </div>
              </div>
              <button onClick={() => navigate('/ide?step=install')} style={{ backgroundColor: '#238636', color: '#ffffff', border: '1px solid rgba(240,246,252,0.1)', padding: '6px 12px', borderRadius: 6, fontWeight: 500, cursor: 'pointer', fontSize: 14 }}>
                Install in IDE
              </button>
            </div>
            )}

            {/* Merge Button */}
            <div style={{ marginTop: 24, marginLeft: 56, padding: 16, border: '1px solid #30363d', borderRadius: 6, backgroundColor: '#0d1117', display: 'flex', alignItems: 'flex-start', gap: 16, position: 'relative', zIndex: 1 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: (phase !== 'EXECUTED' && phase !== 'MERGED' && phase !== 'NO_AURACLE') ? '#da3633' : '#238636', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {(phase !== 'EXECUTED' && phase !== 'MERGED' && phase !== 'NO_AURACLE') ? <X size={18} color="#ffffff" /> : <GitPullRequest size={16} color="#ffffff" />}
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: 14, color: '#c9d1d9' }}>Merge pull request</strong>
                {(phase !== 'EXECUTED' && phase !== 'MERGED' && phase !== 'NO_AURACLE') ? (
                  <div style={{ fontSize: 13, color: '#8b949e' }}>Merge is blocked because checks have failed.</div>
                ) : (
                  <div style={{ fontSize: 13, color: '#8b949e' }}>You can merge this pull request automatically.</div>
                )}
              </div>
              {(phase !== 'EXECUTED' && phase !== 'MERGED' && phase !== 'NO_AURACLE') ? (
                <button disabled style={{ backgroundColor: '#238636', color: '#ffffff', border: '1px solid rgba(240,246,252,0.1)', borderRadius: 6, padding: '5px 16px', fontSize: 14, fontWeight: 500, opacity: 0.6, cursor: 'not-allowed' }}>
                  Merge pull request
                </button>
              ) : (
                <button 
                  style={{ backgroundColor: '#238636', color: '#ffffff', border: '1px solid rgba(240,246,252,0.1)', borderRadius: 6, padding: '5px 16px', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
                  onClick={() => {
                    alert('PR Merged Successfully! User Journey Complete.');
                    navigate('/');
                  }}
                >
                  Merge pull request
                </button>
              )}
            </div>

          </div>
          
          <div style={{ width: 256, fontSize: 12, color: '#8b949e' }}>
            <div style={{ borderBottom: '1px solid #21262d', paddingBottom: 16, marginBottom: 16 }}>
              <strong style={{ color: '#c9d1d9', display: 'block', marginBottom: 8 }}>Reviewers</strong>
              No reviews
            </div>
            <div style={{ borderBottom: '1px solid #21262d', paddingBottom: 16, marginBottom: 16 }}>
              <strong style={{ color: '#c9d1d9', display: 'block', marginBottom: 8 }}>Assignees</strong>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#f5a623', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontWeight: 'bold', fontSize: 9 }}>
                  MC
                </div>
                <span style={{ color: '#c9d1d9', fontWeight: 600 }}>ahmeddev</span>
              </div>
            </div>
          </div>
        </div>
        )}

        {activePRTab === 'Commits' && (
          <div style={{ padding: 32, border: '1px solid #30363d', borderRadius: 6, backgroundColor: '#0d1117' }}>
            <h3 style={{ marginBottom: 16 }}>Commits</h3>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #30363d' }}>
              <GitCommit size={16} color="#8b949e" />
              <strong style={{ color: '#c9d1d9' }}>ahmeddev</strong> Add guarded retry to refund processing
              <code style={{ marginLeft: 'auto', color: '#58a6ff' }}>a92f31e</code>
            </div>
          </div>
        )}

        {activePRTab === 'Checks' && (
          <div style={{ padding: 48, border: '1px solid #30363d', borderRadius: 6, backgroundColor: '#0d1117', textAlign: 'center', color: '#8b949e' }}>
            <CheckCircle size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
            <h2>Checks</h2>
            <p>Select the Conversation tab to see the summarized check status.</p>
          </div>
        )}

        {activePRTab === 'Files changed' && (
          <div style={{ padding: 48, border: '1px solid #30363d', borderRadius: 6, backgroundColor: '#0d1117', textAlign: 'center', color: '#8b949e' }}>
            <GitPullRequest size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
            <h2>8 files changed</h2>
            <p>Diff view placeholder</p>
          </div>
        )}
        </>
        )}

        {activeRepoTab === 'Code' && (
          <div style={{ border: '1px solid #30363d', borderRadius: 6, backgroundColor: '#0d1117', overflow: 'hidden' }}>
            <div style={{ padding: 16, backgroundColor: '#161b22', borderBottom: '1px solid #30363d', display: 'flex', alignItems: 'center', gap: 16, color: '#8b949e', fontSize: 13 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#f5a623', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontWeight: 'bold', fontSize: 9 }}>AD</div>
              <strong style={{ color: '#c9d1d9' }}>ahmeddev</strong> Add guarded retry to refund processing
              <span style={{ marginLeft: 'auto' }}>12 minutes ago</span>
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid #21262d', color: '#c9d1d9', fontSize: 14 }}>
              <Folder size={16} color="#8b949e" /> <span style={{ cursor: 'pointer' }}>src</span>
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid #21262d', color: '#c9d1d9', fontSize: 14 }}>
              <Folder size={16} color="#8b949e" /> <span style={{ cursor: 'pointer' }}>tests</span>
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid #21262d', color: '#c9d1d9', fontSize: 14 }}>
              <File size={16} color="#8b949e" /> <span style={{ cursor: 'pointer' }}>README.md</span>
            </div>
          </div>
        )}

        {activeRepoTab === 'Actions' && (
          <div style={{ padding: 48, border: '1px solid #30363d', borderRadius: 6, backgroundColor: '#0d1117', textAlign: 'center', color: '#8b949e' }}>
            <h2>GitHub Actions</h2>
            <p>Workflows placeholder</p>
          </div>
        )}

      </div>
      
      {/* Simulation Playback Controls Overlay */}
      <div style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(22,27,34,0.9)', backdropFilter: 'blur(10px)', border: '1px solid #30363d', borderRadius: 32, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.5)', zIndex: 100 }}>
        {overlayText ? (
          <span style={{ color: '#c9d1d9', fontSize: 14, fontWeight: 500 }}>{overlayText}</span>
        ) : (
          <span style={{ color: '#8b949e', fontSize: 14 }}>{phase === 'MERGED' ? 'Simulation Complete' : 'Auracle Demo Sandbox'}</span>
        )}
        
        {phase === 'CHANGE_CREATED' || phase === 'ANALYSIS_REVIEW' || phase === 'NO_AURACLE' ? (
        <button 
          onClick={isAutoPlaying ? togglePause : playJourney}
          disabled={!overlayText && isAutoPlaying}
          style={{ backgroundColor: '#238636', color: '#ffffff', border: 'none', borderRadius: 20, padding: '6px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: (!overlayText && isAutoPlaying) ? 0.5 : 1 }}
        >
          {isAutoPlaying ? (isPaused ? <><Play size={14} /> Resume</> : <><Pause size={14} /> Pause</>) : <><Play size={14} /> Play Demo Journey</>}
        </button>
        ) : null}
      </div>
    </div>
  )
}
