/**
 * Benefit amounts data for programmatic SEO pages.
 * Each entry represents a PIA level with benefit-at-each-age tables,
 * lifetime comparisons, and FAQs.
 * Based on FRA = 67 (birth year 1960+).
 */

export interface BenefitAtAge {
  age: number;
  percentOfPIA: number;
  monthlyBenefit: number;
  annualBenefit: number;
}

export interface BenefitAmountFAQ {
  question: string;
  answer: string;
}

export interface BenefitAmountEntry {
  slug: string;
  pia: number;
  piaFormatted: string;
  description: string;
  benefitAtEachAge: BenefitAtAge[];
  lifetimeComparison: {
    at62: number;
    at67: number;
    at70: number;
    bestAge: number;
    bestTotal: number;
  };
  faqs: BenefitAmountFAQ[];
}

/** Percent of PIA by claiming age (FRA = 67, birth year 1960+) */
const piaPercentages: { age: number; percent: number }[] = [
  { age: 62, percent: 70.0 },
  { age: 63, percent: 75.0 },
  { age: 64, percent: 80.0 },
  { age: 65, percent: 86.67 },
  { age: 66, percent: 93.33 },
  { age: 67, percent: 100.0 },
  { age: 68, percent: 108.0 },
  { age: 69, percent: 116.0 },
  { age: 70, percent: 124.0 },
];

function buildBenefitTable(pia: number): BenefitAtAge[] {
  return piaPercentages.map(({ age, percent }) => {
    const monthlyBenefit = Math.floor(pia * (percent / 100));
    return {
      age,
      percentOfPIA: percent,
      monthlyBenefit,
      annualBenefit: monthlyBenefit * 12,
    };
  });
}

/**
 * Calculate approximate lifetime total (no COLA) for a given claim age.
 * Assumes life expectancy of 85.
 */
function lifetimeTotal(pia: number, claimAge: number): number {
  const lifeExpectancy = 85;
  const percent = piaPercentages.find((p) => p.age === claimAge)?.percent ?? 100;
  const monthly = Math.floor(pia * (percent / 100));
  const months = (lifeExpectancy - claimAge) * 12;
  return monthly * months;
}

function buildLifetimeComparison(pia: number) {
  const at62 = lifetimeTotal(pia, 62);
  const at67 = lifetimeTotal(pia, 67);
  const at70 = lifetimeTotal(pia, 70);
  const all = [
    { age: 62, total: at62 },
    { age: 67, total: at67 },
    { age: 70, total: at70 },
  ];
  const best = all.reduce((a, b) => (a.total > b.total ? a : b));
  return { at62, at67, at70, bestAge: best.age, bestTotal: best.total };
}

