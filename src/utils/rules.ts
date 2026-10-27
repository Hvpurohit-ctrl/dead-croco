import { AttendanceRecord, DeductionsBreakdown, FatigueAlert, Payslip, SkillPassport, User } from '../types';

/**
 * Calculates regular and overtime hours from check-in and check-out timestamps.
 * Standard workday limit is 8 hours. Any additional time is counted as overtime.
 */
export function calculateShiftHours(
  checkInIso: string,
  checkOutIso: string,
  standardHoursThreshold: number = 8
): { regularHours: number; overtimeHours: number; totalHours: number } {
  const start = new Date(checkInIso).getTime();
  const end = new Date(checkOutIso).getTime();

  if (isNaN(start) || isNaN(end) || end <= start) {
    return { regularHours: 0, overtimeHours: 0, totalHours: 0 };
  }

  const durationMs = end - start;
  const totalHours = Math.round((durationMs / (1000 * 60 * 60)) * 100) / 100;

  if (totalHours <= standardHoursThreshold) {
    return {
      regularHours: totalHours,
      overtimeHours: 0,
      totalHours,
    };
  }

  const regularHours = standardHoursThreshold;
  const overtimeHours = Math.round((totalHours - standardHoursThreshold) * 100) / 100;

  return {
    regularHours,
    overtimeHours,
    totalHours,
  };
}

/**
 * Computes transparent salary breakdown with full mathematical explanations.
 */
export function calculateSalaryBreakdown(
  regularHours: number,
  overtimeHours: number,
  hourlyRate: number,
  overtimeRate: number,
  deductionsInput?: Partial<DeductionsBreakdown>
): {
  basePay: number;
  overtimePay: number;
  grossPay: number;
  deductions: DeductionsBreakdown;
  totalDeductions: number;
  netPay: number;
  explanationNotes: string[];
} {
  const basePay = Math.round(regularHours * hourlyRate * 100) / 100;
  const overtimePay = Math.round(overtimeHours * overtimeRate * 100) / 100;
  const grossPay = Math.round((basePay + overtimePay) * 100) / 100;

  // Standard statutory and benefits deductions (or custom)
  const tax = Math.round((deductionsInput?.tax ?? grossPay * 0.05) * 100) / 100;
  const socialSecurity = Math.round((deductionsInput?.socialSecurity ?? grossPay * 0.03) * 100) / 100;
  const healthInsurance = Math.round((deductionsInput?.healthInsurance ?? 120) * 100) / 100;
  const equipmentDeposit = Math.round((deductionsInput?.equipmentDeposit ?? 0) * 100) / 100;
  const unionDues = Math.round((deductionsInput?.unionDues ?? 50) * 100) / 100;

  const deductions: DeductionsBreakdown = {
    tax,
    socialSecurity,
    healthInsurance,
    equipmentDeposit,
    unionDues,
  };

  const totalDeductions =
    Math.round(
      (deductions.tax +
        deductions.socialSecurity +
        deductions.healthInsurance +
        (deductions.equipmentDeposit || 0) +
        (deductions.unionDues || 0)) *
        100
    ) / 100;

  const netPay = Math.max(0, Math.round((grossPay - totalDeductions) * 100) / 100);

  const explanationNotes = [
    `Base Pay: ${regularHours.toFixed(1)} hrs × ₹${hourlyRate}/hr = ₹${basePay.toLocaleString()}`,
    `Overtime Pay (1.5× rate): ${overtimeHours.toFixed(1)} hrs × ₹${overtimeRate}/hr = ₹${overtimePay.toLocaleString()}`,
    `Gross Earnings: ₹${grossPay.toLocaleString()}`,
    `Statutory & Benefit Deductions: ₹${totalDeductions.toLocaleString()} (Tax: ₹${tax}, Social Security: ₹${socialSecurity}, Health: ₹${healthInsurance}, Union: ₹${unionDues})`,
    `Final Net Disbursed: ₹${netPay.toLocaleString()}`,
  ];

  return {
    basePay,
    overtimePay,
    grossPay,
    deductions,
    totalDeductions,
    netPay,
    explanationNotes,
  };
}

/**
 * Rule-based Fatigue Monitoring System:
 * Evaluates working records against ILO safety guidelines:
 * 1. Single-shift duration > 10 hours
 * 2. Less than 11 hours rest period between consecutive shifts
 * 3. Weekly cumulative hours > 52 hours
 */
