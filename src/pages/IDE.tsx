// IDE inline view — shows what a dev would see in VS Code / PyCharm
import { CheckCircle, XCircle, Bot } from 'lucide-react'

const CODE_LINES = [
  { n: 120, t: '', c: 'class PaymentService:', cov: null, changed: false },
  { n: 121, t: '    ', c: '"""Core payment orchestrator."""', cov: null, changed: false },
  { n: 122, t: '    ', c: '', cov: null, changed: false },
  { n: 123, t: '    ', c: 'def refund(self, order_id: str, amount: Decimal,', cov: 'covered', changed: true },
  { n: 124, t: '    ', c: '                 *, max_retries: int = 3) -> RefundResult:', cov: 'covered', changed: true },
  { n: 125, t: '        ', c: '"""Process a refund with configurable retry logic."""', cov: 'covered', changed: false },
  { n: 126, t: '        ', c: 'guard = RefundGuard(order_id, amount)', cov: 'covered', changed: true },
  { n: 127, t: '        ', c: 'if not guard.acquire():', cov: 'covered', changed: false },
  { n: 128, t: '            ', c: 'raise DuplicateRefundError(order_id)', cov: 'covered', changed: false },
  { n: 129, t: '        ', c: '', cov: null, changed: false },
  { n: 130, t: '        ', c: 'retries = 0', cov: 'covered', changed: true },
  { n: 131, t: '        ', c: 'last_exc: Exception | None = None', cov: 'covered', changed: true },
  { n: 132, t: '        ', c: '', cov: null, changed: false },
  { n: 133, t: '        ', c: 'while retries <= max_retries:', cov: 'covered', changed: true },
  { n: 134, t: '            ', c: 'try:', cov: 'covered', changed: false },
  { n: 135, t: '                ', c: 'result = self._gateway.process_refund(order_id, amount)', cov: 'covered', changed: false },
  { n: 136, t: '                ', c: 'self._ledger.record(order_id, amount, result)', cov: 'covered', changed: false },
  { n: 137, t: '                ', c: 'return RefundResult(success=True, transaction_id=result.id)', cov: 'covered', changed: false },
  { n: 138, t: '            ', c: 'except TransientGatewayError as exc:', cov: 'covered', changed: true },
  { n: 139, t: '                ', c: 'last_exc = exc', cov: 'covered', changed: true },
  { n: 140, t: '                ', c: 'retries += 1', cov: 'covered', changed: true },
  { n: 141, t: '                ', c: '', cov: null, changed: false },
  { n: 142, t: '        ', c: '# === All retries exhausted — lines below uncovered ===', cov: null, changed: true },
  { n: 143, t: '        ', c: 'raise RetryExhaustedException(', cov: 'uncovered', changed: true },
  { n: 144, t: '            ', c: '    f"Refund for {order_id} failed after {max_retries} retries."', cov: 'uncovered', changed: true },
  { n: 145, t: '        ', c: ') from last_exc', cov: 'uncovered', changed: true },
]

