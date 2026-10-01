import { useDemo } from '../context/DemoScenarioContext';
import { CheckCircle, Clock, GitMerge, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Execution() {
  const { phase, setPhase } = useDemo();
  const navigate = useNavigate();

  const handleMerge = () => {
    setPhase('MERGED');
    navigate('/github/pr/184');
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Execution Run</h1>
      
      {phase !== 'EXECUTED' && phase !== 'MERGED' ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 20 }}>
          <Loader size={48} color="var(--accent)" className="spin" />
          <h2 style={{ fontSize: 18, color: 'var(--text-primary)' }}>Executing Regression Plan...</h2>
          <p style={{ color: 'var(--text-secondary)' }}>This may take a few minutes depending on the runner.</p>
        </div>
      ) : (
        <>
          <div className="gate-banner pass" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckCircle size={18} style={{ color: 'var(--green)', flexShrink: 0 }} />
              <div>
                <div className="gate-banner-title">GATE PASSED</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  All 25 tests in the regression plan passed, including the generated candidate. The material testing gap is resolved.
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <span className="card-title">Execution Logs</span>
              <div style={{ display: 'flex', gap: 16 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} /> 4m 14s
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>ubuntu-latest</span>
              </div>
            </div>
            <div style={{ background: '#0d1117', padding: 16, fontFamily: 'var(--font-mono)', fontSize: 13, color: '#c9d1d9', overflowX: 'auto' }}>
              <pre style={{ margin: 0 }}>
{`pytest 8.3.3 — running 25 selected tests
Coverage: payments/ (target: branch+line)

tests/test_refund.py::test_refund_raises_after_retry_exhaustion PASSED [  4%]
tests/test_refund.py::test_refund_success PASSED                         [  8%]
tests/test_refund.py::test_refund_failure PASSED                         [ 12%]
tests/test_payment_api.py::test_payment_api PASSED                       [ 16%]
tests/test_gateway.py::test_gateway_timeout PASSED                       [ 20%]
tests/test_tax.py::test_tax_calculation PASSED                           [ 24%]
...

============================= 25 passed in 4m 14s ==============================`}
              </pre>
            </div>
          </div>

          {phase === 'EXECUTED' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-demo" onClick={handleMerge} style={{ padding: '10px 20px', fontSize: 14 }}>
                <GitMerge size={16} /> Merge Pull Request
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
