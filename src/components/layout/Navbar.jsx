import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Menu, 
  X, 
  User, 
  ChevronDown, 
  LayoutDashboard, 
  LogOut, 
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const { currentUser, loginAsRole, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'The Problem', path: '/problem' },
    { label: 'Our Solution', path: '/solution' },
    { label: 'Features', path: '/features' },
    { label: 'Business Model', path: '/business-model' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleRoleQuickSelect = (roleKey) => {
    loginAsRole(roleKey);
    setRoleDropdownOpen(false);
    navigate('/dashboard');
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-primary via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-navy-950 font-sans">
                  Smart Return<span className="text-brand-primary"> Verify</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-brand-primary border border-blue-200/60">
                  Demo
                </span>
              </div>
              <p className="hidden md:block text-[11px] font-medium text-slate-500 tracking-wide">
                Detect Early. Protect Data. Verify Returns.
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive(link.path)
                    ? 'text-brand-primary bg-blue-50/80'
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action CTAs & Auth Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                title="Switch demo persona"
              >
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span className="max-w-[120px] truncate">
                  {currentUser ? currentUser.roleName : "Demo Roles"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-soft-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-2 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    Instant Persona Switch
                  </div>
                  <button
                    onClick={() => handleRoleQuickSelect('delivery_agent')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-brand-primary flex items-center justify-between"
                  >
                    <span>Delivery Agent</span>
                    <span className="text-[10px] text-slate-400">Vikram S.</span>
                  </button>
                  <button
                    onClick={() => handleRoleQuickSelect('warehouse_staff')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center justify-between"
                  >
                    <span>Warehouse Staff</span>
                    <span className="text-[10px] text-slate-400">Priya M.</span>
                  </button>
                  <button
                    onClick={() => handleRoleQuickSelect('company_admin')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-between"
                  >
                    <span>Company Administrator</span>
                    <span className="text-[10px] text-slate-400">Dr. Ananya</span>
                  </button>
                </div>
              )}
            </div>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-navy-900 text-white text-xs font-semibold hover:bg-navy-800 transition-colors shadow-sm"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Logout session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-brand-primary hover:bg-slate-100/80 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-primary text-white text-xs font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/15"
                >
                  <span>Get a Demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-navy-950 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
                  isActive(link.path)
                    ? 'text-brand-primary bg-blue-50'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center rounded-lg bg-navy-900 text-white text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-blue-400" />
                  <span>Go to Dashboard ({currentUser.roleName})</span>
                </Link>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full py-2 text-center text-xs text-rose-600 hover:underline"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                >
                  Login
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-blue-700"
                >
                  Get a Demo
                </Link>
              </>
            )}

            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Quick Demo Persona:
              </span>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => { handleRoleQuickSelect('delivery_agent'); setMobileMenuOpen(false); }}
                  className="px-2 py-1 text-[11px] rounded bg-blue-50 text-blue-700 font-medium"
                >
                  Agent
                </button>
                <button
                  onClick={() => { handleRoleQuickSelect('warehouse_staff'); setMobileMenuOpen(false); }}
                  className="px-2 py-1 text-[11px] rounded bg-purple-50 text-purple-700 font-medium"
                >
                  Warehouse
                </button>
                <button
                  onClick={() => { handleRoleQuickSelect('company_admin'); setMobileMenuOpen(false); }}
                  className="px-2 py-1 text-[11px] rounded bg-emerald-50 text-emerald-700 font-medium"
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