function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export const benefitAmountsData: BenefitAmountEntry[] = [
  {
    slug: '1000',
    pia: 1000,
    piaFormatted: '$1,000',
    description:
      'A $1,000 monthly PIA typically reflects a career with moderate earnings or fewer than 35 years of covered employment. At Full Retirement Age (67), you receive $1,000 per month or $12,000 per year. By claiming at 62, this drops to $700 per month; by delaying to 70, it increases to $1,240 per month.',
    benefitAtEachAge: buildBenefitTable(1000),
    lifetimeComparison: buildLifetimeComparison(1000),
    faqs: [
      {
        question: 'What earnings history produces a $1,000 PIA?',
        answer:
          'A $1,000 PIA corresponds to an AIME (Average Indexed Monthly Earnings) of approximately $1,111. This might result from average annual indexed earnings of roughly $13,300 over 35 years. Workers with part-time careers, significant time out of the workforce, or lower-wage employment often fall in this range.',
      },
      {
        question: 'How much would I get at 62 with a $1,000 PIA?',
        answer:
          `With a $1,000 PIA and FRA of 67, claiming at 62 means a 30% reduction. Your monthly benefit would be $700, or $8,400 per year. Over a 23-year retirement to age 85, you would collect approximately ${formatUSD(lifetimeTotal(1000, 62))} in total benefits (before COLA adjustments).`,
      },
      {
        question: 'Is $1,000 per month enough for Social Security?',
        answer:
          'The average Social Security benefit in 2026 is approximately $1,900 per month, so a $1,000 PIA is below average. At this level, Social Security alone is unlikely to cover all living expenses. It is important to supplement with other retirement savings, pensions, or continued part-time employment. You may also qualify for Supplemental Security Income (SSI) or other assistance programs depending on your total income and assets.',
      },
    ],
  },
  {
    slug: '1500',
    pia: 1500,
    piaFormatted: '$1,500',
    description:
      'A $1,500 monthly PIA reflects a solid working career with moderate-to-average earnings over 35 years. At FRA (67), you receive $1,500 per month or $18,000 per year. Claiming at 62 reduces this to $1,050 per month, while delaying to 70 increases it to $1,860 per month.',
    benefitAtEachAge: buildBenefitTable(1500),
    lifetimeComparison: buildLifetimeComparison(1500),
    faqs: [
      {
        question: 'How much is a $1,500 Social Security benefit at age 62?',
        answer:
          `If your PIA is $1,500 and you claim at 62, your benefit is reduced by 30% to $1,050 per month or $12,600 per year. Over a retirement to age 85, you would receive approximately ${formatUSD(lifetimeTotal(1500, 62))} total. Waiting to 70 would give you $1,860 per month but with fewer years of collection.`,
      },
      {
        question: 'What does a $1,500 PIA translate to annually?',
        answer:
          'At FRA, a $1,500 PIA means $18,000 per year. At 62, it is $12,600 per year. At 70, it is $22,320 per year. The annual difference between claiming at 62 and 70 is $9,720 — a significant amount that compounds over a long retirement, especially with COLA adjustments.',
      },
      {
        question: 'Should I delay if my PIA is $1,500?',
        answer:
          'Delaying generally benefits everyone regardless of PIA level. With a $1,500 PIA, the difference between 62 ($1,050/month) and 70 ($1,860/month) is $810 per month. If you live past approximately age 81, delaying to 70 produces more lifetime income. If you are in good health and have savings or other income to bridge the gap, delaying is usually the better financial choice.',
      },
    ],
  },
  {
    slug: '2000',
    pia: 2000,
    piaFormatted: '$2,000',
    description:
      'A $2,000 monthly PIA is close to the national average and reflects a career with steady, average-to-above-average earnings. At FRA (67), you receive $2,000 per month or $24,000 per year. This is the most commonly referenced PIA for benefit examples. Claiming at 62 reduces it to $1,400; delaying to 70 increases it to $2,480.',
    benefitAtEachAge: buildBenefitTable(2000),
    lifetimeComparison: buildLifetimeComparison(2000),
    faqs: [
      {
        question: 'What is the monthly benefit with a $2,000 PIA at each claiming age?',
        answer:
          'With a $2,000 PIA: age 62 = $1,400/month, age 63 = $1,500, age 64 = $1,600, age 65 = $1,733, age 66 = $1,866, age 67 (FRA) = $2,000, age 68 = $2,160, age 69 = $2,320, age 70 = $2,480. The difference between claiming at 62 and 70 is $1,080 per month or $12,960 per year.',
      },
      {
        question: 'How much total would I receive with a $2,000 PIA if I live to 85?',
        answer:
          `Assuming no COLA and life to 85: claiming at 62 yields approximately ${formatUSD(lifetimeTotal(2000, 62))}, claiming at 67 yields approximately ${formatUSD(lifetimeTotal(2000, 67))}, and claiming at 70 yields approximately ${formatUSD(lifetimeTotal(2000, 70))}. With 2.5% annual COLA, these totals are significantly higher, and the advantage of delaying becomes even more pronounced.`,
      },
      {
        question: 'What AIME produces a $2,000 PIA?',
        answer:
          'A $2,000 PIA requires an AIME of approximately $3,730. This translates to average annual indexed earnings of about $44,760 over 35 years. This is close to the median household income in the United States, making a $2,000 PIA representative of a typical middle-class worker.',
      },
    ],
  },
  {
    slug: '2500',
    pia: 2500,
    piaFormatted: '$2,500',
    description:
      'A $2,500 monthly PIA indicates above-average lifetime earnings, typically from a professional career with consistent income above the median. At FRA, this provides $2,500 per month or $30,000 per year. At 62 it drops to $1,750; at 70, it rises to $3,100.',
    benefitAtEachAge: buildBenefitTable(2500),
    lifetimeComparison: buildLifetimeComparison(2500),
    faqs: [
      {
        question: 'How much Social Security will I get with a $2,500 PIA at 62?',
        answer:
          `Claiming at 62 with a $2,500 PIA means a 30% reduction to $1,750 per month or $21,000 per year. If you live to 85, your total benefits would be approximately ${formatUSD(lifetimeTotal(2500, 62))}. Compare this to claiming at 70 ($3,100/month) for a total of approximately ${formatUSD(lifetimeTotal(2500, 70))} — a difference of ${formatUSD(lifetimeTotal(2500, 70) - lifetimeTotal(2500, 62))}.`,
      },
      {
        question: 'What is the break-even age for a $2,500 PIA between ages 62 and 70?',
        answer:
          'The break-even age for 62 vs 70 with a $2,500 PIA is approximately 80 to 82 years old. Before this age, the person who claimed at 62 has received more cumulative benefits. After this age, the person who delayed to 70 pulls ahead due to the 77% higher monthly benefit ($3,100 vs $1,750). The break-even point is the same regardless of PIA level since the percentage differences are identical.',
      },
      {
        question: 'Is a $2,500 PIA considered high?',
        answer:
          'A $2,500 PIA is above the national average (approximately $1,900 in 2026) but well below the maximum PIA of approximately $4,873. It typically results from average annual indexed earnings of about $58,500 over 35 years. This is a strong benefit level that provides meaningful retirement income, especially when combined with other savings.',
      },
    ],
  },
  {
    slug: '3000',
    pia: 3000,
    piaFormatted: '$3,000',
    description:
      'A $3,000 monthly PIA represents a strong earnings history, typically from a career with well-above-average income for most working years. At FRA, this provides $3,000 per month or $36,000 per year. At 62, the benefit is $2,100; at 70, it rises to $3,720 per month.',
    benefitAtEachAge: buildBenefitTable(3000),
    lifetimeComparison: buildLifetimeComparison(3000),
    faqs: [
      {
        question: 'What is the maximum I can get with a $3,000 PIA?',
        answer:
          'The maximum benefit with a $3,000 PIA is achieved by claiming at age 70, which gives you 124% of your PIA: $3,720 per month or $44,640 per year. This is $1,620 more per month than claiming at 62 ($2,100) and $720 more per month than claiming at FRA ($3,000). Over a 15-year period from 70 to 85, this provides approximately $669,600 in total benefits before COLA adjustments.',
      },
      {
        question: 'How does a $3,000 PIA compare to the average benefit?',
        answer:
          'A $3,000 PIA is significantly above the average Social Security benefit of approximately $1,900 per month in 2026. It places you in roughly the top 25% of beneficiaries. This PIA typically results from average annual indexed earnings of approximately $73,000 over 35 years, consistent with a professional or managerial career.',
      },
      {
        question: 'With a $3,000 PIA, how much do I lose by claiming at 62?',
        answer:
          `Claiming at 62 instead of 70 reduces your monthly benefit by $1,620 ($3,720 - $2,100). While you collect benefits for 8 extra years, the reduced amount means that if you live past approximately age 81, you would have received more total money by waiting until 70. At a $3,000 PIA level, the lifetime difference between 62 and 70 (assuming life to 85) is approximately ${formatUSD(lifetimeTotal(3000, 70) - lifetimeTotal(3000, 62))}.`,
      },
    ],
  },
  {
    slug: '3500',
    pia: 3500,
    piaFormatted: '$3,500',
    description:
      'A $3,500 monthly PIA indicates a high-earning career, typically with annual indexed earnings well above the national average for most of 35 years. At FRA, you receive $3,500 per month or $42,000 per year. Claiming at 62 provides $2,450; delaying to 70 yields $4,340.',
    benefitAtEachAge: buildBenefitTable(3500),
    lifetimeComparison: buildLifetimeComparison(3500),
    faqs: [
      {
        question: 'What earnings are needed for a $3,500 PIA?',
        answer:
          'A $3,500 PIA requires an AIME of approximately $8,331. This means average indexed monthly earnings of $8,331, or about $99,972 per year averaged over your highest 35 years. Since the PIA formula is progressive (with rates of 90%, 32%, and 15% at the bend points), earning above the second bend point of $7,078 AIME means that additional earnings contribute at only 15% to your PIA.',
      },
      {
        question: 'How much is a $3,500 PIA at age 70?',
        answer:
          `At age 70, a $3,500 PIA becomes $4,340 per month ($3,500 x 1.24) or $52,080 per year. This is $1,890 more per month than claiming at 62 ($2,450). Over a 15-year retirement from 70 to 85, you would receive approximately ${formatUSD(lifetimeTotal(3500, 70))} in total benefits before COLA adjustments.`,
      },
      {
        question: 'Should high earners with a $3,500 PIA always wait until 70?',
        answer:
          'High earners often have more flexibility to delay because they are more likely to have substantial retirement savings, pensions, or investment income to bridge the gap. However, "always" is too strong — the decision still depends on health, life expectancy, spousal considerations, and personal financial goals. That said, the dollar value of delaying is larger at higher PIA levels: the difference between 62 and 70 is $1,890/month, which adds up to significant money over a long retirement.',
      },
    ],
  },
  {
    slug: '4000',
    pia: 4000,
    piaFormatted: '$4,000',
    description:
      'A $4,000 monthly PIA represents a very high-earning career, near but not at the Social Security maximum. At FRA, you receive $4,000 per month or $48,000 per year. At 62, the benefit is $2,800; at 70, it rises to $4,960 per month — approaching the maximum benefit.',
    benefitAtEachAge: buildBenefitTable(4000),
    lifetimeComparison: buildLifetimeComparison(4000),
    faqs: [
      {
        question: 'How close is a $4,000 PIA to the maximum Social Security benefit?',
        answer:
          'The maximum PIA for 2026 is approximately $4,873, so a $4,000 PIA is about 82% of the way to the maximum. At age 70, your $4,000 PIA yields $4,960 per month, compared to the absolute maximum of about $6,042 at 70. To reach the maximum PIA, you would need to have earned at or above the taxable earnings cap ($168,600 in 2026) for at least 35 years.',
      },
      {
        question: 'What is the lifetime difference at a $4,000 PIA between age 62 and 70?',
        answer:
          `With a $4,000 PIA and assuming life to 85: claiming at 62 yields approximately ${formatUSD(lifetimeTotal(4000, 62))} and claiming at 70 yields approximately ${formatUSD(lifetimeTotal(4000, 70))}. The lifetime difference is approximately ${formatUSD(lifetimeTotal(4000, 70) - lifetimeTotal(4000, 62))} in favor of waiting — and this grows even larger when COLA adjustments are factored in, since the higher base amount compounds more aggressively.`,
      },
      {
        question: 'Is Social Security still important if I have a $4,000 PIA?',
        answer:
          'Absolutely. Even for high earners, Social Security provides a guaranteed, inflation-adjusted income floor that cannot be outlived. At $4,000 PIA, claiming at 70 provides $59,520 per year — a substantial amount of guaranteed income. This reduces the withdrawal rate needed from investment portfolios and provides protection against market downturns, inflation, and longevity risk. Social Security is particularly valuable because it is one of the few sources of true lifetime inflation-adjusted income.',
      },
    ],
  },
  {
    slug: '4873',
    pia: 4873,
    piaFormatted: '$4,873',
    description:
      'A $4,873 monthly PIA is the approximate maximum PIA for 2026, achievable only by those who earned at or above the taxable maximum ($168,600 in 2026) for at least 35 years. At FRA, you receive $4,873 per month or $58,476 per year. At 62, this drops to $3,411; at 70, it reaches the maximum possible benefit of approximately $6,042 per month.',
    benefitAtEachAge: buildBenefitTable(4873),
    lifetimeComparison: buildLifetimeComparison(4873),
    faqs: [
      {
        question: 'What is the maximum Social Security benefit in 2026?',
        answer:
          'The maximum Social Security benefit in 2026 depends on when you claim. At age 62, the maximum is approximately $3,411 per month. At FRA (67), it is approximately $4,873 per month. At age 70, the maximum is approximately $6,042 per month ($4,873 x 1.24). Achieving these maximums requires earning at or above the Social Security taxable maximum for at least 35 years.',
      },
      {
        question: 'How do I qualify for the maximum Social Security benefit?',
        answer:
          'To receive the maximum PIA of approximately $4,873 in 2026, you must have earned at or above the taxable earnings cap (which varies by year and is $168,600 in 2026) for at least 35 years. Since the cap has changed over the decades, workers who consistently earned at the top of the wage scale throughout their career are most likely to qualify. Even one low-earning or zero-earning year out of 35 will reduce your PIA below the maximum.',
      },
      {
        question: 'Is the maximum Social Security benefit enough to retire on?',
        answer:
          `Even at the maximum PIA of $4,873/month ($58,476/year at FRA), Social Security replaces a much lower percentage of pre-retirement income for high earners than it does for lower earners. Someone who earned $168,600 is replacing only about 35% of their income with Social Security. However, at age 70, the maximum benefit of approximately $6,042/month ($72,504/year) provides substantial guaranteed income. Most maximum-benefit recipients also have significant other retirement assets. Over a retirement from 70 to 85, the maximum benefit provides approximately ${formatUSD(lifetimeTotal(4873, 70))} before COLA.`,
      },
    ],
  },
];
