import React from 'react';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { Settings, Download, Trash2, RefreshCw, Sun, Moon, Globe, ShieldAlert } from 'lucide-react';

export function SystemSettings() {
  const toast = useToast();
  const { currentLang, changeLanguage, languageNames, availableLanguages } = useLanguage();

  const handleExportBackup = () => {
    try {
      const allData = {
        users: storageService.getUsers(),
        faculty: storageService.getFaculty(),
        students: storageService.getStudents(),
        candidates: storageService.getCandidates(),
        onboarding: storageService.getOnboarding(),
        attendance: storageService.getAttendance(),
        announcements: storageService.getAnnouncements(),
        leaves: storageService.getLeaveRequests(),
        calendar: storageService.getCalendarEvents(),
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexus_system_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('JSON Database backup exported successfully!');
    } catch (e) {
      toast.error('Failed to export backup');
    }
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset the entire local prototype state to clean default demo data?')) {
      storageService.resetAllData();
      toast.success('Institutional demo data reset to defaults. Reloading...');
      setTimeout(() => window.location.reload(), 800);
    }
  };

  return (
    <div>
      <div className="hero-banner">
        <div className="hero-content">
          <h2>Platform Administration & System Controls</h2>
          <p>
            Configure environment parameters, manage multi-language defaults, export full JSON database snapshots, and manage local storage prototype persistence.
          </p>
        </div>
      </div>

      <div className="grid-2">
        {/* Appearance & Localization */}
        <div className="glass-card">
          <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: 800 }}>
            Localization & Environment Settings
          </h3>

          <div className="form-group">
            <label className="form-label">Active Platform Language</label>
            <select
              value={currentLang}
              onChange={(e) => {
                changeLanguage(e.target.value);
                toast.info(`Language set to ${languageNames[e.target.value]}`);
              }}
              className="form-select"
            >
              {availableLanguages.map((l) => (
                <option key={l} value={l}>{languageNames[l]}</option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '14px' }}>JSON Database Snapshot</h4>
            <p style={{ margin: '0 0 12px', fontSize: '12px', color: 'var(--text-muted)' }}>
              Download a complete offline copy of all faculty, student, recruitment, and attendance records.
            </p>
            <button onClick={handleExportBackup} className="btn-secondary">
              <Download size={15} /> Export JSON System Backup
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="glass-card" style={{ border: '1px solid rgba(239, 68, 68, 0.35)', background: 'rgba(239, 68, 68, 0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--red)', marginBottom: 12 }}>
            <ShieldAlert size={20} />
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>
              Prototype Danger Zone
            </h3>
          </div>

          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 16 }}>
            These actions affect locally stored client-side state. Resetting will restore all 50+ students, 15 faculty, 10 recruitment candidates, and academic calendar records to their clean benchmark baseline.
          </p>

          <button onClick={handleResetDemoData} className="btn-danger" style={{ padding: '10px 16px' }}>
            <RefreshCw size={15} /> Reset Entire Demo Dataset to Default
          </button>
        </div>
      </div>
    </div>
  );
}
