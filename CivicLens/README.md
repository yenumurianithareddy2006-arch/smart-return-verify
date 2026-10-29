# CivicLens — Smart Civic Issue Prioritization & Management System

CivicLens is a full-stack, civic-tech web application built with **React + Vite** and **Node.js + Express**. It features an authoritative rule-based prioritization engine, an interactive Leaflet GIS issue map, and a before-and-after photographic resolution proof system. All data persists reliably in a local JSON storage engine across server restarts without external paid APIs.

---

## 🌟 Newly Implemented Core Features

### 1. Smart Priority Ranking Engine
- **Authoritative Mathematical Formula:**
  $$\text{Impact Score} = \min\left(\frac{\text{Unique Reporters}}{50} \times 100, 100\right)$$
  $$\text{Priority Score} = (0.5 \times \text{Impact Score}) + (0.3 \times \text{Severity}) + (0.2 \times \text{Urgency})$$
- **Community Grouping & Unique Reporter Integrity:**
  - Reports for the same category and normalized location are automatically grouped under the same underlying issue.
  - Repeated complaints by the same citizen do **not** inflate the unique reporter count.
- **Configurable Score Thresholds:**
  - **Emergency / Critical:** Immediate safety hazard override (always ranked at the top).
  - **High Priority:** Priority Score $\ge 70$.
  - **Medium Priority:** Priority Score $\ge 40$ and $< 70$.
  - **Low Priority:** Priority Score $< 40$.
- **Administrative Calibration:** Authorized municipal staff can calibrate severity (0–100) and urgency (0–100) or toggle emergency escalation.

### 2. Location-Based Issue Map (Leaflet + OpenStreetMap)
- Interactive map rendered with **Leaflet** and **React-Leaflet** using free OpenStreetMap tiles (no paid API keys).
- Distinguishable category markers with custom SVG icons, colors, and text letter badges:
  - **Pothole (P):** Vibrant Orange
  - **Water Leakage (W):** Deep Blue / Cyan
  - **Garbage (G):** Purple
  - **Streetlight (S):** Amber Yellow
  - **Emergency Hazard (!):** Pulsing Red
- **Interactive Popup:** Shows category, location, coordinates, status, unique reporters count, priority score, and "View Details & Proof".
- **Coordinate Selection:** In the complaint form, citizens can click the map to drop a pin, enter coordinates manually, or use browser geolocation (with explicit permission).
- **Auto-Fit Bounds & Graceful Legacy Fallback:** Legacy issues without coordinates are preserved without inventing artificial coordinates.

### 3. Before-and-After Resolution Proof
- **Side-by-Side Photographic Comparison:** Citizen complaint photo (Before) and municipal crew repair photo (After) are displayed side-by-side with clear labels.
- **Cryptographic Staff Authorization:** Backend validates staff authentication tokens before permitting an issue to be marked as Resolved or accepting after-photos.
- **Fail-Safe Integrity:** If the after-photo upload fails or is omitted, the issue is **not** marked as Resolved.
- **Audit Details:** Records staff member identity (`resolvedBy`), resolution timestamp (`resolvedAt`), and resolution work notes.
- **Secure File Storage:** Stored in `backend/uploads/` with sanitized, unguessable filenames and file-type restrictions (JPEG, PNG, WebP up to 5MB).

---

## 🏛️ System Architecture

- **Frontend:** React 18 + Vite + React-Leaflet 4.2 + Leaflet 1.9 (Port `5173`)
- **Backend:** Node.js + Express + Multer (Port `5000`)
- **Storage:** Local JSON database (`backend/data/issues.json`) with safe, backward-compatible schema migrations
- **Uploads:** Stored in `backend/uploads/` and served statically via `/uploads/`

---

## 📁 Project Structure

```text
CivicLens/
├── backend/
│   ├── data/
│   │   └── issues.json         # Persistent JSON database
│   ├── uploads/                # Uploaded before/after photos
│   ├── package.json            # Express, CORS, Multer
│   ├── seed.js                 # Seed script with coordinates & proofs
│   ├── server.js               # REST API, priority engine & staff auth
│   ├── test_api.js             # Initial 15 API tests
│   └── test_features.js        # Comprehensive 28-assertion verification test
├── frontend/
│   ├── index.html              # HTML5 entry
│   ├── package.json            # React, Vite, Leaflet, React-Leaflet
│   ├── vite.config.js          # Configured for port 5173
│   └── src/
│       ├── api.js              # Centralized API client & staff token handling
│       ├── App.css             # Polished civic stylesheet & map styling
│       ├── App.jsx             # Top-level state and tab routing
│       ├── index.css           # Global CSS variables & resets
│       ├── main.jsx            # React root mount
│       └── components/
│           ├── AdminDashboard.jsx # Dispatch table, score editing & resolution modal
│           ├── Icons.jsx          # Zero-dependency SVG icon library
│           ├── IssueList.jsx      # Issues list & Before/After comparison modal
│           ├── IssueMap.jsx       # Interactive Leaflet GIS map with filters
│           ├── Navbar.jsx         # Header navigation & API health indicator
│           ├── Overview.jsx       # Landing page, formula explainers & stats
│           └── ReportIssue.jsx    # Complaint form with map pin picker & file upload
└── README.md                   # Full documentation & run instructions
```

