# Validation Test Cases

This document provides three test cases with expected results based on official SSA formulas and publications.

## Test Case 1: Benefit Reduction at Age 62 (Birth Year 1960+)

**Source:** [SSA.gov — Early or Late Retirement](https://www.ssa.gov/benefits/retirement/planner/agereduction.html)

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

**Source:** [SSA.gov — Delayed Retirement Credits](https://www.ssa.gov/benefits/retirement/planner/delayret.html)

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

**Source:** [SSA.gov — Primary Insurance Amount](https://www.ssa.gov/oact/cola/piaformula.html)

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
- [SSA Full Retirement Age Table](https://www.ssa.gov/benefits/retirement/planner/ageincrease.html)
- [SSA PIA Formula](https://www.ssa.gov/oact/cola/piaformula.html)
