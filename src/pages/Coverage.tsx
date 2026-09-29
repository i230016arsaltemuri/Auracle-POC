import { COVERAGE_LINES, CHANGED_FILES, HISTORY_DATA } from '../data/mockData'
import { AlertTriangle } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

export default function Coverage() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Coverage Intelligence</h1>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          acme/payments-api · PR #184 · Changed-code coverage is the primary metric
        </div>
      </div>

      {/* Key metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--border-subtle)', borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
        {[
          { label: 'Repository Coverage', value: '87%', sub: 'global baseline', color: 'blue' },
          { label: 'Changed-Code Coverage', value: '88%', sub: '37 / 42 changed lines', color: 'green' },
          { label: 'Branch Coverage', value: '81%', sub: 'changed branches only', color: 'yellow' },
          { label: 'Material Gaps', value: '1', sub: 'uncovered changed branches', color: 'red' },
        ].map((m, i) => (
          <div key={i} className="metric-card">
            <div className="metric-label">{m.label}</div>
            <div className={`metric-value ${m.color}`}>{m.value}</div>
            <div className="metric-sub">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Warning */}
      <div className="warn-box" style={{ marginBottom: 20 }}>
        <AlertTriangle size={13} style={{ color: 'var(--yellow)', flexShrink: 0, marginTop: 1 }} />
        <div>
          <strong style={{ color: 'var(--yellow-text)' }}>Changed-code coverage is the primary Auracle metric,</strong>{' '}
          not global repository coverage. Repository coverage (87%) cannot reveal that the retry exhaustion branch
          (lines 159-167 in payments/service.py) is completely uncovered. Changed-code analysis surfaces this risk.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
        {/* Left: source view + chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Coverage trend */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Coverage Trend</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Last 30 days</span>
            </div>
            <div style={{ padding: '12px 16px 8px' }}>
              <ResponsiveContainer width="100%" height={130}>
                <AreaChart data={HISTORY_DATA.coverageTrend} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="globalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5a6478" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#5a6478" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="changedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2dd98a" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2dd98a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5a6478' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#5a6478' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={[78, 100]} />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 6, fontSize: 11 }}
                    formatter={(val: any, name: any) => [`${val}%`, name === 'global' ? 'Global' : 'Changed-code']}
                  />
                  <Area type="monotone" dataKey="global" stroke="#5a6478" fill="url(#globalGrad)" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="changed" stroke="#2dd98a" fill="url(#changedGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
                  <div style={{ width: 12, height: 2, background: '#5a6478' }} /> Global coverage
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
                  <div style={{ width: 12, height: 2, background: '#2dd98a' }} /> Changed-code coverage
                </div>
              </div>
            </div>
          </div>

          {/* Source viewer */}
          <div className="card">
            <div className="card-header">
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-primary)' }}>payments/service.py</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>PaymentService.refund()</span>
              </div>
              <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)' }} />covered</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)' }} />uncovered</span>
              </div>
            </div>
            <div className="code-viewer" style={{ border: 'none', borderRadius: 0, maxHeight: 500, overflow: 'auto' }}>
              {COVERAGE_LINES.map((line, i) => (
                <div
                  key={i}
                  className={`code-line ${line.status}`}
                  style={{ cursor: line.status !== 'neutral' ? 'pointer' : 'default' }}
                >
                  <div className="code-line-number">{line.line}</div>
                  <div className="code-line-gutter">
                    {line.status === 'covered' && <div className="coverage-dot covered" />}
                    {line.status === 'uncovered' && <div className="coverage-dot uncovered" />}
                  </div>
                  <div className="code-line-content">
                    {line.added && <span style={{ color: '#2dd98a', marginRight: 4, fontSize: 10 }}>+</span>}
                    {line.content || ' '}
                  </div>
                </div>
              ))}
            </div>
            {/* Gap callout */}
            <div style={{ padding: '10px 14px', background: 'rgba(245, 166, 35, 0.06)', borderTop: '1px solid rgba(245, 166, 35, 0.2)' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <AlertTriangle size={13} style={{ color: 'var(--yellow)', flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--yellow-text)', marginBottom: 3 }}>MATERIAL GAP · Lines 159-167</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    Retry exhaustion branch: zero coverage after all 24 selected tests executed.
                    Evidence: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>COV-184-12</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: file table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header"><span className="card-title">Changed File Coverage</span></div>
            <div>
              {CHANGED_FILES.map((file, i) => (
                <div key={i} style={{ padding: '10px 14px', borderBottom: i < CHANGED_FILES.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
                      {file.path}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: file.coverage >= 90 ? 'var(--green)' : file.coverage >= 70 ? 'var(--yellow)' : 'var(--red)', flexShrink: 0, marginLeft: 8 }}>
                      {file.coverage}%
                    </span>
                  </div>
                  <div className="cov-bar-track">
                    <div className="cov-bar-fill" style={{
                      width: `${file.coverage}%`,
                      background: file.coverage >= 90 ? 'var(--green)' : file.coverage >= 70 ? 'var(--yellow)' : 'var(--red)'
                    }} />
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>+{file.added}/-{file.deleted}</span>
                    {file.gaps > 0 && <span style={{ fontSize: 10, color: 'var(--yellow-text)', display: 'flex', alignItems: 'center', gap: 2 }}><AlertTriangle size={8} /> 1 gap</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coverage definition */}
          <div className="card">
            <div className="card-header"><span className="card-title">What Auracle Measures</span></div>
            <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { term: 'Global coverage', def: 'What % of the entire codebase is covered by any test?' },
                { term: 'Changed-code coverage', def: 'What % of the changed lines/functions are covered by relevant tests?' },
                { term: 'Branch coverage', def: 'What % of changed conditional branches have been exercised?' },
                { term: 'Material gap', def: 'A changed code branch with zero validated coverage evidence after execution.' },
              ].map((item, i) => (
                <div key={i} style={{ borderBottom: i < 3 ? '1px solid var(--border-subtle)' : 'none', paddingBottom: i < 3 ? 10 : 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--blue-text)', marginBottom: 3 }}>{item.term}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.def}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent PR coverage */}
          <div className="card">
            <div className="card-header"><span className="card-title">Recent PRs</span></div>
            <div>
              {HISTORY_DATA.recentPRs.map((pr, i) => (
                <div key={i} style={{ padding: '7px 14px', borderBottom: i < HISTORY_DATA.recentPRs.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>#{pr.pr} {pr.title}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: pr.changedCoverage >= 90 ? 'var(--green)' : pr.changedCoverage >= 80 ? 'var(--yellow)' : 'var(--red)', flexShrink: 0 }}>{pr.changedCoverage}%</span>
                  </div>
                  <div className="cov-bar-track">
                    <div className="cov-bar-fill" style={{ width: `${pr.changedCoverage}%`, background: pr.changedCoverage >= 90 ? 'var(--green)' : 'var(--yellow)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
