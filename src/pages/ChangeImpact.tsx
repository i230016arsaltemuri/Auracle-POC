import { useState } from 'react'
import { IMPACT_GRAPH_NODES, IMPACT_GRAPH_EDGES } from '../data/mockData'

export default function ChangeImpact() {
  const [selectedNode, setSelectedNode] = useState<string | null>('PaymentService.refund')
  const [viewMode, setViewMode] = useState<'list' | 'graph'>('graph')

  const node = IMPACT_GRAPH_NODES.find(n => n.id === selectedNode)
  const relatedEdges = IMPACT_GRAPH_EDGES.filter(e => e.source === selectedNode || e.target === selectedNode)

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Change Impact</h1>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          PR #184 · commit a92f31e · 17 affected functions · 42 relevant tests
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, background: 'var(--border-subtle)', borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
        {[
          { label: 'Files Changed', value: '8', color: '' },
          { label: 'Functions Affected', value: '17', color: '' },
          { label: 'Relevant Tests', value: '42', color: 'blue' },
          { label: 'Direct Relationships', value: '5', color: '' },
          { label: 'Impact Depth', value: '3 hops', color: '' },
        ].map((m, i) => (
          <div key={i} className="metric-card" style={{ padding: '10px 14px' }}>
            <div className="metric-label">{m.label}</div>
            <div className={`metric-value ${m.color}`} style={{ fontSize: 18 }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* View toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <div className="filter-bar">
          <div className={`filter-option${viewMode === 'graph' ? ' active' : ''}`} onClick={() => setViewMode('graph')}>Graph View</div>
          <div className={`filter-option${viewMode === 'list' ? ' active' : ''}`} onClick={() => setViewMode('list')}>List View</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        {/* Graph / List */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Impact Map — acme/payments-api · PR #184</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <span className="badge badge-blue">● Changed</span>
              <span className="badge badge-green">◯ Test</span>
              <span className="badge badge-muted">◯ Function</span>
            </div>
          </div>
          <div style={{ position: 'relative', height: 540, background: '#080a0f', margin: 1, borderRadius: 6, overflow: 'hidden' }}>
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              {IMPACT_GRAPH_EDGES.map((edge, i) => {
                const src = IMPACT_GRAPH_NODES.find(n => n.id === edge.source)
                const tgt = IMPACT_GRAPH_NODES.find(n => n.id === edge.target)
                if (!src || !tgt) return null
                const isHighlighted = selectedNode && (edge.source === selectedNode || edge.target === selectedNode)
                return (
                  <g key={i}>
                    <line
                      x1={src.x + 70} y1={src.y + 14}
                      x2={tgt.x + 70} y2={tgt.y + 14}
                      stroke={isHighlighted ? '#4f7fff' : '#252b3b'}
                      strokeWidth={isHighlighted ? 2 : 1}
                      strokeDasharray={edge.type === 'historically_associated' ? '5,5' : edge.type === 'covered_by' ? '3,3' : 'none'}
                      opacity={selectedNode && !isHighlighted ? 0.15 : 1}
                    />
                    {/* Arrow */}
                    {isHighlighted && (
                      <polygon
                        points={`0,-4 8,0 0,4`}
                        transform={`translate(${tgt.x + 70},${tgt.y + 14}) rotate(${Math.atan2(tgt.y - src.y, tgt.x - src.x) * 180 / Math.PI})`}
                        fill="#4f7fff"
                        opacity={0.6}
                      />
                    )}
                  </g>
                )
              })}
            </svg>

            {IMPACT_GRAPH_NODES.map((n) => {
              const isSelected = selectedNode === n.id
              const isRelated = IMPACT_GRAPH_EDGES.some(e => (e.source === selectedNode && e.target === n.id) || (e.target === selectedNode && e.source === n.id))
              const isDim = selectedNode && !isSelected && !isRelated

              return (
                <div
                  key={n.id}
                  onClick={() => setSelectedNode(isSelected ? null : n.id)}
                  title={n.id}
                  style={{
                    position: 'absolute',
                    left: n.x,
                    top: n.y,
                    background: n.type === 'test' ? (n.result === 'FAIL' ? 'rgba(240,68,56,0.15)' : 'rgba(45,217,138,0.1)') : n.changed ? 'rgba(79,127,255,0.15)' : '#0e1117',
                    border: `1px solid ${isSelected ? '#4f7fff' : n.type === 'test' ? (n.result === 'FAIL' ? '#4a1515' : '#1a4a30') : n.changed ? '#2a4499' : '#252b3b'}`,
                    borderRadius: 6,
                    padding: '5px 10px',
                    fontSize: 10.5,
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                    color: n.type === 'test' ? (n.result === 'FAIL' ? 'var(--red-text)' : 'var(--green-text)') : n.changed ? 'var(--blue-text)' : '#8892a4',
                    zIndex: isSelected ? 10 : 1,
                    opacity: isDim ? 0.2 : 1,
                    transition: 'all 0.12s ease',
                    boxShadow: isSelected ? '0 0 0 2px rgba(79,127,255,0.35)' : 'none',
                    maxWidth: 150,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {n.type === 'test' && n.result === 'FAIL' && '✗ '}
                  {n.type === 'test' && n.result === 'PASS' && '✓ '}
                  {n.changed && n.type !== 'test' && <span style={{ color: 'var(--accent)', marginRight: 3 }}>●</span>}
                  {n.id.includes('.') ? n.id.split('.').slice(-1)[0] : n.id}
                </div>
              )
            })}

            {/* Edge type legend */}
            <div style={{ position: 'absolute', bottom: 10, left: 10, fontSize: 9.5, color: '#5a6478', display: 'flex', gap: 14, background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: 4 }}>
              <span>──── calls/raises</span>
              <span style={{ borderBottom: '1px dashed #5a6478', paddingBottom: 2 }}>- - coverage/history</span>
            </div>
          </div>
        </div>

        {/* Inspector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card">
            <div className="card-header"><span className="card-title">Node Inspector</span></div>
            {selectedNode && node ? (
              <div style={{ padding: 14 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-primary)', marginBottom: 8, wordBreak: 'break-all' }}>{node.id}</div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                  <span className={`badge badge-${node.type === 'test' ? 'green' : 'blue'}`}>{node.type}</span>
                  {node.changed && <span className="badge badge-blue">changed</span>}
                  {node.result && <span className={`badge badge-${node.result === 'FAIL' ? 'fail' : 'pass'}`}>{node.result}</span>}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>File</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--blue-text)', marginBottom: 12 }}>{node.file}</div>

                {relatedEdges.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Relationships ({relatedEdges.length})</div>
                    {relatedEdges.map((edge, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedNode(edge.source === selectedNode ? edge.target : edge.source)}
                        style={{ fontSize: 11, color: 'var(--text-secondary)', padding: '5px 8px', marginBottom: 2, background: 'var(--bg-base)', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                      >
                        <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>
                          {edge.source === selectedNode ? '→' : '←'}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue-text)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {(edge.source === selectedNode ? edge.target : edge.source).split('.').pop()}
                        </span>
                        <span style={{ fontSize: 9, color: 'var(--text-muted)', fontStyle: 'italic' }}>{edge.type.replace(/_/g, ' ')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                Click a node to inspect relationships
              </div>
            )}
          </div>

          {/* Signal types */}
          <div className="card">
            <div className="card-header"><span className="card-title">TIA Signal Breakdown</span></div>
            <div style={{ padding: '12px 14px' }}>
              {[
                { label: 'A — Direct dependency', signal: 'changed_fn → test', count: 5, weight: '30%' },
                { label: 'B — Coverage relationship', signal: 'changed_line → test covered it', count: 8, weight: '25%' },
                { label: 'C — Dependency chain', signal: 'changed_module → dependent → test', count: 4, weight: '20%' },
                { label: 'D — Historical association', signal: 'changed_file + test correlated', count: 3, weight: '15%' },
                { label: 'E — Runtime traces', signal: 'observed_path → test', count: 2, weight: '10%' },
              ].map((s, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-primary)' }}>{s.label}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{s.count} tests</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>{s.signal}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div className="cov-bar-track" style={{ flex: 1 }}>
                      <div className="cov-bar-fill" style={{ width: s.weight, background: 'var(--accent)' }} />
                    </div>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', width: 28 }}>{s.weight}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
