/**
 * Smart Return Verify - Prototype Mock Data
 * Realistic fictional records for demonstration purposes.
 * Note: Clearly disclaimed across all views as prototype simulation data.
 */

export const SAMPLE_LAPTOP_RECORD = {
  productId: "SRV-LAP-1001",
  productName: "AeroBook Pro 15 (Model AB-2024)",
  serialNumber: "DEMO-SN-001",
  batteryReference: "BAT-REF-001",
  recordStatus: "Stored",
  manufacturer: "AeroTech MicroSystems Ltd.",
  mfgDate: "2024-03-15",
  batchLot: "LOT-IND-24-08",
  specs: {
    processor: "Octa-Core Pro-X 4.2GHz",
    ram: "32 GB LPDDR5X (Soldered OEM)",
    storage: "1 TB NVMe Gen4 (Cryptographically Bound)",
    display: "15.6\" 3.2K OLED 120Hz Calibrated",
    chassis: "CNC Machined Aerospace Aluminum, Torx T5 Security Fasteners",
    grossWeight: "1.48 kg (± 5g tolerance)",
  },
  batterySpecs: {
    model: "AeroCell Ultra 6-Cell Lithium Polymer",
    serialNumber: "BAT-OEM-882194-A",
    nominalVoltage: "15.4 V",
    designCapacity: "92.4 Wh (6000 mAh)",
    firmwareSignature: "0x8F94...Valid_SHA256_OEM",
    microcontrollerId: "TI-BQ40Z50-V3",
    factoryCycleCount: 0,
    healthBaseline: "100%",
  },
  tamperProofHash: "sha256:7e8a93bf62d98c21a415b3941bce82e6d182046ad3918a2872bc0b784df0021a",
  digitalCertificateId: "CERT-OEM-SRV-2024-09941",
  timestampEnrolled: "2024-03-15T09:20:00Z"
};

export const DOORSTEP_SCENARIOS = {
  genuine: {
    key: "genuine",
    title: "Scenario A: Genuine Laptop (No Tampering)",
    subtitle: "Original battery and chassis fasteners completely intact",
    returnId: "RET-2024-88415",
    productId: "SRV-LAP-1001",
    serialNumber: "DEMO-SN-001",
    screwChassisStatus: "Intact Torx T5 fasteners, zero tool head deformation or micro-burring detected",
    opticalScore: 0.04, // 0 to 1 scale
    dongleDiagnosticStatus: "OEM Telemetry Handshake Successful",
    batteryTelemetry: {
      reportedSerial: "BAT-OEM-882194-A",
      expectedSerial: "BAT-OEM-882194-A",
      match: true,
      cycleCount: 14,
      factoryCapacity: "92.4 Wh",
      currentCapacity: "91.8 Wh",
      firmwareSignature: "0x8F94...Valid_SHA256_OEM (Verified)"
    },
    verdict: "YES",
    verdictTitle: "YES — NO OBVIOUS ISSUE DETECTED",
    verdictType: "verified",
    recommendation: "Accept return at doorstep. Route device to standard automated restocking stream.",
    notes: "Diagnostic handshake with USB-C screening dongle confirmed OEM battery serial and cryptographic signature match manufacturer baseline."
  },
  tampered: {
    key: "tampered",
    title: "Scenario B: Swapped Battery (Counterfeit / Degraded Generic)",
    subtitle: "Internal battery swapped with non-genuine clone; external casing closed",
    returnId: "RET-2024-88412",
    productId: "SRV-LAP-1001",
    serialNumber: "DEMO-SN-001",
    screwChassisStatus: "Optical warning: 4 Torx screw heads show microscopic burring and driver slipping marks",
    opticalScore: 0.89, // High suspicion
    dongleDiagnosticStatus: "Warning: Microcontroller Handshake Inconsistency",
    batteryTelemetry: {
      reportedSerial: "BAT-GENERIC-990-CLONE",
      expectedSerial: "BAT-OEM-882194-A",
      match: false,
      cycleCount: 462,
      factoryCapacity: "92.4 Wh",
      currentCapacity: "48.2 Wh (Degraded Clone)",
      firmwareSignature: "0x0000...Invalid / Third-party Clone"
    },
    verdict: "NO",
    verdictTitle: "NO — SUSPICIOUS. SEND TO WAREHOUSE.",
    verdictType: "suspicious",
    recommendation: "Do not issue immediate automatic refund. Tag high-priority barcode and route to Deep Warehouse Forensics.",
    notes: "Optical analysis detected stripped Torx screw heads. Diagnostic telemetry revealed generic clone battery with mismatched serial number and 462 heavy cycles (expected < 20)."
  }
};

