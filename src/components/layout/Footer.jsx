import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Cpu, Database, CheckCircle2, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-indigo-500 flex items-center justify-center text-white shadow-md">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                Smart Return<span className="text-blue-400"> Verify</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Detect Early. Protect Data. Verify Returns.
              Empowering e-commerce retailers, electronics OEMs, and reverse logistics providers with AI-assisted doorstep triage, cryptographic handoffs, and warehouse verification forensics.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 text-emerald-400 border border-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Prototype Demo Active
              </span>
              <span className="text-slate-500">•</span>
              <span>AES-256 + HMAC-SHA256 Simulation</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/problem" className="text-slate-400 hover:text-white transition-colors">The Problem</Link>
              </li>
              <li>
                <Link to="/solution" className="text-slate-400 hover:text-white transition-colors">Our Solution</Link>
              </li>
              <li>
                <Link to="/features" className="text-slate-400 hover:text-white transition-colors">Features & Benefits</Link>
              </li>
              <li>
                <Link to="/business-model" className="text-slate-400 hover:text-white transition-colors">Business Model & ROI</Link>
              </li>
            </ul>
          </div>

          {/* Interactive Workflows */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">Workflows</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/workflow/manufacturer-record" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">
                  <span>1. OEM Baseline Record</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/workflow/doorstep-screening" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">
                  <span>2. Doorstep AI Screening</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/workflow/secure-handoff" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">
                  <span>3. Secure Digital Handoff</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/workflow/warehouse-verification" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">
                  <span>4. Warehouse Forensics</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Access & Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">Access & Demos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">Role Dashboards</Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-white transition-colors">Sign In (Demo Mode)</Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-400 hover:text-white transition-colors">Create Business Account</Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">Request Enterprise Demo</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Technical Disclosure Box */}
        <div className="mt-8 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 leading-relaxed space-y-1.5">
          <p className="font-semibold text-slate-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            Prototype Disclosures & Technical Honesty:
          </p>
          <p>
            Smart Return Verify is an AI-assisted returns fraud prevention prototype. A smartphone photograph alone cannot reliably reveal internal component swapping or battery telemetry; our architecture combines external optical screening with diagnostic hardware handshake telemetry and encrypted return evidence. In-transit cryptographic simulations demonstrate how AES-256 and HMAC protect record confidentiality and integrity. Physical component verification is finalized at authorized warehouse hubs.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Smart Return Verify. Fictional prototype built for showcase & evaluation.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms of Verification</Link>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Contact Engineering</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
