/**
 * Smart Return Verify - Interactive B2B Revenue & Volume Calculator
 * Calculates illustrative return verification projections for e-commerce and retail partners.
 */

const RevenueCalculator = {
  returnsVolume: 50000,
  feePerReturn: 10,

  init() {
    this.bindEvents();
    this.updateCalculations();
  },

  bindEvents() {
    const volumeSlider = document.getElementById('calc-volume-slider');
    const feeSlider = document.getElementById('calc-fee-slider');

    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        this.returnsVolume = parseInt(e.target.value, 10);
        this.updateCalculations();
      });
    }

    if (feeSlider) {
      feeSlider.addEventListener('input', (e) => {
        this.feePerReturn = parseInt(e.target.value, 10);
        this.updateCalculations();
      });
    }

    // Preset buttons: 50k, 100k, 200k
    document.querySelectorAll('[data-calc-preset]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = parseInt(e.currentTarget.getAttribute('data-calc-preset'), 10);
        this.returnsVolume = val;
        if (volumeSlider) volumeSlider.value = val;
        this.updateCalculations();
      });
    });
  },

  formatIndianCurrency(amount) {
    if (amount >= 10000000) {
      const cr = (amount / 10000000).toFixed(2);
      return `₹${cr} Crore`;
    } else if (amount >= 100000) {
      const lakh = (amount / 100000).toFixed(1);
      return `₹${lakh} Lakh`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  },

  updateCalculations() {
    const volumeDisplay = document.getElementById('calc-volume-display');
    const feeDisplay = document.getElementById('calc-fee-display');
    const monthlyRevDisplay = document.getElementById('calc-monthly-revenue');
    const annualRevDisplay = document.getElementById('calc-annual-revenue');
    const hoursSavedDisplay = document.getElementById('calc-hours-saved');
    const fraudFilteredDisplay = document.getElementById('calc-fraud-detected');

    if (volumeDisplay) {
      volumeDisplay.textContent = this.returnsVolume.toLocaleString('en-IN') + ' units';
    }
    if (feeDisplay) {
      feeDisplay.textContent = `₹${this.feePerReturn}`;
    }

    const monthlyRevenue = this.returnsVolume * this.feePerReturn;
    const annualRevenue = monthlyRevenue * 12;

    // Assuming ~12 minutes saved per preliminary screening vs manual full technician tear-down
    const hoursSaved = Math.round((this.returnsVolume * 12) / 60);

    // Assuming industry average 3.5% component mismatch attempt rate on high-value electronics
    const fraudUnitsScreened = Math.round(this.returnsVolume * 0.035);

    if (monthlyRevDisplay) {
      monthlyRevDisplay.textContent = this.formatIndianCurrency(monthlyRevenue);
    }
    if (annualRevDisplay) {
      annualRevDisplay.textContent = this.formatIndianCurrency(annualRevenue);
    }
    if (hoursSavedDisplay) {
      hoursSavedDisplay.textContent = hoursSaved.toLocaleString('en-IN') + ' hrs/mo';
    }
    if (fraudFilteredDisplay) {
      fraudFilteredDisplay.textContent = `~${fraudUnitsScreened.toLocaleString('en-IN')} units`;
    }

    // Highlight preset buttons if exact match
    document.querySelectorAll('[data-calc-preset]').forEach(btn => {
      const presetVal = parseInt(btn.getAttribute('data-calc-preset'), 10);
      if (presetVal === this.returnsVolume) {
        btn.classList.add('bg-blue-600', 'text-white');
        btn.classList.remove('bg-slate-100', 'text-slate-700');
      } else {
        btn.classList.remove('bg-blue-600', 'text-white');
        btn.classList.add('bg-slate-100', 'text-slate-700');
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  RevenueCalculator.init();
});
