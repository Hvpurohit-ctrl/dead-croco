export type Role = 'worker' | 'admin' | 'supervisor';
export type IndustryType = 'construction' | 'college' | 'factory' | 'hospital';
export type Language = 'en' | 'hi' | 'ta';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  roleTitle: string;
  avatar: string;
  industry: IndustryType;
  department: string;
  workplace: string;
  hourlyRate: number;
  overtimeRate: number;
  phone?: string;
  joinedDate: string;
}

export interface AttendanceRecord {
  id: string;
  workerId: string;
  workerName: string;
  date: string; // YYYY-MM-DD
  checkIn: string; // ISO string
  checkOut?: string; // ISO string
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
  status: 'checked_in' | 'completed' | 'flagged';
  workplace: string;
  industry: IndustryType;
  notes?: string;
}

export interface DeductionsBreakdown {
  tax: number;
  socialSecurity: number;
  healthInsurance: number;
  equipmentDeposit?: number;
  unionDues?: number;
}

export interface Payslip {
  id: string;
  workerId: string;
  workerName: string;
  payPeriod: string; // e.g. "October 2026 (Week 4)"
  periodStart: string;
  periodEnd: string;
  regularHours: number;
  overtimeHours: number;
  hourlyRate: number;
  overtimeRate: number;
  basePay: number;
  overtimePay: number;
  grossPay: number;
  deductions: DeductionsBreakdown;
  totalDeductions: number;
  netPay: number;
  status: 'paid' | 'pending';
  paymentDate: string;
  explanationNotes: string[];
}

export type HazardCategory =
  | 'equipment'
  | 'fall_hazard'
  | 'chemical'
  | 'electrical'
  | 'ergonomic'
  | 'sanitation'
  | 'fire_safety'
  | 'harassment'
  | 'other';

export type HazardSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ComplaintStatus = 'submitted' | 'under_review' | 'in_progress' | 'resolved';

export interface SafetyComplaint {
  id: string; // e.g. "DC-SAF-8921"
  workerId: string;
  workerName: string;
  isAnonymous: boolean;
  title: string;
  description: string;
  category: HazardCategory;
  severity: HazardSeverity;
  location: string;
  workplace: string;
  industry: IndustryType;
  photoUrl?: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  resolutionNotes?: string;
  assignedTo?: string;
}

export interface AnonymousFeedback {
  id: string;
  category: 'management' | 'workload' | 'facilities' | 'working_conditions';
  industry: IndustryType;
  department: string;
  message: string;
  severity: 'neutral' | 'concern' | 'urgent';
  createdAt: string;
  adminAcknowledgment?: string;
  acknowledgedAt?: string;
}

export interface SkillItem {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  verified: boolean;
  category: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  dateObtained: string;
  expiryDate: string;
  certificateNumber: string;
  verified: boolean;
}

export interface WorkExperienceItem {
  company: string;
  role: string;
  period: string;
  verifiedHours: number;
  endorsements: number;
}

export interface SkillPassport {
  id: string;
  workerId: string;
  workerName: string;
  industry: IndustryType;
  headline: string;
  skills: SkillItem[];
  certifications: CertificationItem[];
  trainingsCompleted: { title: string; date: string; hours: number }[];
  workHistory: WorkExperienceItem[];
  safetyRating: number; // 0-100%
  overallScore: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'shift' | 'complaint' | 'announcement' | 'fatigue';
  timestamp: string;
  read: boolean;
}

export interface FatigueAlert {
  id: string;
  workerId: string;
  workerName: string;
  roleTitle: string;
  workplace: string;
  industry: IndustryType;
  ruleViolated: string;
  metricValue: string;
  threshold: string;
  recommendedAction: string;
  severity: 'warning' | 'critical';
  timestamp: string;
}

export interface ShiftPlan {
  id: string;
  workerId: string;
  workerName: string;
  roleTitle: string;
  date: string;
  startTime: string;
  endTime: string;
  workplace: string;
  department: string;
  industry: IndustryType;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}
