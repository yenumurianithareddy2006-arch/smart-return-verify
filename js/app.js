/**
 * Smart Return Verify - Main Application Script
 * Orchestrates navigation, interactive workflow modals/panels, and lead capture.
 */

const App = {
  activeDetailCard: null,

  init() {
    this.bindNavigation();
    this.bindWorkflowCards();
    this.bindContactForm();
    this.bindMobileMenu();
  },

  bindNavigation() {
    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#' || targetId.startsWith('#login') || targetId.startsWith('#dashboard')) return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          // Ensure landing content is visible
          const landingContent = document.getElementById('landing-content');
          const dashView = document.getElementById('dashboard-app-view');
          if (landingContent) landingContent.classList.remove('hidden');
          if (dashView) dashView.classList.add('hidden');

          const headerOffset = 80;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Close mobile menu if open
          const mobileMenu = document.getElementById('mobile-menu');
          if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
          }
        }
      });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
      const sections = ['hero', 'problem', 'solution', 'how-it-works', 'features', 'business-model', 'contact'];
      const scrollY = window.pageYOffset;

      sections.forEach(id => {
        const el = document.getElementById(id);
        const link = document.querySelector(`a[href="#${id}"]`);
        if (el && link) {
          const top = el.offsetTop - 120;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            link.classList.add('text-blue-600', 'font-semibold');
            link.classList.remove('text-slate-600');
          } else {
            link.classList.remove('text-blue-600', 'font-semibold');
            link.classList.add('text-slate-600');
          }
        }
      });
    });
  },

  bindMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (toggleBtn && menu) {
      toggleBtn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
      });
    }
  },

  bindWorkflowCards() {
    // Clickable workflow cards (Card 1, Card 2, Card 3, Card 4)
    document.querySelectorAll('[data-workflow-card]').forEach(card => {
      card.addEventListener('click', (e) => {
        const cardIndex = e.currentTarget.getAttribute('data-workflow-card');
        this.openWorkflowDetail(cardIndex);
      });
    });

    // Back to Workflow buttons
    document.querySelectorAll('[data-back-to-workflow]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeWorkflowDetail();
      });
    });
  },

  openWorkflowDetail(cardIndex) {
    this.activeDetailCard = cardIndex;
    const detailModal = document.getElementById('workflow-detail-modal');
    const detailContainer = document.getElementById('workflow-detail-body');

    if (!detailModal || !detailContainer) return;

    let contentHtml = '';

    if (cardIndex === '1') {
      // CARD 1: Original Record
      contentHtml = `
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
            <div>
              <span class="text-xs font-bold text-blue-600 uppercase tracking-wider">Workflow Stage 1</span>
              <h3 class="text-2xl font-extrabold text-slate-900">Original Manufacturer Record</h3>
            </div>
          </div>

          <p class="text-sm text-slate-600 leading-relaxed">
            The foundation of return verification is the authoritative baseline created during assembly. Before an electronic product leaves the factory floor, its internal components, cryptographic serial numbers, and discharge profiles are registered in an immutable digital passport.
          </p>

          <!-- Core Elements Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 class="font-bold text-xs uppercase text-slate-700 tracking-wider mb-2">Recorded Parameters</h4>
              <ul class="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>Unique Chassis S/N & Base MAC Address</li>
                <li>OEM Battery Serial & Integrated Gas Gauge Chip ID</li>
                <li>Factory Rated Capacity (Wh) & Baseline Internal Resistance</li>
                <li>NVMe Controller Serial & Partition Table UUID</li>
                <li>Optical Reference Photos of Screw Heads & Chassis Seams</li>
              </ul>
            </div>
            <div class="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <h4 class="font-bold text-xs uppercase text-blue-900 tracking-wider mb-2">Secure Manufacturer Storage</h4>
              <p class="text-xs text-blue-800 leading-relaxed">
                Records are cryptographically signed by the OEM's root signing authority. Marketplaces and authorized reverse-logistics partners query this baseline via authenticated API when evaluating returns.
              </p>
            </div>
          </div>

          <!-- Sample Fictional Demonstration Record -->
          <div class="rounded-xl border border-slate-200 overflow-hidden">
            <div class="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs font-mono">
              <span>DEMO PASSPORT: AeroBook Pro 15</span>
              <span class="text-emerald-400">STATUS: FACTORY CERTIFIED</span>
            </div>
            <div class="p-4 bg-slate-50 font-mono text-xs text-slate-700 space-y-2">
              <div class="grid grid-cols-2 gap-2">
                <div><span class="text-slate-500">PRODUCT ID:</span> PRD-AB15-2024</div>
                <div><span class="text-slate-500">SERIAL NUMBER:</span> SN-AB15-9942</div>
                <div><span class="text-slate-500">BATTERY OEM S/N:</span> BAT-OEM-882194-A</div>
                <div><span class="text-slate-500">DESIGN CAPACITY:</span> 92.4 Wh (6-Cell Li-Poly)</div>
                <div><span class="text-slate-500">MICROCONTROLLER:</span> TI BQ40Z50-R2</div>
                <div><span class="text-slate-500">SIGNATURE HASH:</span> 0x8F94AB11E930...</div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (cardIndex === '2') {
      // CARD 2: Doorstep AI Check
      contentHtml = `
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
            </div>
            <div>
              <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider">Workflow Stage 2</span>
              <h3 class="text-2xl font-extrabold text-slate-900">Doorstep AI Screening Check</h3>
            </div>
          </div>

          <p class="text-sm text-slate-600 leading-relaxed">
            The delivery agent uses our lightweight mobile screening app at the customer's doorstep. In under 60 seconds, the agent captures external imagery and, where supported, diagnostic telemetry through a plug-in screening dongle.
          </p>

          <!-- Interactive Doorstep Simulator Shortcut -->
          <div class="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 class="font-bold text-emerald-950 text-sm">Interactive Doorstep Simulator Available</h4>
              <p class="text-xs text-emerald-800">You can test sample cases (Genuine vs. Tampered Battery) directly in our interactive simulator below.</p>
            </div>
            <a href="#demo-ai-section" onclick="App.closeWorkflowDetail()" class="shrink-0 px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition">
              Jump to Live Simulator ↓
            </a>
          </div>

          <!-- Crucial Prototype & Reality Disclaimer -->
          <div class="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
            <div class="font-bold flex items-center gap-1.5 text-amber-800">
              <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              Important Reality & Prototype Transparency
            </div>
            <p class="leading-relaxed">
              <strong>We do not claim that a standard photograph alone can reveal internal battery components.</strong> External computer vision detects screw head drive striations, pry marks, and seam misalignment. Deep internal battery verification requires hardware diagnostic dongles or physical warehouse inspection.
            </p>
          </div>

          <!-- Step Sequence -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div class="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span class="font-bold text-slate-800 block mb-1">1. Photo Intake</span>
              Agent snaps quick photo of chassis serial sticker and bottom screw arrangement.
            </div>
            <div class="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span class="font-bold text-slate-800 block mb-1">2. Diagnostic Ping</span>
              Screening app interrogates battery gas gauge microcontroller via USB-C dongle.
            </div>
            <div class="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span class="font-bold text-slate-800 block mb-1">3. Clear Outcome</span>
              Simple YES (No issue detected) or NO (Suspicious; send to warehouse triage).
            </div>
          </div>
        </div>
      `;
    } else if (cardIndex === '3') {
      // CARD 3: Secure Handoff
      contentHtml = `
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <div>
              <span class="text-xs font-bold text-indigo-600 uppercase tracking-wider">Workflow Stage 3</span>
              <h3 class="text-2xl font-extrabold text-slate-900">Secure & Tamper-Evident Handoff</h3>
            </div>
          </div>

          <p class="text-sm text-slate-600 leading-relaxed">
            Data integrity during reverse logistics is critical. Once the doorstep check concludes, return telemetry is encrypted end-to-end and sealed with an HMAC digital signature to prevent unauthorized modification while traveling from doorstep to warehouse.
          </p>

          <!-- Interactive Cryptographic Pipeline Link -->
          <div class="p-4 bg-indigo-50 rounded-xl border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 class="font-bold text-indigo-950 text-sm">Interactive Cryptographic Pipeline Available</h4>
              <p class="text-xs text-indigo-800">Experience AES-256 payload encryption and test our simulated man-in-the-middle HMAC integrity check.</p>
            </div>
            <a href="#crypto-section" onclick="App.closeWorkflowDetail()" class="shrink-0 px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition">
              Jump to Crypto Pipeline ↓
            </a>
          </div>

          <!-- Flow Diagram -->
          <div class="bg-slate-900 text-white p-5 rounded-xl text-xs font-mono">
            <div class="text-slate-400 mb-3">// Cryptographic Handoff Architecture</div>
            <div class="flex flex-col md:flex-row items-center justify-between gap-2 text-center">
              <div class="p-2.5 bg-slate-800 rounded-lg w-full md:w-auto border border-slate-700">
                <span class="text-emerald-400 font-bold block">1. Return Record</span>
                <span class="text-[10px] text-slate-400">GPS, Serial, Images</span>
              </div>
              <span class="text-blue-400 font-bold">→</span>
              <div class="p-2.5 bg-slate-800 rounded-lg w-full md:w-auto border border-slate-700">
                <span class="text-purple-400 font-bold block">2. AES-256</span>
                <span class="text-[10px] text-slate-400">Encrypted Payload</span>
              </div>
              <span class="text-blue-400 font-bold">→</span>
              <div class="p-2.5 bg-slate-800 rounded-lg w-full md:w-auto border border-slate-700">
                <span class="text-sky-400 font-bold block">3. HMAC-SHA256</span>
                <span class="text-[10px] text-slate-400">Tamper Seal</span>
              </div>
              <span class="text-blue-400 font-bold">→</span>
              <div class="p-2.5 bg-slate-800 rounded-lg w-full md:w-auto border border-slate-700">
                <span class="text-emerald-400 font-bold block">4. Decryption</span>
                <span class="text-[10px] text-slate-400">Warehouse Authenticated</span>
              </div>
            </div>
          </div>

          <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
            <strong>Key Distinction:</strong> Encryption protects information confidentiality (prevents unauthorized parties from reading or tampering with return data); physical inspection confirms the physical component authenticity.
          </div>
        </div>
      `;
    } else {
      // CARD 4: Deep Warehouse Verification
      contentHtml = `
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
            <div>
              <span class="text-xs font-bold text-cyan-600 uppercase tracking-wider">Workflow Stage 4</span>
              <h3 class="text-2xl font-extrabold text-slate-900">Deep Warehouse Verification</h3>
            </div>
          </div>

          <p class="text-sm text-slate-600 leading-relaxed">
            When packages arrive at the central fulfillment hub, authorized forensic technicians access the decrypted return record and conduct thorough component cross-checks against original manufacturer baselines.
          </p>

          <!-- 3 Definitive Status Decisions -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div class="status-dot green mr-1"></div>
              <span class="font-bold text-emerald-950 text-xs block mt-1">Verified</span>
              <p class="text-[11px] text-emerald-800 mt-1">All telemetry, battery serials, and seals match OEM baseline. Refund automatically approved.</p>
            </div>
            <div class="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <div class="status-dot amber mr-1"></div>
              <span class="font-bold text-amber-950 text-xs block mt-1">Suspicious — Further Inspection</span>
              <p class="text-[11px] text-amber-800 mt-1">Component mismatch or clone detected. Escalated for physical disassembly and claim hold.</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-100 border border-slate-200">
              <div class="status-dot mr-1 bg-slate-400"></div>
              <span class="font-bold text-slate-800 text-xs block mt-1">Verification Inconclusive</span>
              <p class="text-[11px] text-slate-600 mt-1">Diagnostic port damaged or battery dead; sent to Level-3 engineering lab for manual testing.</p>
            </div>
          </div>

          <!-- Sample Forensic Comparison Table -->
          <div class="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div class="bg-slate-100 px-4 py-2 font-bold text-slate-700">
              Forensic Comparison Table (Fictional Demonstration)
            </div>
            <table class="w-full text-left">
              <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                <tr>
                  <th class="p-3">Component Metric</th>
                  <th class="p-3">Factory Baseline</th>
                  <th class="p-3">Physical Intake Reading</th>
                  <th class="p-3">Match Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-mono text-slate-700">
                <tr>
                  <td class="p-3 font-sans font-medium">Battery Serial</td>
                  <td class="p-3 text-slate-600">BAT-OEM-882194-A</td>
                  <td class="p-3 text-red-600 font-bold">BAT-GENERIC-990-CLONE</td>
                  <td class="p-3"><span class="badge-pill bg-red-100 text-red-800">MISMATCH</span></td>
                </tr>
                <tr>
                  <td class="p-3 font-sans font-medium">Battery Cycle Count</td>
                  <td class="p-3 text-slate-600">&lt; 15 cycles</td>
                  <td class="p-3 text-red-600 font-bold">462 cycles (Heavy wear)</td>
                  <td class="p-3"><span class="badge-pill bg-red-100 text-red-800">ANOMALY</span></td>
                </tr>
                <tr>
                  <td class="p-3 font-sans font-medium">Motherboard Hash</td>
                  <td class="p-3 text-slate-600">0x99AE4810</td>
                  <td class="p-3 text-emerald-600">0x99AE4810</td>
                  <td class="p-3"><span class="badge-pill bg-emerald-100 text-emerald-800">MATCH</span></td>
                </tr>
                <tr>
                  <td class="p-3 font-sans font-medium">Torx Base Screws</td>
                  <td class="p-3 text-slate-600">Undamaged (Factory Seal)</td>
                  <td class="p-3 text-amber-600">Tool marks / Stripped edges</td>
                  <td class="p-3"><span class="badge-pill bg-amber-100 text-amber-800">FLAGGED</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    detailContainer.innerHTML = contentHtml;
    detailModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  },

  closeWorkflowDetail() {
    const detailModal = document.getElementById('workflow-detail-modal');
    if (detailModal) {
      detailModal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  },

  bindContactForm() {
    const form = document.getElementById('demo-request-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contact-name').value;
        const company = document.getElementById('contact-company').value;
        const email = document.getElementById('contact-email').value;

        // Display confirmation feedback modal
        alert(`Thank you, ${name}! Your demo request for ${company} (${email}) has been received.\n\nOur solutions engineering team will contact you shortly.`);
        form.reset();
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
