import React, { useState } from 'react';
import { 
  Warehouse, 
  FileSearch, 
  CheckCircle2, 
  AlertTriangle, 
  Filter, 
  ArrowRight,
  ShieldAlert,
  Clock,
  FileText,
  UserCheck
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { COMPARISON_SAMPLE } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

export const WarehouseDashboard = () => {
  const { returns, updateReturnStatus, currentUser } = useAuth();
  const [filter, setFilter] = useState('all'); // 'all' | 'suspicious' | 'verified' | 'inconclusive'
  const [activeCase, setActiveCase] = useState(null);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareDone, setCompareDone] = useState(false);

  const filteredReturns = returns.filter((item) => {
    if (filter === 'all') return true;
    return item.statusType === filter;
  });

  const handleOpenCase = (item) => {
    setActiveCase(item);
    setCompareModalOpen(true);
    setCompareDone(false);
  };

  const handleApplyVerdict = (newStatus, newType) => {
    if (activeCase) {
      updateReturnStatus(activeCase.id, newStatus, newType, "Technician bench inspection concluded.");
      setActiveCase(prev => ({
        ...prev,
        status: newStatus,
        statusType: newType
      }));
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
            Warehouse Forensics Portal
          </span>
          <h2 className="text-xl font-bold text-navy-950">
            Intake Queue & Verification Bench
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Logged in as: {currentUser?.name || "Priya Menon"} • Facility: Apex Central Fulfillment Hub BLR
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${filter === 'all' ? 'bg-white text-navy-950 shadow-xs font-bold' : 'text-slate-600'}`}
          >
            All ({returns.length})
          </button>
          <button
            onClick={() => setFilter('suspicious')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${filter === 'suspicious' ? 'bg-white text-rose-800 shadow-xs font-bold' : 'text-slate-600'}`}
          >
            Suspicious
          </button>
          <button
            onClick={() => setFilter('verified')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${filter === 'verified' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-slate-600'}`}
          >
            Verified
          </button>
          <button
            onClick={() => setFilter('inconclusive')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${filter === 'inconclusive' ? 'bg-white text-amber-800 shadow-xs font-bold' : 'text-slate-600'}`}
          >
            Inconclusive
          </button>
        </div>
      </div>

      {/* Incoming Returns Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-navy-950">
              Active Returns Queue ({filteredReturns.length} Items)
            </h3>
            <span className="text-xs text-slate-400">Click any row to open forensics comparator & update status</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                <th className="p-4">Return ID</th>
                <th className="p-4">Product Reference</th>
                <th className="p-4">Doorstep Result</th>
                <th className="p-4">Battery Serial Check</th>
                <th className="p-4">Inspection Status</th>
                <th className="p-4 text-right">Forensic Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReturns.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleOpenCase(item)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="p-4 font-mono font-bold text-navy-950">{item.id}</td>
                  <td className="p-4 text-slate-700 font-medium">{item.productName || item.productRef}</td>
                  <td className="p-4">
                    <span className={item.doorstepResult.includes('YES') ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>
                      {item.doorstepResult}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs text-slate-600">{item.batteryFound || "BAT-OEM"}</td>
                  <td className="p-4">
                    <Badge status={item.statusType} size="sm">{item.status}</Badge>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCase(item);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-navy-900 text-white text-xs font-semibold hover:bg-brand-primary transition-colors"
                    >
                      Compare Records
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Forensics & Record Comparison Modal */}
      <Modal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        title={`Forensics Dossier: ${activeCase?.id || "Return Case"}`}
        maxWidth="max-w-3xl"
      >
        {activeCase && (
          <div className="space-y-6 text-xs sm:text-sm text-slate-700">
            
            {/* Meta Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl">
              <div>
                <span className="text-slate-400 block text-[11px]">Product</span>
                <span className="font-bold text-navy-950">{activeCase.productName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Courier Agent</span>
                <span className="text-slate-800 font-medium">{activeCase.doorstepAgent}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Doorstep Triage</span>
                <span className={activeCase.doorstepResult.includes('YES') ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                  {activeCase.doorstepResult}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Status</span>
                <Badge status={activeCase.statusType} size="sm">{activeCase.status}</Badge>
              </div>
            </div>

            {/* Side-by-Side Comparison Table */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-navy-950 text-xs uppercase tracking-wider">
                  Side-by-Side Telemetry Match
                </h4>
                <button
                  type="button"
                  onClick={() => setCompareDone(true)}
                  className="px-3 py-1 rounded-lg bg-brand-primary text-white text-xs font-semibold hover:bg-blue-700"
                >
                  {compareDone ? "✓ Comparison Applied" : "Run Field Diff"}
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Attribute</th>
                      <th className="p-3">OEM Baseline Record</th>
                      <th className="p-3">Physical Unit (Returned)</th>
                      <th className="p-3">Evaluation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-semibold">Battery Serial</td>
                      <td className="p-3 font-mono text-emerald-800">{activeCase.batteryExpected}</td>
                      <td className={`p-3 font-mono ${compareDone && activeCase.batteryFound !== activeCase.batteryExpected ? 'text-rose-700 font-bold bg-rose-50' : 'text-slate-800'}`}>
                        {activeCase.batteryFound}
                      </td>
                      <td className="p-3">
                        {compareDone && activeCase.batteryFound !== activeCase.batteryExpected ? (
                          <span className="text-rose-600 font-bold">MISMATCH</span>
                        ) : (
                          <span className="text-emerald-700 font-semibold">Match</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Chassis Screws</td>
                      <td className="p-3 text-slate-600">Pristine Torx T5</td>
                      <td className={`p-3 ${compareDone && activeCase.doorstepResult.includes('NO') ? 'text-rose-700 bg-rose-50' : 'text-slate-800'}`}>
                        {activeCase.doorstepResult.includes('NO') ? "Burred screw heads (stripped)" : "Clean factory torque"}
                      </td>
                      <td className="p-3">
                        {activeCase.doorstepResult.includes('NO') ? (
                          <span className="text-amber-700 font-bold">Tool Burring</span>
                        ) : (
                          <span className="text-emerald-700 font-semibold">Match</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Update Inspection Status Controls */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-navy-950 uppercase tracking-wider block">
                Update Technician Inspection Verdict:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyVerdict("Verified", "verified")}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                >
                  Mark Verified (Genuine)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyVerdict("Suspicious — Further Inspection", "suspicious")}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors"
                >
                  Mark Suspicious (Swapped)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyVerdict("Inconclusive — More Evidence Needed", "inconclusive")}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors"
                >
                  Mark Inconclusive
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setCompareModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-300"
              >
                Close Dossier
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
