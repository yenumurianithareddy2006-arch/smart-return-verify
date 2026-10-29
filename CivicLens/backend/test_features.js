// Comprehensive automated verification test for Features 1, 2, and 3
const BASE_URL = 'http://localhost:5000/api';

async function runFeatureTests() {
  console.log('========================================================');
  console.log('🧪 Starting CivicLens Three Features Verification Tests');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'ok', 'API Health check returns status 200 and ok');
    assert(healthData.features && healthData.features.includes('smart-priority-ranking'), 'Backend features list includes smart-priority-ranking');

    // 2. Staff Authentication
    const staffLoginRes = await fetch(`${BASE_URL}/auth/staff-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'staff_admin', password: 'CivicStaff@2026' })
    });
    const staffData = await staffLoginRes.json();
    assert(staffLoginRes.status === 200 && staffData.token, 'Staff login returns 200 and signed authentication token');
    const staffToken = staffData.token;

    // Bad login rejected
    const badLoginRes = await fetch(`${BASE_URL}/auth/staff-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'staff_admin', password: 'WrongPassword' })
    });
    assert(badLoginRes.status === 401, 'Invalid staff credentials rejected with 401');

    // -------------------------------------------------------------------------
    // FEATURE 1: SMART PRIORITY RANKING VERIFICATION
    // -------------------------------------------------------------------------
    console.log('\n--- Testing Feature 1: Smart Priority Ranking ---');

    // Create a Garbage report
    const garbageLoc = `Test Dumpster Location ${Date.now()}`;
    const createGarbageRes = await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Garbage',
        description: 'Overflowing garbage bin on street corner',
        location: garbageLoc,
        reporterId: 'CITIZEN-G1'
      })
    });
    const garbageIssue = (await createGarbageRes.json()).issue;
    assert(garbageIssue.uniqueReporterCount === 1, 'Initial garbage issue has 1 unique reporter');

    // Test repeated reports by SAME person: must NOT inflate count
    await fetch(`${BASE_URL}/issues/${garbageIssue.id}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reporterId: 'CITIZEN-G1' })
    });
    await fetch(`${BASE_URL}/issues/${garbageIssue.id}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reporterId: 'CITIZEN-G1' })
    });
    const gCheck1 = await (await fetch(`${BASE_URL}/issues`)).json();
    const gFound1 = gCheck1.find(i => i.id === garbageIssue.id);
    assert(gFound1.uniqueReporterCount === 1, 'Repeated reports by same citizen did NOT inflate unique reporter count (remains 1)');

    // Add 29 more unique reporters so total unique reporters = 30
    for (let i = 2; i <= 30; i++) {
      await fetch(`${BASE_URL}/issues/${garbageIssue.id}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reporterId: `CITIZEN-G${i}` })
      });
    }

    // Set severity 50 and urgency 60 for garbage as specified in verification test
    const updateGarbageScoresRes = await fetch(`${BASE_URL}/issues/${garbageIssue.id}/scores`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${staffToken}`
      },
      body: JSON.stringify({ severity: 50, urgency: 60, isEmergency: false })
    });
    const updatedGarbage = (await updateGarbageScoresRes.json()).issue;

    // Verify Garbage scores: 30 reporters -> impact = (30/50)*100 = 60.
    // priorityScore = (0.5 * 60) + (0.3 * 50) + (0.2 * 60) = 30 + 15 + 12 = 57.
    assert(updatedGarbage.uniqueReporterCount === 30, 'Garbage issue has exactly 30 unique reporters');
    assert(updatedGarbage.impactScore === 60, 'Garbage impact score is exactly 60 ((30/50)*100)');
    assert(updatedGarbage.priorityScore === 57, `Garbage priority score is exactly 57 (received ${updatedGarbage.priorityScore})`);

    // Create a Streetlight report
    const lightLoc = `Test Dark Crossway ${Date.now()}`;
    const createLightRes = await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Streetlight',
        description: 'Streetlight is unlit and dark',
        location: lightLoc,
        reporterId: 'CITIZEN-L1'
      })
    });
    const lightIssue = (await createLightRes.json()).issue;

    // Add 19 more unique reporters so total unique reporters = 20
    for (let i = 2; i <= 20; i++) {
      await fetch(`${BASE_URL}/issues/${lightIssue.id}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reporterId: `CITIZEN-L${i}` })
      });
    }

    // Set severity 80 and urgency 90 for streetlight as specified in prompt
    const updateLightScoresRes = await fetch(`${BASE_URL}/issues/${lightIssue.id}/scores`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${staffToken}`
      },
      body: JSON.stringify({ severity: 80, urgency: 90, isEmergency: false })
    });
    const updatedLight = (await updateLightScoresRes.json()).issue;

    // Verify Streetlight scores: 20 reporters -> impact = 40.
    // (0.5 * 40) + (0.3 * 80) + (0.2 * 90) = 20 + 24 + 18 = 62.
    assert(updatedLight.uniqueReporterCount === 20, 'Streetlight issue has exactly 20 unique reporters');
    assert(updatedLight.impactScore === 40, 'Streetlight impact score is exactly 40 ((20/50)*100)');
    assert(updatedLight.priorityScore > updatedGarbage.priorityScore, `Streetlight score (${updatedLight.priorityScore}) ranks higher than Garbage (${updatedGarbage.priorityScore})`);

    // Test default priority sort: Streetlight must appear ahead of Garbage
    const priorityListRes = await fetch(`${BASE_URL}/issues`);
    const priorityList = await priorityListRes.json();
    const lightIndex = priorityList.findIndex(i => i.id === lightIssue.id);
    const garbageIndex = priorityList.findIndex(i => i.id === garbageIssue.id);
    assert(lightIndex !== -1 && garbageIndex !== -1 && lightIndex < garbageIndex, 'Issues list ranks higher priority issue above lower priority issue by default');

    // Test emergency escalation override
    const emergencyLoc = `Hazard Gas Leak ${Date.now()}`;
    const createEmergencyRes = await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Pothole',
        description: 'Road collapsed near school crossing causing dangerous accident',
        location: emergencyLoc,
        reporterId: 'CITIZEN-EMERGENCY'
      })
    });
    const emergencyIssue = (await createEmergencyRes.json()).issue;
    assert(emergencyIssue.isEmergency === true, 'Keywords like "accident" trigger emergency escalation');

    const topListRes = await fetch(`${BASE_URL}/issues`);
    const topList = await topListRes.json();
    assert(topList[0].isEmergency === true, 'Emergency escalated issue ranks at the top of unresolved issues');

    // -------------------------------------------------------------------------
    // FEATURE 2: LOCATION-BASED ISSUE MAP VERIFICATION
    // -------------------------------------------------------------------------
    console.log('\n--- Testing Feature 2: Location-Based Issue Map ---');

    // Valid coordinate submission
    const mapIssueRes = await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Water Leakage',
        description: 'Submerged fire hydrant leaking into road',
        location: 'City Square Circle',
        latitude: 12.9716,
        longitude: 77.5946
      })
    });
    const mapIssue = (await mapIssueRes.json()).issue;
    assert(mapIssue.latitude === 12.9716 && mapIssue.longitude === 77.5946, 'Valid latitude and longitude saved correctly');

    // Reject out-of-range latitude
    const badLatRes = await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Water Leakage',
        description: 'Test invalid latitude',
        location: 'North Pole Beyond',
        latitude: 95.5, // > 90
        longitude: 10.0
      })
    });
    assert(badLatRes.status === 400, 'Rejects invalid latitude > 90 with 400 Bad Request');

    // Reject out-of-range longitude
    const badLngRes = await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Water Leakage',
        description: 'Test invalid longitude',
        location: 'Space Longitude',
        latitude: 10.0,
        longitude: -200.0 // < -180
      })
    });
    assert(badLngRes.status === 400, 'Rejects invalid longitude < -180 with 400 Bad Request');

    // Legacy issue without coordinates handled gracefully
    const noCoordRes = await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Pothole',
        description: 'Issue without GPS coordinates',
        location: 'Old Town Alleyway'
      })
    });
    const noCoordIssue = (await noCoordRes.json()).issue;
    assert(noCoordIssue.latitude === null && noCoordIssue.longitude === null, 'Report without coordinates gracefully stores latitude and longitude as null without inventing coordinates');

    // -------------------------------------------------------------------------
    // FEATURE 3: BEFORE-AND-AFTER RESOLUTION PROOF VERIFICATION
    // -------------------------------------------------------------------------
    console.log('\n--- Testing Feature 3: Before-and-After Resolution Proof ---');

    // Unauthorized resolution attempt: MUST be rejected
    const unauthResolveRes = await fetch(`${BASE_URL}/issues/${mapIssue.id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        afterImageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e'
      })
    });
    assert(unauthResolveRes.status === 401, 'Unauthorized resolution attempt rejected with 401');

    // Authorized resolution attempt WITHOUT after-photo: MUST be rejected and issue NOT resolved
    const noPhotoResolveRes = await fetch(`${BASE_URL}/issues/${mapIssue.id}/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${staffToken}`
      },
      body: JSON.stringify({
        afterImageUrl: '', // Empty after-photo
        resolutionNotes: 'Fixed without photo'
      })
    });
    assert(noPhotoResolveRes.status === 400, 'Resolution attempt without after-photo rejected with 400');

    // Verify issue was NOT marked resolved
    const verifyPending = (await (await fetch(`${BASE_URL}/issues`)).json()).find(i => i.id === mapIssue.id);
    assert(verifyPending.status !== 'Resolved', 'Issue was NOT marked as Resolved when after-photo was missing');

    // Authorized resolution with after-photo: MUST succeed
    const validAfterUrl = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80';
    const authResolveRes = await fetch(`${BASE_URL}/issues/${mapIssue.id}/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${staffToken}`
      },
      body: JSON.stringify({
        afterImageUrl: validAfterUrl,
        resolutionNotes: 'Hydrant flange replaced and water pressure restored.',
        resolvedBy: 'Officer R. Sharma (Municipal Works)'
      })
    });
    const resolveData = await authResolveRes.json();
    assert(authResolveRes.status === 200, 'Resolution with valid after-photo succeeds with status 200');
    assert(resolveData.issue.status === 'Resolved', 'Issue status successfully updated to Resolved');
    assert(resolveData.issue.afterImageUrl === validAfterUrl, 'After-photo URL stored separately');
    assert(resolveData.issue.resolvedBy.includes('Officer R. Sharma'), 'Staff member identity preserved in resolution record');
    assert(Boolean(resolveData.issue.resolvedAt), 'Resolution timestamp recorded');

    // Verify persistence across new fetch
    const reFetchedIssue = (await (await fetch(`${BASE_URL}/issues`)).json()).find(i => i.id === mapIssue.id);
    assert(reFetchedIssue.status === 'Resolved' && reFetchedIssue.afterImageUrl === validAfterUrl, 'Resolution evidence persisted in JSON database');

    console.log('\n========================================================');
    console.log(`Results: ${passed} Passed, ${failed} Failed`);
    console.log('========================================================');
  } catch (err) {
    console.error('Fatal test execution error:', err);
  }
}

runFeatureTests();
