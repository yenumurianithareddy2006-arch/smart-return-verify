// Comprehensive automated verification test suite for CivicLens
// Duplicate Issue Detection, Resolved Issue Handling, Negated Safety Phrasing, and Deterministic Ranking
const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('================================================================');
  console.log('🧪 Starting CivicLens Duplicate Detection & Priority Test Suite');
  console.log('================================================================\n');

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
    // 0. Backend Health & Staff Login
    const healthRes = await fetch(`${BASE_URL}/health`);
    const health = await healthRes.json();
    assert(healthRes.status === 200 && health.status === 'ok', 'API health check returns 200 and ok');

    const staffLoginRes = await fetch(`${BASE_URL}/auth/staff-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'staff_admin', password: 'CivicStaff@2026' })
    });
    const staffData = await staffLoginRes.json();
    assert(staffLoginRes.status === 200 && staffData.token, 'Staff login authenticated successfully');
    const staffToken = staffData.token;

    // Initial issues count
    const initialIssues = await (await fetch(`${BASE_URL}/issues`)).json();
    const initialCount = initialIssues.length;

    // -------------------------------------------------------------------------
    // TEST 1: Unresolved Duplicate Detection (Same pothole twice -> grouped, no extra record)
    // -------------------------------------------------------------------------
    console.log('\n--- Test 1: Unresolved Duplicate Issue Detection ---');
    const testLoc1 = `Maple Corner Lane ${Date.now()}`;
    const report1Res = await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Pothole',
        location: testLoc1,
        description: 'First report of a deep pothole in road center lane.',
        reporterId: 'CITIZEN-TEST-1',
        latitude: 12.9100,
        longitude: 77.6100
      })
    });
    const report1 = await report1Res.json();
    assert(report1Res.status === 201 && report1.isGrouped === false, 'First pothole report created as new issue');
    const issue1Id = report1.issue.id;

    // Submit identical pothole at same location by different citizen
    const report2Res = await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Pothole',
        location: testLoc1,
        description: 'Second report of the same pothole by neighbor.',
        reporterId: 'CITIZEN-TEST-2',
        latitude: 12.9100,
        longitude: 77.6100
      })
    });
    const report2 = await report2Res.json();
    assert(report2.isGrouped === true, 'Second identical report identified existing unresolved issue and grouped');
    assert(report2.issue.id === issue1Id, 'Grouped report mapped to existing issue ID');
    assert(report2.issue.uniqueReporterCount === 2, 'Unique reporters increased to 2 on grouped issue');

    // Verify database issue count only increased by 1 (no duplicate record)
    const afterDupIssues = await (await fetch(`${BASE_URL}/issues`)).json();
    assert(afterDupIssues.length === initialCount + 1, 'Total database records increased by exactly 1 (duplicate avoided)');

    // -------------------------------------------------------------------------
    // TEST 2: Deduplication of Unique Reporter Count
    // -------------------------------------------------------------------------
    console.log('\n--- Test 2: Unique Reporter Deduplication ---');
    const repeatRes = await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Pothole',
        location: testLoc1,
        description: 'Third report but from the same citizen CITIZEN-TEST-1.',
        reporterId: 'CITIZEN-TEST-1'
      })
    });
    const repeatData = await repeatRes.json();
    assert(repeatData.issue.uniqueReporterCount === 2, 'Repeated report by CITIZEN-TEST-1 preserved unique reporter count at 2 (no inflation)');

    // -------------------------------------------------------------------------
    // TEST 3: Resolved Issue Matching with Staff Photo Proof
    // -------------------------------------------------------------------------
    console.log('\n--- Test 3: Resolved Issue Matching with Staff Resolution Photo ---');
    // Mark issue1 as Resolved with resolution proof photo
    const resolveRes = await fetch(`${BASE_URL}/issues/${issue1Id}/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${staffToken}`
      },
      body: JSON.stringify({
        afterImageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
        resolvedBy: 'Inspector A. Kumar',
        resolutionNotes: 'Asphalt patching completed and road reopened.'
      })
    });
    const resolvedIssue = (await resolveRes.json()).issue;
    assert(resolvedIssue.status === 'Resolved' && resolvedIssue.afterImageUrl, 'Issue marked Resolved with afterImageUrl proof');

    // Citizen now tries to report the same pothole again
    const dupAfterResolvedRes = await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Pothole',
        location: testLoc1,
        description: 'Citizen unaware the pothole was already fixed submitting again.',
        reporterId: 'CITIZEN-NEW-3'
      })
    });
    const dupResolvedData = await dupAfterResolvedRes.json();

    assert(dupAfterResolvedRes.status === 409, 'Submitting duplicate of resolved issue returned HTTP 409 Conflict');
    assert(dupResolvedData.resolvedDuplicate === true, 'Response payload contains resolvedDuplicate: true');
    assert(
      dupResolvedData.error === 'This issue has already been resolved. Please check the resolution photo before submitting another report.',
      'Exact error string returned: "This issue has already been resolved. Please check the resolution photo before submitting another report."'
    );
    assert(dupResolvedData.existingIssue && dupResolvedData.existingIssue.id === issue1Id, 'Response returns existing resolved issue with afterImageUrl');

    // -------------------------------------------------------------------------
    // TEST 4: Recurrence Reporting (Problem Returned / Repair Failed)
    // -------------------------------------------------------------------------
    console.log('\n--- Test 4: Citizen Recurrence Reporting (Not Rejected) ---');
    const recurrenceRes = await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Pothole',
        location: testLoc1,
        description: 'The asphalt patch has cracked after heavy rain. Pothole has returned.',
        reporterId: 'CITIZEN-NEW-3',
        isRecurrence: true,
        recurrenceNotes: 'Previous repair washed away after rain.'
      })
    });
    const recurrenceData = await recurrenceRes.json();
    assert(recurrenceRes.status === 201, 'Recurrence report successfully created with HTTP 201 (not rejected)');
    assert(recurrenceData.isRecurrence === true && recurrenceData.issue.isRecurrence === true, 'New issue marked with isRecurrence: true');
    assert(recurrenceData.issue.previousReportId === issue1Id, 'New recurrence issue links back to previous resolved issue ID');
    assert(recurrenceData.issue.status === 'Reported', 'New recurrence issue status is active Reported');

    // -------------------------------------------------------------------------
    // TEST 5: Explicit Reopen Endpoint (/api/issues/:id/reopen)
    // -------------------------------------------------------------------------
    console.log('\n--- Test 5: Reopen Endpoint POST /api/issues/:id/reopen ---');
    // Create another resolved issue to test reopen
    const reopenLoc = `Elm Grove Road ${Date.now()}`;
    const rCreate = await (await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Streetlight',
        location: reopenLoc,
        description: 'Streetlight flickering at night.'
      })
    })).json();
    await fetch(`${BASE_URL}/issues/${rCreate.issue.id}/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${staffToken}`
      },
      body: JSON.stringify({
        afterImageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600',
        resolvedBy: 'Officer R. Sharma'
      })
    });

    const reopenRes = await fetch(`${BASE_URL}/issues/${rCreate.issue.id}/reopen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reporterId: 'CITIZEN-REOPEN-1',
        recurrenceNotes: 'Bulb failed again 2 days after replacement.'
      })
    });
    const reopenData = await reopenRes.json();
    assert(reopenRes.status === 200, 'Reopen endpoint returns 200');
    assert(reopenData.issue.status === 'Reported', 'Reopened issue status set back to Reported');
    assert(reopenData.issue.isRecurrence === true, 'Reopened issue has isRecurrence: true');
    assert(reopenData.issue.reopenCount >= 1, 'Reopen count incremented');

    // -------------------------------------------------------------------------
    // TEST 6: Same Category at Genuinely Different Locations
    // -------------------------------------------------------------------------
    console.log('\n--- Test 6: Same Category at Genuinely Different Locations ---');
    const diffLoc1 = `North Ridge Highway ${Date.now()}`;
    const diffLoc2 = `South Harbor Parkway ${Date.now()}`;

    const resDiff1 = await (await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Pothole',
        location: diffLoc1,
        description: 'Pothole on North Ridge Highway.',
        latitude: 12.9800,
        longitude: 77.6300
      })
    })).json();

    const resDiff2 = await (await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Pothole',
        location: diffLoc2,
        description: 'Pothole on South Harbor Parkway.',
        latitude: 12.9200,
        longitude: 77.5500
      })
    })).json();

    assert(resDiff1.issue.id !== resDiff2.issue.id, 'Potholes at different locations created distinct issue records');
    assert(resDiff2.isGrouped === false, 'Second pothole was NOT grouped into first pothole');

    // -------------------------------------------------------------------------
    // TEST 7: Variations in Capitalization, Spaces, and Punctuation
    // -------------------------------------------------------------------------
    console.log('\n--- Test 7: Variations in Capitalization & Whitespace Normalization ---');
    const normTestBase = `Boulevard Plaza East ${Date.now()}`;
    const baseNormRes = await (await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Garbage',
        location: normTestBase,
        description: 'Garbage accumulation near store.'
      })
    })).json();

    // Submit with messy spacing and uppercase: "   BOULEVARD   PLAZA  EAST.  "
    const messyLoc = `   BOULEVARD   PLAZA   EAST.   `.replace('BOULEVARD   PLAZA   EAST', normTestBase.toUpperCase());
    const messyNormRes = await (await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Garbage',
        location: messyLoc,
        description: 'Another citizen reporting the same garbage.'
      })
    })).json();

    assert(messyNormRes.isGrouped === true, 'Duplicate detected despite trailing punctuation, extra spaces, and uppercase');
    assert(messyNormRes.issue.id === baseNormRes.issue.id, 'Messy location mapped to same issue ID');

    // -------------------------------------------------------------------------
    // TEST 8: Negated Emergency Phrases (No false positive emergency escalation)
    // -------------------------------------------------------------------------
    console.log('\n--- Test 8: Negated Safety Phrases vs Genuine Emergency ---');
    const negatedLoc = `Quiet Residential Circle ${Date.now()}`;
    const negatedRes = await (await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Pothole',
        location: negatedLoc,
        description: 'Small shallow pothole on residential lane. It is not dangerous, no risk of accident, and no injury hazard.'
      })
    })).json();

    assert(negatedRes.issue.isEmergency === false, 'Negated phrases ("not dangerous", "no risk") did NOT trigger emergency escalation');
    assert(negatedRes.issue.priority !== 'Critical', 'Priority is NOT Critical when safety phrases are negated');

    // Genuine emergency
    const genuineLoc = `Speedway Bypass Junction ${Date.now()}`;
    const genuineRes = await (await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Pothole',
        location: genuineLoc,
        description: 'Large deep pothole on high-speed expressway, dangerous hazard causing multiple severe car accidents!'
      })
    })).json();

    assert(genuineRes.issue.isEmergency === true, 'Genuine safety keyword triggered isEmergency: true');
    assert(genuineRes.issue.priority === 'Critical', 'Genuine emergency received Critical priority badge');

    // -------------------------------------------------------------------------
    // TEST 9: Priority Score Formula & Deterministic Sorting
    // -------------------------------------------------------------------------
    console.log('\n--- Test 9: Score Formula & Deterministic Emergency Sorting ---');
    // Formula verification: Priority Score = (0.5 * Impact) + (0.3 * Severity) + (0.2 * Urgency)
    // Create water leak with 2 unique reporters, severity 80, urgency 75
    // Impact = (2/50)*100 = 4.0
    // Priority Score = (0.5 * 4) + (0.3 * 80) + (0.2 * 75) = 2.0 + 24.0 + 15.0 = 41.0
    const waterLoc = `Aqueduct Lane ${Date.now()}`;
    const waterIssueRes = await (await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Water Leakage',
        location: waterLoc,
        description: 'Sidewalk water pipe seepage, no danger.',
        reporterId: 'CITIZEN-W1'
      })
    })).json();

    await fetch(`${BASE_URL}/issues/${waterIssueRes.issue.id}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reporterId: 'CITIZEN-W2' })
    });

    const setScoresRes = await (await fetch(`${BASE_URL}/issues/${waterIssueRes.issue.id}/scores`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${staffToken}`
      },
      body: JSON.stringify({ severity: 80, urgency: 75, isEmergency: false })
    })).json();

    const waterIssue = setScoresRes.issue;
    assert(waterIssue.priorityScore === 41.0, `Water leak priority score calculated strictly by formula: 41.0 (got ${waterIssue.priorityScore})`);
    assert(waterIssue.priority === 'Medium', 'Water leak with score 41.0 receives Medium priority');
    assert(waterIssue.isEmergency === false, 'Water leak isEmergency is false');

    // Create an Emergency pothole with 1 reporter, severity 70, urgency 65
    // Impact = (1/50)*100 = 2.0
    // Priority Score = (0.5 * 2) + (0.3 * 70) + (0.2 * 65) = 1.0 + 21.0 + 13.0 = 35.0
    const emergPotholeLoc = `Downtown Fast Track ${Date.now()}`;
    const emergPotholeRes = await (await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Pothole',
        location: emergPotholeLoc,
        description: 'Large dangerous pothole causing sudden braking.',
        reporterId: 'CITIZEN-EP1'
      })
    })).json();

    const setEmergScores = await (await fetch(`${BASE_URL}/issues/${emergPotholeRes.issue.id}/scores`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${staffToken}`
      },
      body: JSON.stringify({ severity: 70, urgency: 65, isEmergency: true })
    })).json();

    const emergPothole = setEmergScores.issue;
    assert(emergPothole.priorityScore === 35.0, `Emergency pothole numerical score preserved: 35.0 (got ${emergPothole.priorityScore})`);
    assert(emergPothole.isEmergency === true, 'Emergency pothole has isEmergency: true');
    assert(emergPothole.priority === 'Critical', 'Emergency pothole has Critical label');

    // Fetch all issues to verify deterministic ordering
    const sortedIssues = await (await fetch(`${BASE_URL}/issues`)).json();
    const emergIndex = sortedIssues.findIndex(i => i.id === emergPothole.id);
    const waterIndex = sortedIssues.findIndex(i => i.id === waterIssue.id);

    assert(emergIndex < waterIndex, `Emergency pothole (score 35.0) ranks BEFORE normal water leak (score 41.0) in deterministic sort (emergIndex=${emergIndex}, waterIndex=${waterIndex})`);
    assert(emergPothole.priorityScore === 35.0, 'Displayed priority score for emergency pothole remains 35.0 (not artificially inflated to 100)');

    // -------------------------------------------------------------------------
    // SUMMARY
    // -------------------------------------------------------------------------
    console.log('\n================================================================');
    console.log(`🎉 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('================================================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal error running tests:', err);
    process.exit(1);
  }
}

runTests();
