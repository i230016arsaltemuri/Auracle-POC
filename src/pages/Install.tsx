// Install / Setup page
export default function Install() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Auracle Setup</h1>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Minimal integration — no changes to your test code</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Step 1: pip */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--blue-text)' }}>1</div>
              <span className="card-title">Install Auracle</span>
            </div>
          </div>
          <div style={{ padding: 16 }}>
            <div className="terminal">
              <div className="terminal-header">
                <div className="terminal-dot" style={{ background: '#ff5f57' }} />
                <div className="terminal-dot" style={{ background: '#ffbd2e' }} />
                <div className="terminal-dot" style={{ background: '#28ca41' }} />
              </div>
              <div className="terminal-body">
                <div className="terminal-line cmd">pip install auracle</div>
                <div className="terminal-line dim"># Or via requirements</div>
                <div className="terminal-line cmd">echo "auracle&gt;=0.6.3" &gt;&gt; requirements-dev.txt</div>
                <div className="terminal-line success">Successfully installed auracle-0.6.3</div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: token */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--blue-text)' }}>2</div>
              <span className="card-title">Add GitHub token</span>
            </div>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>Add to GitHub repository secrets as <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue-text)' }}>AURACLE_TOKEN</span></div>
            <div className="terminal">
              <div className="terminal-header">
                <div className="terminal-dot" style={{ background: '#ff5f57' }} />
                <div className="terminal-dot" style={{ background: '#ffbd2e' }} />
                <div className="terminal-dot" style={{ background: '#28ca41' }} />
              </div>
              <div className="terminal-body">
                <div className="terminal-line cmd">auracle login</div>
                <div className="terminal-line">Opening browser for authentication...</div>
                <div className="terminal-line success">Token stored. Connected to acme/payments-api.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: workflow */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--blue-text)' }}>3</div>
              <span className="card-title">Add GitHub Actions workflow</span>
            </div>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-primary)', background: '#0d1117', borderRadius: 6, padding: 14, lineHeight: 1.7, overflow: 'auto' }}>
              {`# .github/workflows/auracle.yml
name: Auracle CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0   # Required for diff analysis

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install dependencies
        run: pip install -r requirements-dev.txt

      - name: Auracle analysis
        env:
          AURACLE_TOKEN: \${{ secrets.AURACLE_TOKEN }}
        run: auracle analyze --pr $GITHUB_REF_NAME

      - name: Run selected tests
        run: |
          auracle exec -- pytest \$(cat .auracle/selected_tests.txt) \\
            --cov=payments --cov-report=xml --tb=short

      - name: Report
        if: always()
        run: auracle report --upload`}
            </div>
          </div>
        </div>

        {/* Step 4: that's it */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--green-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--green-text)' }}>✓</div>
              <span className="card-title">That's it. Auracle is active.</span>
            </div>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Auracle requires no changes to your test code, pytest configuration, or coverage setup. It reads your git diffs, your existing coverage data, and your test history — all without modifying your tests.
            </div>
            <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { ok: true, label: 'No test code changes' },
                { ok: true, label: 'Works with existing pytest' },
                { ok: true, label: 'Works with existing coverage.py' },
                { ok: true, label: 'Reads git history automatically' },
                { ok: true, label: 'GitHub Actions native' },
                { ok: true, label: 'Local Ollama AI (no cloud dependency)' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
