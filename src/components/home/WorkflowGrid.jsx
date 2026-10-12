import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Smartphone, 
  Lock, 
  Warehouse, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const WorkflowGrid = () => {
  const cards = [
    {
      id: "card-1",
      number: "01",
      title: "Original Product Record",
      tagline: "The manufacturer records the original product information.",
      link: "/workflow/manufacturer-record",
      icon: Building2,
      accent: "from-blue-500 to-blue-600",
      borderHover: "hover:border-blue-400",
      badge: "OEM Baseline Registry",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      features: [
        "Cryptographically bound serial & part numbers",
        "Original factory battery telemetry baseline",
        "Factory torque & chassis screw fingerprints",
        "Stored securely before retail distribution"
      ],
      sampleTag: "Sample: AeroBook Pro 15 (SRV-LAP-1001)"
    },
    {
      id: "card-2",
      number: "02",
      title: "Doorstep AI Screening",
      tagline: "The delivery agent performs a simple first-level check.",
      link: "/workflow/doorstep-screening",
      icon: Smartphone,
      accent: "from-indigo-500 to-indigo-600",
      borderHover: "hover:border-indigo-400",
      badge: "Agent Mobile Interface",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
      features: [
        "Designed for agents without technical engineering skills",
        "Non-invasive optical screw inspection",
        "Quick USB-C diagnostic handshake",
        "Instant YES / NO routing recommendation"
      ],
      sampleTag: "Two Demo Scenarios: Genuine vs Swapped Battery"
    },
    {
      id: "card-3",
      number: "03",
      title: "Secure Digital Handoff",
      tagline: "Return information is encrypted before transfer.",
      link: "/workflow/secure-handoff",
      icon: Lock,
      accent: "from-purple-500 to-purple-600",
      borderHover: "hover:border-purple-400",
      badge: "AES-256 + HMAC Integrity",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      features: [
        "End-to-end payload encryption in transit",
        "HMAC-SHA256 tampering detection tag",
        "Encrypted photos & device telemetry",
        "Auditable chain of custody with timestamp"
      ],
      sampleTag: "Interactive: Live Plaintext ↔ Ciphertext Simulator"
    },
    {
      id: "card-4",
      number: "04",
      title: "Warehouse Verification",
      tagline: "The warehouse performs deeper verification.",
      link: "/workflow/warehouse-verification",
      icon: Warehouse,
      accent: "from-emerald-500 to-emerald-600",
      borderHover: "hover:border-emerald-400",
      badge: "Deep Forensics Dashboard",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      features: [
        "Side-by-side component discrepancy comparator",
        "Highlights mismatched battery serials & cycles",
        "Authoritative technician inspection reports",
        "Verified / Suspicious / Inconclusive statuses"
      ],
      sampleTag: "Interactive: Side-by-Side Record Comparison"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-brand-surface border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Interactive Workflow Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
            Explore the 4 Pillars of Return Verification
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Click any workflow card below to explore its live interactive prototype, test simulated test cases, and inspect raw telemetry.
          </p>
        </div>

        {/* 4 Large Workflow Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className={`group relative bg-white rounded-2xl border border-slate-200 p-8 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft-xl ${card.borderHover} flex flex-col justify-between`}
              >
                <div>
                  {/* Top Bar with Number, Icon, and Badge */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${card.accent} flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform`}>
                        <Icon className="w-7 h-7 stroke-[2]" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          Pillar {card.number}
                        </span>
                        <h3 className="text-xl font-bold text-navy-950 group-hover:text-brand-primary transition-colors">
                          {card.title}
                        </h3>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  </div>

                  {/* Short Card Text (Mandatory Requirement) */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 mb-6">
                    <p className="text-sm font-semibold text-slate-800 leading-relaxed italic">
                      "{card.tagline}"
                    </p>
                  </div>

                  {/* Bullet Points */}
                  <ul className="space-y-2.5 mb-6">
                    {card.features.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer with Sample Tag and Direct Button */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <span className="text-xs font-medium text-slate-500">
                    {card.sampleTag}
                  </span>

                  <Link
                    to={card.link}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-brand-primary transition-colors shadow-sm group-hover:shadow"
                  >
                    <span>Open Detailed Workflow</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
