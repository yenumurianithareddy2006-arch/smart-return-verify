import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Building2, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Clock, 
  MapPin,
  Sparkles
} from 'lucide-react';
import { Modal } from '../components/common/Modal';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Full name is required";
    if (!formData.company.trim()) errs.company = "Company name is required";
    if (!formData.email.trim()) {
      errs.email = "Business email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address";
    }
    if (!formData.message.trim()) errs.message = "Message or inquiry details are required";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    // Simulate transmission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setShowDemoModal(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-brand-surface py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-primary text-xs font-bold uppercase tracking-wider mb-3 border border-blue-200">
            <Mail className="w-3.5 h-3.5" />
            <span>Enterprise Triage Partnerships</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy-950 tracking-tight">
            Schedule an Enterprise Pilot Demo
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Connect with our engineering and logistics solutions team to evaluate Smart Return Verify on your returns volume.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Contact & Demo Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-soft">
            <h2 className="text-xl font-bold text-navy-950 mb-2">
              Request a Guided Architecture Walkthrough
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Complete the details below to test our diagnostic dongle SDK and warehouse forensics queue.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Ramesh Gupta"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
                    errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-brand-primary'
                  }`}
                />
                {errors.name && <p className="text-rose-600 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Company & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. SwiftLog Fleet or Apex Marketplaces"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
                      errors.company ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-brand-primary'
                    }`}
                  />
                  {errors.company && <p className="text-rose-600 text-xs mt-1">{errors.company}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
                      errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-brand-primary'
                    }`}
                  />
                  {errors.email && <p className="text-rose-600 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Phone (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 (Optional)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-brand-primary"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message / Returns Scope *
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share your monthly returns volume, device categories, or reverse logistics requirements..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
                    errors.message ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-brand-primary'
                  }`}
                />
                {errors.message && <p className="text-rose-600 text-xs mt-1">{errors.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-brand-primary text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Submitting Demo Request...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Request a Demo</span>
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Prototype Guidance & Pilot FAQs (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-soft">
              <h3 className="text-base font-bold text-navy-950 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-brand-primary" />
                <span>Transparent Prototype Disclosure</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                This website is an interactive technology prototype demonstrating our proposed reverse-logistics fraud prevention architecture.
                <br /><br />
                Submissions from this form are processed locally inside the browser simulation and are not transmitted to a live company email server.
              </p>
            </div>

            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pilot Engagement Highlights
              </h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>14-Day Lab Pilot:</strong> Test sample OEM laptop baselines against synthetic battery-swapped test returns.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Courier Usability Check:</strong> Delivery agents evaluate the YES/NO binary interface under field conditions.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Forensics Integration:</strong> Plug into warehouse intake scanners with zero disruption to existing logistics.</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Demo Confirmation Modal (Mandatory Requirement) */}
      <Modal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        title="Demo Request Received (Prototype Simulation)"
      >
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sm">Thank you, {formData.name || "Partner"}!</strong>
              Your demo request for <strong>{formData.company || "Your Company"}</strong> has been recorded in the prototype state.
            </div>
          </div>

          <div className="p-3.5 bg-blue-50 text-blue-900 rounded-xl border border-blue-200 text-xs">
            <strong>System Disclosure:</strong> Because this prototype operates in demo mode, no email has been sent to a live corporate inbox. You can continue exploring all active dashboards, the revenue calculator, and interactive encryption simulations immediately.
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setShowDemoModal(false)}
              className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-blue-700"
            >
              Continue Exploring Demo
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
