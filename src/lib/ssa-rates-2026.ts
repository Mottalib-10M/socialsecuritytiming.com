/**
 * Social Security Administration rates, thresholds, and parameters for 2026.
 * Sources: SSA.gov, Federal Register
 */

/* ---------- Full Retirement Age (FRA) by birth year ---------- */
export interface FRAEntry {
  birthYearStart: number;
  birthYearEnd: number;
  fraYears: number;
  fraMonths: number; // additional months beyond fraYears
}

export const FRA_TABLE: FRAEntry[] = [
  { birthYearStart: 1943, birthYearEnd: 1954, fraYears: 66, fraMonths: 0 },
  { birthYearStart: 1955, birthYearEnd: 1955, fraYears: 66, fraMonths: 2 },
  { birthYearStart: 1956, birthYearEnd: 1956, fraYears: 66, fraMonths: 4 },
  { birthYearStart: 1957, birthYearEnd: 1957, fraYears: 66, fraMonths: 6 },
  { birthYearStart: 1958, birthYearEnd: 1958, fraYears: 66, fraMonths: 8 },
  { birthYearStart: 1959, birthYearEnd: 1959, fraYears: 66, fraMonths: 10 },
  { birthYearStart: 1960, birthYearEnd: 9999, fraYears: 67, fraMonths: 0 },
];

/** Returns FRA in total months for a given birth year */
export function getFRAMonths(birthYear: number): number {
  const entry = FRA_TABLE.find(
    (e) => birthYear >= e.birthYearStart && birthYear <= e.birthYearEnd,
  );
  if (!entry) {
    // Default to 67 for any birth year 1960+
    return 67 * 12;
  }
  return entry.fraYears * 12 + entry.fraMonths;
}

/** Returns FRA as a decimal age (e.g. 66.5 for 66 and 6 months) */
export function getFRAAge(birthYear: number): number {
  return getFRAMonths(birthYear) / 12;
}

/* ---------- Early claiming reduction ---------- */

/**
 * Reduction rate for claiming before FRA:
 * - First 36 months early: 5/9 of 1% per month (= 6.67% per year)
 * - Each additional month beyond 36: 5/12 of 1% per month (= 5% per year)
 *
 * Returns the fraction of PIA the worker receives (e.g. 0.70 for 70%).
 */
export function earlyReductionFactor(monthsEarly: number): number {
  if (monthsEarly <= 0) return 1;

  const first36 = Math.min(monthsEarly, 36);
  const beyond36 = Math.max(monthsEarly - 36, 0);

  const reductionFirst36 = first36 * (5 / 9 / 100); // 5/9 of 1% per month
  const reductionBeyond36 = beyond36 * (5 / 12 / 100); // 5/12 of 1% per month

  return 1 - reductionFirst36 - reductionBeyond36;
}

/* ---------- Delayed Retirement Credits (DRC) ---------- */

/**
 * For birth year 1943+, DRC is 8% per year (2/3 of 1% per month).
 * Credits accrue for each month past FRA up to age 70.
 */
export const DRC_RATE_PER_MONTH = 2 / 3 / 100; // 0.006667 per month
export const DRC_RATE_PER_YEAR = 0.08; // 8% per year

export function delayedCreditFactor(monthsDelayed: number): number {
  if (monthsDelayed <= 0) return 1;
  return 1 + monthsDelayed * DRC_RATE_PER_MONTH;
}

/* ---------- PIA Bend Points (2026) ---------- */

export const BEND_POINT_1 = 1174; // 90% of first $1,174
export const BEND_POINT_2 = 7078; // 32% of $1,174 to $7,078

export const PIA_RATE_1 = 0.9;
export const PIA_RATE_2 = 0.32;
export const PIA_RATE_3 = 0.15;

/* ---------- Taxable Earnings Cap ---------- */

export const MAX_TAXABLE_EARNINGS_2026 = 168600;

/* ---------- COLA Default ---------- */

export const DEFAULT_COLA = 0.025; // 2.5% assumed annual COLA

/* ---------- Spousal Benefit ---------- */

/**
 * Spousal benefit at FRA = 50% of worker's PIA.
 * If claimed early, reduced similarly to worker benefits but the
 * reduction is applied to the 50% amount.
 * The reduction rate for spousal:
 * - First 36 months early: 25/36 of 1% per month
 * - Each additional month beyond 36: 5/12 of 1% per month
 */
export const SPOUSAL_MAX_RATE = 0.5; // 50% of worker PIA

export function spousalReductionFactor(monthsEarly: number): number {
  if (monthsEarly <= 0) return 1;

  const first36 = Math.min(monthsEarly, 36);
  const beyond36 = Math.max(monthsEarly - 36, 0);

  const reductionFirst36 = first36 * (25 / 36 / 100);
  const reductionBeyond36 = beyond36 * (5 / 12 / 100);

  return 1 - reductionFirst36 - reductionBeyond36;
}

/* ---------- Survivor Benefit ---------- */

/**
 * Survivor can receive 100% of deceased worker's benefit at survivor's FRA.
 * Can be claimed as early as age 60 (50 if disabled).
 * If claimed before FRA, reduced by ~28.5% max at age 60.
 */
export const SURVIVOR_EARLIEST_AGE = 60;
export const SURVIVOR_MAX_REDUCTION = 0.285; // 28.5% max reduction at age 60

/* ---------- Claiming age range ---------- */

export const EARLIEST_CLAIM_AGE = 62;
export const LATEST_CLAIM_AGE = 70;
export const CLAIM_AGES = [62, 63, 64, 65, 66, 67, 68, 69, 70] as const;
