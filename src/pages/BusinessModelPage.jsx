import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Coins, 
  TrendingUp, 
  Users, 
  PackageCheck, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2, 
  Sliders, 
  Info,
  Clock,
  ShieldCheck,
  Percent
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { PRICING_TIERS, CALCULATOR_PRESETS, formatIndianCurrency } from '../data/businessData';

export const BusinessModelPage = () => {
  // Calculator inputs
  const [returnVolume, setReturnVolume] = useState(100000);
  const [feePerReturn, setFeePerReturn] = useState(10);

  // Derived calculations
  const monthlyRevenue = returnVolume * feePerReturn;
  const annualRevenue = monthlyRevenue * 12;

  // Additional operational estimates
  // Assuming ~12 min saved per unit triage vs full manual bench teardown
  const technicianHoursSaved = Math.round((returnVolume * 12) / 60);
  // Assuming typical 3.5% component mismatch attempt rate on high-value electronics
  const flaggedFraudUnits = Math.round(returnVolume * 0.035);
  // Average laptop salvage loss prevented (~₹25,000 per swapped unit)
  const estimatedSavingsLakh = Math.round((flaggedFraudUnits * 25000) / 100000);

  // Chart data comparing standard benchmarks
  const chartData = [
    {
      scenario: "50k Returns",
      volume: 50000,
      monthlyRevLakh: (50000 * feePerReturn) / 100000,
      annualRevCrore: ((50000 * feePerReturn * 12) / 10000000).toFixed(2),
      isCurrent: returnVolume === 50000
    },
    {
      scenario: "100k Returns",
      volume: 100000,
      monthlyRevLakh: (100000 * feePerReturn) / 100000,
      annualRevCrore: ((100000 * feePerReturn * 12) / 10000000).toFixed(2),
      isCurrent: returnVolume === 100000
    },
    {
      scenario: "200k Returns",
      volume: 200000,
      monthlyRevLakh: (200000 * feePerReturn) / 100000,
      annualRevCrore: ((200000 * feePerReturn * 12) / 10000000).toFixed(2),
      isCurrent: returnVolume === 200000
    },
    {
      scenario: "Your Custom Slider",
      volume: returnVolume,
      monthlyRevLakh: (returnVolume * feePerReturn) / 100000,
      annualRevCrore: (annualRevenue / 10000000).toFixed(2),
      isCurrent: returnVolume !== 50000 && returnVolume !== 100000 && returnVolume !== 200000
    }
  ];

  const handleApplyPreset = (volume, fee) => {
    setReturnVolume(volume);
    setFeePerReturn(fee);
  };

  return (
    <div className="min-h-screen bg-brand-surface py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-primary text-xs font-bold uppercase tracking-wider mb-3 border border-blue-200">
            <Coins className="w-3.5 h-3.5" />
            <span>B2B Market Model & ROI</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy-950 tracking-tight">
            Sustainable B2B Economics for E-Commerce Protection
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Our flexible software-and-telemetry model aligns directly with marketplace returns volume and reverse logistics infrastructure.
          </p>
        </div>

        {/* Potential Customers & Revenue Sources Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          
          {/* Target Customers */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-soft">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Segment</span>
                <h2 className="text-xl font-bold text-navy-950">Who We Serve (B2B Customers)</h2>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-navy-950 block">E-Commerce Marketplaces</strong>
                  <span className="text-slate-600">High-volume multi-category platforms offering 7-day liberal electronics return policies.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-navy-950 block">Online Electronics Retailers & D2C Brands</strong>
                  <span className="text-slate-600">Specialist sellers of high-value laptops, tablets, smartphones, and camera equipment.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-navy-950 block">Electronics Manufacturers (OEMs)</strong>
                  <span className="text-slate-600">Hardware makers seeking to prevent warranty abuse and fraudulent component claims.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-navy-950 block">Logistics & 3PL Reverse Carriers</strong>
                  <span className="text-slate-600">Couriers and third-party logistics firms seeking to offer value-added doorstep quality verification.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Streams */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-soft">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Monetization Engine</span>
                <h2 className="text-xl font-bold text-navy-950">How Smart Return Verify Earns Revenue</h2>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                  ₹
                </div>
                <div>
                  <strong className="text-navy-950 block">1. Per-Return Verification Fees</strong>
                  <span className="text-slate-600">Transaction-based pricing (₹8 to ₹15 per unit) charged as courier performs doorstep triage.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0">
                  SaaS
                </div>
                <div>
                  <strong className="text-navy-950 block">2. Monthly Platform Subscriptions</strong>
                  <span className="text-slate-600">Tiered monthly platform fee covering dashboard seats, warehouse intake nodes, and analytics.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center shrink-0">
                  API
                </div>
                <div>
                  <strong className="text-navy-950 block">3. Enterprise Integration Plans</strong>
                  <span className="text-slate-600">Custom ERP/WMS API connectors, OEM hardware baseline registry hosting, and dedicated SLAs.</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Interactive Revenue Calculator (Mandatory Section) */}
        <div className="bg-white rounded-3xl border-2 border-blue-200 p-8 sm:p-12 shadow-soft-xl mb-20">
          
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
              Interactive Financial Simulation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-1">
              B2B Revenue & Volume Calculator
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Adjust the sliders or select benchmark presets to project hypothetical monthly and annual revenue for Smart Return Verify.
            </p>
          </div>

          {/* Quick Preset Buttons (50k, 100k, 200k) */}
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Standard Benchmark Scenarios:
            </span>
            <div className="flex flex-wrap gap-3">
              {CALCULATOR_PRESETS.map((preset) => {
                const isSelected = returnVolume === preset.volume && feePerReturn === preset.fee;
                return (
                  <button
                    key={preset.volume}
                    type="button"
                    onClick={() => handleApplyPreset(preset.volume, preset.fee)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{preset.label} @ ₹{preset.fee}/unit</span>
                    <span className="ml-1 opacity-75">({preset.formattedMonthly}/mo)</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Inputs & Outputs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
            
            {/* Input Controls (5 cols) */}
            <div className="lg:col-span-5 space-y-6 bg-slate-50/80 p-6 rounded-2xl border border-slate-200">
              
              {/* Slider 1: Monthly Return Volume */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-navy-950">
                    Returns Verified Per Month
                  </label>
                  <span className="text-sm font-extrabold text-brand-primary font-mono">
                    {returnVolume.toLocaleString('en-IN')} units
                  </span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="300000"
                  step="5000"
                  value={returnVolume}
                  onChange={(e) => setReturnVolume(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>10,000</span>
                  <span>100,000</span>
                  <span>200,000</span>
                  <span>300,000</span>
                </div>
              </div>

              {/* Slider 2: Fee Per Return in INR */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-navy-950">
                    Fee Per Return (Indian Rupees)
                  </label>
                  <span className="text-sm font-extrabold text-indigo-700 font-mono">
                    ₹{feePerReturn} / return
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={feePerReturn}
                  onChange={(e) => setFeePerReturn(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₹5</span>
                  <span>₹10 (Base)</span>
                  <span>₹20</span>
                  <span>₹30</span>
                </div>
              </div>

              {/* Calculated Operation Value Proofs */}
              <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" /> Technician Hours Saved:
                  </span>
                  <span className="font-bold text-navy-950">{technicianHoursSaved.toLocaleString('en-IN')} hrs/mo</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-600" /> Fraud Cases Filtered:
                  </span>
                  <span className="font-bold text-rose-700 font-mono">~{flaggedFraudUnits.toLocaleString('en-IN')} units</span>
                </div>
              </div>

            </div>

            {/* Output Hero Metrics (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Monthly Projected Revenue */}
                <div className="p-6 rounded-2xl bg-gradient-to-tr from-blue-50 to-indigo-50 border border-blue-200 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block">
                      Monthly Projected Revenue
                    </span>
                    <div className="text-3xl sm:text-4xl font-extrabold text-navy-950 mt-2 font-mono">
                      {formatIndianCurrency(monthlyRevenue)}
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-3 block">
                    Calculated at {returnVolume.toLocaleString('en-IN')} returns × ₹{feePerReturn}
                  </span>
                </div>

                {/* Annual Projected Revenue */}
                <div className="p-6 rounded-2xl bg-gradient-to-tr from-indigo-50 to-purple-50 border border-indigo-200 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 block">
                      Annual Projected Revenue
                    </span>
                    <div className="text-3xl sm:text-4xl font-extrabold text-navy-950 mt-2 font-mono">
                      {formatIndianCurrency(annualRevenue)}
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-3 block">
                    Annualized 12-month run rate projection
                  </span>
                </div>
              </div>

              {/* Responsive Bar Chart Visualization */}
              <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
                  Scenario Revenue Comparison (in ₹ Lakhs/Month)
                </span>
                
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="scenario" tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit="L" />
                      <Tooltip 
                        formatter={(val) => [`₹${val} Lakh / month`, 'Projected Revenue']}
                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                      />
                      <Bar dataKey="monthlyRevLakh" radius={[6, 6, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.isCurrent ? '#2563eb' : '#94a3b8'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

          </div>

          {/* Mandatory Explicit Disclaimer */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Disclaimer on Financial Projections:</span> All figures, savings estimates, and revenue projections calculated above represent illustrative hypothetical scenarios based on prototype parameters. They do not represent guaranteed commercial revenue, enterprise profitability, or binding financial contracts.
            </div>
          </div>

        </div>

        {/* Pricing Tiers Table */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-navy-950">
              Commercial Engagement Plans
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Select the right verification tier for your retail volume.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`bg-white rounded-2xl border p-8 shadow-soft flex flex-col justify-between ${
                  tier.highlight ? 'border-brand-primary ring-2 ring-blue-500/20' : 'border-slate-200'
                }`}
              >
                <div>
                  {tier.badge && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-brand-primary mb-3">
                      {tier.badge}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-navy-950 mb-2">{tier.name}</h3>
                  <p className="text-xs text-slate-500 mb-4">{tier.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-2xl font-extrabold text-navy-950">{tier.rate}</span>
                    <span className="text-xs text-slate-500 block">{tier.unit}</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                    {tier.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/contact"
                  className={`w-full py-2.5 rounded-xl text-center text-xs font-bold transition-all ${
                    tier.highlight
                      ? 'bg-brand-primary text-white hover:bg-blue-700 shadow-sm'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
