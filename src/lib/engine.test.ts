import { describe, it, expect } from 'vitest';
import {
  calculatePIA,
  calculateBenefitAtAge,
  calculateBreakeven,
  calculateLifetimeTotal,
  calculateSpousalBenefit,
  compareClaimingAges,
  findOptimalAge,
} from './engine';
import { getFRAMonths, getFRAAge, earlyReductionFactor, delayedCreditFactor } from './ssa-rates-2026';

describe('getFRAMonths', () => {
  it('returns 66y 0m (792 months) for birth year 1954', () => {
    expect(getFRAMonths(1954)).toBe(792);
  });

  it('returns 66y 2m (794 months) for birth year 1955', () => {
    expect(getFRAMonths(1955)).toBe(794);
  });

  it('returns 67y 0m (804 months) for birth year 1960', () => {
    expect(getFRAMonths(1960)).toBe(804);
  });

  it('returns 67y 0m (804 months) for birth year 1968', () => {
    expect(getFRAMonths(1968)).toBe(804);
  });
});

describe('calculatePIA', () => {
  it('returns 0 for zero AIME', () => {
    expect(calculatePIA(0)).toBe(0);
  });

  it('calculates PIA correctly for AIME below first bend point ($1,000)', () => {
    // 90% of $1,000 = $900.0
    const pia = calculatePIA(1000);
    expect(pia).toBe(900);
  });

  it('calculates PIA correctly for AIME between bend points ($3,000)', () => {
    // 90% of $1,174 = $1,056.60
    // 32% of ($3,000 - $1,174) = 32% of $1,826 = $584.32
    // Total = $1,640.92, truncated to $1,640.90
    const pia = calculatePIA(3000);
    expect(pia).toBe(1640.9);
  });

  it('calculates PIA correctly for AIME above second bend point ($8,000)', () => {
    // 90% of $1,174 = $1,056.60
    // 32% of ($7,078 - $1,174) = 32% of $5,904 = $1,889.28
    // 15% of ($8,000 - $7,078) = 15% of $922 = $138.30
    // Total = $3,084.18, truncated to $3,084.10
    const pia = calculatePIA(8000);
    expect(pia).toBe(3084.1);
  });

  it('returns 0 for negative AIME', () => {
    expect(calculatePIA(-500)).toBe(0);
  });
});

describe('calculateBenefitAtAge', () => {
  // For birth year 1960, FRA = 67
  const birthYear = 1960;

  it('returns full PIA at FRA (age 67)', () => {
    const benefit = calculateBenefitAtAge(2000, birthYear, 67);
    expect(benefit).toBe(2000);
  });

  it('reduces benefit at age 62 to approximately 70% of PIA', () => {
    // 60 months early: first 36 months at 5/9% = 20%, next 24 at 5/12% = 10%
    // Total reduction = 30%, so factor = 0.70
    const benefit = calculateBenefitAtAge(2000, birthYear, 62);
    expect(benefit).toBe(1400); // 70% of $2,000
  });

  it('increases benefit at age 70 by 24% (delayed credits)', () => {
    // 36 months delayed * 2/3% per month = 24% increase
    const benefit = calculateBenefitAtAge(2000, birthYear, 70);
    expect(benefit).toBe(2480); // 124% of $2,000
  });

  it('applies correct reduction at age 65 (24 months early)', () => {
    // 24 months early, all within first 36: 24 * 5/9% = 13.33%
    // Factor = 1 - 0.1333 = 0.8667
    const benefit = calculateBenefitAtAge(2000, birthYear, 65);
    expect(benefit).toBe(1733); // floor(2000 * 0.8667)
  });

  it('returns 0 for zero PIA', () => {
    expect(calculateBenefitAtAge(0, birthYear, 65)).toBe(0);
  });
});

describe('calculateBreakeven', () => {
  const birthYear = 1960;
  const pia = 2000;

  it('returns earlyAge when earlyAge equals laterAge', () => {
    expect(calculateBreakeven(pia, birthYear, 65, 65)).toBe(65);
  });

  it('calculates a break-even age between 62 and 67', () => {
    const breakeven = calculateBreakeven(pia, birthYear, 62, 67);
    // Should be somewhere around 78-82
    expect(breakeven).toBeGreaterThan(75);
    expect(breakeven).toBeLessThan(85);
  });

  it('calculates a break-even age between 62 and 70', () => {
    const breakeven = calculateBreakeven(pia, birthYear, 62, 70);
    // Should be somewhere around 80-84
    expect(breakeven).toBeGreaterThan(78);
    expect(breakeven).toBeLessThan(88);
  });
});

