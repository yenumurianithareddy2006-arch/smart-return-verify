import React from 'react';
import { 
  IconAlert, 
  IconClock, 
  IconCheckCircle, 
  IconList, 
  IconPlus, 
  IconArrowRight, 
  IconPin, 
  IconDashboard,
  IconMap,
  IconUsers,
  IconFlame,
  getCategoryIcon 
} from './Icons';

export default function Overview({ stats, recentIssues, setActiveTab, onRefresh }) {
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
    <div className="overview-page">
      {/* Hero Section */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-pill">Community Civic Action & Prioritization Platform</span>
          <h1 className="hero-heading">Making Our Cities Better, One Report at a Time.</h1>
          <p className="hero-subtext">
            CivicLens automatically ranks civic issues by the number of unique citizens affected, severity, and urgency.
            Explore neighborhood hazards on an interactive GIS map and verify before-and-after photographic resolution proofs.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => setActiveTab('report')}>
              <IconPlus size={20} />
              <span>Report an Issue</span>
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => setActiveTab('map')}>
              <IconMap size={20} />
              <span>Interactive Issue Map</span>
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => setActiveTab('issues')}>
              <IconList size={20} />
              <span>Explore Public Reports</span>
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => setActiveTab('admin')} style={{ color: 'white' }}>
              <IconDashboard size={20} />
              <span>Admin Console</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4 Key Statistics Cards */}
      <section className="stats-section">
        <div className="stat-card stat-total">
          <div className="stat-icon-wrapper blue">
            <IconList size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Issues</span>
            <span className="stat-value">{stats?.total ?? 0}</span>
            <span className="stat-hint">Active municipal logs</span>
          </div>
        </div>

        <div className="stat-card stat-high">
          <div className="stat-icon-wrapper red">
            <IconFlame size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Critical & High Priority</span>
            <span className="stat-value">{stats?.highPriority ?? 0}</span>
            <span className="stat-hint">Safety hazards & high impact</span>
          </div>
        </div>

        <div className="stat-card stat-progress">
          <div className="stat-icon-wrapper amber">
            <IconClock size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">In Progress</span>
            <span className="stat-value">{stats?.inProgress ?? 0}</span>
            <span className="stat-hint">Crews dispatched on-site</span>
          </div>
        </div>

        <div className="stat-card stat-resolved">
          <div className="stat-icon-wrapper green">
            <IconCheckCircle size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Verified Resolved</span>
            <span className="stat-value">{stats?.resolved ?? 0}</span>
            <span className="stat-hint">With photographic proof</span>
          </div>
        </div>
      </section>

      {/* Feature 1: Mathematical Formula & Triage Architecture */}
      <section className="info-banner-card">
        <div className="info-banner-header">
          <div className="info-tag">Authoritative Ranking Algorithm</div>
          <h3>Smart Priority Score Formula</h3>
          <p>
            Issues are authoritatively calculated and ranked on the backend based on three weighted factors:
          </p>
          <div className="formula-display-box">
            <code>Priority Score = (0.5 &times; Impact) + (0.3 &times; Severity) + (0.2 &times; Urgency)</code>
            <span className="formula-sub">where <code>Impact Score = Min((Unique Reporters / 50) &times; 100, 100)</code></span>
          </div>
        </div>
        <div className="rule-grid">
          <div className="rule-item">
            <div className="rule-badge high">50% Impact Weight</div>
            <strong>Unique Affected Citizens</strong>
            <p>Every unique person who reports an issue increases its impact score up to a community saturation threshold of 50 people.</p>
          </div>
          <div className="rule-item">
            <div className="rule-badge medium">30% Severity Weight</div>
            <strong>Structural Damage (0 - 100)</strong>
            <p>Assesses the physical intensity of road breakdown, pipe bursts, or garbage accumulation.</p>
          </div>
          <div className="rule-item">
            <div className="rule-badge escalate">20% Urgency Weight</div>
            <strong>Time Sensitivity (0 - 100)</strong>
            <p>Imminence of traffic interruption, night-time darkness hazards, or environmental flooding.</p>
          </div>
          <div className="rule-item">
            <div className="rule-badge duplicate">Emergency Override</div>
            <strong>Safety Hazard Escalation</strong>
            <p>Emergency safety triggers (*"accident"*, *"dangerous"*, *"injury"*) rank hazards at the absolute top of the queue.</p>
          </div>
        </div>
      </section>

      {/* Recent Issues Section */}
      <section className="recent-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Highest Priority Community Reports</h2>
            <p className="section-subtitle">Real-time issues ranked dynamically by affected citizens and safety urgency</p>
          </div>
          <button className="btn btn-ghost" onClick={() => setActiveTab('issues')}>
            <span>View All ({stats?.total ?? 0})</span>
            <IconArrowRight size={16} />
          </button>
        </div>

        {(!recentIssues || recentIssues.length === 0) ? (
          <div className="empty-card">
            <p>No community issues reported yet.</p>
            <button className="btn btn-primary" onClick={() => setActiveTab('report')}>
              Be the first to report an issue
            </button>
          </div>
        ) : (
          <div className="recent-grid">
            {recentIssues.slice(0, 3).map((issue) => (
              <div key={issue.id} className="issue-preview-card">
                <div className="preview-top">
                  <div className="category-pill">
                    {getCategoryIcon(issue.category, 16)}
                    <span>{issue.category}</span>
                  </div>
                  <div className="preview-badges">
                    {issue.isEmergency && (
                      <span className="badge-emergency">
                        <IconFlame size={11} /> Emergency
                      </span>
                    )}
                    <span className={`badge-priority ${issue.priority.toLowerCase()}`}>
                      {issue.priority} Priority
                    </span>
                  </div>
                </div>

                <div className="preview-score-row">
                  <span className="preview-score-tag">Score: <strong>{issue.priorityScore}</strong>/100</span>
                  <span className="preview-reporters-tag">
                    <IconUsers size={12} /> {issue.uniqueReporterCount} Unique Reporter{issue.uniqueReporterCount > 1 ? 's' : ''}
                  </span>
                </div>

                <h4 className="preview-location">
                  <IconPin size={15} />
                  <span>{issue.location}</span>
                </h4>

                <p className="preview-desc">{issue.description}</p>

                {issue.beforeImageUrl || issue.imageUrl ? (
                  <div className="preview-image-wrap">
                    <img src={issue.beforeImageUrl || issue.imageUrl} alt={issue.category} className="preview-thumbnail" />
                  </div>
                ) : null}

                <div className="preview-footer">
                  <span className={`badge-status ${issue.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {issue.status}
                  </span>
                  <span className="preview-date">{formatDate(issue.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
