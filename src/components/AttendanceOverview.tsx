import React, { useState } from 'react';
import {
  PieChart as PieChartIcon,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Info,
  ShieldAlert,
  GraduationCap,
  Sparkles,
  ChevronDown,
  Check,
  X,
} from 'lucide-react';
import { Subject } from '../types';
import { calculateSubjectMetrics, calculateTotalMetrics } from '../utils/calculations';
import { PieChartDonut } from './PieChartDonut';

interface AttendanceOverviewProps {
  subjects: Subject[];
  targetPercentage: number;
  onUpdateSubject: (subject: Subject) => void;
  onAddSubject: (subject: Omit<Subject, 'id'>) => void;
  onDeleteSubject: (subjectId: string) => void;
}

export const AttendanceOverview: React.FC<AttendanceOverviewProps> = ({
  subjects,
  targetPercentage,
  onUpdateSubject,
  onAddSubject,
  onDeleteSubject,
}) => {
  const [filter, setFilter] = useState<'all' | 'risk' | 'safe'>('all');
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New subject state
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newFaculty, setNewFaculty] = useState('');
  const [newCredits, setNewCredits] = useState(3);
  const [newAttended, setNewAttended] = useState(25);
  const [newConducted, setNewConducted] = useState(30);
  const [newIsLab, setNewIsLab] = useState(false);

  const totalMetrics = calculateTotalMetrics(subjects, targetPercentage);

  const filteredSubjects = subjects.filter((s) => {
    const m = calculateSubjectMetrics(s.attendedClasses, s.totalConducted, targetPercentage);
    if (filter === 'risk') return m.status !== 'safe';
    if (filter === 'safe') return m.status === 'safe';
    return true;
  });

  const handleQuickAdjust = (subject: Subject, type: 'attended_plus' | 'attended_minus' | 'conducted_plus') => {
    let updatedAttended = subject.attendedClasses;
    let updatedConducted = subject.totalConducted;

    if (type === 'attended_plus') {
      updatedAttended += 1;
      updatedConducted += 1;
    } else if (type === 'conducted_plus') {
      // Marked as absent (conducted increases, attended stays)
      updatedConducted += 1;
    } else if (type === 'attended_minus') {
      if (updatedAttended > 0) {
        updatedAttended -= 1;
        updatedConducted = Math.max(0, updatedConducted - 1);
      }
    }

    onUpdateSubject({
      ...subject,
      attendedClasses: updatedAttended,
      totalConducted: updatedConducted,
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject) return;
    onUpdateSubject(editingSubject);
    setEditingSubject(null);
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) return;

    onAddSubject({
      code: newCode.trim().toUpperCase(),
      name: newName.trim(),
      faculty: newFaculty.trim() || 'Department Faculty',
      credits: Number(newCredits) || 3,
      attendedClasses: Number(newAttended) || 0,
      totalConducted: Number(newConducted) || 0,
      color: newIsLab ? '#0891b2' : '#0284c7',
      isLab: newIsLab,
    });

    // Reset
    setNewCode('');
    setNewName('');
    setNewFaculty('');
    setNewCredits(3);
    setNewAttended(25);
    setNewConducted(30);
    setNewIsLab(false);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Overall Attendance Hero Panel with Pie Chart */}
      <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-6 sm:p-8 relative overflow-hidden">
        {/* Soft light blue header background accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-50/70 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Pie Chart section */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-sky-50/50 to-white rounded-2xl border border-sky-100/70">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-sky-800 uppercase tracking-wider">
              <PieChartIcon className="w-4 h-4 text-sky-600" />
              <span>KTU Overall Aggregate</span>
            </div>

            <PieChartDonut
              percentage={totalMetrics.percentage}
              targetPercentage={targetPercentage}
              attended={totalMetrics.totalAttended}
              total={totalMetrics.totalConducted}
              size={200}
              strokeWidth={18}
            />

            <p className="text-center text-xs text-slate-500 mt-4 max-w-xs">
              Based on {totalMetrics.totalConducted} total conducted hours across {subjects.length} semester subjects.
            </p>
          </div>

          {/* Aggregate Stats & Bunk/Recovery Highlights */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-700">
                <GraduationCap className="w-4 h-4" />
                <span>B.Tech Semester Compliance</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mt-1">
                {totalMetrics.percentage >= 75 ? (
                  <span className="text-emerald-700">Exam Eligible & Safe Zone</span>
                ) : totalMetrics.percentage >= 60 ? (
                  <span className="text-amber-700">Condonation Threshold Alert</span>
                ) : (
                  <span className="text-rose-700">Critical Attendance Shortage</span>
                )}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {totalMetrics.percentage >= 75
                  ? `Your aggregate attendance is comfortably above KTU's required 75.0%. Maintain this margin till the end-semester exam notification.`
                  : totalMetrics.percentage >= 60
                  ? `Your overall attendance is in the condonation bracket (60% - 74.9%). University regulations require condonation fee and approved medical reasons.`
                  : `Your aggregate attendance is below 60%. KTU Ordinance strictly prohibits examination registration for attendance below 60%.`}
              </p>
            </div>

            {/* Quick KPI grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3">
                <span className="text-[11px] font-medium text-slate-500 block">Attended</span>
                <span className="text-lg font-bold text-slate-800 tabular-nums">
                  {totalMetrics.totalAttended} <span className="text-xs text-slate-400 font-normal">hrs</span>
                </span>
              </div>

              <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3">
                <span className="text-[11px] font-medium text-slate-500 block">Missed / Bunked</span>
                <span className="text-lg font-bold text-slate-800 tabular-nums">
                  {totalMetrics.totalConducted - totalMetrics.totalAttended}{' '}
                  <span className="text-xs text-slate-400 font-normal">hrs</span>
                </span>
              </div>

              <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3">
                <span className="text-[11px] font-medium text-slate-500 block">Safe Bunk Margin</span>
                <span className="text-lg font-bold text-sky-700 tabular-nums">
                  {totalMetrics.safeBunkCount > 0 ? `+${totalMetrics.safeBunkCount}` : '0'}{' '}
                  <span className="text-xs text-slate-400 font-normal">hrs</span>
                </span>
              </div>

              <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3">
                <span className="text-[11px] font-medium text-slate-500 block">Subjects at Risk</span>
                <span
                  className={`text-lg font-bold tabular-nums ${
                    totalMetrics.subjectsAtRiskCount > 0 ? 'text-amber-600' : 'text-emerald-600'
                  }`}
                >
                  {totalMetrics.subjectsAtRiskCount}{' '}
                  <span className="text-xs text-slate-400 font-normal">of {subjects.length}</span>
                </span>
              </div>
            </div>

            {/* Condonation fine / Alert notice if any subject at risk */}
            {totalMetrics.subjectsAtRiskCount > 0 ? (
              <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">
                    Attention: {totalMetrics.subjectsAtRiskCount} subject(s) currently require condonation (&lt; 75%)
                  </p>
                  <p className="text-amber-800">
                    KTU mandates submitting a valid medical certificate and paying an estimated fine of approximately{' '}
                    <strong className="underline">₹{totalMetrics.totalCondonationFee || 500}</strong> during exam portal registration.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0" />
                <div>
                  <p className="font-semibold text-sky-900">All subjects in Safe Zone</p>
                  <p className="text-sky-700">Zero condonation fees required. You are eligible for university hall ticket issuance.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Drag/Scroll Down: Subject-Wise Breakdown Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-800">Subject-Wise Breakdown</h3>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {subjects.length} courses
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Scroll down to inspect individual course percentages, safe bunk limits, and condonation alerts.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter buttons */}
            <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  filter === 'all' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                All ({subjects.length})
              </button>
              <button
                onClick={() => setFilter('risk')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  filter === 'risk' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                At Risk ({subjects.filter((s) => s.attendedClasses / (s.totalConducted || 1) < 0.75).length})
              </button>
              <button
                onClick={() => setFilter('safe')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  filter === 'safe' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Safe ({subjects.filter((s) => s.attendedClasses / (s.totalConducted || 1) >= 0.75).length})
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subject</span>
            </button>
          </div>
        </div>

        {/* List of Subject Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSubjects.map((subject) => {
            const metrics = calculateSubjectMetrics(subject.attendedClasses, subject.totalConducted, targetPercentage);
            const isSafe = metrics.status === 'safe';
            const isCondonation = metrics.status === 'condonation';
            const isCritical = metrics.status === 'critical';

            return (
              <div
                key={subject.id}
                className="bg-white rounded-xl border border-sky-100 shadow-xs p-5 hover:border-sky-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top line: Code, Name, Lab badge, Status Badge */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                          {subject.code}
                        </span>
                        {subject.isLab && (
                          <span className="text-[10px] font-semibold text-cyan-800 bg-cyan-50 border border-cyan-200 px-1.5 py-0.5 rounded">
                            Lab Practical
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">
                          {subject.credits} Credits
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 mt-1">
                        {subject.name}
                      </h4>
                      <p className="text-xs text-slate-500">{subject.faculty}</p>
                    </div>

                    {/* Percentage Display */}
                    <div className="text-right shrink-0">
                      <div
                        className={`text-xl font-extrabold tabular-nums ${
                          isSafe
                            ? 'text-sky-700'
                            : isCondonation
                            ? 'text-amber-600'
                            : 'text-rose-600'
                        }`}
                      >
                        {metrics.percentage.toFixed(1)}%
                      </div>
                      <span className="text-[11px] text-slate-400 tabular-nums">
                        {subject.attendedClasses} / {subject.totalConducted} classes
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar with 75% Target Line */}
                  <div className="my-3 relative">
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isSafe
                            ? 'bg-sky-600'
                            : isCondonation
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, metrics.percentage)}%` }}
                      />
                    </div>
                    {/* 75% tick marker */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-400/80 -translate-y-1 h-4.5"
                      style={{ left: '75%' }}
                      title="KTU 75% Mandatory Cutoff"
                    />
                  </div>

                  {/* Safe Bunk or Recovery Classes Indicator */}
                  <div className="mt-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    {isSafe ? (
                      <div className="flex items-center gap-2 text-sky-800">
                        <TrendingDown className="w-4 h-4 text-sky-600 shrink-0" />
                        <div>
                          <span className="font-semibold">
                            You can safely bunk {metrics.safeBunkCount} class{metrics.safeBunkCount === 1 ? '' : 'es'}
                          </span>
                          <span className="text-slate-500 block text-[11px]">
                            Attendance will remain above {targetPercentage}%
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-rose-800">
                        <TrendingUp className="w-4 h-4 text-rose-600 shrink-0" />
                        <div>
                          <span className="font-semibold">
                            Attend next {metrics.recoveryCount} class{metrics.recoveryCount === 1 ? '' : 'es'} consecutively
                          </span>
                          <span className="text-slate-500 block text-[11px]">
                            To pull back up to 75.0% without missing
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="shrink-0 text-right">
                      {isSafe ? (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          Eligible
                        </span>
                      ) : isCondonation ? (
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                          Condonation
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                          Shortage
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Condonation / Alert Warning Details */}
                  {isCondonation && (
                    <div className="mt-2 p-2 rounded-lg bg-amber-50/80 border border-amber-200/90 text-amber-900 text-[11px] flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Condonation alert:</strong> Percentage is below 75%. KTU requires a medical certificate and approval fee (~₹{metrics.condonationFee}).
                      </span>
                    </div>
                  )}

                  {isCritical && (
                    <div className="mt-2 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-[11px] flex items-start gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Critical alert:</strong> Percentage is below 60%. Not eligible for exam condonation under KTU Ordinances.
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Quick-Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 mr-1">Quick mark:</span>
                    <button
                      onClick={() => handleQuickAdjust(subject, 'attended_plus')}
                      title="Attended a class today (+1 Attended, +1 Conducted)"
                      className="px-2 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                      <span>+1 Present</span>
                    </button>
                    <button
                      onClick={() => handleQuickAdjust(subject, 'conducted_plus')}
                      title="Missed a class (+1 Conducted only)"
                      className="px-2 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                      <span>+1 Missed</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingSubject(subject)}
                      title="Edit subject classes"
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteSubject(subject.id)}
                      title="Remove subject"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSubjects.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200 p-6">
            <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-700">No subjects found for this filter</h4>
            <p className="text-xs text-slate-400 mt-1">Switch to "All" or add another course using the button above.</p>
          </div>
        )}
      </div>

      {/* Modal: Edit Subject */}
      {editingSubject && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-sky-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">
                Edit Subject: {editingSubject.code}
              </h3>
              <button
                onClick={() => setEditingSubject(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  value={editingSubject.name}
                  onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Faculty Name</label>
                <input
                  type="text"
                  value={editingSubject.faculty}
                  onChange={(e) => setEditingSubject({ ...editingSubject, faculty: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Attended Classes</label>
                  <input
                    type="number"
                    min="0"
                    max={editingSubject.totalConducted}
                    value={editingSubject.attendedClasses}
                    onChange={(e) =>
                      setEditingSubject({
                        ...editingSubject,
                        attendedClasses: Math.max(0, parseInt(e.target.value) || 0),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500 focus:bg-white tabular-nums"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Conducted</label>
                  <input
                    type="number"
                    min="1"
                    value={editingSubject.totalConducted}
                    onChange={(e) =>
                      setEditingSubject({
                        ...editingSubject,
                        totalConducted: Math.max(1, parseInt(e.target.value) || 1),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500 focus:bg-white tabular-nums"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingSubject(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Subject */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-sky-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">Add New KTU Course</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Course Code</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="e.g. CST 304"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 uppercase focus:ring-2 focus:ring-sky-500 focus:bg-white"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Course Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Operating Systems"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Faculty In-Charge</label>
                <input
                  type="text"
                  value={newFaculty}
                  onChange={(e) => setNewFaculty(e.target.value)}
                  placeholder="e.g. Prof. R. Varma"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={newCredits}
                    onChange={(e) => setNewCredits(parseInt(e.target.value) || 3)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500 focus:bg-white tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Attended</label>
                  <input
                    type="number"
                    min="0"
                    value={newAttended}
                    onChange={(e) => setNewAttended(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500 focus:bg-white tabular-nums"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total</label>
                  <input
                    type="number"
                    min="1"
                    value={newConducted}
                    onChange={(e) => setNewConducted(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500 focus:bg-white tabular-nums"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isLabCheck"
                  checked={newIsLab}
                  onChange={(e) => setNewIsLab(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 h-4 w-4"
                />
                <label htmlFor="isLabCheck" className="text-xs text-slate-700 font-medium">
                  This course is a Practical / Laboratory session
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
