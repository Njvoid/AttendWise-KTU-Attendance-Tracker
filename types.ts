export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';

export interface Subject {
  id: string;
  code: string;
  name: string;
  faculty: string;
  credits: number;
  attendedClasses: number;
  totalConducted: number;
  color: string;
  isLab?: boolean;
}

export interface TimetableSlot {
  day: DayOfWeek;
  periodIndex: number; // 0 to 5 (Periods 1 to 6)
  subjectId: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  periodIndex: number;
  subjectId: string;
  status: 'present' | 'absent' | 'cancelled' | 'substituted';
  substitutedSubjectId?: string;
  note?: string;
}

export interface Holiday {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  type: 'public' | 'strike' | 'hartal' | 'college_fest' | 'unexpected';
  description?: string;
}

export interface SubstitutedPeriod {
  id: string;
  date: string;
  periodIndex: number;
  originalSubjectId: string;
  newSubjectId: string;
  reason: string;
}

export interface StudentProfile {
  accessCode: string;
  name: string;
  regNo: string;
  college: string;
  semester: string;
  branch: string;
  targetPercentage: number;
}

export interface AcademicCalendarConfig {
  semesterStartDate: string;
  semesterEndDate: string;
  totalWorkingDaysExpected: number;
}
