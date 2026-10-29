import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  AlertCircle,
  CalendarDays,
  Sparkles,
  BookOpen,
  ArrowRightLeft,
  CheckCircle2,
  Info,
  ArrowLeft,
} from 'lucide-react';
import {
  AcademicCalendarConfig,
  DayOfWeek,
  Holiday,
  Subject,
  SubstitutedPeriod,
  TimetableSlot,
} from '../types';
import { calculateWorkingDays } from '../utils/calculations';

interface TimetableHolidaysProps {
  subjects: Subject[];
  calendarConfig: AcademicCalendarConfig;
  holidays: Holiday[];
  timetable: TimetableSlot[];
  substitutedPeriods: SubstitutedPeriod[];
  onBack: () => void;
  onUpdateCalendarConfig: (config: AcademicCalendarConfig) => void;
  onAddHoliday: (holiday: Omit<Holiday, 'id'>) => void;
  onDeleteHoliday: (id: string) => void;
  onUpdateTimetableSlot: (day: DayOfWeek, periodIndex: number, subjectId: string) => void;
  onAddSubstitutedPeriod: (sub: Omit<SubstitutedPeriod, 'id'>) => void;
  onDeleteSubstitutedPeriod: (id: string) => void;
}

const DAYS_OF_WEEK: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const PERIOD_TIMES = [
  '09:00 - 09:55 (P1)',
  '09:55 - 10:50 (P2)',
  '11:05 - 12:00 (P3)',
  '12:00 - 12:55 (P4)',
  '01:55 - 02:50 (P5)',
  '02:50 - 03:45 (P6)',
];

