import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Building2, 
  User, 
  Eye, 
  EyeOff, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    roleKey: 'delivery_agent',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Full name is required";
    if (!formData.company.trim()) errs.company = "Company name is required";
    if (!formData.email.trim()) {
      errs.email = "Business email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      errs.password = "Password is required";
    } else if (formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }
    return errs;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    registerUser(formData);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-brand-surface py-16 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        
        {/* Header */}
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
            Create Business Account
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Register your organization for AI-assisted return verification
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-soft">
          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vikram Sharma"
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm outline-none ${
                    errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 focus:border-brand-primary'
                  }`}
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
              {errors.name && <p className="text-rose-600 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Company Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Company Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. SwiftLog Express"
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm outline-none ${
                      errors.company ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 focus:border-brand-primary'
                    }`}
                  />
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
                {errors.company && <p className="text-rose-600 text-xs mt-1">{errors.company}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Business Email *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm outline-none ${
                      errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 focus:border-brand-primary'
                    }`}
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
                {errors.email && <p className="text-rose-600 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Role Selection (Mandatory Requirement) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Your System Role *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { key: 'delivery_agent', label: 'Delivery Agent', desc: 'Doorstep Triage' },
                  { key: 'warehouse_staff', label: 'Warehouse Staff', desc: 'Forensics & Compare' },
                  { key: 'company_admin', label: 'Company Administrator', desc: 'Analytics & KPIs' },
                ].map((role) => (
                  <button
                    key={role.key}
                    type="button"
                    onClick={() => setFormData({ ...formData, roleKey: role.key })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formData.roleKey === role.key
                        ? 'border-brand-primary bg-blue-50/70 ring-1 ring-brand-primary text-navy-950 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block text-xs">{role.label}</span>
                    <span className="block text-[10px] text-slate-400 font-normal mt-0.5">{role.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min 6 chars"
                    className={`w-full pl-9 pr-8 py-2.5 rounded-xl border text-sm outline-none font-mono ${
                      errors.password ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 focus:border-brand-primary'
                    }`}
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-slate-600 absolute right-2.5 top-2.5"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {errors.password && <p className="text-rose-600 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm outline-none font-mono ${
                      errors.confirmPassword ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 focus:border-brand-primary'
                    }`}
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
                {errors.confirmPassword && <p className="text-rose-600 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 mt-2"
            >
              Create Account & Launch Dashboard
            </button>

          </form>

          {/* Login Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-brand-primary hover:underline">
              Sign In
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
