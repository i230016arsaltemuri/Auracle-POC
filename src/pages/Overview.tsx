import { CheckCircle, XCircle, ArrowRight, Play, Clock, Shield, Zap } from 'lucide-react'
import { REPO, HISTORY_DATA } from '../data/mockData'
import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

interface Props {
  onOpenPR: () => void
}

const prs = [
  { id: 184, title: 'Add Partial Refund Support', author: 'ahmed', status: 'FAIL', time: '4m', tests: 23, issue: 'Uncovered branch' },
  { id: 183, title: 'Update payment validation rules', author: 'james', status: 'PASS', time: '3h', tests: 18, issue: null },
  { id: 182, title: 'Fix currency rounding in tax calc', author: 'sara', status: 'PASS', time: '27h', tests: 8, issue: null },
]

export default function Overview({ onOpenPR }: Props) {
  const navigate = useNavigate()
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24, padding: '20px 0' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)' }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>payments-api</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>acme-corp • main</div>
        </div>
        <button className="btn btn-primary" style={{ padding: '8px 16px', gap: 8, display: 'flex', alignItems: 'center' }} onClick={() => navigate('/ide')}>
          <Play size={14} /> Start Journey
        </button>
      </div>

      {/* 3 Core Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { icon: <Zap size={16} color="var(--accent)" />, label: 'Time Saved', value: REPO.stats.runtimeSaved, sub: 'vs 32m baseline' },
          { icon: <Shield size={16} color="var(--green)" />, label: 'Recall', value: REPO.stats.failureRecall, sub: '100% (last 100 runs)' },
          { icon: <Clock size={16} color="var(--text-secondary)" />, label: 'Avg Runtime', value: REPO.stats.avgSelectiveRuntime, sub: '-78% reduction' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>{s.icon}<span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{s.label}</span></div>
            <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, letterSpacing: '-0.02em' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        
        {/* Pull Requests */}
        <div className="card">
          <div className="card-header" style={{ padding: '16px 20px' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Active PRs</span>
          </div>
          <div>
            {prs.map((pr) => (
              <div key={pr.id} onClick={pr.id === 184 ? onOpenPR : undefined}
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderTop: '1px solid var(--border-subtle)', cursor: pr.id === 184 ? 'pointer' : 'default', background: pr.id === 184 ? 'rgba(248,81,73,0.03)' : 'transparent' }}>
                {pr.status === 'FAIL' ? <XCircle size={18} color="var(--red)" style={{ flexShrink: 0 }} /> : <CheckCircle size={18} color="var(--green)" style={{ flexShrink: 0 }} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{pr.title}</span>
                    <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>#{pr.id}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                    <span>{pr.author}</span>
                    <span>{pr.tests} tests</span>
                    {pr.issue && <span style={{ color: 'var(--red)', fontWeight: 500 }}>• {pr.issue}</span>}
                  </div>
                </div>
                {pr.id === 184 && <button className="btn btn-danger" style={{ fontSize: 12, padding: '6px 12px' }} onClick={e => { e.stopPropagation(); onOpenPR() }}>Review <ArrowRight size={12} style={{marginLeft: 4}} /></button>}
                <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: pr.id === 184 ? 12 : 'auto' }}>{pr.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Chart */}
          <div className="card">
            <div className="card-header" style={{ padding: '16px 20px' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>CI Runtime Trend</span>
            </div>
            <div style={{ padding: '0 16px 16px' }}>
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={HISTORY_DATA.runtimeTrend} margin={{ top: 10, right: 0, bottom: 0, left: -24 }}>
                  <defs>
                    <linearGradient id="selGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4f7fff" stopOpacity={0.4} /><stop offset="95%" stopColor="#4f7fff" stopOpacity={0} /></linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5a6478' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#5a6478' }} axisLine={false} tickLine={false} tickFormatter={v => v + 'm'} />
                  <Tooltip contentStyle={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, fontSize: 12 }} formatter={(val, name) => [val + 'm', name === 'full' ? 'Baseline' : 'Auracle']} />
                  <Area type="monotone" dataKey="full" stroke="#5a6478" strokeDasharray="3 3" fill="none" strokeWidth={1} />
                  <Area type="monotone" dataKey="selected" stroke="#4f7fff" fill="url(#selGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}><div style={{ width: 12, height: 1, borderTop: '1px dashed #5a6478' }} /> Baseline</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}><div style={{ width: 12, height: 2, background: '#4f7fff', borderRadius: 1 }} /> Auracle</div>
              </div>
            </div>
          </div>

          {/* Health */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Health</div>
            {[
              { label: 'Model Status', value: 'Active', color: 'var(--green)' },
              { label: 'Test Reduction', value: '78%', color: 'var(--text-primary)' },
              { label: 'Selection Latency', value: '1.8s', color: 'var(--text-primary)' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: i < 2 ? 12 : 0, marginBottom: i < 2 ? 12 : 0, borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{r.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: r.color }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
