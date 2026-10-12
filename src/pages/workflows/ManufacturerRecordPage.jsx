import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ArrowLeft, 
  Database, 
  Cpu, 
  BatteryCharging, 
  ShieldCheck, 
  FileCode2, 
  CheckCircle2, 
  Layers, 
  Lock, 
  QrCode,
  Download,
  AlertCircle
} from 'lucide-react';
import { SAMPLE_LAPTOP_RECORD } from '../../data/mockData';
import { Badge } from '../../components/common/Badge';

export const ManufacturerRecordPage = () => {
  const [showRawJson, setShowRawJson] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadCertificate = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-brand-surface py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/#how-it-works"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Workflow Overview</span>
          </Link>

          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Workflow Pillar 01
          </span>
        </div>

        {/* Header Title */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
                Original Product Record (OEM Baseline)
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                "The manufacturer records the original product information."
              </p>
            </div>
          </div>
          
          {/* Fictional Demo Disclaimer */}
          <div className="mt-4 p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Prototype Demonstration Data:</span> All product IDs, serial numbers, cryptographic certificates, and battery telemetry listed on this page represent simulated fictional data for testing the Smart Return Verify system architecture.
            </div>
          </div>
        </div>

        {/* Diagram: Manufacturer enrolling original specs into secure database */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-soft mb-10">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6 flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            <span>Manufacturing Baseline Enrollment Pipeline</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mb-3">
                  01
                </div>
                <h3 className="text-sm font-bold text-navy-950 mb-1">Factory Calibration</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  During assembly, OEM flashing jigs record the battery microcontroller ID, nominal capacity, firmware cryptographic signature, and chassis Torx screw torque metrics.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-mono text-slate-500">
                Captured: AeroCell 92.4 Wh
              </div>
            </div>

            <div className="p-5 rounded-xl bg-blue-50/60 border border-blue-200 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm mb-3">
                  02
                </div>
                <h3 className="text-sm font-bold text-navy-950 mb-1">Cryptographic Fingerprinting</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Hardware telemetry attributes are hashed with SHA-256 and signed with the OEM's hardware security module (HSM) private key to create an unforgeable baseline.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-blue-200 text-[11px] font-mono text-blue-700 truncate">
                Hash: sha256:7e8a93bf...
              </div>
            </div>

            <div className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-200 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm mb-3">
                  03
                </div>
                <h3 className="text-sm font-bold text-navy-950 mb-1">Secure Baseline Vault</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The verified record is stored in the Smart Return Verify registry, accessible to authorized reverse-logistics hubs and warehouse forensics teams during return claims.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-200 text-[11px] font-semibold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Status: Stored & Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Laptop Record Showcase */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden mb-10">
          
          {/* Card Header Bar */}
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Sample Record
              </span>
              <h2 className="text-xl font-bold text-navy-950 flex items-center gap-2">
                <span>{SAMPLE_LAPTOP_RECORD.productName}</span>
                <Badge status="stored" size="sm">
                  {SAMPLE_LAPTOP_RECORD.recordStatus}
                </Badge>
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowRawJson(!showRawJson)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <FileCode2 className="w-3.5 h-3.5 text-blue-600" />
                <span>{showRawJson ? "View Clean Table" : "View Raw JSON"}</span>
              </button>

              <button
                onClick={handleDownloadCertificate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900 text-white text-xs font-semibold hover:bg-navy-800 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-blue-300" />
                <span>{downloadSuccess ? "Certificate Saved!" : "Export Certificate"}</span>
              </button>
            </div>
          </div>

          {/* Clean View vs JSON View */}
          {showRawJson ? (
            <div className="p-6 bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto">
              <pre>{JSON.stringify(SAMPLE_LAPTOP_RECORD, null, 2)}</pre>
            </div>
          ) : (
            <div className="p-6 sm:p-8 space-y-8">
              
              {/* Primary Identifiers Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-xl bg-blue-50/40 border border-blue-100">
                <div>
                  <span className="text-xs font-medium text-slate-500 block">Product ID</span>
                  <span className="text-sm font-bold text-navy-950 font-mono mt-0.5 block">
                    {SAMPLE_LAPTOP_RECORD.productId}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500 block">Serial Number</span>
                  <span className="text-sm font-bold text-navy-950 font-mono mt-0.5 block">
                    {SAMPLE_LAPTOP_RECORD.serialNumber}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500 block">Battery Reference</span>
                  <span className="text-sm font-bold text-navy-950 font-mono mt-0.5 block">
                    {SAMPLE_LAPTOP_RECORD.batteryReference}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500 block">Record Status</span>
                  <span className="text-sm font-bold text-emerald-700 font-mono mt-0.5 block">
                    {SAMPLE_LAPTOP_RECORD.recordStatus} (Secure Vault)
                  </span>
                </div>
              </div>

              {/* Two Column Breakdown: Core Specs & Battery Baseline */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Column 1: Original Hardware Specifications */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                    <Cpu className="w-4 h-4 text-blue-600" />
                    <span>Original Hardware Specifications</span>
                  </h3>

                  <div className="space-y-2.5 text-xs sm:text-sm">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Processor / SoC</span>
                      <span className="font-semibold text-slate-900">{SAMPLE_LAPTOP_RECORD.specs.processor}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">RAM Configuration</span>
                      <span className="font-semibold text-slate-900">{SAMPLE_LAPTOP_RECORD.specs.ram}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Storage Telemetry</span>
                      <span className="font-semibold text-slate-900">{SAMPLE_LAPTOP_RECORD.specs.storage}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Display Panel</span>
                      <span className="font-semibold text-slate-900">{SAMPLE_LAPTOP_RECORD.specs.display}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Chassis & Fasteners</span>
                      <span className="font-semibold text-slate-900">{SAMPLE_LAPTOP_RECORD.specs.chassis}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Calibrated Weight</span>
                      <span className="font-semibold text-slate-900">{SAMPLE_LAPTOP_RECORD.specs.grossWeight}</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Battery & Diagnostic Telemetry */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                    <BatteryCharging className="w-4 h-4 text-emerald-600" />
                    <span>Battery & Diagnostic Telemetry</span>
                  </h3>

                  <div className="space-y-2.5 text-xs sm:text-sm">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Battery Model</span>
                      <span className="font-semibold text-slate-900">{SAMPLE_LAPTOP_RECORD.batterySpecs.model}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Expected Battery Serial</span>
                      <span className="font-mono font-bold text-blue-700">{SAMPLE_LAPTOP_RECORD.batterySpecs.serialNumber}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Factory Design Capacity</span>
                      <span className="font-semibold text-slate-900">{SAMPLE_LAPTOP_RECORD.batterySpecs.designCapacity}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Microcontroller IC</span>
                      <span className="font-mono text-slate-900">{SAMPLE_LAPTOP_RECORD.batterySpecs.microcontrollerId}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Factory Cycle Count</span>
                      <span className="font-semibold text-emerald-700">{SAMPLE_LAPTOP_RECORD.batterySpecs.factoryCycleCount} (Brand New)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Firmware Signature</span>
                      <span className="font-mono text-xs text-slate-700 truncate max-w-[200px]">
                        {SAMPLE_LAPTOP_RECORD.batterySpecs.firmwareSignature}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Cryptographic Reference Strip */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Manufacturer Reference Certificate: {SAMPLE_LAPTOP_RECORD.digitalCertificateId}</span>
                  </div>
                  <div className="font-mono text-slate-500 break-all">
                    Fingerprint Hash: {SAMPLE_LAPTOP_RECORD.tamperProofHash}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-slate-400">Enrolled: {new Date(SAMPLE_LAPTOP_RECORD.timestampEnrolled).toLocaleDateString()}</span>
                </div>
              </div>

            </div>
          )}

          {/* Action Footer */}
          <div className="p-6 bg-slate-50/80 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/#how-it-works"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Workflow</span>
            </Link>

            <Link
              to="/workflow/doorstep-screening"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
            >
              <span>Next: Step 2 — Doorstep AI Screening →</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
