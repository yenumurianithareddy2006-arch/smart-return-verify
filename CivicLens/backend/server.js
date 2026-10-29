const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 5000;
const STAFF_AUTH_SECRET = process.env.STAFF_SECRET || 'CivicLens-Secure-Secret-2026-Municipal-Works';

// Storage directories
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'issues.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure directories exist
function ensureDirectories() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
  } catch (err) {
    console.error('[Storage Error] Failed to initialize directories:', err);
  }
}
ensureDirectories();

// Multer Storage Configuration (Secure File Uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureDirectories();
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    // Generate safe, unguessable filenames to prevent path traversal
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? ext : '.jpg';
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
    cb(null, `proof-${uniqueSuffix}${safeExt}`);
  }
});

// File filter: restrict to valid image MIME types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB maximum
  }
});

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://civiclens-ghsiy6hdf-yenumurianithareddy2006-arch.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Staff-Token']
}));

app.use(express.json());
// Serve uploaded images statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Allowed categories and statuses
const VALID_CATEGORIES = ['Pothole', 'Garbage', 'Streetlight', 'Water Leakage', 'Water Leak'];
const VALID_STATUSES = ['Reported', 'In Progress', 'Resolved'];

// Safety keywords that indicate immediate safety risks
const SAFETY_KEYWORDS = ['accident', 'dangerous', 'danger', 'injury', 'injuries', 'hazard', 'emergency', 'collapse', 'severe'];

/**
 * Evaluates whether an issue description represents a genuine immediate threat
 * to human life or public safety (e.g. catastrophic road/bridge collapse, gas leaks,
 * downed live power lines, major vehicle collisions with casualties, or imminent life threats).
 * 
 * Correctly avoids triggering on generic everyday complaint keywords (e.g. "dangerous sudden braking",
 * "pothole hazard", "could be dangerous") and rigorously rejects negated statements
 * (e.g. "no immediate danger", "not dangerous", "no risk", "no hazard", "no accident").
 */
function checkSafetyEmergency(text) {
  if (!text || typeof text !== 'string') {
    return { isEmergency: false, reason: '' };
  }

  const textLower = text.toLowerCase().trim();

  // 1. Comprehensive Negation Check: Any phrase explicitly negating an emergency
  const negationPattern = /\b(no|not|never|without|isn't|isnt|aren't|arent|hardly|little|low|zero|prevent(?:s|ed|ing)?)\s+(?:\w+\s+){0,3}(immediate danger|threat to life|danger|hazard|emergency|accident|injur(?:y|ies|ed)|collapse|risk|harm|casualt(?:y|ies))\b/i;

  const clauses = textLower.split(/[.,;!?\n\r]+/);

  // 2. Genuine Life-Threatening & Catastrophic Emergency Patterns
  // Only genuine threats to life or catastrophic hazards warrant an automatic Critical override
  const lifeThreatPatterns = [
    // Structural Collapse / Sinkhole
    { regex: /\b(road collapsed?|bridge collapse|building collapse|sinkhole|ground collapse|cave[- ]in)\b/i, label: 'Catastrophic structural collapse' },
    // Hazardous Leaks & Electrocution
    { regex: /\b(gas leak|gas explosion|active explosion|live (?:power )?wire|downed power line|electrocution hazard|active fire outbreak)\b/i, label: 'Hazardous leak or electrical hazard' },
    // Severe Vehicular Collision / Fatalities
    { regex: /\b(fatal accident|fatalities|casualt(?:y|ies)|car crash|head[- ]on collision|multiple vehicle collision|severe car accident|ambulance dispatched)\b/i, label: 'Severe collision or casualty' },
    // Explicit Life Threat
    { regex: /\b(threat to life|life[- ]threatening|immediate danger to life|immediate threat to life)\b/i, label: 'Immediate threat to life' }
  ];

  for (const clause of clauses) {
    const trimmedClause = clause.trim();
    if (!trimmedClause) continue;

    // If clause contains a negation, do not treat as emergency
    if (negationPattern.test(trimmedClause)) {
      continue;
    }

    for (const item of lifeThreatPatterns) {
      if (item.regex.test(trimmedClause)) {
        const match = trimmedClause.match(item.regex)[0];
        return {
          isEmergency: true,
          reason: `Immediate life safety hazard detected: "${match}" (${item.label})`
        };
      }
    }
  }

  return { isEmergency: false, reason: '' };
}

/**
 * Checks whether text contains explicit negated emergency keywords (e.g. "no immediate danger", "not dangerous")
 */
function hasNegatedEmergencyKeyword(text) {
  if (!text || typeof text !== 'string') return false;
  const negationPattern = /\b(no|not|never|without|isn't|isnt|aren't|arent|hardly|little|low|zero|prevent(?:s|ed|ing)?)\s+(?:\w+\s+){0,3}(immediate danger|threat to life|danger|hazard|emergency|accident|injur(?:y|ies|ed)|collapse|risk|harm|casualt(?:y|ies))\b/i;
  return negationPattern.test(text.toLowerCase());
}

/**
 * Normalizes category string
 */
function normalizeCategory(category) {
  if (!category || typeof category !== 'string') return '';
  const trimmed = category.trim().toLowerCase();
  if (trimmed === 'water leak') return 'water leakage';
  return trimmed;
}

/**
 * Normalizes location string: trims, lowercases, collapses whitespace, removes trailing/interior punctuation
 */
