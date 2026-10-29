import React, { useState } from 'react';
import { GraduationCap, ArrowRight, UserPlus, KeyRound, Check, Sparkles } from 'lucide-react';
import { StudentProfile } from '../types';

interface LoginPageProps {
  onLogin: (profile: Partial<StudentProfile>) => void;
  defaultProfile: StudentProfile;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, defaultProfile }) => {
  const [accessCode, setAccessCode] = useState('757575');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regSemester, setRegSemester] = useState('S6 B.Tech CSE');
  const [regCode, setRegCode] = useState('123456');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = accessCode.trim();
    if (!cleaned) {
      setError('Please enter your 6-digit access code');
      return;
    }
    if (cleaned.length !== 6) {
      setError('Access code must be exactly 6 digits');
      return;
    }
    setError('');
    onLogin({
      accessCode: cleaned,
      name: defaultProfile.name || 'KTU Student',
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regCode || regCode.length !== 6) {
      setError('Please choose a 6-digit access code');
      return;
    }
    setError('');
    onLogin({
      accessCode: regCode,
      name: regName.trim() || 'New Student',
      semester: regSemester,
    });
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col justify-between">
      {/* 1. App name in top */}
      <header className="w-full border-b border-sky-100 bg-white py-4 px-6 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              attend<span className="text-sky-600">wise</span>
            </span>
          </div>
          <span className="text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-full">
            KTU Attendance
          </span>
        </div>
      </header>

      {/* 2. Login Center Box */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {!isRegistering ? (
            /* Login Form: Access Code Only */
            <div className="bg-white rounded-2xl border border-sky-200/80 p-7 sm:p-8 shadow-sm">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center mx-auto mb-3">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h1 className="text-lg font-bold text-slate-900">Enter Access Code</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your 6-digit code to access your attendance
                </p>
              </div>

              {error && (
                <div className="mb-4 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={accessCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setAccessCode(val);
                        if (error) setError('');
                      }}
                      placeholder="••••••"
                      className="w-full text-center tracking-[0.4em] font-mono text-2xl font-bold py-3 px-4 bg-sky-50/50 border border-sky-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                      autoFocus
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
                    <span>6-digit number</span>
                    <button
                      type="button"
                      onClick={() => setAccessCode('757575')}
                      className="text-sky-600 hover:underline cursor-pointer"
                    >
                      Use code: 757575
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white rounded-xl text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Enter</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Small letters down: create new account */}
              <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(true);
                    setError('');
                  }}
                  className="text-xs text-slate-500 hover:text-sky-700 font-medium transition-colors cursor-pointer"
                >
                  New here? <span className="text-sky-600 underline font-semibold">create new account</span>
                </button>
              </div>
            </div>
          ) : (
            /* Register Form for New Users */
            <div className="bg-white rounded-2xl border border-sky-200/80 p-7 sm:p-8 shadow-sm">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center mx-auto mb-3">
                  <UserPlus className="w-6 h-6" />
                </div>
                <h1 className="text-lg font-bold text-slate-900">Create New Account</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Set up your student profile and 6-digit access code
                </p>
              </div>

              {error && (
                <div className="mb-4 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Rahul S."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Semester & Branch
                  </label>
                  <select
                    value={regSemester}
                    onChange={(e) => setRegSemester(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  >
                    <option value="S6 B.Tech CSE">S6 B.Tech CSE</option>
                    <option value="S4 B.Tech CSE">S4 B.Tech CSE</option>
                    <option value="S5 B.Tech ECE">S5 B.Tech ECE</option>
                    <option value="S7 B.Tech ME">S7 B.Tech ME</option>
                    <option value="S3 B.Tech CE">S3 B.Tech CE</option>
                    <option value="S1 B.Tech General">S1 B.Tech First Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Choose 6-Digit Access Code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={regCode}
                    onChange={(e) => setRegCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="e.g. 123456"
                    className="w-full text-center tracking-widest font-mono text-base font-bold px-3 py-2 bg-sky-50/50 border border-sky-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Create & Enter</span>
                </button>
              </form>

              <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setError('');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Already have a code? <span className="text-sky-600 underline">Enter code</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-100">
        attendwise · KTU 75% attendance calculator
      </footer>
    </div>
  );
};
