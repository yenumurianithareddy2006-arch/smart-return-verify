import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  Building2, 
  Smartphone, 
  Lock, 
  Warehouse, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Layers, 
  FileSearch,
  Sparkles
} from 'lucide-react';

export const SolutionPage = () => {
  return (
    <div className="min-h-screen bg-brand-surface py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-primary text-xs font-bold uppercase tracking-wider mb-3 border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>The Multi-Tiered Defense System</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy-950 tracking-tight">
            Detect Early. Protect Data. Verify Returns.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Smart Return Verify transforms return fraud prevention from an expensive, blind warehouse bottleneck into a synchronized 3-tier verification pipeline.
          </p>
        </div>

        {/* 3-Tier Defense System Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          
          {/* Tier 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-soft flex flex-col justify-between hover:shadow-soft-lg transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tier 01 Defense
              </span>
              <h2 className="text-xl font-bold text-navy-950 mt-1 mb-3">
                OEM Baseline Registry
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                At the manufacturing plant, factory test fixtures record component microcontroller serials, battery cycle counts, and cryptographic firmware signatures into an immutable baseline store.
              </p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Factory component serial lock</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Chassis screw torque fingerprinting</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6">
              <Link
                to="/workflow/manufacturer-record"
                className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
              >
                <span>View OEM Baseline Spec</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Tier 2 */}
          <div className="bg-white rounded-2xl border-2 border-indigo-200 p-8 shadow-soft-lg flex flex-col justify-between relative hover:shadow-soft-xl transition-all">
            <span className="absolute -top-3 left-8 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider shadow">
              Core Innovation
            </span>
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                <Smartphone className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tier 02 Defense
              </span>
              <h2 className="text-xl font-bold text-navy-950 mt-1 mb-3">
                Doorstep AI & Telemetry Triage
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                The delivery agent performs non-invasive optical inspection of chassis screw heads for screwdriver burring and connects a lightweight USB-C diagnostic dongle to read battery health without opening the laptop.
              </p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Instant YES / NO routing advice</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Zero device dismantling at doorstep</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6">
              <Link
                to="/workflow/doorstep-screening"
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <span>Test Doorstep Agent App</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Tier 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-soft flex flex-col justify-between hover:shadow-soft-lg transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
                <Warehouse className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tier 03 Defense
              </span>
              <h2 className="text-xl font-bold text-navy-950 mt-1 mb-3">
                Encrypted Handoff & Forensics
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Evidence is secured via AES-256 and HMAC-SHA256. Warehouse staff inspect only flagged units, comparing physical telemetry side-by-side with the OEM baseline.
              </p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Full cryptographic transit privacy</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Side-by-side discrepancy comparator</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6">
              <Link
                to="/workflow/warehouse-verification"
                className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1"
              >
                <span>Open Forensics Queue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Comparison: Traditional Returns vs. Smart Return Verify */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden mb-16">
          <div className="p-6 sm:p-8 border-b border-slate-200 bg-slate-50">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Operational Impact Comparison
            </span>
            <h2 className="text-2xl font-bold text-navy-950 mt-1">
              Traditional E-Commerce Returns vs. Smart Return Verify
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/60 font-semibold text-slate-700">
                  <th className="p-4 w-1/4">Process Dimension</th>
                  <th className="p-4 w-1/3 text-rose-800">Traditional Returns</th>
                  <th className="p-4 w-1/3 text-emerald-800">With Smart Return Verify</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-4 font-bold text-navy-950">Doorstep Inspection</td>
                  <td className="p-4 text-rose-700 flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>Visual external check only; internal component swaps completely unnoticed.</span>
                  </td>
                  <td className="p-4 text-emerald-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Non-destructive optical screw check + USB-C telemetry triage flags swapped batteries in 90 seconds.</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-navy-950">Transit Chain of Custody</td>
                  <td className="p-4 text-rose-700 flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>Paper manifests or unencrypted database entries prone to dispute.</span>
                  </td>
                  <td className="p-4 text-emerald-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>AES-256 payload encryption with HMAC-SHA256 signature guarantees auditability.</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-navy-950">Warehouse Workload</td>
                  <td className="p-4 text-rose-700 flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>Technicians must inspect 100% of incoming electronics returns blindly.</span>
                  </td>
                  <td className="p-4 text-emerald-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Verified returns bypass teardown; staff focuses only on high-risk suspicious cases.</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-navy-950">Refund Processing Time</td>
                  <td className="p-4 text-rose-700 flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>Honest buyers wait 5-10 business days for warehouse lab clearance.</span>
                  </td>
                  <td className="p-4 text-emerald-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Genuine buyers can be refunded instantly upon verified doorstep triage.</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <Link
            to="/workflow/doorstep-screening"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand-primary text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
          >
            <span>Launch Interactive Doorstep AI Demo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};
