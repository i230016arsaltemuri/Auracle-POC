export default function Repositories() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Repositories</h1>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Monitored repositories with active Auracle integration</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Active repo */}
        <div className="card">
          <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 38,
              height: 38,
              background: 'var(--accent-dim)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--blue-text)',
              flexShrink: 0
            }}>P</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>acme/payments-api</span>
                <span className="badge badge-pass">Active</span>
                <span className="badge badge-blue">FYP Demo</span>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-muted)' }}>
                <span>Python 3.12</span>
                <span>pytest</span>
                <span>coverage.py</span>
                <span>312 tests</span>
                <span>Last analyzed: 4m ago</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, textAlign: 'center' }}>
              {[
                { label: 'Open PRs', value: '4' },
                { label: 'Model v', value: '0.6.3' },
                { label: 'Recall', value: '94.7%' },
                { label: 'Saved', value: '78%' },
              ].map((m, i) => (
                <div key={i}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>{m.value}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional repos (grayed out) */}
        {[
          { name: 'acme/auth-service', lang: 'Python', tests: 84, status: 'pending' },
          { name: 'acme/billing-worker', lang: 'Python', tests: 203, status: 'pending' },
        ].map((repo, i) => (
          <div key={i} className="card" style={{ opacity: 0.5 }}>
            <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 38, height: 38, background: 'var(--bg-overlay)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', flexShrink: 0 }}>
                {repo.name.split('/')[1][0].toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>{repo.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{repo.lang} · {repo.tests} tests · Pending integration</div>
              </div>
              <span className="badge badge-muted">PENDING</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
