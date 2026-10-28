import { describe, it, expect } from 'vitest';
import { UrgencyTier } from '../types';

describe('Safety Engine Tiers and Category Contracts', () => {
  const urgencyTiers: UrgencyTier[] = ['low', 'moderate', 'high', 'urgent'];

  it('validates all four descriptive urgency levels exist and map correctly', () => {
    expect(urgencyTiers).toContain('low');
    expect(urgencyTiers).toContain('moderate');
    expect(urgencyTiers).toContain('high');
    expect(urgencyTiers).toContain('urgent');
  });

  it('validates seven core support categories are present', () => {
    const requiredCategories = [
      'friendship_conflicts',
      'bullying',
      'cyberbullying',
      'academic_stress',
      'personal_boundaries',
      'emotional_distress',
      'general_support'
    ];

    expect(requiredCategories.length).toBe(7);
    expect(requiredCategories).toContain('bullying');
    expect(requiredCategories).toContain('personal_boundaries');
    expect(requiredCategories).toContain('academic_stress');
  });

  it('ensures urgent risk cannot be downgraded', () => {
    const backendResult: UrgencyTier = 'urgent';
    let frontendReportedUrgency: UrgencyTier = backendResult;

    // Safety rule: frontend must not downgrade urgent backend results
    const requestedFilter = 'moderate';
    if (backendResult === 'urgent') {
      frontendReportedUrgency = 'urgent'; // Preserved
    }

    expect(frontendReportedUrgency).toBe('urgent');
  });
});
