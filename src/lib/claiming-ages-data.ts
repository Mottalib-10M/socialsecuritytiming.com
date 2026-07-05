/**
 * Claiming age data for programmatic SEO pages.
 * Each entry represents a claiming age from 62 to 70 with
 * reduction/credit percentages, strategy context, break-even info, and FAQs.
 * Based on FRA = 67 (birth year 1960+).
 */

export interface ClaimingAgeFAQ {
  question: string;
  answer: string;
}

export interface ClaimingAgeEntry {
  slug: string;
  age: number;
  reductionOrCredit: number; // negative = reduction, positive = credit (percentage)
  percentOfPIA: number;
  description: string;
  strategy: string;
  breakEvenVsFRA: string;
  faqs: ClaimingAgeFAQ[];
}

export const claimingAgesData: ClaimingAgeEntry[] = [
  {
    slug: 'age-62',
    age: 62,
    reductionOrCredit: -30,
    percentOfPIA: 70,
    description:
      'Age 62 is the earliest you can claim Social Security retirement benefits. Claiming at 62 means filing 60 months before your Full Retirement Age of 67, resulting in a permanent 30% reduction to your monthly benefit. You will receive 70% of your PIA for the rest of your life.',
    strategy:
      'Claiming at 62 may make sense if you have health concerns that limit your life expectancy, if you need the income immediately because you have no other savings or income sources, or if you plan to invest the benefits and earn returns that outpace the 8% annual delayed retirement credit. However, for most people who expect to live into their 80s, claiming at 62 results in significantly lower lifetime benefits. If you are still working, the earnings test may also temporarily reduce your benefits before FRA.',
    breakEvenVsFRA:
      'If you claim at 62 instead of waiting until FRA at 67, you will collect benefits for 5 extra years. However, each monthly check is 30% smaller. The break-even age is typically around 78 to 80 — if you live past that age, you would have been better off waiting until 67.',
    faqs: [
      {
        question: 'How much will my Social Security be reduced if I claim at 62?',
        answer:
          'If your Full Retirement Age is 67 (birth year 1960 or later), claiming at 62 permanently reduces your benefit by 30%. The reduction is calculated as 5/9 of 1% per month for the first 36 months early (20% total), plus 5/12 of 1% per month for the remaining 24 months (10% total). For example, if your PIA is $2,000, you would receive $1,400 per month at age 62.',
      },
      {
        question: 'Can I work while collecting Social Security at 62?',
        answer:
          'Yes, but if you earn more than $22,320 in 2026 (the earnings test limit), $1 in benefits is withheld for every $2 you earn above the threshold. Once you reach FRA, the earnings test no longer applies and your benefit is recalculated to give you credit for the months benefits were withheld. Working while collecting at 62 can temporarily reduce your payments.',
      },
      {
        question: 'Is claiming Social Security at 62 ever the right choice?',
        answer:
          'Claiming at 62 can be appropriate if you have a shortened life expectancy due to serious health conditions, if you are unable to work and have no other income sources to cover expenses, or if you are strategically bridging a financial gap before other retirement income begins. For married couples, the lower-earning spouse sometimes claims early while the higher earner delays to maximize the survivor benefit.',
      },
    ],
  },
  {
    slug: 'age-63',
    age: 63,
    reductionOrCredit: -25,
    percentOfPIA: 75,
    description:
      'Claiming at age 63 means filing 48 months before your Full Retirement Age of 67. This results in a permanent 25% reduction to your monthly benefit — you will receive 75% of your PIA. While this is less severe than the 30% reduction at age 62, it is still a substantial permanent cut.',
    strategy:
      'Claiming at 63 offers a slight improvement over age 62 (5% more of your PIA) while still providing relatively early access to benefits. This age may suit people who retired at 62 but had enough savings to cover one year before needing Social Security income. Waiting even one additional year from 62 to 63 can make a meaningful difference in monthly income over a multi-decade retirement.',
    breakEvenVsFRA:
      'Compared to claiming at FRA (67), you collect benefits for 4 extra years but at a 25% reduction. The break-even age versus FRA is typically around age 78 to 79. If you expect to live past 79, waiting until at least FRA would yield more in lifetime benefits.',
    faqs: [
      {
        question: 'What is the benefit reduction for claiming Social Security at 63?',
        answer:
          'At age 63 with an FRA of 67, you are claiming 48 months early. The reduction is 5/9 of 1% for the first 36 months (20%) plus 5/12 of 1% for the remaining 12 months (5%), totaling a 25% reduction. You receive 75% of your PIA. For a PIA of $2,000, your monthly benefit would be $1,500.',
      },
      {
        question: 'How much more do I get at 63 compared to 62?',
        answer:
          'Claiming at 63 gives you 75% of your PIA, compared to 70% at age 62. That is a 5 percentage-point increase, or about 7.1% more per month than the age-62 benefit. For a $2,000 PIA, this translates to $100 more per month ($1,500 vs $1,400) or $1,200 more per year for the rest of your life.',
      },
      {
        question: 'Should I claim at 63 or wait longer?',
        answer:
          'If you can afford to wait, delaying past 63 will increase your benefit further. Each year you wait between 62 and 67 adds roughly 5-6.7% to your benefit, and each year past 67 adds 8%. However, if you need income now and cannot bridge the gap with savings, claiming at 63 is reasonable — especially if your health or family history suggests a shorter life expectancy.',
      },
    ],
  },
  {
    slug: 'age-64',
    age: 64,
    reductionOrCredit: -20,
    percentOfPIA: 80,
    description:
      'Claiming Social Security at age 64 means filing 36 months before your Full Retirement Age of 67. This results in a permanent 20% reduction — you receive 80% of your PIA. At 64, you have crossed below the 36-month threshold where only the higher reduction rate (5/9 of 1% per month) applies.',
    strategy:
      'Age 64 is a common claiming age for people who retire in their early 60s and have exhausted one to two years of savings before needing Social Security income. Receiving 80% of your PIA is a significant improvement over the 70% at age 62. For people who plan to supplement Social Security with part-time work or modest withdrawals from retirement accounts, claiming at 64 can provide a reasonable income floor.',
    breakEvenVsFRA:
      'Compared to waiting until FRA at 67, claiming at 64 gives you 3 extra years of benefits at a 20% reduction. The break-even age is approximately 79 to 80. If you live into your early 80s or beyond, the higher FRA benefit would have produced more lifetime income.',
    faqs: [
      {
        question: 'How is the 20% reduction at age 64 calculated?',
        answer:
          'At age 64 with an FRA of 67, you are exactly 36 months early. The entire reduction falls within the first-tier rate of 5/9 of 1% per month. So 36 months times 5/9 of 1% equals 20%. You receive 80% of your PIA. For example, a $2,500 PIA yields a $2,000 monthly benefit at age 64.',
      },
      {
        question: 'Is age 64 a good time to claim Social Security?',
        answer:
          'Age 64 can be a sensible choice if you have recently retired and need income, but can afford a slight delay from 62. You gain 10 percentage points of PIA compared to claiming at 62. However, if you are in good health and have other income sources to bridge the gap, each additional year of delay increases your benefit by roughly 6.7% per year until FRA, and 8% per year after FRA.',
      },
      {
        question: 'What is the break-even age if I claim at 64 instead of 67?',
        answer:
          'The break-even age for claiming at 64 versus 67 is typically around 79 to 80 years old. Before that age, you come out ahead by having collected 3 extra years of (reduced) benefits. After 80, the higher monthly benefit from waiting until FRA results in more cumulative lifetime income. If you expect to live past 80, waiting may be the better financial decision.',
      },
    ],
  },
  {
    slug: 'age-65',
    age: 65,
    reductionOrCredit: -13.34,
    percentOfPIA: 86.66,
    description:
      'Claiming at age 65 means filing 24 months before your Full Retirement Age of 67, resulting in approximately a 13.34% reduction. You receive about 86.67% of your PIA. While 65 was historically the "normal" retirement age, for those born in 1960 or later, FRA has shifted to 67.',
    strategy:
      'Age 65 remains a psychologically significant milestone — it is when most people become eligible for Medicare. Coordinating Medicare enrollment with Social Security claiming at 65 is a common approach. At 86.67% of PIA, the reduction is moderate, and for many people, this represents a good balance between receiving benefits relatively early and minimizing the permanent reduction. Consider that Medicare Part B premiums can be deducted from your Social Security check, simplifying your finances.',
    breakEvenVsFRA:
      'Compared to FRA at 67, claiming at 65 gives you 2 extra years of benefits at a 13.34% reduction. The break-even age is roughly 79 to 81. Since most 65-year-olds today can expect to live well into their 80s, waiting until at least FRA is often financially advantageous.',
    faqs: [
      {
        question: 'Why is 65 no longer the Full Retirement Age?',
        answer:
          'The Full Retirement Age was gradually increased by Congress through the 1983 Social Security Amendments. For people born in 1960 or later, FRA is 67. The change was made to account for increasing life expectancy and to improve the long-term financial health of the Social Security trust fund. While 65 is still the age for Medicare eligibility, it is no longer the age at which you receive your full, unreduced Social Security benefit.',
      },
      {
        question: 'How much is Social Security reduced at age 65?',
        answer:
          'With an FRA of 67, claiming at 65 is 24 months early. The reduction is 24 months times 5/9 of 1% per month, which equals 13.34%. You receive approximately 86.67% of your PIA. For a PIA of $2,000, your monthly benefit at 65 would be approximately $1,733.',
      },
      {
        question: 'Should I sign up for Social Security when I enroll in Medicare at 65?',
        answer:
          'Not necessarily. Medicare and Social Security are separate programs with separate enrollment decisions. You can enroll in Medicare at 65 while delaying Social Security benefits to receive a higher monthly amount later. However, if you are already receiving Social Security, you will be automatically enrolled in Medicare Part A at 65. If you delay Social Security, you should still actively sign up for Medicare during your initial enrollment period to avoid late-enrollment penalties.',
      },
    ],
  },
  {
    slug: 'age-66',
    age: 66,
    reductionOrCredit: -6.67,
    percentOfPIA: 93.33,
    description:
      'Claiming at age 66 means filing 12 months before your Full Retirement Age of 67, resulting in approximately a 6.67% reduction. You receive about 93.33% of your PIA. This is a relatively small reduction, and age 66 was the FRA for people born between 1943 and 1954.',
    strategy:
      'At 93.33% of PIA, claiming at 66 provides nearly your full benefit with only one year of reduction. This can be an excellent choice for people who have stopped working and want to start benefits just a year earlier than FRA. The difference between 66 and 67 is modest — only 6.67% — so if you need the income, the trade-off is relatively small. However, remember that delaying from 66 to 70 would increase your benefit from 93.33% to 124% of PIA, a gain of more than 30 percentage points.',
    breakEvenVsFRA:
      'The break-even age for claiming at 66 versus 67 is roughly 79 to 80. Because the difference in monthly benefit is only 6.67%, it takes longer in relative terms for the FRA benefit to overtake the age-66 total. However, the absolute dollar difference grows every year you live past the break-even point.',
    faqs: [
      {
        question: 'How much is my Social Security reduced if I claim at 66 instead of 67?',
        answer:
          'Claiming at 66 with an FRA of 67 results in a 6.67% reduction (12 months times 5/9 of 1%). You receive 93.33% of your PIA. For a PIA of $2,000, you would get approximately $1,867 per month instead of $2,000 at FRA. That is $133 less per month, or $1,596 less per year, for the rest of your life.',
      },
      {
        question: 'Was 66 the Full Retirement Age for some people?',
        answer:
          'Yes, age 66 was the Full Retirement Age for people born between 1943 and 1954. For those born between 1955 and 1959, FRA is between 66 and 2 months and 66 and 10 months. For those born in 1960 or later, FRA is 67. This means someone born in 1954 gets their full PIA at 66, while someone born in 1960 gets only 93.33% at the same age.',
      },
      {
        question: 'Is it worth waiting one more year from 66 to 67?',
        answer:
          'Waiting from 66 to 67 increases your benefit by about 7.1% (from 93.33% to 100% of PIA). For a $2,000 PIA, that is an additional $133 per month for life. If you expect to live past 80, the extra year of waiting typically pays off. However, the decision depends on your personal financial situation, health, and whether you need the income at 66.',
      },
    ],
  },
  {
    slug: 'age-67',
    age: 67,
    reductionOrCredit: 0,
    percentOfPIA: 100,
    description:
      'Age 67 is the Full Retirement Age (FRA) for anyone born in 1960 or later. Claiming at FRA means you receive exactly 100% of your Primary Insurance Amount (PIA) with no reduction and no delayed retirement credits. This is the baseline against which all early and late claiming adjustments are measured.',
    strategy:
      'Claiming at FRA provides the full, unreduced benefit that your earnings record has earned. This is the neutral option — no penalty for claiming early, but no bonus for delaying either. For many people, FRA is a natural claiming point, especially if they have just retired or plan to retire at 67. However, if you can afford to wait, each year of delay from 67 to 70 adds 8% in delayed retirement credits, which is a guaranteed, inflation-adjusted increase that is difficult to match with other investments.',
    breakEvenVsFRA:
      'Since 67 is the FRA, this is the reference point. Claiming at FRA means you receive 100% of your PIA with no break-even calculation needed against itself. The key question is whether to delay further — the break-even age for waiting from 67 to 70 is typically around 82 to 83.',
    faqs: [
      {
        question: 'What does Full Retirement Age mean for Social Security?',
        answer:
          'Full Retirement Age (FRA) is the age at which you are entitled to receive 100% of your Primary Insurance Amount (PIA) — your full, unreduced Social Security retirement benefit. For people born in 1960 or later, FRA is 67. FRA serves as the baseline: claiming before FRA permanently reduces your benefit, while delaying past FRA permanently increases it through delayed retirement credits.',
      },
      {
        question: 'Should I claim at 67 or wait until 70?',
        answer:
          'Delaying from 67 to 70 increases your monthly benefit by 24% (8% per year for 3 years). The break-even age is typically around 82 to 83. If you expect to live past 83 — which is likely for a healthy 67-year-old — delaying to 70 maximizes your lifetime benefits. However, if you need the income at 67, have health concerns, or prefer to invest the benefits, claiming at FRA is a perfectly reasonable choice.',
      },
      {
        question: 'Is the earnings test still in effect at age 67?',
        answer:
          'No. The Social Security earnings test only applies before your Full Retirement Age. Once you reach FRA (67 for those born 1960+), you can earn any amount of employment income without any reduction to your Social Security benefits. This is one advantage of waiting until FRA to claim — you can work as much as you want without the earnings test affecting your benefits.',
      },
    ],
  },
  {
    slug: 'age-68',
    age: 68,
    reductionOrCredit: 8,
    percentOfPIA: 108,
    description:
      'Claiming at age 68 means delaying 12 months past your Full Retirement Age of 67. You earn Delayed Retirement Credits (DRC) of 8% per year, giving you 108% of your PIA. This is the first year past FRA where delayed credits begin to significantly boost your benefit.',
    strategy:
      'Delaying to 68 is an excellent first step for people who want a higher benefit but are not sure they can wait all the way to 70. The 8% increase from one year of delayed credits is a guaranteed, inflation-adjusted return on the benefits you forgo. This is generally superior to what you could earn in a low-risk investment. If you are still working at 68 and do not need Social Security income, delaying is almost always beneficial. For married couples, the higher earner delaying to at least 68 can meaningfully increase the survivor benefit.',
    breakEvenVsFRA:
      'The break-even age for claiming at 68 versus FRA (67) is typically around 79 to 80. You forgo one year of benefits ($24,000 at a $2,000 PIA) in exchange for 8% more per month for life. If you live past 80, the delay to 68 pays off.',
    faqs: [
      {
        question: 'How much more do I get by waiting until 68?',
        answer:
          'By delaying one year past FRA to age 68, you receive 108% of your PIA thanks to Delayed Retirement Credits of 8% per year. For a PIA of $2,000, your monthly benefit at 68 would be $2,160 — $160 more per month, or $1,920 more per year, than claiming at FRA. This increase is permanent and adjusts with future COLAs.',
      },
      {
        question: 'Are Delayed Retirement Credits guaranteed?',
        answer:
          'Yes. Delayed Retirement Credits are a statutory provision of Social Security law, not dependent on market performance or investment returns. The 8% per year increase (2/3 of 1% per month) for delaying past FRA is guaranteed, permanent, and inflation-adjusted through annual COLA increases. It is one of the most reliable returns available in retirement planning.',
      },
      {
        question: 'Should I delay to 68 or go all the way to 70?',
        answer:
          'If you can afford to delay to 68, the same logic applies for delaying further. Each additional year to 70 adds another 8%, giving you 116% at 69 and 124% at 70. The decision depends on your health, financial needs, and life expectancy. If you are uncertain, 68 is a good compromise that captures one year of delayed credits while still starting benefits earlier than 70.',
      },
    ],
  },
  {
    slug: 'age-69',
    age: 69,
    reductionOrCredit: 16,
    percentOfPIA: 116,
    description:
      'Claiming at age 69 means delaying 24 months past your Full Retirement Age of 67. With two years of Delayed Retirement Credits at 8% per year, you receive 116% of your PIA. This represents a substantial increase over the FRA benefit.',
    strategy:
      'Delaying to 69 captures two full years of delayed credits, resulting in a 16% permanent increase over your FRA benefit. This strategy is particularly powerful for higher earners whose PIA is near the maximum, as the 16% increase applies to a larger base amount. For married couples, if the higher earner delays to 69, the survivor benefit is also 16% larger, providing significant income protection for the surviving spouse. The main risk is forgoing two years of benefits — if you pass away before the break-even age, you would have collected more by claiming earlier.',
    breakEvenVsFRA:
      'The break-even age for claiming at 69 versus FRA (67) is typically around 81 to 82. You forgo two full years of FRA benefits in exchange for 16% higher monthly payments for life. If you live into your mid-80s or beyond — which is probable for a healthy person at 67 — this delay is financially rewarding.',
    faqs: [
      {
        question: 'How much is my Social Security benefit at age 69?',
        answer:
          'At age 69, you receive 116% of your PIA thanks to 24 months of Delayed Retirement Credits. For a PIA of $2,000, your monthly benefit would be $2,320 — $320 more per month than at FRA. Over a 20-year retirement to age 89, this extra $320 per month adds up to more than $76,800 in additional income (not counting COLA adjustments, which make it even more).',
      },
      {
        question: 'Why not wait one more year to 70 instead of claiming at 69?',
        answer:
          'Waiting from 69 to 70 adds another 8% credit, bringing your benefit to 124% of PIA. Whether to wait that final year depends on your specific situation. If you need income at 69 or have health concerns, claiming at 69 with its 116% benefit is still an excellent outcome. But if you can bridge one more year with savings, the additional 8% provides another permanent, inflation-adjusted increase.',
      },
      {
        question: 'Does delaying to 69 affect my spouse\'s benefits?',
        answer:
          'Delaying your own benefit to 69 does not directly increase your spouse\'s spousal benefit (which is capped at 50% of your PIA regardless of when you claim). However, it does increase the survivor benefit. If you pass away, your surviving spouse can receive up to 100% of your enhanced benefit — at 69, that is 116% of your PIA rather than 100%. This makes delaying especially valuable for the higher earner in a couple.',
      },
    ],
  },
  {
    slug: 'age-70',
    age: 70,
    reductionOrCredit: 24,
    percentOfPIA: 124,
    description:
      'Age 70 is the latest age at which delayed retirement credits accrue. Claiming at 70 gives you the maximum possible benefit: 124% of your PIA for someone born in 1960 or later (FRA of 67). There is no additional benefit for delaying past 70, so you should always claim by 70 at the latest.',
    strategy:
      'Claiming at 70 maximizes your monthly Social Security check and is the optimal strategy for anyone who expects to live into their mid-80s or beyond. The 24% increase over FRA is permanent, inflation-adjusted through annual COLAs, and guaranteed by law. This strategy is particularly powerful for married couples where the higher earner delays to 70 — it maximizes both the retirement benefit and the eventual survivor benefit for the lower-earning spouse. The main trade-off is forgoing 3 years of FRA-level benefits (or 8 years of reduced benefits from age 62), requiring either continued work or savings to bridge the income gap.',
    breakEvenVsFRA:
      'The break-even age for claiming at 70 versus FRA (67) is typically around 82 to 83. You forgo 3 years of full benefits ($72,000 at a $2,000 PIA) in exchange for 24% higher payments for life. Since the average life expectancy for a 67-year-old is approximately 85 for men and 87 for women, the majority of people who reach 67 will live past the break-even age, making 70 the statistically optimal choice for maximizing lifetime benefits.',
    faqs: [
      {
        question: 'What is the maximum Social Security benefit at age 70 in 2026?',
        answer:
          'The maximum possible Social Security benefit at age 70 in 2026 is approximately $5,108 per month. This requires earning at or above the taxable maximum ($168,600 in 2026) for at least 35 years, resulting in the maximum PIA of approximately $4,873, enhanced by 24% delayed retirement credits. Most people will receive less than this maximum, but the 24% boost from delaying to 70 applies to whatever your PIA is.',
      },
      {
        question: 'Is there any reason to wait past age 70 to claim Social Security?',
        answer:
          'No. Delayed Retirement Credits stop accruing at age 70. There is absolutely no financial benefit to delaying past 70, and doing so means you are leaving money on the table. If you have not yet claimed by 70, you should file immediately. You may be able to receive up to 6 months of retroactive benefits if you file shortly after 70, but it is best to file at or just before your 70th birthday.',
      },
      {
        question: 'How does claiming at 70 compare to claiming at 62?',
        answer:
          'The difference is dramatic. At 62, you receive 70% of your PIA; at 70, you receive 124% — a 77% larger monthly check (124/70 = 1.77). For a $2,000 PIA, that is $1,400/month at 62 versus $2,480/month at 70, a difference of $1,080 per month or $12,960 per year. The break-even age for 62 versus 70 is typically around 80 to 83. If you live to 85 or beyond, claiming at 70 can result in tens of thousands of dollars more in lifetime benefits.',
      },
    ],
  },
];
