/**
 * Smart Return Verify - Prototype Authentication & Role-Based Dashboards
 * Demonstrates 3 role-tailored workflows: Delivery Agent, Warehouse Staff, and Company Administrator.
 * Clearly separates visual demo from production authentication backend.
 */

const AuthDashboard = {
  currentUser: null, // { name, role, email, company }
  isRegisterMode: false,

  demoAccounts: {
    'delivery_agent': {
      name: "Vikram Sharma",
      role: "Delivery Agent",
      roleKey: "delivery_agent",
      email: "vikram.agent@logistics-express.in",
      company: "SwiftLog Reverse Fleet (Partner)"
    },
    'warehouse_staff': {
      name: "Priya Menon",
      role: "Warehouse Staff",
      roleKey: "warehouse_staff",
      email: "priya.forensics@wh-central.com",
      company: "Apex Central Fulfillment Hub"
    },
    'company_admin': {
      name: "Dr. Ananya Sen",
      role: "Company Administrator",
      roleKey: "company_admin",
      email: "ananya.sen@apexmarketplaces.com",
      company: "Apex Retail Group India"
    }
  },

  // Mock Warehouse items state
  warehouseItems: [
    {
      id: "RET-88412",
      product: "AeroBook Pro 15 (SN-AB15-9942)",
      issue: "Battery Serial Mismatch (Clone generic detected)",
      doorstepVerdict: "NO (Suspicious)",
      status: "Suspicious — Further Inspection",
      statusClass: "text-amber-700 bg-amber-50 border-amber-200"
    },
    {
      id: "RET-88415",
      product: "ZenPhone Ultra 12 (SN-ZP-10023)",
      issue: "All OEM Cryptographic Signatures Match",
      doorstepVerdict: "YES (No issue)",
      status: "Verified",
      statusClass: "text-emerald-700 bg-emerald-50 border-emerald-200"
    },
    {
      id: "RET-88419",
      product: "MaxPro Workstation 17 (SN-MP-4401)",
      issue: "Diagnostic port corroded / Locked controller",
      doorstepVerdict: "NO (Dongle Error)",
      status: "Verification Inconclusive",
      statusClass: "text-slate-700 bg-slate-100 border-slate-200"
    }
  ],

  init() {
    this.bindEvents();
    this.checkInitialHash();
  },

  checkInitialHash() {
    if (window.location.hash === '#login') {
      this.openAuthModal();
    } else if (window.location.hash === '#dashboard') {
      // Auto-load admin or agent demo if navigating straight to dashboard
      if (!this.currentUser) {
        this.loginAsRole('company_admin');
      } else {
        this.showDashboardView();
      }
    }
  },

  bindEvents() {
    // Modal openers
    const loginNavBtns = document.querySelectorAll('[data-open-login]');
    loginNavBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openAuthModal();
      });
    });

    // Close Modal
    const closeModalBtn = document.getElementById('auth-modal-close');
    const authBackdrop = document.getElementById('auth-modal-backdrop');
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => this.closeAuthModal());
    if (authBackdrop) authBackdrop.addEventListener('click', () => this.closeAuthModal());

    // Password Toggle
    const pwdToggle = document.getElementById('auth-pwd-toggle');
    const pwdInput = document.getElementById('auth-password');
    if (pwdToggle && pwdInput) {
      pwdToggle.addEventListener('click', () => {
        const isPassword = pwdInput.type === 'password';
        pwdInput.type = isPassword ? 'text' : 'password';
        pwdToggle.textContent = isPassword ? 'Hide' : 'Show';
      });
    }

    // Toggle Sign In vs Create Account tabs
    const tabSignIn = document.getElementById('tab-sign-in');
    const tabRegister = document.getElementById('tab-register');
    if (tabSignIn && tabRegister) {
      tabSignIn.addEventListener('click', () => this.setMode(false));
      tabRegister.addEventListener('click', () => this.setMode(true));
    }

    // Auth Form Submission
    const authForm = document.getElementById('auth-main-form');
    if (authForm) {
      authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmit();
      });
    }

    // Quick Role Demo Clickers
    document.querySelectorAll('[data-quick-role]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const roleKey = e.currentTarget.getAttribute('data-quick-role');
        this.loginAsRole(roleKey);
      });
    });

    // Logout button
    const logoutBtn = document.getElementById('dashboard-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }

    // Return to Landing Page button
    const backToSiteBtn = document.getElementById('dashboard-back-btn');
    if (backToSiteBtn) {
      backToSiteBtn.addEventListener('click', () => this.exitToLanding());
    }
  },

  openAuthModal() {
    const modal = document.getElementById('auth-modal-container');
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  },

  closeAuthModal() {
    const modal = document.getElementById('auth-modal-container');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  },

  setMode(isRegister) {
    this.isRegisterMode = isRegister;
    const tabSignIn = document.getElementById('tab-sign-in');
    const tabRegister = document.getElementById('tab-register');
    const registerFields = document.getElementById('register-extra-fields');
    const submitBtn = document.getElementById('auth-submit-btn');
    const title = document.getElementById('auth-form-title');

    if (isRegister) {
      tabRegister.classList.add('border-blue-600', 'text-blue-600');
      tabRegister.classList.remove('border-transparent', 'text-slate-500');
      tabSignIn.classList.remove('border-blue-600', 'text-blue-600');
      tabSignIn.classList.add('border-transparent', 'text-slate-500');

      if (registerFields) registerFields.classList.remove('hidden');
      if (submitBtn) submitBtn.textContent = 'Create Demo Account & Enter';
      if (title) title.textContent = 'Register for Prototype Access';
    } else {
      tabSignIn.classList.add('border-blue-600', 'text-blue-600');
      tabSignIn.classList.remove('border-transparent', 'text-slate-500');
      tabRegister.classList.remove('border-blue-600', 'text-blue-600');
      tabRegister.classList.add('border-transparent', 'text-slate-500');

      if (registerFields) registerFields.classList.add('hidden');
      if (submitBtn) submitBtn.textContent = 'Sign In to Dashboard';
      if (title) title.textContent = 'Sign in to Smart Return Verify';
    }
  },

  handleFormSubmit() {
    const email = document.getElementById('auth-email').value;
    const roleSelect = document.getElementById('auth-role-select').value;
    const nameInput = document.getElementById('auth-fullname');
    const companyInput = document.getElementById('auth-company');

    let name = "Demo User";
    let company = "Enterprise Partner";

    if (this.isRegisterMode) {
      name = nameInput && nameInput.value ? nameInput.value : "Registered Tester";
      company = companyInput && companyInput.value ? companyInput.value : "Partner Org";
    } else {
      const preset = this.demoAccounts[roleSelect];
      if (preset) {
        name = preset.name;
        company = preset.company;
      }
    }

    const roleName = roleSelect === 'delivery_agent' ? 'Delivery Agent' :
                     roleSelect === 'warehouse_staff' ? 'Warehouse Staff' : 'Company Administrator';

    this.currentUser = {
      name: name,
      role: roleName,
      roleKey: roleSelect,
      email: email || "demo.user@smartreturnverify.com",
      company: company
    };

    this.closeAuthModal();
    this.showDashboardView();
  },

  loginAsRole(roleKey) {
    const preset = this.demoAccounts[roleKey] || this.demoAccounts.company_admin;
    this.currentUser = { ...preset };
    this.closeAuthModal();
    this.showDashboardView();
  },

  logout() {
    this.currentUser = null;
    this.exitToLanding();
  },

  exitToLanding() {
    const landingContainer = document.getElementById('landing-content');
    const dashboardContainer = document.getElementById('dashboard-app-view');

    if (landingContainer) landingContainer.classList.remove('hidden');
    if (dashboardContainer) dashboardContainer.classList.add('hidden');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  showDashboardView() {
    if (!this.currentUser) return;

    const landingContainer = document.getElementById('landing-content');
    const dashboardContainer = document.getElementById('dashboard-app-view');

    if (landingContainer) landingContainer.classList.add('hidden');
    if (dashboardContainer) dashboardContainer.classList.remove('hidden');
    window.location.hash = '#dashboard';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update global dashboard user header
    const userNameDisplay = document.getElementById('dash-user-name');
    const userRoleDisplay = document.getElementById('dash-user-role');
    const userCompanyDisplay = document.getElementById('dash-user-company');

    if (userNameDisplay) userNameDisplay.textContent = this.currentUser.name;
    if (userRoleDisplay) userRoleDisplay.textContent = this.currentUser.role;
    if (userCompanyDisplay) userCompanyDisplay.textContent = this.currentUser.company;

    // Render Role-Specific Body
    this.renderRoleDashboard(this.currentUser.roleKey);
  },

  renderRoleDashboard(roleKey) {
    const container = document.getElementById('role-dashboard-content');
    if (!container) return;

    if (roleKey === 'delivery_agent') {
      container.innerHTML = this.getDeliveryAgentHTML();
      this.bindDeliveryAgentActions();
    } else if (roleKey === 'warehouse_staff') {
      container.innerHTML = this.getWarehouseStaffHTML();
      this.bindWarehouseStaffActions();
    } else {
      container.innerHTML = this.getCompanyAdminHTML();
      this.bindCompanyAdminActions();
    }
  },

  /* ------------------- ROLE 1: DELIVERY AGENT VIEW ------------------- */
  getDeliveryAgentHTML() {
    return `
      <div class="space-y-6">
        <!-- Agent Overview Bar -->
        <div class="bg-blue-600 rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-blue-500/20">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500 text-xs font-semibold uppercase tracking-wider mb-2">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Field Mobile Terminal
            </div>
            <h2 class="text-2xl font-extrabold">Doorstep Intake Queue</h2>
            <p class="text-blue-100 text-sm mt-1">Vehicle Route: HYD-KONDAPUR-ZONE-3 • Shift Status: Active</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="bg-blue-700/60 px-4 py-2.5 rounded-xl border border-blue-400/30 text-center">
              <div class="text-xl font-bold">4 / 6</div>
              <div class="text-[11px] text-blue-200 uppercase font-semibold">Triaged Today</div>
            </div>
            <div class="bg-blue-700/60 px-4 py-2.5 rounded-xl border border-blue-400/30 text-center">
              <div class="text-xl font-bold text-emerald-300">100%</div>
              <div class="text-[11px] text-blue-200 uppercase font-semibold">HMAC Sync</div>
            </div>
          </div>
        </div>

        <!-- Current Pickup Card -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div>
              <span class="text-xs font-bold text-blue-600 uppercase tracking-wider">Active Pickup Order</span>
              <h3 class="text-lg font-bold text-slate-800">Return #OD-9021-HP • HP Spectre x360 14"</h3>
            </div>
            <span class="badge-pill bg-amber-100 text-amber-800">Doorstep Screening Required</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div class="text-xs text-slate-500">Customer</div>
              <div class="font-semibold text-slate-800 text-sm mt-0.5">Rajesh K. (Kondapur, Hyd)</div>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div class="text-xs text-slate-500">Declared Reason</div>
              <div class="font-semibold text-slate-800 text-sm mt-0.5">"OS slow / Returning in 7-day window"</div>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div class="text-xs text-slate-500">OEM Serial Number</div>
              <div class="font-mono font-semibold text-slate-800 text-sm mt-0.5">SN-HP-991204</div>
            </div>
          </div>

          <!-- Rapid Field Triage Actions -->
          <div class="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <div class="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">Field Screening Actions</div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <button id="agent-capture-photo-btn" class="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-slate-300 font-semibold text-slate-700 hover:bg-slate-100 transition shadow-sm text-sm">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>Capture Base & Screw Photo</span>
              </button>
              <button id="agent-connect-dongle-btn" class="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-slate-300 font-semibold text-slate-700 hover:bg-slate-100 transition shadow-sm text-sm">
                <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                <span>Connect Diagnostic Cable</span>
              </button>
            </div>

            <div id="agent-action-feedback" class="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600 mb-4 font-mono">
              Status: Ready. Connect diagnostic cable or photograph base screws to evaluate.
            </div>

            <div class="border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div class="text-xs text-slate-500">
                Agent Decision Gate (Syncs encrypted HMAC record immediately)
              </div>
              <div class="flex items-center gap-3 w-full sm:w-auto">
                <button id="agent-verdict-yes" class="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition shadow-sm flex items-center justify-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  YES — Pass
                </button>
                <button id="agent-verdict-no" class="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition shadow-sm flex items-center justify-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  NO — Flag Suspect
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  bindDeliveryAgentActions() {
    const feedback = document.getElementById('agent-action-feedback');
    const photoBtn = document.getElementById('agent-capture-photo-btn');
    const dongleBtn = document.getElementById('agent-connect-dongle-btn');
    const yesBtn = document.getElementById('agent-verdict-yes');
    const noBtn = document.getElementById('agent-verdict-no');

    if (photoBtn) {
      photoBtn.addEventListener('click', () => {
        feedback.innerHTML = `<span class="text-blue-600">✓ Optical Check:</span> High-res macro photo recorded. 4 Torx screws intact. No exterior prying markings found.`;
      });
    }
    if (dongleBtn) {
      dongleBtn.addEventListener('click', () => {
        feedback.innerHTML = `<span class="text-emerald-600">✓ Diagnostic Handshake:</span> Battery Serial matches OEM baseline (HP-OEM-9912). Cycle count: 6 cycles.`;
      });
    }
    if (yesBtn) {
      yesBtn.addEventListener('click', () => {
        alert("Verdict Logged: YES — No obvious issue detected.\n\nReturn package sealed with Green Anti-Tamper Barcode #SRV-9021. Record encrypted and transmitted to Warehouse.");
      });
    }
    if (noBtn) {
      noBtn.addEventListener('click', () => {
        alert("Verdict Logged: NO — Suspicious.\n\nReturn package sealed with Red Quarantine Tag #SRV-9021-SUSPECT. Priority forensic inspection requested at Central Hub.");
      });
    }
  },

  /* ------------------- ROLE 2: WAREHOUSE STAFF VIEW ------------------- */
  getWarehouseStaffHTML() {
    return `
      <div class="space-y-6">
        <div class="bg-slate-900 rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
              <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span> Hub Forensics Terminal
            </div>
            <h2 class="text-2xl font-extrabold">Deep Warehouse Verification</h2>
            <p class="text-slate-400 text-sm mt-1">Facility: WH-BLR-CENTRAL-01 • Inbound Bay 4</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="badge-pill bg-blue-900/60 text-blue-200 border border-blue-500/30">
              HMAC Validator: ONLINE
            </span>
            <span class="badge-pill bg-emerald-900/60 text-emerald-200 border border-emerald-500/30">
              OEM Key Vault: SYNCED
            </span>
          </div>
        </div>

        <!-- Inbound Verification Table -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 class="text-lg font-bold text-slate-800">Inbound Forensic Queue</h3>
              <p class="text-xs text-slate-500">Cross-reference physical diagnostic readings against manufacturer baseline records.</p>
            </div>
            <span class="text-xs font-mono px-3 py-1 bg-slate-100 rounded-full font-semibold text-slate-600">
              3 Pending Review
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th class="p-4">Return ID</th>
                  <th class="p-4">Product & Serial</th>
                  <th class="p-4">Doorstep Verdict</th>
                  <th class="p-4">Hardware Telemetry Analysis</th>
                  <th class="p-4">Current Status</th>
                  <th class="p-4 text-right">Forensic Decision</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-sans" id="warehouse-table-body">
                ${this.warehouseItems.map(item => `
                  <tr class="hover:bg-slate-50/60 transition">
                    <td class="p-4 font-mono font-bold text-xs text-blue-600">${item.id}</td>
                    <td class="p-4 font-medium text-slate-800 text-xs">${item.product}</td>
                    <td class="p-4 text-xs">
                      <span class="badge-pill ${item.doorstepVerdict.includes('YES') ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}">
                        ${item.doorstepVerdict}
                      </span>
                    </td>
                    <td class="p-4 text-xs text-slate-600 max-w-xs">${item.issue}</td>
                    <td class="p-4 text-xs">
                      <span class="badge-pill border ${item.statusClass}">${item.status}</span>
                    </td>
                    <td class="p-4 text-right">
                      <div class="inline-flex gap-1">
                        <button onclick="AuthDashboard.updateWarehouseDecision('${item.id}', 'Verified')" class="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 border border-slate-200 text-xs font-semibold title='Pass'">
                          ✓ Pass
                        </button>
                        <button onclick="AuthDashboard.updateWarehouseDecision('${item.id}', 'Suspicious — Further Inspection')" class="p-1.5 rounded-lg hover:bg-red-50 text-red-600 border border-slate-200 text-xs font-semibold title='Flag'">
                          ✕ Flag
                        </button>
                        <button onclick="AuthDashboard.updateWarehouseDecision('${item.id}', 'Verification Inconclusive')" class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold title='Lab Review'">
                          ? Lab
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Sample Forensic Comparison Panel -->
        <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-bold text-slate-800 text-sm">Detailed Discrepancy Breakdown for RET-88412</h4>
            <span class="badge-pill bg-red-100 text-red-800 font-mono">BATTERY MISMATCH</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div class="p-4 rounded-xl bg-white border border-slate-200">
              <div class="text-[11px] font-bold text-blue-600 uppercase mb-2">Original Manufacturer Record</div>
              <div class="space-y-1 text-slate-700">
                <div>Model: AeroBook Pro 15</div>
                <div>Battery OEM S/N: <strong class="text-slate-900">BAT-OEM-882194-A</strong></div>
                <div>Design Capacity: 92.4 Wh</div>
                <div>Factory Firmware Hash: 0x8F94AB11</div>
                <div>Tamper Seal Status: Factory Certified</div>
              </div>
            </div>
            <div class="p-4 rounded-xl bg-white border border-red-200 bg-red-50/20">
              <div class="text-[11px] font-bold text-red-600 uppercase mb-2">Warehouse Physical & Diagnostic Scan</div>
              <div class="space-y-1 text-slate-700">
                <div>Detected Model: AeroBook Pro 15 Chassis</div>
                <div>Battery Actual S/N: <strong class="text-red-600">BAT-GENERIC-990-CLONE (MISMATCH)</strong></div>
                <div>Measured Capacity: 48.2 Wh (Degraded Cell)</div>
                <div>Firmware Response: 0x00000000 (Generic Microcontroller)</div>
                <div>Physical Screws: Torx drive stripped; thermal tape peeled</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  bindWarehouseStaffActions() {
    // Actions are called via onclick on items
  },

  updateWarehouseDecision(itemId, newStatus) {
    const item = this.warehouseItems.find(i => i.id === itemId);
    if (!item) return;

    item.status = newStatus;
    if (newStatus === 'Verified') {
      item.statusClass = "text-emerald-700 bg-emerald-50 border-emerald-200";
    } else if (newStatus.includes('Suspicious')) {
      item.statusClass = "text-red-700 bg-red-50 border-red-200";
    } else {
      item.statusClass = "text-slate-700 bg-slate-100 border-slate-200";
    }

    this.renderRoleDashboard('warehouse_staff');
  },

  /* ------------------- ROLE 3: COMPANY ADMINISTRATOR VIEW ------------------- */
  getCompanyAdminHTML() {
    return `
      <div class="space-y-6">
        <!-- Executive Header -->
        <div class="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 text-xs font-semibold uppercase tracking-wider text-blue-200 mb-2">
                Executive Governance Console
              </div>
              <h2 class="text-2xl font-extrabold">Return Integrity & Fraud Intelligence</h2>
              <p class="text-blue-200 text-sm mt-1">Enterprise Telemetry • Last 30 Days Overview</p>
            </div>
            <div class="flex items-center gap-3">
              <button id="admin-export-report-btn" class="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs flex items-center gap-2 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Export Audit CSV
              </button>
            </div>
          </div>
        </div>

        <!-- KPI Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div class="text-xs font-bold uppercase text-slate-500 tracking-wider">Total Returns Screened</div>
            <div class="text-2xl font-extrabold text-slate-900 mt-2">142,500</div>
            <div class="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <span>↑ 18.2%</span> <span class="text-slate-400 font-normal">vs previous month</span>
            </div>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div class="text-xs font-bold uppercase text-slate-500 tracking-wider">Early Doorstep Triage</div>
            <div class="text-2xl font-extrabold text-blue-600 mt-2">91.4%</div>
            <div class="text-xs text-slate-500 mt-1">Doorstep screening completion</div>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div class="text-xs font-bold uppercase text-slate-500 tracking-wider">Flagged Suspicious</div>
            <div class="text-2xl font-extrabold text-amber-600 mt-2">4,845 <span class="text-sm font-normal text-slate-500">(3.4%)</span></div>
            <div class="text-xs text-slate-500 mt-1">Mismatched serials & tamper alerts</div>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div class="text-xs font-bold uppercase text-slate-500 tracking-wider">Prevented Replacement Loss</div>
            <div class="text-2xl font-extrabold text-emerald-600 mt-2">₹1.42 Cr</div>
            <div class="text-xs text-slate-400 mt-1">Illustrative saved hardware replacement value</div>
          </div>
        </div>

        <!-- Breakdown & Analytics -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-slate-800 text-sm">Suspicious Component Breakdown</h3>
              <span class="text-xs text-slate-500">Based on verified warehouse forensic audits</span>
            </div>
            
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span class="text-slate-700">Counterfeit / Swapped OEM Batteries</span>
                  <span class="text-blue-600">58% (2,810 units)</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div class="bg-blue-600 h-2.5 rounded-full" style="width: 58%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span class="text-slate-700">Swapped NVMe SSDs & RAM Modules</span>
                  <span class="text-indigo-600">24% (1,162 units)</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div class="bg-indigo-600 h-2.5 rounded-full" style="width: 24%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span class="text-slate-700">Replaced Motherboard / Display Panels</span>
                  <span class="text-amber-500">18% (873 units)</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div class="bg-amber-500 h-2.5 rounded-full" style="width: 18%"></div>
                </div>
              </div>
            </div>

            <div class="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>Average Turnaround Verification: <strong>42 seconds</strong> per unit</span>
              <span class="text-blue-600 font-semibold cursor-pointer">View Deep Forensic Logs →</span>
            </div>
          </div>

          <!-- Live Audit Stream -->
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 class="font-bold text-slate-800 text-sm mb-4">Live Cryptographic Audit Feed</h3>
            <div class="space-y-3 font-mono text-[11px]">
              <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div class="flex justify-between text-slate-400 text-[10px]">
                  <span>RET-88412</span>
                  <span>14:22:18</span>
                </div>
                <div class="text-red-600 font-bold mt-0.5">FLAGGED: Battery Hash Mismatch</div>
                <div class="text-slate-500 truncate">Agent: HYD-041 • WH: BLR-01</div>
              </div>
              <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div class="flex justify-between text-slate-400 text-[10px]">
                  <span>RET-88415</span>
                  <span>14:20:05</span>
                </div>
                <div class="text-emerald-600 font-bold mt-0.5">VERIFIED: All Signatures Match</div>
                <div class="text-slate-500 truncate">Agent: DEL-019 • WH: DEL-02</div>
              </div>
              <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div class="flex justify-between text-slate-400 text-[10px]">
                  <span>RET-88419</span>
                  <span>14:18:40</span>
                </div>
                <div class="text-amber-600 font-bold mt-0.5">INCONCLUSIVE: Dongle Read Error</div>
                <div class="text-slate-500 truncate">Agent: MUM-082 • WH: PNQ-01</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  bindCompanyAdminActions() {
    const exportBtn = document.getElementById('admin-export-report-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        alert("Prototype Demo: Audit Report exported successfully (smart_return_audit_2024.csv downloaded).");
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AuthDashboard.init();
});
