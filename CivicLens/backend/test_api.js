// CivicLens Backend Verification Script
async function runTests() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('🧪 Starting CivicLens Backend Verification Tests...\n');
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
    assert(healthRes.status === 200 && healthData.status === 'ok', 'API 1: Health check returns status 200 and ok');

    // 2. Reject missing required fields
    const invalidRes = await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'Pothole' }) // missing location & description
    });
    assert(invalidRes.status === 400, 'API 2: Rejects issue missing location/description with 400');

    // 3. Reject invalid category
    const badCatRes = await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'AlienInvasion', description: 'UFO landed', location: 'City Park' })
    });
    assert(badCatRes.status === 400, 'API 2: Rejects unsupported category with 400');

    // 4. Create Issue - Pothole (Priority should be High)
    const createPotholeRes = await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Pothole',
        description: 'Hazardous deep pothole on Main Street',
        location: 'Main Street & 5th Ave'
      })
    });
    const potholeData = await createPotholeRes.json();
    assert(createPotholeRes.status === 201 && potholeData.issue.priority === 'High', 'API 2: Pothole report sets priority to High');
    assert(potholeData.issue.status === 'Reported', 'API 2: Initial status is Reported');
    assert(potholeData.issue.possibleDuplicate === false, 'API 2: First report is not a duplicate');

    // 5. Duplicate Check - Same Category and Location
    const dupRes = await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Pothole',
        description: 'Someone reported this pothole again at main street',
        location: '  main street & 5th ave  ' // Extra spaces & lowercase
      })
    });
    const dupData = await dupRes.json();
    assert(dupRes.status === 201 && dupData.issue.possibleDuplicate === true, 'Duplicate Check: Normalizes location/category and flags possibleDuplicate: true');

    // 6. Priority Rule - Keyword escalation for Garbage (normal = Medium, with "accident" = High)
    const normalGarbageRes = await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Garbage',
        description: 'Litter on sidewalk',
        location: 'Elm Street'
      })
    });
    const normalGarbageData = await normalGarbageRes.json();
    assert(normalGarbageData.issue.priority === 'Medium', 'Priority Rule: Garbage defaults to Medium priority');

    const safetyGarbageRes = await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Garbage',
        description: 'Broken glass and debris caused a bicycle accident near school',
        location: 'School Lane'
      })
    });
    const safetyGarbageData = await safetyGarbageRes.json();
    assert(safetyGarbageData.issue.priority === 'High', 'Priority Rule: Safety keyword ("accident") escalates Garbage to High priority');

    // 7. List Issues (API 3)
    const listRes = await fetch(`${BASE_URL}/issues`);
    const listData = await listRes.json();
    assert(Array.isArray(listData) && listData.length >= 4, `API 3: GET /api/issues returns list of issues (found ${listData.length})`);

    // 8. Update Status (API 4)
    const targetIssueId = potholeData.issue.id;
    const updateProgressRes = await fetch(`${BASE_URL}/issues/${targetIssueId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'In Progress' })
    });
    const updateProgressData = await updateProgressRes.json();
    assert(updateProgressRes.status === 200 && updateProgressData.issue.status === 'In Progress', 'API 4: Updates status to "In Progress"');

    const updateResolvedRes = await fetch(`${BASE_URL}/issues/${targetIssueId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Resolved' })
    });
    const updateResolvedData = await updateResolvedRes.json();
    assert(updateResolvedRes.status === 200 && updateResolvedData.issue.status === 'Resolved', 'API 4: Updates status to "Resolved"');

    // 9. Dashboard Statistics (API 5)
    const statsRes = await fetch(`${BASE_URL}/stats`);
    const statsData = await statsRes.json();
    assert(typeof statsData.total === 'number' && statsData.total >= 4, `API 5: Total count accurate (${statsData.total})`);
    assert(typeof statsData.highPriority === 'number' && statsData.highPriority >= 2, `API 5: High priority count accurate (${statsData.highPriority})`);
    assert(typeof statsData.resolved === 'number' && statsData.resolved >= 1, `API 5: Resolved count accurate (${statsData.resolved})`);

    console.log(`\n===============================================`);
    console.log(`Tests Completed: ${passed} Passed, ${failed} Failed`);
    console.log(`===============================================`);
  } catch (err) {
    console.error('Fatal test error:', err);
  }
}

runTests();
