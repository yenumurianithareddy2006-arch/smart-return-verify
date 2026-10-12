import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Smartphone, 
  ArrowLeft, 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  RefreshCw, 
  ShieldAlert, 
  ShieldCheck, 
  HelpCircle,
  Eye,
  Cpu,
  Layers,
  Send,
  Zap,
  ArrowRight
} from 'lucide-react';
import { DOORSTEP_SCENARIOS } from '../../data/mockData';
import { Badge } from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';

export const DoorstepScreeningPage = () => {
  const { addReturnRecord } = useAuth();
  
  // Active demo scenario: 'genuine' or 'tampered'
  const [selectedScenarioKey, setSelectedScenarioKey] = useState('genuine');
  const scenario = DOORSTEP_SCENARIOS[selectedScenarioKey];

  // Agent Form inputs
  const [returnId, setReturnId] = useState(scenario.returnId);
  const [productId, setProductId] = useState(scenario.productId);
  const [diagnosticNote, setDiagnosticNote] = useState("USB-C Diagnostic dongle attached (Port #1)");
  const [customImageName, setCustomImageName] = useState(null);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [returnRegistered, setReturnRegistered] = useState(false);

  const handleScenarioChange = (key) => {
    setSelectedScenarioKey(key);
    const sc = DOORSTEP_SCENARIOS[key];
    setReturnId(sc.returnId);
    setProductId(sc.productId);
    setAnalysisResult(null);
    setReturnRegistered(false);
    setCustomImageName(null);
  };

  const handleAnalyzeReturn = (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulate realistic AI inspection latency (1.2 seconds)
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult(scenario);
    }, 1200);
  };

  const handleRegisterAndSend = () => {
    if (!analysisResult) return;
    
    // Push into app-wide state so warehouse sees it!
    addReturnRecord({
      id: returnId || `RET-${Date.now().toString().slice(-5)}`,
      productRef: productId,
      productName: `AeroBook Pro 15 (${productId})`,
      doorstepResult: analysisResult.verdict === 'YES' ? 'YES — No Issue' : 'NO — Suspicious',
      doorstepAgent: "Vikram Sharma (AGENT-HYD-041)",
      transferSecurity: "AES-256 Encrypted • HMAC Valid",
      arrivalDate: "Just Now (In-Transit)",
      status: analysisResult.verdict === 'YES' ? 'Verified' : 'Suspicious — Further Inspection',
      statusType: analysisResult.verdict === 'YES' ? 'verified' : 'suspicious',
      batteryExpected: "BAT-OEM-882194-A",
      batteryFound: analysisResult.batteryTelemetry.reportedSerial,
      weightDelta: analysisResult.verdict === 'YES' ? "0 grams delta" : "-42 grams discrepancy",
      technicianAssigned: "Priya Menon",
      notes: analysisResult.notes
    });

    setReturnRegistered(true);
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCustomImageName(e.target.files[0].name);
    }
  };

  return (
    <div className="min-h-screen bg-brand-surface py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/#how-it-works"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Workflow Overview</span>
          </Link>

          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            Workflow Pillar 02
          </span>
        </div>

        {/* Page Title & Tagline */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
                  Doorstep AI Screening
                </h1>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
                  Simulated AI Demo
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                "The delivery agent performs a simple first-level check."
              </p>
            </div>
          </div>

          {/* Important Technical Accuracy Disclosure (Mandatory Requirement) */}
          <div className="mt-4 p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-navy-900 text-xs flex items-start gap-3">
            <Info className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-navy-950">
                Technical Accuracy & Scientific Honesty Notice:
              </p>
              <p className="leading-relaxed text-slate-700">
                A photograph alone cannot reliably reveal hidden internal battery details or prove that an internal chip has been swapped. Smart Return Verify presents AI as a <strong>preliminary screening system</strong> that pairs optical chassis fastener inspection (detecting stripped Torx screw heads) with non-invasive USB-C diagnostic telemetry handshakes.
                <br />
                <strong>The delivery agent never opens or dismantles the laptop.</strong> Suspicious cases are routed to the central forensics warehouse for deeper verification.
              </p>
            </div>
          </div>
        </div>

        {/* 5-Step Delivery Agent Protocol Visual Guide */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft mb-10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Standard Operating Procedure for Delivery Personnel</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { num: "1", title: "Receive Product", desc: "Collect the returned laptop from the customer with original charger." },
              { num: "2", title: "Open Agent App", desc: "Launch the Smart Return Verify mobile client on delivery handset." },
              { num: "3", title: "Capture & Plug In", desc: "Snap photo of chassis base screws & plug in USB-C diagnostic dongle." },
              { num: "4", title: "Review AI Result", desc: "Review the instant binary YES/NO triage recommendation." },
              { num: "5", title: "Route Appropriately", desc: "Pack suspicious items in tamper-evident pouch for warehouse." }
            ].map((step, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold mb-2">
                  {step.num}
                </div>
                <h3 className="text-xs font-bold text-navy-950 mb-1">{step.title}</h3>
                <p className="text-[11px] text-slate-600 leading-normal">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-rose-600 font-semibold flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            <span>Strict Rule: Delivery personnel are NEVER permitted to unscrew, open, or dismantle customer devices.</span>
          </div>
        </div>

        {/* Main Screening Interface: Scenario Switcher + Agent Mobile Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          
          {/* Left Panel: Scenario Selector & Test Conditions (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft">
              <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider mb-3">
                Select Simulation Scenario
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Choose a deterministic test case to evaluate how the doorstep AI handles authentic vs. tampered hardware.
              </p>

              <div className="space-y-3">
                {/* Scenario A: Genuine */}
                <button
                  type="button"
                  onClick={() => handleScenarioChange('genuine')}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    selectedScenarioKey === 'genuine'
                      ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-800">
                      Scenario A: Genuine Return
                    </span>
                    <Badge status="verified" size="sm">YES Expected</Badge>
                  </div>
                  <p className="text-xs text-slate-600">
                    OEM battery intact, zero chassis burring, valid factory cryptographic handshake.
                  </p>
                </button>

                {/* Scenario B: Tampered */}
                <button
                  type="button"
                  onClick={() => handleScenarioChange('tampered')}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    selectedScenarioKey === 'tampered'
                      ? 'bg-rose-50/70 border-rose-400 ring-2 ring-rose-500/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-rose-800">
                      Scenario B: Swapped Battery
                    </span>
                    <Badge status="suspicious" size="sm">NO Expected</Badge>
                  </div>
                  <p className="text-xs text-slate-600">
                    Counterfeit 3rd-party battery installed, stripped screw heads, 462 battery cycles.
                  </p>
                </button>
              </div>

              {/* Scenario Inspection Breakdown */}
              <div className="mt-6 pt-5 border-t border-slate-100 space-y-3 text-xs">
                <span className="font-bold text-navy-950 uppercase tracking-wider block">
                  Scenario Telemetry Parameters:
                </span>
                <div className="bg-slate-50 p-3 rounded-lg space-y-1.5 font-mono text-[11px] text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Optical Burring Score:</span>
                    <span className={scenario.opticalScore > 0.5 ? "text-rose-600 font-bold" : "text-emerald-600 font-bold"}>
                      {scenario.opticalScore} / 1.0
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reported Battery Serial:</span>
                    <span className={scenario.batteryTelemetry.match ? "text-emerald-700" : "text-rose-700 font-bold"}>
                      {scenario.batteryTelemetry.reportedSerial}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cycle Count:</span>
                    <span>{scenario.batteryTelemetry.cycleCount} cycles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Delivery Agent Mobile Interface (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border-2 border-indigo-200/80 p-6 sm:p-8 shadow-soft-lg">
              
              {/* Agent App Top Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                    Smart Return Mobile • Agent Mode
                  </span>
                  <div className="text-base font-bold text-navy-950">
                    Doorstep Intake & Triage
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">Agent: Vikram S.</span>
                  <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 justify-end">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Online • Hub BLR-01
                  </div>
                </div>
              </div>

              {/* Agent Form */}
              <form onSubmit={handleAnalyzeReturn} className="space-y-4">
                
                {/* Return ID & Product ID Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Return ID *
                    </label>
                    <input
                      type="text"
                      value={returnId}
                      onChange={(e) => setReturnId(e.target.value)}
                      required
                      placeholder="e.g. RET-2024-88412"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Product ID / Serial *
                    </label>
                    <input
                      type="text"
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                      required
                      placeholder="e.g. SRV-LAP-1001"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
                    />
                  </div>
                </div>

                {/* Photo Upload Dropzone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Chassis Base Screws Photo *
                  </label>
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl cursor-pointer bg-slate-50/70 hover:bg-indigo-50/30 transition-all">
                    <Camera className="w-6 h-6 text-slate-400 mb-1.5" />
                    <span className="text-xs font-semibold text-slate-700">
                      {customImageName ? customImageName : "Tap to capture chassis screws photo or choose file"}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      High-resolution macro shot of bottom casing Torx fasteners
                    </span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload} 
                    />
                  </label>
                </div>

                {/* Optional Diagnostic Information */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Diagnostic Telemetry Interface (Optional Handshake)
                  </label>
                  <input
                    type="text"
                    value={diagnosticNote}
                    onChange={(e) => setDiagnosticNote(e.target.value)}
                    placeholder="e.g. USB-C Dongle connected, battery state read"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-700 focus:border-indigo-600 outline-none"
                  />
                </div>

                {/* Primary Action Button */}
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Screening Hardware & Optical Screws...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-white" />
                      <span>Analyze Return (Run AI Screening)</span>
                    </>
                  )}
                </button>
              </form>

              {/* Sample Result Card Display (Mandatory Requirement) */}
              {analysisResult && (
                <div className="mt-6 pt-6 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-2">
                  
                  {analysisResult.verdict === 'YES' ? (
                    /* RESULT A: YES — NO OBVIOUS ISSUE DETECTED */
                    <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
                            Screening Verdict
                          </span>
                          <h3 className="text-base sm:text-lg font-extrabold text-emerald-900">
                            YES — NO OBVIOUS ISSUE DETECTED
                          </h3>
                        </div>
                      </div>

                      <p className="text-xs text-emerald-800 leading-relaxed">
                        {analysisResult.notes}
                      </p>

                      <div className="p-3 bg-white/80 rounded-xl border border-emerald-200 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Chassis Screws:</span>
                          <span className="font-semibold text-emerald-700">Pristine OEM Torx Fasteners</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Battery Diagnostic Serial:</span>
                          <span className="font-mono text-emerald-700">{analysisResult.batteryTelemetry.reportedSerial} (Match)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Action:</span>
                          <span className="font-semibold text-emerald-800">{analysisResult.recommendation}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* RESULT B: NO — SUSPICIOUS. SEND TO WAREHOUSE. */
                    <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-400 text-rose-950 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 block">
                            Screening Verdict
                          </span>
                          <h3 className="text-base sm:text-lg font-extrabold text-rose-900">
                            NO — SUSPICIOUS. SEND TO WAREHOUSE.
                          </h3>
                        </div>
                      </div>

                      <p className="text-xs text-rose-800 leading-relaxed">
                        {analysisResult.notes}
                      </p>

                      <div className="p-3 bg-white/80 rounded-xl border border-rose-200 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Chassis Screws:</span>
                          <span className="font-semibold text-rose-700">Micro-burring & Driver Slipping Detected</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Reported Serial:</span>
                          <span className="font-mono text-rose-700 font-bold">{analysisResult.batteryTelemetry.reportedSerial} (MISMATCH)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Degraded Health:</span>
                          <span className="text-rose-700 font-bold">{analysisResult.batteryTelemetry.currentCapacity}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Register and Route Action Button */}
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleRegisterAndSend}
                      disabled={returnRegistered}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-navy-900 text-white font-bold text-xs hover:bg-navy-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{returnRegistered ? "Return Registered in System!" : "Submit & Encrypt for Warehouse"}</span>
                    </button>

                    <Link
                      to="/workflow/secure-handoff"
                      className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                    >
                      <span>Next: Step 3 — Secure Handoff</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {returnRegistered && (
                    <div className="mt-3 p-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>This return has been logged into the live system. You can view it now in the Warehouse Verification Queue!</span>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
