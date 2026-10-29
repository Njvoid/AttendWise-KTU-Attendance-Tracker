import {
  AcademicCalendarConfig,
  AttendanceRecord,
  Holiday,
  StudentProfile,
  Subject,
  SubstitutedPeriod,
  TimetableSlot,
} from '../types';

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  accessCode: '757575',
  name: 'Ananthan K. Nair',
  regNo: 'TVE22CS042',
  college: 'College of Engineering Trivandrum',
  semester: 'S6 B.Tech CSE',
  branch: 'Computer Science and Engineering',
  targetPercentage: 75,
};

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'cst302',
    code: 'CST 302',
    name: 'Compiler Design',
    faculty: 'Dr. Radhika V.',
    credits: 4,
    attendedClasses: 33,
    totalConducted: 40,
    color: '#0284c7', // Sky blue
  },
  {
    id: 'cst304',
    code: 'CST 304',
    name: 'Computer Networks',
    faculty: 'Prof. Suresh Kumar',
    credits: 4,
    attendedClasses: 31,
    totalConducted: 39,
    color: '#2563eb', // Royal blue
  },
  {
    id: 'cst306',
    code: 'CST 306',
    name: 'Algorithm Analysis & Design',
    faculty: 'Dr. Manoj Menon',
    credits: 4,
    attendedClasses: 25,
    totalConducted: 36, // 69.4% -> Condonation Alert!
    color: '#d97706', // Amber warning color
  },
  {
    id: 'cst308',
    code: 'CST 308',
    name: 'Comprehensive Course Work',
    faculty: 'Prof. Anitha Pillai',
    credits: 2,
    attendedClasses: 19,
    totalConducted: 21, // 90.5%
    color: '#0d9488', // Teal
  },
  {
    id: 'hut300',
    code: 'HUT 300',
    name: 'Industrial Economics & Management',
    faculty: 'Prof. George Thomas',
    credits: 3,
    attendedClasses: 27,
    totalConducted: 35, // 77.1% (borderline safe)
    color: '#6366f1', // Indigo
  },
  {
    id: 'csl332',
    code: 'CSL 332',
    name: 'Networking & OS Lab',
    faculty: 'Dr. Radhika & Lab Staff',
    credits: 2,
    attendedClasses: 22,
    totalConducted: 24, // 91.7%
    color: '#0891b2', // Cyan
    isLab: true,
  },
];

export const INITIAL_CALENDAR_CONFIG: AcademicCalendarConfig = {
  semesterStartDate: '2026-07-01',
  semesterEndDate: '2026-11-20',
  totalWorkingDaysExpected: 78,
};

export const INITIAL_HOLIDAYS: Holiday[] = [
  {
    id: 'h1',
    date: '2026-08-15',
    name: 'Independence Day',
    type: 'public',
    description: 'National Public Holiday',
  },
  {
    id: 'h2',
    date: '2026-08-27',
    name: 'First Onam',
    type: 'public',
    description: 'Kerala State Festival',
  },
  {
    id: 'h3',
    date: '2026-08-28',
    name: 'Thiruvonam',
    type: 'public',
    description: 'Kerala State Festival Holiday',
  },
  {
    id: 'h4',
    date: '2026-09-05',
    name: 'Milad-i-Sherif',
    type: 'public',
    description: 'Gazetted Public Holiday',
  },
  {
    id: 'h5',
    date: '2026-10-02',
    name: 'Gandhi Jayanti',
    type: 'public',
    description: 'National Public Holiday',
  },
  {
    id: 'h6',
    date: '2026-10-20',
    name: 'Mahanavami / Vijayadashami',
    type: 'public',
    description: 'Pooja Holidays',
  },
  {
    id: 'h7',
    date: '2026-11-01',
    name: 'Kerala Piravi',
    type: 'public',
    description: 'State Foundation Day',
  },
  // User added college holidays & unexpected strikes
  {
    id: 'h8',
    date: '2026-09-18',
    name: 'Statewide General Strike (Hartal)',
    type: 'strike',
    description: 'Public transportation suspended, classes suspended',
  },
  {
    id: 'h9',
    date: '2026-10-09',
    name: 'Drishti Inter-Collegiate Tech Fest',
    type: 'college_fest',
    description: 'College Tech Festival - Classes suspended for events',
  },
  {
    id: 'h10',
    date: '2026-10-15',
    name: 'Heavy Monsoon Red Alert Closure',
    type: 'unexpected',
    description: 'District Collector declared holiday due to waterlogging',
  },
];

