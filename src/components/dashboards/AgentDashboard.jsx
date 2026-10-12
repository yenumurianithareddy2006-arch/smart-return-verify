import React, { useState } from 'react';
import { 
  Smartphone, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  PlusCircle, 
  Send, 
  History, 
  RefreshCw,
  Search,
  Eye,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { DOORSTEP_SCENARIOS } from '../../data/mockData';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';

export const AgentDashboard = () => {
  const { returns, addReturnRecord, currentUser } = useAuth();
  
  // Quick return check state
  const [returnId, setReturnId] = useState(`RET-${Date.now().toString().slice(-5)}`);
  const [productId, setProductId] = useState('SRV-LAP-1001');
  const [scenarioMode, setScenarioMode] = useState('genuine');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleStartCheck = (e) => {
    e.preventDefault();
    setIsScanning(true);
    setScanResult(null);
    setSubmittedMessage(false);

    setTimeout(() => {
      setIsScanning(false);
      setScanResult(DOORSTEP_SCENARIOS[scenarioMode]);
    }, 1000);
  };

  const handleRegisterReturn = () => {
    if (!scanResult) return;

    addReturnRecord({
      id: returnId,
      productRef: productId,
      productName: `AeroBook Pro 15 (${productId})`,
      doorstepResult: scanResult.verdict === 'YES' ? 'YES — No Issue' : 'NO — Suspicious',
      doorstepAgent: `${currentUser?.name || "Vikram Sharma"} (${currentUser?.email?.split('@')[0] || "AGENT"})`,
      transferSecurity: "AES-256 Encrypted • HMAC Valid",
      arrivalDate: "Just Now",
      status: scanResult.verdict === 'YES' ? 'Verified' : 'Suspicious — Further Inspection',
      statusType: scanResult.verdict === 'YES' ? 'verified' : 'suspicious',
      batteryExpected: "BAT-OEM-882194-A",
      batteryFound: scanResult.batteryTelemetry.reportedSerial,
      weightDelta: scanResult.verdict === 'YES' ? "0g delta" : "-42g discrepancy",
      technicianAssigned: "Priya Menon",
      notes: scanResult.notes
    });

    setSubmittedMessage(true);
    // Generate new return ID for next unit
    setTimeout(() => {
      setReturnId(`RET-${(Date.now() + 1).toString().slice(-5)}`);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      
      {/* Agent Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Field Delivery Agent Interface
          </span>
          <h2 className="text-xl font-bold text-navy-950">
            Welcome back, {currentUser?.name || "Vikram Sharma"}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fleet: SwiftLog Bangalore Hub • Active Route: Indiranagar - Koramangala
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Scanner Online
          </span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Start a New Return Check Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-soft">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-indigo-600" />
              <span>Start a New Return Check</span>
            </h3>
            
            {/* Quick Scenario Picker */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => { setScenarioMode('genuine'); setScanResult(null); }}
                className={`px-2.5 py-1 rounded font-medium ${scenarioMode === 'genuine' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'}`}
              >
                Simulate Genuine
              </button>
              <button
                type="button"
                onClick={() => { setScenarioMode('tampered'); setScanResult(null); }}
                className={`px-2.5 py-1 rounded font-medium ${scenarioMode === 'tampered' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-600'}`}
              >
                Simulate Swapped
              </button>
            </div>
          </div>

          <form onSubmit={handleStartCheck} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Return ID / Waybill
                </label>
                <input
                  type="text"
                  value={returnId}
                  onChange={(e) => setReturnId(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Serial / Model
                </label>
                <input
                  type="text"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Photo Upload Area */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Upload Product Screws Photo
              </label>
              <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50/50 hover:bg-slate-50 cursor-pointer">
                <Camera className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <span className="text-xs text-slate-600 font-semibold block">
                  Tap to capture bottom casing Torx screws
                </span>
                <span className="text-[10px] text-slate-400">
                  AI scans macro optical reflection for tool driver slippage
                </span>
              </div>
            </div>

            {/* Submit Check Button */}
            <button
              type="submit"
              disabled={isScanning}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Screening Device Telemetry...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Analyze Return (Instant Screening)</span>
                </>
              )}
            </button>
          </form>

          {/* YES/NO Screening Result Display */}
          {scanResult && (
            <div className="mt-6 pt-6 border-t border-slate-200 animate-in fade-in">
              <div className={`p-4 rounded-xl border-2 ${
                scanResult.verdict === 'YES' 
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950' 
                  : 'bg-rose-50 border-rose-400 text-rose-950'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {scanResult.verdict === 'YES' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                  )}
                  <h4 className="font-extrabold text-sm sm:text-base">
                    {scanResult.verdict === 'YES' ? "YES — NO OBVIOUS ISSUE DETECTED" : "NO — SUSPICIOUS. SEND TO WAREHOUSE."}
                  </h4>
                </div>

                <p className="text-xs leading-relaxed mb-3">
                  {scanResult.notes}
                </p>

                <button
                  type="button"
                  onClick={handleRegisterReturn}
                  className="w-full py-2.5 px-4 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Register Return & Transmit to Warehouse</span>
                </button>
              </div>

              {submittedMessage && (
                <div className="mt-3 p-3 bg-emerald-100 text-emerald-900 text-xs rounded-lg border border-emerald-300">
                  ✓ Successfully registered into the system. Return record is now in the warehouse verification queue.
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Column: Recent Return Records (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-soft">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-bold text-navy-950 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500" />
              <span>Recent Return Records ({returns.length})</span>
            </h3>
            <span className="text-[11px] text-slate-400">Real-time sync</span>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {returns.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 hover:bg-slate-100/70 transition-colors text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-navy-950">{item.id}</span>
                  <Badge status={item.statusType} size="sm">{item.status}</Badge>
                </div>

                <div className="text-slate-600 font-medium truncate">
                  {item.productName || item.productRef}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                  <span className={item.doorstepResult.includes('YES') ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>
                    Triage: {item.doorstepResult}
                  </span>
                  <span>{item.arrivalDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
