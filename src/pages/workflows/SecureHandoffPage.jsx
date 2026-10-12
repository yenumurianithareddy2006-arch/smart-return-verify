import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Lock, 
  ArrowLeft, 
  Key, 
  ShieldCheck, 
  FileLock2, 
  Unlock, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  RefreshCw, 
  Play, 
  ArrowRight,
  Info,
  Sliders,
  Copy,
  Check
} from 'lucide-react';
import { SECURITY_SIMULATION_RECORD } from '../../data/mockData';

export const SecureHandoffPage = () => {
  const [activeStep, setActiveStep] = useState(1); // 1: Plaintext, 2: Encrypted, 3: In Transit / HMAC, 4: Decrypted
  const [isAnimating, setIsAnimating] = useState(false);
  const [isTampered, setIsTampered] = useState(false);
  const [copied, setCopied] = useState(false);

  // Formatted plaintext representation
  const plainTextJson = JSON.stringify(SECURITY_SIMULATION_RECORD, null, 2);

  // Fictional simulated ciphertext (clearly declared as cryptographic simulation)
  const mockCiphertext = "U2FsdGVkX19GZ4k9Wl2A1vR0O90uCgU...4f18d7bc89ae2154d8a1e204b78c9d01f2e54a32b69...AES256GCM_IV_9918247018374";
  const mockHmacNormal = "hmac-sha256:7b919d3f1a20c4e5e783...VALID_INTEGRITY";
  const mockHmacTampered = "hmac-sha256:00000000000000000000...FAILED_MISMATCH";

  const handleDemonstrateEncryption = () => {
    setIsAnimating(true);
    setActiveStep(1);

    // Sequence through stages
    setTimeout(() => {
      setActiveStep(2); // Encryption
    }, 900);

    setTimeout(() => {
      setActiveStep(3); // Transit & HMAC
    }, 1800);

    setTimeout(() => {
      setActiveStep(4); // Decryption
      setIsAnimating(false);
    }, 2800);
  };

  const handleCopyCipher = () => {
    navigator.clipboard.writeText(mockCiphertext);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-brand-surface py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/#how-it-works"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Workflow Overview</span>
          </Link>

          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Workflow Pillar 03
          </span>
        </div>

        {/* Page Header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
                  Secure Digital Handoff (AES & HMAC)
                </h1>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
                  Cryptographic Simulation
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                "Return information is encrypted before transfer."
              </p>
            </div>
          </div>

          {/* Plain English Cryptographic Explanation (Mandatory Requirement) */}
          <div className="mt-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-navy-950 flex items-center gap-2">
              <Info className="w-4 h-4 text-purple-600" />
              <span>Cryptographic Architecture in Simple English</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100">
                <strong className="text-navy-950 block mb-1">1. Encryption protects Confidentiality:</strong>
                Encryption scrambles the return record into unreadable ciphertext so unauthorized intermediaries cannot eavesdrop on customer serials, agent location, or inspection evidence during internet transmission.
              </div>
              <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100">
                <strong className="text-navy-950 block mb-1">2. HMAC protects Digital Integrity:</strong>
                Hash-based Message Authentication Codes (HMAC) verify whether a digital record was altered or forged in transit.
                <br />
                <span className="text-slate-800 font-semibold">Important:</span> Encryption alone does not prove that the physical laptop is authentic — that requires warehouse inspection.
              </div>
            </div>
          </div>
        </div>

        {/* Animated Flow Track (Mandatory Requirement) */}
        {/* Flow: Return Information → Encryption → Secure Transfer → Warehouse Decryption */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-soft mb-10">
          <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Cryptographic Pipeline
              </span>
              <h2 className="text-lg font-bold text-navy-950">
                Return Information → Encryption → Secure Transfer → Warehouse Decryption
              </h2>
            </div>

            {/* Buttons: Demonstrate Encryption & View Transfer Flow */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleDemonstrateEncryption}
                disabled={isAnimating}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-all shadow-md shadow-purple-600/20 disabled:opacity-60"
              >
                {isAnimating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Simulation...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Demonstrate Encryption</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Visual 4-Step Interactive Nodes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
            {[
              { step: 1, name: "Return Information", subtitle: "Doorstep Plaintext", icon: FileLock2, color: "text-blue-600", bg: "bg-blue-50" },
              { step: 2, name: "AES-256 Encryption", subtitle: "Ciphertext Generation", icon: Lock, color: "text-purple-600", bg: "bg-purple-50" },
              { step: 3, name: "Secure Transfer", subtitle: "HMAC Tagged Transit", icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
              { step: 4, name: "Warehouse Decryption", subtitle: "Private Key Recovery", icon: Unlock, color: "text-emerald-600", bg: "bg-emerald-50" },
            ].map((node) => {
              const Icon = node.icon;
              const isActive = activeStep === node.step;
              const isPassed = activeStep > node.step;

              return (
                <button
                  key={node.step}
                  onClick={() => setActiveStep(node.step)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isActive
                      ? 'bg-navy-900 border-navy-900 text-white shadow-soft scale-[1.02]'
                      : isPassed
                      ? 'bg-slate-50 border-purple-200 text-slate-800'
                      : 'bg-white border-slate-200 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-lg ${isActive ? 'bg-purple-600 text-white' : `${node.bg} ${node.color}`} flex items-center justify-center`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isActive ? 'bg-navy-800 text-purple-300' : 'bg-slate-100 text-slate-500'}`}>
                      Stage {node.step}
                    </span>
                  </div>
                  <div className="text-xs font-bold">{node.name}</div>
                  <div className={`text-[11px] ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>{node.subtitle}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Payload Inspector Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          
          {/* Main Inspector Console (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-soft">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Live Payload Inspector
                </span>
                <h3 className="text-base font-bold text-navy-950">
                  {activeStep === 1 && "Stage 1: Raw Plaintext Return Record"}
                  {activeStep === 2 && "Stage 2: AES-256 Symmetric Encryption Output"}
                  {activeStep === 3 && "Stage 3: Signed Transit Payload & HMAC Validation"}
                  {activeStep === 4 && "Stage 4: Decrypted Authenticated Record at Warehouse"}
                </h3>
              </div>

              {activeStep === 2 && (
                <button
                  onClick={handleCopyCipher}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy Cipher"}</span>
                </button>
              )}
            </div>

            {/* Stage Content */}
            {activeStep === 1 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600">
                  Captured at customer doorstep by delivery agent Vikram Sharma. Contains return ID, device serial, optical score, and preliminary battery telemetry.
                </p>
                <div className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto">
                  <pre>{plainTextJson}</pre>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-4">
                <div className="p-3 bg-purple-50 text-purple-900 rounded-xl text-xs border border-purple-200">
                  <span className="font-bold">AES-256 Encryption Applied:</span> The plaintext payload is encrypted using AES-256 with an ephemeral initialization vector (IV).
                </div>
                <div className="p-4 rounded-xl bg-slate-900 text-purple-300 font-mono text-xs break-all leading-relaxed">
                  {mockCiphertext}
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-xs font-bold text-navy-950 block">In-Transit Tampering Simulation</span>
                    <span className="text-[11px] text-slate-500">Toggle tampering to test if modified payload is detected</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isTampered}
                      onChange={(e) => setIsTampered(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>

                <div className={`p-4 rounded-xl border text-xs font-mono ${
                  isTampered 
                    ? 'bg-rose-50 border-rose-300 text-rose-900' 
                    : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                }`}>
                  <div className="font-bold mb-1">
                    {isTampered ? "⚠️ HMAC Verification: INTEGRITY FAILED" : "✓ HMAC Verification: INTEGRITY PASSED"}
                  </div>
                  <div className="text-[11px] break-all">
                    {isTampered ? mockHmacTampered : mockHmacNormal}
                  </div>
                  <p className="mt-2 text-[11px] font-sans">
                    {isTampered 
                      ? "A single byte was modified in transit. The calculated HMAC does not match the sender tag. Transmission rejected!" 
                      : "Cryptographic hash matches. The record arrived completely unaltered."}
                  </p>
                </div>
              </div>
            )}

            {activeStep === 4 && (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl text-xs border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Successfully decrypted at Warehouse Node WH-BLR-CENTRAL-01 using enterprise private key. Ready for physical inspection.
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto">
                  <pre>{plainTextJson}</pre>
                </div>
              </div>
            )}
          </div>

          {/* Record Summary Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft">
              <h2 className="text-xs font-bold text-navy-950 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                Simulated Record Metadata
              </h2>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Return ID</span>
                  <span className="font-mono font-bold text-navy-950">{SECURITY_SIMULATION_RECORD.returnId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Product ID</span>
                  <span className="font-mono font-bold text-navy-950">{SECURITY_SIMULATION_RECORD.productId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Delivery Agent ID</span>
                  <span className="font-medium text-slate-800">{SECURITY_SIMULATION_RECORD.agentId} ({SECURITY_SIMULATION_RECORD.agentName})</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Timestamp</span>
                  <span className="font-mono text-slate-700">{SECURITY_SIMULATION_RECORD.timestamp}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Screening Result</span>
                  <span className="font-semibold text-rose-600">{SECURITY_SIMULATION_RECORD.screeningResult}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Evidence Image Reference</span>
                  <span className="font-mono text-[10px] text-blue-600 truncate block">{SECURITY_SIMULATION_RECORD.evidenceImageRef}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-100/70 text-slate-500 text-[11px] leading-relaxed">
              <strong>Disclosure:</strong> Encryption animation and payload displays are deterministic software models intended to illustrate the security protocol. No proprietary company keys are transmitted over the web.
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-soft flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/#how-it-works"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Workflow</span>
          </Link>

          <Link
            to="/workflow/warehouse-verification"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <span>Next: Step 4 — Warehouse Verification →</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