---

## 🚀 Running Instructions

### Terminal 1: Backend Server (Port 5000)

```powershell
cd backend
npm install
npm start
```

*Optional Demo Seeding:* To reset or load 5 realistic community issues with GPS coordinates and resolution evidence:
```powershell
npm run seed
```

### Terminal 2: Frontend Web App (Port 5173)

Open a new terminal window:
```powershell
cd frontend
npm install
npm run dev
```

---

## 🌐 Local URLs

| Service | URL | Purpose |
| :--- | :--- | :--- |
| **Frontend Web App** | [http://localhost:5173](http://localhost:5173) | Main citizen portal, map, and admin console |
| **Backend REST API** | [http://localhost:5000/api](http://localhost:5000/api) | Base API endpoint |
| **API Health Check** | [http://localhost:5000/api/health](http://localhost:5000/api/health) | Real-time backend status verification |

---

## 🔑 Demo Staff Credentials

To unlock administrative actions (updating severity/urgency, emergency escalation, and uploading resolution proof):
- **Username:** `staff_admin`
- **Password:** `CivicStaff@2026`
- **Role:** Officer R. Sharma (Municipal Works & Dispatch)

---

## 📡 REST API Endpoints

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | System uptime & feature status |
| `POST` | `/api/auth/staff-login` | Public | Authenticates staff and issues signed session token |
| `GET` | `/api/auth/verify` | Staff | Validates current staff token |
| `GET` | `/api/stats` | Public | Dashboard counts (total, highPriority, reported, inProgress, resolved, mapped, etc.) |
| `GET` | `/api/issues` | Public | Returns issues sorted by smart priority by default; supports `?sort=`, `?category=`, `?priority=`, `?status=`, `?search=` |
| `POST` | `/api/issues` | Public | Creates new report or groups with existing issue; accepts JSON or `multipart/form-data` with photo file |
| `POST` | `/api/issues/:id/report` | Public | Records additional citizen report for an existing issue (unique reporter deduplication) |
| `PATCH` | `/api/issues/:id/scores` | Staff | Updates severity (0–100), urgency (0–100), and emergency hazard escalation; recalculates priority |
| `PATCH` | `/api/issues/:id/status` | Staff (for Resolved) | Updates issue status |
| `POST` | `/api/issues/:id/resolve` | Staff | Uploads after-photo proof and marks issue as Resolved with staff timestamp and notes |
| `POST` | `/api/seed` | Public | Re-seeds sample demonstration issues |

---

## 🧪 Automated Testing

Execute the automated test suite in the backend directory:

```powershell
cd backend
node test_features.js
```

### Verified Test Assertions (28/28 Passed):
1. **Health Check & Features List:** Confirms all 3 feature keys are active.
2. **Staff Authentication:** Valid credentials return signed token; invalid rejected with 401.
3. **Smart Priority Ranking Calculation:**
   - 30 unique reporters for Garbage + Severity 50 + Urgency 60 $\rightarrow$ Priority Score = **57**.
   - 20 unique reporters for Streetlight + Severity 80 + Urgency 90 $\rightarrow$ Priority Score = **62** (ranks higher than Garbage).
4. **Unique Reporter Deduplication:** Repeated complaints from the same citizen identifier do **not** inflate the reporter count.
5. **Emergency Escalation:** Safety-critical keywords (*"accident"*, *"dangerous"*) and manual emergency toggle place hazards at the top of the triage queue.
6. **Coordinates Validation:** Accepts valid latitudes ($-90$ to $90$) and longitudes ($-180$ to $180$); rejects invalid inputs with 400 Bad Request.
7. **Legacy Coords Graceful Handling:** Reports without coordinates preserve `null` without inventing artificial coordinates.
8. **Resolution Proof Authorization:** Unauthenticated resolution attempts rejected with 401.
9. **Fail-Safe Check:** Resolution attempt without after-photo rejected with 400 and **does not** mark issue as Resolved.
10. **Resolution Proof Success:** Valid after-photo resolves issue, updates timestamp, preserves staff identity, and persists to JSON storage.
