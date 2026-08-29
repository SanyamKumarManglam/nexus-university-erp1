import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { reviewService } from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StarRating } from '../common/StarRating';
import {
  Star,
  User,
  GraduationCap,
  ShieldCheck,
  Send,
  Lock,
  MessageSquare,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export function TeacherStudentReviews() {
  const { currentUser } = useAuth();
  const toast = useToast();

  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [course, setCourse] = useState('Machine Learning (CS601)');
  const [pastReviews, setPastReviews] = useState([]);

  const [ratings, setRatings] = useState({
    academic: 4,
    participation: 4,
    attendance: 4,
    assignments: 4,
    overall: 4.0
  });

  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [privateNotes, setPrivateNotes] = useState('');

  const loadData = () => {
    const allStudents = studentService.getAllStudents();
    setStudents(allStudents);
    if (allStudents.length > 0 && !selectedStudentId) {
      setSelectedStudentId(allStudents[0].id);
    }
    setPastReviews(reviewService.getAllTeacherStudentReviews());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRatingChange = (field, val) => {
    setRatings((prev) => {
      const updated = { ...prev, [field]: val };
      const avg = Number(
        ((updated.academic + updated.participation + updated.attendance + updated.assignments) / 4).toFixed(1)
      );
      return { ...updated, overall: avg };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const student = students.find((s) => s.id === selectedStudentId);
    if (!student) {
      toast.error('Please select a student');
      return;
    }

    try {
      reviewService.addTeacherStudentReview({
        teacherId: currentUser?.id || 'T001',
        teacherName: currentUser?.name || 'Dr. Ananya Mehta',
        studentId: student.id,
        studentName: student.name,
        course,
        ratings,
        strengths,
        improvements,
        privateNotes
      });

      toast.success(`Review for ${student.name} saved! Student index updated.`);
      setStrengths('');
      setImprovements('');
      setPrivateNotes('');
      loadData();
    } catch (err) {
      toast.error('Failed to submit review');
    }
  };

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  return (
    <div>
      <div className="hero-banner">
        <div className="hero-content">
          <h2>Student Mentorship & Formative Reviews</h2>
          <p>
            Submit structured qualitative and quantitative evaluations to guide student development. Feedback directly enriches the student composite index while private notes remain confidential.
          </p>
        </div>
      </div>

      <div className="grid-2">
        {/* Left: Review Submission Form */}
        <div className="glass-card">
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 800 }}>
            Submit Student Evaluation
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Select Student *</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="form-select"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.rollNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Course / Context</label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g. Distributed Systems"
                  className="form-input"
                />
              </div>
            </div>

            {/* Structured Star Ratings */}
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="form-label" style={{ fontSize: '11.5px' }}>Academic Mastery (1–5)</label>
                  <StarRating
                    value={ratings.academic}
                    onChange={(v) => handleRatingChange('academic', v)}
                    size={20}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '11.5px' }}>Classroom Participation (1–5)</label>
                  <StarRating
                    value={ratings.participation}
                    onChange={(v) => handleRatingChange('participation', v)}
                    size={20}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '11.5px' }}>Attendance & Punctuality (1–5)</label>
                  <StarRating
                    value={ratings.attendance}
                    onChange={(v) => handleRatingChange('attendance', v)}
                    size={20}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '11.5px' }}>Assignment & Lab Quality (1–5)</label>
                  <StarRating
                    value={ratings.assignments}
                    onChange={(v) => handleRatingChange('assignments', v)}
                    size={20}
                  />
                </div>
              </div>

              <div style={{ marginTop: 12, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Computed Evaluation Rating:</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--cyan)' }}>
                  {ratings.overall} / 5.0 ★
                </span>
              </div>
            </div>

            {/* Qualitative Feedback */}
            <div className="form-group">
              <label className="form-label">Demonstrated Strengths (Visible to Student)</label>
              <textarea
                rows={2}
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                placeholder="Key conceptual strengths, practical lab skills..."
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Areas for Growth & Improvement (Visible to Student)</label>
              <textarea
                rows={2}
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                placeholder="Recommended focus areas, study habits..."
                className="form-textarea"
              />
            </div>

            {/* Confidential Teacher Notes */}
            <div className="form-group" style={{ background: 'rgba(124, 58, 237, 0.06)', border: '1px solid rgba(124, 58, 237, 0.25)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Lock size={14} style={{ color: 'var(--purple-light)' }} />
                <label className="form-label" style={{ color: 'var(--purple-light)', margin: 0 }}>
                  Private Teacher / Advisor Notes (Confidential — Hidden from Student)
                </label>
              </div>
              <textarea
                rows={2}
                value={privateNotes}
                onChange={(e) => setPrivateNotes(e.target.value)}
                placeholder="Confidential notes for advisors and administration only..."
                className="form-textarea"
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}>
              <Send size={15} /> Save & Submit Student Review
            </button>
          </form>
        </div>

        {/* Right: Recent Reviews Ledger */}
        <div className="glass-card">
          <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: 800 }}>
            Recent Mentorship Reviews ({pastReviews.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {pastReviews.map((rev) => (
              <div key={rev.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <div>
                    <b style={{ fontSize: '13px' }}>{rev.studentName}</b>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{rev.course} · By {rev.teacherName}</div>
                  </div>
                  <StarRating value={rev.ratings.overall} readOnly size={14} />
                </div>

                {rev.strengths && (
                  <p style={{ margin: '6px 0 0', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    <b>Strengths:</b> {rev.strengths}
                  </p>
                )}

                {rev.privateNotes && (
                  <div style={{ marginTop: 6, padding: '6px 8px', background: 'rgba(124, 58, 237, 0.08)', borderRadius: 6, fontSize: '11px', color: 'var(--purple-light)' }}>
                    <Lock size={11} style={{ display: 'inline', marginRight: 4 }} />
                    <b>Private Note:</b> {rev.privateNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
