import { useState, useRef, useEffect } from 'react'
import { COPILOT_CONVERSATIONS, EVIDENCE_LEDGER } from '../data/mockData'
import { Bot, Send, AlertCircle, X } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
  evidenceIds?: string[]
  timestamp: Date
}

const SUGGESTED_PROMPTS = [
  'Why did Auracle select test_refund_failure?',
  'Why is PR #184 high risk?',
  'What testing gap remains?',
  'Show me the evidence behind the gate.',
]

export default function Copilot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      content: 'I can explain Auracle\'s analysis of PR #184 using structured evidence. Ask about test selection, risk factors, coverage gaps, or the quality gate decision.\n\n**Important:** I only explain evidence that Auracle produced. I do not invent test results, coverage data, or selection decisions.',
      evidenceIds: [],
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getAnswer = (question: string): { content: string, evidenceIds: string[] } => {
    const q = question.toLowerCase()
    const conv = COPILOT_CONVERSATIONS.find(c =>
      q.includes('select') && q.includes('refund_failure') ? c.id === 'q1' :
      q.includes('risk') || q.includes('high') ? c.id === 'q2' :
      q.includes('gap') ? c.id === 'q3' :
      q.includes('evidence') || q.includes('gate') ? c.id === 'q4' :
      false
    ) || COPILOT_CONVERSATIONS.find(c =>
      q.includes('select') ? c.id === 'q1' :
      q.includes('risk') ? c.id === 'q2' :
      q.includes('gap') ? c.id === 'q3' :
      c.id === 'q4'
    )

    if (conv) {
      return { content: conv.answer, evidenceIds: conv.evidenceIds }
    }

    // Fallback
    return {
      content: `I can answer questions about PR #184's analysis. Based on the structured evidence Auracle produced, I can explain:

- **Why test_refund_failure was selected** — high impact score (0.96), direct coverage relationship, prior failure history
- **Why risk is HIGH** — one selected test failed, one material coverage gap remains  
- **What gap remains** — retry exhaustion branch (lines 159-167) is uncovered
- **How the gate decision was made** — traceable evidence chain from CHG-184-01 to GATE-184-14

I cannot explain things Auracle did not observe or predict. Try one of the suggested prompts.`,
      evidenceIds: ['GATE-184-14']
    }
  }

  const sendMessage = (text: string) => {
    if (!text.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const { content, evidenceIds } = getAnswer(text)
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content,
        evidenceIds,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMsg])
      setIsTyping(false)
    }, 1200 + Math.random() * 800)
  }

  const evidenceRecord = selectedEvidence ? EVIDENCE_LEDGER.find(e => e.id === selectedEvidence) : null

  const renderContent = (content: string) => {
    // Simple markdown-like rendering
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={i} style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{line.replace(/\*\*/g, '')}</div>
      }
      if (line.startsWith('- ')) {
        return <div key={i} style={{ paddingLeft: 16, marginBottom: 3, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 4, color: 'var(--accent)' }}>·</span>
          {line.slice(2).replace(/\*\*(.*?)\*\*/g, '$1')}
        </div>
      }
      if (!line) return <div key={i} style={{ height: 8 }} />

      // Inline bold
      const parts = line.split(/(\*\*.*?\*\*)/g)
      return (
        <div key={i} style={{ marginBottom: 3 }}>
          {parts.map((part, j) =>
            part.startsWith('**') && part.endsWith('**')
              ? <span key={j} style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{part.slice(2, -2)}</span>
              : <span key={j}>{part}</span>
          )}
        </div>
      )
    })
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{ width: 28, height: 28, background: 'var(--purple-dim)', border: '1px solid rgba(155,111,255,0.3)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={15} style={{ color: '#c9a8ff' }} />
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>AI Copilot</h1>
          <span className="badge badge-purple">Evidence-Grounded</span>
        </div>
        <div className="warn-box">
          <AlertCircle size={13} style={{ color: 'var(--yellow)', flexShrink: 0, marginTop: 1 }} />
          <div>
            <strong style={{ color: 'var(--yellow-text)' }}>Copilot explains structured Auracle evidence.</strong>{' '}
            It does not create execution or coverage facts. Every answer cites evidence IDs traceable to observed facts or labeled model predictions.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 0 }}>
        {/* Chat */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {messages.map((msg) => (
              <div key={msg.id} className="chat-message">
                <div className="chat-user">
                  <div className={`chat-avatar ${msg.role}`}>
                    {msg.role === 'user' ? 'MC' : <Bot size={12} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                      {msg.role === 'user' ? 'Maya Chen' : 'Auracle Copilot'} · {msg.timestamp.toLocaleTimeString()}
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                      {renderContent(msg.content)}
                    </div>
                    {msg.evidenceIds && msg.evidenceIds.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                        {msg.evidenceIds.map(id => (
                          <div
                            key={id}
                            className="evidence-chip"
                            onClick={() => setSelectedEvidence(selectedEvidence === id ? null : id)}
                          >
                            📋 {id}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-message">
                <div className="chat-user">
                  <div className="chat-avatar ai"><Bot size={12} /></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 4 }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[0, 1, 2].map(i => (
                        <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--purple)', opacity: 0.6, animation: `pulse-dot 1.2s ease ${i * 0.2}s infinite` }} />
                      ))}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Retrieving evidence...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested prompts */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 12, marginTop: 8 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>Suggested questions for PR #184</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {SUGGESTED_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  className="btn btn-secondary"
                  onClick={() => sendMessage(p)}
                  style={{ fontSize: 11, padding: '4px 10px' }}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                placeholder="Ask about PR #184 analysis, test selection, risk, or evidence..."
                style={{
                  flex: 1,
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  fontSize: 13,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
              />
              <button
                className="btn btn-primary"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
                style={{ opacity: !input.trim() || isTyping ? 0.5 : 1 }}
              >
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Evidence panel */}
        {evidenceRecord && (
          <div className="card" style={{ width: 320, flexShrink: 0, height: 'fit-content', maxHeight: '100%', overflowY: 'auto' }}>
            <div className="card-header">
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>{evidenceRecord.id}</div>
                <span className={`badge ${evidenceRecord.type === 'OBSERVED_FACT' ? 'badge-blue' : 'badge-purple'}`} style={{ fontSize: 9, marginTop: 4 }}>
                  {evidenceRecord.type}
                </span>
              </div>
              <button className="btn btn-ghost" onClick={() => setSelectedEvidence(null)}>
                <X size={13} />
              </button>
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ marginBottom: 10 }}>
                {[
                  { label: 'Source', value: evidenceRecord.source },
                  { label: 'Revision', value: evidenceRecord.revision },
                  { label: 'Timestamp', value: evidenceRecord.timestamp },
                  { label: 'Category', value: evidenceRecord.category },
                ].map((row, i) => (
                  <div key={i} style={{ marginBottom: 6 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 1 }}>{row.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{row.value}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Fact</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.65, background: 'var(--bg-base)', padding: 8, borderRadius: 5, border: '1px solid var(--border-subtle)' }}>
                  {evidenceRecord.fact}
                </div>
              </div>
              {evidenceRecord.linkedEvidence.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Linked Evidence</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {evidenceRecord.linkedEvidence.map(id => (
                      <div key={id} className="evidence-chip" onClick={() => setSelectedEvidence(id)}>{id}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
