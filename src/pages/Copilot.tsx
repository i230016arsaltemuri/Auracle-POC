import { useState, useRef, useEffect } from 'react'
import { COPILOT_CONVERSATIONS, EVIDENCE_LEDGER } from '../data/mockData'
import { Bot, Send, X } from 'lucide-react'

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
    <div style={{ maxWidth: 1000, margin: '0 auto', height: '100%', padding: '24px 0', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, background: 'var(--purple-dim)', border: '1px solid rgba(155,111,255,0.3)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={20} style={{ color: '#c9a8ff' }} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Auracle Copilot</h1>
          <span className="badge badge-purple" style={{ fontSize: 11, padding: '4px 8px' }}>Evidence-Grounded AI</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Ask questions about PR #184's analysis, test selection, risks, and evidence.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, flex: 1, minHeight: 0 }}>
        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: 16, display: 'flex', flexDirection: 'column', gap: 32, paddingBottom: 24 }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', gap: 16, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: msg.role === 'user' ? 'var(--accent)' : 'var(--purple-dim)',
                  color: msg.role === 'user' ? '#0f172a' : '#c9a8ff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontWeight: 700, fontSize: 14,
                  border: msg.role === 'ai' ? '1px solid rgba(155,111,255,0.3)' : 'none',
                  boxShadow: msg.role === 'user' ? '0 2px 10px rgba(210, 243, 76, 0.2)' : 'none'
                }}>
                  {msg.role === 'user' ? 'MC' : <Bot size={18} />}
                </div>
                
                <div style={{
                  flex: 1,
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                    {msg.role === 'user' ? 'Ahmed' : 'Auracle'} · {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div style={{
                    fontSize: 15,
                    color: 'var(--text-primary)',
                    lineHeight: 1.6,
                    background: msg.role === 'user' ? 'var(--bg-elevated)' : 'transparent',
                    padding: msg.role === 'user' ? '14px 18px' : '0 4px',
                    borderRadius: 12,
                    border: msg.role === 'user' ? '1px solid var(--border-subtle)' : 'none',
                    textAlign: 'left'
                  }}>
                    {renderContent(msg.content)}
                  </div>
                  {msg.evidenceIds && msg.evidenceIds.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14, marginLeft: msg.role === 'ai' ? 4 : 0 }}>
                      {msg.evidenceIds.map(id => (
                        <div
                          key={id}
                          onClick={() => setSelectedEvidence(selectedEvidence === id ? null : id)}
                          style={{
                            padding: '4px 10px',
                            background: 'var(--bg-overlay)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 16,
                            fontSize: 12,
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontFamily: 'var(--font-mono)',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text-muted)'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
                        >
                          📋 {id}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', gap: 16, flexDirection: 'row' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'var(--purple-dim)', color: '#c9a8ff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, border: '1px solid rgba(155,111,255,0.3)'
                }}>
                  <Bot size={18} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 4px' }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--purple)', opacity: 0.6, animation: `pulse-dot 1.2s ease ${i * 0.2}s infinite` }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Retrieving evidence...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ paddingTop: 16, background: 'var(--bg-base)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Suggested questions</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {SUGGESTED_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(p)}
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-default)',
                    padding: '8px 12px',
                    borderRadius: 16,
                    fontSize: 12,
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  {p}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 16, padding: '8px 12px', transition: 'border-color 0.2s ease' }}
                 onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                 onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--border-default)'}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
                placeholder="Ask about PR #184 analysis, test selection, or evidence..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  padding: '8px 4px',
                  fontSize: 15,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                  resize: 'none',
                  minHeight: 44,
                  maxHeight: 120,
                  lineHeight: 1.5
                }}
                rows={1}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
                style={{
                  background: input.trim() && !isTyping ? 'var(--accent)' : 'var(--bg-overlay)',
                  color: input.trim() && !isTyping ? '#0f172a' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: input.trim() && !isTyping ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  marginBottom: 4
                }}
              >
                <Send size={16} style={{ marginLeft: -2 }} />
              </button>
            </div>
            <div style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: 'var(--text-muted)' }}>
              Auracle Copilot can make mistakes. Always review the evidence chain.
            </div>
          </div>
        </div>

        {/* Evidence panel */}
        {evidenceRecord && (
          <div className="card" style={{ width: 340, flexShrink: 0, height: 'fit-content', maxHeight: '100%', overflowY: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
            <div className="card-header" style={{ padding: '16px 20px' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{evidenceRecord.id}</div>
                <span className={`badge ${evidenceRecord.type === 'OBSERVED_FACT' ? 'badge-blue' : 'badge-purple'}`} style={{ fontSize: 10, marginTop: 6 }}>
                  {evidenceRecord.type.replace('_', ' ')}
                </span>
              </div>
              <button className="btn btn-ghost" onClick={() => setSelectedEvidence(null)} style={{ padding: 6 }}>
                <X size={16} />
              </button>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ marginBottom: 16 }}>
                {[
                  { label: 'Source System', value: evidenceRecord.source },
                  { label: 'Target Revision', value: evidenceRecord.revision },
                  { label: 'Recorded At', value: evidenceRecord.timestamp },
                  { label: 'Classification', value: evidenceRecord.category },
                ].map((row, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{row.label}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{row.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 24 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Assertion Fact</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, background: 'var(--bg-base)', padding: 12, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                  {evidenceRecord.fact}
                </div>
              </div>
              {evidenceRecord.linkedEvidence.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Supporting Evidence</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {evidenceRecord.linkedEvidence.map(id => (
                      <div key={id} onClick={() => setSelectedEvidence(id)} style={{ padding: '4px 10px', background: 'var(--bg-overlay)', border: '1px solid var(--border-default)', borderRadius: 16, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-mono)', transition: 'all 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text-muted)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}>
                        {id}
                      </div>
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
