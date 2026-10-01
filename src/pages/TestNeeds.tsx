import { useState } from 'react';
import { useDemo } from '../context/DemoScenarioContext';
import { CheckCircle, AlertTriangle, Check, Loader } from 'lucide-react';

export default function TestNeeds() {
  const { phase, testNeed, candidate, setPhase, acceptCandidate } = useDemo();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setPhase('CANDIDATE_GENERATED');
    }, 2000);
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Test Needs</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
        Auracle identified {testNeed.resolved ? '0' : '1'} material testing gap based on your changes to <code style={{color: 'var(--accent)'}}>PaymentService.refund()</code>.
      </p>

      <div className="card" style={{ marginBottom: 24, borderLeft: testNeed.resolved ? '4px solid var(--green)' : '4px solid var(--red)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {testNeed.resolved ? <CheckCircle color="var(--green)" size={20} /> : <AlertTriangle color="var(--red)" size={20} />}
            <span style={{ fontSize: 16, fontWeight: 600 }}>{testNeed.title}</span>
            <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', background: 'var(--bg-overlay)', padding: '2px 6px', borderRadius: 4 }}>{testNeed.id}</span>
          </div>
          {testNeed.resolved ? (
            <span className="badge badge-pass">RESOLVED</span>
          ) : (
            <span className="badge badge-fail">UNCOVERED</span>
          )}
        </div>
        
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Reason</h3>
              <p style={{ fontSize: 14 }}>{testNeed.reason}</p>
            </div>
            <div>
              <h3 style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Target</h3>
              <p style={{ fontSize: 14, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{testNeed.target} (lines {testNeed.lines})</p>
            </div>
          </div>

          <div style={{ padding: 16, background: 'var(--bg-elevated)', borderRadius: 8, marginBottom: 20 }}>
            <h3 style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Expected Behavior Analysis</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <Check size={16} color="var(--green)" style={{ marginTop: 2 }} />
              <div>
                <span style={{ fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 4 }}>Status: {testNeed.expectedBehavior.toUpperCase()}</span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  Auracle has high confidence in the expected behavior based on PR description and function docstrings. 
                  The system expects <code style={{color: 'var(--text-primary)'}}>RetryExhaustedException</code> to be raised.
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {!testNeed.resolved && phase === 'ANALYSIS_REVIEW' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-demo" 
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader size={14} className="spin" /> Generating...
                  </>
                ) : (
                  <>
                    <BotIcon size={14} /> Generate Candidate Regression Test
                  </>
                )}
              </button>
            </div>
          )}

          {/* Candidate Evaluation UI */}
          {(phase === 'CANDIDATE_GENERATED' || phase === 'CANDIDATE_ACCEPTED' || phase === 'EXECUTED' || phase === 'MERGED') && candidate && (
            <div style={{ marginTop: 24, borderTop: '1px solid var(--border-subtle)', paddingTop: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <BotIcon size={16} color="var(--blue-text)" />
                Generated Candidate: <span style={{fontFamily: 'var(--font-mono)', fontWeight: 400}}>{candidate.name}</span>
              </h3>
              
              <div style={{ background: '#0d1117', padding: 16, borderRadius: 8, overflowX: 'auto', marginBottom: 16 }}>
                <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 13, color: '#c9d1d9' }}>
                  {candidate.code}
                </pre>
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
                {candidate.basedOn.map((source: string, i: number) => (
                  <span key={i} style={{ fontSize: 11, background: 'var(--bg-overlay)', padding: '4px 8px', borderRadius: 12, color: 'var(--text-secondary)' }}>
                    Based on: {source}
                  </span>
                ))}
              </div>

              {phase === 'CANDIDATE_GENERATED' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button className="btn btn-secondary">Reject / Edit</button>
                  <button className="btn btn-primary" onClick={acceptCandidate}>
                    <Check size={14} /> Accept Candidate
                  </button>
                </div>
              )}
              
              {(phase === 'CANDIDATE_ACCEPTED' || phase === 'EXECUTED' || phase === 'MERGED') && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--green)', fontSize: 13, fontWeight: 500 }}>
                  <CheckCircle size={16} /> Candidate Accepted by ahmeddev
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BotIcon({ size, color }: { size: number, color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8" />
      <rect x="4" y="8" width="16" height="12" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}
