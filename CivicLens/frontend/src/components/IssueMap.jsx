import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  IconPin, 
  IconUsers, 
  IconAlert, 
  IconCheckCircle, 
  IconFilter, 
  IconRefresh, 
  IconX,
  IconFlame,
  getCategoryIcon 
} from './Icons';

// Color map for categories
const CATEGORY_COLORS = {
  'Pothole': '#ea580c',        // Orange
  'Water Leakage': '#0284c7',  // Blue/Teal
  'Water Leak': '#0284c7',
  'Garbage': '#7c3aed',        // Purple
  'Streetlight': '#eab308'     // Amber
};

// Create custom distinguishable Leaflet DivIcon for each category and priority
function createCustomMarkerIcon(issue) {
  const color = issue.isEmergency ? '#dc2626' : (CATEGORY_COLORS[issue.category] || '#0d9488');
  const catLetter = issue.category ? issue.category.charAt(0).toUpperCase() : 'C';

  const html = `
    <div class="custom-map-marker ${issue.isEmergency ? 'marker-emergency' : ''}" style="background-color: ${color};">
      <div class="marker-inner">
        <span class="marker-letter">${catLetter}</span>
      </div>
      <div class="marker-pulse" style="border-color: ${color};"></div>
      <div class="marker-tip" style="border-top-color: ${color};"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'leaflet-custom-marker-wrapper',
    iconSize: [34, 42],
    iconAnchor: [17, 42],
    popupAnchor: [0, -42]
  });
}

// Child component to fit map bounds to markers
function MapBoundsAdjuster({ issues }) {
  const map = useMap();

  useEffect(() => {
    if (!issues || issues.length === 0) return;
    const coords = issues
      .filter(i => typeof i.latitude === 'number' && typeof i.longitude === 'number')
      .map(i => [i.latitude, i.longitude]);

    if (coords.length === 1) {
      map.setView(coords[0], 14, { animate: true });
    } else if (coords.length > 1) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true });
    }
  }, [issues, map]);

  return null;
}

export default function IssueMap({ issues, onRefresh, setActiveTab, onSelectIssue }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [showResolved, setShowResolved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Pothole', 'Garbage', 'Streetlight', 'Water Leakage'];
  const priorities = ['All', 'Critical', 'High', 'Medium', 'Low'];

  // Filter issues for the map
  const mappedIssues = useMemo(() => {
    if (!issues) return [];
    return issues.filter(issue => {
      // Must have valid coordinates
      const hasCoords = typeof issue.latitude === 'number' && typeof issue.longitude === 'number';
      if (!hasCoords) return false;

      // Status: unresolved by default
      if (!showResolved && issue.status === 'Resolved') return false;

      // Category filter
      if (selectedCategory !== 'All') {
        const catNorm = (issue.category || '').toLowerCase();
        const selNorm = selectedCategory.toLowerCase();
        if (selNorm.includes('water') && catNorm.includes('water')) {
          // match both Water Leak and Water Leakage
        } else if (catNorm !== selNorm) {
          return false;
        }
      }

      // Priority filter
      if (selectedPriority !== 'All') {
        if (selectedPriority === 'Critical' && !issue.isEmergency) return false;
        if (selectedPriority !== 'Critical' && issue.priority !== selectedPriority) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchLoc = (issue.location || '').toLowerCase().includes(q);
        const matchDesc = (issue.description || '').toLowerCase().includes(q);
        const matchId = (issue.id || '').toLowerCase().includes(q);
        if (!matchLoc && !matchDesc && !matchId) return false;
      }

      return true;
    });
  }, [issues, selectedCategory, selectedPriority, showResolved, searchQuery]);

  // Count unmapped issues
  const unmappedCount = useMemo(() => {
    if (!issues) return 0;
    return issues.filter(i => i.latitude === null || i.longitude === null).length;
  }, [issues]);

  // Default center if no coordinates
  const defaultCenter = [12.9716, 77.5946]; // City Center

  return (
    <div className="map-view-page">
      <div className="page-header-row">
        <div>
          <span className="badge-category-count">Interactive GIS Portal</span>
          <h2 className="page-title">Geographic Civic Issue Map</h2>
          <p className="page-subtitle">
            Visual spatial distribution of reported municipal problems. Prioritized by affected citizens, severity, and urgency.
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={onRefresh} title="Refresh map issues">
            <IconRefresh size={16} />
            <span>Refresh Map</span>
          </button>
        </div>
      </div>

      {/* Map Control Bar & Filters */}
      <div className="filter-card map-filter-bar">
        <div className="map-filter-row">
          {/* Category Filter */}
          <div className="filter-select-group">
            <label className="filter-label">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="filter-select-group">
            <label className="filter-label">Priority</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="filter-select"
            >
              {priorities.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Unresolved / Resolved Toggle */}
          <div className="filter-toggle-group">
            <label className="toggle-switch-label">
              <input
                type="checkbox"
                checked={showResolved}
                onChange={(e) => setShowResolved(e.target.checked)}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-text">Include Resolved ({issues?.filter(i => i.status === 'Resolved' && i.latitude !== null).length || 0})</span>
            </label>
          </div>

          {/* Search box */}
          <div className="map-search-box">
            <input
              type="text"
              placeholder="Filter by street or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-sm"
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                <IconX size={14} />
              </button>
            )}
          </div>

          <div className="map-counter-pill">
            Showing <strong>{mappedIssues.length}</strong> active markers on map
          </div>
        </div>

        {/* Legend */}
        <div className="map-legend">
          <span className="legend-title">Legend:</span>
          <div className="legend-item">
            <span className="legend-badge" style={{ backgroundColor: '#ea580c' }}>P</span>
            <span>Pothole</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge" style={{ backgroundColor: '#0284c7' }}>W</span>
            <span>Water Leak</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge" style={{ backgroundColor: '#7c3aed' }}>G</span>
            <span>Garbage</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge" style={{ backgroundColor: '#eab308' }}>S</span>
            <span>Streetlight</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge" style={{ backgroundColor: '#dc2626' }}>!</span>
            <span>Emergency Hazard</span>
          </div>
        </div>
      </div>

      {/* Notice about unmapped legacy reports if any */}
      {unmappedCount > 0 && (
        <div className="map-unmapped-banner">
          <div className="banner-left">
            <span className="banner-icon">ℹ️</span>
            <span>
              <strong>Note:</strong> {unmappedCount} older report(s) without GPS coordinates are preserved in the database and accessible via the <strong>All Issues</strong> list without inventing artificial coordinates.
            </span>
          </div>
          <button className="btn btn-sm btn-ghost" onClick={() => setActiveTab('issues')}>
            View All Issues List
          </button>
        </div>
      )}

      {/* Leaflet Map Container */}
      <div className="map-canvas-container">
        <MapContainer
          center={defaultCenter}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '620px', width: '100%', borderRadius: '12px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapBoundsAdjuster issues={mappedIssues} />

          {mappedIssues.map((issue) => (
            <Marker
              key={issue.id}
              position={[issue.latitude, issue.longitude]}
              icon={createCustomMarkerIcon(issue)}
            >
              <Popup className="civic-map-popup">
                <div className="popup-card">
                  <div className="popup-header">
                    <div className="popup-cat-tag">
                      {getCategoryIcon(issue.category, 15)}
                      <span>{issue.category}</span>
                    </div>
                    {issue.isEmergency ? (
                      <span className="badge-priority high" style={{ background: '#fee2e2', color: '#991b1b' }}>
                        <IconFlame size={12} /> Emergency
                      </span>
                    ) : (
                      <span className={`badge-priority ${issue.priority?.toLowerCase()}`}>
                        {issue.priority}
                      </span>
                    )}
                  </div>

                  <h4 className="popup-location">
                    <IconPin size={14} />
                    <span>{issue.location}</span>
                  </h4>

                  <p className="popup-desc">{issue.description}</p>

                  <div className="popup-metrics">
                    <div className="metric-pill">
                      <IconUsers size={13} />
                      <span><strong>{issue.uniqueReporterCount}</strong> Unique Reporter{issue.uniqueReporterCount > 1 ? 's' : ''}</span>
                    </div>
                    <div className="metric-pill priority-pill">
                      <span>Priority: <strong>{issue.priorityScore}</strong>/100</span>
                    </div>
                  </div>

                  <div className="popup-footer">
                    <span className={`badge-status ${issue.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                      {issue.status}
                    </span>
                    <button
                      className="btn-popup-action"
                      onClick={() => {
                        if (onSelectIssue) onSelectIssue(issue);
                        setActiveTab('issues');
                      }}
                    >
                      View Details & Proof
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
