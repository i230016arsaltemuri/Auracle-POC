import { useNavigate, useSearchParams } from 'react-router-dom'
import { GitPullRequest, X, GitCommit, XCircle, CheckCircle, Check, Folder, File, Play, Pause } from 'lucide-react'
import { useState, useRef } from 'react'

export default function GitHubPR() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const step = searchParams.get('step') || '0'
  const [activeRepoTab, setActiveRepoTab] = useState('Pull requests')
  const [activePRTab, setActivePRTab] = useState('Conversation')
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const isPausedRef = useRef(false)
  const [overlayText, setOverlayText] = useState('')
  const [activeDetails, setActiveDetails] = useState<string | null>(null)
  const [auraclePanelOpen, setAuraclePanelOpen] = useState(false)

  const togglePause = (e: React.MouseEvent) => {
    e.stopPropagation()
    const nextPaused = !isPausedRef.current
    setIsPaused(nextPaused)
    isPausedRef.current = nextPaused
  }

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
    
    if (step === '0') {
      setOverlayText('Ahmed: "The CI is green. Looks good, right?"')
      await sleep(2500)
      setOverlayText('Ahmed: "But... which tests actually covered my new code?"')
      await sleep(2500)
      setOverlayText('Ahmed: "I need a better tool. Let me try Auracle."')
      await sleep(2000)
      setOverlayText('')
      setIsAutoPlaying(false)
      navigate('/install-auracle')
    } else if (step === '1') {
      setOverlayText('Ahmed goes back to the IDE to fix the missing test coverage...')
      await sleep(2500)
      setOverlayText('')
      setIsAutoPlaying(false)
      navigate('/?step=2')
    }
  }

  return (
    <div style={{ backgroundColor: '#0d1117', minHeight: '100%', color: '#c9d1d9', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"', display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
      {/* Fake GitHub Repo Header */}
      <div style={{ padding: '16px 32px 0 32px', backgroundColor: '#0d1117', borderBottom: '1px solid #21262d', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#f5a623', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontWeight: 'bold' }}>
            AH
          </div>
          <div style={{ fontWeight: 600, fontSize: 16, color: '#58a6ff' }}>acme / payments-api</div>
        </div>
        <div style={{ display: 'flex', gap: 24, fontSize: 14, fontWeight: 500, paddingLeft: 8 }}>
          <span onClick={() => setActiveRepoTab('Code')} style={{ color: '#c9d1d9', display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 12, cursor: 'pointer', borderBottom: activeRepoTab === 'Code' ? '2px solid #f78166' : '2px solid transparent' }}><span style={{ color: '#8b949e' }}>{"<>"}</span> Code</span>
          <span onClick={() => setActiveRepoTab('Issues')} style={{ color: '#c9d1d9', display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 12, cursor: 'pointer', borderBottom: activeRepoTab === 'Issues' ? '2px solid #f78166' : '2px solid transparent' }}><span style={{ color: '#8b949e' }}>⊙</span> Issues</span>
          <span onClick={() => setActiveRepoTab('Pull requests')} style={{ color: '#c9d1d9', display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 12, cursor: 'pointer', borderBottom: activeRepoTab === 'Pull requests' ? '2px solid #f78166' : '2px solid transparent' }}><GitPullRequest size={16} color="#8b949e" /> Pull requests</span>
          <span onClick={() => setActiveRepoTab('Actions')} style={{ color: '#c9d1d9', display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 12, cursor: 'pointer', borderBottom: activeRepoTab === 'Actions' ? '2px solid #f78166' : '2px solid transparent' }}><span style={{ color: '#8b949e' }}>▶</span> Actions</span>
        </div>
      </div>

      <div style={{ maxWidth: 1012, margin: '24px auto', width: '100%' }}>
        {activeRepoTab === 'Pull requests' && (
          <>
            {/* PR Title Area */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 32, fontWeight: 400, marginBottom: 8 }}>
            Add Partial Refund Support <span style={{ color: '#8b949e', fontWeight: 300 }}>#184</span>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
            <span style={{ backgroundColor: '#238636', color: '#ffffff', padding: '5px 12px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, fontSize: 14 }}>
              <GitPullRequest size={16} />
              Open
            </span>
            <span style={{ color: '#8b949e', marginLeft: 4 }}>
              <strong style={{ color: '#c9d1d9' }}>ahmed</strong> wants to merge 1 commit into <code style={{ backgroundColor: '#161b22', padding: '3px 6px', borderRadius: 6, color: '#c9d1d9', fontSize: 13 }}>main</code> from <code style={{ backgroundColor: '#161b22', padding: '3px 6px', borderRadius: 6, color: '#c9d1d9', fontSize: 13 }}>feature/partial-refund</code>
            </span>
          </div>
        </div>

        {/* PR Tabs */}
        <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid #21262d', paddingBottom: 0, marginBottom: 24, fontSize: 14 }}>
          <span onClick={() => setActivePRTab('Conversation')} style={{ fontWeight: activePRTab === 'Conversation' ? 600 : 400, color: '#c9d1d9', borderBottom: activePRTab === 'Conversation' ? '2px solid #f78166' : '2px solid transparent', paddingBottom: 12, cursor: 'pointer' }}>Conversation</span>
          <span onClick={() => setActivePRTab('Commits')} style={{ fontWeight: activePRTab === 'Commits' ? 600 : 400, color: '#c9d1d9', borderBottom: activePRTab === 'Commits' ? '2px solid #f78166' : '2px solid transparent', paddingBottom: 12, cursor: 'pointer' }}>Commits <span style={{ backgroundColor: '#161b22', padding: '2px 8px', borderRadius: 12, fontSize: 12, marginLeft: 4 }}>{step === '1' ? '1' : '2'}</span></span>
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
                AH
              </div>
              <div style={{ flex: 1, border: '1px solid #30363d', borderRadius: 6, position: 'relative', backgroundColor: '#0d1117' }}>
                <div style={{ position: 'absolute', left: -7, top: 11, width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderRight: '7px solid #30363d' }} />
                <div style={{ position: 'absolute', left: -6, top: 12, width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderRight: '6px solid #161b22' }} />
                
                <div style={{ backgroundColor: '#161b22', padding: '8px 16px', borderBottom: '1px solid #30363d', borderTopLeftRadius: 6, borderTopRightRadius: 6, color: '#8b949e', fontSize: 13, display: 'flex', alignItems: 'center' }}>
                  <strong style={{ color: '#c9d1d9', marginRight: 4 }}>ahmed</strong> commented 12 minutes ago
                </div>
                <div style={{ padding: 16, fontSize: 14, lineHeight: 1.5, color: '#c9d1d9' }}>
                  Introduces partial refund support for cases where refund amount is less than the original payment.
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
                <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#f5a623', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontWeight: 'bold', fontSize: 9, verticalAlign: 'middle', marginRight: 8 }}>AH</div>
                <strong style={{ color: '#c9d1d9' }}>ahmed</strong> added a commit: 
                <code style={{ marginLeft: 8, color: '#58a6ff', fontFamily: 'monospace' }}>a92f31e</code> Support guarded retries
              </div>
            </div>

            {step === '2' && (
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, position: 'relative', zIndex: 1 }}>
              <div style={{ marginLeft: 26, display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 32, height: 32, backgroundColor: '#161b22', border: '1px solid #21262d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translateX(-22px)' }}>
                  <GitCommit size={16} color="#8b949e" />
                </div>
              </div>
              <div style={{ paddingTop: 6, fontSize: 13, color: '#8b949e', flex: 1, transform: 'translateX(-22px)' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#f5a623', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontWeight: 'bold', fontSize: 9, verticalAlign: 'middle', marginRight: 8 }}>AH</div>
                <strong style={{ color: '#c9d1d9' }}>ahmed</strong> added a commit: 
                <code style={{ marginLeft: 8, color: '#58a6ff', fontFamily: 'monospace' }}>b14f77c</code> Add test for retry exhaustion
              </div>
            </div>
            )}

              {/* Status Checks Block */}
            <div style={{ border: '1px solid #30363d', borderRadius: 6, marginLeft: 56, position: 'relative', zIndex: 1, backgroundColor: '#0d1117' }}>
              <div style={{ padding: 16, backgroundColor: '#161b22', borderBottom: '1px solid #30363d', borderTopLeftRadius: 6, borderTopRightRadius: 6, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                {step === '1' ? (
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
                      <div style={{ fontSize: 13, color: '#8b949e', marginTop: 4 }}>{step === '0' ? '2 successful checks' : '3 successful checks'}</div>
                    </div>
                  </>
                )}
              </div>
              
              {step !== '0' && (
              <div style={{ borderBottom: '1px solid #30363d' }}>
                <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {step === '1' ? <X size={16} color="#f85149" /> : <Check size={16} color="#238636" />}
                    <strong style={{ color: '#c9d1d9' }}>auracle / test-intelligence (pull_request)</strong>
                    {step === '1' ? (
                      <span style={{ color: '#8b949e' }}>Failing after 4m 12s — GATE: FAIL / REVIEW REQUIRED</span>
                    ) : (
                      <span style={{ color: '#8b949e' }}>Successful in 1m 02s — SATISFIED WITHIN SUPPORTED SCOPE</span>
                    )}
                  </div>
                  <button 
                    onClick={() => setAuraclePanelOpen(v => !v)}
                    style={{ backgroundColor: 'transparent', border: 'none', color: '#58a6ff', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}
                  >
                    {auraclePanelOpen ? 'Hide' : 'Details'}
                  </button>
                </div>

                {/* Inline Auracle Report Panel */}
                {auraclePanelOpen && (
                <div style={{ margin: '0 16px 16px', backgroundColor: '#010409', border: '1px solid #30363d', borderRadius: 8, overflow: 'hidden' }}>
                  {/* Panel Header */}
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #30363d', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0d1117' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: step === '1' ? '#f85149' : '#238636' }} />
                      <span style={{ fontWeight: 700, fontSize: 14, color: '#c9d1d9', fontFamily: 'monospace' }}>Auracle Gate Report</span>
                      <span style={{ fontSize: 11, backgroundColor: step === '1' ? 'rgba(248,81,73,0.15)' : 'rgba(35,134,54,0.15)', color: step === '1' ? '#f85149' : '#3fb950', padding: '2px 8px', borderRadius: 12, fontWeight: 600 }}>GATE: {step === '1' ? 'FAIL' : 'PASS'}</span>
                    </div>
                    <button onClick={() => navigate('/pull-requests/184/report')} style={{ backgroundColor: '#238636', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                      Open in Auracle Dashboard →
                    </button>
                  </div>

                  {/* Stats Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid #21262d' }}>
                    {[
                      { label: 'Files Changed', value: '2' },
                      { label: 'Functions Affected', value: '7' },
                      { label: 'Tests Selected', value: '23' },
                      { label: 'Uncovered Branches', value: step === '1' ? '1' : '0', alert: step === '1' },
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
                  {step === '1' && (
                  <div style={{ padding: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#8b949e', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gate Failure Reason</div>
                    <div style={{ backgroundColor: 'rgba(248,81,73,0.08)', border: '1px solid rgba(248,81,73,0.3)', borderRadius: 6, padding: 12, fontFamily: 'monospace', fontSize: 13 }}>
                      <div style={{ color: '#f85149', fontWeight: 600, marginBottom: 6 }}>⚠ Uncovered Branch Detected</div>
                      <div style={{ color: '#c9d1d9' }}>service.py:129 — <code style={{ color: '#f85149' }}>if refund_amount &lt; original_payment.amount:</code></div>
                      <div style={{ color: '#8b949e', marginTop: 4, fontSize: 12 }}>This branch was introduced by this PR but no test exercises it.</div>
                      <div style={{ color: '#8b949e', marginTop: 8, fontSize: 12 }}>Add a test that calls <code>service.refund()</code> with <code>refund_amount &lt; original_payment.amount</code></div>
                    </div>
                  </div>
                  )}
                </div>
                )}
              </div>
              )}
              
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #30363d', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Check size={16} color="#238636" />
                  <strong style={{ color: '#c9d1d9' }}>codecov / patch</strong>
                  <span style={{ color: '#8b949e' }}>Successful in 45s — Coverage: 87%</span>
                </div>
                <button onClick={() => setActiveDetails('codecov')} style={{ backgroundColor: 'transparent', border: 'none', color: '#58a6ff', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
                  Details
                </button>
              </div>

              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, borderBottomLeftRadius: 6, borderBottomRightRadius: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Check size={16} color="#238636" />
                  <strong style={{ color: '#c9d1d9' }}>pytest / unit-tests (pull_request)</strong>
                  <span style={{ color: '#8b949e' }}>Successful in 32m 41s — {step === '2' ? '2,148' : '2,147'} tests passed</span>
                </div>
                <button onClick={() => setActiveDetails('pytest')} style={{ backgroundColor: 'transparent', border: 'none', color: '#58a6ff', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
                  Details
                </button>
              </div>
            </div>

            {/* Merge Button */}
            <div style={{ marginTop: 24, marginLeft: 56, padding: 16, border: '1px solid #30363d', borderRadius: 6, backgroundColor: '#0d1117', display: 'flex', alignItems: 'flex-start', gap: 16, position: 'relative', zIndex: 1 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: step === '1' ? '#da3633' : '#238636', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {step === '1' ? <X size={18} color="#ffffff" /> : <GitPullRequest size={16} color="#ffffff" />}
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: 14, color: '#c9d1d9' }}>Merge pull request</strong>
                {step === '1' ? (
                  <div style={{ fontSize: 13, color: '#8b949e' }}>Merge is blocked because checks have failed.</div>
                ) : (
                  <div style={{ fontSize: 13, color: '#8b949e' }}>You can merge this pull request automatically.</div>
                )}
              </div>
              {step === '1' ? (
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
                  AH
                </div>
                <span style={{ color: '#c9d1d9', fontWeight: 600 }}>ahmed</span>
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
              <strong style={{ color: '#c9d1d9' }}>ahmed</strong> Support guarded retries
              <code style={{ marginLeft: 'auto', color: '#58a6ff' }}>a92f31e</code>
            </div>
            {step === '2' && (
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '12px 0' }}>
              <GitCommit size={16} color="#8b949e" />
              <strong style={{ color: '#c9d1d9' }}>ahmed</strong> Add test for retry exhaustion
              <code style={{ marginLeft: 'auto', color: '#58a6ff' }}>b14f77c</code>
            </div>
            )}
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
              <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#f5a623', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontWeight: 'bold', fontSize: 9 }}>AH</div>
              <strong style={{ color: '#c9d1d9' }}>ahmed</strong> Add Partial Refund Support
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
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 16, color: '#c9d1d9', fontSize: 14 }}>
              <File size={16} color="#8b949e" /> <span style={{ cursor: 'pointer' }}>package.json</span>
            </div>
          </div>
        )}

        {activeRepoTab === 'Issues' && (
          <div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <input type="text" placeholder="is:issue is:open " style={{ flex: 1, padding: '5px 12px', backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: 6, color: '#c9d1d9', fontSize: 14 }} disabled />
              <button style={{ backgroundColor: '#238636', color: '#ffffff', border: '1px solid rgba(240,246,252,0.1)', borderRadius: 6, padding: '5px 16px', fontSize: 14, fontWeight: 500 }}>New issue</button>
            </div>
            <div style={{ border: '1px solid #30363d', borderRadius: 6, backgroundColor: '#0d1117' }}>
              <div style={{ padding: 16, backgroundColor: '#161b22', borderBottom: '1px solid #30363d', borderTopLeftRadius: 6, borderTopRightRadius: 6, fontWeight: 600, fontSize: 14 }}>
                <span style={{ color: '#c9d1d9', marginRight: 16 }}>⊙ 12 Open</span> <span style={{ color: '#8b949e', fontWeight: 400 }}>✓ 45 Closed</span>
              </div>
              <div style={{ padding: 16, display: 'flex', gap: 12, borderBottom: '1px solid #21262d' }}>
                <span style={{ color: '#238636' }}>⊙</span>
                <div>
                  <div style={{ color: '#c9d1d9', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Fix intermittent gateway timeouts</div>
                  <div style={{ color: '#8b949e', fontSize: 12 }}>#183 opened 2 days ago by ahmed</div>
                </div>
              </div>
              <div style={{ padding: 16, display: 'flex', gap: 12 }}>
                <span style={{ color: '#238636' }}>⊙</span>
                <div>
                  <div style={{ color: '#c9d1d9', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Update pytest dependencies</div>
                  <div style={{ color: '#8b949e', fontSize: 12 }}>#182 opened 5 days ago by dependabot</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeRepoTab === 'Actions' && (
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ width: 250 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16, color: '#c9d1d9' }}>Workflows</div>
              <div style={{ padding: '8px 16px', backgroundColor: '#161b22', borderRadius: 6, color: '#c9d1d9', fontSize: 14, cursor: 'pointer', marginBottom: 4 }}>All workflows</div>
              <div style={{ padding: '8px 16px', color: '#8b949e', fontSize: 14, cursor: 'pointer' }}>auracle-test-intelligence</div>
              <div style={{ padding: '8px 16px', color: '#8b949e', fontSize: 14, cursor: 'pointer' }}>pytest-unit-tests</div>
            </div>
            <div style={{ flex: 1, border: '1px solid #30363d', borderRadius: 6, backgroundColor: '#0d1117' }}>
              <div style={{ padding: 16, backgroundColor: '#161b22', borderBottom: '1px solid #30363d', borderTopLeftRadius: 6, borderTopRightRadius: 6, fontWeight: 600, fontSize: 14 }}>
                2 workflow runs
              </div>
              <div style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid #21262d' }}>
                {step === '1' ? <XCircle size={20} color="#f85149" /> : <CheckCircle size={20} color="#238636" />}
                <div>
                  <div style={{ color: '#c9d1d9', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Add Partial Refund Support</div>
                  <div style={{ color: '#8b949e', fontSize: 12 }}>auracle-test-intelligence #184: Commit <code style={{ color: '#58a6ff' }}>a92f31e</code> pushed by ahmed</div>
                </div>
              </div>
              <div style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                <CheckCircle size={20} color="#238636" />
                <div>
                  <div style={{ color: '#c9d1d9', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Add Partial Refund Support</div>
                  <div style={{ color: '#8b949e', fontSize: 12 }}>pytest-unit-tests #184: Commit <code style={{ color: '#58a6ff' }}>a92f31e</code> pushed by ahmed</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Details Modals */}
      {activeDetails === 'codecov' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setActiveDetails(null)}>
          <div style={{ backgroundColor: '#161b22', padding: 32, borderRadius: 12, border: '1px solid #30363d', width: 560, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle size={20} color="#238636" />
                <strong style={{ color: '#c9d1d9', fontSize: 16 }}>codecov / patch</strong>
              </div>
              <button onClick={() => setActiveDetails(null)} style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: 20 }}>×</button>
            </div>
            <div style={{ backgroundColor: '#0d1117', borderRadius: 8, padding: 20, fontFamily: 'monospace', fontSize: 13, color: '#c9d1d9', lineHeight: 1.8 }}>
              <div style={{ color: '#3fb950' }}>✓ Patch coverage: 87.00%</div>
              <div style={{ color: '#8b949e', marginTop: 8 }}>Files changed in this PR:</div>
              <div style={{ marginTop: 8 }}>  src/payments/service.py</div>
              <div style={{ color: '#8b949e' }}>    Lines covered: 6/7 (85.7%)</div>
              <div style={{ color: '#f85149', marginTop: 8 }}>  ! Line 129: if refund_amount &lt; original_payment.amount:</div>
              <div style={{ color: '#f85149' }}>    ↑ This branch was NOT executed in any test</div>
            </div>
            <div style={{ marginTop: 16, color: '#8b949e', fontSize: 13 }}>Coverage meets threshold (≥ 80%). Gate: PASS</div>
          </div>
        </div>
      )}

      {activeDetails === 'pytest' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setActiveDetails(null)}>
          <div style={{ backgroundColor: '#161b22', padding: 32, borderRadius: 12, border: '1px solid #30363d', width: 600, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle size={20} color="#238636" />
                <strong style={{ color: '#c9d1d9', fontSize: 16 }}>pytest / unit-tests (pull_request)</strong>
              </div>
              <button onClick={() => setActiveDetails(null)} style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: 20 }}>×</button>
            </div>
            <div style={{ backgroundColor: '#0d1117', borderRadius: 8, padding: 20, fontFamily: 'monospace', fontSize: 13, color: '#c9d1d9', lineHeight: 1.8 }}>
              <div>============================= test session starts ==============================</div>
              <div>platform linux -- Python 3.11.4, pytest-7.4.0</div>
              <div style={{ marginTop: 8 }}>collected {step === '2' ? '3,451' : '3,450'} items</div>
              <div style={{ marginTop: 8 }}>tests/unit/payments/test_auth.py ........                           [  0%]</div>
              <div>tests/unit/payments/test_billing.py ...............                     [  1%]</div>
              <div>tests/unit/payments/test_cache.py .....                                 [  1%]</div>
              <div>tests/unit/payments/test_service.py .....                               [  2%]</div>
              <div style={{ color: '#8b949e' }}>... (running all {step === '2' ? '3,451' : '3,450'} tests) ...</div>
              <div style={{ marginTop: 8, color: '#3fb950' }}>{step === '2' ? '3,451' : '3,450'} passed in 32m 41s</div>
            </div>
            <div style={{ marginTop: 16, color: '#8b949e', fontSize: 13 }}>All tests passed. But were the right tests run? Auracle can tell you.</div>
          </div>
        </div>
      )}
      {overlayText && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: '#161b22',
            padding: '24px 48px',
            borderRadius: 12,
            border: '1px solid #30363d',
            color: '#c9d1d9',
            fontSize: 20,
            fontWeight: 600,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
          }}>
            {overlayText}
          </div>
        </div>
      )}

      {/* Floating Demo Blob */}
      {(step === '0' || step === '1') && (
      <div 
        onClick={isAutoPlaying ? togglePause : playJourney}
        style={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          width: 50,
          height: 50,
          borderRadius: '50%',
          backgroundColor: isPaused ? '#f5a623' : '#60a5fa',
          boxShadow: '0 4px 15px rgba(96, 165, 250, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 9999,
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          opacity: 1,
          transform: 'scale(1)'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.backgroundColor = isPaused ? '#d97706' : '#3b82f6'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = isPaused ? '#f5a623' : '#60a5fa'; }}
        title={isAutoPlaying ? (isPaused ? "Resume Journey" : "Pause Journey") : "Continue Journey"}
      >
        {isAutoPlaying && !isPaused ? (
          <Pause fill="white" color="white" size={20} />
        ) : (
          <Play fill="white" color="white" size={20} style={{ marginLeft: 2 }} />
        )}
      </div>
      )}
    </div>
  )
}
