import React, { useState } from 'react';
import { PoundSterling } from 'lucide-react';

export const UkSalaryCalculatorTool: React.FC = () => {
  const [salary, setSalary] = useState<number>(45000);
  const [pensionPercent, setPensionPercent] = useState<number>(5);
  const [studentLoan, setStudentLoan] = useState<string>('plan2');

  const pensionContribution = (salary * pensionPercent) / 100;
  const taxableGross = Math.max(0, salary - pensionContribution);

  let personalAllowance = 12570;
  if (taxableGross > 100000) {
    const excess = taxableGross - 100000;
    personalAllowance = Math.max(0, 12570 - excess / 2);
  }

  let tax = 0;
  if (taxableGross > personalAllowance) {
    const basicTaxable = Math.min(taxableGross - personalAllowance, 37700);
    tax += basicTaxable * 0.20;

    if (taxableGross > 50270) {
      const higherTaxable = Math.min(taxableGross - 50270, 74870);
      tax += higherTaxable * 0.40;

      if (taxableGross > 125140) {
        const addTaxable = taxableGross - 125140;
        tax += addTaxable * 0.45;
      }
    }
  }

  let ni = 0;
  if (taxableGross > 12570) {
    const mainNiBand = Math.min(taxableGross - 12570, 37700);
    ni += mainNiBand * 0.08;

    if (taxableGross > 50270) {
      ni += (taxableGross - 50270) * 0.02;
    }
  }

  let slDeduction = 0;
  if (studentLoan === 'plan1' && taxableGross > 24990) {
    slDeduction = (taxableGross - 24990) * 0.09;
  } else if (studentLoan === 'plan2' && taxableGross > 27295) {
    slDeduction = (taxableGross - 27295) * 0.09;
  } else if (studentLoan === 'plan4' && taxableGross > 31395) {
    slDeduction = (taxableGross - 31395) * 0.09;
  } else if (studentLoan === 'plan5' && taxableGross > 25000) {
    slDeduction = (taxableGross - 25000) * 0.09;
  } else if (studentLoan === 'postgrad' && taxableGross > 21000) {
    slDeduction = (taxableGross - 21000) * 0.06;
  }

  const totalDeductions = tax + ni + pensionContribution + slDeduction;
  const netSalary = Math.max(0, salary - totalDeductions);

  const formatGbp = (val: number) => {
    return '£' + Math.round(val).toLocaleString('en-GB');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-3">
          <PoundSterling className="h-3.5 w-3.5" />
          <span>UK Finance & Tax Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          UK Take-Home Pay Calculator
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
          Ad-free, clean UK salary calculator with updated Income Tax, NI, Student Loans, and Pension sacrifice.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Gross Annual Salary
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">£</span>
              <input
                type="number"
                step="1000"
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-8 pr-3 py-2.5 text-sm font-bold text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
              <span>Pension Sacrifice:</span>
              <span className="text-blue-400">{pensionPercent}% ({formatGbp(pensionContribution)}/yr)</span>
            </div>
            <input
              type="range"
              min={0}
              max={25}
              value={pensionPercent}
              onChange={(e) => setPensionPercent(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Student Loan Plan
            </label>
            <select
              value={studentLoan}
              onChange={(e) => setStudentLoan(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs font-medium text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="none">No Student Loan</option>
              <option value="plan2">Plan 2 (Started 2012–2023)</option>
              <option value="plan5">Plan 5 (Started 2023+)</option>
              <option value="plan1">Plan 1 (Pre-2012)</option>
              <option value="plan4">Plan 4 (Scotland)</option>
              <option value="postgrad">Postgraduate Loan</option>
            </select>
          </div>
        </div>

        {/* Results summary card */}
        <div className="md:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 flex flex-col justify-between shadow-xl">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Estimated Take-Home Pay
            </span>
            <div className="flex items-baseline gap-2 mt-1 mb-6">
              <span className="text-4xl sm:text-5xl font-black text-white">
                {formatGbp(netSalary / 12)}
              </span>
              <span className="text-slate-400 text-sm font-semibold">/ month</span>
            </div>

            {/* Breakdown table */}
            <div className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Gross Salary:</span>
                <span className="font-semibold text-white">{formatGbp(salary)}</span>
              </div>
              <div className="flex justify-between text-red-400">
                <span>Income Tax (PAYE):</span>
                <span>-{formatGbp(tax)}</span>
              </div>
              <div className="flex justify-between text-red-400">
                <span>National Insurance:</span>
                <span>-{formatGbp(ni)}</span>
              </div>
              {pensionContribution > 0 && (
                <div className="flex justify-between text-blue-400">
                  <span>Pension Contribution:</span>
                  <span>-{formatGbp(pensionContribution)}</span>
                </div>
              )}
              {slDeduction > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>Student Loan Repayment:</span>
                  <span>-{formatGbp(slDeduction)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-6 mt-4 border-t border-slate-800 text-center">
            <div className="bg-slate-950/60 p-2.5 rounded-xl">
              <p className="text-[10px] text-slate-500 font-bold">ANNUAL</p>
              <p className="text-sm font-bold text-white mt-0.5">{formatGbp(netSalary)}</p>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl">
              <p className="text-[10px] text-slate-500 font-bold">WEEKLY</p>
              <p className="text-sm font-bold text-white mt-0.5">{formatGbp(netSalary / 52)}</p>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl">
              <p className="text-[10px] text-slate-500 font-bold">DAILY (5d/wk)</p>
              <p className="text-sm font-bold text-white mt-0.5">{formatGbp(netSalary / 260)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
