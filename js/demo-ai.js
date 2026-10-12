/**
 * Smart Return Verify - Doorstep AI Screening Simulator
 * Simulates first-level agent triage with honest prototype disclosures.
 */

const DemoAISimulator = {
  activeCase: 'genuine', // 'genuine' | 'tampered' | 'custom'
  isScanning: false,

  scenarios: {
    genuine: {
      name: "Case A: Genuine Laptop (Verified Baseline)",
      device: "AeroBook Pro 15 (Model AB-2024)",
      serial: "SN-AB15-9942",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240' width='100%' height='100%'><rect width='400' height='240' fill='%23f1f5f9'/><rect x='60' y='30' width='280' height='160' rx='8' fill='%23334155'/><rect x='70' y='40' width='260' height='140' rx='4' fill='%230f172a'/><circle cx='200' cy='110' r='20' fill='%2338bdf8' opacity='0.7'/><rect x='30' y='190' width='340' height='16' rx='4' fill='%2364748b'/><rect x='160' y='192' width='80' height='6' rx='2' fill='%2394a3b8'/><text x='200' y='160' fill='%2394a3b8' font-family='sans-serif' font-size='12' text-anchor='middle'>AeroBook Pro 15 • OEM Intact</text></svg>",
      chassisTamperScore: 0.04, // Very low suspicion
      diagnosticStatus: "Normal OEM Handshake",
      batteryTelemetry: {
        reportedSerial: "BAT-OEM-882194-A",
        expectedSerial: "BAT-OEM-882194-A",
        cycleCount: 14,
        factoryCapacity: "92.4 Wh",
        currentCapacity: "91.8 Wh",
        firmwareSignature: "0x8F94...Valid"
      },
      verdict: "YES",
      verdictText: "YES — No obvious issue detected",
      verdictColor: "emerald",
      explanation: "Chassis screw heads are intact with no optical burring. Diagnostic handshake with USB-C screening dongle confirmed OEM battery serial and cryptographic signature match manufacturer baseline."
    },
    tampered: {
      name: "Case B: Tampered Battery Return (Swapped Internals)",
      device: "AeroBook Pro 15 (Model AB-2024)",
      serial: "SN-AB15-9942",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240' width='100%' height='100%'><rect width='400' height='240' fill='%23fef2f2'/><rect x='60' y='30' width='280' height='160' rx='8' fill='%23334155'/><rect x='70' y='40' width='260' height='140' rx='4' fill='%231e293b'/><circle cx='200' cy='110' r='20' fill='%23ef4444' opacity='0.7'/><rect x='30' y='190' width='340' height='16' rx='4' fill='%2364748b'/><rect x='160' y='192' width='80' height='6' rx='2' fill='%2394a3b8'/><circle cx='80' cy='198' r='4' fill='%23ef4444'/><circle cx='320' cy='198' r='4' fill='%23ef4444'/><text x='200' y='160' fill='%23f87171' font-family='sans-serif' font-size='12' text-anchor='middle'>WARNING: Screw Torx Burring Detected</text></svg>",
      chassisTamperScore: 0.89, // High suspicion
      diagnosticStatus: "Signature Mismatch / Foreign Microcontroller",
      batteryTelemetry: {
        reportedSerial: "BAT-GENERIC-990-CLONE",
        expectedSerial: "BAT-OEM-882194-A",
        cycleCount: 462,
        factoryCapacity: "92.4 Wh",
        currentCapacity: "48.2 Wh (Degraded)",
        firmwareSignature: "0x0000...Invalid"
      },
      verdict: "NO",
      verdictText: "NO — Suspicious; Send to Warehouse",
      verdictColor: "red",
      explanation: "Optical analysis detected stripped Torx screw heads on chassis base. Hardware diagnostic telemetry revealed generic replacement battery with mismatched serial number and 462 heavy cycles (expected < 20)."
    }
  },

  init() {
    this.bindEvents();
    this.renderScenario('genuine');
  },

  bindEvents() {
    const caseButtons = document.querySelectorAll('[data-demo-case]');
    caseButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const caseKey = e.currentTarget.getAttribute('data-demo-case');
        this.selectScenario(caseKey);
      });
    });

    const triggerBtn = document.getElementById('run-ai-scan-btn');
    if (triggerBtn) {
      triggerBtn.addEventListener('click', () => this.runSimulation());
    }

    const fileInput = document.getElementById('custom-device-upload');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => this.handleCustomUpload(e));
    }
  },

  selectScenario(caseKey) {
    if (this.isScanning) return;
    this.activeCase = caseKey;

    // Update active button styling
    document.querySelectorAll('[data-demo-case]').forEach(btn => {
      if (btn.getAttribute('data-demo-case') === caseKey) {
        btn.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
        btn.classList.remove('bg-white', 'text-slate-700', 'border-slate-200');
      } else {
        btn.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
        btn.classList.add('bg-white', 'text-slate-700', 'border-slate-200');
      }
    });

    this.renderScenario(caseKey);
  },

  renderScenario(caseKey) {
    const data = this.scenarios[caseKey] || this.scenarios.genuine;
    const previewContainer = document.getElementById('ai-device-preview');
    const statusBox = document.getElementById('ai-scan-status-box');
    const resultBox = document.getElementById('ai-scan-result-card');

    if (previewContainer) {
      previewContainer.innerHTML = data.image;
    }

    // Reset result state until "Run AI Screening" is tapped
    if (resultBox) {
      resultBox.classList.add('hidden');
    }
    if (statusBox) {
      statusBox.innerHTML = `
        <div class="text-sm text-slate-500 flex items-center justify-between">
          <span>Active Test Case: <strong class="text-slate-800">${data.name}</strong></span>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">Ready to Scan</span>
        </div>
      `;
    }
  },

  handleCustomUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.scenarios.custom = {
        name: `Custom Upload: ${file.name.substring(0, 18)}...`,
        device: "Uploaded Device Image",
        serial: "SN-EXT-" + Math.floor(1000 + Math.random() * 9000),
        image: `<img src="${e.target.result}" alt="Uploaded Product" class="w-full h-48 object-cover rounded-lg border border-slate-200" />`,
        chassisTamperScore: 0.12,
        diagnosticStatus: "Simulated Optical & Diagnostic Check",
        batteryTelemetry: {
          reportedSerial: "BAT-OEM-882194-A",
          expectedSerial: "BAT-OEM-882194-A",
          cycleCount: 9,
          factoryCapacity: "92.4 Wh",
          currentCapacity: "92.1 Wh",
          firmwareSignature: "0x8F94...Valid"
        },
        verdict: "YES",
        verdictText: "YES — No obvious issue detected",
        verdictColor: "emerald",
        explanation: "Simulated check on uploaded asset passed optical threshold. Exterior casing and screw contours match standard reference model profile."
      };
      this.selectScenario('custom');
    };
    reader.readAsDataURL(file);
  },

  runSimulation() {
    if (this.isScanning) return;
    this.isScanning = true;

    const data = this.scenarios[this.activeCase] || this.scenarios.genuine;
    const scannerOverlay = document.getElementById('ai-scanner-overlay');
    const scanStatusBox = document.getElementById('ai-scan-status-box');
    const resultBox = document.getElementById('ai-scan-result-card');
    const runBtn = document.getElementById('run-ai-scan-btn');

    if (scannerOverlay) scannerOverlay.classList.remove('hidden');
    if (resultBox) resultBox.classList.add('hidden');
    if (runBtn) {
      runBtn.disabled = true;
      runBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Analyzing Evidence...
      `;
    }

    const steps = [
      "1/4 Ingesting product image & screw geometry...",
      "2/4 Optical inspection: looking for Torx screw stripping & seam prying...",
      "3/4 Querying manufacturer reference registry for SN: " + data.serial + "...",
      "4/4 Interrogating diagnostic telemetry payload..."
    ];

    let currentStep = 0;
    const stepInterval = setInterval(() => {
      if (currentStep < steps.length && scanStatusBox) {
        scanStatusBox.innerHTML = `
          <div class="space-y-1">
            <div class="text-xs font-semibold text-blue-600 uppercase tracking-wider">Screening in progress</div>
            <div class="text-sm font-medium text-slate-700 animate-pulse">${steps[currentStep]}</div>
          </div>
        `;
        currentStep++;
      } else {
        clearInterval(stepInterval);
        this.finishSimulation(data);
      }
    }, 600);
  },

  finishSimulation(data) {
    this.isScanning = false;
    const scannerOverlay = document.getElementById('ai-scanner-overlay');
    const runBtn = document.getElementById('run-ai-scan-btn');
    const resultBox = document.getElementById('ai-scan-result-card');
    const scanStatusBox = document.getElementById('ai-scan-status-box');

    if (scannerOverlay) scannerOverlay.classList.add('hidden');
    if (runBtn) {
      runBtn.disabled = false;
      runBtn.innerHTML = `
        <svg class="w-4 h-4 mr-1.5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Re-run AI Screening
      `;
    }

    if (scanStatusBox) {
      scanStatusBox.innerHTML = `
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-600 font-medium">Evaluation Complete</span>
          <span class="text-xs px-2 py-0.5 rounded font-bold ${data.verdict === 'YES' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}">
            Screening Finished
          </span>
        </div>
      `;
    }

    if (resultBox) {
      const isYes = data.verdict === 'YES';
      resultBox.classList.remove('hidden');
      resultBox.innerHTML = `
        <div class="p-5 rounded-xl border ${isYes ? 'bg-emerald-50/80 border-emerald-200' : 'bg-red-50/80 border-red-200'}">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isYes ? 'bg-emerald-500 text-white shadow-emerald-200 shadow-md' : 'bg-red-500 text-white shadow-red-200 shadow-md'}">
              ${isYes 
                ? '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>'
                : '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>'
              }
            </div>
            <div class="flex-1">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <h4 class="text-lg font-bold ${isYes ? 'text-emerald-950' : 'text-red-950'}">
                  ${data.verdictText}
                </h4>
                <span class="text-xs font-mono px-2 py-1 rounded ${isYes ? 'bg-emerald-200/60 text-emerald-900' : 'bg-red-200/60 text-red-900'}">
                  Confidence Score: ${isYes ? '96.4%' : '98.8%'}
                </span>
              </div>
              <p class="mt-2 text-sm ${isYes ? 'text-emerald-800' : 'text-red-800'} leading-relaxed">
                ${data.explanation}
              </p>

              <!-- Diagnostic Telemetry Comparison Table -->
              <div class="mt-4 pt-3 border-t ${isYes ? 'border-emerald-200' : 'border-red-200'}">
                <div class="text-xs font-bold uppercase tracking-wider mb-2 ${isYes ? 'text-emerald-900' : 'text-red-900'}">
                  Diagnostic Telemetry Summary
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                  <div class="p-2 rounded bg-white/70 border ${isYes ? 'border-emerald-100' : 'border-red-100'}">
                    <span class="text-slate-500 block text-[10px]">BATTERY SERIAL</span>
                    <span class="font-bold ${data.batteryTelemetry.reportedSerial === data.batteryTelemetry.expectedSerial ? 'text-emerald-700' : 'text-red-600'}">
                      ${data.batteryTelemetry.reportedSerial}
                    </span>
                  </div>
                  <div class="p-2 rounded bg-white/70 border ${isYes ? 'border-emerald-100' : 'border-red-100'}">
                    <span class="text-slate-500 block text-[10px]">CYCLE COUNT</span>
                    <span class="font-bold ${data.batteryTelemetry.cycleCount < 30 ? 'text-emerald-700' : 'text-red-600'}">
                      ${data.batteryTelemetry.cycleCount} cycles
                    </span>
                  </div>
                  <div class="p-2 rounded bg-white/70 border ${isYes ? 'border-emerald-100' : 'border-red-100'} col-span-2 sm:col-span-1">
                    <span class="text-slate-500 block text-[10px]">SIGNATURE STATUS</span>
                    <span class="font-bold ${data.batteryTelemetry.firmwareSignature.includes('Valid') ? 'text-emerald-700' : 'text-red-600'}">
                      ${data.batteryTelemetry.firmwareSignature}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Recommendation Action -->
              <div class="mt-4 flex items-center justify-between text-xs font-semibold ${isYes ? 'text-emerald-900' : 'text-red-900'}">
                <span>Action: ${isYes ? 'Accept return doorstep intake; package in standard anti-static seal.' : 'Tag unit as SUSPECT; route directly to Tier-2 Forensic Warehouse.'}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  DemoAISimulator.init();
});
