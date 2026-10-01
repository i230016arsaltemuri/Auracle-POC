import { useState } from 'react';
import { useDemo } from '../context/DemoScenarioContext';
import { SELECTED_TESTS } from '../data/mockData';
import { Check, XCircle, Play, Loader, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RegressionPlan() {
  const { phase, candidate, setPhase } = useDemo();
  const navigate = useNavigate();
  const [isExecuting, setIsExecuting] = useState(false);

  const tests = [...SELECTED_TESTS.slice(0, 24)];
  
  if (phase === 'CANDIDATE_ACCEPTED' || phase === 'EXECUTED' || phase === 'MERGED') {
    if (candidate) {
      tests.unshift({
        rank: 0,
        id: candidate.id,
        name: candidate.name,
        file: 'tests/unit/payments/test_refund.py',
        impactScore: 1.0,
        failureProbability: 1.0,
        selected: true,
        result: phase === 'EXECUTED' || phase === 'MERGED' ? 'PASS' : null,
        duration: '0.12s',
        durationMs: 120,
        reasons: ['Generated Candidate to resolve Material Testing Gap'],
        coverageRelationship: 'direct',
        historicalRelationship: 'new test',
        modelVersion: 'v0.6.3',
        healthSignal: 'new'
      } as any);
    }
  }

  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setPhase('EXECUTED');
      navigate('/execution');
    }, 2000);
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Regression Plan</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            This plan contains {tests.length} tests required to validate your change with high confidence.
          </p>
        </div>
        
        {(phase === 'CANDIDATE_ACCEPTED' || phase === 'EXECUTED' || phase === 'MERGED') && phase !== 'EXECUTED' && phase !== 'MERGED' && (
          <button 
            className="btn btn-demo" 
            onClick={handleExecute}
            disabled={isExecuting}
            style={{ padding: '10px 20px', fontSize: 14 }}
          >
            {isExecuting ? (
              <><Loader size={16} className="spin" /> Sending to CI...</>
            ) : (
              <><Play size={16} /> Execute Plan</>
            )}
          </button>
        )}
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="card-title">Plan Composition</span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Estimated Execution Time: 4m 14s</span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border-subtle)' }}>
          <div style={{ padding: '16px', background: 'var(--bg-surface)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Auracle Selected Tests</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--blue-text)' }}>24</div>
          </div>
          <div style={{ padding: '16px', background: 'var(--bg-surface)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Generated Candidates</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: (phase === 'CANDIDATE_ACCEPTED' || phase === 'EXECUTED' || phase === 'MERGED') ? 'var(--accent)' : 'var(--text-muted)' }}>
              {(phase === 'CANDIDATE_ACCEPTED' || phase === 'EXECUTED' || phase === 'MERGED') ? 1 : 0}
            </div>
          </div>
          <div style={{ padding: '16px', background: 'var(--bg-surface)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Confidence Target</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>92%</div>
          </div>
        </div>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Test</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tests.map(test => (
              <tr key={test.id} style={{ background: test.id === candidate?.id ? 'var(--accent-glow)' : 'transparent' }}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {test.id === candidate?.id && <ShieldAlert size={14} color="var(--accent)" />}
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{test.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{test.file}</div>
                    </div>
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{test.reasons[0]}</td>
                <td>
                  {test.result === 'FAIL' ? (
                    <span className="badge badge-fail"><XCircle size={10} /> FAIL</span>
                  ) : test.result === 'PASS' ? (
                    <span className="badge badge-pass"><Check size={10} /> PASS</span>
                  ) : (
                    <span className="badge badge-unknown">PENDING</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
