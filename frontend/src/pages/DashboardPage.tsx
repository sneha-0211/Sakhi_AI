import React from 'react';
import { WelcomeHero } from '../components/WelcomeHero';
import { SupportCategoryGrid } from '../components/SupportCategoryGrid';
import { NextStepCard } from '../components/NextStepCard';
import { ResourceCards } from '../components/ResourceCards';
import { PrivacyCard } from '../components/PrivacyCard';
import { EmergencyHelpBanner } from '../components/EmergencyHelpBanner';

export const DashboardPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-10">
      
      {/* 1. Welcome Hero (Section 3.B) */}
      <WelcomeHero />

      {/* 2. Quick Support Categories (Section 3.C) */}
      <SupportCategoryGrid />

      {/* 3. My Next Step (Section 3.D) */}
      <NextStepCard />

      {/* 4. Safety and Resources (Section 3.E) */}
      <ResourceCards />

      {/* 5. Privacy Notice (Section 3.F) */}
      <PrivacyCard />

      {/* 6. Emergency Help (Section 3.G) */}
      <EmergencyHelpBanner />

    </div>
  );
};
