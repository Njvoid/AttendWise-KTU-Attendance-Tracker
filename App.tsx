import React, { useState, useEffect } from 'react';
import {
  PieChart as PieChartIcon,
  CalendarDays,
  CheckCircle2,
  Calendar as CalendarIcon,
  GraduationCap,
  LogOut,
  RotateCcw,
  User,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Download,
  FileText,
  X,
} from 'lucide-react';
import {
  AcademicCalendarConfig,
  AttendanceRecord,
  DayOfWeek,
  Holiday,
  StudentProfile,
  Subject,
  SubstitutedPeriod,
  TimetableSlot,
} from './types';
import {
  INITIAL_CALENDAR_CONFIG,
  INITIAL_DAILY_RECORDS,
  INITIAL_HOLIDAYS,
  INITIAL_STUDENT_PROFILE,
  INITIAL_SUBJECTS,
  INITIAL_SUBSTITUTED_PERIODS,
  INITIAL_TIMETABLE,
} from './utils/initialData';
import { calculateTotalMetrics } from './utils/calculations';
import { LoginPage } from './components/LoginPage';
import { PieChartDonut } from './components/PieChartDonut';
import { SafeBunkPage } from './components/SafeBunkPage';
import { DailyAttendanceMarker } from './components/DailyAttendanceMarker';
import { CalendarAttendanceView } from './components/CalendarAttendanceView';
import { TimetableHolidays } from './components/TimetableHolidays';

type AppPage = 'home' | 'safe_bunk' | 'mark_attendance' | 'calendar_view' | 'timetable_holidays';