export default function IDE() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>IDE Integration View</h1>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          What a developer sees inline in VS Code or PyCharm with the Auracle extension active.
        </div>
      </div>

      {/* Gutter notification bar */}
      <div style={{
        background: 'rgba(240, 68, 56, 0.08)',
        border: '1px solid rgba(240, 68, 56, 0.3)',
        borderRadius: 8,
        padding: '10px 14px',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }}>
        <XCircle size={15} style={{ color: 'var(--red)' }} />
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 600, fontSize: 12, color: 'var(--red-text)' }}>Auracle · PR #184 · GATE: FAIL</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 10 }}>
            1 test FAILED · 1 coverage gap (lines 143-145) · Click for full report
          </span>
        </div>
        <button className="btn btn-danger" style={{ fontSize: 11 }}>View Report</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        {/* Code editor */}
        <div>
          <div className="code-viewer">
            <div className="code-viewer-header">
              <div style={{ display: 'flex', gap: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28ca41' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>payments/service.py</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>feat/refund-retry-policy</span>
            </div>

            {CODE_LINES.map((line, i) => (
              <div
                key={i}
                className={`code-line${line.cov === 'covered' ? ' covered' : line.cov === 'uncovered' ? ' uncovered' : ''}`}
                style={{ background: line.changed && !line.cov ? 'rgba(79,127,255,0.04)' : undefined }}
              >
                <div className="code-line-number">{line.n}</div>
                <div className="code-line-gutter" style={{ width: 28 }}>
                  {line.cov === 'covered' && <div className="coverage-dot covered" />}
                  {line.cov === 'uncovered' && <div className="coverage-dot uncovered" />}
                  {line.changed && !line.cov && <div style={{ width: 3, height: 16, background: 'var(--accent-dim)', borderRadius: 1 }} />}
                </div>
                <div className="code-line-content" style={{ color: line.cov === 'uncovered' ? '#ff9999' : undefined }}>
                  {line.changed && <span style={{ color: 'rgba(79,127,255,0.5)', marginRight: 2, fontSize: 10 }}>+</span>}
                  {line.c || ' '}
                </div>
                {line.n === 143 && (
                  <div style={{
                    position: 'absolute',
                    right: 8,
                    background: 'var(--red-dim)',
                    border: '1px solid #4a1515',
                    borderRadius: 4,
                    padding: '1px 6px',
                    fontSize: 10,
                    color: 'var(--red-text)',
                    fontFamily: 'var(--font-mono)',
                    zIndex: 10,
                    pointerEvents: 'none'
                  }}>
                    ⚠ MATERIAL GAP · Evidence: COV-184-12
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Side panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Auracle Copilot mini */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Bot size={13} style={{ color: '#c9a8ff' }} />
                <span className="card-title">Auracle Copilot</span>
              </div>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 10 }}>
                The retry exhaustion branch (lines 143-145) has zero coverage after all 24 selected tests executed.{' '}
                <span style={{ color: 'var(--yellow-text)' }}>RetryExhaustedException</span> is raised here, but no test exercises this path.
              </div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                <div className="evidence-chip">COV-184-12</div>
                <div className="evidence-chip">GATE-184-14</div>
              </div>
            </div>
          </div>

          {/* Quick test results */}
          <div className="card">
            <div className="card-header"><span className="card-title">Selected Tests</span></div>
            <div style={{ padding: 0 }}>
              {[
                { name: 'test_refund_failure', result: 'FAIL', reason: 'Direct · exc before return' },
                { name: 'test_refund_success', result: 'PASS', reason: 'Direct coverage' },
                { name: 'test_refund_duplicate', result: 'PASS', reason: 'Guard logic' },
                { name: 'test_gateway_retry', result: 'PASS', reason: 'Retry loop' },
                { name: 'test_ledger_write', result: 'PASS', reason: 'Ledger path' },
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
                  {t.result === 'PASS'
                    ? <CheckCircle size={12} style={{ color: 'var(--green)', flexShrink: 0 }} />
                    : <XCircle size={12} style={{ color: 'var(--red)', flexShrink: 0 }} />
                  }
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: t.result === 'FAIL' ? 'var(--red-text)' : 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.name}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t.reason}</div>
                  </div>
                </div>
              ))}
              <div style={{ padding: '6px 12px', fontSize: 10, color: 'var(--text-muted)' }}>
                +19 more selected · 3 not-selected hidden
              </div>
            </div>
          </div>

          {/* Evidence in editor */}
          <div className="card">
            <div className="card-header"><span className="card-title">Quick Evidence</span></div>
            <div style={{ padding: '10px 12px' }}>
              {[
                { id: 'CHG-184-01', desc: 'Diff observed by Auracle', ok: true },
                { id: 'IMP-184-05', desc: '42 tests reachable via graph', ok: true },
                { id: 'PRED-184-09', desc: '24 tests selected (v0.6.3)', ok: true },
                { id: 'EXEC-184-11', desc: 'test_refund_failure FAILED', ok: false },
                { id: 'COV-184-12', desc: 'Retry branch uncovered', ok: false },
                { id: 'GATE-184-14', desc: 'Gate: FAIL', ok: false },
              ].map((e, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: e.ok ? 'var(--green)' : 'var(--red)', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', width: 100 }}>{e.id}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{e.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
