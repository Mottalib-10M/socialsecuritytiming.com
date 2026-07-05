# Validation Test Cases — socialsecuritytiming.com

## Sources

- [SSA.gov — Early or Late Retirement](https://www.ssa.gov/benefits/retirement/planner/agereduction.html)
- [SSA.gov — Delayed Retirement Credits](https://www.ssa.gov/benefits/retirement/planner/delayret.html)
- [SSA.gov — Primary Insurance Amount](https://www.ssa.gov/oact/cola/piaformula.html)
- [SSA.gov — Full Retirement Age Table](https://www.ssa.gov/benefits/retirement/planner/ageincrease.html)

---

## Test Case 1: Benefit Reduction at Age 62 (Birth Year 1960+)

**Inputs:**
- PIA: $2,000/month
- Birth Year: 1962 (FRA = 67)
- Claiming Age: 62 (60 months early)

**Expected Result:**
- Reduction: First 36 months at 5/9 of 1% = 20.00%, next 24 months at 5/12 of 1% = 10.00%
- Total reduction: 30.00%
- Monthly benefit: $2,000 × 0.70 = **$1,400/month**

**Our Result:** $1,400/month ✓

---

## Test Case 2: Delayed Retirement Credits at Age 70 (Birth Year 1960+)

**Inputs:**
- PIA: $2,500/month
- Birth Year: 1960 (FRA = 67)
- Claiming Age: 70 (36 months past FRA)

**Expected Result:**
- DRC: 8% per year × 3 years = 24% increase
- Monthly benefit: $2,500 × 1.24 = **$3,100/month**

**Our Result:** $3,100/month ✓

---

## Test Case 3: PIA Calculation from AIME (2026 Bend Points)

**Inputs:**
- AIME: $6,000

**Expected Calculation:**
- 90% of first $1,174 = $1,056.60
- 32% of ($6,000 - $1,174) = 32% of $4,826 = $1,544.32
- Total = $2,600.92
- Truncated to lower dime = **$2,600.90**

**Our Result:** $2,600.90 ✓

---

## Additional Verification

These calculations can be cross-referenced with:
- [SSA Retirement Estimator](https://www.ssa.gov/benefits/retirement/estimator.html)
- [SSA Benefit Calculators](https://www.ssa.gov/benefits/calculators/)

---

## Build status

- **Build:** 30 pages, 0 errors
- **Tests:** 32/32 passed
- **Sitemap:** auto-generated (sitemap-index.xml)

## Page inventory (30 pages)

| Category | Count | Details |
|---|---|---|
| Home + legal | 3 | index, legal, privacy |
| Tool pages | 1 | faq |
| Guides index | 1 | /guides/ |
| Guide articles | 8 | when-to-claim-social-security, maximize-social-security, social-security-spousal-benefits, social-security-taxes, social-security-and-working, social-security-cola, social-security-survivor-benefits, social-security-break-even |
| Claiming age pages | 9 | claim-at-[age] (ages 62–70) |
| Benefit amount pages | 8 | benefit-[amount] (8 PIA levels) |

## Components

- SocialSecurityCalculator.tsx (claiming age optimizer with break-even analysis)

## Data files

- ssa-data-2026.ts — bend points, DRC rates, early reduction formulas, COLA
- claiming-ages-data.ts — 9 claiming age entries (62–70) with comparison tables
- benefit-amounts-data.ts — 8 benefit level entries with pre-calculated scenarios

## Quality gates

- [x] Build passes (30 pages, 0 errors)
- [x] Tests pass (32/32)
- [x] Sitemap generated
- [x] Schema.org on every page (WebApplication, FAQPage, BreadcrumbList)
- [x] Analytics: Plausible + GA4 placeholder
- [x] robots.txt present
- [x] llms.txt present
- [x] All guide pages > 1500 words
- [x] Disclaimer in footer
- [x] Mobile-responsive navigation (hamburger menu)
- [x] Internal cross-linking between tools and guides
