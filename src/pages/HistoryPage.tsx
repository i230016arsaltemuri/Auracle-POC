import { HISTORY_DATA } from '../data/mockData'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function HistoryPage() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>History & Model Quality</h1>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          acme/payments-api · Model v0.6.3 · {HISTORY_DATA.totalSessions} evaluated sessions
        </div>
      </div>

      {/* Key metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, background: 'var(--border-subtle)', borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
        {[
          { label: 'Failure Recall', value: `${HISTORY_DATA.failureRecall}%`, color: 'green', trend: 'up' },
          { label: 'Test Reduction', value: `${HISTORY_DATA.testReduction}%`, color: 'blue', trend: 'up' },
          { label: 'Missed Failures', value: `${HISTORY_DATA.missedFailures}`, color: '', sub: '/ last 100 runs', trend: 'same' },
          { label: 'Selection Latency', value: `${HISTORY_DATA.medianSelectionLatency}s`, color: 'green', sub: 'median', trend: 'down' },
          { label: 'Model Version', value: HISTORY_DATA.modelVersion, color: 'blue', sub: 'healthy', trend: 'same' },
        ].map((m, i) => (
          <div key={i} className="metric-card">
            <div className="metric-label">{m.label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div className={`metric-value ${m.color}`} style={{ fontSize: 20 }}>{m.value}</div>
              {m.trend === 'up' && <TrendingUp size={14} style={{ color: 'var(--green)' }} />}
              {m.trend === 'down' && <TrendingDown size={14} style={{ color: 'var(--green)' }} />}
              {m.trend === 'same' && <Minus size={14} style={{ color: 'var(--text-muted)' }} />}
            </div>
            {m.sub && <div className="metric-sub">{m.sub}</div>}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Runtime savings */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Selected vs Full Suite Runtime</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>minutes</span>
          </div>
          <div style={{ padding: '12px 16px 8px' }}>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={HISTORY_DATA.runtimeTrend} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="hist-fullGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5a6478" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#5a6478" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="hist-selGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f7fff" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#4f7fff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5a6478' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#5a6478' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 6, fontSize: 11 }} />
                <Area type="monotone" dataKey="full" stroke="#5a6478" fill="url(#hist-fullGrad)" strokeWidth={1.5} name="Full Suite" />
                <Area type="monotone" dataKey="selected" stroke="#4f7fff" fill="url(#hist-selGrad)" strokeWidth={2} name="Selected" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Failure recall */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Failure Recall Over Time</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>%</span>
          </div>
          <div style={{ padding: '12px 16px 8px' }}>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={HISTORY_DATA.recallTrend} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="recallGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2dd98a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2dd98a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5a6478' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#5a6478' }} axisLine={false} tickLine={false} domain={[88, 100]} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 6, fontSize: 11 }} formatter={(v: any) => [`${v}%`, 'Failure Recall']} />
                <ReferenceLine y={90} stroke="#f5a623" strokeDasharray="4,2" />
                <Area type="monotone" dataKey="recall" stroke="#2dd98a" fill="url(#recallGrad)" strokeWidth={2} name="Recall" />
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ fontSize: 10, color: 'var(--yellow-text)', textAlign: 'right', marginTop: 4 }}>— 90% target threshold</div>
          </div>
        </div>
      </div>

      {/* PR history table */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <span className="card-title">Recent Changes — acme/payments-api</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Last 5 PRs</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 50 }}>PR</th>
                <th>Title</th>
                <th style={{ width: 70 }}>Gate</th>
                <th style={{ width: 70 }}>Risk</th>
                <th style={{ width: 100 }}>Changed Cov.</th>
                <th style={{ width: 80 }}>Selected</th>
                <th style={{ width: 100 }}>Selected Time</th>
                <th style={{ width: 60 }}>Gaps</th>
                <th style={{ width: 70 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {HISTORY_DATA.recentPRs.map((pr) => (
                <tr key={pr.pr} style={{ cursor: 'pointer' }}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)' }}>#{pr.pr}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{pr.title}</td>
                  <td><span className={`badge badge-${pr.gate === 'PASS' ? 'pass' : 'fail'}`} style={{ fontSize: 9 }}>{pr.gate}</span></td>
                  <td><span className={`badge badge-${pr.risk === 'HIGH' ? 'high' : pr.risk === 'MEDIUM' ? 'medium' : 'low'}`} style={{ fontSize: 9 }}>{pr.risk}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div className="cov-bar-track" style={{ width: 40 }}>
                        <div className="cov-bar-fill" style={{ width: `${pr.changedCoverage}%`, background: pr.changedCoverage >= 90 ? 'var(--green)' : 'var(--yellow)' }} />
                      </div>
                      <span style={{ fontSize: 11, color: pr.changedCoverage >= 90 ? 'var(--green-text)' : 'var(--yellow-text)', fontWeight: 600 }}>{pr.changedCoverage}%</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{pr.selected} / {pr.full}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green-text)' }}>{pr.selectedTime}</td>
                  <td style={{ fontSize: 11, color: pr.gaps > 0 ? 'var(--yellow-text)' : 'var(--text-muted)' }}>{pr.gaps > 0 ? pr.gaps : '—'}</td>
                  <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{pr.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shadow mode evaluation */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Shadow Mode Evaluation</span>
          <span className="shadow-mode-badge">Shadow Mode</span>
        </div>
        <div style={{ padding: 16 }}>
          <div className="info-box" style={{ marginBottom: 14 }}>
            <div>
              Shadow mode is how Auracle earns trust. The full test suite runs. Auracle independently predicts a subset.
              After execution, Auracle measures how many failing tests it would have caught with its subset — without
              risking CI confidence.
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { label: 'Sessions Evaluated', value: '847', sub: 'full-run comparisons' },
              { label: 'Caught Failures', value: '94.7%', sub: 'within predicted subset' },
              { label: 'Missed Failures', value: '2', sub: 'in last 100 evaluated' },
              { label: 'Est. Time Saved', value: '78%', sub: 'if selective mode used' },
            ].map((m, i) => (
              <div key={i} style={{ background: 'var(--bg-elevated)', borderRadius: 6, padding: '10px 12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3 }}>{m.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--green)', marginBottom: 2 }}>{m.value}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
