import React, { useState } from 'react';
import { facultyService } from '../../services/facultyService';
import { studentService } from '../../services/studentService';
import { recruitmentService } from '../../services/recruitmentService';
import { onboardingService } from '../../services/onboardingService';
import { leaveService } from '../../services/leaveService';
import { exportToCSV, printFormattedReport } from '../../utils/exportUtils';
import { useToast } from '../../context/ToastContext';
import {
  FileBarChart,
  Download,
  Printer,
  Users,
  GraduationCap,
  Scale,
  CalendarCheck,
  TrendingUp,
  Clock,
  Briefcase
} from 'lucide-react';

export function ReportsCenter() {
  const toast = useToast();
  const [selectedReport, setSelectedReport] = useState('faculty_utilization');

  const faculty = facultyService.getAllFaculty();
  const students = studentService.getAllStudents();
  const candidates = recruitmentService.getAllCandidates();
  const onboarding = onboardingService.getAllOnboarding();
  const leaves = leaveService.getAllLeaves();

  const handleExportCSV = () => {
    try {
      if (selectedReport === 'faculty_utilization') {
        const rows = faculty.map((f) => ({
          FacultyID: f.id,
          Name: f.name,
          Department: f.department,
          Role: f.role,
          AssignedStudents: f.studentsAssigned,
          MaxCapacity: f.maxCapacity,
          WorkloadPercent: `${f.workloadPercent}%`,
          PerformanceScore: f.performanceScore,
          RetentionRisk: f.retentionRisk
        }));
        exportToCSV('NEXUS_Faculty_Utilization_Report', rows);
      } else if (selectedReport === 'student_index') {
        const rows = students.map((s) => ({
          StudentID: s.id,
          RollNumber: s.rollNumber,
          Name: s.name,
          Department: s.department,
          Semester: s.semester,
          AttendancePercent: `${s.attendance}%`,
          StudentIndex: s.studentIndex,
          RiskLevel: s.riskLevel,
          Advisor: s.advisorName
        }));
        exportToCSV('NEXUS_Student_Index_Summary', rows);
      } else if (selectedReport === 'recruitment_funnel') {
        const rows = candidates.map((c) => ({
          CandidateID: c.id,
          Name: c.name,
          Department: c.department,
          Position: c.position,
          Qualification: c.qualification,
          ExperienceYears: c.experience,
          AIMatchScore: `${c.matchScore}%`,
          PipelineStatus: c.status
        }));
        exportToCSV('NEXUS_Recruitment_Funnel_Report', rows);
      } else {
        const rows = leaves.map((l) => ({
          LeaveID: l.id,
          ApplicantName: l.applicantName,
          Role: l.applicantRole,
          Department: l.applicantDepartment,
          Category: l.leaveCategory,
          StartDate: l.startDate,
          EndDate: l.endDate,
          Days: l.totalDays,
          Status: l.status
        }));
        exportToCSV('NEXUS_Leave_Trends_Report', rows);
      }
      toast.success('CSV Report exported successfully!');
    } catch (e) {
      toast.error('Failed to export CSV report');
    }
  };

  return (
    <div>
      <div className="hero-banner">
        <div className="hero-content">
          <h2>Institutional Analytics & Executive Reports</h2>
          <p>
            Audit-grade reporting across faculty workloads, student retention indices, recruitment velocity, and institutional leave trends.
          </p>
          <div className="hero-actions">
            <button className="btn-white" onClick={handleExportCSV}>
              <Download size={16} /> Export Active Report as CSV
            </button>
            <button className="btn-ghost" onClick={() => printFormattedReport()}>
              <Printer size={16} /> Print Report
            </button>
          </div>
        </div>
      </div>

      {/* Report Category Selector */}
      <div className="glass-card" style={{ marginBottom: 20, padding: '12px 18px' }}>
        <div className="tabs-container" style={{ margin: 0, border: 'none' }}>
          <button
            onClick={() => setSelectedReport('faculty_utilization')}
            className={`tab-btn ${selectedReport === 'faculty_utilization' ? 'active' : ''}`}
          >
            Faculty Utilization & Risk
          </button>
          <button
            onClick={() => setSelectedReport('student_index')}
            className={`tab-btn ${selectedReport === 'student_index' ? 'active' : ''}`}
          >
            Student Index & Attendance
          </button>
          <button
            onClick={() => setSelectedReport('recruitment_funnel')}
            className={`tab-btn ${selectedReport === 'recruitment_funnel' ? 'active' : ''}`}
          >
            Recruitment Funnel
          </button>
          <button
            onClick={() => setSelectedReport('leave_trends')}
            className={`tab-btn ${selectedReport === 'leave_trends' ? 'active' : ''}`}
          >
            Leave & Absence Trends
          </button>
        </div>
      </div>

      {/* Report Data Preview Table */}
      <div className="glass-card table-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, textTransform: 'capitalize' }}>
            {selectedReport.replace(/_/g, ' ')} Data Ledger
          </h3>
          <button onClick={handleExportCSV} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
            <Download size={13} /> Download .CSV
          </button>
        </div>

        {selectedReport === 'faculty_utilization' && (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Faculty</th>
                <th>Department</th>
                <th>Workload %</th>
                <th>Advisees</th>
                <th>Teaching Rating</th>
                <th>Retention Risk</th>
              </tr>
            </thead>
            <tbody>
              {faculty.map((f) => (
                <tr key={f.id}>
                  <td><b>{f.name}</b></td>
                  <td>{f.department}</td>
                  <td><b>{f.workloadPercent}%</b></td>
                  <td>{f.studentsAssigned} / {f.maxCapacity}</td>
                  <td>{f.performanceScore}/100</td>
                  <td><b>{f.retentionRisk}</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {selectedReport === 'student_index' && (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll Number</th>
                <th>Department & Sem</th>
                <th>Attendance</th>
                <th>Student Index</th>
                <th>Risk Classification</th>
              </tr>
            </thead>
            <tbody>
              {students.slice(0, 12).map((s) => (
                <tr key={s.id}>
                  <td><b>{s.name}</b></td>
                  <td>{s.rollNumber}</td>
                  <td>{s.department} (Sem {s.semester})</td>
                  <td><b>{s.attendance}%</b></td>
                  <td><b>{s.studentIndex}/100</b></td>
                  <td>{s.riskLevel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {selectedReport === 'recruitment_funnel' && (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Position</th>
                <th>Department</th>
                <th>Qualification</th>
                <th>AI Match</th>
                <th>Stage</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c.id}>
                  <td><b>{c.name}</b></td>
                  <td>{c.position}</td>
                  <td>{c.department}</td>
                  <td>{c.qualification}</td>
                  <td><b>{c.matchScore}%</b></td>
                  <td>{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {selectedReport === 'leave_trends' && (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Role</th>
                <th>Department</th>
                <th>Category</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l) => (
                <tr key={l.id}>
                  <td><b>{l.applicantName}</b></td>
                  <td>{l.applicantRole}</td>
                  <td>{l.applicantDepartment}</td>
                  <td>{l.leaveCategory}</td>
                  <td>{l.startDate} to {l.endDate} ({l.totalDays}d)</td>
                  <td>{l.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