export const INITIAL_TIMETABLE: TimetableSlot[] = [
  // Monday
  { day: 'Mon', periodIndex: 0, subjectId: 'cst302' },
  { day: 'Mon', periodIndex: 1, subjectId: 'cst304' },
  { day: 'Mon', periodIndex: 2, subjectId: 'cst306' },
  { day: 'Mon', periodIndex: 3, subjectId: 'hut300' },
  { day: 'Mon', periodIndex: 4, subjectId: 'cst308' },
  { day: 'Mon', periodIndex: 5, subjectId: 'cst302' },

  // Tuesday
  { day: 'Tue', periodIndex: 0, subjectId: 'cst304' },
  { day: 'Tue', periodIndex: 1, subjectId: 'cst306' },
  { day: 'Tue', periodIndex: 2, subjectId: 'cst302' },
  { day: 'Tue', periodIndex: 3, subjectId: 'hut300' },
  { day: 'Tue', periodIndex: 4, subjectId: 'csl332' },
  { day: 'Tue', periodIndex: 5, subjectId: 'csl332' },

  // Wednesday
  { day: 'Wed', periodIndex: 0, subjectId: 'cst306' },
  { day: 'Wed', periodIndex: 1, subjectId: 'cst308' },
  { day: 'Wed', periodIndex: 2, subjectId: 'cst304' },
  { day: 'Wed', periodIndex: 3, subjectId: 'cst302' },
  { day: 'Wed', periodIndex: 4, subjectId: 'hut300' },
  { day: 'Wed', periodIndex: 5, subjectId: 'cst306' },

  // Thursday
  { day: 'Thu', periodIndex: 0, subjectId: 'cst302' },
  { day: 'Thu', periodIndex: 1, subjectId: 'cst304' },
  { day: 'Thu', periodIndex: 2, subjectId: 'csl332' },
  { day: 'Thu', periodIndex: 3, subjectId: 'csl332' },
  { day: 'Thu', periodIndex: 4, subjectId: 'cst306' },
  { day: 'Thu', periodIndex: 5, subjectId: 'hut300' },

  // Friday
  { day: 'Fri', periodIndex: 0, subjectId: 'cst304' },
  { day: 'Fri', periodIndex: 1, subjectId: 'cst302' },
  { day: 'Fri', periodIndex: 2, subjectId: 'cst306' },
  { day: 'Fri', periodIndex: 3, subjectId: 'cst308' },
  { day: 'Fri', periodIndex: 4, subjectId: 'hut300' },
  { day: 'Fri', periodIndex: 5, subjectId: 'cst304' },
];

export const INITIAL_SUBSTITUTED_PERIODS: SubstitutedPeriod[] = [
  {
    id: 'sub1',
    date: '2026-10-12',
    periodIndex: 2,
    originalSubjectId: 'cst306',
    newSubjectId: 'cst304',
    reason: 'Dr. Manoj on University Exam Duty; Prof. Suresh took extra Networks period',
  },
  {
    id: 'sub2',
    date: '2026-10-08',
    periodIndex: 4,
    originalSubjectId: 'hut300',
    newSubjectId: 'cst302',
    reason: 'Economics faculty on leave, Compiler Design syllabus catchup',
  },
];

export const INITIAL_DAILY_RECORDS: AttendanceRecord[] = [
  {
    id: 'rec_2026-10-12_0',
    date: '2026-10-12',
    periodIndex: 0,
    subjectId: 'cst302',
    status: 'present',
  },
  {
    id: 'rec_2026-10-12_1',
    date: '2026-10-12',
    periodIndex: 1,
    subjectId: 'cst304',
    status: 'present',
  },
  {
    id: 'rec_2026-10-12_2',
    date: '2026-10-12',
    periodIndex: 2,
    subjectId: 'cst304',
    status: 'present',
    substitutedSubjectId: 'cst304',
  },
  {
    id: 'rec_2026-10-12_3',
    date: '2026-10-12',
    periodIndex: 3,
    subjectId: 'hut300',
    status: 'absent',
    note: 'College hostel union meeting',
  },
  {
    id: 'rec_2026-10-12_4',
    date: '2026-10-12',
    periodIndex: 4,
    subjectId: 'cst308',
    status: 'present',
  },
  {
    id: 'rec_2026-10-12_5',
    date: '2026-10-12',
    periodIndex: 5,
    subjectId: 'cst302',
    status: 'present',
  },
];
