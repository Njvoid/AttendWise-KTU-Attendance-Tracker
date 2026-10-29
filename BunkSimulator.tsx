import React, { useState } from 'react';
import {
  Calculator,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  ArrowRight,
  Info,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { Subject } from '../types';
import { calculateSubjectMetrics } from '../utils/calculations';

interface BunkSimulatorProps {
  subjects: Subject[];
  targetPercentage?: number;
}

export const BunkSimulator: React.FC<BunkSimulatorProps> = ({
  subjects,
  targetPercentage = 75,
}) => {
  // Map of subjectId to hypothetical missed classes
  const [hypotheticalMisses, setHypotheticalMisses] = useState<Record<string, number>>(
    {}
  );
  const [generalMissDays, setGeneralMissDays] = useState(0);

  const getHypotheticalMiss = (subId: string) => hypotheticalMisses[subId] || 0;

  const handleAdjustMiss = (subId: string, delta: number) => {
    const current = getHypotheticalMiss(subId);
    const updated = Math.max(0, current + delta);
    setHypotheticalMisses({
      ...hypotheticalMisses,
      [subId]: updated,
    });
  };

  const handleReset = () => {
    setHypotheticalMisses({});
    setGeneralMissDays(0);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hero Explainer */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-sky-50 text-sky-700 rounded-xl">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                "What-If" Bunk & Leave Simulator
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
                Simulate skipping future classes to predict if your attendance will remain safe (≥ 75%)
                or trigger KTU medical condonation fees before you actually take the leave!
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="self-start sm:self-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Reset Simulator
          </button>
        </div>
      </div>

      {/* Simulator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject) => {
          const currentMetrics = calculateSubjectMetrics(
            subject.attendedClasses,
            subject.totalConducted,
            targetPercentage
          );

          const plannedMisses = getHypotheticalMiss(subject.id);
          // Simulated metrics: total conducted increases by planned misses, attended stays same
          const simConducted = subject.totalConducted + plannedMisses;
          const simAttended = subject.attendedClasses;
          const simMetrics = calculateSubjectMetrics(simAttended, simConducted, targetPercentage);

          const pctDelta = simMetrics.percentage - currentMetrics.percentage;

          return (
            <div
              key={subject.id}
              className={`bg-white rounded-xl border p-5 transition-all shadow-xs flex flex-col justify-between ${
                simMetrics.status === 'safe'
                  ? 'border-sky-100 hover:border-sky-300'
                  : simMetrics.status === 'condonation'
                  ? 'border-amber-200 bg-amber-50/20'
                  : 'border-rose-200 bg-rose-50/20'
              }`}
            >
              <div>
                {/* Course Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
                      {subject.code}
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 mt-1 line-clamp-1">
                      {subject.name}
                    </h4>
                  </div>
                  <span className="text-xs text-slate-400">
                    Max Safe: <strong>{currentMetrics.safeBunkCount}</strong>
                  </span>
                </div>

                {/* Before vs After Comparison */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100 mb-3 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">
                      Current
                    </span>
                    <span className="text-base font-bold text-slate-700 tabular-nums">
                      {currentMetrics.percentage.toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {subject.attendedClasses}/{subject.totalConducted}
                    </span>
                  </div>

                  <div className="border-l border-slate-200 pl-2">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">
                      Simulated
                    </span>
                    <span
                      className={`text-base font-extrabold tabular-nums ${
                        simMetrics.status === 'safe'
                          ? 'text-sky-700'
                          : simMetrics.status === 'condonation'
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {simMetrics.percentage.toFixed(1)}%
                    </span>
                    <span
                      className={`text-[10px] font-semibold tabular-nums ${
                        pctDelta === 0
                          ? 'text-slate-400'
                          : 'text-rose-500'
                      }`}
                    >
                      {pctDelta === 0 ? 'No change' : `${pctDelta.toFixed(1)}%`}
                    </span>
                  </div>
                </div>

                {/* Status Callout */}
                <div className="mb-3">
                  {simMetrics.status === 'safe' ? (
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>
                        Safe to bunk! Remaining buffer: {simMetrics.safeBunkCount} class(es).
                      </span>
                    </div>
                  ) : simMetrics.status === 'condonation' ? (
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>
                        Drops into condonation! Requires fine ~₹{simMetrics.condonationFee}.
                      </span>
                    </div>
                  ) : (
                    <div className="p-2 rounded-lg bg-rose-50 text-rose-900 border border-rose-200 text-xs flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>
                        Critical shortage (&lt; 60%)! Semester detention risk.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Adjust planned misses */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">
                  Simulate Misses:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAdjustMiss(subject.id, -1)}
                    disabled={plannedMisses <= 0}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold text-sm flex items-center justify-center transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-sm text-slate-800 w-5 text-center">
                    {plannedMisses}
                  </span>
                  <button
                    onClick={() => handleAdjustMiss(subject.id, 1)}
                    className="w-7 h-7 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold text-sm flex items-center justify-center transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Note */}
      <div className="bg-sky-50/70 border border-sky-200/60 rounded-xl p-4 text-xs text-sky-900 flex items-start gap-3">
        <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">How KTU Attendance is Computed</p>
          <p className="text-sky-800 mt-0.5">
            Under KTU regulations, every period conducted in the university syllabus contributes equally to the total denominator.
            Missing one 1-hour class in a 36-hour semester syllabus drops your percentage by nearly ~2.8%.
          </p>
        </div>
      </div>
    </div>
  );
};
