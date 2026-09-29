import { AlertTriangle, GitPullRequest as _GitPR, TrendingDown as _TD, CheckCircle, XCircle, Clock as _Clock, ArrowRight, ChevronRight, Shield } from 'lucide-react'
import { REPO, HISTORY_DATA } from '../data/mockData'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

interface Props {
  onOpenPR: () => void
}

export default function Overview({ onOpenPR }: Props) {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Problem statement banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(79, 127, 255, 0.06) 0%, rgba(155, 111, 255, 0.06) 100%)',
        border: '1px solid rgba(79, 127, 255, 0.2)',
        borderRadius: 10,
        padding: '18px 24px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 16
      }}>
        <div style={{
          width: 36,
          height: 36,
          background: 'var(--accent-dim)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Shield size={18} style={{ color: 'var(--blue-text)' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 4 }}>
            Green CI can still leave changed behavior insufficiently tested.
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Traditional CI asks: <span style={{ fontStyle: 'italic' }}>"Did the tests that ran pass?"</span> — Auracle asks:{' '}
            <span style={{ color: 'var(--blue-text)' }}>
              What changed → What it affected → What evidence exists → Which tests should run → What actually ran → What remains uncovered → Why the quality decision was made.
            </span>
          </div>
        </div>
      </div>

      {/* Top KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1, background: 'var(--border-subtle)', borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
        {[
          { label: 'Open PRs', value: REPO.stats.openPRs, unit: '', color: '' },
          { label: 'Avg Selective Runtime', value: REPO.stats.avgSelectiveRuntime, unit: '', color: 'blue' },
          { label: 'Avg Full Runtime', value: REPO.stats.avgFullRuntime, unit: '', color: '' },
          { label: 'Runtime Saved', value: REPO.stats.runtimeSaved, unit: '', color: 'green' },
          { label: 'Failure Recall', value: REPO.stats.failureRecall, unit: '', color: 'green' },
          { label: 'Changed Coverage', value: REPO.stats.changedCodeCoverage, unit: '', color: 'blue' },
        ].map((m, i) => (
          <div key={i} className="metric-card">
            <div className="metric-label">{m.label}</div>
            <div className={`metric-value ${m.color}`}>{m.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16 }}>
        {/* Left — main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* PR requiring attention */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="card-title">Pull Requests</span>
                <span className="badge badge-muted">4 open</span>
              </div>
              <button className="btn btn-ghost" style={{ fontSize: 11 }}>View all <ChevronRight size={11} /></button>
            </div>

            <div>
              {/* PR #184 — needs attention */}
              <div
                className="pr-list-item attention"
                onClick={onOpenPR}
              >
                <XCircle size={16} style={{ color: 'var(--red)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                      Add guarded retry to refund processing
                    </span>
                    <span className="badge badge-fail">FAIL</span>
                    <span className="badge badge-high">HIGH RISK</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>#184</span>
                    <span>feat/refund-retry-policy</span>
                    <span>Maya Chen</span>
                    <span>• 1 failed test</span>
                    <span>• 1 material gap</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <button className="btn btn-danger" style={{ fontSize: 11 }} onClick={e => { e.stopPropagation(); onOpenPR() }}>
                    Open Change Report
                    <ArrowRight size={11} />
                  </button>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>4m ago</span>
                </div>
              </div>

              {/* PR #183 */}
              <div className="pr-list-item">
                <CheckCircle size={16} style={{ color: 'var(--green)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>Update payment validation rules</span>
                    <span className="badge badge-pass">PASS</span>
                    <span className="badge badge-medium">MEDIUM</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>#183</span>
                    <span>feat/validation-update</span>
                    <span>James Park</span>
                    <span>• 18 tests selected</span>
                    <span>• 91% coverage</span>
                  </div>
                </div>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>3h ago</span>
              </div>

              {/* PR #182 */}
              <div className="pr-list-item">
                <CheckCircle size={16} style={{ color: 'var(--green)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>Fix currency rounding in tax calculation</span>
                    <span className="badge badge-pass">PASS</span>
                    <span className="badge badge-low">LOW</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>#182</span>
                    <span>fix/currency-rounding</span>
                    <span>Sara Liu</span>
                    <span>• 8 tests selected</span>
                    <span>• 100% coverage</span>
                  </div>
                </div>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>27h ago</span>
              </div>

              {/* PR #181 */}
              <div className="pr-list-item">
                <CheckCircle size={16} style={{ color: 'var(--green)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>Refactor repository layer</span>
                    <span className="badge badge-pass">PASS</span>
                    <span className="badge badge-medium">MEDIUM</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>#181</span>
                    <span>refactor/repo-layer</span>
                    <span>Maya Chen</span>
                    <span>• 31 tests selected</span>
                    <span>• 86% coverage</span>
                  </div>
                </div>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>3d ago</span>
              </div>
            </div>
          </div>

          {/* Runtime savings chart */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Selected Runtime vs Full Suite</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Last 30 days</span>
            </div>
            <div style={{ padding: '16px 16px 8px' }}>
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={HISTORY_DATA.runtimeTrend} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="fullGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5a6478" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#5a6478" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="selGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f7fff" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4f7fff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5a6478' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#5a6478' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}m`} />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 6, fontSize: 11 }}
                    formatter={(val: any, name: any) => [`${val}m`, name === 'full' ? 'Full Suite' : 'Selected']}
                  />
                  <Area type="monotone" dataKey="full" stroke="#5a6478" fill="url(#fullGrad)" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="selected" stroke="#4f7fff" fill="url(#selGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
                  <div style={{ width: 12, height: 2, background: '#5a6478' }} /> Full suite
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
                  <div style={{ width: 12, height: 2, background: '#4f7fff' }} /> Selected
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Needs Attention */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Needs Attention</span>
              <AlertTriangle size={13} style={{ color: 'var(--yellow)' }} />
            </div>
            <div style={{ padding: '8px 0' }}>
              <div style={{ padding: '8px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, background: 'var(--red)', borderRadius: '50%', marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>PR #184 Quality Gate FAILED</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>test_refund_failure FAILED · 1 material testing gap remains</div>
                </div>
              </div>
              <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0 16px' }} />
              <div style={{ padding: '8px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, background: 'var(--yellow)', borderRadius: '50%', marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>2 flaky tests detected</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>test_payment_timeout · test_full_payment_flow</div>
                </div>
              </div>
              <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0 16px' }} />
              <div style={{ padding: '8px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, background: 'var(--text-muted)', borderRadius: '50%', marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>3 rarely-failing tests</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Investigation candidates — not safe to delete</div>
                </div>
              </div>
            </div>
          </div>

          {/* Auracle pipeline */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">How Auracle Works</span>
            </div>
            <div style={{ padding: '14px 16px' }}>
              {[
                { label: 'CODE CHANGE', desc: 'Git diff + commit', color: 'var(--accent)' },
                { label: 'UNDERSTAND CHANGE', desc: 'AST / symbol analysis', color: 'var(--accent)' },
                { label: 'MAP IMPACT', desc: 'Dependency graph traversal', color: 'var(--accent)' },
                { label: 'ANALYZE EVIDENCE', desc: 'Coverage + test history', color: 'var(--accent)' },
                { label: 'SELECT TESTS', desc: 'Predictive ML ranking', color: 'var(--accent)' },
                { label: 'EXECUTE', desc: 'Existing runner (pytest)', color: 'var(--accent)' },
                { label: 'COLLECT RESULTS', desc: 'Results + coverage', color: 'var(--accent)' },
                { label: 'QUALITY GATE', desc: 'Evidence-based decision', color: 'var(--green)' },
                { label: 'EXPLAIN', desc: 'AI copilot with evidence IDs', color: 'var(--purple)' },
              ].map((step, i, arr) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'stretch', marginBottom: i < arr.length - 1 ? 0 : 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 16 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: step.color, marginTop: 7, flexShrink: 0 }} />
                    {i < arr.length - 1 && <div style={{ width: 1, flex: 1, background: 'var(--border-default)', minHeight: 14 }} />}
                  </div>
                  <div style={{ paddingBottom: i < arr.length - 1 ? 8 : 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: step.color, letterSpacing: '0.06em', marginBottom: 1 }}>{step.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Model health */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Model Performance</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>v0.6.3</span>
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Failure recall</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)' }}>94.7%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Test reduction</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>78%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Missed failures (100 runs)</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>2</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Selection latency</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>1.8s</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Status</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)' }} />
                  <span style={{ fontSize: 11, color: 'var(--green-text)' }}>Healthy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