export const SECURITY_SIMULATION_RECORD = {
  returnId: "RET-2024-88412",
  productId: "SRV-LAP-1001",
  serialNumber: "DEMO-SN-001",
  agentId: "AGENT-HYD-041",
  agentName: "Vikram Sharma",
  timestamp: "2024-10-09T14:22:18Z",
  screeningResult: "NO_SUSPICIOUS_BATTERY",
  opticalTamperScore: 0.89,
  batterySerialReported: "BAT-GENERIC-990-CLONE",
  evidenceImageRef: "ipfs://bafybeic7...evidence-lap-burring.jpg",
  warehouseDestination: "WH-BLR-CENTRAL-01"
};

export const WAREHOUSE_RETURNS = [
  {
    id: "RET-2024-88412",
    productRef: "SRV-LAP-1001",
    productName: "AeroBook Pro 15 (SN: DEMO-SN-001)",
    doorstepResult: "NO — Suspicious",
    doorstepAgent: "Vikram Sharma (AGENT-HYD-041)",
    transferSecurity: "AES-256 Encrypted • HMAC Valid",
    arrivalDate: "Today, 11:20 AM",
    status: "Suspicious — Further Inspection",
    statusType: "suspicious",
    batteryExpected: "BAT-OEM-882194-A",
    batteryFound: "BAT-GENERIC-990-CLONE",
    weightDelta: "-42 grams vs OEM spec",
    technicianAssigned: "Priya Menon",
    notes: "Physical battery removal confirmed generic 3rd-party label pasted over degraded cells."
  },
  {
    id: "RET-2024-88415",
    productRef: "SRV-LAP-1001",
    productName: "AeroBook Pro 15 (SN: DEMO-SN-002)",
    doorstepResult: "YES — No Issue",
    doorstepAgent: "Amit Roy (AGENT-DEL-019)",
    transferSecurity: "AES-256 Encrypted • HMAC Valid",
    arrivalDate: "Today, 09:45 AM",
    status: "Verified",
    statusType: "verified",
    batteryExpected: "BAT-OEM-882194-A",
    batteryFound: "BAT-OEM-882194-A",
    weightDelta: "+2 grams (Within tolerance)",
    technicianAssigned: "Sunil K.",
    notes: "Internal diagnostic and optical chassis check completed. Unit cleared for repackaging."
  },
  {
    id: "RET-2024-88419",
    productRef: "SRV-LAP-1003",
    productName: "AeroBook Studio 16 (SN: SN-AS16-4401)",
    doorstepResult: "NO — Dongle Error",
    doorstepAgent: "Pooja V. (AGENT-MUM-088)",
    transferSecurity: "AES-256 Encrypted • HMAC Valid",
    arrivalDate: "Yesterday, 04:15 PM",
    status: "Inconclusive — More Evidence Needed",
    statusType: "inconclusive",
    batteryExpected: "BAT-OEM-991040-B",
    batteryFound: "Diagnostic Port Corroded (Read Timeout)",
    weightDelta: "Pending lab scale measurement",
    technicianAssigned: "Priya Menon",
    notes: "Device will not power on; technician scheduled for board-level test jig on Bench 4."
  },
  {
    id: "RET-2024-88421",
    productRef: "SRV-TAB-5002",
    productName: "ProTab 11 Gen 3 (SN: SN-PT-3329)",
    doorstepResult: "YES — No Issue",
    doorstepAgent: "Karan Johar (AGENT-BLR-012)",
    transferSecurity: "AES-256 Encrypted • HMAC Valid",
    arrivalDate: "Yesterday, 02:30 PM",
    status: "Verified",
    statusType: "verified",
    batteryExpected: "BAT-TAB-ORIGINAL-80",
    batteryFound: "BAT-TAB-ORIGINAL-80",
    weightDelta: "0 grams delta",
    technicianAssigned: "Deepak S.",
    notes: "Serial matched, OEM display original, cleared for tier-1 resale."
  }
];

