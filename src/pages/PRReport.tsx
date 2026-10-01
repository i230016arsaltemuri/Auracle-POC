import { useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'
import {
  XCircle, CheckCircle, AlertTriangle, FileCode, Network, ShieldCheck, ChevronRight, Play, Pause, Server, Check, Bot
} from 'lucide-react'
import { useDemo } from '../context/DemoScenarioContext'

export default function PRReport() {
  const { phase } = useDemo()
  const navigate = useNavigate()
  
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [overlayText, setOverlayText] = useState('')
  const [isPaused, setIsPaused] = useState(false)
  
  const isPausedRef = useRef(false)
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
    
    if (phase === 'ANALYSIS_REVIEW') {
      document.getElementById('test-needs')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setOverlayText('Ahmed: "So this is why it blocked the merge. A material test need."')
      await sleep(4000)
      setOverlayText('Ahmed: "Auracle detected my retry exhaustion branch was uncovered, and used the PR description to figure out it should raise an exception."')
      await sleep(5500)
      setOverlayText('Ahmed: "It even generated a candidate test for me. I\'ll review it in the IDE."')
      await sleep(4000)
      setOverlayText('')
      setIsAutoPlaying(false)
      navigate('/ide?step=2')
    } else {
      setOverlayText('Ahmed: "The regression plan looks fully resolved now!"')
      await sleep(3000)
      setOverlayText('')
      setIsAutoPlaying(false)
      navigate('/github/pr/184')
    }
  }

  const isResolved = phase === 'EXECUTED' || phase === 'MERGED'
  
  const steps = [
    'CHANGE',
    'IMPACT',
    'EXISTING TEST EVIDENCE',
    'TEST NEEDS',
    'REGRESSION PLAN',
    'EXECUTION',
    'FINAL EVIDENCE'
  ]

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 64, color: '#c9d1d9', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#8b949e', marginBottom: 24 }}>
        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/pull-requests')}>Pull Requests</span>
        <span>/</span>
        <span>PR #184</span>
        <span>/</span>
        <span style={{ color: '#c9d1d9', fontWeight: 500 }}>Regression Plan</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#c9d1d9', margin: '0 0 12px 0' }}>
          PR #184 — Add guarded retry to refund processing
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: isResolved ? 'rgba(35,134,54,0.15)' : 'rgba(248,81,73,0.15)', color: isResolved ? '#3fb950' : '#f85149', padding: '4px 12px', borderRadius: 16, fontSize: 13, fontWeight: 600 }}>
            {isResolved ? <CheckCircle size={14} /> : <XCircle size={14} />}
            Status: {isResolved ? 'PASS WITHIN SUPPORTED SCOPE' : 'REVIEW REQUIRED'}
          </div>
          {!isResolved && (
            <div style={{ fontSize: 14, color: '#8b949e' }}>
              Reason: <strong style={{ color: '#c9d1d9' }}>TN-204</strong> remains unresolved
            </div>
          )}
        </div>
      </div>

      {/* Evidence Chain Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 48, overflowX: 'auto', paddingBottom: 8 }}>
        {steps.map((step, idx) => (
          <div key={step} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#21262d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#8b949e', border: '1px solid #30363d' }}>
                {idx + 1}
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#8b949e', letterSpacing: '0.05em' }}>{step}</span>
            </div>
            {idx < steps.length - 1 && <ChevronRight size={16} color="#30363d" style={{ margin: '0 12px' }} />}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>
        
        {/* Main Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          
          {/* Section 1: Change */}
          <section style={{ backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #30363d', backgroundColor: '#161b22', display: 'flex', alignItems: 'center', gap: 10 }}>
              <FileCode size={18} color="#8b949e" />
              <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: '#c9d1d9' }}>Change Summary</h2>
              <span style={{ marginLeft: 'auto', fontSize: 12, color: '#8b949e' }}>Source: Git diff + Python AST</span>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 4 }}>Changed file</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 13 }}>payment/service.py</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 4 }}>Changed symbol</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#58a6ff' }}>PaymentService.refund()</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 4 }}>Change type</div>
                  <div style={{ fontSize: 13 }}>Modified function / behavior change</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 4 }}>Scope</div>
                  <div style={{ fontSize: 13 }}>17 executable lines · <span style={{ color: '#d2a8ff' }}>New branch: Retry exhaustion</span></div>
                </div>
              </div>
              <div style={{ border: '1px solid #30363d', borderRadius: 6, backgroundColor: '#010409', padding: 16, fontFamily: 'monospace', fontSize: 12, color: '#8b949e', overflowX: 'auto' }}>
                <div style={{ color: '#3fb950' }}>+        except TransientGatewayError as e:</div>
                <div style={{ color: '#3fb950' }}>+            attempts += 1</div>
                <div style={{ color: '#3fb950' }}>+            if attempts &gt;= MAX_RETRIES:</div>
                <div style={{ color: '#3fb950', backgroundColor: 'rgba(63,185,80,0.1)' }}>+                raise RefundRetryExhausted(f"Refund failed after {'{'}attempts{'}'} attempts")</div>
                <div style={{ color: '#3fb950' }}>+            time.sleep(2 ** attempts)</div>
              </div>
            </div>
          </section>

          {/* Section 2: Impact */}
          <section style={{ backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #30363d', backgroundColor: '#161b22', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Network size={18} color="#8b949e" />
              <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: '#c9d1d9' }}>Impact Analysis</h2>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ backgroundColor: '#010409', border: '1px solid #30363d', borderRadius: 6, padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <div style={{ padding: '8px 16px', border: '1px solid #30363d', borderRadius: 20, backgroundColor: '#161b22', fontSize: 13, fontFamily: 'monospace' }}>refund API endpoint</div>
                <div style={{ width: 2, height: 20, backgroundColor: '#30363d' }} />
                <div style={{ padding: '8px 16px', border: '1px solid #58a6ff', borderRadius: 20, backgroundColor: 'rgba(88,166,255,0.1)', fontSize: 13, fontFamily: 'monospace', color: '#58a6ff', fontWeight: 600 }}>PaymentService.refund() [CHANGED]</div>
                <div style={{ display: 'flex', gap: 64, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: -16, left: '25%', width: '50%', height: 16, borderTop: '2px solid #30363d', borderLeft: '2px solid #30363d', borderRight: '2px solid #30363d', borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottom: 'none' }} />
                  <div style={{ padding: '8px 16px', border: '1px solid #30363d', borderRadius: 20, backgroundColor: '#161b22', fontSize: 13, fontFamily: 'monospace', marginTop: 16 }}>RefundValidator</div>
                  <div style={{ padding: '8px 16px', border: '1px solid #30363d', borderRadius: 20, backgroundColor: '#161b22', fontSize: 13, fontFamily: 'monospace', marginTop: 16 }}>PaymentRepository</div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Existing Test Evidence */}
          <section style={{ backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #30363d', backgroundColor: '#161b22', display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShieldCheck size={18} color="#8b949e" />
              <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: '#c9d1d9' }}>Existing Test Evidence</h2>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #30363d', backgroundColor: '#0d1117', color: '#8b949e' }}>
                  <th style={{ padding: '12px 20px', fontWeight: 500 }}>Test</th>
                  <th style={{ padding: '12px 20px', fontWeight: 500 }}>Relationship</th>
                  <th style={{ padding: '12px 20px', fontWeight: 500 }}>Selection Class</th>
                  <th style={{ padding: '12px 20px', fontWeight: 500 }}>Why</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #21262d' }}>
                  <td style={{ padding: '16px 20px', fontFamily: 'monospace', color: '#c9d1d9' }}>test_refund_failure</td>
                  <td style={{ padding: '16px 20px', color: '#c9d1d9' }}>Direct changed-symbol</td>
                  <td style={{ padding: '16px 20px' }}><span style={{ backgroundColor: 'rgba(210,168,255,0.1)', color: '#d2a8ff', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>MUST RUN</span></td>
                  <td style={{ padding: '16px 20px', color: '#8b949e' }}>Direct evidence</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #21262d' }}>
                  <td style={{ padding: '16px 20px', fontFamily: 'monospace', color: '#c9d1d9' }}>test_payment_api</td>
                  <td style={{ padding: '16px 20px', color: '#c9d1d9' }}>Depth-1 impacted caller</td>
                  <td style={{ padding: '16px 20px' }}><span style={{ backgroundColor: 'rgba(88,166,255,0.1)', color: '#58a6ff', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>STRONG</span></td>
                  <td style={{ padding: '16px 20px', color: '#8b949e' }}>Covers a direct dependent</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Section 4: Test Needs */}
          <section id="test-needs" style={{ backgroundColor: '#0d1117', border: '1px solid #f85149', borderRadius: 8, overflow: 'hidden', boxShadow: '0 0 0 1px rgba(248,81,73,0.2)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #30363d', backgroundColor: '#161b22', display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertTriangle size={18} color="#f85149" />
              <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: '#c9d1d9' }}>Material Test Need: TN-204</h2>
              {!isResolved && <span style={{ marginLeft: 'auto', backgroundColor: 'rgba(248,81,73,0.15)', color: '#f85149', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>UNRESOLVED</span>}
              {isResolved && <span style={{ marginLeft: 'auto', backgroundColor: 'rgba(63,185,80,0.15)', color: '#3fb950', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>RESOLVED</span>}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
              <div style={{ padding: 24, borderRight: '1px solid #21262d' }}>
                <h3 style={{ fontSize: 13, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16, fontWeight: 600 }}>The Gap</h3>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 4 }}>Target</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 13, backgroundColor: '#161b22', padding: '4px 8px', borderRadius: 4, display: 'inline-block' }}>PaymentService.refund() (lines 159-167)</div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 4 }}>Reason</div>
                  <div style={{ fontSize: 14, color: '#c9d1d9', lineHeight: 1.5 }}>Changed retry-exhaustion branch is not executed by any observed relevant test.</div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 4 }}>Coverage state</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f85149', fontSize: 13, fontWeight: 500 }}>
                    <XCircle size={14} /> Uncovered
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 4 }}>Expected behavior</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#58a6ff', fontSize: 13, fontWeight: 500 }}>
                    <CheckCircle size={14} /> Known
                  </div>
                </div>
              </div>

              <div style={{ padding: 24, backgroundColor: '#010409' }}>
                <h3 style={{ fontSize: 13, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16, fontWeight: 600 }}>Behavior Sources</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#3fb950' }}>AUTHORITATIVE</span>
                      <span style={{ fontSize: 11, color: '#8b949e' }}>PR description</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#c9d1d9', fontStyle: 'italic' }}>"If all retry attempts fail, RefundRetryExhausted must be raised."</div>
                  </div>
                  <div style={{ backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#58a6ff' }}>SUPPORTING</span>
                      <span style={{ fontSize: 11, color: '#8b949e' }}>Function docstring</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#c9d1d9', fontStyle: 'italic' }}>"Retries refund up to max_attempts."</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resolution Area */}
            <div style={{ padding: '20px 24px', borderTop: '1px solid #30363d', backgroundColor: '#161b22' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 13, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, fontWeight: 600 }}>Resolution</h3>
                  {!isResolved ? (
                    <div style={{ backgroundColor: '#0d1117', border: '1px solid #58a6ff', borderRadius: 8, overflow: 'hidden' }}>
                      <div style={{ padding: '12px 16px', backgroundColor: 'rgba(88,166,255,0.05)', borderBottom: '1px solid #30363d', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Bot size={16} color="#58a6ff" />
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#c9d1d9' }}>Candidate Test Generated</span>
                        </div>
                        <span style={{ fontSize: 11, color: '#8b949e' }}>Mode: Behavior-grounded</span>
                      </div>
                      <div style={{ padding: 16 }}>
                        <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#8b949e', marginBottom: 16 }}>
                          <div style={{ color: '#c9d1d9' }}>def test_refund_raises_after_retry_exhaustion(payment_service, mock_gateway):</div>
                          <div style={{ paddingLeft: 16 }}>mock_gateway.process_refund.side_effect = TransientGatewayError("Timeout")</div>
                          <div style={{ paddingLeft: 16 }}>with pytest.raises(RetryExhaustedException) as exc_info:</div>
                          <div style={{ paddingLeft: 32 }}>payment_service.refund("pay_001", Decimal("50.00"))</div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, color: '#8b949e', marginBottom: 16 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Check size={14} color="#3fb950" /> Syntax valid</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Check size={14} color="#3fb950" /> Target branch reached</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Check size={14} color="#3fb950" /> pytest collectable</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f85149' }}><AlertTriangle size={14} color="#f85149" /> Human review required</div>
                        </div>
                        <button 
                          onClick={() => navigate('/ide?step=2')}
                          style={{ width: '100%', padding: '8px 16px', backgroundColor: '#238636', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                        >
                          <FileCode size={16} /> Review in IDE
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ backgroundColor: 'rgba(63,185,80,0.1)', border: '1px solid rgba(63,185,80,0.4)', borderRadius: 6, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <CheckCircle size={20} color="#3fb950" />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#3fb950' }}>Candidate Accepted & Executed</div>
                        <div style={{ fontSize: 13, color: '#8b949e', marginTop: 4 }}>Test was reviewed by developer, committed, and successfully executed on latest revision.</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column / Sidecar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Coverage Summary */}
          <section style={{ backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #30363d', backgroundColor: '#161b22' }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: '#c9d1d9' }}>Changed-code Coverage</h3>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: '#8b949e' }}>Changed executable lines</span>
                <span style={{ fontSize: 13, color: '#c9d1d9', fontWeight: 600 }}>17</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: '#8b949e' }}>Observed in relevant tests</span>
                <span style={{ fontSize: 13, color: isResolved ? '#3fb950' : '#c9d1d9', fontWeight: 600 }}>{isResolved ? '17' : '15'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontSize: 13, color: '#8b949e' }}>Not observed</span>
                <span style={{ fontSize: 13, color: isResolved ? '#8b949e' : '#f85149', fontWeight: 600 }}>{isResolved ? '0' : '2'}</span>
              </div>
              
              <div style={{ height: 1, backgroundColor: '#21262d', margin: '16px 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: '#8b949e' }}>Changed branches</span>
                <span style={{ fontSize: 13, color: '#c9d1d9', fontWeight: 600 }}>3</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: '#8b949e' }}>Observed</span>
                <span style={{ fontSize: 13, color: isResolved ? '#3fb950' : '#c9d1d9', fontWeight: 600 }}>{isResolved ? '3' : '2'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontSize: 13, color: '#8b949e' }}>Unobserved</span>
                <span style={{ fontSize: 13, color: isResolved ? '#8b949e' : '#f85149', fontWeight: 600, textAlign: 'right' }}>
                  {isResolved ? 'None' : 'retry exhaustion'}
                </span>
              </div>

              <div style={{ backgroundColor: 'rgba(88,166,255,0.05)', border: '1px solid rgba(88,166,255,0.2)', borderRadius: 6, padding: 12, fontSize: 11, color: '#8b949e', lineHeight: 1.5, marginTop: 16 }}>
                Coverage indicates execution evidence, not semantic correctness.
              </div>
            </div>
          </section>

          {/* Execution Plan Summary */}
          <section style={{ backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #30363d', backgroundColor: '#161b22' }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: '#c9d1d9' }}>Execution Plan</h3>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 12, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, fontWeight: 600 }}>Selection (What to run)</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: '#c9d1d9' }}>MUST RUN tests</span>
                <span style={{ fontSize: 13, color: '#c9d1d9', fontWeight: 600 }}>4</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: '#c9d1d9' }}>STRONG tests</span>
                <span style={{ fontSize: 13, color: '#c9d1d9', fontWeight: 600 }}>18</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontSize: 13, color: '#c9d1d9' }}>BROAD tests</span>
                <span style={{ fontSize: 13, color: '#c9d1d9', fontWeight: 600 }}>2</span>
              </div>

              <div style={{ height: 1, backgroundColor: '#21262d', margin: '16px 0' }} />
              
              <div style={{ fontSize: 12, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, fontWeight: 600 }}>Prioritization (Order)</div>
              <div style={{ fontSize: 13, color: '#c9d1d9', marginBottom: 8, display: 'flex', gap: 8 }}>
                <span style={{ color: '#8b949e', fontFamily: 'monospace' }}>1.</span> 
                <div>
                  <div style={{ fontFamily: 'monospace' }}>test_refund_raises...</div>
                  <div style={{ fontSize: 11, color: '#8b949e' }}>P1 — closes TN-204</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: '#c9d1d9', marginBottom: 8, display: 'flex', gap: 8 }}>
                <span style={{ color: '#8b949e', fontFamily: 'monospace' }}>2.</span> 
                <div>
                  <div style={{ fontFamily: 'monospace' }}>test_refund_failure</div>
                  <div style={{ fontSize: 11, color: '#8b949e' }}>P2 — covers changed func</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: '#c9d1d9', marginBottom: 8, display: 'flex', gap: 8 }}>
                <span style={{ color: '#8b949e', fontFamily: 'monospace' }}>3.</span> 
                <div>
                  <div style={{ fontFamily: 'monospace' }}>test_refund_success</div>
                  <div style={{ fontSize: 11, color: '#8b949e' }}>P2 — covers changed func</div>
                </div>
              </div>

              {isResolved && (
                <div style={{ marginTop: 24, padding: 12, backgroundColor: 'rgba(63,185,80,0.1)', border: '1px solid rgba(63,185,80,0.3)', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8, color: '#3fb950', fontSize: 13, fontWeight: 600 }}>
                  <Play size={14} /> Execution Complete (25/25 passed)
                </div>
              )}
            </div>
          </section>

          {/* ML Notice */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16, border: '1px solid #30363d', borderRadius: 6, backgroundColor: '#010409' }}>
            <Server size={16} color="#8b949e" style={{ marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#c9d1d9', marginBottom: 4 }}>Historical model unavailable</div>
              <div style={{ fontSize: 12, color: '#8b949e', lineHeight: 1.4 }}>Using deterministic impact + coverage rules for selection.</div>
            </div>
          </div>

        </div>
      </div>

      {/* Simulation Playback Controls Overlay */}
      <div style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(22,27,34,0.9)', backdropFilter: 'blur(10px)', border: '1px solid #30363d', borderRadius: 32, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.5)', zIndex: 100 }}>
        {overlayText ? (
          <span style={{ color: '#c9d1d9', fontSize: 14, fontWeight: 500 }}>{overlayText}</span>
        ) : (
          <span style={{ color: '#8b949e', fontSize: 14 }}>Auracle Demo Sandbox</span>
        )}
        
        <button 
          onClick={isAutoPlaying ? togglePause : playJourney}
          disabled={!overlayText && isAutoPlaying}
          style={{ backgroundColor: '#238636', color: '#ffffff', border: 'none', borderRadius: 20, padding: '6px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: (!overlayText && isAutoPlaying) ? 0.5 : 1 }}
        >
          {isAutoPlaying ? (isPaused ? <><Play size={14} /> Resume</> : <><Pause size={14} /> Pause</>) : <><Play size={14} /> Play Demo Journey</>}
        </button>
      </div>

    </div>
  )
}