export function evaluateFatigueAlerts(
  worker: User,
  workerAttendance: AttendanceRecord[]
): FatigueAlert[] {
  const alerts: FatigueAlert[] = [];

  // Sort attendance by checkIn time ascending
  const sorted = [...workerAttendance].sort(
    (a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime()
  );

  // Check 1: Single shift > 10 hours
  sorted.forEach((record) => {
    if (record.totalHours > 10) {
      alerts.push({
        id: `FAT-EXCESS-${record.id}`,
        workerId: worker.id,
        workerName: worker.name,
        roleTitle: worker.roleTitle,
        workplace: worker.workplace,
        industry: worker.industry,
        ruleViolated: 'Single Shift Limit Exceeded (>10h)',
        metricValue: `${record.totalHours} hrs on ${record.date}`,
        threshold: '10.0 hrs max per shift',
        recommendedAction: 'Administrator should enforce mandatory relief break and review overtime assignment.',
        severity: record.totalHours > 12 ? 'critical' : 'warning',
        timestamp: record.checkIn,
      });
    }
  });

  // Check 2: Minimum Rest Interval (<11 hours between end of one shift and start of next)
  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i];
    const next = sorted[i + 1];

    if (current.checkOut && next.checkIn) {
      const prevEnd = new Date(current.checkOut).getTime();
      const nextStart = new Date(next.checkIn).getTime();
      const restHours = (nextStart - prevEnd) / (1000 * 60 * 60);

      if (restHours >= 0 && restHours < 11) {
        alerts.push({
          id: `FAT-REST-${next.id}`,
          workerId: worker.id,
          workerName: worker.name,
          roleTitle: worker.roleTitle,
          workplace: worker.workplace,
          industry: worker.industry,
          ruleViolated: 'Insufficient Rest Interval (<11h)',
          metricValue: `${restHours.toFixed(1)} hrs between shifts`,
          threshold: '11.0 hrs mandatory recovery rest',
          recommendedAction: 'Reschedule shift start time to allow compliant physiological recovery.',
          severity: restHours < 8 ? 'critical' : 'warning',
          timestamp: next.checkIn,
        });
      }
    }
  }

  // Check 3: Weekly cumulative hours > 50 hours
  const totalRecentHours = sorted.reduce((sum, r) => sum + r.totalHours, 0);
  if (totalRecentHours > 50) {
    alerts.push({
      id: `FAT-WEEKLY-${worker.id}`,
      workerId: worker.id,
      workerName: worker.name,
      roleTitle: worker.roleTitle,
      workplace: worker.workplace,
      industry: worker.industry,
      ruleViolated: 'High Weekly Cumulative Workload (>50h)',
      metricValue: `${totalRecentHours.toFixed(1)} hrs total`,
      threshold: '50.0 hrs weekly ceiling',
      recommendedAction: 'Rotate shift duties with standby crew to prevent chronic exhaustion.',
      severity: 'warning',
      timestamp: new Date().toISOString(),
    });
  }

  return alerts;
}

/**
 * Generates official formatted ID for complaints or documents.
 */
export function generateComplaintId(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `DC-SAF-${randomSuffix}`;
}

/**
 * Calculates skill passport readiness score.
 */
export function calculateSkillPassportMetrics(passport: SkillPassport): {
  verifiedSkillsCount: number;
  totalSkillsCount: number;
  certificationsActive: number;
  verifiedHoursTotal: number;
  overallScore: number;
} {
  const verifiedSkillsCount = passport.skills.filter((s) => s.verified).length;
  const totalSkillsCount = passport.skills.length;
  const certificationsActive = passport.certifications.length;
  const verifiedHoursTotal = passport.workHistory.reduce((acc, w) => acc + w.verifiedHours, 0);

  // Score from 0 to 100 based on verified skills, certs, and experience
  const skillRatio = totalSkillsCount > 0 ? verifiedSkillsCount / totalSkillsCount : 0;
  const certScore = Math.min(certificationsActive * 15, 30);
  const skillScore = Math.min(skillRatio * 40, 40);
  const expScore = Math.min((verifiedHoursTotal / 500) * 30, 30);

  const overallScore = Math.min(100, Math.round(skillScore + certScore + expScore));

  return {
    verifiedSkillsCount,
    totalSkillsCount,
    certificationsActive,
    verifiedHoursTotal,
    overallScore,
  };
}