function normalizeLocation(loc) {
  if (!loc || typeof loc !== 'string') return '';
  return loc
    .toLowerCase()
    .trim()
    .replace(/[,\.\-\;\:\#\/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Computes Haversine distance between two coordinates in kilometers
 */
function calculateCoordinateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 === null || lon1 === null || lat2 === null || lon2 === null ||
      lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return null;
  }
  const nLat1 = Number(lat1);
  const nLon1 = Number(lon1);
  const nLat2 = Number(lat2);
  const nLon2 = Number(lon2);
  if (isNaN(nLat1) || isNaN(nLon1) || isNaN(nLat2) || isNaN(nLon2)) {
    return null;
  }
  const R = 6371; // Earth's radius in km
  const dLat = (nLat2 - nLat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(nLat1 * (Math.PI / 180)) * Math.cos(nLat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Computes word set similarity (Jaccard) between two strings
 */
function calculateStringSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;
  const s1 = normalizeLocation(str1);
  const s2 = normalizeLocation(str2);
  if (s1 === s2) return 1.0;
  const words1 = new Set(s1.split(' ').filter(w => w.length > 1));
  const words2 = new Set(s2.split(' ').filter(w => w.length > 1));
  if (words1.size === 0 || words2.size === 0) return 0;
  let common = 0;
  for (const w of words1) {
    if (words2.has(w)) common++;
  }
  return common / Math.max(words1.size, words2.size);
}

/**
 * Scans existing issues for exact duplicates or potential similar duplicates
 */
function findDuplicateMatch(newReport, issues) {
  const normCategory = normalizeCategory(newReport.category);
  const normLocation = normalizeLocation(newReport.location);
  const hasCoords = typeof newReport.latitude === 'number' && typeof newReport.longitude === 'number' &&
                    !isNaN(newReport.latitude) && !isNaN(newReport.longitude);

  let exactMatch = null;
  let possibleMatch = null;

  for (const issue of issues) {
    const issueCategory = normalizeCategory(issue.category);
    // Categories must match
    if (normCategory !== issueCategory) {
      continue;
    }

    const issueLocation = normalizeLocation(issue.location);
    const issueHasCoords = typeof issue.latitude === 'number' && typeof issue.longitude === 'number' &&
                           !isNaN(issue.latitude) && !isNaN(issue.longitude);

    let isExact = false;
    let distanceKm = null;

    if (hasCoords && issueHasCoords) {
      distanceKm = calculateCoordinateDistanceKm(
        newReport.latitude,
        newReport.longitude,
        issue.latitude,
        issue.longitude
      );
      // Within 80 meters (0.08 km)
      if (distanceKm !== null && distanceKm <= 0.08) {
        isExact = true;
      }
    }

    if (!isExact && normLocation && issueLocation) {
      if (normLocation === issueLocation) {
        isExact = true;
      }
    }

    if (isExact) {
      // If multiple exact matches exist, prefer unresolved match over resolved match
      if (!exactMatch) {
        exactMatch = issue;
      } else if (exactMatch.status === 'Resolved' && issue.status !== 'Resolved') {
        exactMatch = issue;
      }
      continue;
    }

    // Check possible duplicate (similar location or nearby coordinates, but not identical)
    if (!exactMatch && !possibleMatch) {
      const locSimilarity = calculateStringSimilarity(newReport.location, issue.location);
      const isNearby = distanceKm !== null && distanceKm <= 0.25; // 250 meters
      if (locSimilarity >= 0.65 || isNearby) {
        possibleMatch = issue;
      }
    }
  }

  return { exactMatch, possibleMatch };
}

// Staff accounts configuration for authorized triage and resolution
const STAFF_ACCOUNTS = [
  {
    username: 'staff_admin',
    password: 'CivicStaff@2026',
    name: 'Officer R. Sharma',
    department: 'Municipal Works & Dispatch',
    role: 'staff_admin'
  },
  {
    username: 'inspector_kumar',
    password: 'CivicStaff@2026',
    name: 'Inspector A. Kumar',
    department: 'Civic Infrastructure Bureau',
    role: 'staff_admin'
  }
];

// -----------------------------------------------------------------------------
// Authentication Helpers (HMAC Signed Tokens)
// -----------------------------------------------------------------------------
function generateStaffToken(staff) {
  const payload = {
    username: staff.username,
    name: staff.name,
    role: staff.role,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', STAFF_AUTH_SECRET).update(payloadStr).digest('base64url');
  return `${payloadStr}.${signature}`;
}

function verifyStaffToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    return null;
  }
  const [payloadStr, signature] = token.split('.');
  const expectedSig = crypto.createHmac('sha256', STAFF_AUTH_SECRET).update(payloadStr).digest('base64url');
  if (signature !== expectedSig) {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf-8'));
    if (Date.now() > payload.expiresAt) {
      return null;
    }
    return payload;
  } catch (err) {
    return null;
  }
}

// Staff Authorization Middleware
function requireStaffAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const customHeader = req.headers['x-staff-token'];
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else if (customHeader) {
    token = customHeader.trim();
  }

  if (!token) {
    return res.status(401).json({
      error: 'Authentication required. Only authorized municipal staff can perform this action.'
    });
  }

  const staff = verifyStaffToken(token);
  if (!staff) {
    return res.status(403).json({
      error: 'Invalid or expired staff session. Please log in again.'
    });
  }

  req.staff = staff;
  next();
}

// -----------------------------------------------------------------------------
// Scoring & Calculations (Feature 1: Smart Priority Ranking)
// -----------------------------------------------------------------------------

/**
 * Calculates impact score, priority score, and priority badge.
 * Formula:
 *   impactScore = Math.min((uniqueReporterCount / 50) * 100, 100)
 *   priorityScore = (0.5 * impactScore) + (0.3 * severity) + (0.2 * urgency)
 * 
 * Score Thresholds:
 *   - Emergency Escalation: 'Critical' (ranks above all standard issues)
 *   - Priority Score >= 70: 'High'
 *   - Priority Score >= 40 and < 70: 'Medium'
 *   - Priority Score < 40: 'Low'
 */
function calculateSmartPriority(uniqueReporterCount, severity, urgency, isEmergency = false) {
  const count = Math.max(1, Number(uniqueReporterCount) || 1);
  const sev = Math.max(0, Math.min(100, Number(severity) || 50));
  const urg = Math.max(0, Math.min(100, Number(urgency) || 50));

  const impactScore = Math.min((count / 50) * 100, 100);
  const priorityScore = (0.5 * impactScore) + (0.3 * sev) + (0.2 * urg);

  let priorityLabel = 'Low';
  if (isEmergency) {
    priorityLabel = 'Critical';
  } else if (priorityScore >= 70) {
    priorityLabel = 'High';
  } else if (priorityScore >= 40) {
    priorityLabel = 'Medium';
  } else {
    priorityLabel = 'Low';
  }

  return {
    impactScore: Number(impactScore.toFixed(1)),
    priorityScore: Number(priorityScore.toFixed(1)),
    priorityLabel
  };
}

/**
 * Derives default severity and urgency when an issue is first created.
 * Uses negation-aware safety emergency detection.
 */
function getDefaultSeverityAndUrgency(category, description) {
  const emergencyCheck = checkSafetyEmergency(description);

  if (emergencyCheck.isEmergency) {
    return {
      severity: 85,
      urgency: 85,
      isEmergency: true,
      emergencyReason: emergencyCheck.reason
    };
  }

  switch (category) {
    case 'Water Leakage':
    case 'Water Leak':
      return { severity: 75, urgency: 70, isEmergency: false, emergencyReason: '' };
    case 'Pothole':
      return { severity: 70, urgency: 65, isEmergency: false, emergencyReason: '' };
    case 'Garbage':
      return { severity: 50, urgency: 50, isEmergency: false, emergencyReason: '' };
    case 'Streetlight':
      return { severity: 50, urgency: 50, isEmergency: false, emergencyReason: '' };
    default:
      return { severity: 40, urgency: 40, isEmergency: false, emergencyReason: '' };
  }
}

// -----------------------------------------------------------------------------
// Database Persistence & Safe Migration
// -----------------------------------------------------------------------------

/**
 * Migrates and normalizes an issue record to guarantee all required schema fields exist.
 */
function migrateIssue(issue) {
  // Normalize category
  let category = issue.category || 'Pothole';
  if (category === 'Water Leak') category = 'Water Leakage';

  // Reporters array & unique count
  let reporters = Array.isArray(issue.reporters) ? issue.reporters : [];
  if (reporters.length === 0) {
    reporters = [issue.reporterId || 'REPORTER-INITIAL'];
  }
  // Deduplicate reporters
  reporters = Array.from(new Set(reporters));
  const uniqueReporterCount = reporters.length;

  // Severity, Urgency, and Emergency evaluation
  const defaultScores = getDefaultSeverityAndUrgency(category, issue.description);
  const severity = typeof issue.severity === 'number' ? issue.severity : defaultScores.severity;
  const urgency = typeof issue.urgency === 'number' ? issue.urgency : defaultScores.urgency;

  let isEmergency = typeof issue.isEmergency === 'boolean' ? issue.isEmergency : defaultScores.isEmergency;
  // If the issue was previously marked as an emergency, but the description clearly contains negated phrases ("not dangerous", "no risk")
  if (isEmergency && hasNegatedEmergencyKeyword(issue.description) && !checkSafetyEmergency(issue.description).isEmergency) {
    isEmergency = false;
  }

  // Compute calculated scores (mathematical formula strictly preserved)
  const scores = calculateSmartPriority(uniqueReporterCount, severity, urgency, isEmergency);

  return {
    id: issue.id,
    category,
    description: issue.description || '',
    location: issue.location || '',
    // Feature 2: Coordinates (null if not provided, never invented for legacy issues)
    latitude: typeof issue.latitude === 'number' ? issue.latitude : null,
    longitude: typeof issue.longitude === 'number' ? issue.longitude : null,
    // Feature 1: Smart ranking fields
    reporters,
    uniqueReporterCount,
    severity,
    urgency,
    impactScore: scores.impactScore,
    priorityScore: scores.priorityScore,
    priority: scores.priorityLabel,
    isEmergency,
    emergencyReason: issue.emergencyReason || (isEmergency ? 'Safety hazard detected in complaint description' : ''),
    status: issue.status || 'Reported',
    possibleDuplicate: Boolean(issue.possibleDuplicate),
    // Feature 3: Before and after resolution evidence
    imageUrl: issue.imageUrl || '',
    beforeImageUrl: issue.beforeImageUrl || issue.imageUrl || '',
    afterImageUrl: issue.afterImageUrl || '',
    resolvedAt: issue.resolvedAt || (issue.status === 'Resolved' ? issue.updatedAt || issue.createdAt : null),
    resolvedBy: issue.resolvedBy || (issue.status === 'Resolved' ? 'Municipal Works Crew' : null),
    resolutionNotes: issue.resolutionNotes || '',
    createdAt: issue.createdAt || new Date().toISOString(),
    updatedAt: issue.updatedAt || issue.createdAt || new Date().toISOString()
  };
}

async function readIssues() {
  ensureDirectories();
  try {
    const rawData = await fs.promises.readFile(DATA_FILE, 'utf-8');
    if (!rawData.trim()) {
      return [];
    }
    const parsed = JSON.parse(rawData);
    return Array.isArray(parsed) ? parsed.map(migrateIssue) : [];
  } catch (err) {
    console.error('[Storage Error] Failed to read or parse issues.json:', err);
    throw new Error('Database read failure. File might be corrupted.');
  }
}

async function writeIssues(issues) {
  ensureDirectories();
  try {
    const formattedJson = JSON.stringify(issues, null, 2);
    await fs.promises.writeFile(DATA_FILE, formattedJson, 'utf-8');
  } catch (err) {
    console.error('[Storage Error] Failed to write issues.json:', err);
    throw new Error('Database write failure.');
  }
}

// -----------------------------------------------------------------------------
// REST API Endpoints
// -----------------------------------------------------------------------------

// API 1: Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CivicLens backend is running smoothly',
    timestamp: new Date().toISOString(),
    features: ['smart-priority-ranking', 'location-based-map', 'before-after-resolution-proof'],
    dataFile: DATA_FILE
  });
});

