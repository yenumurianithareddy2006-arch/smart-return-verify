import React, { useState } from 'react';
import { 
  Building2, 
  RotateCcw, 
  Smartphone, 
  Lock, 
  Warehouse, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PipelineVisual = () => {
  const [activeStep, setActiveStep] = useState(2); // default Doorstep AI

  const steps = [
    {
      id: 0,
      title: "1. Manufacturer Baseline",
      shortTitle: "OEM Record",
      icon: Building2,
      color: "from-blue-500 to-blue-600",
      accent: "text-blue-600",
      bgLight: "bg-blue-50 border-blue-200",
      description: "OEM records factory hardware serials, battery controller telemetry, and firmware hashes into a secure baseline registry during production.",
      route: "/workflow/manufacturer-record",
      linkText: "View OEM Baseline Spec"
    },
    {
      id: 1,
      title: "2. Customer Return Request",
      shortTitle: "Return Initiated",
      icon: RotateCcw,
      color: "from-amber-500 to-amber-600",
      accent: "text-amber-600",
      bgLight: "bg-amber-50 border-amber-200",
      description: "Customer initiates a return claiming a defect or dissatisfaction. Liberal e-commerce return policies mandate quick doorstep pickup.",
      route: "/problem",
      linkText: "Explore The Fraud Dilemma"
    },
    {
      id: 2,
      title: "3. Doorstep AI Screening",
      shortTitle: "AI Screening",
      icon: Smartphone,
      color: "from-indigo-500 to-indigo-600",
      accent: "text-indigo-600",
      bgLight: "bg-indigo-50 border-indigo-200",
      description: "Delivery agent conducts external chassis optical check & diagnostic handshake. Instant simulated triage flags suspicious swapped hardware without opening the device.",
      route: "/workflow/doorstep-screening",
      linkText: "Test Doorstep Agent App"
    },
    {
      id: 3,
      title: "4. Encrypted Transfer",
      shortTitle: "Secure Handoff",
      icon: Lock,
      color: "from-purple-500 to-purple-600",
      accent: "text-purple-600",
      bgLight: "bg-purple-50 border-purple-200",
      description: "Triage photo, GPS tag, agent ID, and hardware telemetry are bundled into an AES-256 encrypted payload signed with an HMAC-SHA256 integrity tag.",
      route: "/workflow/secure-handoff",
      linkText: "Demonstrate AES & HMAC"
    },
    {
      id: 4,
      title: "5. Warehouse Forensics",
      shortTitle: "Warehouse Verification",
      icon: Warehouse,
      color: "from-emerald-500 to-emerald-600",
      accent: "text-emerald-600",
      bgLight: "bg-emerald-50 border-emerald-200",
      description: "Warehouse technicians receive the decrypted chain of custody, compare physical components against OEM records, and verify authenticity before refund payout.",
      route: "/workflow/warehouse-verification",
      linkText: "Open Forensics Queue"
    }
  ];

  const current = steps[activeStep];

  return (
    <section className="py-16 md:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <span>End-to-End Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
            How Smart Return Verify Works
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            A continuous chain-of-custody connecting the factory floor, the doorstep pickup, and the centralized forensics warehouse.
          </p>
        </div>

        {/* Interactive Step Track */}
        <div className="relative mb-10">
          {/* Connector Line behind steps (desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-slate-200 z-0" />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 relative z-10">
            {steps.map((step) => {
              const Icon = step.icon;
              const isSelected = activeStep === step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col items-start ${
                    isSelected
                      ? 'bg-navy-900 border-navy-900 text-white shadow-soft-lg scale-[1.02]'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-navy-800 text-blue-300'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      0{step.id + 1}
                    </span>
                  </div>

                  <span className="text-xs font-semibold uppercase tracking-wider opacity-75">
                    Stage {step.id + 1}
                  </span>
                  <span className={`text-sm font-bold mt-0.5 ${isSelected ? 'text-white' : 'text-navy-950'}`}>
                    {step.shortTitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Detailed Breakdown Panel */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 transition-all">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-white border border-slate-200 text-navy-900 shadow-sm`}>
                  Active Stage 0{activeStep + 1} of 05
                </span>
                <span className="text-sm font-bold text-navy-950">{current.title}</span>
              </div>
              <p className="text-base text-slate-600 leading-relaxed">
                {current.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <Link
                to={current.route}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                <span>{current.linkText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
