import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Smartphone, 
  Warehouse, 
  ShieldCheck, 
  RotateCcw, 
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AgentDashboard } from '../components/dashboards/AgentDashboard';
import { WarehouseDashboard } from '../components/dashboards/WarehouseDashboard';
import { AdminDashboard } from '../components/dashboards/AdminDashboard';

export const DashboardPage = () => {
  const { currentUser, loginAsRole, resetDemoData } = useAuth();
  
  // Default to user's role or 'delivery_agent' if not logged in
  const [activeRoleKey, setActiveRoleKey] = useState(
    currentUser?.roleKey || 'delivery_agent'
  );

  const handleRoleTabClick = (roleKey) => {
    setActiveRoleKey(roleKey);
    loginAsRole(roleKey);
  };

  return (
    <div className="min-h-screen bg-brand-surface py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Control Bar with 3-Role Quick Switcher */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-soft mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Persona:
            </span>
            <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs">
              <button
                type="button"
                onClick={() => handleRoleTabClick('delivery_agent')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  activeRoleKey === 'delivery_agent'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-navy-950'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                <span>Delivery Agent</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleTabClick('warehouse_staff')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  activeRoleKey === 'warehouse_staff'
                    ? 'bg-white text-purple-700 shadow-xs'
                    : 'text-slate-600 hover:text-navy-950'
                }`}
              >
                <Warehouse className="w-3.5 h-3.5 text-purple-600" />
                <span>Warehouse Staff</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleTabClick('company_admin')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  activeRoleKey === 'company_admin'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-navy-950'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Company Admin</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <span className="text-[11px] text-slate-400">
              Prototype Persona Simulation
            </span>
            <button
              type="button"
              onClick={resetDemoData}
              className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-rose-600 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 transition-colors"
              title="Reset sample queue to baseline defaults"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Demo State</span>
            </button>
          </div>

        </div>

        {/* Dynamic Render of Active Dashboard */}
        {activeRoleKey === 'delivery_agent' && <AgentDashboard />}
        {activeRoleKey === 'warehouse_staff' && <WarehouseDashboard />}
        {activeRoleKey === 'company_admin' && <AdminDashboard />}

      </div>
    </div>
  );
};