describe('calculateLifetimeTotal', () => {
  const birthYear = 1960;
  const pia = 2000;

  it('returns 0 when claimAge >= lifeExpectancy', () => {
    expect(calculateLifetimeTotal(pia, birthYear, 85, 85)).toBe(0);
  });

  it('returns higher total with COLA than without', () => {
    const withCola = calculateLifetimeTotal(pia, birthYear, 67, 85, 0.025);
    const noCola = calculateLifetimeTotal(pia, birthYear, 67, 85, 0);
    expect(withCola).toBeGreaterThan(noCola);
  });

  it('calculates correct lifetime total with no COLA', () => {
    // At FRA (67), benefit = $2,000/mo. Life to 85 = 18 years = 216 months
    // Total = $2,000 * 216 = $432,000
    const total = calculateLifetimeTotal(pia, birthYear, 67, 85, 0);
    expect(total).toBe(432000);
  });

  it('early claiming yields more total if life expectancy is short', () => {
    const earlyTotal = calculateLifetimeTotal(pia, birthYear, 62, 72, 0);
    const lateTotal = calculateLifetimeTotal(pia, birthYear, 70, 72, 0);
    expect(earlyTotal).toBeGreaterThan(lateTotal);
  });
});

describe('calculateSpousalBenefit', () => {
  const spouseBirthYear = 1960; // FRA = 67

  it('returns 50% of worker PIA when spouse claims at FRA with no own benefit', () => {
    const benefit = calculateSpousalBenefit(3000, 0, 67, spouseBirthYear);
    expect(benefit).toBe(1500); // 50% of $3,000
  });

  it('reduces spousal benefit when claimed early', () => {
    const atFRA = calculateSpousalBenefit(3000, 0, 67, spouseBirthYear);
    const early = calculateSpousalBenefit(3000, 0, 62, spouseBirthYear);
    expect(early).toBeLessThan(atFRA);
  });

  it('returns own benefit when it exceeds spousal benefit', () => {
    // Spouse's own PIA is $2,000, worker PIA is $3,000
    // Spousal = $1,500 at FRA, own benefit at FRA = $2,000
    // Should return the higher own benefit
    const benefit = calculateSpousalBenefit(3000, 2000, 67, spouseBirthYear);
    expect(benefit).toBe(2000);
  });
});

describe('compareClaimingAges', () => {
  it('returns 9 entries (ages 62 through 70)', () => {
    const results = compareClaimingAges(2000, 1960, 85);
    expect(results).toHaveLength(9);
    expect(results[0].claimAge).toBe(62);
    expect(results[8].claimAge).toBe(70);
  });

  it('has increasing monthly benefits from 62 to 70', () => {
    const results = compareClaimingAges(2000, 1960, 85);
    for (let i = 1; i < results.length; i++) {
      expect(results[i].monthlyBenefit).toBeGreaterThan(results[i - 1].monthlyBenefit);
    }
  });

  it('percentOfPIA at age 62 is approximately 70% for birth year 1960', () => {
    const results = compareClaimingAges(2000, 1960, 85);
    expect(results[0].percentOfPIA).toBe(70);
  });

  it('percentOfPIA at age 70 is approximately 124% for birth year 1960', () => {
    const results = compareClaimingAges(2000, 1960, 85);
    expect(results[8].percentOfPIA).toBe(124);
  });
});

describe('findOptimalAge', () => {
  it('returns 62 for short life expectancy', () => {
    expect(findOptimalAge(2000, 1960, 72, 0)).toBe(62);
  });

  it('returns 70 for long life expectancy with no COLA', () => {
    expect(findOptimalAge(2000, 1960, 95, 0)).toBe(70);
  });
});

describe('edge cases', () => {
  it('earlyReductionFactor returns 1 for zero months early', () => {
    expect(earlyReductionFactor(0)).toBe(1);
  });

  it('delayedCreditFactor returns 1 for zero months delayed', () => {
    expect(delayedCreditFactor(0)).toBe(1);
  });
});
