import React, { useState, useRef, useEffect } from 'react';
import { copilotService } from '../../services/copilotService';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ArrowRight,
  HelpCircle,
  TrendingUp,
  Scale,
  GraduationCap
} from 'lucide-react';

export function FacultyCopilotDrawer({ isOpen, onClose, onNavigate }) {
  const [messages, setMessages] = useState([
    {
      sender: 'copilot',
      title: 'NEXUS Intelligence Online',
      summary: 'Welcome! I am your AI academic operating copilot. Ask me about faculty workloads, student retention risks, recruitment candidate evaluations, or institutional priorities.',
      bullets: [],
      recommendation: 'Click any suggested query below or type your custom operational question.'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const suggested = copilotService.getSuggestedQueries();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = async (queryText) => {
    const text = queryText || inputQuery;
    if (!text.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const response = await copilotService.askCopilot(text);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'copilot',
          ...response
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (actionName) => {
    onClose();
    if (actionName.includes('Allocation') || actionName.includes('Workload')) {
      onNavigate('workload');
    } else if (actionName.includes('Student')) {
      onNavigate('students');
    } else if (actionName.includes('Recruit') || actionName.includes('Candidate')) {
      onNavigate('recruit');
    } else {
      onNavigate('command-center');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 10000,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 'min(480px, 100%)',
          height: '100%',
          background: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'pageEnter 0.3s var(--ease)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(90deg, rgba(0, 169, 224, 0.1), rgba(124, 58, 237, 0.1))'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
                display: 'grid',
                placeItems: 'center',
                color: '#fff',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
                NEXUS Intelligence
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--cyan)' }}>
                Deterministic Institutional Copilot
              </span>
            </div>
          </div>

          <button onClick={onClose} className="icon-btn" style={{ width: 30, height: 30 }}>
            <X size={16} />
          </button>
        </div>

        {/* Message Log */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map((m, idx) => {
            if (m.sender === 'user') {
              return (
                <div key={idx} style={{ alignSelf: 'flex-end', maxWidth: '85%', background: 'linear-gradient(135deg, var(--blue-dark), var(--blue))', color: '#fff', padding: '10px 14px', borderRadius: '16px 16px 4px 16px', fontSize: '13px' }}>
                  {m.text}
                </div>
              );
            }

            return (
              <div
                key={idx}
                style={{
                  alignSelf: 'flex-start',
                  maxWidth: '92%',
                  background: 'rgba(15, 25, 45, 0.85)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '16px 16px 16px 4px',
                  padding: '14px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {m.title && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, color: 'var(--cyan)', fontWeight: 800, fontSize: '13px' }}>
                    <Bot size={15} />
                    <span>{m.title}</span>
                  </div>
                )}

                <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-main)', lineHeight: 1.45 }}>
                  {m.summary}
                </p>

                {m.bullets && m.bullets.length > 0 && (
                  <div style={{ margin: '8px 0', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {m.bullets.map((b, i) => (
                      <div key={i}>{b}</div>
                    ))}
                  </div>
                )}

                {m.recommendation && (
                  <div style={{ marginTop: 8, padding: '8px 10px', background: 'rgba(0, 169, 224, 0.08)', borderRadius: '6px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    <b>Recommendation:</b> {m.recommendation}
                  </div>
                )}

                {m.action && (
                  <button
                    onClick={() => handleActionClick(m.action)}
                    className="btn-secondary"
                    style={{ marginTop: 10, padding: '5px 10px', fontSize: '11.5px' }}
                  >
                    {m.action} →
                  </button>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div style={{ alignSelf: 'flex-start', background: 'rgba(15, 25, 45, 0.85)', padding: '10px 14px', borderRadius: '16px', fontSize: '12px', color: 'var(--cyan)' }}>
              Analyzing live academic records...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Queries */}
        <div style={{ padding: '10px 18px', borderTop: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.15)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
            Quick Inquiries:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {suggested.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(q)}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 10px',
                  color: 'var(--text-muted)',
                  fontSize: '11px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{ padding: '14px 18px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 8, background: 'var(--bg-surface)' }}
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask NEXUS Copilot anything..."
            className="form-input"
            style={{ fontSize: '13px' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '0 16px' }}>
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
