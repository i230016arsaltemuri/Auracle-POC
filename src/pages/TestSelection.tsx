import { useState } from 'react'
import { SELECTED_TESTS } from '../data/mockData'
import { Info } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts'

type Mode = 'confidence' | 'time' | 'percentage'

const confidenceCurveData = [
  { time: 0, recall: 0, tests: 0 },
  { time: 1, recall: 32, tests: 3 },
  { time: 2, recall: 58, tests: 7 },
  { time: 3, recall: 73, tests: 12 },
  { time: 4.12, recall: 92, tests: 24 },
  { time: 6, recall: 95, tests: 31 },
  { time: 10, recall: 97, tests: 48 },
  { time: 26.8, recall: 99, tests: 312 },
]

export default function TestSelection() {
  const [mode, setMode] = useState<Mode>('confidence')
  const [confidenceTarget, setConfidenceTarget] = useState(90)
  const [timeBudget, setTimeBudget] = useState(4)
  const [percentBudget, setPercentBudget] = useState(16)
  const [shadowMode, setShadowMode] = useState(false)

  // Compute selected tests based on mode
  const getSelectedCount = () => {
    if (mode === 'confidence') return Math.round(24 + (confidenceTarget - 90) * 0.8)
    if (mode === 'time') return Math.round(timeBudget * 5.8)
    return Math.round(312 * percentBudget / 100)
  }

  const selectedCount = Math.min(312, Math.max(1, getSelectedCount()))
  const estimatedRuntime = mode === 'time' ? `${timeBudget}m 00s` : `${(selectedCount * 10.33 / 60).toFixed(1)}m`
  const confidence = mode === 'confidence' ? confidenceTarget : Math.min(99, 32 + selectedCount * 0.35)

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Test Selection</h1>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Predictive selection for PR #184 · Model v0.6.3 · 42 candidate tests · 312 total tests
        </div>
      </div>

      {/* Core principle */}
      <div className="info-box" style={{ marginBottom: 20 }}>
        <Info size={13} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }} />
        <div>
          <span style={{ fontWeight: 600, color: 'var(--blue-text)' }}>Auracle does not simply minimize test count.</span>{' '}
          Its objective is to <em>maximize the probability of detecting relevant failures while minimizing execution cost.</em>{' '}
          A test is selected when its expected failure-detection value exceeds its execution cost.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Optimization controls */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Optimization Mode</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Shadow Mode</span>
                <div
                  onClick={() => setShadowMode(!shadowMode)}
                  style={{
                    width: 36,
                    height: 18,
                    background: shadowMode ? 'rgba(155,111,255,0.3)' : 'var(--bg-overlay)',
                    border: `1px solid ${shadowMode ? 'rgba(155,111,255,0.5)' : 'var(--border-default)'}`,
                    borderRadius: 9,
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{
                    width: 12,
                    height: 12,
                    background: shadowMode ? '#9b6fff' : 'var(--text-muted)',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: 2,
                    left: shadowMode ? 20 : 2,
                    transition: 'left 0.2s ease',
                  }} />
                </div>
              </div>
            </div>
            <div style={{ padding: '14px 16px' }}>
              {/* Mode tabs */}
              <div className="tab-list" style={{ marginBottom: 16 }}>
                {([
                  { id: 'confidence', label: 'Confidence Target' },
                  { id: 'time', label: 'Time Budget' },
                  { id: 'percentage', label: 'Percentage' },
                ] as const).map(m => (
                  <div key={m.id} className={`tab-item${mode === m.id ? ' active' : ''}`} onClick={() => setMode(m.id)}>
                    {m.label}
                  </div>
                ))}
              </div>

              {mode === 'confidence' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Confidence target</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{confidenceTarget}%</span>
                  </div>
                  <input
                    type="range"
                    min={70}
                    max={99}
                    value={confidenceTarget}
                    onChange={e => setConfidenceTarget(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                    <span>70% (fewer tests)</span>
                    <span>99% (more tests)</span>
                  </div>
                </div>
              )}

              {mode === 'time' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Time budget</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{timeBudget}m</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={15}
                    value={timeBudget}
                    onChange={e => setTimeBudget(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                    <span>1m</span>
                    <span>15m</span>
                  </div>
                </div>
              )}

              {mode === 'percentage' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>% of full suite time</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{percentBudget}%</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    value={percentBudget}
                    onChange={e => setPercentBudget(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                    <span>5%</span>
                    <span>50%</span>
                  </div>
                </div>
              )}

              {/* Result */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 14 }}>
                {[
                  { label: 'Tests Selected', value: `${selectedCount}`, sub: `of 312` },
                  { label: 'Est. Runtime', value: estimatedRuntime, sub: 'vs 26m 48s full' },
                  { label: 'Confidence', value: `${confidence.toFixed(0)}%`, sub: 'failure recall est.' },
                ].map((m, i) => (
                  <div key={i} style={{ background: 'var(--bg-elevated)', borderRadius: 6, padding: '8px 10px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>{m.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>{m.value}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.sub}</div>
                  </div>
                ))}
              </div>

              {shadowMode && (
                <div style={{ marginTop: 12, background: 'rgba(155,111,255,0.08)', border: '1px solid rgba(155,111,255,0.25)', borderRadius: 6, padding: '10px 12px' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#c9a8ff', marginBottom: 4 }}>Shadow Mode Active</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    The full test suite will still execute. Auracle will independently run its predicted subset and compare results — measuring whether the prediction would have missed any failures. No risk to CI confidence.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Confidence curve */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Selection Performance Curve</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Model v0.6.3 · 847 evaluated sessions</span>
            </div>
            <div style={{ padding: '16px 16px 8px' }}>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={confidenceCurveData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#5a6478' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}m`} />
                  <YAxis tick={{ fontSize: 10, fill: '#5a6478' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 6, fontSize: 11 }}
                    formatter={(val: any) => [`${val}%`, 'Est. Failure Recall']}
                    labelFormatter={(l: any) => `Runtime: ${l}m`}
                  />
                  <ReferenceLine x={4.12} stroke="#4f7fff" strokeDasharray="4,2" label={{ value: 'Current (4m 12s)', fill: '#7aa5ff', fontSize: 10, position: 'top' }} />
                  <Line type="monotone" dataKey="recall" stroke="#4f7fff" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>
                Execution time (minutes) vs estimated failure recall — evaluated on historical full-run ground truth
              </div>
            </div>
          </div>
        </div>

        {/* Right: test ranking */}
        <div className="card" style={{ height: 'fit-content' }}>
          <div className="card-header">
            <span className="card-title">Top Ranked Tests</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>by selection value</span>
          </div>
          <div>
            {SELECTED_TESTS.filter(t => t.selected).map((test) => (
              <div key={test.id} style={{
                padding: '9px 14px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
              }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', width: 20, flexShrink: 0, textAlign: 'right', marginTop: 2 }}>
                  #{test.rank}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: test.result === 'FAIL' ? 'var(--red-text)' : 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {test.name}
                    </span>
                    {test.result === 'FAIL' && <span className="badge badge-fail" style={{ fontSize: 8 }}>FAIL</span>}
                    {test.result === 'PASS' && <span className="badge badge-pass" style={{ fontSize: 8 }}>PASS</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ flex: 1, height: 3, background: 'var(--bg-overlay)', borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${test.impactScore * 100}%`, background: test.impactScore > 0.8 ? '#4f7fff' : test.impactScore > 0.6 ? '#f5a623' : '#5a6478', borderRadius: 2 }} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', width: 28 }}>{test.impactScore.toFixed(2)}</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                    {test.reasons[0]}
                  </div>
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{test.duration}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