// Staff Authentication Endpoint
app.post('/api/auth/staff-login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const staff = STAFF_ACCOUNTS.find(
    acc => acc.username.toLowerCase() === username.trim().toLowerCase() && acc.password === password
  );

  if (!staff) {
    return res.status(401).json({ error: 'Invalid staff credentials.' });
  }

  const token = generateStaffToken(staff);
  return res.json({
    message: 'Staff authentication successful',
    token,
    staff: {
      username: staff.username,
      name: staff.name,
      department: staff.department,
      role: staff.role
    }
  });
});

// Verify staff token
app.get('/api/auth/verify', requireStaffAuth, (req, res) => {
  res.json({
    authenticated: true,
    staff: req.staff
  });
});

// API 2: Create Issue / Report Issue
app.post('/api/issues', upload.single('image'), async (req, res) => {
  try {
    const body = req.body || {};
    let { category, description, location, imageUrl, reporterId, latitude, longitude, severity, urgency } = body;

    // Normalization
    if (category === 'Water Leak') category = 'Water Leakage';

    // Validation
    if (!category || !VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({
        error: `Invalid or missing category. Must be one of: Pothole, Garbage, Streetlight, Water Leakage`
      });
    }

    if (!description || typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({
        error: 'Description is required and cannot be empty.'
      });
    }

    if (!location || typeof location !== 'string' || !location.trim()) {
      return res.status(400).json({
        error: 'Location is required and cannot be empty.'
      });
    }

    // Feature 2: Coordinate validation
    let parsedLat = null;
    let parsedLng = null;
    if (latitude !== undefined && latitude !== null && latitude !== '') {
      parsedLat = Number(latitude);
      if (isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90) {
        return res.status(400).json({
          error: 'Invalid latitude. Must be a valid number between -90 and 90.'
        });
      }
    }
    if (longitude !== undefined && longitude !== null && longitude !== '') {
      parsedLng = Number(longitude);
      if (isNaN(parsedLng) || parsedLng < -180 || parsedLng > 180) {
        return res.status(400).json({
          error: 'Invalid longitude. Must be a valid number between -180 and 180.'
        });
      }
    }

    // Handle photo reference (uploaded file takes precedence over URL)
    let photoUrl = '';
    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    } else if (imageUrl && typeof imageUrl === 'string') {
      photoUrl = imageUrl.trim();
    }

    // Reporter Identifier
    const activeReporter = (reporterId && typeof reporterId === 'string' && reporterId.trim())
      ? reporterId.trim()
      : `CITIZEN-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const issues = await readIssues();

    // Use comprehensive backend duplicate detection (normalized category, location, and GPS proximity)
    const { exactMatch, possibleMatch } = findDuplicateMatch({
      category,
      location,
      latitude: parsedLat,
      longitude: parsedLng,
      description
    }, issues);

    const isRecurrence = body.isRecurrence === true || body.isRecurrence === 'true';

    // 1. EXACT DUPLICATE MATCH
    if (exactMatch) {
      // Subcase 1A: Existing issue is Resolved and has resolution photo uploaded
      if (exactMatch.status === 'Resolved' && Boolean(exactMatch.afterImageUrl)) {
        if (!isRecurrence) {
          // Block duplicate and return the exact required requirement message
          return res.status(409).json({
            error: 'This issue has already been resolved. Please check the resolution photo before submitting another report.',
            resolvedDuplicate: true,
            duplicateType: 'RESOLVED_WITH_PROOF',
            existingIssue: exactMatch
          });
        }

        // Subcase 1B: Citizen confirmed recurrence (problem returned / previous repair failed)
        const defaultVals = getDefaultSeverityAndUrgency(category, description);
        const issueSeverity = (typeof severity === 'number' && !isNaN(severity)) ? Number(severity) : defaultVals.severity;
        const issueUrgency = (typeof urgency === 'number' && !isNaN(urgency)) ? Number(urgency) : defaultVals.urgency;
        const isEmergency = defaultVals.isEmergency;
        const scores = calculateSmartPriority(1, issueSeverity, issueUrgency, isEmergency);

        const recurringIssue = {
          id: `ISSUE-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
          category: exactMatch.category,
          description: description.trim(),
          location: location.trim(),
          latitude: parsedLat !== null ? parsedLat : exactMatch.latitude,
          longitude: parsedLng !== null ? parsedLng : exactMatch.longitude,
          reporters: [activeReporter],
          uniqueReporterCount: 1,
          severity: issueSeverity,
          urgency: issueUrgency,
          impactScore: scores.impactScore,
          priorityScore: scores.priorityScore,
          priority: scores.priorityLabel,
          isEmergency,
          emergencyReason: isEmergency ? (defaultVals.emergencyReason || 'Safety hazard in recurring report') : '',
          status: 'Reported',
          possibleDuplicate: false,
          isRecurrence: true,
          reopenedFrom: exactMatch.id,
          previousReportId: exactMatch.id,
          previousResolution: {
            resolvedAt: exactMatch.resolvedAt,
            resolvedBy: exactMatch.resolvedBy,
            afterImageUrl: exactMatch.afterImageUrl,
            resolutionNotes: exactMatch.resolutionNotes
          },
          imageUrl: photoUrl || exactMatch.beforeImageUrl || '',
          beforeImageUrl: photoUrl || exactMatch.beforeImageUrl || '',
          afterImageUrl: '',
          resolvedAt: null,
          resolvedBy: null,
          resolutionNotes: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        issues.push(recurringIssue);
        await writeIssues(issues);

        console.log(`[Recurrence Created] #${recurringIssue.id} linked to previous resolved #${exactMatch.id}`);

        return res.status(201).json({
          message: `Recurrence report registered. Linked to previous resolved issue #${exactMatch.id} for expedited municipal inspection.`,
          isRecurrence: true,
          isGrouped: false,
          issue: recurringIssue
        });
      }

      // Subcase 1C: Existing issue is UNRESOLVED (Reported or In Progress)
      if (exactMatch.status !== 'Resolved') {
        const hadReporter = exactMatch.reporters.includes(activeReporter);
        if (!hadReporter) {
          exactMatch.reporters.push(activeReporter);
          exactMatch.uniqueReporterCount = exactMatch.reporters.length;
        }

        // Authoritative priority score recalculation
        const updatedScores = calculateSmartPriority(
          exactMatch.uniqueReporterCount,
          exactMatch.severity,
          exactMatch.urgency,
          exactMatch.isEmergency
        );
        exactMatch.impactScore = updatedScores.impactScore;
        exactMatch.priorityScore = updatedScores.priorityScore;
        exactMatch.priority = updatedScores.priorityLabel;
        exactMatch.possibleDuplicate = true;
        exactMatch.updatedAt = new Date().toISOString();

        await writeIssues(issues);

        console.log(`[Report Grouped] #${exactMatch.id}: reporter ${activeReporter} (unique: ${exactMatch.uniqueReporterCount}), score: ${exactMatch.priorityScore}`);

        return res.status(200).json({
          message: `Report submitted. An active issue (#${exactMatch.id}) already exists for this location and category — your report has been grouped to amplify community priority!`,
          isGrouped: true,
          issue: exactMatch,
          duplicateWarning: true
        });
      }
    }

    // 2. POSSIBLE DUPLICATE OR BRAND NEW ISSUE
    const defaultVals = getDefaultSeverityAndUrgency(category, description);
    const issueSeverity = (typeof severity === 'number' && !isNaN(severity)) ? Number(severity) : defaultVals.severity;
    const issueUrgency = (typeof urgency === 'number' && !isNaN(urgency)) ? Number(urgency) : defaultVals.urgency;
    const isEmergency = defaultVals.isEmergency;

    const scores = calculateSmartPriority(1, issueSeverity, issueUrgency, isEmergency);
    const isPossibleDup = Boolean(possibleMatch);

    const newIssue = {
      id: `ISSUE-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      category: category.trim(),
      description: description.trim(),
      location: location.trim(),
      latitude: parsedLat,
      longitude: parsedLng,
      reporters: [activeReporter],
      uniqueReporterCount: 1,
      severity: issueSeverity,
      urgency: issueUrgency,
      impactScore: scores.impactScore,
      priorityScore: scores.priorityScore,
      priority: scores.priorityLabel,
      isEmergency,
      emergencyReason: isEmergency ? (defaultVals.emergencyReason || 'Safety hazard detected in report description') : '',
      status: 'Reported',
      possibleDuplicate: isPossibleDup,
      potentialDuplicateOf: isPossibleDup ? possibleMatch.id : null,
      imageUrl: photoUrl,
      beforeImageUrl: photoUrl,
      afterImageUrl: '',
      resolvedAt: null,
      resolvedBy: null,
      resolutionNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    issues.push(newIssue);
    await writeIssues(issues);

    console.log(`[Issue Created] ${newIssue.id} (${newIssue.category}) by ${activeReporter}. PriorityScore: ${newIssue.priorityScore}, PossibleDuplicate: ${isPossibleDup}`);

    return res.status(201).json({
      message: isPossibleDup
        ? `Report submitted. Flagged as a potential duplicate of issue #${possibleMatch.id} for staff verification.`
        : 'Report successfully submitted.',
      isGrouped: false,
      possibleDuplicate: isPossibleDup,
      potentialDuplicateOf: isPossibleDup ? possibleMatch.id : null,
      issue: newIssue
    });
  } catch (err) {
    console.error('[Error in POST /api/issues]', err);
    return res.status(500).json({ error: err.message || 'Server failed to save the issue report.' });
  }
});

