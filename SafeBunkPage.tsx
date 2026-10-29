import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
} from 'lucide-react';
import { Subject } from '../types';
import { calculateSubjectMetrics, calculateTotalMetrics } from '../utils/calculations';

interface SafeBunkPageProps {
  subjects: Subject[];
  targetPercentage?: number;
  onBack: () => void;
  onUpdateSubject: (subject: Subject) => void;
  onAddSubject: (subject: Omit<Subject, 'id'>) => void;
  onDeleteSubject: (subjectId: string) => void;
}

export const SafeBunkPage: React.FC<SafeBunkPageProps> = ({
  subjects,
  targetPercentage = 75,
  onBack,
  onUpdateSubject,
  onAddSubject,
  onDeleteSubject,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // New subject state
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newAttended, setNewAttended] = useState(25);
  const [newConducted, setNewConducted] = useState(30);

  const totalMetrics = calculateTotalMetrics(subjects, targetPercentage);
  const totalMissed = totalMetrics.totalConducted - totalMetrics.totalAttended;

  const handleQuickAdjust = (subject: Subject, type: 'present' | 'absent') => {
    if (type === 'present') {
      onUpdateSubject({
        ...subject,
        attendedClasses: subject.attendedClasses + 1,
        totalConducted: subject.totalConducted + 1,
      });
    } else {
      onUpdateSubject({
        ...subject,
        totalConducted: subject.totalConducted + 1,
      });
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) return;
    onAddSubject({
      code: newCode.trim().toUpperCase(),
      name: newName.trim(),
      faculty: 'Faculty',
      credits: 3,
      attendedClasses: Number(newAttended) || 0,
      totalConducted: Number(newConducted) || 1,
      color: '#0284c7',
    });
    setNewCode('');
    setNewName('');
    setNewAttended(25);
    setNewConducted(30);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header with Back Button */}
      <div className="flex items-center justify-between border-b border-sky-100 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Subject</span>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">
          Safe Bunks & Subject Status
        </h1>
        <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
          KTU 75% Cutoff
        </span>
      </div>

      {/* 1. Total Attended Days & Missed Days Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-sky-200/80 p-3.5 shadow-xs text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Attended</span>
          <span className="text-xl font-extrabold text-sky-700 tabular-nums">
            {totalMetrics.totalAttended}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-rose-200/80 p-3.5 shadow-xs text-center">
          <span className="text-[10px] font-bold text-rose-400 uppercase block">Missed</span>
          <span className="text-xl font-extrabold text-rose-600 tabular-nums">
            {totalMissed}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-sky-200/80 p-3.5 shadow-xs text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Conducted</span>
          <span className="text-xl font-extrabold text-slate-800 tabular-nums">
            {totalMetrics.totalConducted}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-sky-200/80 p-3.5 shadow-xs text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Overall %</span>
          <span
            className={`text-xl font-extrabold tabular-nums ${
              totalMetrics.percentage >= 75 ? 'text-sky-700' : 'text-rose-600'
            }`}
          >
            {totalMetrics.percentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* 2. Subjects with Attendance, Missed, and How Much Classes Can Be Skipped */}
      <div className="space-y-3 pt-2">
        <h2 className="text-base font-bold text-slate-900">
          Subject Breakdown & Safe Skip Margin
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((subject) => {
            const metrics = calculateSubjectMetrics(
              subject.attendedClasses,
              subject.totalConducted,
              targetPercentage
            );
            const missedInSubject = subject.totalConducted - subject.attendedClasses;
            const isBelow75 = metrics.percentage < 75;

            return (
              <div
                key={subject.id}
                className={`bg-white rounded-xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                  isBelow75
                    ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-300'
                    : 'border-sky-200/80 hover:border-sky-300'
                }`}
              >
                <div>
                  {/* Subject code, name & percentage */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                          {subject.code}
                        </span>
                        {isBelow75 ? (
                          <span className="text-[11px] font-bold text-rose-700 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full">
                            Risk (&lt; 75%)
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-sky-700 bg-sky-100 border border-sky-300 px-2 py-0.5 rounded-full">
                            Safe Zone
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">
                        {subject.name}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <div
                        className={`text-xl font-extrabold tabular-nums ${
                          isBelow75 ? 'text-rose-600' : 'text-sky-700'
                        }`}
                      >
                        {metrics.percentage.toFixed(1)}%
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {subject.attendedClasses}/{subject.totalConducted} classes
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="my-2.5 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isBelow75 ? 'bg-rose-500' : 'bg-sky-600'
                      }`}
                      style={{ width: `${Math.min(100, metrics.percentage)}%` }}
                    />
                  </div>

                  {/* Attended & Missed line */}
                  <div className="flex items-center justify-between text-xs text-slate-600 py-1">
                    <span>
                      Attended: <strong className="text-slate-800">{subject.attendedClasses}</strong>
                    </span>
                    <span>
                      Missed: <strong className="text-rose-600">{missedInSubject}</strong>
                    </span>
                  </div>

                  {/* SAFE BUNK / CLASSES CAN BE SKIPPED SAFELY */}
                  {!isBelow75 ? (
                    <div className="mt-3 p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-sky-600 shrink-0" />
                        <div>
                          <span className="font-extrabold text-sky-950 block">
                            Can safely skip: {metrics.safeBunkCount} class{metrics.safeBunkCount === 1 ? '' : 'es'}
                          </span>
                          <span className="text-[10px] text-sky-700 font-bold">
                            Stays &ge; 75%
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold text-sky-700 bg-white border border-sky-200 px-2 py-0.5 rounded-full">
                        SAFE
                      </span>
                    </div>
                  ) : (
                    /* HIGHLIGHTED RED IF BELOW 75 AND CONDONATION ALERT */
                    <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border-2 border-rose-400 text-rose-900 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-black text-rose-700">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>ALERT: Condonation has to be paid!</span>
                      </div>
                      <div className="text-[11px] font-bold text-rose-800 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>Must attend next {metrics.recoveryCount} classes to reach 75%</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick adjustments */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleQuickAdjust(subject, 'present')}
                      className="px-2.5 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                      <span>+1 Attended</span>
                    </button>
                    <button
                      onClick={() => handleQuickAdjust(subject, 'absent')}
                      className="px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                      <span>+1 Missed</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingSubject(subject)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                      title="Edit subject"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteSubject(subject.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                      title="Delete subject"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Modal */}
      {editingSubject && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-sky-100">
            <h3 className="text-base font-bold text-slate-900 mb-3">
              Edit: {editingSubject.code}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  value={editingSubject.name}
                  onChange={(e) =>
                    setEditingSubject({ ...editingSubject, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Attended Classes
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingSubject.attendedClasses}
                    onChange={(e) =>
                      setEditingSubject({
                        ...editingSubject,
                        attendedClasses: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Conducted
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingSubject.totalConducted}
                    onChange={(e) =>
                      setEditingSubject({
                        ...editingSubject,
                        totalConducted: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingSubject(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSubject(editingSubject);
                    setEditingSubject(null);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-sky-100">
            <h3 className="text-base font-bold text-slate-900 mb-3">Add Subject</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. CST 304"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Operating Systems"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Attended
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newAttended}
                    onChange={(e) => setNewAttended(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Conducted
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newConducted}
                    onChange={(e) => setNewConducted(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Add Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
