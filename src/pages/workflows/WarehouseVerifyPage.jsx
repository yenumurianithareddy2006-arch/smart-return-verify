import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Warehouse, 
  ArrowLeft, 
  FileSearch, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Scale,
  BatteryMedium,
  Cpu,
  Info,
  XCircle,
  Eye,
  FileText
} from 'lucide-react';
import { COMPARISON_SAMPLE } from '../../data/mockData';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';

export const WarehouseVerifyPage = () => {
  const { returns, updateReturnStatus } = useAuth();
  const [selectedCase, setSelectedCase] = useState(returns[0]);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonHighlighted, setComparisonHighlighted] = useState(false);
  const [inspectionModalOpen, setInspectionModalOpen] = useState(false);

  const handleCompareClick = () => {
    setIsComparing(true);
    setTimeout(() => {
      setComparisonHighlighted(true);
    }, 400);
  };

  const handleStatusUpdate = (newStatus, newType) => {
    if (selectedCase) {
      updateReturnStatus(selectedCase.id, newStatus, newType, "Technician updated inspection verdict.");
      setSelectedCase(prev => ({
        ...prev,
        status: newStatus,
        statusType: newType
      }));
    }
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

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Workflow Pillar 04
          </span>
        </div>

        {/* Page Header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Warehouse className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
                Warehouse Verification & Deep Forensics
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                "The warehouse performs deeper verification."
              </p>
            </div>
          </div>

          {/* Scientific Disclaimer (Mandatory Requirement) */}
          <div className="mt-4 p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 text-xs flex items-start gap-3">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">
                Physical Forensics & Verification Reality:
              </p>
              <p className="leading-relaxed text-slate-700">
                Authorized warehouse staff or specialized hardware diagnostic systems must inspect the physical product, take lab-grade weight measurements, and compare evidence with the manufacturer's original record before making a final refund decision.
                <br />
                <strong>Note:</strong> Encryption does not detect counterfeit components; encryption protects data in transit, while physical component inspection happens here at the warehouse.
              </p>
            </div>
          </div>
        </div>

        {/* Status Legend Strip */}
        <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 mb-8 text-xs">
          <span className="font-bold text-slate-500 uppercase tracking-wider">
            Possible Verification Verdicts:
          </span>
          <Badge status="verified" size="sm">Verified (100% OEM Match)</Badge>
          <Badge status="suspicious" size="sm">Suspicious — Further Inspection</Badge>
          <Badge status="inconclusive" size="sm">Inconclusive — More Evidence Needed</Badge>
        </div>

        {/* Incoming Returns Queue Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden mb-10">
          <div className="p-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Live Intake Pipeline
              </span>
              <h2 className="text-lg font-bold text-navy-950">
                Incoming Returns Queue ({returns.length} Active Records)
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              Select any row to inspect & compare with OEM baseline
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="p-4">Return ID</th>
                  <th className="p-4">Product Reference</th>
                  <th className="p-4">Doorstep Screening Result</th>
                  <th className="p-4">Transfer Security Status</th>
                  <th className="p-4">Inspection Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {returns.map((item) => {
                  const isSelected = selectedCase?.id === item.id;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedCase(item)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/60 font-medium' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="p-4 font-mono font-bold text-navy-950">
                        {item.id}
                      </td>
                      <td className="p-4 text-slate-700">
                        {item.productName || item.productRef}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 font-semibold ${
                          item.doorstepResult.includes('YES') ? 'text-emerald-700' : 'text-rose-700'
                        }`}>
                          {item.doorstepResult}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          <ShieldCheck className="w-3 h-3 text-purple-600" />
                          {item.transferSecurity}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge status={item.statusType} size="sm">
                          {item.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCase(item);
                            handleCompareClick();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-navy-900 text-white text-xs font-semibold hover:bg-brand-primary transition-colors"
                        >
                          Compare Records
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Deep Forensics Comparison Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-soft mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Forensic Comparison Tool
              </span>
              <h2 className="text-xl font-bold text-navy-950">
                OEM Factory Baseline vs. Returned Product Telemetry
              </h2>
            </div>

            {/* Buttons: Compare Records & View Inspection Report */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCompareClick}
                className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <FileSearch className="w-4 h-4" />
                <span>Compare Records</span>
              </button>

              <button
                onClick={() => setInspectionModalOpen(true)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span>View Inspection Report</span>
              </button>
            </div>
          </div>

          {/* Sample Comparison Table (Mandatory Requirement) */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                  <th className="p-3.5 w-1/4">Field</th>
                  <th className="p-3.5 w-1/3">Original Record (OEM Baseline)</th>
                  <th className="p-3.5 w-1/3">Returned Product (Physical Intake)</th>
                  <th className="p-3.5">Comparison Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                
                {/* Row 1: Product ID */}
                <tr className="hover:bg-slate-50">
                  <td className="p-3.5 font-bold text-slate-800">Product ID</td>
                  <td className="p-3.5 font-mono text-slate-700">{COMPARISON_SAMPLE.originalRecord.productId}</td>
                  <td className="p-3.5 font-mono text-slate-700">{COMPARISON_SAMPLE.returnedProduct.productId}</td>
                  <td className="p-3.5">
                    <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Match
                    </span>
                  </td>
                </tr>

                {/* Row 2: Battery Reference (MISMATCH) */}
                <tr className={`transition-all ${comparisonHighlighted ? 'bg-rose-50/80 font-semibold' : 'hover:bg-slate-50'}`}>
                  <td className="p-3.5 font-bold text-navy-950 flex items-center gap-1.5">
                    <BatteryMedium className="w-4 h-4 text-purple-600" />
                    <span>Battery Reference</span>
                  </td>
                  <td className="p-3.5 font-mono text-emerald-800">
                    {COMPARISON_SAMPLE.originalRecord.batteryRef} (OEM)
                  </td>
                  <td className={`p-3.5 font-mono ${comparisonHighlighted ? 'text-rose-700 font-bold' : 'text-slate-700'}`}>
                    {COMPARISON_SAMPLE.returnedProduct.batteryRef}
                  </td>
                  <td className="p-3.5">
                    {comparisonHighlighted ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 inline-flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Further Inspection
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>

                {/* Row 3: Capacity & Health */}
                <tr className={`transition-all ${comparisonHighlighted ? 'bg-rose-50/50' : 'hover:bg-slate-50'}`}>
                  <td className="p-3.5 font-bold text-slate-800">Calibrated Capacity</td>
                  <td className="p-3.5 text-slate-700">{COMPARISON_SAMPLE.originalRecord.capacity}</td>
                  <td className={`p-3.5 ${comparisonHighlighted ? 'text-rose-700 font-bold' : 'text-slate-700'}`}>
                    {COMPARISON_SAMPLE.returnedProduct.capacity}
                  </td>
                  <td className="p-3.5">
                    {comparisonHighlighted ? (
                      <span className="text-rose-600 font-semibold text-xs">Mismatched Cell</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>

                {/* Row 4: Battery Cycles */}
                <tr className={`transition-all ${comparisonHighlighted ? 'bg-rose-50/50' : 'hover:bg-slate-50'}`}>
                  <td className="p-3.5 font-bold text-slate-800">Hardware Cycle Count</td>
                  <td className="p-3.5 text-slate-700">{COMPARISON_SAMPLE.originalRecord.cycleCount}</td>
                  <td className={`p-3.5 ${comparisonHighlighted ? 'text-rose-700 font-bold' : 'text-slate-700'}`}>
                    {COMPARISON_SAMPLE.returnedProduct.cycleCount}
                  </td>
                  <td className="p-3.5">
                    {comparisonHighlighted ? (
                      <span className="text-rose-600 font-semibold text-xs">Aged Unit Swapped</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>

                {/* Row 5: Fasteners & Chassis */}
                <tr className="hover:bg-slate-50">
                  <td className="p-3.5 font-bold text-slate-800">Chassis Screws</td>
                  <td className="p-3.5 text-slate-700">{COMPARISON_SAMPLE.originalRecord.screwCondition}</td>
                  <td className={`p-3.5 ${comparisonHighlighted ? 'text-amber-700 font-semibold' : 'text-slate-700'}`}>
                    {COMPARISON_SAMPLE.returnedProduct.screwCondition}
                  </td>
                  <td className="p-3.5">
                    {comparisonHighlighted ? (
                      <span className="text-amber-700 font-semibold text-xs">Optical Tool Burring</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>

                {/* Row 6: Final Decision */}
                <tr className="bg-slate-50 font-bold">
                  <td className="p-3.5 text-navy-950">Overall Decision</td>
                  <td className="p-3.5 text-slate-500">—</td>
                  <td className="p-3.5 text-slate-500">—</td>
                  <td className="p-3.5">
                    <Badge status="suspicious" size="md">
                      {COMPARISON_SAMPLE.decision}
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Explanation Banner when records compared */}
          {comparisonHighlighted && (
            <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-2 animate-in fade-in">
              <div className="font-bold flex items-center gap-2 text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Forensic Discrepancy Explanation:</span>
              </div>
              <p className="leading-relaxed">
                The returned unit (DEMO-SN-001) was received with an unexpected battery reference (<code>BAT-DIFFERENT</code>), 462 heavy charge cycles, and stripped Torx screw heads. While the external casing was intact, internal component forensics confirms the original 92.4 Wh OEM battery was replaced with a degraded 3rd-party counterfeit clone.
              </p>
              
              {/* Quick Status Setter for Staff */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="font-bold text-slate-700 mr-2">Assign Final Verdict:</span>
                <button
                  onClick={() => handleStatusUpdate("Verified", "verified")}
                  className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-semibold hover:bg-emerald-200"
                >
                  Mark Verified
                </button>
                <button
                  onClick={() => handleStatusUpdate("Suspicious — Further Inspection", "suspicious")}
                  className="px-3 py-1 rounded-lg bg-rose-100 text-rose-800 font-semibold hover:bg-rose-200"
                >
                  Mark Suspicious
                </button>
                <button
                  onClick={() => handleStatusUpdate("Inconclusive — More Evidence Needed", "inconclusive")}
                  className="px-3 py-1 rounded-lg bg-amber-100 text-amber-800 font-semibold hover:bg-amber-200"
                >
                  Mark Inconclusive
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-soft flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/#how-it-works"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Workflow</span>
          </Link>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 transition-colors shadow-sm"
          >
            <span>Open Warehouse Staff Dashboard →</span>
          </Link>
        </div>

      </div>

      {/* Inspection Report Modal */}
      <Modal
        isOpen={inspectionModalOpen}
        onClose={() => setInspectionModalOpen(false)}
        title="Forensic Inspection Dossier: RET-2024-88412"
      >
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
            <div>
              <span className="text-slate-400 block text-xs">Device Inspected</span>
              <span className="font-bold text-navy-950">AeroBook Pro 15 (SN: DEMO-SN-001)</span>
            </div>
            <Badge status="suspicious" size="sm">Tamper Confirmed</Badge>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-navy-950 uppercase text-xs tracking-wider">Technician Findings:</h4>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>Chassis opened on Bench 4 by certified technician Priya Menon.</li>
              <li>OEM tamper-evident adhesive seal beneath the heat sink was ruptured.</li>
              <li>Generic third-party lithium battery model `BAT-GENERIC-990-CLONE` installed.</li>
              <li>Total capacity measured 48.2 Wh vs factory 92.4 Wh specification.</li>
              <li>Gross device weight is 42 grams below OEM tolerance baseline.</li>
            </ul>
          </div>

          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs">
            <strong>Recommendation:</strong> Reject refund for component swapping; notify customer support dispute resolution desk with photographic proof.
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setInspectionModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