// API 2b: Additional Citizen Report for an Existing Issue
app.post('/api/issues/:id/report', async (req, res) => {
  try {
    const { id } = req.params;
    const { reporterId } = req.body;

    if (!reporterId || typeof reporterId !== 'string' || !reporterId.trim()) {
      return res.status(400).json({ error: 'reporterId is required to record a unique community report.' });
    }

    const issues = await readIssues();
    const issue = issues.find(i => i.id === id);

    if (!issue) {
      return res.status(404).json({ error: `Issue with ID ${id} not found.` });
    }

    const trimmedReporter = reporterId.trim();
    const wasAlreadyReported = issue.reporters.includes(trimmedReporter);

    if (!wasAlreadyReported) {
      issue.reporters.push(trimmedReporter);
      issue.uniqueReporterCount = issue.reporters.length;

      // Authoritative score recalculation
      const updatedScores = calculateSmartPriority(
        issue.uniqueReporterCount,
        issue.severity,
        issue.urgency,
        issue.isEmergency
      );
      issue.impactScore = updatedScores.impactScore;
      issue.priorityScore = updatedScores.priorityScore;
      issue.priority = updatedScores.priorityLabel;
      issue.updatedAt = new Date().toISOString();

      await writeIssues(issues);
    }

    return res.json({
      message: wasAlreadyReported
        ? 'Repeated report by same person acknowledged; unique reporter count was preserved.'
        : 'Unique report successfully registered! Issue priority recalculated.',
      isNewReporter: !wasAlreadyReported,
      issue
    });
  } catch (err) {
    console.error('[Error in POST /api/issues/:id/report]', err);
    return res.status(500).json({ error: 'Failed to record report.' });
  }
});

