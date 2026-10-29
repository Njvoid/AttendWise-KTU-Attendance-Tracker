import React, { useRef } from 'react';
import {
  FileText,
  Printer,
  ShieldCheck,
  AlertTriangle,
  Download,
  BookOpen,
  HelpCircle,
  Award,
  CreditCard,
  Scale,
} from 'lucide-react';
import { StudentProfile, Subject } from '../types';
import { calculateSubjectMetrics, calculateTotalMetrics } from '../utils/calculations';

interface KtuRegulationsGuideProps {
  profile: StudentProfile;
  subjects: Subject[];
  targetPercentage?: number;
}

export const KtuRegulationsGuide: React.FC<KtuRegulationsGuideProps> = ({
  profile,
  subjects,
  targetPercentage = 75,
}) => {
  const totalMetrics = calculateTotalMetrics(subjects, targetPercentage);
  const printAreaRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner with Print Action */}
      <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg font-bold text-slate-800">
              KTU Academic Ordinances & Examination Eligibility
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Official regulations prescribed by APJ Abdul Kalam Technological University for B.Tech degree programs regarding attendance, medical condonation, duty leaves, and exam registration.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-center"
        >
          <Printer className="w-4 h-4" />
          <span>Print Attendance Slip</span>
        </button>
      </div>

      {/* Regulation Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Safe Category */}
        <div className="bg-white rounded-xl border border-sky-100 p-5 shadow-xs">
          <div className="flex items-center gap-2 text-sky-800 mb-2">
            <ShieldCheck className="w-5 h-5 text-sky-600" />
            <h3 className="text-sm font-bold">Category A: Safe Zone (≥ 75%)</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Students maintaining 75.0% or above in each individual subject and aggregate are directly eligible to appear for the End Semester University Examinations.
          </p>
          <div className="mt-3 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-2">
            ✓ Hall ticket automatically issued. No condonation fee or approvals required.
          </div>
        </div>

        {/* Condonation Category */}
        <div className="bg-white rounded-xl border border-amber-200 p-5 shadow-xs bg-amber-50/20">
          <div className="flex items-center gap-2 text-amber-800 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold">Category B: Condonation (60% - 74.9%)</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Attendance shortage up to 10% (or down to 60% on genuine medical grounds) can be condoned by the Head of the Institution / University.
          </p>
          <ul className="mt-2 text-[11px] text-amber-900 space-y-1 list-disc list-inside">
            <li>Medical certificate from a registered practitioner</li>
            <li>Condonation fee: ₹500 to ₹1,000 per subject</li>
            <li>Permitted maximum <strong>2 times</strong> across full B.Tech</li>
          </ul>
        </div>

        {/* Shortage Category */}
        <div className="bg-white rounded-xl border border-rose-200 p-5 shadow-xs bg-rose-50/20">
          <div className="flex items-center gap-2 text-rose-800 mb-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-bold">Category C: Shortage (&lt; 60%)</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Students with attendance below 60% in any course are <strong>not eligible</strong> for condonation under KTU rules and are ineligible to write the university exam.
          </p>
          <div className="mt-3 text-[11px] font-semibold text-rose-800 bg-rose-50 border border-rose-200 rounded-lg p-2">
            ✗ Must re-register for the course when offered or take summer term classes.
          </div>
        </div>
      </div>

      {/* Duty Leaves and Special Provisions */}
      <div className="bg-white rounded-xl border border-sky-100 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-sky-600" />
          <span>Duty Leave & Official Extracurricular Concessions</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
            <strong className="text-slate-800 block mb-1">NSS / NCC / Sports Representation:</strong>
            Maximum up to 10% attendance concession is permissible for approved official representation with prior sanction from the Principal and physical education coordinator.
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
            <strong className="text-slate-800 block mb-1">University Arts & Tech Competitions:</strong>
            Duty leave forms must be submitted within 5 working days of completing the event, signed by the Faculty Advisor and Head of Department.
          </div>
        </div>
      </div>

      {/* Official Printable Slip (Designed for print preview) */}
      <div
        ref={printAreaRef}
        className="bg-white rounded-2xl border border-slate-300 p-8 shadow-sm print:shadow-none print:border-none print:m-0"
      >
        {/* Printable Header */}
        <div className="border-b-2 border-slate-800 pb-4 mb-6 text-center">
          <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500 block">
            APJ Abdul Kalam Technological University
          </span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1">
            SEMESTER ATTENDANCE PROGRESS & ELIGIBILITY REPORT
          </h2>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            {profile.college} · Academic Year 2025–2026
          </p>
        </div>

        {/* Student Meta Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Student Name</span>
            <span className="font-bold text-slate-800">{profile.name}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Register Number</span>
            <span className="font-mono font-bold text-slate-800">{profile.regNo}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Semester / Branch</span>
            <span className="font-semibold text-slate-800">{profile.semester}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Aggregate Attendance</span>
            <span
              className={`font-mono font-extrabold text-sm ${
                totalMetrics.percentage >= 75 ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {totalMetrics.percentage.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Table of courses */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-xs text-left border-collapse border border-slate-200">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                <th className="py-2.5 px-3 border border-slate-200">Course Code</th>
                <th className="py-2.5 px-3 border border-slate-200">Course Name</th>
                <th className="py-2.5 px-3 border border-slate-200 text-center">Hours Conducted</th>
                <th className="py-2.5 px-3 border border-slate-200 text-center">Hours Attended</th>
                <th className="py-2.5 px-3 border border-slate-200 text-center">Percentage</th>
                <th className="py-2.5 px-3 border border-slate-200 text-center">Safe Bunks</th>
                <th className="py-2.5 px-3 border border-slate-200 text-center">KTU Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {subjects.map((sub) => {
                const m = calculateSubjectMetrics(sub.attendedClasses, sub.totalConducted, targetPercentage);
                return (
                  <tr key={sub.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono font-bold text-slate-800 border border-slate-200">
                      {sub.code}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 font-medium text-slate-700">
                      {sub.name}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-center tabular-nums">
                      {sub.totalConducted}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-center tabular-nums font-semibold">
                      {sub.attendedClasses}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-center tabular-nums font-bold">
                      {m.percentage.toFixed(1)}%
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-center tabular-nums text-slate-600">
                      {m.safeBunkCount > 0 ? `+${m.safeBunkCount}` : '0 (At risk)'}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.status === 'safe'
                            ? 'bg-emerald-100 text-emerald-800'
                            : m.status === 'condonation'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {m.status === 'safe'
                          ? 'ELIGIBLE'
                          : m.status === 'condonation'
                          ? 'CONDONATION'
                          : 'SHORTAGE'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Verification Signatures block */}
        <div className="pt-8 grid grid-cols-3 gap-6 text-center text-xs text-slate-600 border-t border-slate-200">
          <div className="pt-8 border-t border-dashed border-slate-300">
            <span className="font-semibold block">Student Signature</span>
            <span className="text-[11px] text-slate-400">Date: {new Date().toLocaleDateString()}</span>
          </div>
          <div className="pt-8 border-t border-dashed border-slate-300">
            <span className="font-semibold block">Faculty Advisor / Tutor</span>
            <span className="text-[11px] text-slate-400">Department of CSE</span>
          </div>
          <div className="pt-8 border-t border-dashed border-slate-300">
            <span className="font-semibold block">Head of Department</span>
            <span className="text-[11px] text-slate-400">Office Seal & Signature</span>
          </div>
        </div>
      </div>
    </div>
  );
};
