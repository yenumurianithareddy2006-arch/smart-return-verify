import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ProblemPage } from './pages/ProblemPage';
import { SolutionPage } from './pages/SolutionPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { BusinessModelPage } from './pages/BusinessModelPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';

// 4 Interactive Workflow Detail Pages
import { ManufacturerRecordPage } from './pages/workflows/ManufacturerRecordPage';
import { DoorstepScreeningPage } from './pages/workflows/DoorstepScreeningPage';
import { SecureHandoffPage } from './pages/workflows/SecureHandoffPage';
import { WarehouseVerifyPage } from './pages/workflows/WarehouseVerifyPage';

// Scroll to top helper on navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/problem" element={<ProblemPage />} />
          <Route path="/solution" element={<SolutionPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/business-model" element={<BusinessModelPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* 4 Interactive Workflow Pillars */}
          <Route path="/workflow/manufacturer-record" element={<ManufacturerRecordPage />} />
          <Route path="/workflow/doorstep-screening" element={<DoorstepScreeningPage />} />
          <Route path="/workflow/secure-handoff" element={<SecureHandoffPage />} />
          <Route path="/workflow/warehouse-verification" element={<WarehouseVerifyPage />} />
          
          {/* Fallback to Home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