export const TimetableHolidays: React.FC<TimetableHolidaysProps> = ({
  subjects,
  calendarConfig,
  holidays,
  timetable,
  substitutedPeriods,
  onBack,
  onUpdateCalendarConfig,
  onAddHoliday,
  onDeleteHoliday,
  onUpdateTimetableSlot,
  onAddSubstitutedPeriod,
  onDeleteSubstitutedPeriod,
}) => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'timetable' | 'holidays' | 'substitutions'>('timetable');

  // Add holiday form state
  const [newHolidayName, setNewHolidayName] = useState('');
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newHolidayType, setNewHolidayType] = useState<Holiday['type']>('strike');
  const [newHolidayDesc, setNewHolidayDesc] = useState('');

  // Add substitution form state
  const [subDate, setSubDate] = useState(new Date().toISOString().split('T')[0]);
  const [subPeriod, setSubPeriod] = useState(0);
  const [subOrigSub, setSubOrigSub] = useState(subjects[0]?.id || '');
  const [subNewSub, setSubNewSub] = useState(subjects[1]?.id || '');
  const [subReason, setSubReason] = useState('');

  // Working days breakdown calculation
  const workingDaysStats = calculateWorkingDays(
    calendarConfig.semesterStartDate,
    calendarConfig.semesterEndDate,
    holidays
  );

  const getSubjectById = (id: string) => subjects.find((s) => s.id === id);

  const getSlotSubject = (day: DayOfWeek, periodIndex: number): Subject | undefined => {
    const slot = timetable.find((t) => t.day === day && t.periodIndex === periodIndex);
    return slot ? getSubjectById(slot.subjectId) : undefined;
  };

  const handleCreateHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolidayName.trim() || !newHolidayDate) return;

    onAddHoliday({
      name: newHolidayName.trim(),
      date: newHolidayDate,
      type: newHolidayType,
      description: newHolidayDesc.trim(),
    });

    setNewHolidayName('');
    setNewHolidayDate('');
    setNewHolidayDesc('');
  };

  const handleCreateSubstitution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subOrigSub || !subNewSub) return;

    onAddSubstitutedPeriod({
      date: subDate,
      periodIndex: Number(subPeriod),
      originalSubjectId: subOrigSub,
      newSubjectId: subNewSub,
      reason: subReason.trim() || 'Faculty adjustment / syllabus catchup',
    });

    setSubReason('');
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

        <span className="text-xs text-slate-500 font-medium">
          KTU Schedule & Calendar
        </span>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-sky-100 pb-3">
        <h2 className="text-lg font-bold text-slate-800">
          Timetable & KTU Holidays
        </h2>

        <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('timetable')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'timetable'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Timetable
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Working Days ({workingDaysStats.netWorkingDays})
          </button>
          <button
            onClick={() => setActiveTab('holidays')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'holidays'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mark Holidays ({holidays.length})
          </button>
          <button
            onClick={() => setActiveTab('substitutions')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'substitutions'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Substitutions
          </button>
        </div>
      </div>

      {/* 1. WEEKLY TIMETABLE TAB */}
      {activeTab === 'timetable' && (
        <div className="space-y-4">

          <div className="bg-white rounded-xl border border-sky-100 shadow-xs overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-3 w-24 text-center">Day</th>
                  {PERIOD_TIMES.map((time, idx) => (
                    <th key={idx} className="py-3 px-3 text-center">
                      <span className="block font-bold text-slate-700">Period {idx + 1}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{time.split(' ')[0]}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {DAYS_OF_WEEK.map((day) => (
                  <tr key={day} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800 text-center bg-slate-50/30 border-r border-slate-100">
                      {day}
                    </td>
                    {[0, 1, 2, 3, 4, 5].map((periodIndex) => {
                      const currentSub = getSlotSubject(day, periodIndex);
                      return (
                        <td key={periodIndex} className="p-2 text-center">
                          <select
                            value={currentSub?.id || ''}
                            onChange={(e) => onUpdateTimetableSlot(day, periodIndex, e.target.value)}
                            className={`w-full py-2 px-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer truncate ${
                              currentSub
                                ? 'bg-sky-50/80 border-sky-200 text-sky-900 hover:border-sky-400'
                                : 'bg-slate-50 border-dashed border-slate-200 text-slate-400 hover:border-slate-300'
                            }`}
                          >
                            <option value="">-- Free / Nil --</option>
                            {subjects.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.code}: {s.name.slice(0, 18)}
                              </option>
                            ))}
                          </select>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Subject weekly periods load indicator */}
          <div className="bg-white rounded-xl border border-sky-100 p-4 shadow-xs">
            <h4 className="text-xs font-bold text-slate-700 mb-2">Weekly Class Distribution</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {subjects.map((sub) => {
                const count = timetable.filter((t) => t.subjectId === sub.id).length;
                return (
                  <div key={sub.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                    <span className="font-mono text-xs font-bold text-sky-700 block">{sub.code}</span>
                    <span className="text-sm font-bold text-slate-800 tabular-nums">{count}</span>
                    <span className="text-[10px] text-slate-400 block">hrs/week</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. WORKING DAYS & ACADEMIC CALENDAR TAB */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          {/* Working Days Analytics Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-sky-100 p-4 shadow-xs">
              <span className="text-xs font-medium text-slate-500 block">Net KTU Working Days</span>
              <span className="text-2xl font-bold text-sky-700 tabular-nums">
                {workingDaysStats.netWorkingDays} <span className="text-xs font-normal text-slate-400">days</span>
              </span>
              <span className="text-[11px] text-emerald-600 block mt-1">
                Target: {calendarConfig.totalWorkingDaysExpected} days required
              </span>
            </div>

            <div className="bg-white rounded-xl border border-sky-100 p-4 shadow-xs">
              <span className="text-xs font-medium text-slate-500 block">Public Holidays</span>
              <span className="text-2xl font-bold text-slate-800 tabular-nums">
                {workingDaysStats.publicHolidayDays} <span className="text-xs font-normal text-slate-400">days</span>
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">Kerala Gazetted calendar</span>
            </div>

            <div className="bg-white rounded-xl border border-sky-100 p-4 shadow-xs">
              <span className="text-xs font-medium text-slate-500 block">Strikes & Closures</span>
              <span className="text-2xl font-bold text-amber-600 tabular-nums">
                {workingDaysStats.userHolidayDays} <span className="text-xs font-normal text-slate-400">days</span>
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">Hartals, Fests, Red Alerts</span>
            </div>

            <div className="bg-white rounded-xl border border-sky-100 p-4 shadow-xs">
              <span className="text-xs font-medium text-slate-500 block">Weekend Holidays</span>
              <span className="text-2xl font-bold text-slate-600 tabular-nums">
                {workingDaysStats.weekendDays} <span className="text-xs font-normal text-slate-400">days</span>
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">Saturdays & Sundays</span>
            </div>
          </div>

          {/* Academic Semester Dates Config Card */}
          <div className="bg-white rounded-xl border border-sky-100 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800">
              Semester Duration & Target Working Days
            </h3>
            <p className="text-xs text-slate-500">
              Update the academic semester commencement and closing dates according to the official KTU Academic Calendar.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Semester Start Date
                </label>
                <input
                  type="date"
                  value={calendarConfig.semesterStartDate}
                  onChange={(e) =>
                    onUpdateCalendarConfig({ ...calendarConfig, semesterStartDate: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Semester End Date
                </label>
                <input
                  type="date"
                  value={calendarConfig.semesterEndDate}
                  onChange={(e) =>
                    onUpdateCalendarConfig({ ...calendarConfig, semesterEndDate: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expected Working Days
                </label>
                <input
                  type="number"
                  min="50"
                  max="120"
                  value={calendarConfig.totalWorkingDaysExpected}
                  onChange={(e) =>
                    onUpdateCalendarConfig({
                      ...calendarConfig,
                      totalWorkingDaysExpected: parseInt(e.target.value) || 75,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500 tabular-nums"
                />
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-500 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Total Calendar Span: <strong>{workingDaysStats.totalCalendarDays} days</strong> | Net Instructional Days:{' '}
                <strong>{workingDaysStats.netWorkingDays} days</strong>.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. PUBLIC HOLIDAYS & COLLEGE STRIKES TAB */}
      {activeTab === 'holidays' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Add Holiday / Closure Form */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-sky-100 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              Add Holiday, Strike or Closure
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter unexpected college closures, hartals, student strikes, or college fest holidays.
            </p>

            <form onSubmit={handleCreateHoliday} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Event Name / Reason</label>
                <input
                  type="text"
                  value={newHolidayName}
                  onChange={(e) => setNewHolidayName(e.target.value)}
                  placeholder="e.g. Student Union Strike / Monsoon Red Alert"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newHolidayDate}
                    onChange={(e) => setNewHolidayDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newHolidayType}
                    onChange={(e) => setNewHolidayType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="strike">Student Strike</option>
                    <option value="hartal">State Hartal / Bandh</option>
                    <option value="college_fest">College Fest / Sports</option>
                    <option value="unexpected">Rain / Red Alert Closure</option>
                    <option value="public">Gazetted Public Holiday</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Note</label>
                <input
                  type="text"
                  value={newHolidayDesc}
                  onChange={(e) => setNewHolidayDesc(e.target.value)}
                  placeholder="e.g. Declared by District Collector"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 mt-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save to Academic Calendar</span>
              </button>
            </form>
          </div>

          {/* Holiday List */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-sky-100 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800">
                Scheduled Holidays & Closures ({holidays.length})
              </h3>
              <span className="text-[11px] text-slate-400">Automatically deducted from working days</span>
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {holidays
                .slice()
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((holiday) => {
                  const isPublic = holiday.type === 'public';
                  const isStrike = holiday.type === 'strike' || holiday.type === 'hartal';

                  return (
                    <div
                      key={holiday.id}
                      className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{holiday.name}</span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              isPublic
                                ? 'bg-sky-100 text-sky-800'
                                : isStrike
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {holiday.type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Date: <span className="font-mono">{holiday.date}</span>
                          {holiday.description && ` · ${holiday.description}`}
                        </p>
                      </div>

                      <button
                        onClick={() => onDeleteHoliday(holiday.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Remove holiday"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* 4. SUBSTITUTED PERIODS TAB */}
      {activeTab === 'substitutions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Add Substitution Form */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-sky-100 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              Log Period Substitution
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              When a timetable hour was replaced by another teacher or subject for syllabus compensation.
            </p>

            <form onSubmit={handleCreateSubstitution} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={subDate}
                    onChange={(e) => setSubDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Period Hour</label>
                  <select
                    value={subPeriod}
                    onChange={(e) => setSubPeriod(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500"
                  >
                    {[0, 1, 2, 3, 4, 5].map((p) => (
                      <option key={p} value={p}>
                        Period {p + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Original Timetable Subject</label>
                <select
                  value={subOrigSub}
                  onChange={(e) => setSubOrigSub(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code}: {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Substituted (Replacement) Subject</label>
                <select
                  value={subNewSub}
                  onChange={(e) => setSubNewSub(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code}: {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason / Explanation</label>
                <input
                  type="text"
                  value={subReason}
                  onChange={(e) => setSubReason(e.target.value)}
                  placeholder="e.g. Faculty on university evaluation duty"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 mt-2"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Record Substitution</span>
              </button>
            </form>
          </div>

          {/* Substituted Periods List */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-sky-100 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-3">
              Recorded Substitutions ({substitutedPeriods.length})
            </h3>

            {substitutedPeriods.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No substitutions recorded yet. Regular timetable applies.
              </div>
            ) : (
              <div className="space-y-2">
                {substitutedPeriods.map((sub) => {
                  const orig = getSubjectById(sub.originalSubjectId);
                  const replacement = getSubjectById(sub.newSubjectId);

                  return (
                    <div
                      key={sub.id}
                      className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-500">{sub.date}</span>
                          <span className="font-semibold text-slate-700">Period {sub.periodIndex + 1}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-800 font-medium">
                          <span className="line-through text-slate-400 font-mono">{orig?.code || 'Original'}</span>
                          <span>→</span>
                          <span className="font-mono text-sky-700 font-bold">{replacement?.code || 'Replaced'}</span>
                          <span className="text-slate-500">({replacement?.name})</span>
                        </div>
                        {sub.reason && <p className="text-[11px] text-slate-400">{sub.reason}</p>}
                      </div>

                      <button
                        onClick={() => onDeleteSubstitutedPeriod(sub.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Delete substitution"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
