import { useNavigate } from 'react-router-dom'

import { HISTORY_DATA } from '../data/mockData'

export default function PullRequests() {
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Pull Requests</h1>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>acme/payments-api · 4 open</div>
        </div>
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>PR</th>
                <th>Title</th>
                <th style={{ width: 80 }}>Gate</th>
                <th style={{ width: 80 }}>Risk</th>
                <th style={{ width: 90 }}>Changed Cov.</th>
                <th style={{ width: 80 }}>Selected</th>
                <th style={{ width: 100 }}>Runtime</th>
                <th style={{ width: 60 }}>Gaps</th>
                <th style={{ width: 80 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {/* PR 184 — current focus */}
              <tr
                onClick={() => navigate('/pull-requests/184/report')}
                style={{ cursor: 'pointer', background: 'rgba(240, 68, 56, 0.04)' }}
              >
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: 12 }}>#184</td>
                <td>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                    Add guarded retry to refund processing
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>feat/refund-retry-policy · Maya Chen</div>
                </td>
                <td><span className="badge badge-fail">FAIL</span></td>
                <td><span className="badge badge-high">HIGH</span></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div className="cov-bar-track" style={{ width: 50 }}>
                      <div className="cov-bar-fill" style={{ width: '88%', background: 'var(--green)' }} />
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--green-text)', fontWeight: 600 }}>88%</span>
                  </div>
                </td>
                <td style={{ fontSize: 11, color: 'var(--text-secondary)' }}>24 / 312</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>4m 12s</td>
                <td>
                  <span style={{ fontSize: 11, color: 'var(--red-text)', fontWeight: 600 }}>1</span>
                </td>
                <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>Sep 29</td>
              </tr>

              {HISTORY_DATA.recentPRs.slice(1).map((pr) => (
                <tr key={pr.pr} style={{ cursor: 'pointer' }} onClick={() => {}}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: 12 }}>#{pr.pr}</td>
                  <td>
                    <div style={{ fontSize: 12, color: 'var(--text-primary)', marginBottom: 2 }}>{pr.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>acme/payments-api</div>
                  </td>
                  <td><span className={`badge badge-${pr.gate === 'PASS' ? 'pass' : 'fail'}`}>{pr.gate}</span></td>
                  <td><span className={`badge badge-${pr.risk === 'HIGH' ? 'high' : pr.risk === 'MEDIUM' ? 'medium' : 'low'}`}>{pr.risk}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div className="cov-bar-track" style={{ width: 50 }}>
                        <div className="cov-bar-fill" style={{ width: `${pr.changedCoverage}%`, background: pr.changedCoverage >= 90 ? 'var(--green)' : 'var(--yellow)' }} />
                      </div>
                      <span style={{ fontSize: 11, color: pr.changedCoverage >= 90 ? 'var(--green-text)' : 'var(--yellow-text)', fontWeight: 600 }}>{pr.changedCoverage}%</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{pr.selected} / {pr.full}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>{pr.selectedTime}</td>
                  <td style={{ fontSize: 11, color: pr.gaps > 0 ? 'var(--yellow-text)' : 'var(--text-muted)' }}>
                    {pr.gaps > 0 ? pr.gaps : '—'}
                  </td>
                  <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{pr.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
