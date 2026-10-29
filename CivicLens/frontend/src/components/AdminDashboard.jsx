import React, { useState } from 'react';
import { 
  IconRefresh, 
  IconCheckCircle, 
  IconAlert, 
  IconClock, 
  IconPin,
  IconUsers,
  IconFlame,
  IconCamera,
  IconShield,
  IconX,
  getCategoryIcon 
} from './Icons';
import { 
  updateIssueStatus, 
  updateIssueScores, 
  resolveIssueWithProof, 
  staffLogin, 
  staffLogout, 
  getStoredStaffInfo, 
  getStaffToken, 
  seedSampleData 
} from '../api';

export default function AdminDashboard({ issues, stats, onRefresh, onStatusUpdated }) {
  const [updatingId, setUpdatingId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [isSeeding, setIsSeeding] = useState(false);

  // Staff Authentication State
  const [staffInfo, setStaffInfo] = useState(getStoredStaffInfo());
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUsername, setLoginUsername] = useState('staff_admin');
  const [loginPassword, setLoginPassword] = useState('CivicStaff@2026');
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Score Editing Modal State (Feature 1)
  const [editingScoreIssue, setEditingScoreIssue] = useState(null);
  const [editSeverity, setEditSeverity] = useState(50);
  const [editUrgency, setEditUrgency] = useState(50);
  const [editEmergency, setEditEmergency] = useState(false);
  const [editEmergencyReason, setEditEmergencyReason] = useState('');
  const [scoreUpdating, setScoreUpdating] = useState(false);

  // Resolution Proof Upload Modal State (Feature 3)
  const [resolvingIssue, setResolvingIssue] = useState(null);
  const [afterPhotoFile, setAfterPhotoFile] = useState(null);
  const [afterPhotoUrl, setAfterPhotoUrl] = useState('');
  const [afterPhotoPreview, setAfterPhotoPreview] = useState('');
  const [resolvedByName, setResolvedByName] = useState(staffInfo?.name || 'Officer R. Sharma');
  const [resolutionNotes, setResolutionNotes] = useState('Repaired and verified on-site by municipal crew.');
  const [resolveLoading, setResolveLoading] = useState(false);

  const statuses = ['Reported', 'In Progress', 'Resolved'];

  const isStaffAuthenticated = Boolean(staffInfo && getStaffToken());

  // Handle staff login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await staffLogin(loginUsername, loginPassword);
      setStaffInfo(res.staff);
      setShowLoginModal(false);
      setNotification({
        type: 'success',
        message: `Welcome back, ${res.staff.name}. Staff authorization unlocked.`
      });
    } catch (err) {
      setLoginError(err.message || 'Staff login failed. Check username and password.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    staffLogout();
    setStaffInfo(null);
    setNotification({
      type: 'info',
      message: 'Signed out of staff session. Administrative mutations now locked.'
    });
  };

  // Open Score Editor (Feature 1)
  const openScoreEditor = (issue) => {
    if (!isStaffAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setEditingScoreIssue(issue);
    setEditSeverity(issue.severity ?? 50);
    setEditUrgency(issue.urgency ?? 50);
    setEditEmergency(Boolean(issue.isEmergency));
    setEditEmergencyReason(issue.emergencyReason || '');
  };

  // Submit Score Updates (Feature 1)
  const handleSaveScores = async (e) => {
    e.preventDefault();
    if (!editingScoreIssue) return;
    setScoreUpdating(true);

    try {
      const res = await updateIssueScores(editingScoreIssue.id, {
        severity: editSeverity,
        urgency: editUrgency,
        isEmergency: editEmergency,
        emergencyReason: editEmergencyReason
      });

      setNotification({
        type: 'success',
        message: `Priority scores for #${editingScoreIssue.id} updated! New Priority Score: ${res.issue.priorityScore}/100.`
      });

      if (onStatusUpdated) onStatusUpdated(res.issue);
      setEditingScoreIssue(null);
    } catch (err) {
      setNotification({
        type: 'error',
        message: `Failed to update scores: ${err.message}`
      });
    } finally {
      setScoreUpdating(false);
    }
  };

  // Handle Status Dropdown Change
  const handleStatusChange = async (issue, newStatus) => {
    if (newStatus === 'Resolved') {
      // Opening resolution proof modal is required to resolve!
      if (!isStaffAuthenticated) {
        setShowLoginModal(true);
        return;
      }
      setResolvingIssue(issue);
      setResolvedByName(staffInfo?.name || 'Officer R. Sharma');
      setAfterPhotoFile(null);
      setAfterPhotoUrl('');
      setAfterPhotoPreview('');
      setResolutionNotes('Repaired, leveled, and verified on-site by municipal crew.');
      return;
    }

    setUpdatingId(issue.id);
    setNotification(null);

    try {
      const response = await updateIssueStatus(issue.id, newStatus);
      setNotification({
        type: 'success',
        message: `Status of #${issue.id} set to "${newStatus}".`
      });

      if (onStatusUpdated) {
        onStatusUpdated(response.issue);
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: `Failed to update #${issue.id}: ${err.message}`
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // Submit Resolution Proof (Feature 3)
  const handleSubmitResolutionProof = async (e) => {
    e.preventDefault();
    if (!resolvingIssue) return;

    if (!afterPhotoFile && !afterPhotoUrl.trim()) {
      alert('Photographic resolution proof (file upload or URL) is required to mark an issue as Resolved.');
      return;
    }

    setResolveLoading(true);

    try {
      let res;
      if (afterPhotoFile) {
        const formData = new FormData();
        formData.append('afterImage', afterPhotoFile);
        formData.append('resolvedBy', resolvedByName);
        formData.append('resolutionNotes', resolutionNotes);
        res = await resolveIssueWithProof(resolvingIssue.id, formData);
      } else {
        res = await resolveIssueWithProof(resolvingIssue.id, {
          afterImageUrl: afterPhotoUrl.trim(),
          resolvedBy: resolvedByName,
          resolutionNotes: resolutionNotes
        });
      }

      setNotification({
        type: 'success',
        message: `Issue #${resolvingIssue.id} resolved with photographic evidence! Saved to database.`
      });

      if (onStatusUpdated) onStatusUpdated(res.issue);
      setResolvingIssue(null);
    } catch (err) {
      setNotification({
        type: 'error',
        message: `Resolution proof upload failed: ${err.message}`
      });
    } finally {
      setResolveLoading(false);
    }
  };

  const handleSeedData = async () => {
    if (!window.confirm('Reset and load 5 realistic sample community issues with coordinates and proofs?')) {
      return;
    }
    setIsSeeding(true);
    try {
      await seedSampleData();
      setNotification({
        type: 'success',
        message: 'Database seeded with demonstration issues.'
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      setNotification({
        type: 'error',
        message: `Seed failed: ${err.message}`
      });
    } finally {
      setIsSeeding(false);
    }
  };

  // Filter issues
  const filteredIssues = issues ? issues.filter(issue => {
    if (filterStatus === 'All') return true;
    return issue.status === filterStatus;
  }) : [];

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-page">
      {/* Staff Authentication Banner */}
      <div className={`admin-disclaimer ${isStaffAuthenticated ? 'staff-active-banner' : ''}`}>
        <div className="disclaimer-icon">
          <IconShield size={24} />
        </div>
        <div className="disclaimer-text">
          {isStaffAuthenticated ? (
            <div>
              <strong>Authenticated Staff Session:</strong> Logged in as <strong>{staffInfo.name}</strong> ({staffInfo.department}). 
              Authorized to update severity/urgency, emergency escalations, and upload resolution proof.
            </div>
          ) : (
            <div>
              <strong>Staff Authorization Notice:</strong> Viewing municipal dispatch console. 
              To update severity/urgency or upload resolution proof to mark issues as Resolved, log in as authorized staff.
            </div>
          )}
        </div>
        <div className="disclaimer-actions">
          {isStaffAuthenticated ? (
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>
              Staff Sign Out
            </button>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => setShowLoginModal(true)}>
              <IconShield size={14} /> Staff Sign In
            </button>
          )}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleSeedData}
            disabled={isSeeding}
          >
            {isSeeding ? 'Seeding...' : 'Load Sample Data'}
          </button>
        </div>
      </div>

      <div className="page-header-row">
        <div>
          <h2 className="page-title">Administrative Operations & Triage Console</h2>
          <p className="page-subtitle">
            Smart priority ranking, severity adjustment, emergency hazard control, and before-and-after resolution proof.
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={onRefresh}>
            <IconRefresh size={16} />
            <span>Refresh Dashboard</span>
          </button>
        </div>
      </div>

      {/* Notification Toast/Banner */}
      {notification && (
        <div className={`alert-box ${notification.type === 'success' ? 'success' : notification.type === 'info' ? 'warning' : 'danger'}`}>
          <div className="alert-icon">
            {notification.type === 'success' ? <IconCheckCircle size={22} /> : <IconAlert size={22} />}
          </div>
          <div className="alert-body">
            <p>{notification.message}</p>
          </div>
          <button className="btn-icon-subtle" onClick={() => setNotification(null)}>✕</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="admin-kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Total Reports</span>
          <span className="kpi-number">{stats?.total ?? 0}</span>
          <span className="kpi-tag">100% of logs</span>
        </div>

        <div className="kpi-card highlight-high">
          <span className="kpi-label">Safety Hazards</span>
          <span className="kpi-number">{stats?.emergencyCount ?? 0}</span>
          <span className="kpi-tag red">Emergency priority</span>
        </div>

        <div className="kpi-card highlight-reported">
          <span className="kpi-label">Pending / Reported</span>
          <span className="kpi-number">{stats?.reported ?? 0}</span>
          <span className="kpi-tag blue">Awaiting action</span>
        </div>

        <div className="kpi-card highlight-progress">
          <span className="kpi-label">In Progress</span>
          <span className="kpi-number">{stats?.inProgress ?? 0}</span>
          <span className="kpi-tag amber">Crews dispatched</span>
        </div>

        <div className="kpi-card highlight-resolved">
          <span className="kpi-label">Verified Resolved</span>
          <span className="kpi-number">{stats?.resolved ?? 0}</span>
          <span className="kpi-tag green">Proof submitted</span>
        </div>
      </div>

      {/* Management Table */}
      <div className="admin-table-container">
        <div className="table-controls-row">
          <div className="table-title-wrap">
            <h3>Civic Issue Resolution & Priority Ranking Table</h3>
            <span className="table-counter">{filteredIssues.length} records</span>
          </div>
          <div className="table-filters">
            <label className="filter-label">Filter Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select-sm"
            >
              <option value="All">All Statuses ({issues?.length ?? 0})</option>
              <option value="Reported">Reported ({stats?.reported ?? 0})</option>
              <option value="In Progress">In Progress ({stats?.inProgress ?? 0})</option>
              <option value="Resolved">Resolved ({stats?.resolved ?? 0})</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Priority Score</th>
                <th>Category</th>
                <th>Location</th>
                <th>Reporters</th>
                <th>Severity</th>
                <th>Urgency</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan="8" className="table-empty">
                    No issues match the current filter.
                  </td>
                </tr>
              ) : (
                filteredIssues.map((issue) => {
                  const isUpdating = updatingId === issue.id;
                  return (
                    <tr key={issue.id} className={issue.isEmergency ? 'emergency-row' : ''}>
                      {/* Priority Score & Badge */}
                      <td className="cell-score">
                        <div className="table-score-badge">
                          <span className="score-val">{issue.priorityScore}</span>
                          <span className={`badge-priority ${issue.priority?.toLowerCase()}`}>
                            {issue.isEmergency && <IconFlame size={11} />}
                            {issue.priority}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="cell-category">
                        <div className="table-cat-pill">
                          {getCategoryIcon(issue.category, 15)}
                          <span>{issue.category}</span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="cell-location">
                        <div className="loc-text-wrap">
                          <IconPin size={14} />
                          <span>{issue.location}</span>
                        </div>
                        {typeof issue.latitude === 'number' && typeof issue.longitude === 'number' && (
                          <span className="table-gps-tag">📍 Map Pinned</span>
                        )}
                      </td>

                      {/* Unique Reporters Count */}
                      <td className="cell-reporters">
                        <span className="reporters-badge" title="Unique individuals who filed a complaint">
                          <IconUsers size={13} /> {issue.uniqueReporterCount}
                        </span>
                      </td>

                      {/* Severity */}
                      <td className="cell-metric">
                        <div className="metric-bar-wrap">
                          <div className="metric-bar-fill" style={{ width: `${issue.severity || 50}%` }}></div>
                          <span>{issue.severity ?? 50}</span>
                        </div>
                      </td>

                      {/* Urgency */}
                      <td className="cell-metric">
                        <div className="metric-bar-wrap urgency-fill">
                          <div className="metric-bar-fill" style={{ width: `${issue.urgency || 50}%` }}></div>
                          <span>{issue.urgency ?? 50}</span>
                        </div>
                      </td>

                      {/* Current Status Dropdown */}
                      <td className="cell-status">
                        <div className="action-wrapper">
                          <select
                            value={issue.status}
                            onChange={(e) => handleStatusChange(issue, e.target.value)}
                            disabled={isUpdating}
                            className={`status-dropdown ${issue.status.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            {statuses.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          {isUpdating && <span className="mini-spinner"></span>}
                        </div>
                      </td>

                      {/* Actions: Edit Scores & Resolve */}
                      <td className="cell-actions-buttons">
                        <div className="btn-actions-cluster">
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => openScoreEditor(issue)}
                            title="Adjust severity and urgency scores or emergency escalation"
                          >
                            Edit Scores
                          </button>
                          {issue.status !== 'Resolved' && (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => {
                                if (!isStaffAuthenticated) {
                                  setShowLoginModal(true);
                                } else {
                                  setResolvingIssue(issue);
                                  setResolvedByName(staffInfo?.name || 'Officer R. Sharma');
                                  setAfterPhotoFile(null);
                                  setAfterPhotoUrl('');
                                  setAfterPhotoPreview('');
                                  setResolutionNotes('Repaired, leveled, and verified on-site by municipal crew.');
                                }
                              }}
                              title="Upload resolution proof and mark as Resolved"
                            >
                              <IconCamera size={13} /> Resolve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Login Modal */}
      {showLoginModal && (
        <div className="modal-backdrop" onClick={() => setShowLoginModal(false)}>
          <div className="modal-content modal-auth-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <div>
                <span className="badge-category-count">Municipal Personnel</span>
                <h3 className="modal-title">Staff Authorization Login</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowLoginModal(false)}>
                <IconX size={20} />
              </button>
            </div>

            <form onSubmit={handleLogin} className="auth-form">
              <p className="auth-hint">
                Sign in with official credentials to unlock severity/urgency score overrides and photographic resolution proof authorization.
              </p>

              {loginError && <div className="alert-box danger"><p>{loginError}</p></div>}

              <div className="form-group">
                <label className="form-label">Staff Username</label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="demo-credentials-note">
                <span>Default Demo Staff Credentials:</span>
                <code>Username: staff_admin | Password: CivicStaff@2026</code>
              </div>

              <div className="modal-actions-bar">
                <button type="submit" className="btn btn-primary" disabled={loginLoading}>
                  {loginLoading ? 'Authenticating...' : 'Sign In as Staff'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setShowLoginModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feature 1: Edit Severity & Urgency Modal */}
      {editingScoreIssue && (
        <div className="modal-backdrop" onClick={() => setEditingScoreIssue(null)}>
          <div className="modal-content modal-score-edit" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <div>
                <span className="badge-category-count">Smart Priority Calibration</span>
                <h3 className="modal-title">Adjust Priority Scores — #{editingScoreIssue.id}</h3>
                <p className="modal-subtitle">{editingScoreIssue.category} at {editingScoreIssue.location}</p>
              </div>
              <button className="modal-close-btn" onClick={() => setEditingScoreIssue(null)}>
                <IconX size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveScores} className="score-form">
              {/* Unique Reporters Display */}
              <div className="score-calc-preview">
                <div className="calc-item">
                  <span className="calc-label">Unique Reporters</span>
                  <span className="calc-val">{editingScoreIssue.uniqueReporterCount}</span>
                </div>
                <div className="calc-item">
                  <span className="calc-label">Impact Score</span>
                  <span className="calc-val">{Math.min(((editingScoreIssue.uniqueReporterCount / 50) * 100), 100).toFixed(1)}</span>
                </div>
                <div className="calc-item highlight">
                  <span className="calc-label">Calculated Priority Score</span>
                  <span className="calc-val">
                    {(
                      0.5 * Math.min(((editingScoreIssue.uniqueReporterCount / 50) * 100), 100) +
                      0.3 * editSeverity +
                      0.2 * editUrgency
                    ).toFixed(1)}/100
                  </span>
                </div>
              </div>

              {/* Severity Slider */}
              <div className="form-group">
                <div className="slider-label-row">
                  <label className="form-label">Severity Score (0 - 100):</label>
                  <span className="slider-value-badge">{editSeverity}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editSeverity}
                  onChange={(e) => setEditSeverity(Number(e.target.value))}
                  className="range-slider"
                />
                <span className="field-hint">Physical damage, structural danger, or hazard intensity.</span>
              </div>

              {/* Urgency Slider */}
              <div className="form-group">
                <div className="slider-label-row">
                  <label className="form-label">Urgency Score (0 - 100):</label>
                  <span className="slider-value-badge">{editUrgency}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editUrgency}
                  onChange={(e) => setEditUrgency(Number(e.target.value))}
                  className="range-slider"
                />
                <span className="field-hint">Time sensitivity, imminent traffic impact, or expanding damage.</span>
              </div>

              {/* Emergency Escalation Checkbox */}
              <div className="emergency-toggle-box">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editEmergency}
                    onChange={(e) => setEditEmergency(e.target.checked)}
                  />
                  <span>🚨 <strong>Authorized Immediate Safety Hazard Escalation</strong></span>
                </label>
                <p className="emergency-hint">
                  Forces issue to the highest triage rank on dashboard and map regardless of numerical score.
                </p>
                {editEmergency && (
                  <input
                    type="text"
                    placeholder="State reason for emergency hazard escalation..."
                    value={editEmergencyReason}
                    onChange={(e) => setEditEmergencyReason(e.target.value)}
                    className="form-input form-input-sm"
                    style={{ marginTop: '0.5rem' }}
                  />
                )}
              </div>

              <div className="modal-actions-bar">
                <button type="submit" className="btn btn-primary" disabled={scoreUpdating}>
                  {scoreUpdating ? 'Recalculating...' : 'Save & Recalculate Priority'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setEditingScoreIssue(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feature 3: Resolution Proof Upload Modal */}
      {resolvingIssue && (
        <div className="modal-backdrop" onClick={() => setResolvingIssue(null)}>
          <div className="modal-content modal-resolve-proof" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <div>
                <span className="badge-category-count">Resolution Evidence Verification</span>
                <h3 className="modal-title">Mark Issue as Resolved with Proof — #{resolvingIssue.id}</h3>
                <p className="modal-subtitle">{resolvingIssue.category} at {resolvingIssue.location}</p>
              </div>
              <button className="modal-close-btn" onClick={() => setResolvingIssue(null)}>
                <IconX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitResolutionProof} className="resolve-form">
              {/* Original Complaint Photo Preview */}
              <div className="original-preview-box">
                <span className="preview-heading">Original Complaint Photo (Before):</span>
                {resolvingIssue.beforeImageUrl || resolvingIssue.imageUrl ? (
                  <img src={resolvingIssue.beforeImageUrl || resolvingIssue.imageUrl} alt="Before" className="orig-img" />
                ) : (
                  <div className="orig-placeholder">No original photo submitted</div>
                )}
              </div>

              {/* Upload After-Photo */}
              <div className="form-group">
                <label className="form-label">
                  Resolution Evidence Photo (After) <span className="req">*</span>
                </label>
                
                <div className="photo-upload-options">
                  <label htmlFor="resolveFile" className="btn btn-secondary btn-sm file-picker-label">
                    <IconCamera size={16} />
                    <span>{afterPhotoFile ? 'Change Photo File' : 'Upload After-Photo (JPEG/PNG)'}</span>
                  </label>
                  <input
                    id="resolveFile"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setAfterPhotoFile(file);
                        setAfterPhotoPreview(URL.createObjectURL(file));
                        setAfterPhotoUrl('');
                      }
                    }}
                    style={{ display: 'none' }}
                  />

                  <span className="or-divider">— OR —</span>

                  <input
                    type="url"
                    placeholder="Enter After-Photo Image URL..."
                    value={afterPhotoUrl}
                    onChange={(e) => {
                      setAfterPhotoUrl(e.target.value);
                      setAfterPhotoFile(null);
                      setAfterPhotoPreview(e.target.value);
                    }}
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                </div>

                {afterPhotoPreview && (
                  <div className="after-preview-wrap">
                    <span className="preview-label">After Photo Preview:</span>
                    <img src={afterPhotoPreview} alt="After Preview" className="after-img-preview" />
                  </div>
                )}
              </div>

              {/* Staff details */}
              <div className="form-group">
                <label className="form-label">Resolving Staff Member / Officer Name <span className="req">*</span></label>
                <input
                  type="text"
                  value={resolvedByName}
                  onChange={(e) => setResolvedByName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              {/* Resolution Notes */}
              <div className="form-group">
                <label className="form-label">Resolution Work Notes</label>
                <textarea
                  rows="3"
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="form-textarea"
                  placeholder="Detail work performed (e.g. pipe replaced, asphalt resurfaced, bulb replaced)..."
                />
              </div>

              <div className="modal-actions-bar">
                <button type="submit" className="btn btn-primary" disabled={resolveLoading}>
                  {resolveLoading ? 'Submitting Proof & Resolving...' : 'Submit Resolution Proof & Mark Resolved'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setResolvingIssue(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
