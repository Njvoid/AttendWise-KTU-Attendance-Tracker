import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Slash,
  CheckCheck,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';
import {
  AttendanceRecord,
  Holiday,
  Subject,
  SubstitutedPeriod,
  TimetableSlot,
} from '../types';
import { getDayOfWeekFromDate } from '../utils/calculations';

interface DailyAttendanceMarkerProps {
  subjects: Subject[];
  timetable: TimetableSlot[];
  holidays: Holiday[];
  substitutedPeriods: SubstitutedPeriod[];
  records: AttendanceRecord[];
  onBack: () => void;
  onMarkAttendance: (newRecords: AttendanceRecord[]) => void;
  onUpdateSubjectAttendance: (subjectId: string, deltaAttended: number, deltaConducted: number) => void;
}

export const DailyAttendanceMarker: React.FC<DailyAttendanceMarkerProps> = ({
  subjects,
  timetable,
  holidays,
  substitutedPeriods,
  records,
  onBack,
  onMarkAttendance,
  onUpdateSubjectAttendance,
}) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const dayOfWeek = getDayOfWeekFromDate(selectedDate);
  const isWeekend = !dayOfWeek;
  const holiday = holidays.find((h) => h.date === selectedDate);
  const daySlots = dayOfWeek ? timetable.filter((t) => t.day === dayOfWeek) : [];
  const recordsForDate = records.filter((r) => r.date === selectedDate);

  const getRecordForPeriod = (periodIndex: number): AttendanceRecord | undefined => {
    return recordsForDate.find((r) => r.periodIndex === periodIndex);
  };

  const getSubjectById = (id: string) => subjects.find((s) => s.id === id);

  const getSubstitution = (periodIndex: number) => {
    return substitutedPeriods.find(
      (s) => s.date === selectedDate && s.periodIndex === periodIndex
    );
  };

  const handleMarkPeriod = (
    periodIndex: number,
    subjectId: string,
    status: 'present' | 'absent' | 'cancelled'
  ) => {
    const existing = getRecordForPeriod(periodIndex);
    const sub = getSubstitution(periodIndex);
    const effectiveSubjectId = sub ? sub.newSubjectId : subjectId;

    if (existing) {
      if (existing.status === 'present') {
        onUpdateSubjectAttendance(existing.subjectId, -1, -1);
      } else if (existing.status === 'absent') {
        onUpdateSubjectAttendance(existing.subjectId, 0, -1);
      }
    }

    if (status === 'present') {
      onUpdateSubjectAttendance(effectiveSubjectId, 1, 1);
    } else if (status === 'absent') {
      onUpdateSubjectAttendance(effectiveSubjectId, 0, 1);
    }

    const newRecord: AttendanceRecord = {
      id: `rec_${selectedDate}_${periodIndex}`,
      date: selectedDate,
      periodIndex,
      subjectId: effectiveSubjectId,
      status,
      substitutedSubjectId: sub ? sub.newSubjectId : undefined,
    };

    const updated = records.filter(
      (r) => !(r.date === selectedDate && r.periodIndex === periodIndex)
    );
    onMarkAttendance([...updated, newRecord]);
  };

  const handleMarkAll = (targetStatus: 'present' | 'absent') => {
    if (!dayOfWeek) return;

    const newRecordsToApply: AttendanceRecord[] = [];

    [0, 1, 2, 3, 4, 5].forEach((periodIndex) => {
      const slot = daySlots.find((s) => s.periodIndex === periodIndex);
      if (!slot) return;

      const sub = getSubstitution(periodIndex);
      const effectiveSubjectId = sub ? sub.newSubjectId : slot.subjectId;
      const existing = getRecordForPeriod(periodIndex);

      if (existing) {
        if (existing.status === 'present') {
          onUpdateSubjectAttendance(existing.subjectId, -1, -1);
        } else if (existing.status === 'absent') {
          onUpdateSubjectAttendance(existing.subjectId, 0, -1);
        }
      }

      if (targetStatus === 'present') {
        onUpdateSubjectAttendance(effectiveSubjectId, 1, 1);
      } else if (targetStatus === 'absent') {
        onUpdateSubjectAttendance(effectiveSubjectId, 0, 1);
      }

      newRecordsToApply.push({
        id: `rec_${selectedDate}_${periodIndex}`,
        date: selectedDate,
        periodIndex,
        subjectId: effectiveSubjectId,
        status: targetStatus,
        substitutedSubjectId: sub ? sub.newSubjectId : undefined,
      });
    });

    const otherDates = records.filter((r) => r.date !== selectedDate);
    onMarkAttendance([...otherDates, ...newRecordsToApply]);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 max-w-2xl mx-auto">
      {/* Back Header */}
      <div className="flex items-center justify-between border-b border-sky-100 pb-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <h1 className="text-base font-bold text-slate-900">Mark Attendance</h1>
      </div>

      {/* Top Date Bar */}
      <div className="bg-white rounded-2xl border border-sky-200/80 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-sky-600" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 bg-sky-50 border border-sky-200 rounded-lg text-xs font-bold text-slate-800 focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleMarkAll('present')}
            disabled={isWeekend || !!holiday}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All Present</span>
          </button>

          <button
            onClick={() => handleMarkAll('absent')}
            disabled={isWeekend || !!holiday}
            className="px-3 py-2 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <XCircle className="w-4 h-4" />
            <span>Mark All Absent</span>
          </button>
        </div>
      </div>

      {holiday && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Holiday: {holiday.name}</span>
        </div>
      )}

      {/* Period Cards: Short, Bold, Clean */}
      <div className="space-y-2.5">
        {[0, 1, 2, 3, 4, 5].map((periodIndex) => {
          const defaultSlot = daySlots.find((s) => s.periodIndex === periodIndex);
          const substitution = getSubstitution(periodIndex);
          const effectiveSubject = substitution
            ? getSubjectById(substitution.newSubjectId)
            : defaultSlot
            ? getSubjectById(defaultSlot.subjectId)
            : undefined;

          const record = getRecordForPeriod(periodIndex);
          const currentStatus = record?.status;

          return (
            <div
              key={periodIndex}
              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                currentStatus === 'present'
                  ? 'bg-emerald-50/50 border-emerald-300'
                  : currentStatus === 'absent'
                  ? 'bg-rose-50/50 border-rose-300'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Period {periodIndex + 1}
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {effectiveSubject ? (
                    `${effectiveSubject.code}: ${effectiveSubject.name}`
                  ) : (
                    <span className="text-slate-400 font-normal">Free Period</span>
                  )}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    effectiveSubject &&
                    handleMarkPeriod(periodIndex, effectiveSubject.id, 'present')
                  }
                  disabled={!effectiveSubject}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    currentStatus === 'present'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Present</span>
                </button>

                <button
                  onClick={() =>
                    effectiveSubject &&
                    handleMarkPeriod(periodIndex, effectiveSubject.id, 'absent')
                  }
                  disabled={!effectiveSubject}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    currentStatus === 'absent'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Absent</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
