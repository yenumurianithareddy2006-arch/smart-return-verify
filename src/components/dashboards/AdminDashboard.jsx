import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  HelpCircle, 
  Coins, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Info,
  Calendar
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { ADMIN_MONTHLY_TRENDS, RECENT_AUDIT_ACTIVITY } from '../../data/mockData';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard = () => {
  const { returns, currentUser } = useAuth();

  // Aggregate stats based on current returns queue + enterprise aggregates
  const totalDemoReturns = 96400; // 96.4k total enterprise monthly returns
  const verifiedCount = 90800; // ~94.2%
  const suspiciousCount = 3950; // ~4.1%
  const inconclusiveCount = 1650; // ~1.7%
  const estimatedSavingsLakh = 98.7; // ₹98.7 Lakh saved

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Executive Analytics & Governance
          </span>
          <h2 className="text-xl font-bold text-navy-950">
            Enterprise Return Fraud Dashboard
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Logged in as: {currentUser?.name || "Dr. Ananya Sen"} • Apex Retail Group India
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Cycle: Q3-Q4 Live Stream</span>
          </span>
        </div>
      </div>

      {/* Clearly Labeled Demo Notice */}
      <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
        <Info className="w-4 h-4 text-brand-primary shrink-0" />
        <span>
          <strong>Demo Notice:</strong> All statistics below represent simulated telemetry across partner hubs (Bengaluru, Hyderabad, Mumbai, Delhi) for platform evaluation.
        </span>
      </div>

      {/* 4 Primary KPI Summary Cards (Mandatory Requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Returns */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Demo Returns</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-1 font-mono">
            {totalDemoReturns.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Across 14 regional reverse logistics hubs
          </span>
        </div>

        {/* Verified Returns */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Verified Returns</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1 font-mono">
            {verifiedCount.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            94.2% Passed OEM baseline triage
          </span>
        </div>

        {/* Suspicious Returns */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Suspicious Returns</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-700 mt-1 font-mono">
            {suspiciousCount.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
            4.1% Flagged for component mismatch
          </span>
        </div>

        {/* Inconclusive Cases */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Inconclusive Cases</span>
            <HelpCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 mt-1 font-mono">
            {inconclusiveCount.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 block">
            1.7% Sent for diagnostic board jigs
          </span>
        </div>

      </div>

      {/* Monthly Return Trends Chart (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-soft">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Monthly Return Trends & Verification Volume
              </span>
              <h3 className="text-base font-bold text-navy-950">
                Screened Volume vs. Suspicious Flagged Units
              </h3>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_MONTHLY_TRENDS} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  formatter={(value, name) => [value.toLocaleString('en-IN') + ' units', name]}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="verified" name="Verified Genuine" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="suspicious" name="Suspicious Flagged" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue & Fraud Estimates Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-soft flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Financial Impact Overview
            </span>
            <h3 className="text-base font-bold text-navy-950 mt-1 mb-4">
              Revenue & Salvage Estimates
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100">
                <span className="text-xs text-blue-800 font-semibold block">Monthly Verification Fees</span>
                <div className="text-2xl font-extrabold text-navy-950 font-mono mt-1">
                  ₹9.64 Lakh
                </div>
                <span className="text-[10px] text-slate-500">Based on ₹10 / unit average fee</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <span className="text-xs text-emerald-800 font-semibold block">Est. Component Losses Prevented</span>
                <div className="text-2xl font-extrabold text-emerald-800 font-mono mt-1">
                  ₹{estimatedSavingsLakh} Lakh
                </div>
                <span className="text-[10px] text-slate-500">Prevented replacement of ~3,950 swapped laptop units</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            Figures are modeled from prototype telemetry and benchmarked against standard reverse logistics audits.
          </div>
        </div>

      </div>

      {/* Recent System Activity Ledger (Mandatory Requirement) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-soft">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span>Recent System-Wide Audit Activity</span>
          </h3>
          <span className="text-xs text-slate-400">Chronological Event Stream</span>
        </div>

        <div className="space-y-3">
          {RECENT_AUDIT_ACTIVITY.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-400 font-bold">{log.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  log.severity === 'warning' ? 'bg-amber-100 text-amber-800' :
                  log.severity === 'critical' ? 'bg-rose-100 text-rose-800' :
                  log.severity === 'success' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {log.action}
                </span>
                <span className="text-slate-700">{log.details}</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-400 shrink-0 text-[11px]">
                <Clock className="w-3.5 h-3.5" />
                <span>{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