// API 2c: Reopen a Resolved Issue as Recurring Problem
app.post('/api/issues/:id/reopen', async (req, res) => {
  try {
    const { id } = req.params;
    const { reporterId, recurrenceNotes } = req.body || {};

    const issues = await readIssues();
    const issue = issues.find(i => i.id === id);

    if (!issue) {
      return res.status(404).json({ error: `Issue with ID ${id} not found.` });
    }

    issue.status = 'Reported';
    issue.isRecurrence = true;
    issue.reopenedAt = new Date().toISOString();
    issue.reopenCount = (issue.reopenCount || 0) + 1;
    if (recurrenceNotes && typeof recurrenceNotes === 'string' && recurrenceNotes.trim()) {
      issue.recurrenceNotes = recurrenceNotes.trim();
    }

    if (reporterId && typeof reporterId === 'string' && reporterId.trim()) {
      const rep = reporterId.trim();
      if (!issue.reporters.includes(rep)) {
        issue.reporters.push(rep);
        issue.uniqueReporterCount = issue.reporters.length;
      }
    }

    // Authoritative score recalculation
    const updated = calculateSmartPriority(
      issue.uniqueReporterCount,
      issue.severity,
      issue.urgency,
      issue.isEmergency
    );
    issue.impactScore = updated.impactScore;
    issue.priorityScore = updated.priorityScore;
    issue.priority = updated.priorityLabel;
    issue.updatedAt = new Date().toISOString();

    await writeIssues(issues);

    console.log(`[Issue Reopened] #${id} as recurring civic issue. Reopen count: ${issue.reopenCount}`);

    return res.json({
      message: `Issue #${id} has been reopened as a recurring civic issue.`,
      issue
    });
  } catch (err) {
    console.error('[Error in POST /api/issues/:id/reopen]', err);
    return res.status(500).json({ error: 'Failed to reopen issue.' });
  }
});

