import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  UserCheck, 
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS } from '../data/mockData';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  
  const { loginWithCredentials, loginAsRole } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your business email.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    loginWithCredentials(email, password, rememberMe);
    navigate('/dashboard');
  };

  const handleQuickDemoRole = (roleKey) => {
    loginAsRole(roleKey);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-brand-surface py-16 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        
        {/* Top Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-indigo-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-navy-950">
              Smart Return<span className="text-brand-primary"> Verify</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-navy-950">
            Sign In to Verify Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access doorstep triage, warehouse forensics, or enterprise executive dashboards
          </p>
        </div>

        {/* 1-Click Demo Quick Logins Strip (Prototype Accessibility) */}
        <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              1-Click Demo Personas (No Password Needed)
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoRole('delivery_agent')}
              className="p-2 rounded-xl bg-white border border-blue-200 text-left hover:border-blue-400 hover:shadow-sm transition-all"
            >
              <span className="block text-[11px] font-bold text-navy-900">Agent</span>
              <span className="block text-[10px] text-slate-400 truncate">Vikram S.</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoRole('warehouse_staff')}
              className="p-2 rounded-xl bg-white border border-purple-200 text-left hover:border-purple-400 hover:shadow-sm transition-all"
            >
              <span className="block text-[11px] font-bold text-navy-900">Warehouse</span>
              <span className="block text-[10px] text-slate-400 truncate">Priya M.</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoRole('company_admin')}
              className="p-2 rounded-xl bg-white border border-emerald-200 text-left hover:border-emerald-400 hover:shadow-sm transition-all"
            >
              <span className="block text-[11px] font-bold text-navy-900">Admin</span>
              <span className="block text-[10px] text-slate-400 truncate">Dr. Ananya</span>
            </button>
          </div>
        </div>

        {/* Traditional Login Form */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-soft">
          <form onSubmit={handleLogin} className="space-y-4">
            
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Business Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. vikram.agent@swiftlog.in"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-brand-primary"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            {/* Password with Show/Hide */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Password *
                </label>
                <a 
                  href="#forgot" 
                  onClick={(e) => { e.preventDefault(); alert("Demo Mode: For testing, enter any password >= 6 characters or tap a 1-Click persona above."); }}
                  className="text-[11px] text-brand-primary hover:underline font-medium"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-brand-primary font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 absolute right-3 top-2.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-primary border-slate-300"
                />
                <span>Remember this workstation</span>
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
            >
              Sign In to Dashboard
            </button>

          </form>

          {/* Registration Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have a corporate account?{' '}
            <Link to="/register" className="font-bold text-brand-primary hover:underline">
              Create an account
            </Link>
          </div>
        </div>

        {/* Prototype Architecture Disclaimer */}
        <div className="p-3.5 rounded-xl bg-slate-100 text-slate-500 text-[11px] leading-relaxed text-center">
          <strong>Security Notice:</strong> Prototype environment with fictional demo authentication. Passwords are not stored in plaintext, and genuine SSO (OAuth2 / SAML) can be plugged in for enterprise production.
        </div>

      </div>
    </div>
  );
};