export const COMPARISON_SAMPLE = {
  originalRecord: {
    productId: "DEMO-LAP-001",
    model: "AeroBook Pro 15 (AB-2024)",
    batteryRef: "BAT-ORIGINAL",
    serialNumber: "DEMO-SN-001",
    capacity: "92.4 Wh",
    cycleCount: "0 - 15 (Factory Normal)",
    firmwareSignature: "0x8F94...Valid_OEM",
    screwCondition: "Factory Torque Set (Pristine)",
    grossWeight: "1480 grams"
  },
  returnedProduct: {
    productId: "DEMO-LAP-001",
    model: "AeroBook Pro 15 (AB-2024)",
    batteryRef: "BAT-DIFFERENT",
    serialNumber: "DEMO-SN-001",
    capacity: "48.2 Wh (Severely Degraded)",
    cycleCount: "462 Cycles (Heavy Usage)",
    firmwareSignature: "0x0000...Invalid / Cloned",
    screwCondition: "Burred / Stripped Torx Head",
    grossWeight: "1438 grams (-42g discrepancy)"
  },
  discrepancies: [
    { field: "Battery Reference", expected: "BAT-ORIGINAL", observed: "BAT-DIFFERENT", severity: "CRITICAL" },
    { field: "Capacity", expected: "92.4 Wh", observed: "48.2 Wh", severity: "HIGH" },
    { field: "Cycle Count", expected: "< 20 Cycles", observed: "462 Cycles", severity: "CRITICAL" },
    { field: "Firmware Signature", expected: "OEM Cryptographic Match", observed: "Generic / Failed Handshake", severity: "CRITICAL" },
    { field: "Chassis Fasteners", expected: "Pristine Factory Fasteners", observed: "Micro-burring & Screwdriver Slipping", severity: "HIGH" }
  ],
  decision: "Further Inspection — Flagged for Counterfeit Swapping"
};

export const DEMO_USERS = {
  delivery_agent: {
    roleKey: "delivery_agent",
    roleName: "Delivery Agent",
    name: "Vikram Sharma",
    email: "vikram.agent@swiftlog.in",
    company: "SwiftLog Reverse Logistics (Fleet #41)",
    avatar: "VS",
    badgeColor: "bg-blue-100 text-blue-800"
  },
  warehouse_staff: {
    roleKey: "warehouse_staff",
    roleName: "Warehouse Staff",
    name: "Priya Menon",
    email: "priya.forensics@wh-central.com",
    company: "Apex Central Fulfillment & Forensics Hub",
    avatar: "PM",
    badgeColor: "bg-purple-100 text-purple-800"
  },
  company_admin: {
    roleKey: "company_admin",
    roleName: "Company Administrator",
    name: "Dr. Ananya Sen",
    email: "ananya.sen@apexmarketplaces.com",
    company: "Apex Retail Group India",
    avatar: "AS",
    badgeColor: "bg-emerald-100 text-emerald-800"
  }
};

export const ADMIN_MONTHLY_TRENDS = [
  { month: "May", screened: 38400, verified: 36200, suspicious: 1480, inconclusive: 720, savingsLakh: 37.0 },
  { month: "Jun", screened: 45200, verified: 42600, suspicious: 1780, inconclusive: 820, savingsLakh: 44.5 },
  { month: "Jul", screened: 54100, verified: 51000, suspicious: 2150, inconclusive: 950, savingsLakh: 53.8 },
  { month: "Aug", screened: 62800, verified: 59100, suspicious: 2540, inconclusive: 1160, savingsLakh: 63.5 },
  { month: "Sep", screened: 78900, verified: 74200, suspicious: 3280, inconclusive: 1420, savingsLakh: 82.0 },
  { month: "Oct", screened: 96400, verified: 90800, suspicious: 3950, inconclusive: 1650, savingsLakh: 98.7 },
];

export const RECENT_AUDIT_ACTIVITY = [
  {
    id: "LOG-9921",
    timestamp: "10 mins ago",
    action: "Return Flagged",
    details: "RET-2024-88412 marked Suspicious: Battery SN mismatch by Agent Vikram Sharma",
    severity: "warning"
  },
  {
    id: "LOG-9920",
    timestamp: "24 mins ago",
    action: "Forensic Report Approved",
    details: "Warehouse Staff Priya Menon confirmed non-OEM battery swap on RET-2024-88390",
    severity: "critical"
  },
  {
    id: "LOG-9919",
    timestamp: "45 mins ago",
    action: "OEM Batch Registered",
    details: "AeroTech registered 2,500 new AeroBook Pro 15 baseline certificates (LOT-24-09)",
    severity: "info"
  },
  {
    id: "LOG-9918",
    timestamp: "1 hour ago",
    action: "Verification Cleared",
    details: "RET-2024-88415 cleared by Hub Central for tier-1 customer refund",
    severity: "success"
  }
];