// API 3: List Issues (Sorted by Priority by default, supporting filters)
app.get('/api/issues', async (req, res) => {
  try {
    const { category, status, priority, search, sort } = req.query;
    let issues = await readIssues();

    // Filtering
    if (category && category !== 'All') {
      issues = issues.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }

    if (status && status !== 'All') {
      issues = issues.filter(item => item.status.toLowerCase() === status.toLowerCase());
    }

    if (priority && priority !== 'All') {
      issues = issues.filter(item => item.priority.toLowerCase() === priority.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      issues = issues.filter(item =>
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      );
    }

    // Feature 1: Deterministic Smart Priority Ranking
    if (sort === 'date') {
      issues.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      // Default: Deterministic Smart Priority Ranking
      issues.sort((a, b) => {
        // Active issues rank above resolved
        const aResolved = a.status === 'Resolved';
        const bResolved = b.status === 'Resolved';
        if (aResolved !== bResolved) {
          return aResolved ? 1 : -1;
        }

        // Active emergency issues take top precedence
        if (!aResolved && !bResolved) {
          if (Boolean(a.isEmergency) !== Boolean(b.isEmergency)) {
            return b.isEmergency ? 1 : -1;
          }
        }

        // Priority score descending
        if (b.priorityScore !== a.priorityScore) {
          return b.priorityScore - a.priorityScore;
        }

        // Tie breaker: newest first
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }

    return res.json(issues);
  } catch (err) {
    console.error('[Error in GET /api/issues]', err);
    return res.status(500).json({ error: 'Failed to retrieve issues list.' });
  }
});

// API 4: Update Severity, Urgency, & Emergency Escalation (Feature 1 - Staff Authorized)
app.patch('/api/issues/:id/scores', requireStaffAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { severity, urgency, isEmergency, emergencyReason } = req.body;

    if (severity !== undefined) {
      const sevNum = Number(severity);
      if (isNaN(sevNum) || sevNum < 0 || sevNum > 100) {
        return res.status(400).json({ error: 'Severity must be a number between 0 and 100.' });
      }
    }

    if (urgency !== undefined) {
      const urgNum = Number(urgency);
      if (isNaN(urgNum) || urgNum < 0 || urgNum > 100) {
        return res.status(400).json({ error: 'Urgency must be a number between 0 and 100.' });
      }
    }

    const issues = await readIssues();
    const issueIndex = issues.findIndex(item => item.id === id);

    if (issueIndex === -1) {
      return res.status(404).json({ error: `Issue with ID ${id} not found.` });
    }

    const issue = issues[issueIndex];

    if (severity !== undefined) issue.severity = Number(severity);
    if (urgency !== undefined) issue.urgency = Number(urgency);
    if (isEmergency !== undefined) {
      issue.isEmergency = Boolean(isEmergency);
      if (emergencyReason) issue.emergencyReason = emergencyReason.trim();
    }

    // Authoritative recalculation on backend
    const updated = calculateSmartPriority(
      issue.uniqueReporterCount,
      issue.severity,
      issue.urgency,
      issue.isEmergency
    );

    issue.impactScore = updated.impactScore;
    issue.priorityScore = updated.priorityScore;
    issue.priority = updated.priorityLabel;
    issue.updatedAt = new Date().toISOString();

    await writeIssues(issues);

    console.log(`[Scores Updated] #${id} by ${req.staff.name}: Sev=${issue.severity}, Urg=${issue.urgency}, Score=${issue.priorityScore}`);

    return res.json({
      message: 'Severity and urgency scores updated. Priority recalculated.',
      issue
    });
  } catch (err) {
    console.error('[Error in PATCH /api/issues/:id/scores]', err);
    return res.status(500).json({ error: 'Failed to update issue scores.' });
  }
});

// API 5: Update Issue Status (Standard status update)
app.patch('/api/issues/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
      });
    }

    // Require staff authorization if transitioning to Resolved
    if (status === 'Resolved') {
      const authHeader = req.headers['authorization'];
      const customHeader = req.headers['x-staff-token'];
      const token = (authHeader && authHeader.startsWith('Bearer ')) ? authHeader.slice(7).trim() : (customHeader || '');
      const staff = verifyStaffToken(token);
      if (!staff) {
        return res.status(401).json({
          error: 'Authorized municipal staff credentials are required to mark an issue as Resolved with resolution evidence.'
        });
      }
    }

    const issues = await readIssues();
    const issueIndex = issues.findIndex(item => item.id === id);

    if (issueIndex === -1) {
      return res.status(404).json({ error: `Issue with ID ${id} not found.` });
    }

    issues[issueIndex].status = status;
    issues[issueIndex].updatedAt = new Date().toISOString();
    if (status === 'Resolved' && !issues[issueIndex].resolvedAt) {
      issues[issueIndex].resolvedAt = new Date().toISOString();
      issues[issueIndex].resolvedBy = 'Municipal Staff';
    }

    await writeIssues(issues);

    console.log(`[Status Updated] Issue ${id} status set to: ${status}`);
    return res.json({
      message: `Status updated to ${status}`,
      issue: issues[issueIndex]
    });
  } catch (err) {
    console.error('[Error in PATCH /api/issues/:id/status]', err);
    return res.status(500).json({ error: 'Failed to update issue status.' });
  }
});

