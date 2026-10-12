import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  AlertTriangle, 
  Cpu, 
  Coins, 
  Lock, 
  CheckCircle2, 
  Play,
  Layers,
  Sparkles
} from 'lucide-react';
import { HeroSection } from '../components/home/HeroSection';
import { PipelineVisual } from '../components/home/PipelineVisual';
import { WorkflowGrid } from '../components/home/WorkflowGrid';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-brand-surface">
      
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Visual Animated Workflow Pipeline */}
      <PipelineVisual />

      {/* 3. The 4 Interactive Workflow Cards */}
      <WorkflowGrid />

      {/* 4. Problem Statement Teaser */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider border border-rose-200">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>The Invisible Fraud Problem</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight leading-tight">
                A Genuine ₹70,000 Laptop Leaves the Factory. A Degraded Clone Comes Back.
              </h2>

              <p className="text-base text-slate-600 leading-relaxed">
                Liberal e-commerce return windows make it easy for bad actors to swap original OEM lithium batteries, displays, or microcontrollers with cheap counterfeit parts. To the delivery courier, the laptop looks brand new. But to your business, it represents a catastrophic margin loss.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-navy-950 block">External Appearance:</span>
                  <span className="text-xs text-slate-600 mt-1 block">
                    Zero scratches, pristine screen, normal power-on animation.
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                  <span className="text-xs font-bold text-rose-900 block">Internal Reality:</span>
                  <span className="text-xs text-rose-800 mt-1 block">
                    92.4 Wh OEM battery swapped with a ₹1,200 degraded generic clone.
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/problem"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-brand-primary transition-all shadow-sm"
                >
                  <span>Explore The Full Problem Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Visual Narrative Schematic Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-navy-950 text-white p-8 rounded-3xl shadow-soft-xl border border-slate-800 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Case Scenario Snapshot
              </span>
              
              <div className="space-y-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between">
                  <span className="text-slate-400">Asset Retail Value:</span>
                  <span className="text-white font-bold">₹70,000 INR</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between">
                  <span className="text-slate-400">OEM Battery Baseline:</span>
                  <span className="text-emerald-400">BAT-OEM-882194-A</span>
                </div>
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex justify-between text-rose-300">
                  <span>Physical Unit Found:</span>
                  <span className="font-bold">BAT-GENERIC-990</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Manually opening every return in a warehouse is slow and expensive. Smart Return Verify catches stripped screws and hardware mismatches before the refund is released.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Business ROI & Calculator Teaser */}
      <section className="py-20 bg-brand-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-tr from-navy-950 via-slate-900 to-navy-900 rounded-3xl p-8 sm:p-14 text-white shadow-soft-xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Proven Unit Economics
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Project Your Return Verification ROI
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                At ₹10 per return verification, screening 200,000 monthly returns projects ₹20 Lakh in monthly platform volume (₹2.4 Crore annually) while preventing crores in component theft.
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                <span>• 50k returns = ₹5 Lakh/mo</span>
                <span>• 100k returns = ₹10 Lakh/mo</span>
                <span>• 200k returns = ₹20 Lakh/mo</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
              <Link
                to="/business-model"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-blue-600 transition-colors shadow-md"
              >
                <Coins className="w-4 h-4" />
                <span>Open Revenue Calculator</span>
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors"
              >
                <span>Request Enterprise Demo</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
