/**
 * Social Security benefit calculation engine.
 * All monetary values are monthly unless noted otherwise.
 */

import {
  BEND_POINT_1,
  BEND_POINT_2,
  PIA_RATE_1,
  PIA_RATE_2,
  PIA_RATE_3,
  getFRAMonths,
  earlyReductionFactor,
  delayedCreditFactor,
  SPOUSAL_MAX_RATE,
  spousalReductionFactor,
  DEFAULT_COLA,
  EARLIEST_CLAIM_AGE,
  LATEST_CLAIM_AGE,
} from './ssa-rates-2026';

/* ---------- PIA Calculation ---------- */

/**
 * Calculate the Primary Insurance Amount (PIA) from Average Indexed Monthly Earnings (AIME).
 * Uses the 2026 bend points: 90% of first $1,174, 32% of $1,174-$7,078, 15% above $7,078.
 * Result is truncated to the next lower dime (rounded down to nearest $0.10).
 */
export function calculatePIA(aime: number): number {
  if (aime <= 0) return 0;

  let pia = 0;

  if (aime <= BEND_POINT_1) {
    pia = aime * PIA_RATE_1;
  } else if (aime <= BEND_POINT_2) {
    pia = BEND_POINT_1 * PIA_RATE_1 + (aime - BEND_POINT_1) * PIA_RATE_2;
  } else {
    pia =
      BEND_POINT_1 * PIA_RATE_1 +
      (BEND_POINT_2 - BEND_POINT_1) * PIA_RATE_2 +
      (aime - BEND_POINT_2) * PIA_RATE_3;
  }

  // Truncate to next lower dime
  return Math.floor(pia * 10) / 10;
}

/* ---------- Benefit at a Specific Claiming Age ---------- */

/**
 * Calculate the monthly benefit at a given claiming age.
 * @param pia - Primary Insurance Amount (monthly)
 * @param birthYear - Year of birth
 * @param claimAge - Age at which benefits are claimed (62-70)
 * @returns Monthly benefit amount (rounded down to nearest dollar)
 */
export function calculateBenefitAtAge(
  pia: number,
  birthYear: number,
  claimAge: number,
): number {
  if (pia <= 0) return 0;

  const fraMonths = getFRAMonths(birthYear);
  const claimMonths = claimAge * 12;
  const difference = claimMonths - fraMonths;

  let factor: number;

  if (difference < 0) {
    // Claiming early
    factor = earlyReductionFactor(Math.abs(difference));
  } else if (difference > 0) {
    // Claiming late (delayed credits)
    factor = delayedCreditFactor(difference);
  } else {
    factor = 1;
  }

  return Math.floor(pia * factor);
}

/* ---------- Break-Even Analysis ---------- */

/**
 * Calculate the break-even age at which claiming at a later age
 * pays off compared to claiming at an earlier age.
 * Assumes no COLA for simplicity in break-even calculation.
 * @returns Break-even age in years (decimal), or Infinity if later never catches up
 */
export function calculateBreakeven(
  pia: number,
  birthYear: number,
  earlyAge: number,
  laterAge: number,
): number {
  if (earlyAge >= laterAge) return earlyAge;

  const earlyBenefit = calculateBenefitAtAge(pia, birthYear, earlyAge);
  const laterBenefit = calculateBenefitAtAge(pia, birthYear, laterAge);

  if (laterBenefit <= earlyBenefit) return Infinity;

  // Months of benefits collected at earlyAge before laterAge starts
  const headStartMonths = (laterAge - earlyAge) * 12;
  const earlyTotal = earlyBenefit * headStartMonths;

  // Monthly advantage of later claiming
  const monthlyAdvantage = laterBenefit - earlyBenefit;

  // Months after laterAge to break even
  const monthsToBreakEven = Math.ceil(earlyTotal / monthlyAdvantage);

  return laterAge + monthsToBreakEven / 12;
}

/* ---------- Lifetime Total Benefits ---------- */

/**
 * Calculate total lifetime benefits with COLA adjustments.
 * @param pia - Primary Insurance Amount
 * @param birthYear - Year of birth
 * @param claimAge - Age at which benefits are claimed
 * @param lifeExpectancy - Expected age at death
 * @param cola - Annual Cost of Living Adjustment rate (default 2.5%)
 * @returns Total lifetime benefits received
 */
