const API_BASE_URL = 'http://localhost:5000/api';

/**
 * CivicLens API Client
 * Centralized fetch wrapper with robust error handling for network & validation errors.
 */

// Staff Token helpers (stored in localStorage/sessionStorage for persistent session across page refresh)
export function getStaffToken() {
  return localStorage.getItem('civiclens_staff_token') || '';
}

export function setStaffToken(token) {
  if (token) {
    localStorage.setItem('civiclens_staff_token', token);
  } else {
    localStorage.removeItem('civiclens_staff_token');
  }
}

export function getStoredStaffInfo() {
  try {
    const raw = localStorage.getItem('civiclens_staff_info');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredStaffInfo(info) {
  if (info) {
    localStorage.setItem('civiclens_staff_info', JSON.stringify(info));
  } else {
    localStorage.removeItem('civiclens_staff_info');
  }
}

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error(`Health check failed (${res.status})`);
    return await res.json();
  } catch (err) {
    console.error('API Error checkBackendHealth:', err);
    throw err;
  }
}

export async function staffLogin(username, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/staff-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed.');
    }
    setStaffToken(data.token);
    setStoredStaffInfo(data.staff);
    return data;
  } catch (err) {
    console.error('API Error staffLogin:', err);
    throw err;
  }
}

export function staffLogout() {
  setStaffToken('');
  setStoredStaffInfo(null);
}

export async function fetchStats() {
  try {
    const res = await fetch(`${API_BASE_URL}/stats`);
    if (!res.ok) throw new Error(`Failed to load stats (${res.status})`);
    return await res.json();
  } catch (err) {
    console.error('API Error fetchStats:', err);
    throw err;
  }
}

export async function fetchIssues(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.status && filters.status !== 'All') params.append('status', filters.status);
    if (filters.priority && filters.priority !== 'All') params.append('priority', filters.priority);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);

    const queryString = params.toString();
    const url = queryString ? `${API_BASE_URL}/issues?${queryString}` : `${API_BASE_URL}/issues`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load issues (${res.status})`);
    return await res.json();
  } catch (err) {
    console.error('API Error fetchIssues:', err);
    throw err;
  }
}

export async function createIssue(payload) {
  try {
    let options = {};
    if (payload instanceof FormData) {
      options = {
        method: 'POST',
        body: payload
      };
    } else {
      options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      };
    }

    const res = await fetch(`${API_BASE_URL}/issues`, options);
    const data = await res.json();

    if (!res.ok) {
      const error = new Error(data.error || 'Failed to submit issue report.');
      error.status = res.status;
      error.resolvedDuplicate = Boolean(data.resolvedDuplicate);
      error.duplicateType = data.duplicateType || null;
      error.existingIssue = data.existingIssue || null;
      throw error;
    }

    return data;
  } catch (err) {
    console.error('API Error createIssue:', err);
    throw err;
  }
}

export async function reopenIssue(issueId, payload = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}/issues/${issueId}/reopen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to reopen issue.');
    }
    return data;
  } catch (err) {
    console.error('API Error reopenIssue:', err);
    throw err;
  }
}

export async function recordAdditionalReport(issueId, reporterId) {
  try {
    const res = await fetch(`${API_BASE_URL}/issues/${issueId}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reporterId })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to record additional report.');
    }
    return data;
  } catch (err) {
    console.error('API Error recordAdditionalReport:', err);
    throw err;
  }
}

export async function updateIssueScores(issueId, scores) {
  try {
    const token = getStaffToken();
    const res = await fetch(`${API_BASE_URL}/issues/${issueId}/scores`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(scores)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update priority scores.');
    }
    return data;
  } catch (err) {
    console.error('API Error updateIssueScores:', err);
    throw err;
  }
}

export async function updateIssueStatus(issueId, status) {
  try {
    const token = getStaffToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/issues/${issueId}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update issue status.');
    }
    return data;
  } catch (err) {
    console.error('API Error updateIssueStatus:', err);
    throw err;
  }
}

export async function resolveIssueWithProof(issueId, payload) {
  try {
    const token = getStaffToken();
    let options = {};
    if (payload instanceof FormData) {
      options = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: payload
      };
    } else {
      options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      };
    }

    const res = await fetch(`${API_BASE_URL}/issues/${issueId}/resolve`, options);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to submit resolution evidence.');
    }

    return data;
  } catch (err) {
    console.error('API Error resolveIssueWithProof:', err);
    throw err;
  }
}

export async function seedSampleData() {
  try {
    const res = await fetch(`${API_BASE_URL}/seed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to seed sample data');
    return await res.json();
  } catch (err) {
    console.error('API Error seedSampleData:', err);
    throw err;
  }
}
