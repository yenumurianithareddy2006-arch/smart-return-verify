import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  ArrowRight, 
  Laptop, 
  Database, 
  Repeat, 
  EyeOff, 
  RotateCcw, 
  HelpCircle, 
  TrendingDown, 
  ShieldX, 
  Clock, 
  Coins,
  CheckCircle2
} from 'lucide-react';

export const ProblemPage = () => {
  const storySteps = [
    {
      step: 1,
      title: "Sale of Genuine ₹70,000 Laptop",
      desc: "An e-commerce retailer sells a high-performance genuine laptop with certified OEM battery and pristine components to a consumer.",
      icon: Laptop,
      badge: "Genuine Retail Sale",
      badgeColor: "bg-blue-100 text-blue-800",
      highlight: "₹70,000 Genuine Asset",
      border: "border-blue-200"
    },
    {
      step: 2,
      title: "OEM Records Original Specs",
      desc: "The manufacturer records available hardware serials, battery controller telemetry, and firmware hashes into factory production databases.",
      icon: Database,
      badge: "OEM Baseline Stored",
      badgeColor: "bg-indigo-100 text-indigo-800",
      highlight: "BAT-OEM-882194-A Registered",
      border: "border-indigo-200"
    },
    {
      step: 3,
      title: "Internal Component Swapped",
      desc: "A bad-faith actor opens the chassis and replaces the high-capacity OEM battery with a cheap or degraded counterfeit clone that looks identical.",
      icon: Repeat,
      badge: "Component Fraud Committed",
      badgeColor: "bg-rose-100 text-rose-800",
      highlight: "Swapped with ₹1,200 Fake Battery",
      border: "border-rose-300"
    },
    {
      step: 4,
      title: "Laptop Appears Completely Normal",
      desc: "The chassis base is screwed back together. From the outside, the laptop looks brand new without any obvious physical damage.",
      icon: EyeOff,
      badge: "Invisible External Flaw",
      badgeColor: "bg-amber-100 text-amber-800",
      highlight: "Zero External Clues to Courier",
      border: "border-amber-200"
    },
    {
      step: 5,
      title: "Customer Requests Return & Refund",
      desc: "The customer initiates a return claiming 'buyer remorse' or 'system running warm', expecting an instant doorstep refund credit.",
      icon: RotateCcw,
      badge: "Return Requested",
      badgeColor: "bg-purple-100 text-purple-800",
      highlight: "Return Windows: 7-10 Days",
      border: "border-purple-200"
    },
    {
      step: 6,
      title: "The E-Commerce Verification Dilemma",
      desc: "The business must decide: Does the returned device still have the original ₹70,000 components, or was valuable hardware harvested?",
      icon: HelpCircle,
      badge: "Verification Dilemma",
      badgeColor: "bg-rose-100 text-rose-800",
      highlight: "High Financial Loss Risk",
      border: "border-rose-400"
    }
  ];

  return (
    <div className="min-h-screen bg-brand-surface py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider mb-3 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>The Reverse Logistics Crisis</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy-950 tracking-tight">
            The Hidden Fraud in High-Value Electronics Returns
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            How identical-looking consumer laptops disguise internal battery and component theft, and why standard doorstep pickups fail to catch it.
          </p>
        </div>

        {/* 6-Stage Visual Narrative Grid */}
        <div className="mb-20">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
            <span>The Anatomy of a Component Swap (6-Stage Story)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {storySteps.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className={`bg-white rounded-2xl border ${item.border} p-6 shadow-soft flex flex-col justify-between hover:shadow-soft-lg transition-all duration-300`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-navy-900 flex items-center justify-center font-bold text-sm">
                        0{item.step}
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 mb-3 border border-slate-100">
                      <Icon className="w-6 h-6 stroke-[1.8]" />
                    </div>

                    <h3 className="text-base font-bold text-navy-950 mb-2">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] font-semibold text-slate-500 flex items-center justify-between">
                    <span>Key Metric:</span>
                    <span className="text-navy-900 font-mono">{item.highlight}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why Manual Inspection Fails at Scale */}
        <div className="bg-navy-950 text-white rounded-3xl p-8 sm:p-12 mb-16 shadow-soft-xl">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              The Operational Bottleneck
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Why Manually Checking Every Return Fails at High Volume
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
              When an e-commerce platform processes tens of thousands of electronics returns every month, manually unscrewing, diagnosing, and inspecting every single unit in a cleanroom warehouse is simply impossible:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <Clock className="w-8 h-8 text-amber-400 mb-3" />
              <h3 className="text-base font-bold text-white mb-1.5">Too Slow for SLAs</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                A full technician chassis teardown takes 20-30 minutes per laptop. E-commerce platforms with 100,000 monthly returns would need thousands of certified technicians just for teardowns.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <Coins className="w-8 h-8 text-rose-400 mb-3" />
              <h3 className="text-base font-bold text-white mb-1.5">Prohibitively Expensive</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Qualified bench inspection costs ₹400 - ₹800 per device in labor and tooling, eroding retail operating margins and delaying customer refund satisfaction.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <ShieldX className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="text-base font-bold text-white mb-1.5">Couriers Lack Tools</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Delivery agents cannot open laptops on the street without risking customer disputes, damage claims, and physical injury.
              </p>
            </div>
          </div>
        </div>

        {/* Clear CTA to Solution */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold text-navy-950">
            A Smarter, Multi-Tiered Verification Approach
          </h2>
          <p className="text-sm text-slate-600">
            Smart Return Verify screens returns early at the doorstep using optical fasteners analysis and diagnostic handshakes, routing only suspicious cases for deep warehouse inspection.
          </p>
          <div className="pt-2">
            <Link
              to="/solution"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand-primary text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
            >
              <span>Explore Our Solution</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
