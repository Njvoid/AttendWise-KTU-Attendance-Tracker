import { Holiday, Subject, TimetableSlot } from '../types';

export interface AttendanceMetrics {
  percentage: number;
  safeBunkCount: number;
  recoveryCount: number;
  status: 'safe' | 'condonation' | 'critical';
  condonationFee: number;
}

/**
 * Calculates KTU attendance metrics for a subject.
 * Mandatory minimum: 75%
 * Condonation bracket: 60% - 74.9% (fine/fee applies, medical certificate required)
 * Shortage: < 60% (Detained / not permitted to sit for university examination)
 */
export function calculateSubjectMetrics(
  attended: number,
  conducted: number,
  targetPercentage = 75
): AttendanceMetrics {
  if (conducted === 0) {
    return {
      percentage: 100,
      safeBunkCount: 0,
      recoveryCount: 0,
      status: 'safe',
      condonationFee: 0,
    };
  }

  const percentage = (attended / conducted) * 100;
  const targetFraction = targetPercentage / 100;

  let safeBunkCount = 0;
  let recoveryCount = 0;

  if (percentage >= targetPercentage) {
    // How many classes can safely be missed so that attended / (conducted + x) >= targetFraction?
    // attended >= targetFraction * (conducted + x)
    // x <= (attended - targetFraction * conducted) / targetFraction
    safeBunkCount = Math.max(0, Math.floor((attended - targetFraction * conducted) / targetFraction));
  } else {
    // How many consecutive classes must be attended so that (attended + y) / (conducted + y) >= targetFraction?
    // attended + y >= targetFraction * conducted + targetFraction * y
    // y * (1 - targetFraction) >= targetFraction * conducted - attended
    // y >= (targetFraction * conducted - attended) / (1 - targetFraction)
    const needed = (targetFraction * conducted - attended) / (1 - targetFraction);
    recoveryCount = Math.max(1, Math.ceil(needed));
  }

  let status: 'safe' | 'condonation' | 'critical' = 'safe';
  let condonationFee = 0;

  if (percentage >= 75) {
    status = 'safe';
    condonationFee = 0;
  } else if (percentage >= 60) {
    status = 'condonation';
    // KTU standard condonation fee: ₹500 - ₹1000 depending on exact bracket
    condonationFee = percentage >= 68 ? 500 : 1000;
  } else {
    status = 'critical';
    condonationFee = 0; // Not condonable if below 60%
  }

  return {
    percentage: Math.round(percentage * 10) / 10,
    safeBunkCount,
    recoveryCount,
    status,
    condonationFee,
  };
}

/**
 * Calculates overall attendance across all subjects
 */
export function calculateTotalMetrics(subjects: Subject[], targetPercentage = 75) {
  const totalAttended = subjects.reduce((sum, s) => sum + s.attendedClasses, 0);
  const totalConducted = subjects.reduce((sum, s) => sum + s.totalConducted, 0);

  const baseMetrics = calculateSubjectMetrics(totalAttended, totalConducted, targetPercentage);
  const subjectsAtRisk = subjects.filter((s) => {
    const m = calculateSubjectMetrics(s.attendedClasses, s.totalConducted, targetPercentage);
    return m.status !== 'safe';
  });

  const totalCondonationFee = subjects.reduce((sum, s) => {
    const m = calculateSubjectMetrics(s.attendedClasses, s.totalConducted, targetPercentage);
    return sum + m.condonationFee;
  }, 0);

  return {
    ...baseMetrics,
    totalAttended,
    totalConducted,
    subjectsAtRiskCount: subjectsAtRisk.length,
    totalCondonationFee,
  };
}

/**
 * Calculates working days between start and end date excluding weekends and holidays
 */
export function calculateWorkingDays(
  startDateStr: string,
  endDateStr: string,
  holidays: Holiday[]
): {
  totalCalendarDays: number;
  weekendDays: number;
  publicHolidayDays: number;
  userHolidayDays: number;
  netWorkingDays: number;
} {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
    return {
      totalCalendarDays: 0,
      weekendDays: 0,
      publicHolidayDays: 0,
      userHolidayDays: 0,
      netWorkingDays: 0,
    };
  }

  let totalCalendarDays = 0;
  let weekendDays = 0;
  const holidayDateSet = new Map<string, Holiday>();

  holidays.forEach((h) => {
    holidayDateSet.set(h.date, h);
  });

  let publicHolidayDays = 0;
  let userHolidayDays = 0;
  let netWorkingDays = 0;

  const current = new Date(start);
  while (current <= end) {
    totalCalendarDays++;
    const dayOfWeek = current.getDay(); // 0 is Sunday, 6 is Saturday
    const dateKey = current.toISOString().split('T')[0];

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendDays++;
    } else {
      // Weekday
      if (holidayDateSet.has(dateKey)) {
        const holiday = holidayDateSet.get(dateKey)!;
        if (holiday.type === 'public') {
          publicHolidayDays++;
        } else {
          userHolidayDays++;
        }
      } else {
        netWorkingDays++;
      }
    }
    current.setDate(current.getDate() + 1);
  }

  return {
    totalCalendarDays,
    weekendDays,
    publicHolidayDays,
    userHolidayDays,
    netWorkingDays,
  };
}

/**
 * Helper to get day name for a given date string (YYYY-MM-DD)
 */
export function getDayOfWeekFromDate(dateStr: string): 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | null {
  const d = new Date(dateStr);
  const day = d.getDay();
  switch (day) {
    case 1:
      return 'Mon';
    case 2:
      return 'Tue';
    case 3:
      return 'Wed';
    case 4:
      return 'Thu';
    case 5:
      return 'Fri';
    default:
      return null;
  }
}
