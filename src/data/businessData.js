/**
 * Business Model & Revenue Calculator Constants and Data
 */

export const PRICING_TIERS = [
  {
    name: "Pay-Per-Return",
    description: "Ideal for growing online retailers and regional logistics hubs with variable return volumes.",
    rate: "₹10 – ₹15",
    unit: "per return verification",
    features: [
      "Doorstep mobile agent triage app",
      "Instant YES/NO simulated AI screening",
      "Encrypted digital chain-of-custody",
      "Standard warehouse intake portal",
      "Email support & weekly incident reports"
    ],
    highlight: false,
    cta: "Start Free Pilot"
  },
  {
    name: "Growth Fleet Plan",
    description: "Designed for high-volume consumer electronics retailers processing 25,000+ returns monthly.",
    rate: "₹8",
    unit: "per return + monthly platform base",
    features: [
      "Everything in Pay-Per-Return",
      "Diagnostic USB-C dongle hardware SDK",
      "Real-time HMAC integrity verification",
      "Priority warehouse forensics queue",
      "Dedicated account manager & 4h SLA",
      "ERP & 3PL webhook integrations"
    ],
    highlight: true,
    badge: "Most Popular",
    cta: "Request Fleet Demo"
  },
  {
    name: "Enterprise Marketplace",
    description: "Custom deployment for national e-commerce marketplaces and OEM electronic manufacturers.",
    rate: "Custom Volume Tier",
    unit: "tailored SLAs & on-premise keys",
    features: [
      "Custom per-return volume discount (₹5 - ₹7)",
      "Manufacturer baseline database enrollment API",
      "Custom AI model fine-tuning on OEM schematics",
      "Multi-tenant hub management for 50+ warehouses",
      "24/7 priority enterprise support & 99.95% uptime",
      "Custom security audits & compliance reporting"
    ],
    highlight: false,
    cta: "Contact Enterprise Sales"
  }
];

export const CALCULATOR_PRESETS = [
  {
    volume: 50000,
    fee: 10,
    label: "50,000 / mo",
    monthlyRevenue: 500000, // ₹5 Lakh
    annualRevenue: 6000000, // ₹60 Lakh
    formattedMonthly: "₹5 Lakh",
    formattedAnnual: "₹60 Lakh"
  },
  {
    volume: 100000,
    fee: 10,
    label: "100,000 / mo",
    monthlyRevenue: 1000000, // ₹10 Lakh
    annualRevenue: 12000000, // ₹1.2 Crore
    formattedMonthly: "₹10 Lakh",
    formattedAnnual: "₹1.2 Crore"
  },
  {
    volume: 200000,
    fee: 10,
    label: "200,000 / mo",
    monthlyRevenue: 2000000, // ₹20 Lakh
    annualRevenue: 24000000, // ₹2.4 Crore
    formattedMonthly: "₹20 Lakh",
    formattedAnnual: "₹2.4 Crore"
  }
];

export function formatIndianCurrency(amount) {
  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(2);
    return `₹${cr} Crore`;
  } else if (amount >= 100000) {
    const lakh = (amount / 100000).toFixed(1);
    return `₹${lakh} Lakh`;
  } else {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
}
