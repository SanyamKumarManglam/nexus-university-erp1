import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, User, GraduationCap, Briefcase, Megaphone, ArrowRight } from 'lucide-react';
import { storageService } from '../../services/storageService';

export function GlobalSearchModal({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onNavigate(null, 'search-open');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNavigate]);

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return null;

    const q = query.toLowerCase().trim();
    const students = storageService.getStudents().filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.rollNumber.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q)
    );

    const faculty = storageService.getFaculty().filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.department.toLowerCase().includes(q) ||
        f.role.toLowerCase().includes(q)
    );

    const candidates = storageService.getCandidates().filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q) ||
        c.position.toLowerCase().includes(q)
    );

    const announcements = storageService.getAnnouncements().filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.message.toLowerCase().includes(q)
    );

    return { students, faculty, candidates, announcements };
  }, [query]);

  if (!isOpen) return null;

  const totalResults = results
    ? results.students.length + results.faculty.length + results.candidates.length + results.announcements.length
    : 0;

  const handleSelect = (navTab, item = null) => {
    onClose();
    if (onNavigate) {
      onNavigate(navTab, item);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="modal-card"
        style={{ maxWidth: '640px', padding: '0', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
          <Search size={20} style={{ color: 'var(--cyan)' }} />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students, faculty, candidates, announcements..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              fontSize: '15px'
            }}
          />
          <button onClick={onClose} className="icon-btn" style={{ width: 28, height: 28 }}>
            <X size={16} />
          </button>
        </div>

        {/* Results Area */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '16px 20px' }}>
          {!query.trim() && (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
              Type at least 2 characters to search across all university databases.
            </div>
          )}

          {results && totalResults === 0 && (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-dim)', fontSize: '13px' }}>
              No matching records found for "{query}".
            </div>
          )}

          {results && results.students.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--cyan)', letterSpacing: '0.8px', marginBottom: 8 }}>
                Students ({results.students.length})
              </div>
              {results.students.slice(0, 4).map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleSelect('students', s)}
                  className="insight-card"
                  style={{ cursor: 'pointer', padding: '10px 14px', marginBottom: 6 }}
                >
                  <GraduationCap size={18} style={{ color: 'var(--cyan)', marginTop: 2 }} />
                  <div style={{ flex: 1 }}>
                    <b style={{ fontSize: '13px' }}>{s.name}</b> · <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{s.rollNumber}</span>
                    <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      {s.program} ({s.department}) · Student Index: <b>{s.studentIndex}/100</b>
                    </p>
                  </div>
                  <ArrowRight size={15} style={{ color: 'var(--text-dim)' }} />
                </div>
              ))}
            </div>
          )}

          {results && results.faculty.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--purple-light)', letterSpacing: '0.8px', marginBottom: 8 }}>
                Faculty & Teachers ({results.faculty.length})
              </div>
              {results.faculty.slice(0, 4).map((f) => (
                <div
                  key={f.id}
                  onClick={() => handleSelect('faculty', f)}
                  className="insight-card"
                  style={{ cursor: 'pointer', padding: '10px 14px', marginBottom: 6 }}
                >
                  <User size={18} style={{ color: 'var(--purple-light)', marginTop: 2 }} />
                  <div style={{ flex: 1 }}>
                    <b style={{ fontSize: '13px' }}>{f.name}</b> · <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{f.role}</span>
                    <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      Department of {f.department} · {f.studentsAssigned} advisees ({f.workloadPercent}% load)
                    </p>
                  </div>
                  <ArrowRight size={15} style={{ color: 'var(--text-dim)' }} />
                </div>
              ))}
            </div>
          )}

          {results && results.candidates.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--green)', letterSpacing: '0.8px', marginBottom: 8 }}>
                Recruitment Candidates ({results.candidates.length})
              </div>
              {results.candidates.slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleSelect('recruit', c)}
                  className="insight-card"
                  style={{ cursor: 'pointer', padding: '10px 14px', marginBottom: 6 }}
                >
                  <Briefcase size={18} style={{ color: 'var(--green)', marginTop: 2 }} />
                  <div style={{ flex: 1 }}>
                    <b style={{ fontSize: '13px' }}>{c.name}</b> · <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{c.position}</span>
                    <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      Status: <b>{c.status}</b> · AI Suitability Match: <b>{c.matchScore}%</b>
                    </p>
                  </div>
                  <ArrowRight size={15} style={{ color: 'var(--text-dim)' }} />
                </div>
              ))}
            </div>
          )}

          {results && results.announcements.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--orange)', letterSpacing: '0.8px', marginBottom: 8 }}>
                Announcements ({results.announcements.length})
              </div>
              {results.announcements.slice(0, 3).map((a) => (
                <div
                  key={a.id}
                  onClick={() => handleSelect('announcements', a)}
                  className="insight-card"
                  style={{ cursor: 'pointer', padding: '10px 14px', marginBottom: 6 }}
                >
                  <Megaphone size={18} style={{ color: 'var(--orange)', marginTop: 2 }} />
                  <div style={{ flex: 1 }}>
                    <b style={{ fontSize: '13px' }}>{a.title}</b>
                    <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      Audience: {a.audience} · Priority: {a.priority}
                    </p>
                  </div>
                  <ArrowRight size={15} style={{ color: 'var(--text-dim)' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
