/**
 * Smart Return Verify - Cryptographic Handoff & HMAC Simulator
 * Demonstrates how digital return evidence is encrypted and integrity-verified in transit.
 */

const CryptoSimulator = {
  stage: 1, // 1: Record Created, 2: Encrypted, 3: HMAC Signed, 4: In Transit, 5: Warehouse Verified
  isTampered: false,

  rawRecord: {
    returnId: "RET-2024-88412",
    productRef: "SN-AB15-9942",
    model: "AeroBook Pro 15",
    agentId: "AGENT-HYD-041",
    timestamp: "2024-10-09T14:22:18Z",
    screeningResult: "NO_SUSPICIOUS_BATTERY",
    opticalTamperScore: "0.89",
    batteryTelemetry: {
      serial: "BAT-GENERIC-990-CLONE",
      cycles: 462,
      firmwareChecksum: "0x00000000"
    },
    warehouseDestination: "WH-BLR-CENTRAL-01"
  },

  init() {
    this.renderCurrentStage();
    this.bindEvents();
  },

  bindEvents() {
    const nextBtn = document.getElementById('crypto-next-step');
    const resetBtn = document.getElementById('crypto-reset-step');
    const tamperToggle = document.getElementById('crypto-simulate-tamper');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.stage < 4) {
          this.stage++;
        } else {
          this.stage = 1;
        }
        this.renderCurrentStage();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.stage = 1;
        this.isTampered = false;
        if (tamperToggle) tamperToggle.checked = false;
        this.renderCurrentStage();
      });
    }

    if (tamperToggle) {
      tamperToggle.addEventListener('change', (e) => {
        this.isTampered = e.target.checked;
        this.renderCurrentStage();
      });
    }

    // Step navigation buttons
    document.querySelectorAll('[data-crypto-step]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const stepNum = parseInt(e.currentTarget.getAttribute('data-crypto-step'), 10);
        this.stage = stepNum;
        this.renderCurrentStage();
      });
    });
  },

  renderCurrentStage() {
    const stageDisplay = document.getElementById('crypto-stage-content');
    const stepIndicators = document.querySelectorAll('[data-crypto-step]');
    const nextBtn = document.getElementById('crypto-next-step');

    // Update active tab buttons
    stepIndicators.forEach(btn => {
      const stepNum = parseInt(btn.getAttribute('data-crypto-step'), 10);
      if (stepNum === this.stage) {
        btn.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
        btn.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');
      } else {
        btn.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
        btn.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
      }
    });

    if (nextBtn) {
      nextBtn.textContent = this.stage === 4 ? "Restart Workflow" : "Proceed to Next Stage →";
    }

    if (!stageDisplay) return;

    if (this.stage === 1) {
      // Step 1: Plaintext Record
      stageDisplay.innerHTML = `
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-blue-600">Step 1: Doorstep Record Creation</span>
            <span class="badge-pill bg-blue-100 text-blue-800">Plaintext JSON Payload</span>
          </div>
          <p class="text-xs text-slate-600">
            When the delivery agent screens the laptop, an immutable structured digital record is assembled capturing all telemetry, photos, GPS, and agent credentials.
          </p>
          <div class="bg-slate-900 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto shadow-inner">
            <pre>${JSON.stringify(this.rawRecord, null, 2)}</pre>
          </div>
          <div class="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
            <svg class="w-4 h-4 shrink-0 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            <span><strong>Vulnerability:</strong> Sending this record unencrypted over public cellular networks risks interception, payload tampering, or unauthorized data access.</span>
          </div>
        </div>
      `;
    } else if (this.stage === 2) {
      // Step 2: Encrypted Payload (AES-256-GCM)
      stageDisplay.innerHTML = `
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-blue-600">Step 2: Client-Side AES-256 Encryption</span>
            <span class="badge-pill bg-purple-100 text-purple-800">Confidentiality Protected</span>
          </div>
          <p class="text-xs text-slate-600">
            The mobile agent device generates an ephemeral initialization vector (IV) and encrypts the JSON record using AES-256 before transmission.
          </p>
          <div class="bg-slate-900 text-purple-300 p-4 rounded-xl text-xs font-mono overflow-x-auto shadow-inner space-y-2">
            <div class="text-slate-500">// AES-256-GCM Encrypted Envelope</div>
            <div><span class="text-slate-400">"iv":</span> "8f149ad7e2b109cc72"</div>
            <div><span class="text-slate-400">"authTag":</span> "3a9f0012bcfe81a1795"</div>
            <div><span class="text-slate-400">"ciphertext":</span> "7a8f90bb214e9f7c0018a3d5e219ba48810c9e6a5518b029fe80cd9234ba...[3.8KB encrypted]"</div>
          </div>
          <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 flex items-start gap-2">
            <svg class="w-4 h-4 shrink-0 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span><strong>Crucial Concept:</strong> Encryption guarantees that eavesdroppers cannot read return details. It does NOT prove whether the physical laptop inside the package is genuine!</span>
          </div>
        </div>
      `;
    } else if (this.stage === 3) {
      // Step 3: HMAC Integrity Generation
      const hmacVal = this.isTampered ? "HMAC-FAIL-CORRUPTED-SIGNATURE-0000" : "d41d8cd98f00b204e9800998ecf8427e36a445";
      stageDisplay.innerHTML = `
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-blue-600">Step 3: HMAC-SHA256 Integrity Seal</span>
            <span class="badge-pill bg-indigo-100 text-indigo-800">Tamper-Evident Digest</span>
          </div>
          <p class="text-xs text-slate-600">
            A keyed-hash message authentication code (HMAC-SHA256) is generated using a shared cryptographically secure secret. If any byte changes in transit, the signature fails.
          </p>
          <div class="bg-slate-900 text-sky-300 p-4 rounded-xl text-xs font-mono overflow-x-auto shadow-inner space-y-2">
            <div class="text-slate-500">// Digital Digest Envelope</div>
            <div><span class="text-slate-400">"recordHash":</span> "SHA256(payload)"</div>
            <div><span class="text-slate-400">"hmacSignature":</span> "${hmacVal}"</div>
            <div><span class="text-slate-400">"transmissionState":</span> "${this.isTampered ? '<span class=\'text-red-400\'>SIMULATED MAN-IN-THE-MIDDLE BIT FLIP</span>' : 'Unmodified Package'}"</div>
          </div>
          <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
            <strong>Interactive Experiment:</strong> Use the toggle above to simulate a man-in-the-middle tampering attack and see how the warehouse detects it!
          </div>
        </div>
      `;
    } else if (this.stage === 4) {
      // Step 4: Warehouse Verification & Decryption
      if (this.isTampered) {
        stageDisplay.innerHTML = `
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-red-600">Step 4: Warehouse Intake Failed</span>
              <span class="badge-pill bg-red-100 text-red-800">HMAC Integrity Breach</span>
            </div>
            <div class="p-4 bg-red-50 border border-red-300 rounded-xl space-y-2">
              <div class="flex items-center gap-2 text-red-700 font-bold text-sm">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Tampering Detected: HMAC Signature Mismatch!
              </div>
              <p class="text-xs text-red-800">
                The computed hash of the received package does not match the sender's HMAC signature. The digital record was altered or corrupted between doorstep and warehouse!
              </p>
              <div class="mt-2 text-xs font-mono bg-white/80 p-2.5 rounded border border-red-200 text-red-900">
                Expected HMAC: d41d8cd98f00b204e980...<br>
                Computed HMAC: 7f83b1657ff1fc53b92d... (FAIL)<br>
                Status: REJECTED & AUDIT INCIDENT LOGGED
              </div>
            </div>
            <p class="text-xs text-slate-500">Uncheck "Simulate Tampering" above to observe successful verification.</p>
          </div>
        `;
      } else {
        stageDisplay.innerHTML = `
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-600">Step 4: Warehouse Decrypted & Integrity Confirmed</span>
              <span class="badge-pill bg-emerald-100 text-emerald-800">Integrity Verified</span>
            </div>
            <div class="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2">
              <div class="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                HMAC Verification Successful & Payload Decrypted
              </div>
              <p class="text-xs text-emerald-800 leading-relaxed">
                1. HMAC matches exactly: zero bits were altered between doorstep intake and warehouse inbound.<br>
                2. Authorized warehouse key successfully decrypted the record payload.<br>
                3. Forensics team now holds the authentic doorstep triage evidence.
              </p>
              <div class="mt-2 text-xs font-mono bg-white/90 p-3 rounded border border-emerald-200 text-slate-800">
                Return ID: RET-2024-88412 • Model: AeroBook Pro 15<br>
                Doorstep Suspect Flag: <strong class="text-red-600">YES (Suspicious Battery Serial)</strong><br>
                Next Step: Physical Torx disassembly & battery discharge curve test.
              </div>
            </div>
          </div>
        `;
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CryptoSimulator.init();
});
