import React from 'react';
import { GraduationCap, LogOut, RotateCcw, User, ShieldCheck, AlertTriangle } from 'lucide-react';
import { StudentProfile } from '../types';

interface HeaderProps {
  profile: StudentProfile;
  overallPercentage: number;
  overallStatus: 'safe' | 'condonation' | 'critical';
  onLogout: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  overallPercentage,
  overallStatus,
  onLogout,
  onResetData,
}) => {
  return (
    <header className="bg-white border-b border-sky-100 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Wordmark Zone */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-800">
                  ATTEND<span className="text-sky-600">WISE</span>
                </span>
                <span className="hidden sm:inline-block text-[11px] font-semibold text-sky-700 bg-sky-50 border border-sky-200/70 rounded-md px-1.5 py-0.5">
                  KTU TRACKER
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                {profile.college}
              </p>
            </div>
          </div>

          {/* Student Profile & Attendance Quick Stat */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-600 border border-slate-200/80 rounded-lg px-3 py-1.5 bg-slate-50/70">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-800">{profile.name}</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 font-mono text-[11px]">{profile.regNo}</span>
              <span className="text-slate-300">|</span>
              <span className="text-sky-700 font-medium">{profile.semester}</span>
            </div>

            {/* Quick Status Tag */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                overallStatus === 'safe'
                  ? 'bg-sky-50 border-sky-200 text-sky-800'
                  : overallStatus === 'condonation'
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {overallStatus === 'safe' ? (
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              )}
              <span className="tabular-nums font-bold">{overallPercentage.toFixed(1)}%</span>
              <span className="hidden sm:inline text-[11px] font-normal text-slate-600">Total Avg</span>
            </div>

            {/* Actions */}
            <button
              onClick={onResetData}
              title="Reset to default KTU sample data"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onLogout}
              title="Log out of AttendWise"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
