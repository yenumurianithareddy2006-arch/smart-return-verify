import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Overview from './components/Overview';
import IssueMap from './components/IssueMap';
import ReportIssue from './components/ReportIssue';
import IssueList from './components/IssueList';
import AdminDashboard from './components/AdminDashboard';
import { checkBackendHealth, fetchStats, fetchIssues } from './api';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [backendOnline, setBackendOnline] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    highPriority: 0,
    reported: 0,
    inProgress: 0,
    resolved: 0,
    emergencyCount: 0,
    mappedIssuesCount: 0,
    verifiedResolutionsCount: 0
  });
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState(null);
  const [selectedIssueForProof, setSelectedIssueForProof] = useState(null);

  // Load all data from backend
  const loadData = useCallback(async () => {
    setLoading(true);
    setGlobalError(null);

    try {
      // 1. Health check
      await checkBackendHealth();
      setBackendOnline(true);

      // 2. Fetch stats and issues concurrently
      const [statsData, issuesData] = await Promise.all([
        fetchStats(),
        fetchIssues()
      ]);

      setStats(statsData);
      setIssues(issuesData);
    } catch (err) {
      console.warn('Backend connection error:', err);
      setBackendOnline(false);
      setGlobalError(
        'Unable to reach CivicLens backend at http://localhost:5000. Ensure server is running (`cd backend && npm start`).'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load on mount
  useEffect(() => {
    loadData();

    // Periodic health check ping every 15 seconds
    const interval = setInterval(async () => {
      try {
        await checkBackendHealth();
        setBackendOnline(true);
      } catch {
        setBackendOnline(false);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [loadData]);

  // Handler when a new issue is submitted
  const handleIssueCreated = (newIssue) => {
    loadData();
  };

  // Handler when an issue status or score is updated
  const handleStatusUpdated = (updatedIssue) => {
    setIssues((prev) =>
      prev.map((i) => (i.id === updatedIssue.id ? updatedIssue : i))
    );
    fetchStats().then(setStats).catch(console.error);
  };

  return (
    <div className="app-layout">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendOnline}
        onRefreshAll={loadData}
      />

      {/* Global Connection Warning */}
      {!backendOnline && !loading && (
        <div className="global-alert-strip">
          <div className="alert-strip-content">
            <span className="strip-icon">⚠️</span>
            <span>
              <strong>Backend Disconnected:</strong> Cannot connect to <code>http://localhost:5000/api</code>.
              Start backend server with: <code>cd backend && npm start</code>
            </span>
            <button className="btn btn-sm btn-outline-light" onClick={loadData}>
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'overview' && (
          <Overview
            stats={stats}
            recentIssues={issues}
            setActiveTab={setActiveTab}
            onRefresh={loadData}
          />
        )}

        {activeTab === 'map' && (
          <IssueMap
            issues={issues}
            onRefresh={loadData}
            setActiveTab={setActiveTab}
            onSelectIssue={(issue) => setSelectedIssueForProof(issue)}
          />
        )}

        {activeTab === 'report' && (
          <ReportIssue
            onIssueCreated={handleIssueCreated}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'issues' && (
          <IssueList
            issues={issues}
            loading={loading}
            onRefresh={loadData}
            setActiveTab={setActiveTab}
            initialSelectedIssue={selectedIssueForProof}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            issues={issues}
            stats={stats}
            onRefresh={loadData}
            onStatusUpdated={handleStatusUpdated}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-left">
            <strong>CivicLens</strong> — Smart Civic Issue Prioritization & Management System
            <span className="footer-badge">Capstone Full-Stack Prototype</span>
          </div>
          <div className="footer-right">
            <span>Authoritative Smart Priority</span>
            <span>•</span>
            <span>Leaflet GIS Issue Map</span>
            <span>•</span>
            <span>Before & After Proof Verification</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
