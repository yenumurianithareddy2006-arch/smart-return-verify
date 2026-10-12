import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  Play, 
  Lock, 
  Cpu, 
  Warehouse, 
  CheckCircle,
  FileSearch,
  Sparkles
} from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden hero-mesh pt-12 pb-20 md:pt-16 md:pb-28 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Tagline Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/80 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-bold text-navy-850 uppercase tracking-wider">
              Smart Return Verify • Enterprise Prototype
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-semibold text-blue-700">
              Detect Early. Protect Data. Verify Returns.
            </span>
          </div>
        </div>

        {/* Hero Headline & Subhead */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-navy-950 tracking-tight leading-[1.12]">
            Every Return Deserves{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-blue-600 to-indigo-600">
              Verification.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-normal">
            Smart Return Verify helps e-commerce businesses screen suspicious returns of high-value electronics through AI-assisted checks, secure return-data transfer, and deeper warehouse verification.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/solution"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
            >
              <span>Explore Our Solution</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/workflow/doorstep-screening"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-navy-900 border border-slate-300 text-sm font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm"
            >
              <Play className="w-4 h-4 text-blue-600 fill-blue-600/20" />
              <span>Try Interactive Demo</span>
            </Link>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-navy-900 text-white text-sm font-semibold hover:bg-navy-800 transition-all shadow-sm"
            >
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>Login to Dashboard</span>
            </Link>
          </div>

          {/* Quick Value Proof Points */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-3.5 rounded-xl bg-white/80 border border-slate-200/90 shadow-soft">
              <div className="text-xs font-semibold text-slate-500">Protection Layer</div>
              <div className="text-sm font-bold text-navy-950 mt-0.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                3-Tier Triage
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/80 border border-slate-200/90 shadow-soft">
              <div className="text-xs font-semibold text-slate-500">Transit Security</div>
              <div className="text-sm font-bold text-navy-950 mt-0.5 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-blue-600" />
                AES-256 + HMAC
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/80 border border-slate-200/90 shadow-soft">
              <div className="text-xs font-semibold text-slate-500">Triage Speed</div>
              <div className="text-sm font-bold text-navy-950 mt-0.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                &lt; 90 Sec Screen
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/80 border border-slate-200/90 shadow-soft">
              <div className="text-xs font-semibold text-slate-500">Warehouse Match</div>
              <div className="text-sm font-bold text-navy-950 mt-0.5 flex items-center gap-1.5">
                <FileSearch className="w-4 h-4 text-purple-600" />
                OEM Baseline
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
