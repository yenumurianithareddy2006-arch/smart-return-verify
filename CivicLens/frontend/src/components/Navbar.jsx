import React from 'react';
import { 
  IconLogo, 
  IconHome, 
  IconMap, 
  IconPlus, 
  IconList, 
  IconDashboard, 
  IconRefresh 
} from './Icons';

export default function Navbar({ activeTab, setActiveTab, backendStatus, onRefreshAll }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: <IconHome size={18} /> },
    { id: 'map', label: 'Issue Map', icon: <IconMap size={18} /> },
    { id: 'report', label: 'Report an Issue', icon: <IconPlus size={18} /> },
    { id: 'issues', label: 'All Issues', icon: <IconList size={18} /> },
    { id: 'admin', label: 'Admin Triage', icon: <IconDashboard size={18} /> },
  ];

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Brand */}
        <div className="nav-brand" onClick={() => setActiveTab('overview')} role="button" tabIndex={0}>
          <div className="brand-icon">
            <IconLogo size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-title">CivicLens</span>
            <span className="brand-badge">Smart Civic Prioritization</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-links">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-button ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Backend Status indicator */}
        <div className="nav-status">
          <div className={`status-pill ${backendStatus ? 'online' : 'offline'}`}>
            <span className="pulse-dot"></span>
            <span>{backendStatus ? 'API Connected (5000)' : 'Connecting to API...'}</span>
          </div>
          <button 
            className="btn-icon-subtle" 
            onClick={onRefreshAll} 
            title="Refresh System Data"
            aria-label="Refresh data"
          >
            <IconRefresh size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