export function calculateLifetimeTotal(
  pia: number,
  birthYear: number,
  claimAge: number,
  lifeExpectancy: number,
  cola: number = DEFAULT_COLA,
): number {
  if (claimAge >= lifeExpectancy) return 0;

  const monthlyBenefit = calculateBenefitAtAge(pia, birthYear, claimAge);
  const totalMonths = Math.round((lifeExpectancy - claimAge) * 12);

  let total = 0;
  for (let month = 0; month < totalMonths; month++) {
    const yearsFromStart = month / 12;
    const adjustedBenefit = monthlyBenefit * Math.pow(1 + cola, yearsFromStart);
    total += adjustedBenefit;
  }

  return Math.round(total);
}

/* ---------- Spousal Benefit ---------- */

/**
 * Calculate the spousal benefit.
 * The spouse receives the greater of:
 * 1. Their own retirement benefit, or
 * 2. 50% of the worker's PIA (reduced if claimed early)
 *
 * This function returns the spousal-only portion (option 2).
 * @param workerPIA - The worker's PIA
 * @param spousePIA - The spouse's own PIA (0 if no work history)
 * @param spouseClaimAge - Age at which the spouse claims
 * @param spouseBirthYear - Spouse's birth year
 * @returns Monthly spousal benefit
 */
export function calculateSpousalBenefit(
  workerPIA: number,
  spousePIA: number,
  spouseClaimAge: number,
  spouseBirthYear: number,
): number {
  const fraMonths = getFRAMonths(spouseBirthYear);
  const claimMonths = spouseClaimAge * 12;
  const monthsEarly = Math.max(0, fraMonths - claimMonths);

  // Full spousal benefit is 50% of worker's PIA
  const fullSpousal = workerPIA * SPOUSAL_MAX_RATE;

  // Reduced if claiming early
  const reducedSpousal = fullSpousal * spousalReductionFactor(monthsEarly);

  // Spouse's own benefit at their claim age
  const ownBenefit = calculateBenefitAtAge(spousePIA, spouseBirthYear, spouseClaimAge);

  // Spouse receives the greater of their own benefit or the spousal benefit
  // but the "spousal top-up" is the difference
  if (ownBenefit >= reducedSpousal) return ownBenefit;

  return Math.floor(reducedSpousal);
}

/* ---------- Comparison of All Claiming Ages ---------- */

export interface ClaimingAgeResult {
  claimAge: number;
  monthlyBenefit: number;
  annualBenefit: number;
  lifetimeTotal: number;
  breakEvenVs62: number;
  percentOfPIA: number;
}

/**
 * Compare all claiming ages from 62 to 70.
 * @returns Array of results sorted by claiming age
 */
export function compareClaimingAges(
  pia: number,
  birthYear: number,
  lifeExpectancy: number,
  cola: number = DEFAULT_COLA,
): ClaimingAgeResult[] {
  const results: ClaimingAgeResult[] = [];

  for (let age = EARLIEST_CLAIM_AGE; age <= LATEST_CLAIM_AGE; age++) {
    const monthlyBenefit = calculateBenefitAtAge(pia, birthYear, age);
    const annualBenefit = monthlyBenefit * 12;
    const lifetimeTotal = calculateLifetimeTotal(pia, birthYear, age, lifeExpectancy, cola);
    const breakEvenVs62 =
      age === EARLIEST_CLAIM_AGE
        ? EARLIEST_CLAIM_AGE
        : calculateBreakeven(pia, birthYear, EARLIEST_CLAIM_AGE, age);
    const percentOfPIA = pia > 0 ? (monthlyBenefit / pia) * 100 : 0;

    results.push({
      claimAge: age,
      monthlyBenefit,
      annualBenefit,
      lifetimeTotal,
      breakEvenVs62: Math.round(breakEvenVs62 * 10) / 10,
      percentOfPIA: Math.round(percentOfPIA * 10) / 10,
    });
  }

  return results;
}

/**
 * Find the optimal claiming age that maximizes lifetime total.
 */
export function findOptimalAge(
  pia: number,
  birthYear: number,
  lifeExpectancy: number,
  cola: number = DEFAULT_COLA,
): number {
  const results = compareClaimingAges(pia, birthYear, lifeExpectancy, cola);
  let best = results[0];
  for (const r of results) {
    if (r.lifetimeTotal > best.lifetimeTotal) {
      best = r;
    }
  }
  return best.claimAge;
}
