import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Cpu, 
  Smartphone, 
  Database, 
  Lock, 
  ShieldCheck, 
  Warehouse, 
  History, 
  Workflow, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

export const FeaturesPage = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const features = [
    {
      id: "ai-screening",
      title: "AI-Assisted First-Level Screening",
      desc: "Analyzes chassis fasteners for microscopic tool burring and cross-references battery health telemetry in seconds.",
      benefit: "Identifies suspicious returns earlier before expensive shipping.",
      icon: Cpu,
      color: "text-blue-600 bg-blue-50 border-blue-200"
    },
    {
      id: "yes-no-ui",
      title: "Simple YES/NO Delivery Agent Interface",
      desc: "Designed specifically for delivery personnel with no engineering training. Clear binary directions with zero ambiguity.",
      benefit: "Reduces courier mistakes and keeps doorstep interactions under 90 seconds.",
      icon: Smartphone,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200"
    },
    {
      id: "mfg-records",
      title: "Manufacturer Reference Records",
      desc: "Cryptographically bound OEM baseline containing original part serials, microcontroller IDs, and battery firmware signatures.",
      benefit: "Establishes a single source of truth from factory floor to reverse logistics.",
      icon: Database,
      color: "text-purple-600 bg-purple-50 border-purple-200"
    },
    {
      id: "encrypted-transfer",
      title: "Secure Encrypted Data Transfer",
      desc: "All photos, telemetry payloads, agent GPS tags, and timestamps are encrypted using AES-256 before transit.",
      benefit: "Protects customer serials and return data from eavesdropping during transfer.",
      icon: Lock,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200"
    },
    {
      id: "hmac-integrity",
      title: "HMAC-Based Digital Record Integrity",
      desc: "Every record is signed with an HMAC-SHA256 signature to guarantee that no digital record has been modified in transit.",
      benefit: "Provides mathematical proof that return telemetry was not tampered with.",
      icon: ShieldCheck,
      color: "text-cyan-600 bg-cyan-50 border-cyan-200"
    },
    {
      id: "warehouse-dash",
      title: "Warehouse Verification Dashboard",
      desc: "Side-by-side discrepancy comparator that highlights mismatches between returned devices and OEM baselines.",
      benefit: "Reduces unnecessary manual screening by prioritizing flagged units.",
      icon: Warehouse,
      color: "text-amber-600 bg-amber-50 border-amber-200"
    },
    {
      id: "return-history",
      title: "Return History and Audit Reporting",
      desc: "Comprehensive chronological ledger of all return inspections, staff forensic notes, and customer dispute files.",
      benefit: "Keeps return records organized and ready for partner audits.",
      icon: History,
      color: "text-rose-600 bg-rose-50 border-rose-200"
    },
    {
      id: "logistics-integration",
      title: "Integration with Existing Logistics Systems",
      desc: "REST APIs and webhooks designed to plug into SAP, Blue Yonder, Shiprocket, Delhivery, and custom ERPs.",
      benefit: "Improves end-to-end visibility across the return process without replacing core ERPs.",
      icon: Workflow,
      color: "text-teal-600 bg-teal-50 border-teal-200"
    }
  ];

  return (
    <div className="min-h-screen bg-brand-surface py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-primary text-xs font-bold uppercase tracking-wider mb-3 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Capabilities</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy-950 tracking-tight">
            Comprehensive Return Fraud Prevention Features
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Built from the ground up to empower couriers, warehouse forensic technicians, and retail operations teams with reliable data.
          </p>

          {/* Realistic Capabilities Disclosure (Mandatory Requirement) */}
          <div className="mt-6 p-4 rounded-xl bg-slate-100 text-slate-700 text-xs text-left flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Transparent Engineering Promise:</span> Smart Return Verify is a risk-mitigation tool that streamlines fraud triage. We do not claim 100% fraud elimination or guaranteed cost savings, as complex fraud techniques evolve and physical inspection remains essential for conclusive decisions.
            </div>
          </div>
        </div>

        {/* 8 Interactive Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feat) => {
            const Icon = feat.icon;
            const isSelected = selectedFeature === feat.id;

            return (
              <div
                key={feat.id}
                onClick={() => setSelectedFeature(isSelected ? null : feat.id)}
                className={`bg-white rounded-2xl border p-6 shadow-soft cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                  isSelected ? 'border-brand-primary ring-2 ring-blue-500/20 shadow-soft-xl -translate-y-1' : 'border-slate-200 hover:border-slate-300 hover:-translate-y-1'
                }`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${feat.color}`}>
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h3 className="text-base font-bold text-navy-950 mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Direct Benefit:
                  </span>
                  <p className="text-xs font-semibold text-emerald-800">
                    {feat.benefit}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 5 Core Benefits Summary (Plain English) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-soft mb-16">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
              Executive Summary
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-1">
              Key Business Benefits in Plain English
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Why leading retail operations and logistics leaders rely on Smart Return Verify:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100">
              <CheckCircle2 className="w-6 h-6 text-brand-primary mb-2" />
              <h4 className="text-sm font-bold text-navy-950 mb-1">Identify Suspicious Returns Earlier</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Catch stripped screws and clone batteries right at the doorstep before they blend into bulk returns inventory.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100">
              <CheckCircle2 className="w-6 h-6 text-indigo-600 mb-2" />
              <h4 className="text-sm font-bold text-navy-950 mb-1">Reduce Unnecessary Manual Screening</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Verified genuine products can be routed directly to restock, freeing skilled technicians to focus on high-risk units.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100">
              <CheckCircle2 className="w-6 h-6 text-purple-600 mb-2" />
              <h4 className="text-sm font-bold text-navy-950 mb-1">Keep Return Records Organized</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every return has a structured digital dossier containing timestamp, agent ID, optical photos, and diagnostic telemetry.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mb-2" />
              <h4 className="text-sm font-bold text-navy-950 mb-1">Protect Information During Transfer</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                AES-256 encryption and HMAC signatures guarantee privacy and prevent data tampering between couriers and the hub.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-teal-50/50 border border-teal-100 md:col-span-2 lg:col-span-1">
              <CheckCircle2 className="w-6 h-6 text-teal-600 mb-2" />
              <h4 className="text-sm font-bold text-navy-950 mb-1">Improve Visibility Across Process</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Management, couriers, and warehouse staff see consistent return statuses in real time.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <Link
            to="/business-model"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand-primary text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
          >
            <span>Calculate Business ROI & Projections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};
