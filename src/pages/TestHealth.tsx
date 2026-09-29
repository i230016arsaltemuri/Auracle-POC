import { useState } from 'react'
import { TEST_HEALTH_DATA } from '../data/mockData'
import { AlertTriangle, Zap, Activity, Info } from 'lucide-react'

type HealthTab = 'flaky' | 'slow' | 'frequently_failing' | 'rarely_failing'

export default function TestHealth() {
  const [activeTab, setActiveTab] = useState<HealthTab>('flaky')

  const flaky = TEST_HEALTH_DATA.filter(t => t.healthSignal === 'flaky')
  const slow = TEST_HEALTH_DATA.filter(t => t.healthSignal === 'slow')
  const frequentlyFailing = TEST_HEALTH_DATA.filter(t => t.healthSignal === 'frequently_failing')
  const rarelyFailing = TEST_HEALTH_DATA.filter(t => t.healthSignal === 'rarely_failing')

  const tabs = [
    { id: 'flaky', label: 'Flaky', count: flaky.length, icon: Zap, color: 'var(--yellow)' },
    { id: 'slow', label: 'Slow', count: slow.length, icon: Activity, color: 'var(--accent)' },
    { id: 'frequently_failing', label: 'Frequently Failing', count: frequentlyFailing.length, icon: AlertTriangle, color: 'var(--red)' },
    { id: 'rarely_failing', label: 'Rarely Failing', count: rarelyFailing.length, icon: Info, color: 'var(--text-muted)' },
  ]

  const getTabData = () => {
    if (activeTab === 'flaky') return flaky
    if (activeTab === 'slow') return slow
    if (activeTab === 'frequently_failing') return frequentlyFailing
    return rarelyFailing
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Test Health</h1>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          acme/payments-api · 312 tests · Health signals over last 30 days
        </div>
      </div>

      {/* Health summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--border-subtle)', borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
        {[
          { label: 'Flaky Tests', value: '2', color: 'yellow', sub: 'inconsistent outcomes' },
          { label: 'Slow Tests', value: '3', color: 'blue', sub: '> 5s p95 duration' },
          { label: 'Frequently Failing', value: '1', color: 'red', sub: '>20% failure rate' },
          { label: 'Rarely Failing', value: '2', color: '', sub: 'investigation candidates' },
        ].map((m, i) => (
          <div key={i} className="metric-card">
            <div className="metric-label">{m.label}</div>
            <div className={`metric-value ${m.color}`}>{m.value}</div>
            <div className="metric-sub">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Important note about rarely failing */}
      {activeTab === 'rarely_failing' && (
        <div className="info-box" style={{ marginBottom: 16 }}>
          <Info size={13} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }} />
          <div>
            <span style={{ fontWeight: 600, color: 'var(--blue-text)' }}>Rarely failing tests are investigation candidates, not automatic deletion targets.</span>{' '}
            A test that never fails may indicate dead production code, overconstrained mocks, or a test that no longer exercises meaningful behavior.
            Auracle surfaces these for human investigation — it does not delete or disable them automatically.
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tab-list" style={{ marginBottom: 16 }}>
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`tab-item${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id as HealthTab)}
          >
            <tab.icon size={12} style={{ color: tab.color }} />
            {tab.label}
            <span className="tab-count">{tab.count}</span>
          </div>
        ))}
      </div>

      {/* Health table */}
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Test</th>
                <th style={{ width: 80 }}>Pass Rate</th>
                <th style={{ width: 80 }}>Fail Rate</th>
                <th style={{ width: 90 }}>p95 Duration</th>
                <th style={{ width: 80 }}>Avg Duration</th>
                <th style={{ width: 80 }}>Total Runs</th>
                <th style={{ width: 140 }}>Recent (→ latest)</th>
                <th style={{ width: 100 }}>Last Failure</th>
                {activeTab === 'flaky' && <th style={{ width: 90 }}>Flakiness</th>}
              </tr>
            </thead>
            <tbody>
              {getTabData().length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 24 }}>
                    No {activeTab.replace('_', ' ')} tests detected in the current window.
                  </td>
                </tr>
              ) : getTabData().map((test) => (
                <tr key={test.id} style={{ cursor: 'pointer' }}>
                  <td>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--text-primary)', marginBottom: 2 }}>{test.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{test.file}</div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 3 }}>
                      {test.linkedComponents.map(c => (
                        <span key={c} style={{ fontSize: 9, color: 'var(--blue-text)', fontFamily: 'var(--font-mono)', background: 'var(--bg-overlay)', padding: '1px 4px', borderRadius: 2 }}>{c}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ flex: 1, height: 4, background: 'var(--bg-overlay)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${test.passRate * 100}%`, background: test.passRate >= 0.9 ? 'var(--green)' : test.passRate >= 0.7 ? 'var(--yellow)' : 'var(--red)', borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--text-primary)', fontWeight: 600, width: 30 }}>
                        {(test.passRate * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td style={{ fontSize: 11, color: test.failureRate > 0.2 ? 'var(--red-text)' : test.failureRate > 0.1 ? 'var(--yellow-text)' : 'var(--text-muted)', fontWeight: test.failureRate > 0.1 ? 600 : 400 }}>
                    {(test.failureRate * 100).toFixed(0)}%
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: Number(test.p95Duration.replace('s', '')) > 5 ? 'var(--yellow-text)' : 'var(--text-secondary)' }}>
                    {test.p95Duration}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>{test.avgDuration}</td>
                  <td style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{test.totalRuns}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {test.recentResults.map((r, i) => (
                        <div key={i} style={{
                          width: 12, height: 12, borderRadius: 2,
                          background: r === 'PASS' ? 'var(--green-dim)' : 'var(--red-dim)',
                          border: `1px solid ${r === 'PASS' ? '#1a4a30' : '#4a1515'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 7, color: r === 'PASS' ? 'var(--green-text)' : 'var(--red-text)',
                        }}>
                          {r === 'PASS' ? '✓' : '✗'}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td style={{ fontSize: 11, color: test.lastFailure === 'never' ? 'var(--text-muted)' : 'var(--red-text)' }}>
                    {test.lastFailure}
                  </td>
                  {activeTab === 'flaky' && (
                    <td>
                      {test.flakiness > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <div style={{ width: 40, height: 4, background: 'var(--bg-overlay)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${test.flakiness * 100}%`, background: 'var(--yellow)', borderRadius: 2 }} />
                          </div>
                          <span style={{ fontSize: 11, color: 'var(--yellow-text)' }}>{(test.flakiness * 100).toFixed(0)}%</span>
                        </div>
                      ) : <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>—</span>}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
