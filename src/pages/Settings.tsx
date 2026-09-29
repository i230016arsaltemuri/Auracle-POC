import { useState } from 'react'
import { CheckCircle, AlertCircle, Settings as SettingsIcon, Database, GitBranch, Cpu, Bot, Shield } from 'lucide-react'

export default function SettingsPage() {
  const [shadowMode, setShadowMode] = useState(false)
  const [aiProvider, setAiProvider] = useState<'ollama' | 'external' | 'none'>('ollama')
  const [gatePolicy, setGatePolicy] = useState<'strict' | 'standard' | 'advisory'>('standard')

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Settings</h1>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Configuration for acme/payments-api</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* GitHub Repository */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Database size={14} style={{ color: 'var(--text-muted)' }} />
              <span className="card-title">GitHub Repository Integration</span>
            </div>
            <span className="badge badge-pass">Connected</span>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: 'Repository', value: 'acme/payments-api' },
                { label: 'Provider', value: 'GitHub' },
                { label: 'Default branch', value: 'main' },
                { label: 'Language', value: 'Python 3.12' },
                { label: 'Test framework', value: 'pytest' },
                { label: 'Coverage provider', value: 'pytest-cov / coverage.py' },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GitHub Actions */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <GitBranch size={14} style={{ color: 'var(--text-muted)' }} />
              <span className="card-title">GitHub Actions</span>
            </div>
            <span className="badge badge-pass">Active</span>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Workflow file</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--blue-text)', background: 'var(--bg-elevated)', borderRadius: 5, padding: '6px 10px', border: '1px solid var(--border-subtle)' }}>
                .github/workflows/auracle.yml
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: 'PR trigger', value: 'Enabled', ok: true },
                { label: 'Push trigger', value: 'Enabled (main)', ok: true },
                { label: 'Nightly full run', value: 'Enabled (02:00 UTC)', ok: true },
                { label: 'PR comment', value: 'Enabled', ok: true },
                { label: 'Status check', value: 'Required', ok: true },
                { label: 'Permissions', value: 'pull_request, checks, contents', ok: true },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    {item.ok && <CheckCircle size={11} style={{ color: 'var(--green)' }} />}
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selection Policy */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <SettingsIcon size={14} style={{ color: 'var(--text-muted)' }} />
              <span className="card-title">Selection Policy</span>
            </div>
          </div>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>Default optimization mode</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['confidence', 'time', 'percentage'] as const).map(mode => (
                  <button key={mode} className={`btn ${'confidence' === mode ? 'btn-primary' : 'btn-secondary'}`} onClick={() => {}} style={{ fontSize: 11 }}>
                    {mode === 'confidence' ? 'Confidence Target' : mode === 'time' ? 'Time Budget' : 'Percentage'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 3 }}>Confidence target</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>90% (selected test subset expected to detect 90% of failures)</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>Shadow Mode</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Full suite executes; Auracle predicts subset and compares results</div>
              </div>
              <div
                onClick={() => setShadowMode(!shadowMode)}
                style={{
                  marginLeft: 'auto',
                  width: 44,
                  height: 22,
                  background: shadowMode ? 'rgba(155,111,255,0.3)' : 'var(--bg-overlay)',
                  border: `1px solid ${shadowMode ? 'rgba(155,111,255,0.5)' : 'var(--border-default)'}`,
                  borderRadius: 11,
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
              >
                <div style={{
                  width: 16,
                  height: 16,
                  background: shadowMode ? '#9b6fff' : 'var(--text-muted)',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: 2,
                  left: shadowMode ? 24 : 2,
                  transition: 'left 0.2s ease',
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* AI Provider */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bot size={14} style={{ color: 'var(--text-muted)' }} />
              <span className="card-title">AI Copilot Provider</span>
            </div>
          </div>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {([
                { id: 'ollama' as const, label: 'Local Ollama', sub: 'No data leaves your environment', disabled: false },
                { id: 'external' as const, label: 'External Provider', sub: 'Requires explicit permission', disabled: true },
                { id: 'none' as const, label: 'Disabled', sub: 'No AI features', disabled: false },
              ]).map(p => (
                <div
                  key={p.id}
                  onClick={() => !p.disabled && setAiProvider(p.id)}
                  style={{
                    flex: 1,
                    background: aiProvider === p.id ? 'var(--bg-overlay)' : 'var(--bg-elevated)',
                    border: `1px solid ${aiProvider === p.id ? 'var(--accent)' : 'var(--border-default)'}`,
                    borderRadius: 6,
                    padding: '10px 12px',
                    cursor: p.disabled ? 'not-allowed' : 'pointer',
                    opacity: p.disabled ? 0.5 : 1,
                    transition: 'all 0.12s ease',
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>{p.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.sub}</div>
                </div>
              ))}
            </div>

            {aiProvider === 'ollama' && (
              <div style={{ background: 'rgba(45, 217, 138, 0.06)', border: '1px solid rgba(45, 217, 138, 0.15)', borderRadius: 6, padding: '10px 14px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <Shield size={13} style={{ color: 'var(--green)', flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--green-text)', marginBottom: 3 }}>No source code leaves your environment.</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Local Ollama mode processes all AI requests on your infrastructure.
                    Auracle sends only structured evidence records to the model — never raw source code.
                  </div>
                </div>
              </div>
            )}

            {aiProvider === 'external' && (
              <div className="warn-box">
                <AlertCircle size={13} style={{ color: 'var(--yellow)', flexShrink: 0 }} />
                External provider requires explicit permission per repository. Source code will not be transmitted without confirmation.
              </div>
            )}

            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 3 }}>Model</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>llama3.2:latest (localhost:11434)</div>
            </div>
          </div>
        </div>

        {/* Quality Gate Policy */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={14} style={{ color: 'var(--text-muted)' }} />
              <span className="card-title">Quality Gate Policy</span>
            </div>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {([
                { id: 'strict', label: 'Strict', desc: 'Any gap or failure → FAIL' },
                { id: 'standard', label: 'Standard', desc: 'Material gaps or failures → FAIL' },
                { id: 'advisory', label: 'Advisory', desc: 'Gate is informational only' },
              ] as const).map(p => (
                <div
                  key={p.id}
                  onClick={() => setGatePolicy(p.id)}
                  style={{
                    flex: 1,
                    background: gatePolicy === p.id ? 'var(--bg-overlay)' : 'var(--bg-elevated)',
                    border: `1px solid ${gatePolicy === p.id ? 'var(--accent)' : 'var(--border-default)'}`,
                    borderRadius: 6,
                    padding: '8px 10px',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease',
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{p.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Current policy (Standard): Any failed selected test OR unresolved material coverage gap blocks the PR. Changed-code coverage below 80% triggers review required.
            </div>
          </div>
        </div>

        {/* Audit */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Cpu size={14} style={{ color: 'var(--text-muted)' }} />
              <span className="card-title">Audit Logging & Retention</span>
            </div>
            <span className="badge badge-pass">Enabled</span>
          </div>
          <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Evidence retention', value: '90 days' },
              { label: 'Model version logged', value: 'Yes' },
              { label: 'Selection reasons stored', value: 'Per test' },
              { label: 'Gate decisions recorded', value: 'All' },
              { label: 'Audit log format', value: 'JSON lines (local)' },
              { label: 'External audit export', value: 'Disabled' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.label}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
