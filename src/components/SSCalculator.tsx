import { useState, useMemo } from 'react';
import {
  calculatePIA,
  calculateBenefitAtAge,
  compareClaimingAges,
  findOptimalAge,
  calculateSpousalBenefit,
  type ClaimingAgeResult,
} from '@/lib/engine';
import { getFRAAge, DEFAULT_COLA } from '@/lib/ssa-rates-2026';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function SSCalculator() {
  const [inputMode, setInputMode] = useState<'pia' | 'aime'>('pia');
  const [piaInput, setPiaInput] = useState('2000');
  const [aimeInput, setAimeInput] = useState('6000');
  const [birthYear, setBirthYear] = useState('1960');
  const [lifeExpectancy, setLifeExpectancy] = useState('85');
  const [colaRate, setColaRate] = useState('2.5');
  const [maritalStatus, setMaritalStatus] = useState<'single' | 'married'>('single');
  const [spousePIA, setSpousePIA] = useState('0');
  const [spouseClaimAge, setSpouseClaimAge] = useState('67');
  const [showResults, setShowResults] = useState(false);

  const pia = useMemo(() => {
    if (inputMode === 'pia') {
      return parseFloat(piaInput) || 0;
    }
    return calculatePIA(parseFloat(aimeInput) || 0);
  }, [inputMode, piaInput, aimeInput]);

  const birthYearNum = parseInt(birthYear) || 1960;
  const lifeExp = parseFloat(lifeExpectancy) || 85;
  const cola = (parseFloat(colaRate) || 2.5) / 100;
  const fra = getFRAAge(birthYearNum);

  const results = useMemo(() => {
    if (!showResults || pia <= 0) return [];
    return compareClaimingAges(pia, birthYearNum, lifeExp, cola);
  }, [showResults, pia, birthYearNum, lifeExp, cola]);

  const optimalAge = useMemo(() => {
    if (!showResults || pia <= 0) return 67;
    return findOptimalAge(pia, birthYearNum, lifeExp, cola);
  }, [showResults, pia, birthYearNum, lifeExp, cola]);

  const spousalResults = useMemo(() => {
    if (!showResults || maritalStatus !== 'married') return null;
    const workerPIAVal = pia;
    const spousePIAVal = parseFloat(spousePIA) || 0;
    const spouseAge = parseInt(spouseClaimAge) || 67;
    return {
      spousalBenefit: calculateSpousalBenefit(workerPIAVal, spousePIAVal, spouseAge, birthYearNum),
      spouseOwnBenefit: calculateBenefitAtAge(spousePIAVal, birthYearNum, spouseAge),
    };
  }, [showResults, maritalStatus, pia, spousePIA, spouseClaimAge, birthYearNum]);

  const maxLifetime = useMemo(() => {
    if (results.length === 0) return 1;
    return Math.max(...results.map((r) => r.lifetimeTotal));
  }, [results]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  return (
    <div className="space-y-8">
      {/* Calculator Form */}
      <form onSubmit={handleCalculate} className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Social Security Claiming Age Calculator</h2>

        {/* Input Mode Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Input Type</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setInputMode('pia')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                inputMode === 'pia'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              I know my PIA
            </button>
            <button
              type="button"
              onClick={() => setInputMode('aime')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                inputMode === 'aime'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              I know my AIME
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PIA or AIME Input */}
          {inputMode === 'pia' ? (
            <div>
              <label htmlFor="pia" className="block text-sm font-medium text-gray-700 mb-1">
                Monthly PIA ($)
              </label>
              <input
                id="pia"
                type="number"
                min="0"
                max="5000"
                step="1"
                value={piaInput}
                onChange={(e) => { setPiaInput(e.target.value); setShowResults(false); }}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">Find on your SSA statement (ssa.gov/myaccount)</p>
            </div>
          ) : (
            <div>
              <label htmlFor="aime" className="block text-sm font-medium text-gray-700 mb-1">
                Average Indexed Monthly Earnings ($)
              </label>
              <input
                id="aime"
                type="number"
                min="0"
                max="15000"
                step="1"
                value={aimeInput}
                onChange={(e) => { setAimeInput(e.target.value); setShowResults(false); }}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">Calculated PIA: {formatCurrency(pia)}/month</p>
            </div>
          )}

          {/* Birth Year */}
          <div>
            <label htmlFor="birthYear" className="block text-sm font-medium text-gray-700 mb-1">
              Birth Year
            </label>
            <input
              id="birthYear"
              type="number"
              min="1940"
              max="1975"
              step="1"
              value={birthYear}
              onChange={(e) => { setBirthYear(e.target.value); setShowResults(false); }}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">Your Full Retirement Age: {fra.toFixed(fra % 1 === 0 ? 0 : 1)} years</p>
          </div>

          {/* Life Expectancy */}
          <div>
            <label htmlFor="lifeExpectancy" className="block text-sm font-medium text-gray-700 mb-1">
              Life Expectancy (age)
            </label>
            <input
              id="lifeExpectancy"
              type="number"
              min="62"
              max="110"
              step="1"
              value={lifeExpectancy}
              onChange={(e) => { setLifeExpectancy(e.target.value); setShowResults(false); }}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">Average: ~84 (women), ~79 (men)</p>
          </div>

          {/* COLA Rate */}
          <div>
            <label htmlFor="cola" className="block text-sm font-medium text-gray-700 mb-1">
              Assumed Annual COLA (%)
            </label>
            <input
              id="cola"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={colaRate}
              onChange={(e) => { setColaRate(e.target.value); setShowResults(false); }}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">Historical average: ~2.5%</p>
          </div>
        </div>

        {/* Marital Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => { setMaritalStatus('single'); setShowResults(false); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                maritalStatus === 'single'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Single / Divorced
            </button>
            <button
              type="button"
              onClick={() => { setMaritalStatus('married'); setShowResults(false); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                maritalStatus === 'married'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Married
            </button>
          </div>
        </div>

        {/* Spousal Inputs */}
        {maritalStatus === 'married' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-blue-50 rounded-lg">
            <div>
              <label htmlFor="spousePIA" className="block text-sm font-medium text-gray-700 mb-1">
                Spouse&apos;s Monthly PIA ($)
              </label>
              <input
                id="spousePIA"
                type="number"
                min="0"
                max="5000"
                step="1"
                value={spousePIA}
                onChange={(e) => { setSpousePIA(e.target.value); setShowResults(false); }}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">Enter 0 if spouse has no work history</p>
            </div>
            <div>
              <label htmlFor="spouseClaimAge" className="block text-sm font-medium text-gray-700 mb-1">
                Spouse&apos;s Claiming Age
              </label>
              <input
                id="spouseClaimAge"
                type="number"
                min="62"
                max="70"
                step="1"
                value={spouseClaimAge}
                onChange={(e) => { setSpouseClaimAge(e.target.value); setShowResults(false); }}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors text-lg"
        >
          Calculate Optimal Claiming Age
        </button>
      </form>

      {/* Results */}
      {showResults && results.length > 0 && (
        <div className="space-y-8">
          {/* Optimal Age Callout */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <p className="text-sm text-blue-600 font-medium mb-1">Based on your inputs, the optimal claiming age is</p>
            <p className="text-5xl font-bold text-primary">{optimalAge}</p>
            <p className="text-sm text-gray-600 mt-2">
              This maximizes your estimated lifetime benefits of{' '}
              <strong>{formatCurrency(results.find((r) => r.claimAge === optimalAge)?.lifetimeTotal ?? 0)}</strong>
            </p>
          </div>

          {/* Spousal Result */}
          {spousalResults && maritalStatus === 'married' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Spousal Benefit Estimate</h3>
              <p className="text-gray-700">
                Spouse&apos;s estimated monthly benefit: <strong>{formatCurrency(spousalResults.spousalBenefit)}</strong>
              </p>
              {spousalResults.spousalBenefit > spousalResults.spouseOwnBenefit && (
                <p className="text-sm text-gray-500 mt-1">
                  Based on 50% of your PIA (higher than spouse&apos;s own benefit of {formatCurrency(spousalResults.spouseOwnBenefit)})
                </p>
              )}
            </div>
          )}

          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estimated Lifetime Benefits by Claiming Age</h3>
            <div className="space-y-3">
              {results.map((r) => (
                <div key={r.claimAge} className="flex items-center gap-3">
                  <span className={`w-8 text-right text-sm font-medium ${r.claimAge === optimalAge ? 'text-primary font-bold' : 'text-gray-600'}`}>
                    {r.claimAge}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                    <div
                      className={`h-full rounded-full flex items-center px-3 text-white text-xs font-medium transition-all ${
                        r.claimAge === optimalAge ? 'bg-primary' : 'bg-primary-light'
                      }`}
                      style={{ width: `${(r.lifetimeTotal / maxLifetime) * 100}%`, minWidth: '80px' }}
                    >
                      {formatCurrency(r.lifetimeTotal)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Comparison Table */}
          <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="p-6 pb-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Comparison Table</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-border">
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Claim Age</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">% of PIA</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">Monthly</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">Annual</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">Lifetime Total</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">Break-Even vs 62</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr
                      key={r.claimAge}
                      className={`border-b border-gray-100 ${r.claimAge === optimalAge ? 'bg-blue-50 font-semibold' : 'hover:bg-gray-50'}`}
                    >
                      <td className="px-4 py-3">
                        {r.claimAge}
                        {r.claimAge === optimalAge && (
                          <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">Best</span>
                        )}
                        {r.claimAge === Math.round(fra) && (
                          <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">FRA</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">{r.percentOfPIA}%</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(r.monthlyBenefit)}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(r.annualBenefit)}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(r.lifetimeTotal)}</td>
                      <td className="px-4 py-3 text-right">
                        {r.claimAge === 62 ? '—' : `Age ${r.breakEvenVs62}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
            <strong>Important:</strong> These estimates are for educational purposes only and should not be considered
            financial advice. Actual benefits depend on your complete earnings record, future COLAs, and other factors.
            Consult your Social Security statement at{' '}
            <a href="https://www.ssa.gov/myaccount/" target="_blank" rel="noopener noreferrer" className="underline">
              ssa.gov/myaccount
            </a>{' '}
            and consider speaking with a financial advisor.
          </div>
        </div>
      )}
    </div>
  );
}
