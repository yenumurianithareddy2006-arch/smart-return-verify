import React, { useState, useMemo } from 'react';
import { 
  IconSearch, 
  IconRefresh, 
  IconPin, 
  IconClock, 
  IconAlert, 
  IconCheckCircle, 
  IconX,
  IconUsers,
  IconFlame,
  IconCamera,
  getCategoryIcon 
} from './Icons';

export default function IssueList({ issues, loading, onRefresh, setActiveTab, initialSelectedIssue }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('priority'); // 'priority' (default) or 'date'
  const [selectedImageModal, setSelectedImageModal] = useState(null);
  const [proofModalIssue, setProofModalIssue] = useState(initialSelectedIssue || null);

  const categories = ['All', 'Pothole', 'Garbage', 'Streetlight', 'Water Leakage'];
  const priorities = ['All', 'Critical', 'High', 'Medium', 'Low'];
  const statuses = ['All', 'Reported', 'In Progress', 'Resolved'];

  // Filter and sort issues
  const filteredIssues = useMemo(() => {
    if (!issues) return [];
    let list = issues.filter((issue) => {
      // Search term matching
      const matchesSearch = 
        !searchTerm.trim() ||
        (issue.description && issue.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (issue.location && issue.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (issue.id && issue.id.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category matching
      let matchesCategory = true;
      if (categoryFilter !== 'All') {
        const catNorm = (issue.category || '').toLowerCase();
        const selNorm = categoryFilter.toLowerCase();
        if (selNorm.includes('water') && catNorm.includes('water')) {
          matchesCategory = true;
        } else {
          matchesCategory = catNorm === selNorm;
        }
      }

      // Priority matching
      let matchesPriority = true;
      if (priorityFilter !== 'All') {
        if (priorityFilter === 'Critical') {
          matchesPriority = Boolean(issue.isEmergency);
        } else {
          matchesPriority = issue.priority === priorityFilter;
        }
      }

      // Status matching
      const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;

      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });

    // Sorting
    if (sortBy === 'priority') {
      list.sort((a, b) => {
        const aResolved = a.status === 'Resolved';
        const bResolved = b.status === 'Resolved';
        if (aResolved !== bResolved) return aResolved ? 1 : -1;
        if (!aResolved && !bResolved) {
          if (Boolean(a.isEmergency) !== Boolean(b.isEmergency)) return b.isEmergency ? 1 : -1;
        }
        if (b.priorityScore !== a.priorityScore) return b.priorityScore - a.priorityScore;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    } else {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return list;
  }, [issues, searchTerm, categoryFilter, priorityFilter, statusFilter, sortBy]);

  const hasActiveFilters = 
    searchTerm.trim() !== '' || 
    categoryFilter !== 'All' || 
    priorityFilter !== 'All' || 
    statusFilter !== 'All' ||
    sortBy !== 'priority';

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('All');
    setPriorityFilter('All');
    setStatusFilter('All');
    setSortBy('priority');
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="issues-page">
      <div className="page-header-row">
        <div>
          <span className="badge-category-count">Public Audit Logs</span>
          <h2 className="page-title">All Civic Issues & Triage Rankings</h2>
          <p className="page-subtitle">
            Browse public reports ranked by affected citizens and safety priority. Compare verified before-and-after resolution proofs.
          </p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary" 
            onClick={onRefresh} 
            disabled={loading}
            title="Refresh issues from server"
          >
            <IconRefresh size={16} className={loading ? 'spin' : ''} />
            <span>{loading ? 'Refreshing...' : 'Refresh List'}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-card">
        <div className="filter-top-row">
          <div className="search-box">
            <IconSearch size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by description, location, or report ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
                <IconX size={16} />
              </button>
            )}
          </div>
          {hasActiveFilters && (
            <button className="btn btn-ghost btn-sm" onClick={resetFilters}>
              <IconX size={14} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <div className="filter-dropdowns-row">
          {/* Category Filter */}
          <div className="filter-select-group">
            <label className="filter-label">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="filter-select-group">
            <label className="filter-label">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="filter-select"
            >
              {priorities.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="filter-select-group">
            <label className="filter-label">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="filter-select-group">
            <label className="filter-label">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="priority">⚡ Smart Priority Score (Default)</option>
              <option value="date">🕒 Date Created (Newest First)</option>
            </select>
          </div>

          <div className="filter-results-counter">
            Showing <strong>{filteredIssues.length}</strong> of <strong>{issues?.length ?? 0}</strong> reports
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Fetching civic reports from backend...</p>
        </div>
      )}

      {/* Empty States */}
      {!loading && filteredIssues.length === 0 && (
        <div className="empty-card">
          <div className="empty-icon-circle">
            <IconSearch size={32} />
          </div>
          <h3>No matching civic issues found</h3>
          <p>
            {hasActiveFilters
              ? 'Try adjusting your search criteria or resetting the category/priority filters.'
              : 'There are currently no civic reports in the system.'}
          </p>
          <div className="empty-actions">
            {hasActiveFilters ? (
              <button className="btn btn-secondary" onClick={resetFilters}>
                Clear Active Filters
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => setActiveTab('report')}>
                Submit the First Report
              </button>
            )}
          </div>
        </div>
      )}

      {/* Issues Grid */}
      {!loading && filteredIssues.length > 0 && (
        <div className="issues-grid">
          {filteredIssues.map((issue) => (
            <div key={issue.id} className={`issue-card ${issue.isEmergency ? 'card-emergency-border' : ''}`}>
              {/* Card Header */}
              <div className="issue-card-header">
                <div className="issue-category-badge">
                  {getCategoryIcon(issue.category, 16)}
                  <span>{issue.category}</span>
                </div>
                <div className="issue-badges-row">
                  {issue.isEmergency && (
                    <span className="badge-emergency" title="Emergency safety escalation active">
                      <IconFlame size={12} /> Emergency
                    </span>
                  )}
                  {issue.possibleDuplicate && (
                    <span className="badge-duplicate" title="Grouped with community reports">
                      👥 Grouped
                    </span>
                  )}
                  <span className={`badge-priority ${issue.priority?.toLowerCase()}`}>
                    {issue.priority} Priority
                  </span>
                </div>
              </div>

              {/* Priority Score Bar (Feature 1) */}
              <div className="card-score-strip">
                <div className="score-main">
                  <span className="score-title">Priority Score</span>
                  <span className="score-number">{issue.priorityScore}<span>/100</span></span>
                </div>
                <div className="score-breakdown">
                  <span title="Unique affected citizens count">
                    <IconUsers size={12} /> {issue.uniqueReporterCount} Unique Reporter{issue.uniqueReporterCount > 1 ? 's' : ''}
                  </span>
                  <span>Sev: {issue.severity}</span>
                  <span>Urg: {issue.urgency}</span>
                </div>
              </div>

              {/* Location & Coordinates */}
              <div className="issue-card-location">
                <IconPin size={16} />
                <span>{issue.location}</span>
                {typeof issue.latitude === 'number' && typeof issue.longitude === 'number' && (
                  <span className="gps-pill" title="GPS Pin active on map">
                    📍 {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="issue-card-desc">{issue.description}</p>

              {/* Feature 3: Before-and-After Resolution Proof Section */}
              <div className="resolution-proof-card-section">
                <div className="proof-header">
                  <span className="proof-label">
                    <IconCamera size={13} /> Resolution Evidence
                  </span>
                  <button
                    className="btn-text-action"
                    onClick={() => setProofModalIssue(issue)}
                  >
                    Compare Before & After
                  </button>
                </div>

                <div className="proof-mini-thumbnails">
                  {/* Before Photo */}
                  <div className="proof-thumb-box" onClick={() => setSelectedImageModal(issue.beforeImageUrl || issue.imageUrl)}>
                    {issue.beforeImageUrl || issue.imageUrl ? (
                      <img src={issue.beforeImageUrl || issue.imageUrl} alt="Before complaint" className="thumb-img" />
                    ) : (
                      <div className="thumb-placeholder">No Photo</div>
                    )}
                    <span className="thumb-badge before">Before</span>
                  </div>

                  {/* After Photo or Placeholder */}
                  <div className="proof-thumb-box" onClick={() => issue.afterImageUrl && setSelectedImageModal(issue.afterImageUrl)}>
                    {issue.afterImageUrl ? (
                      <img src={issue.afterImageUrl} alt="After repair" className="thumb-img" />
                    ) : (
                      <div className="thumb-placeholder pending">
                        <span>Awaiting Proof</span>
                      </div>
                    )}
                    <span className={`thumb-badge ${issue.afterImageUrl ? 'after' : 'pending'}`}>
                      {issue.afterImageUrl ? 'After' : 'Pending Proof'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="issue-card-footer">
                <div className="footer-meta">
                  <span className="issue-id-tag">#{issue.id}</span>
                  <span className="issue-timestamp">
                    <IconClock size={13} />
                    {formatDate(issue.createdAt)}
                  </span>
                </div>
                <div className="footer-status">
                  <span className={`badge-status ${issue.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                    {issue.status === 'Resolved' && <IconCheckCircle size={13} />}
                    {issue.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feature 3: Detailed Before-and-After Comparison Modal */}
      {proofModalIssue && (
        <div className="modal-backdrop" onClick={() => setProofModalIssue(null)}>
          <div className="modal-content proof-modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <div>
                <span className="badge-category-count">Resolution Verification Audit</span>
                <h3 className="modal-title">#{proofModalIssue.id} — Before & After Comparison</h3>
                <p className="modal-subtitle">
                  {proofModalIssue.category} at <strong>{proofModalIssue.location}</strong>
                </p>
              </div>
              <button className="modal-close-btn" onClick={() => setProofModalIssue(null)}>
                <IconX size={20} />
              </button>
            </div>

            {/* Side by side comparison gallery */}
            <div className="side-by-side-gallery">
              {/* Before Column */}
              <div className="compare-pane">
                <div className="pane-header">
                  <span className="compare-badge before">BEFORE (Citizen Complaint)</span>
                  <span className="compare-date">{formatDate(proofModalIssue.createdAt)}</span>
                </div>
                <div className="compare-img-wrap">
                  {proofModalIssue.beforeImageUrl || proofModalIssue.imageUrl ? (
                    <img
                      src={proofModalIssue.beforeImageUrl || proofModalIssue.imageUrl}
                      alt="Before repair"
                      className="compare-img"
                    />
                  ) : (
                    <div className="compare-empty-state">
                      <IconCamera size={36} />
                      <p>No original complaint photo provided.</p>
                    </div>
                  )}
                </div>
                <p className="compare-caption">
                  <strong>Initial Complaint:</strong> {proofModalIssue.description}
                </p>
              </div>

              {/* After Column */}
              <div className="compare-pane">
                <div className="pane-header">
                  <span className={`compare-badge ${proofModalIssue.afterImageUrl ? 'after' : 'pending'}`}>
                    {proofModalIssue.afterImageUrl ? 'AFTER (Municipal Fix Proof)' : 'AWAITING REPAIR PROOF'}
                  </span>
                  {proofModalIssue.resolvedAt && (
                    <span className="compare-date">{formatDate(proofModalIssue.resolvedAt)}</span>
                  )}
                </div>
                <div className="compare-img-wrap">
                  {proofModalIssue.afterImageUrl ? (
                    <img
                      src={proofModalIssue.afterImageUrl}
                      alt="After repair proof"
                      className="compare-img"
                    />
                  ) : (
                    <div className="compare-empty-state pending">
                      <IconClock size={36} />
                      <strong>Awaiting Resolution Evidence</strong>
                      <p>Authorized staff will upload photographic proof once repair work is completed.</p>
                    </div>
                  )}
                </div>
                <div className="compare-caption">
                  {proofModalIssue.status === 'Resolved' ? (
                    <>
                      <p><strong>Resolved By:</strong> {proofModalIssue.resolvedBy || 'Municipal Works Crew'}</p>
                      <p><strong>Resolution Notes:</strong> {proofModalIssue.resolutionNotes || 'Repaired and verified on-site.'}</p>
                    </>
                  ) : (
                    <p className="text-muted">Issue is currently <strong>{proofModalIssue.status}</strong>. Verification proof pending crew dispatch.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer-bar">
              <span className={`badge-status ${proofModalIssue.status.toLowerCase().replace(/\s+/g, '-')}`}>
                Status: {proofModalIssue.status}
              </span>
              <button className="btn btn-secondary" onClick={() => setProofModalIssue(null)}>
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Single Full-Size Image Preview */}
      {selectedImageModal && (
        <div className="modal-backdrop" onClick={() => setSelectedImageModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedImageModal(null)}>
              <IconX size={20} />
            </button>
            <img src={selectedImageModal} alt="Enlarged photo" className="modal-img" />
          </div>
        </div>
      )}
    </div>
  );
}