export default function App() {
  const STORAGE_KEY_AUTH = 'attendwise_auth';
  const STORAGE_KEY_PROFILE = 'attendwise_profile';
  const STORAGE_KEY_SUBJECTS = 'attendwise_subjects';
  const STORAGE_KEY_CALENDAR = 'attendwise_calendar';
  const STORAGE_KEY_HOLIDAYS = 'attendwise_holidays';
  const STORAGE_KEY_TIMETABLE = 'attendwise_timetable';
  const STORAGE_KEY_SUBS = 'attendwise_substitutions';
  const STORAGE_KEY_RECORDS = 'attendwise_records';

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_AUTH) === 'true';
  });

  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [showExportModal, setShowExportModal] = useState(false);

  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_PROFILE;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SUBJECTS);
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });

  const [calendarConfig, setCalendarConfig] = useState<AcademicCalendarConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CALENDAR);
    return saved ? JSON.parse(saved) : INITIAL_CALENDAR_CONFIG;
  });

  const [holidays, setHolidays] = useState<Holiday[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_HOLIDAYS);
    return saved ? JSON.parse(saved) : INITIAL_HOLIDAYS;
  });

  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TIMETABLE);
    return saved ? JSON.parse(saved) : INITIAL_TIMETABLE;
  });

  const [substitutedPeriods, setSubstitutedPeriods] = useState<SubstitutedPeriod[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SUBS);
    return saved ? JSON.parse(saved) : INITIAL_SUBSTITUTED_PERIODS;
  });

  const [records, setRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_RECORDS);
    return saved ? JSON.parse(saved) : INITIAL_DAILY_RECORDS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_AUTH, String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CALENDAR, JSON.stringify(calendarConfig));
  }, [calendarConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HOLIDAYS, JSON.stringify(holidays));
  }, [holidays]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TIMETABLE, JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SUBS, JSON.stringify(substitutedPeriods));
  }, [substitutedPeriods]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
  }, [records]);

  const handleLogin = (newProfile: Partial<StudentProfile>) => {
    setProfile((prev) => ({ ...prev, ...newProfile }));
    setIsAuthenticated(true);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('home');
  };

  const handleResetData = () => {
    if (window.confirm('Reset data to default?')) {
      setSubjects(INITIAL_SUBJECTS);
      setCalendarConfig(INITIAL_CALENDAR_CONFIG);
      setHolidays(INITIAL_HOLIDAYS);
      setTimetable(INITIAL_TIMETABLE);
      setSubstitutedPeriods(INITIAL_SUBSTITUTED_PERIODS);
      setRecords(INITIAL_DAILY_RECORDS);
      setProfile(INITIAL_STUDENT_PROFILE);
    }
  };

  // Subject methods
  const handleUpdateSubject = (updated: Subject) => {
    setSubjects((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleAddSubject = (newSub: Omit<Subject, 'id'>) => {
    const id = `sub_${Date.now()}`;
    setSubjects((prev) => [...prev, { ...newSub, id }]);
  };

  const handleDeleteSubject = (subjectId: string) => {
    if (window.confirm('Delete this course?')) {
      setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
      setTimetable((prev) => prev.filter((t) => t.subjectId !== subjectId));
    }
  };

  // Timetable
  const handleUpdateTimetableSlot = (day: DayOfWeek, periodIndex: number, subjectId: string) => {
    setTimetable((prev) => {
      const filtered = prev.filter((t) => !(t.day === day && t.periodIndex === periodIndex));
      if (!subjectId) return filtered;
      return [...filtered, { day, periodIndex, subjectId }];
    });
  };

  // Holidays
  const handleAddHoliday = (holidayData: Omit<Holiday, 'id'>) => {
    const newHoliday: Holiday = {
      ...holidayData,
      id: `h_${Date.now()}`,
    };
    setHolidays((prev) => [...prev, newHoliday]);
  };

  const handleDeleteHoliday = (id: string) => {
    setHolidays((prev) => prev.filter((h) => h.id !== id));
  };

  // Substitutions
  const handleAddSubstitutedPeriod = (subData: Omit<SubstitutedPeriod, 'id'>) => {
    const newSub: SubstitutedPeriod = {
      ...subData,
      id: `sub_${Date.now()}`,
    };
    setSubstitutedPeriods((prev) => [...prev, newSub]);
  };

  const handleDeleteSubstitutedPeriod = (id: string) => {
    setSubstitutedPeriods((prev) => prev.filter((s) => s.id !== id));
  };

  // Attendance delta
  const handleUpdateSubjectAttendance = (
    subjectId: string,
    deltaAttended: number,
    deltaConducted: number
  ) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== subjectId) return s;
        const newAttended = Math.max(0, s.attendedClasses + deltaAttended);
        const newConducted = Math.max(1, s.totalConducted + deltaConducted);
        return {
          ...s,
          attendedClasses: newAttended,
          totalConducted: newConducted,
        };
      })
    );
  };

  const totalMetrics = calculateTotalMetrics(subjects, profile.targetPercentage);
  const totalMissed = totalMetrics.totalConducted - totalMetrics.totalAttended;

  const handleDownloadData = () => {
    const dataToExport = {
      profile,
      subjects,
      calendarConfig,
      holidays,
      timetable,
      substitutedPeriods,
      records,
      exportDate: new Date().toISOString(),
      app: 'AttendWise - KTU Smart Attendance Tracker',
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendwise_backup_${profile.accessCode}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintReport = () => {
    window.print();
  };

  // 1. First Page: Login with App Name in top and 6-digit access code only
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} defaultProfile={profile} />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-sky-100 bg-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* App Name at top */}
          <div
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              attend<span className="text-sky-600">wise</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-lg">
              {profile.accessCode}
            </span>

            <button
              onClick={() => setShowExportModal(true)}
              title="Export App Data & Report"
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <button
              onClick={handleResetData}
              title="Reset data"
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogout}
              className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-rose-600 rounded-lg border border-slate-200 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* ROUTE 1: DASHBOARD HOME */}
        {currentPage === 'home' && (
          <div className="space-y-6 animate-fadeIn">
            {/* 1. ABOVE ICONS: PIE CHART WITH TOTAL ATTENDANCE */}
            <div className="bg-white rounded-3xl border border-sky-200/80 p-6 shadow-xs text-center">
              <span className="text-xs font-extrabold text-sky-700 uppercase tracking-wider bg-sky-50 border border-sky-200 px-3 py-0.5 rounded-full inline-block mb-3">
                Total Attendance
              </span>

              {/* Pie Chart Donut */}
              <div className="flex items-center justify-center my-2">
                <PieChartDonut
                  percentage={totalMetrics.percentage}
                  targetPercentage={profile.targetPercentage}
                  attended={totalMetrics.totalAttended}
                  total={totalMetrics.totalConducted}
                  size={190}
                  strokeWidth={16}
                />
              </div>

              {/* Short & Bold 3 KPI Metrics */}
              <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto mt-4 text-center">
                <div className="bg-sky-50 border border-sky-100 rounded-xl p-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    Attended
                  </span>
                  <span className="text-base font-extrabold text-sky-800 tabular-nums">
                    {totalMetrics.totalAttended}
                  </span>
                </div>
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-2">
                  <span className="text-[10px] font-bold text-rose-500 uppercase block">
                    Missed
                  </span>
                  <span className="text-base font-extrabold text-rose-600 tabular-nums">
                    {totalMissed}
                  </span>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-2">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase block">
                    Safe Bunks
                  </span>
                  <span className="text-base font-extrabold text-emerald-700 tabular-nums">
                    {totalMetrics.safeBunkCount}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. SHORT, SQUARE-SHAPED ICONS WITH VIBRANT COLORS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {/* ICON 1: Safe Bunks (Sky Blue Square) */}
              <button
                onClick={() => setCurrentPage('safe_bunk')}
                className="aspect-square bg-white hover:bg-sky-50/60 border-2 border-sky-200 hover:border-sky-500 p-4 rounded-3xl shadow-xs transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-110 transition-transform mb-3">
                  <PieChartIcon className="w-7 h-7" />
                </div>
                <span className="text-sm font-extrabold text-slate-900 group-hover:text-sky-700 block leading-tight">
                  Safe Bunks
                </span>
                <span className="text-[10px] font-bold text-sky-600 mt-1">
                  75% Alerts & Skips
                </span>
              </button>

              {/* ICON 2: Mark Today (Emerald Green Square) */}
              <button
                onClick={() => setCurrentPage('mark_attendance')}
                className="aspect-square bg-white hover:bg-emerald-50/60 border-2 border-emerald-200 hover:border-emerald-500 p-4 rounded-3xl shadow-xs transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <span className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-700 block leading-tight">
                  Mark Today
                </span>
                <span className="text-[10px] font-bold text-emerald-600 mt-1">
                  Daily Attendance
                </span>
              </button>

              {/* ICON 3: Day Calendar (Indigo/Violet Square - Mirroring screenshot!) */}
              <button
                onClick={() => setCurrentPage('calendar_view')}
                className="aspect-square bg-white hover:bg-indigo-50/60 border-2 border-indigo-200 hover:border-indigo-500 p-4 rounded-3xl shadow-xs transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform mb-3">
                  <CalendarIcon className="w-7 h-7" />
                </div>
                <span className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-700 block leading-tight">
                  Day Calendar
                </span>
                <span className="text-[10px] font-bold text-indigo-600 mt-1">
                  Monthly Dot View
                </span>
              </button>

              {/* ICON 4: Timetable & Holidays (Amber/Orange Square) */}
              <button
                onClick={() => setCurrentPage('timetable_holidays')}
                className="aspect-square bg-white hover:bg-amber-50/60 border-2 border-amber-200 hover:border-amber-500 p-4 rounded-3xl shadow-xs transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform mb-3">
                  <CalendarDays className="w-7 h-7" />
                </div>
                <span className="text-sm font-extrabold text-slate-900 group-hover:text-amber-700 block leading-tight">
                  Timetable
                </span>
                <span className="text-[10px] font-bold text-amber-600 mt-1">
                  Strikes & Holidays
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ROUTE 2: SAFE BUNK PAGE */}
        {currentPage === 'safe_bunk' && (
          <SafeBunkPage
            subjects={subjects}
            targetPercentage={profile.targetPercentage}
            onBack={() => setCurrentPage('home')}
            onUpdateSubject={handleUpdateSubject}
            onAddSubject={handleAddSubject}
            onDeleteSubject={handleDeleteSubject}
          />
        )}

        {/* ROUTE 3: MARK DAILY ATTENDANCE (Simplified, no period times, no history) */}
        {currentPage === 'mark_attendance' && (
          <DailyAttendanceMarker
            subjects={subjects}
            timetable={timetable}
            holidays={holidays}
            substitutedPeriods={substitutedPeriods}
            records={records}
            onBack={() => setCurrentPage('home')}
            onMarkAttendance={setRecords}
            onUpdateSubjectAttendance={handleUpdateSubjectAttendance}
          />
        )}

        {/* ROUTE 4: DAY CALENDAR VIEW (Directly matching user screenshot) */}
        {currentPage === 'calendar_view' && (
          <CalendarAttendanceView
            subjects={subjects}
            timetable={timetable}
            holidays={holidays}
            records={records}
            onBack={() => setCurrentPage('home')}
            onOpenSafeBunk={() => setCurrentPage('safe_bunk')}
          />
        )}

        {/* ROUTE 5: TIMETABLE & HOLIDAYS */}
        {currentPage === 'timetable_holidays' && (
          <TimetableHolidays
            subjects={subjects}
            calendarConfig={calendarConfig}
            holidays={holidays}
            timetable={timetable}
            substitutedPeriods={substitutedPeriods}
            onBack={() => setCurrentPage('home')}
            onUpdateCalendarConfig={setCalendarConfig}
            onAddHoliday={handleAddHoliday}
            onDeleteHoliday={handleDeleteHoliday}
            onUpdateTimetableSlot={handleUpdateTimetableSlot}
            onAddSubstitutedPeriod={handleAddSubstitutedPeriod}
            onDeleteSubstitutedPeriod={handleDeleteSubstitutedPeriod}
          />
        )}

        {/* EXPORT OPTIONS MODAL */}
        {showExportModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-sky-100">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Export AttendWise
                  </h3>
                </div>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {/* 1. Download Data Backup JSON */}
                <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      1. Download Attendance Data (.json)
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Backs up all courses, timetable, holidays, and logged records.
                    </span>
                  </div>
                  <button
                    onClick={handleDownloadData}
                    className="px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>

                {/* 2. Print / PDF Summary Slip */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      2. Print / Save as PDF
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Generate official KTU attendance slip with signature fields.
                    </span>
                  </div>
                  <button
                    onClick={handlePrintReport}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Print PDF</span>
                  </button>
                </div>

                {/* 3. Export Code / GitHub */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-900 block">
                    3. Export Full Code to GitHub or ZIP
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    In Google AI Studio, click the <strong>Export</strong> or <strong>Share</strong> button at the top right of your workspace to export this full project directly to your <strong>GitHub repository</strong> or download it as a <strong>ZIP file</strong>.
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-3 bg-white border-t border-slate-100 text-center text-xs font-bold text-slate-400">
        attendwise · KTU
      </footer>
    </div>
  );
}
