import React, { useState, useEffect } from 'react';
import { facultyService } from '../../services/facultyService';
import { reviewService } from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StarRating } from '../common/StarRating';
import {
  Star,
  Send,
  User,
  Shield,
  MessageSquare,
  Sparkles,
  Lock
} from 'lucide-react';

export function TeacherReviewSubmission() {
  const { currentUser } = useAuth();
  const toast = useToast();

  const [facultyList, setFacultyList] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [course, setCourse] = useState('Machine Learning (CS601)');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [ratings, setRatings] = useState({
    clarity: 5,
    communication: 5,
    availability: 4,
    support: 5,
    overall: 4.8
  });

  const [feedback, setFeedback] = useState('');
  const [submittedReviews, setSubmittedReviews] = useState([]);

  useEffect(() => {
    const list = facultyService.getAllFaculty();
    setFacultyList(list);
    if (list.length > 0) {
      setSelectedTeacherId(list[0].id);
    }
    setSubmittedReviews(reviewService.getAllStudentTeacherReviews());
  }, []);

  const handleRatingChange = (field, val) => {
    setRatings((prev) => {
      const updated = { ...prev, [field]: val };
      const avg = Number(
        ((updated.clarity + updated.communication + updated.availability + updated.support) / 4).toFixed(1)
      );
      return { ...updated, overall: avg };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const teacher = facultyList.find((f) => f.id === selectedTeacherId);
    if (!teacher) {
      toast.error('Please select a faculty member');
      return;
    }

    try {
      reviewService.addStudentTeacherReview({
        teacherId: teacher.id,
        teacherName: teacher.name,
        studentId: currentUser?.id || 'STU-001',
        studentName: currentUser?.name || 'Rahul Sharma',
        isAnonymous,
        course,
        ratings,
        feedback
      });

      toast.success(`Feedback for ${teacher.name} submitted successfully!`);
      setFeedback('');
      setSubmittedReviews(reviewService.getAllStudentTeacherReviews());
    } catch (err) {
      toast.error('Failed to submit evaluation');
    }
  };

  return (
    <div>
      <div className="hero-banner">
        <div className="hero-content">
          <h2>Faculty Instruction & Course Evaluation</h2>
          <p>
            Provide constructive feedback on classroom instruction, teaching clarity, and mentor availability. You can choose to submit feedback anonymously.
          </p>
        </div>
      </div>

      <div className="grid-2">
        {/* Review Form */}
        <div className="glass-card">
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 800 }}>
            Submit Faculty Evaluation
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Select Faculty Member *</label>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="form-select"
              >
                {facultyList.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} — Department of {f.department} ({f.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Course Title</label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Structured Star Ratings */}
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="form-label" style={{ fontSize: '11.5px' }}>Teaching Clarity (1–5)</label>
                  <StarRating
                    value={ratings.clarity}
                    onChange={(v) => handleRatingChange('clarity', v)}
                    size={20}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '11.5px' }}>Communication & Responsiveness (1–5)</label>
                  <StarRating
                    value={ratings.communication}
                    onChange={(v) => handleRatingChange('communication', v)}
                    size={20}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '11.5px' }}>Office Hours Availability (1–5)</label>
                  <StarRating
                    value={ratings.availability}
                    onChange={(v) => handleRatingChange('availability', v)}
                    size={20}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '11.5px' }}>Course Material & Lab Support (1–5)</label>
                  <StarRating
                    value={ratings.support}
                    onChange={(v) => handleRatingChange('support', v)}
                    size={20}
                  />
                </div>
              </div>

              <div style={{ marginTop: 12, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Computed Overall Score:</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--cyan)' }}>
                  {ratings.overall} / 5.0 ★
                </span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Written Feedback & Comments</label>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share constructive feedback regarding lecture explanations, lab guidance, pace..."
                className="form-textarea"
              />
            </div>

            {/* Anonymous Toggle Option */}
            <div style={{ background: 'rgba(0, 169, 224, 0.06)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: 16, border: '1px solid var(--border-subtle)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '12.5px', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: 'var(--cyan)' }}
                />
                <Shield size={16} style={{ color: 'var(--cyan)' }} />
                <span>Submit Evaluation Anonymously</span>
              </label>
              <p style={{ margin: '4px 0 0 26px', fontSize: '11px', color: 'var(--text-dim)' }}>
                When enabled, your name and roll number will not be visible to the instructor or other students.
              </p>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Send size={15} /> Submit Faculty Evaluation
            </button>
          </form>
        </div>

        {/* Aggregate Feedback Ledger */}
        <div className="glass-card">
          <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: 800 }}>
            Recent Course Evaluations ({submittedReviews.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {submittedReviews.map((rev) => (
              <div key={rev.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <b style={{ fontSize: '12.5px' }}>{rev.teacherName}</b>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {rev.course} · By {rev.isAnonymous ? 'Anonymous Student 🔒' : rev.studentName}
                    </div>
                  </div>
                  <StarRating value={rev.ratings.overall} readOnly size={13} />
                </div>

                {rev.feedback && (
                  <p style={{ margin: '6px 0 0', fontSize: '11.5px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    "{rev.feedback}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