// API 6: Feature 3 - Upload Resolution Proof and Mark as Resolved (Authorized Staff Only)
app.post('/api/issues/:id/resolve', requireStaffAuth, upload.single('afterImage'), async (req, res) => {
  try {
    const { id } = req.params;
    const { afterImageUrl, resolutionNotes, resolvedBy } = req.body;

    // Check that an after-photo is provided (either as uploaded file or URL)
    let finalAfterUrl = '';
    if (req.file) {
      finalAfterUrl = `/uploads/${req.file.filename}`;
    } else if (afterImageUrl && typeof afterImageUrl === 'string' && afterImageUrl.trim()) {
      finalAfterUrl = afterImageUrl.trim();
    } else {
      // "If the after-photo upload fails, do not mark the issue as resolved."
      return res.status(400).json({
        error: 'Resolution proof photo is required. Please upload an after-photo or supply an image URL to mark as Resolved.'
      });
    }

    const issues = await readIssues();
    const issueIndex = issues.findIndex(item => item.id === id);

    if (issueIndex === -1) {
      return res.status(404).json({ error: `Issue with ID ${id} not found.` });
    }

    const issue = issues[issueIndex];

    // Store after-photo separately from original photo
    issue.afterImageUrl = finalAfterUrl;
    issue.status = 'Resolved';
    issue.resolvedAt = new Date().toISOString();
    issue.resolvedBy = (resolvedBy && resolvedBy.trim()) || req.staff.name || 'Municipal Works Crew';
    issue.resolutionNotes = (resolutionNotes && resolutionNotes.trim()) || 'Repaired and verified on-site by municipal crew.';
    issue.updatedAt = new Date().toISOString();

    // Preserve original photo unchanged
    if (!issue.beforeImageUrl && issue.imageUrl) {
      issue.beforeImageUrl = issue.imageUrl;
    }

    await writeIssues(issues);

    console.log(`[Issue Resolved] #${id} by ${issue.resolvedBy} with after-photo: ${finalAfterUrl}`);

    return res.json({
      message: 'Issue successfully resolved with verification evidence proof.',
      issue
    });
  } catch (err) {
    console.error('[Error in POST /api/issues/:id/resolve]', err);
    return res.status(500).json({ error: err.message || 'Failed to submit resolution proof.' });
  }
});

