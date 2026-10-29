import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  IconPlus, 
  IconAlert, 
  IconCheckCircle, 
  IconPin, 
  IconCamera, 
  IconCrosshair,
  IconX,
  IconUsers,
  IconClock,
  getCategoryIcon 
} from './Icons';
import { createIssue, reopenIssue } from '../api';

const CATEGORIES = ['Pothole', 'Garbage', 'Streetlight', 'Water Leakage'];

const SAMPLE_LOCATIONS = [
  { name: '7th Avenue & Market Road', lat: 12.9716, lng: 77.5946 },
  { name: 'Oakridge Boulevard, Sector 4', lat: 12.9750, lng: 77.6010 },
  { name: 'Greenfield Park North Gate', lat: 12.9680, lng: 77.5910 },
  { name: 'Maple Street Crossing', lat: 12.9810, lng: 77.5890 },
  { name: 'Central Bus Terminal Road', lat: 12.9780, lng: 77.5720 }
];

// Custom pin for location picker
const pickerIcon = L.divIcon({
  html: `
    <div style="background-color: #0d9488; width: 28px; height: 28px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
      <div style="width: 10px; height: 10px; background: white; border-radius: 50%; transform: rotate(45deg);"></div>
    </div>
  `,
  className: 'custom-picker-pin',
  iconSize: [28, 28],
  iconAnchor: [14, 28]
});

