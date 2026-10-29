import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Calendar,
} from 'lucide-react';
import { AttendanceRecord, Holiday, Subject, TimetableSlot } from '../types';
import { getDayOfWeekFromDate } from '../utils/calculations';

interface CalendarAttendanceViewProps {
  subjects: Subject[];
  timetable: TimetableSlot[];
  holidays: Holiday[];
  records: AttendanceRecord[];
  onBack: () => void;
  onOpenSafeBunk: () => void;
}

export const CalendarAttendanceView: React.FC<CalendarAttendanceViewProps> = ({
  subjects,
  timetable,
  holidays,
  records,
  onBack,
  onOpenSafeBunk,
}) => {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // 0-indexed: 9 = October
  const [selectedDateStr, setSelectedDateStr] = useState('2026-10-13');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Generate days for current month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Day of week for 1st day (0 = Sunday, 1 = Monday ... 6 = Saturday)
  // Screenshot uses Monday-first: M T W T F S S
  let startDay = firstDayOfMonth.getDay();
  // Convert Sunday (0) to 6, and Mon-Sat (1-6) to 0-5
  const offset = startDay === 0 ? 6 : startDay - 1;

  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;
  const daysArray = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - offset + 1;
    if (dayNum > 0 && dayNum <= daysInMonth) {
      return dayNum;
    }
    return null;
  });

  const getSubjectById = (id: string) => subjects.find((s) => s.id === id);

  // Helper to analyze a specific date
  const getDateStatus = (dayNum: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const dateObj = new Date(currentYear, currentMonth, dayNum);
    const dayOfWeekIdx = dateObj.getDay();
    const isWeekend = dayOfWeekIdx === 0 || dayOfWeekIdx === 6;

    const holiday = holidays.find((h) => h.date === dateStr);
    const dayOfWeek = getDayOfWeekFromDate(dateStr);
    const expectedSlots = dayOfWeek ? timetable.filter((t) => t.day === dayOfWeek) : [];
    const dateRecords = records.filter((r) => r.date === dateStr);

    if (holiday || isWeekend) {
      return {
        type: 'holiday',
        holidayName: holiday ? holiday.name : 'Weekend',
        presentCount: 0,
        absentCount: 0,
        isWeekend,
      };
    }

    if (expectedSlots.length === 0) {
      return { type: 'none', presentCount: 0, absentCount: 0 };
    }

    if (dateRecords.length === 0) {
      return { type: 'unmarked', presentCount: 0, absentCount: 0 };
    }

    const presentCount = dateRecords.filter((r) => r.status === 'present').length;
    const absentCount = dateRecords.filter((r) => r.status === 'absent').length;

    if (presentCount === expectedSlots.length && expectedSlots.length > 0) {
      return { type: 'full_present', presentCount, absentCount };
    }
    if (absentCount === expectedSlots.length && expectedSlots.length > 0) {
      return { type: 'full_leave', presentCount, absentCount };
    }

    return { type: 'partial', presentCount, absentCount };
  };

  // Selected date breakdown
  const selectedRecords = records.filter((r) => r.date === selectedDateStr);
  const selectedDayOfWeek = getDayOfWeekFromDate(selectedDateStr);
  const selectedSlots = selectedDayOfWeek ? timetable.filter((t) => t.day === selectedDayOfWeek) : [];
  const selectedHoliday = holidays.find((h) => h.date === selectedDateStr);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header with Back */}
      <div className="flex items-center justify-between border-b border-sky-100 pb-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span className="text-sm font-bold text-slate-800">
          Attendance Calendar
        </span>
      </div>

      {/* Main Container mirroring the screenshot */}
      <div className="max-w-md mx-auto">
        {/* View Toggle Bar (matches screenshot top buttons) */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <button
            onClick={onOpenSafeBunk}
            className="px-5 py-2 rounded-full border border-sky-300 text-sky-700 font-bold text-xs bg-white hover:bg-sky-50 transition-all cursor-pointer shadow-xs"
          >
            View By Subject
          </button>
          <button
            className="px-5 py-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-xs shadow-sm cursor-default"
          >
            View By Day
          </button>
        </div>

        {/* Calendar Card (matches screenshot styling) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden">
          {/* Header Gradient */}
          <div className="bg-gradient-to-r from-teal-600 via-sky-600 to-indigo-700 px-5 py-4 flex items-center justify-between text-white">
            <button
              onClick={handlePrevMonth}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <span className="text-base font-bold tracking-wide">
              {monthNames[currentMonth]} {currentYear}
            </span>

            <button
              onClick={handleNextMonth}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Weekday Labels (M, T, W, T, F, S, S) */}
          <div className="grid grid-cols-7 text-center pt-4 pb-2 border-b border-slate-100">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
              <span
                key={idx}
                className={`text-xs font-bold ${
                  idx === 5 ? 'text-sky-600' : idx === 6 ? 'text-amber-500' : 'text-slate-400'
                }`}
              >
                {day}
              </span>
            ))}
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-7 gap-1.5 p-3 sm:p-4">
            {daysArray.map((dayNum, idx) => {
              if (!dayNum) {
                return (
                  <div key={idx} className="h-12 rounded-xl bg-slate-50/40" />
                );
              }

              const status = getDateStatus(dayNum);
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isSelected = selectedDateStr === dateStr;

              // Color determination matching screenshot:
              const isHoliday = status.type === 'holiday';

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`h-12 rounded-2xl flex flex-col items-center justify-between py-1.5 transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-2 border-indigo-600 bg-sky-50/80 shadow-xs'
                      : 'border border-slate-200 hover:border-sky-300 bg-white'
                  }`}
                >
                  {/* Day Number */}
                  <span
                    className={`text-xs font-bold leading-none ${
                      isHoliday
                        ? 'text-amber-500'
                        : status.type === 'unmarked'
                        ? 'text-sky-600'
                        : 'text-slate-800'
                    }`}
                  >
                    {dayNum}
                  </span>

                  {/* Indicator Dots matching screenshot */}
                  <div className="flex items-center justify-center gap-0.5 h-3">
                    {status.type === 'full_present' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    )}

                    {status.type === 'full_leave' && (
                      <span className="w-2 h-2 rounded-full bg-rose-600" />
                    )}

                    {status.type === 'unmarked' && (
                      <span className="w-2 h-2 rounded-full bg-sky-500" />
                    )}

                    {status.type === 'holiday' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    )}

                    {status.type === 'partial' && (
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: Math.min(3, status.presentCount) }).map((_, i) => (
                          <span key={i} className="w-1 h-1 rounded-full bg-emerald-500" />
                        ))}
                        {Array.from({ length: Math.min(2, status.absentCount) }).map((_, i) => (
                          <span key={i} className="w-1 h-1 rounded-full bg-rose-500" />
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend section strictly matching screenshot */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-600 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                <span>Full Day Present</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shrink-0" />
                <span>Full Day Leave</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                <span>Hours Present</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
                <span>Hours Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                <span>Holiday / Off</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
                <span>Not Marked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Date Details Box */}
        <div className="mt-4 bg-white rounded-2xl border border-sky-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-900">
              Selected: <span className="font-mono text-sky-700">{selectedDateStr}</span>
            </span>
            {selectedHoliday && (
              <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                {selectedHoliday.name}
              </span>
            )}
          </div>

          {selectedSlots.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-2">
              No classes scheduled on this day (Weekend or Holiday)
            </p>
          ) : (
            <div className="space-y-1.5">
              {selectedSlots.map((slot) => {
                const sub = getSubjectById(slot.subjectId);
                const rec = selectedRecords.find((r) => r.periodIndex === slot.periodIndex);
                const isPresent = rec?.status === 'present';
                const isAbsent = rec?.status === 'absent';

                return (
                  <div
                    key={slot.periodIndex}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-500 w-14">
                        P{slot.periodIndex + 1}
                      </span>
                      <span className="font-bold text-slate-800">
                        {sub?.code}: {sub?.name}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isPresent
                          ? 'bg-emerald-100 text-emerald-800'
                          : isAbsent
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-sky-100 text-sky-700'
                      }`}
                    >
                      {isPresent ? 'PRESENT' : isAbsent ? 'ABSENT' : 'NOT MARKED'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