// API 7: Dashboard Statistics
app.get('/api/stats', async (req, res) => {
  try {
    const issues = await readIssues();

    const stats = {
      total: issues.length,
      highPriority: issues.filter(i => i.priority === 'High' || i.isEmergency).length,
      reported: issues.filter(i => i.status === 'Reported').length,
      inProgress: issues.filter(i => i.status === 'In Progress').length,
      resolved: issues.filter(i => i.status === 'Resolved').length,
      emergencyCount: issues.filter(i => i.isEmergency && i.status !== 'Resolved').length,
      mappedIssuesCount: issues.filter(i => typeof i.latitude === 'number' && typeof i.longitude === 'number').length,
      verifiedResolutionsCount: issues.filter(i => i.status === 'Resolved' && i.afterImageUrl).length
    };

    return res.json(stats);
  } catch (err) {
    console.error('[Error in GET /api/stats]', err);
    return res.status(500).json({ error: 'Failed to compute statistics.' });
  }
});

// Seed endpoint: populate realistic sample community issues with coordinates and resolution evidence
app.post('/api/seed', async (req, res) => {
  try {
    const sampleIssues = [
      {
        id: 'ISSUE-1710001001-101',
        category: 'Pothole',
        description: 'Large deep pothole on the right lane near the traffic signal, causing dangerous sudden braking for motorists.',
        location: '7th Avenue & Market Road',
        latitude: 12.9716,
        longitude: 77.5946,
        reporters: ['CITIZEN-9845012345', 'CITIZEN-9845023456', 'CITIZEN-9845034567'],
        uniqueReporterCount: 3,
        severity: 75,
        urgency: 70,
        isEmergency: true,
        emergencyReason: 'Severe vehicle damage hazard near pedestrian crossing',
        imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
        beforeImageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
        afterImageUrl: '',
        status: 'Reported',
        possibleDuplicate: false,
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        id: 'ISSUE-1710001002-102',
        category: 'Water Leakage',
        description: 'Main municipal water pipe rupture leaking hundreds of liters onto sidewalk and flooding bicycle lane.',
        location: 'Oakridge Boulevard, Sector 4',
        latitude: 12.9750,
        longitude: 77.6010,
        reporters: ['CITIZEN-9123456789', 'CITIZEN-9234567890'],
        uniqueReporterCount: 2,
        severity: 80,
        urgency: 75,
        isEmergency: false,
        emergencyReason: '',
        imageUrl: 'https://images.unsplash.com/photo-1542013936693-884638332954?w=600&auto=format&fit=crop&q=80',
        beforeImageUrl: 'https://images.unsplash.com/photo-1542013936693-884638332954?w=600&auto=format&fit=crop&q=80',
        afterImageUrl: '',
        status: 'In Progress',
        possibleDuplicate: false,
        createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
      },
      {
        id: 'ISSUE-1710001003-103',
        category: 'Garbage',
        description: 'Overflowing public community dumpster spreading waste onto pedestrian walkway, attracting stray animals.',
        location: 'Greenfield Park North Gate',
        latitude: 12.9680,
        longitude: 77.5910,
        reporters: ['CITIZEN-9345678901'],
        uniqueReporterCount: 1,
        severity: 50,
        urgency: 50,
        isEmergency: false,
        emergencyReason: '',
        imageUrl: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=600&auto=format&fit=crop&q=80',
        beforeImageUrl: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=600&auto=format&fit=crop&q=80',
        afterImageUrl: '',
        status: 'Reported',
        possibleDuplicate: false,
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
      },
      {
        id: 'ISSUE-1710001004-104',
        category: 'Streetlight',
        description: 'Two consecutive streetlights are non-functional, leaving the school crossing completely dark at night.',
        location: 'Maple Street Crossing',
        latitude: 12.9810,
        longitude: 77.5890,
        reporters: ['CITIZEN-9456789012', 'CITIZEN-9567890123'],
        uniqueReporterCount: 2,
        severity: 55,
        urgency: 60,
        isEmergency: false,
        emergencyReason: '',
        imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80',
        beforeImageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80',
        afterImageUrl: '',
        status: 'In Progress',
        possibleDuplicate: false,
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: 'ISSUE-1710001005-105',
        category: 'Pothole',
        description: 'Repaired pothole following asphalt resurfacing inspection after rain.',
        location: 'Pine Hill Road',
        latitude: 12.9640,
        longitude: 77.6050,
        reporters: ['CITIZEN-9678901234'],
        uniqueReporterCount: 1,
        severity: 65,
        urgency: 60,
        isEmergency: false,
        emergencyReason: '',
        imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
        beforeImageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
        afterImageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
        status: 'Resolved',
        resolvedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        resolvedBy: 'Officer R. Sharma (Municipal Works)',
        resolutionNotes: 'Asphalt hot-mix leveling completed. Road reopened to vehicular traffic.',
        possibleDuplicate: false,
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
      }
    ];

    const migrated = sampleIssues.map(migrateIssue);
    await writeIssues(migrated);
    console.log('[Seed] Sample data populated successfully.');
    return res.json({ message: 'Sample community issues seeded successfully', count: migrated.length, issues: migrated });
  } catch (err) {
    console.error('[Error in POST /api/seed]', err);
    return res.status(500).json({ error: 'Failed to seed sample issues.' });
  }
});

// Fallback 404 handler
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Multer error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds maximum 5MB limit.' });
    }
    return res.status(400).json({ error: `File upload error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ error: err.message || 'File processing error.' });
  }
  next();
});

// Start the server
ensureDirectories();
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 CivicLens Backend Server running on port ${PORT}`);
  console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📍 Data File: ${DATA_FILE}`);
  console.log(`📍 Uploads Path: ${UPLOADS_DIR}`);
  console.log(`===============================================`);
});