// Map click listener to select coordinates
function LocationPickerHandler({ onSelectCoords }) {
  useMapEvents({
    click(e) {
      onSelectCoords(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export default function ReportIssue({ onIssueCreated, setActiveTab }) {
  const [category, setCategory] = useState('Pothole');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [reporterId, setReporterId] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // UI state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [geoLocating, setGeoLocating] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [submissionWarning, setSubmissionWarning] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Duplicate & Resolved issue handling
  const [resolvedDuplicateAlert, setResolvedDuplicateAlert] = useState(null);
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [isRecurrence, setIsRecurrence] = useState(false);
  const [recurrenceNotes, setRecurrenceNotes] = useState('');

  // Client-side validation
  const validateForm = () => {
    const errs = {};
    if (!category || !CATEGORIES.includes(category)) {
      errs.category = 'Please select a valid civic category.';
    }
    if (!location.trim()) {
      errs.location = 'Location name or landmark is required.';
    }
    if (!description.trim()) {
      errs.description = 'Description is required so municipal workers understand the problem.';
    } else if (description.trim().length < 10) {
      errs.description = 'Please describe the issue in at least 10 characters.';
    }

    // Coordinates validation if entered manually
    if (latitude !== '' && (isNaN(Number(latitude)) || Number(latitude) < -90 || Number(latitude) > 90)) {
      errs.latitude = 'Latitude must be between -90 and 90.';
    }
    if (longitude !== '' && (isNaN(Number(longitude)) || Number(longitude) < -180 || Number(longitude) > 180)) {
      errs.longitude = 'Longitude must be between -180 and 180.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  // Browser Geolocation (with explicit user permission)
  const handleUseCurrentLocation = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));
        setLatitude(lat);
        setLongitude(lng);
        setGeoLocating(false);
        if (!location) {
          setLocation(`GPS Pin (${lat}, ${lng})`);
        }
      },
      (err) => {
        setGeoLocating(false);
        setGeoError(`Unable to retrieve location (${err.message}). You can pick a point on the map or enter coordinates manually.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleMapCoordSelect = (lat, lng) => {
    const fixedLat = Number(lat.toFixed(6));
    const fixedLng = Number(lng.toFixed(6));
    setLatitude(fixedLat);
    setLongitude(fixedLng);
    if (!location) {
      setLocation(`Selected GPS Pin (${fixedLat}, ${fixedLng})`);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setErrors(prev => ({ ...prev, image: 'Only JPEG, PNG, and WebP images are allowed.' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'File size must be under 5MB.' }));
        return;
      }
      setErrors(prev => {
        const copy = { ...prev };
        delete copy.image;
        return copy;
      });
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageUrl('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setSubmissionSuccess(null);
    setSubmissionWarning(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let response;
      if (imageFile) {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append('category', category);
        formData.append('location', location.trim());
        formData.append('description', description.trim());
        if (reporterId.trim()) formData.append('reporterId', reporterId.trim());
        if (latitude !== '') formData.append('latitude', latitude);
        if (longitude !== '') formData.append('longitude', longitude);
        if (isRecurrence) {
          formData.append('isRecurrence', 'true');
          if (recurrenceNotes.trim()) formData.append('recurrenceNotes', recurrenceNotes.trim());
        }
        formData.append('image', imageFile);
        response = await createIssue(formData);
      } else {
        // Use standard JSON
        const payload = {
          category,
          location: location.trim(),
          description: description.trim(),
          imageUrl: imageUrl.trim(),
          reporterId: reporterId.trim() || undefined,
          latitude: latitude !== '' ? Number(latitude) : undefined,
          longitude: longitude !== '' ? Number(longitude) : undefined,
          isRecurrence: isRecurrence ? true : undefined,
          recurrenceNotes: isRecurrence ? (recurrenceNotes.trim() || description.trim()) : undefined
        };
        response = await createIssue(payload);
      }

      const created = response.issue;
      setSubmissionSuccess({
        id: created.id,
        category: created.category,
        priority: created.priority,
        priorityScore: created.priorityScore,
        location: created.location,
        uniqueReporterCount: created.uniqueReporterCount,
        isGrouped: response.isGrouped,
        isRecurrence: response.isRecurrence
      });

      if (response.duplicateWarning || (created.possibleDuplicate && !response.isRecurrence)) {
        setSubmissionWarning(
          response.isGrouped
            ? `⚠️ Active Community Grouping: An unresolved report for "${created.category}" at "${created.location}" already exists. Your report has been grouped with active community complaints, updating unique reporters to ${created.uniqueReporterCount}!`
            : `⚠️ Potential Duplicate Flagged: This report is similar to an existing complaint and has been flagged for municipal triage verification.`
        );
      }

      // Reset form and conflict states
      setResolvedDuplicateAlert(null);
      setIsRecurrence(false);
      setRecurrenceNotes('');
      setDescription('');
      setLocation('');
      setImageUrl('');
      setImageFile(null);
      setImagePreview('');
      setLatitude('');
      setLongitude('');
      setErrors({});

      if (onIssueCreated) {
        onIssueCreated(created);
      }
    } catch (err) {
      if (err.resolvedDuplicate || err.status === 409 || (err.message && err.message.includes('already been resolved'))) {
        setResolvedDuplicateAlert({
          message: err.message,
          existingIssue: err.existingIssue
        });
        setApiError(err.message);
      } else {
        setApiError(err.message || 'Failed to submit report. Please check server status.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="report-page">
      <div className="report-container">
        <div className="page-header">
          <span className="badge-category-count">Citizen Reporting Portal</span>
          <h2 className="page-title">Report a Civic Problem</h2>
          <p className="page-subtitle">
            Submit an issue report directly to municipal authorities. Our smart priority engine evaluates unique reporters,
            severity, and urgency in real time.
          </p>
        </div>

        {/* Success Alert Banner */}
        {submissionSuccess && (
          <div className="alert-box success">
            <div className="alert-icon">
              <IconCheckCircle size={24} />
            </div>
            <div className="alert-body">
              <strong>Report Successfully Submitted!</strong>
              <p>
                Report Reference ID: <code>{submissionSuccess.id}</code>
                <br />
                Priority Rank: <strong>{submissionSuccess.priority}</strong> (Priority Score: <strong>{submissionSuccess.priorityScore}</strong>/100, 
                Unique Reporters: <strong>{submissionSuccess.uniqueReporterCount}</strong>).
              </p>
              <div className="alert-actions">
                <button className="btn btn-sm btn-outline" onClick={() => setActiveTab('map')}>
                  View on Map
                </button>
                <button className="btn btn-sm btn-outline" onClick={() => setActiveTab('issues')}>
                  View in Public Issues
                </button>
                <button className="btn btn-sm btn-ghost" onClick={() => setSubmissionSuccess(null)}>
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Duplicate / Grouped Warning Banner */}
        {submissionWarning && (
          <div className="alert-box warning">
            <div className="alert-icon">
              <IconAlert size={24} />
            </div>
            <div className="alert-body">
              <strong>Community Issue Grouped</strong>
              <p>{submissionWarning}</p>
            </div>
          </div>
        )}

        {/* Resolved Duplicate Alert Banner */}
        {resolvedDuplicateAlert && (
          <div className="alert-box warning" style={{ borderLeft: '4px solid #f59e0b', backgroundColor: '#fffbeb', padding: '1.25rem' }}>
            <div className="alert-icon" style={{ color: '#d97706' }}>
              <IconAlert size={26} />
            </div>
            <div className="alert-body" style={{ width: '100%' }}>
              <strong style={{ fontSize: '1.05rem', color: '#92400e', marginBottom: '0.35rem' }}>
                Existing Resolved Issue Detected
              </strong>
              <p style={{ fontSize: '0.92rem', color: '#78350f', margin: '0.35rem 0', fontWeight: '600' }}>
                {resolvedDuplicateAlert.message}
              </p>
              {resolvedDuplicateAlert.existingIssue && (
                <div style={{ background: '#ffffff', border: '1px solid #fde68a', borderRadius: '6px', padding: '0.75rem', marginTop: '0.65rem', fontSize: '0.85rem' }}>
                  <div>
                    <strong>Matched Record:</strong> #{resolvedDuplicateAlert.existingIssue.id} — <em>{resolvedDuplicateAlert.existingIssue.category}</em> at <strong>{resolvedDuplicateAlert.existingIssue.location}</strong>
                  </div>
                  {resolvedDuplicateAlert.existingIssue.resolvedAt && (
                    <div style={{ marginTop: '0.25rem', color: '#64748b' }}>
                      <strong>Resolved On:</strong> {new Date(resolvedDuplicateAlert.existingIssue.resolvedAt).toLocaleString()} by {resolvedDuplicateAlert.existingIssue.resolvedBy || 'Municipal Works Crew'}
                    </div>
                  )}
                  {resolvedDuplicateAlert.existingIssue.resolutionNotes && (
                    <div style={{ marginTop: '0.25rem', color: '#475569' }}>
                      <strong>Staff Notes:</strong> {resolvedDuplicateAlert.existingIssue.resolutionNotes}
                    </div>
                  )}
                </div>
              )}
              <div className="alert-actions" style={{ flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.85rem' }}>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={() => setShowResolutionModal(true)}
                >
                  <IconCamera size={15} />
                  <span>View Resolution Photo & Proof</span>
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => {
                    setIsRecurrence(true);
                    setApiError(null);
                  }}
                >
                  <span>Problem Has Returned / Previous Repair Failed</span>
                </button>

                {resolvedDuplicateAlert.existingIssue && (
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost"
                    onClick={async () => {
                      try {
                        const repId = reporterId.trim() || undefined;
                        const reopenedRes = await reopenIssue(resolvedDuplicateAlert.existingIssue.id, { 
                          reporterId: repId,
                          recurrenceNotes: description.trim() || 'Citizen reported issue recurrence.'
                        });
                        const reopenedIssue = reopenedRes.issue;
                        setResolvedDuplicateAlert(null);
                        setSubmissionSuccess({
                          id: reopenedIssue.id,
                          category: reopenedIssue.category,
                          priority: reopenedIssue.priority,
                          priorityScore: reopenedIssue.priorityScore,
                          location: reopenedIssue.location,
                          uniqueReporterCount: reopenedIssue.uniqueReporterCount,
                          isGrouped: true
                        });
                        if (onIssueCreated) onIssueCreated(reopenedIssue);
                      } catch (reopenErr) {
                        setApiError(reopenErr.message || 'Failed to reopen issue.');
                      }
                    }}
                  >
                    <span>Reopen Issue Directly</span>
                  </button>
                )}

                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => setResolvedDuplicateAlert(null)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Server Error Alert Banner (only if not a resolved duplicate prompt) */}
        {apiError && !resolvedDuplicateAlert && (
          <div className="alert-box danger">
            <div className="alert-icon">
              <IconAlert size={24} />
            </div>
            <div className="alert-body">
              <strong>Submission Failed</strong>
              <p>{apiError}</p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="card form-card">
          <form onSubmit={handleSubmit} noValidate>
            {/* Recurrence Mode Banner */}
            {isRecurrence && (
              <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', padding: '0.85rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                <div>
                  <strong style={{ color: '#92400e', fontSize: '0.92rem' }}>🔁 Recurrence Mode Active:</strong>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: '#78350f' }}>
                    You are reporting that the problem has returned or the previous repair has failed. This report will be linked to previously resolved issue #{resolvedDuplicateAlert?.existingIssue?.id || 'historical'}.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => setIsRecurrence(false)}
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Category Dropdown */}
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Problem Category <span className="req">*</span>
              </label>
              <div className="select-wrapper">
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`form-select ${errors.category ? 'has-error' : ''}`}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <span className="field-hint">
                Select problem type. Initial severity and urgency are calculated automatically from category guidelines.
              </span>
              {errors.category && <p className="error-text">{errors.category}</p>}
            </div>

            {/* Reporter Identifier Field */}
            <div className="form-group">
              <label htmlFor="reporterId" className="form-label">
                Reporter Identity / Contact <span className="optional-tag">(Phone, Email, or Citizen ID)</span>
              </label>
              <div className="input-with-icon">
                <div className="field-icon">
                  <IconUsers size={18} />
                </div>
                <input
                  id="reporterId"
                  type="text"
                  placeholder="e.g. 9845012345 or citizen@example.com (or leave blank for auto ID)"
                  value={reporterId}
                  onChange={(e) => setReporterId(e.target.value)}
                  className="form-input pl-icon"
                />
              </div>
              <span className="field-hint">
                Used to compute unique affected citizens. Repeated complaints by the same person do not artificially inflate the score.
              </span>
            </div>

            {/* Location Address / Landmark */}
            <div className="form-group">
              <label htmlFor="location" className="form-label">
                Location / Address / Landmark <span className="req">*</span>
              </label>
              <div className="input-with-icon">
                <div className="field-icon">
                  <IconPin size={18} />
                </div>
                <input
                  id="location"
                  type="text"
                  placeholder="e.g. 7th Avenue & Market Road or Landmark"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`form-input pl-icon ${errors.location ? 'has-error' : ''}`}
                />
              </div>

              {/* Quick sample location chips */}
              <div className="suggestion-chips">
                <span className="chips-label">Sample demo locations:</span>
                {SAMPLE_LOCATIONS.map((loc) => (
                  <button
                    key={loc.name}
                    type="button"
                    className="chip-btn"
                    onClick={() => {
                      setLocation(loc.name);
                      setLatitude(loc.lat);
                      setLongitude(loc.lng);
                    }}
                  >
                    {loc.name}
                  </button>
                ))}
              </div>
              {errors.location && <p className="error-text">{errors.location}</p>}
            </div>

            {/* Feature 2: Interactive Location Map & Geolocation Picker */}
            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label">
                  Map Coordinates <span className="optional-tag">(Optional GPS Placement)</span>
                </label>
                <div className="geo-actions">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={handleUseCurrentLocation}
                    disabled={geoLocating}
                  >
                    <IconCrosshair size={15} />
                    <span>{geoLocating ? 'Acquiring GPS...' : 'Use My Current Location'}</span>
                  </button>
                </div>
              </div>

              {geoError && <p className="error-text" style={{ marginBottom: '0.5rem' }}>{geoError}</p>}

              {/* Coordinates inputs */}
              <div className="coords-inputs-row">
                <div className="coord-field">
                  <span className="coord-label">Latitude:</span>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 12.9716"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className={`form-input form-input-sm ${errors.latitude ? 'has-error' : ''}`}
                  />
                </div>
                <div className="coord-field">
                  <span className="coord-label">Longitude:</span>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 77.5946"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className={`form-input form-input-sm ${errors.longitude ? 'has-error' : ''}`}
                  />
                </div>
                {(latitude !== '' || longitude !== '') && (
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost"
                    onClick={() => { setLatitude(''); setLongitude(''); }}
                  >
                    <IconX size={14} /> Clear GPS
                  </button>
                )}
              </div>
              {errors.latitude && <p className="error-text">{errors.latitude}</p>}
              {errors.longitude && <p className="error-text">{errors.longitude}</p>}

              {/* Interactive Leaflet Picker Map */}
              <div className="mini-picker-map-wrap">
                <p className="picker-map-hint">
                  💡 <em>Click anywhere on the map below to pinpoint the exact issue location:</em>
                </p>
                <div className="mini-picker-map-container">
                  <MapContainer
                    center={[Number(latitude) || 12.9716, Number(longitude) || 77.5946]}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ height: '220px', width: '100%', borderRadius: '8px' }}
                  >
                    <TileLayer
                      attribution='&copy; OpenStreetMap'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationPickerHandler onSelectCoords={handleMapCoordSelect} />
                    {latitude !== '' && longitude !== '' && (
                      <Marker
                        position={[Number(latitude), Number(longitude)]}
                        icon={pickerIcon}
                      />
                    )}
                  </MapContainer>
                </div>
              </div>
            </div>

            {/* Description Textarea */}
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Detailed Problem Description <span className="req">*</span>
              </label>
              <textarea
                id="description"
                rows="4"
                placeholder="Describe the issue, surroundings, and whether it poses an immediate safety risk..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`form-textarea ${errors.description ? 'has-error' : ''}`}
              />
              <div className="rule-hint-box">
                💡 <strong>Safety rule trigger:</strong> Words like <em>"accident"</em>, <em>"dangerous"</em>, or <em>"injury"</em> will automatically escalate the issue as a safety hazard.
              </div>
              {errors.description && <p className="error-text">{errors.description}</p>}
            </div>

            {/* Original Complaint Photo (File Upload OR URL) */}
            <div className="form-group">
              <label className="form-label">
                Complaint Photo Evidence <span className="optional-tag">(Optional photo upload or URL)</span>
              </label>
              
              <div className="photo-upload-options">
                <div className="upload-input-file">
                  <label htmlFor="photoFile" className="btn btn-sm btn-secondary file-picker-label">
                    <IconCamera size={16} />
                    <span>{imageFile ? 'Change Photo File' : 'Choose Photo File (JPEG/PNG)'}</span>
                  </label>
                  <input
                    id="photoFile"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  {imageFile && <span className="file-chosen-text">{imageFile.name}</span>}
                </div>

                <span className="or-divider">— OR —</span>

                <input
                  type="url"
                  placeholder="Paste a public photo URL (e.g. Unsplash)..."
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImageFile(null);
                    setImagePreview(e.target.value);
                  }}
                  className="form-input"
                  style={{ flex: 1 }}
                />
              </div>

              {errors.image && <p className="error-text">{errors.image}</p>}

              {/* Photo Preview */}
              {imagePreview && (
                <div className="form-image-preview">
                  <div className="preview-label-row">
                    <span className="preview-label">Complaint Evidence Preview:</span>
                    <button
                      type="button"
                      className="btn-icon-subtle"
                      onClick={() => { setImagePreview(''); setImageFile(null); setImageUrl(''); }}
                    >
                      <IconX size={14} />
                    </button>
                  </div>
                  <img
                    src={imagePreview}
                    alt="Complaint Preview"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="form-actions-bar">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    <span>Submitting to Server...</span>
                  </>
                ) : (
                  <>
                    <IconPlus size={18} />
                    <span>Submit Issue Report</span>
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setDescription('');
                  setLocation('');
                  setImageUrl('');
                  setImageFile(null);
                  setImagePreview('');
                  setLatitude('');
                  setLongitude('');
                  setErrors({});
                  setSubmissionSuccess(null);
                  setSubmissionWarning(null);
                }}
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Resolution Proof Comparison Modal */}
      {showResolutionModal && resolvedDuplicateAlert?.existingIssue && (
        <div className="modal-backdrop" onClick={() => setShowResolutionModal(false)}>
          <div className="modal-content proof-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px' }}>
            <div className="modal-header-row">
              <div>
                <span className="badge-category-count">Resolution Photographic Evidence</span>
                <h3 className="modal-title" style={{ marginTop: '0.25rem' }}>
                  #{resolvedDuplicateAlert.existingIssue.id} — {resolvedDuplicateAlert.existingIssue.category}
                </h3>
                <p className="modal-subtitle">
                  Location: <strong>{resolvedDuplicateAlert.existingIssue.location}</strong>
                </p>
              </div>
              <button className="modal-close-btn" onClick={() => setShowResolutionModal(false)}>
                <IconX size={20} />
              </button>
            </div>

            <div className="compare-columns-grid">
              {/* Before Column */}
              <div className="compare-pane">
                <div className="pane-header">
                  <span className="compare-badge before">BEFORE (Citizen Complaint)</span>
                  <span className="compare-date">{formatDate(resolvedDuplicateAlert.existingIssue.createdAt)}</span>
                </div>
                <div className="compare-img-wrap">
                  {resolvedDuplicateAlert.existingIssue.beforeImageUrl || resolvedDuplicateAlert.existingIssue.imageUrl ? (
                    <img
                      src={resolvedDuplicateAlert.existingIssue.beforeImageUrl || resolvedDuplicateAlert.existingIssue.imageUrl}
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
                  <strong>Initial Complaint:</strong> {resolvedDuplicateAlert.existingIssue.description}
                </p>
              </div>

              {/* After Column */}
              <div className="compare-pane">
                <div className="pane-header">
                  <span className="compare-badge after">AFTER (Municipal Fix Proof)</span>
                  {resolvedDuplicateAlert.existingIssue.resolvedAt && (
                    <span className="compare-date">{formatDate(resolvedDuplicateAlert.existingIssue.resolvedAt)}</span>
                  )}
                </div>
                <div className="compare-img-wrap">
                  {resolvedDuplicateAlert.existingIssue.afterImageUrl ? (
                    <img
                      src={resolvedDuplicateAlert.existingIssue.afterImageUrl}
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
                  <p><strong>Resolved By:</strong> {resolvedDuplicateAlert.existingIssue.resolvedBy || 'Municipal Works Crew'}</p>
                  <p><strong>Resolution Notes:</strong> {resolvedDuplicateAlert.existingIssue.resolutionNotes || 'Repaired and verified on-site.'}</p>
                </div>
              </div>
            </div>

            <div className="modal-footer-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
              <button
                type="button"
                className="btn btn-warning"
                onClick={() => {
                  setShowResolutionModal(false);
                  setIsRecurrence(true);
                }}
              >
                Problem Returned? Report Recurrence
              </button>
              <button className="btn btn-secondary" onClick={() => setShowResolutionModal(false)}>
                Close Proof Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
