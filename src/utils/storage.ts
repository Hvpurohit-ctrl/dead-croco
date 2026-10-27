import { useEffect, useState } from 'react';
import {
  AnonymousFeedback,
  AttendanceRecord,
  ComplaintStatus,
  FatigueAlert,
  IndustryType,
  NotificationItem,
  Payslip,
  ShiftPlan,
  SkillPassport,
  User,
  SafetyComplaint,
} from '../types';
import {
  calculateSalaryBreakdown,
  calculateShiftHours,
  evaluateFatigueAlerts,
  generateComplaintId,
} from './rules';

export interface AppState {
  currentUser: User;
  users: User[];
  attendance: AttendanceRecord[];
  payslips: Payslip[];
  complaints: SafetyComplaint[];
  feedback: AnonymousFeedback[];
  skillPassports: Record<string, SkillPassport>;
  notifications: NotificationItem[];
  shifts: ShiftPlan[];
  activeIndustry: IndustryType;
}

const STORAGE_KEY = 'dead_croco_workforce_data_v1';

// Initial realistic demo users
const initialUsers: User[] = [
  {
    id: 'user-worker-1',
    name: 'Raju Kumar',
    email: 'raju.kumar@deadcroco.work',
    role: 'worker',
    roleTitle: 'Scaffolding & Rigging Lead',
    avatar: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=150&auto=format&fit=crop&q=80',
    industry: 'construction',
    department: 'Heavy Infrastructure',
    workplace: 'Metro Rail Construction Line 4 - Pier 112',
    hourlyRate: 260,
    overtimeRate: 390,
    phone: '+91 98765 43210',
    joinedDate: '2024-03-15',
  },
  {
    id: 'user-worker-2',
    name: 'Anita Murthy',
    email: 'anita.murthy@deadcroco.work',
    role: 'worker',
    roleTitle: 'Lead Housekeeping & Sanitation Officer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    industry: 'college',
    department: 'Campus Facilities & Hygiene',
    workplace: 'Apex National University - Science Block & Labs',
    hourlyRate: 220,
    overtimeRate: 330,
    phone: '+91 98451 22334',
    joinedDate: '2024-08-01',
  },
  {
    id: 'user-admin-1',
    name: 'Vikram Sharma',
    email: 'vikram.sharma@deadcroco.work',
    role: 'admin',
    roleTitle: 'Site Operations & EHS Safety Director',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    industry: 'construction',
    department: 'Environment, Health & Safety (EHS)',
    workplace: 'Metro Rail Construction Line 4',
    hourlyRate: 650,
    overtimeRate: 975,
    phone: '+91 99112 33445',
    joinedDate: '2023-01-10',
  },
  {
    id: 'user-admin-2',
    name: 'Dr. Priya Raman',
    email: 'priya.raman@deadcroco.work',
    role: 'admin',
    roleTitle: 'Dean of Campus Operations & Personnel Safety',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    industry: 'college',
    department: 'Campus Administration',
    workplace: 'Apex National University Main Campus',
    hourlyRate: 620,
    overtimeRate: 930,
    phone: '+91 97234 56789',
    joinedDate: '2023-06-20',
  },
  {
    id: 'user-worker-3',
    name: 'Sunil Verma',
    email: 'sunil.verma@deadcroco.work',
    role: 'worker',
    roleTitle: 'Tower Crane Operator',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    industry: 'construction',
    department: 'Heavy Machinery',
    workplace: 'Metro Rail Construction Line 4',
    hourlyRate: 290,
    overtimeRate: 435,
    joinedDate: '2024-05-12',
  },
  {
    id: 'user-worker-4',
    name: 'Deepak Sharma',
    email: 'deepak.sharma@deadcroco.work',
    role: 'worker',
    roleTitle: 'Senior Campus Security Specialist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    industry: 'college',
    department: 'Campus Security',
    workplace: 'Apex National University Gate 1 & Hostels',
    hourlyRate: 230,
    overtimeRate: 345,
    joinedDate: '2024-02-18',
  },
];

// Seed attendance records
const initialAttendance: AttendanceRecord[] = [
  {
    id: 'att-101',
    workerId: 'user-worker-1',
    workerName: 'Raju Kumar',
    date: '2026-10-24',
    checkIn: '2026-10-24T07:30:00.000Z',
    checkOut: '2026-10-24T18:00:00.000Z',
    regularHours: 8,
    overtimeHours: 2.5,
    totalHours: 10.5,
    status: 'completed',
    workplace: 'Metro Rail Construction Line 4 - Pier 112',
    industry: 'construction',
    notes: 'Reinforced girder scaffolding assembly before concrete pour.',
  },
  {
    id: 'att-102',
    workerId: 'user-worker-1',
    workerName: 'Raju Kumar',
    date: '2026-10-25',
    checkIn: '2026-10-25T07:45:00.000Z',
    checkOut: '2026-10-25T16:45:00.000Z',
    regularHours: 8,
    overtimeHours: 1.0,
    totalHours: 9.0,
    status: 'completed',
    workplace: 'Metro Rail Construction Line 4 - Pier 112',
    industry: 'construction',
  },
  {
    id: 'att-103',
    workerId: 'user-worker-1',
    workerName: 'Raju Kumar',
    date: '2026-10-26',
    checkIn: '2026-10-26T08:00:00.000Z',
    checkOut: '2026-10-26T16:00:00.000Z',
    regularHours: 8,
    overtimeHours: 0,
    totalHours: 8.0,
    status: 'completed',
    workplace: 'Metro Rail Construction Line 4 - Pier 112',
    industry: 'construction',
  },
  {
    id: 'att-104',
    workerId: 'user-worker-2',
    workerName: 'Anita Murthy',
    date: '2026-10-25',
    checkIn: '2026-10-25T06:00:00.000Z',
    checkOut: '2026-10-25T14:30:00.000Z',
    regularHours: 8,
    overtimeHours: 0.5,
    totalHours: 8.5,
    status: 'completed',
    workplace: 'Apex National University - Science Block & Labs',
    industry: 'college',
  },
  {
    id: 'att-105',
    workerId: 'user-worker-2',
    workerName: 'Anita Murthy',
    date: '2026-10-26',
    checkIn: '2026-10-26T06:00:00.000Z',
    checkOut: '2026-10-26T14:00:00.000Z',
    regularHours: 8,
    overtimeHours: 0,
    totalHours: 8.0,
    status: 'completed',
    workplace: 'Apex National University - Science Block & Labs',
    industry: 'college',
  },
  {
    id: 'att-106',
    workerId: 'user-worker-3',
    workerName: 'Sunil Verma',
    date: '2026-10-26',
    checkIn: '2026-10-26T07:00:00.000Z',
    checkOut: '2026-10-26T18:45:00.000Z',
    regularHours: 8,
    overtimeHours: 3.75,
    totalHours: 11.75,
    status: 'completed',
    workplace: 'Metro Rail Construction Line 4',
    industry: 'construction',
  },
];

// Seed payslips
const initialPayslips: Payslip[] = [
  {
    id: 'DC-PAY-2026-W42',
    workerId: 'user-worker-1',
    workerName: 'Raju Kumar',
    payPeriod: 'October 2026 (Week 3)',
    periodStart: '2026-10-12',
    periodEnd: '2026-10-18',
    regularHours: 40,
    overtimeHours: 7.5,
    hourlyRate: 260,
    overtimeRate: 390,
    basePay: 10400,
    overtimePay: 2925,
    grossPay: 13325,
    deductions: {
      tax: 666.25,
      socialSecurity: 399.75,
      healthInsurance: 150,
      unionDues: 50,
      equipmentDeposit: 0,
    },
    totalDeductions: 1266,
    netPay: 12059,
    status: 'paid',
    paymentDate: '2026-10-20',
    explanationNotes: [
      'Base Pay: 40.0 hrs × ₹260/hr = ₹10,400',
      'Overtime Pay: 7.5 hrs × ₹390/hr (1.5× rate) = ₹2,925',
      'Gross Earnings: ₹13,325',
      'Statutory & Benefit Deductions: ₹1,266 (Tax 5%, Social Security 3%, Health Insurance ₹150, Union Dues ₹50)',
      'Final Net Disbursed into Bank: ₹12,059',
    ],
  },
  {
    id: 'DC-PAY-2026-W41',
    workerId: 'user-worker-1',
    workerName: 'Raju Kumar',
    payPeriod: 'October 2026 (Week 2)',
    periodStart: '2026-10-05',
    periodEnd: '2026-10-11',
    regularHours: 40,
    overtimeHours: 4.0,
    hourlyRate: 260,
    overtimeRate: 390,
    basePay: 10400,
    overtimePay: 1560,
    grossPay: 11960,
    deductions: {
      tax: 598,
      socialSecurity: 358.8,
      healthInsurance: 150,
      unionDues: 50,
    },
    totalDeductions: 1156.8,
    netPay: 10803.2,
    status: 'paid',
    paymentDate: '2026-10-13',
    explanationNotes: [
      'Base Pay: 40.0 hrs × ₹260/hr = ₹10,400',
      'Overtime Pay: 4.0 hrs × ₹390/hr = ₹1,560',
      'Net Pay: ₹10,803.20 after verified deductions',
    ],
  },
  {
    id: 'DC-PAY-COLLEGE-W42',
    workerId: 'user-worker-2',
    workerName: 'Anita Murthy',
    payPeriod: 'October 2026 (Week 3)',
    periodStart: '2026-10-12',
    periodEnd: '2026-10-18',
    regularHours: 40,
    overtimeHours: 3.0,
    hourlyRate: 220,
    overtimeRate: 330,
    basePay: 8800,
    overtimePay: 990,
    grossPay: 9790,
    deductions: {
      tax: 489.5,
      socialSecurity: 293.7,
      healthInsurance: 120,
      unionDues: 40,
    },
    totalDeductions: 943.2,
    netPay: 8846.8,
    status: 'paid',
    paymentDate: '2026-10-20',
    explanationNotes: [
      'Base Pay: 40.0 hrs × ₹220/hr = ₹8,800',
      'Overtime Pay: 3.0 hrs × ₹330/hr = ₹990',
      'Net Pay: ₹8,846.80',
    ],
  },
];

// Seed Safety Complaints
const initialComplaints: SafetyComplaint[] = [
  {
    id: 'DC-SAF-8921',
    workerId: 'user-worker-1',
    workerName: 'Raju Kumar',
    isAnonymous: false,
    title: 'Loose Scaffolding Clamp on Pier 112 Elevation B',
    description:
      'Two coupler clamps on the east ledger of Pier 112 are stripped and vibrating loose under vibrating pile driver load. Risk of partial plank collapse.',
    category: 'fall_hazard',
    severity: 'critical',
    location: 'Pier 112, East Elevation scaffolding grid',
    workplace: 'Metro Rail Construction Line 4',
    industry: 'construction',
    photoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
    status: 'in_progress',
    createdAt: '2026-10-26T09:15:00.000Z',
    updatedAt: '2026-10-26T11:30:00.000Z',
    resolutionNotes: 'Site Safety Officer dispatched replacement drop-forged couplers. Grid quarantined until 14:00 inspection signoff.',
    assignedTo: 'Vikram Sharma',
  },
  {
    id: 'DC-SAF-8922',
    workerId: 'user-worker-3',
    workerName: 'Sunil Verma',
    isAnonymous: false,
    title: 'Faulty Limit Switch on Tower Crane 2 Hoist',
    description:
      'Secondary anti-two-block limit switch intermittently failing during high wind gusts. Needs recalibration before lifting rebar bundles.',
    category: 'equipment',
    severity: 'high',
    location: 'Sector 3 Tower Crane 2 Cab',
    workplace: 'Metro Rail Construction Line 4',
    industry: 'construction',
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    status: 'under_review',
    createdAt: '2026-10-26T14:40:00.000Z',
    updatedAt: '2026-10-26T15:00:00.000Z',
    resolutionNotes: 'Electrical technician queued for 07:00 morning inspection.',
    assignedTo: 'Vikram Sharma',
  },
  {
    id: 'DC-SAF-4103',
    workerId: 'user-worker-2',
    workerName: 'Anita Murthy',
    isAnonymous: false,
    title: 'Exposed Chemical Drain Fumes in Chemistry Lab B-204',
    description:
      'Acid discharge drain trap under fume hood 3 is leaking solvent fumes into common corridor. Housekeeping crew experienced stinging eye irritation.',
    category: 'chemical',
    severity: 'high',
    location: 'Science Complex, 2nd Floor Chemistry Wing',
    workplace: 'Apex National University',
    industry: 'college',
    photoUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    status: 'under_review',
    createdAt: '2026-10-26T08:20:00.000Z',
    updatedAt: '2026-10-26T09:00:00.000Z',
    resolutionNotes: 'Campus facilities team cordoned off the corridor and contacted lab ventilation vendor.',
    assignedTo: 'Dr. Priya Raman',
  },
  {
    id: 'DC-SAF-4104',
    workerId: 'user-worker-4',
    workerName: 'Deepak Sharma',
    isAnonymous: true,
    title: 'Broken Perimeter High-Mast Floodlight Near Girls Hostel',
    description:
      'Floodlight 4 on east pathway has been dark for 3 nights. Leaves blind spot along campus tree line during shift change.',
    category: 'electrical',
    severity: 'medium',
    location: 'Hostel East Pathway, Post #4',
    workplace: 'Apex National University',
    industry: 'college',
    status: 'resolved',
    createdAt: '2026-10-23T19:00:00.000Z',
    updatedAt: '2026-10-24T12:00:00.000Z',
    resolutionNotes: 'LED driver replaced and illumination test verified by campus security patrol at 22:00.',
    assignedTo: 'Dr. Priya Raman',
  },
];

// Seed Anonymous Feedback (100% Anonymized)
const initialFeedback: AnonymousFeedback[] = [
  {
    id: 'fb-201',
    category: 'facilities',
    industry: 'construction',
    department: 'Structural',
    message:
      'The drinking water dispenser near Pier 110 has been empty by 13:00 every afternoon. Workers are forced to walk 600m in the heat for clean hydration.',
    severity: 'urgent',
    createdAt: '2026-10-25T11:00:00.000Z',
    adminAcknowledgment: 'Two additional 50-liter chilled water tanks installed at Pier 110 today.',
    acknowledgedAt: '2026-10-26T09:00:00.000Z',
  },
  {
    id: 'fb-202',
    category: 'workload',
    industry: 'construction',
    department: 'Heavy Infrastructure',
    message:
      'Overtime calls on Sunday nights are given with less than 2 hours notice, making family planning impossible.',
    severity: 'concern',
    createdAt: '2026-10-24T16:20:00.000Z',
    adminAcknowledgment: 'Shift roster policy updated: Sunday overtime assignments must now be finalized by Friday 17:00.',
    acknowledgedAt: '2026-10-25T10:00:00.000Z',
  },
  {
    id: 'fb-203',
    category: 'working_conditions',
    industry: 'college',
    department: 'Campus Facilities & Hygiene',
    message:
      'Sanitation workers are still using diluted floor detergents without nitrile gloves. Reusable heavy-duty gloves were promised last month.',
    severity: 'urgent',
    createdAt: '2026-10-25T08:30:00.000Z',
    adminAcknowledgment: 'Bulk stock of chemical-resistant nitrile gloves arrived at Central Stores; distributed to all morning supervisors.',
    acknowledgedAt: '2026-10-25T14:00:00.000Z',
  },
];

// Seed Skill Passports
const initialSkillPassports: Record<string, SkillPassport> = {
  'user-worker-1': {
    id: 'SP-RAJU-KUMAR',
    workerId: 'user-worker-1',
    workerName: 'Raju Kumar',
    industry: 'construction',
    headline: 'Senior Certified Scaffolding Specialist & Rigging Foreman',
    safetyRating: 99.2,
    overallScore: 92,
    skills: [
      { name: 'System Scaffolding (Cuplok/Layher)', level: 'Expert', verified: true, category: 'Technical' },
      { name: 'Fall Arrest & Edge Protection', level: 'Expert', verified: true, category: 'Safety' },
      { name: 'Structural Load Calculation', level: 'Advanced', verified: true, category: 'Engineering' },
      { name: 'Confined Space Entry', level: 'Intermediate', verified: true, category: 'Safety' },
      { name: 'Emergency Rescue Rigging', level: 'Advanced', verified: true, category: 'Safety' },
      { name: 'Civil Engineering Blueprint Reading', level: 'Intermediate', verified: false, category: 'Technical' },
    ],
    certifications: [
      {
        id: 'cert-1',
        title: 'OSHA 30-Hour Construction Safety',
        issuer: 'OSHA Standards Board',
        dateObtained: '2024-04-10',
        expiryDate: '2027-04-10',
        certificateNumber: 'OSH-30-IND-88492',
        verified: true,
      },
      {
        id: 'cert-2',
        title: 'Advanced Rigging & Slinging (Level 2)',
        issuer: 'National Safety Council',
        dateObtained: '2025-01-18',
        expiryDate: '2028-01-18',
        certificateNumber: 'NSC-RIG-5521',
        verified: true,
      },
      {
        id: 'cert-3',
        title: 'First Aid & CPR at Heights',
        issuer: 'Red Cross Certified Responder',
        dateObtained: '2025-06-02',
        expiryDate: '2027-06-02',
        certificateNumber: 'RC-FA-2025-091',
        verified: true,
      },
    ],
    trainingsCompleted: [
      { title: 'Safe Scaffolding Erection & Dismantling Protocol', date: '2026-01-15', hours: 24 },
      { title: 'Working Near High-Voltage Rail Lines', date: '2026-03-22', hours: 16 },
      { title: 'Heat Stress Management on Open Sites', date: '2026-07-05', hours: 8 },
    ],
    workHistory: [
      {
        company: 'Metro Rail Construction Corp',
        role: 'Scaffolding & Rigging Lead',
        period: '2024 - Present',
        verifiedHours: 2420,
        endorsements: 18,
      },
      {
        company: 'Apex Infrastructure Ltd',
        role: 'Assistant Scaffolder',
        period: '2022 - 2024',
        verifiedHours: 3200,
        endorsements: 12,
      },
    ],
  },
  'user-worker-2': {
    id: 'SP-ANITA-MURTHY',
    workerId: 'user-worker-2',
    workerName: 'Anita Murthy',
    industry: 'college',
    headline: 'Lead Campus Hygiene Specialist & Bio-Hazard Protocol Handler',
    safetyRating: 98.5,
    overallScore: 88,
    skills: [
      { name: 'Chemical Spill Neutralization', level: 'Expert', verified: true, category: 'Safety' },
      { name: 'Laboratory Waste Segregation', level: 'Advanced', verified: true, category: 'Technical' },
      { name: 'Industrial Sanitation Machinery', level: 'Advanced', verified: true, category: 'Equipment' },
      { name: 'Infection Prevention & Control', level: 'Expert', verified: true, category: 'Health' },
      { name: 'Hazardous Waste Documentation', level: 'Intermediate', verified: true, category: 'Compliance' },
    ],
    certifications: [
      {
        id: 'cert-10',
        title: 'Institutional Bio-Safety & HazMat Handling',
        issuer: 'Higher Education Safety Authority',
        dateObtained: '2024-09-01',
        expiryDate: '2027-09-01',
        certificateNumber: 'HESA-BIO-4412',
        verified: true,
      },
      {
        id: 'cert-11',
        title: 'Workplace Fire Extinguisher & Evacuation Leader',
        issuer: 'State Fire Department',
        dateObtained: '2025-02-14',
        expiryDate: '2027-02-14',
        certificateNumber: 'SFD-EVAC-990',
        verified: true,
      },
    ],
    trainingsCompleted: [
      { title: 'University Chemical Hygiene Plan Training', date: '2026-02-10', hours: 16 },
      { title: 'Ergonomic Lifting for Facility Staff', date: '2026-05-18', hours: 8 },
    ],
    workHistory: [
      {
        company: 'Apex National University',
        role: 'Lead Housekeeping & Sanitation Officer',
        period: '2024 - Present',
        verifiedHours: 1850,
        endorsements: 14,
      },
    ],
  },
};

// Seed Notifications
const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-worker-1',
    title: 'Safety Report Update (DC-SAF-8921)',
    message: 'Supervisor Vikram Sharma dispatched replacement couplers for Pier 112 grid.',
    type: 'complaint',
    timestamp: '2026-10-26T11:32:00.000Z',
    read: false,
  },
  {
    id: 'notif-2',
    userId: 'user-worker-1',
    title: 'Payslip Verified for October Week 3',
    message: 'Net salary ₹12,059 has been approved and processed to your registered account.',
    type: 'shift',
    timestamp: '2026-10-20T10:00:00.000Z',
    read: true,
  },
  {
    id: 'notif-3',
    userId: 'user-worker-1',
    title: 'Mandatory Hydration Protocol Reminder',
    message: 'Afternoon ambient temperature forecast 37°C. Mandatory 15-minute hydration break at 14:00.',
    type: 'announcement',
    timestamp: '2026-10-26T08:00:00.000Z',
    read: false,
  },
  {
    id: 'notif-4',
    userId: 'user-admin-1',
    title: 'Fatigue Risk Alert: Sunil Verma',
    message: 'Crane operator Sunil Verma logged 11.75 hours on 2026-10-26. Review tomorrow morning shift.',
    type: 'fatigue',
    timestamp: '2026-10-26T18:50:00.000Z',
    read: false,
  },
];

// Seed Shifts
const initialShifts: ShiftPlan[] = [
  {
    id: 'sh-1',
    workerId: 'user-worker-1',
    workerName: 'Raju Kumar',
    roleTitle: 'Scaffolding Lead',
    date: '2026-10-27',
    startTime: '08:00',
    endTime: '16:30',
    workplace: 'Metro Rail Construction Line 4 - Pier 112',
    department: 'Heavy Infrastructure',
    industry: 'construction',
    status: 'scheduled',
  },
  {
    id: 'sh-2',
    workerId: 'user-worker-2',
    workerName: 'Anita Murthy',
    roleTitle: 'Lead Housekeeping Officer',
    date: '2026-10-27',
    startTime: '06:00',
    endTime: '14:00',
    workplace: 'Apex National University - Science Block & Labs',
    department: 'Campus Facilities & Hygiene',
    industry: 'college',
    status: 'scheduled',
  },
  {
    id: 'sh-3',
    workerId: 'user-worker-3',
    workerName: 'Sunil Verma',
    roleTitle: 'Tower Crane Operator',
    date: '2026-10-27',
    startTime: '07:30',
    endTime: '16:00',
    workplace: 'Metro Rail Construction Line 4',
    department: 'Heavy Machinery',
    industry: 'construction',
    status: 'scheduled',
  },
  {
    id: 'sh-4',
    workerId: 'user-worker-4',
    workerName: 'Deepak Sharma',
    roleTitle: 'Campus Security Specialist',
    date: '2026-10-27',
    startTime: '14:00',
    endTime: '22:00',
    workplace: 'Apex National University Gate 1',
    department: 'Campus Security',
    industry: 'college',
    status: 'scheduled',
  },
];

function getDefaultState(): AppState {
  return {
    currentUser: initialUsers[0], // Raju Kumar (Worker) by default
    users: initialUsers,
    attendance: initialAttendance,
    payslips: initialPayslips,
    complaints: initialComplaints,
    feedback: initialFeedback,
    skillPassports: initialSkillPassports,
    notifications: initialNotifications,
    shifts: initialShifts,
    activeIndustry: 'construction',
  };
}

export function loadState(): AppState {
  if (typeof window === 'undefined') {
    return getDefaultState();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const def = getDefaultState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(def));
      return def;
    }
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err) {
    console.error('Failed to parse dead.croco local storage state:', err);
    return getDefaultState();
  }
}

export function saveState(state: AppState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('deadcroco_storage_update', { detail: state }));
  } catch (err) {
    console.error('Failed to save dead.croco local storage state:', err);
  }
}

export function resetState(): AppState {
  const def = getDefaultState();
  saveState(def);
  return def;
}

/**
 * Custom React hook for live synced state
 */
export function useDeadCrocoStore() {
  const [state, setState] = useState<AppState>(() => loadState());

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<AppState>;
      if (customEvent.detail) {
        setState(customEvent.detail);
      } else {
        setState(loadState());
      }
    };

    window.addEventListener('deadcroco_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('deadcroco_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const setCurrentUser = (user: User) => {
    const next = { ...state, currentUser: user, activeIndustry: user.industry };
    saveState(next);
  };

  const setActiveIndustry = (industry: IndustryType) => {
    const next = { ...state, activeIndustry: industry };
    saveState(next);
  };

  // Worker check-in
  const checkIn = (workerId: string) => {
    const nowIso = new Date().toISOString();
    const today = nowIso.split('T')[0];
    const worker = state.users.find((u) => u.id === workerId) || state.currentUser;

    // Check if worker already has an active check-in
    const existingActive = state.attendance.find(
      (a) => a.workerId === workerId && a.status === 'checked_in'
    );
    if (existingActive) {
      return { success: false, message: 'You are already checked in to an active shift!' };
    }

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      workerId: worker.id,
      workerName: worker.name,
      date: today,
      checkIn: nowIso,
      regularHours: 0,
      overtimeHours: 0,
      totalHours: 0,
      status: 'checked_in',
      workplace: worker.workplace,
      industry: worker.industry,
    };

    const next = {
      ...state,
      attendance: [newRecord, ...state.attendance],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          userId: worker.id,
          title: 'Shift Started',
          message: `Checked in successfully at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Work safely!`,
          type: 'shift' as const,
          timestamp: nowIso,
          read: false,
        },
        ...state.notifications,
      ],
    };

    saveState(next);
    return { success: true, message: 'Shift started successfully.', record: newRecord };
  };

  // Worker check-out
  const checkOut = (workerId: string) => {
    const nowIso = new Date().toISOString();
    const active = state.attendance.find(
      (a) => a.workerId === workerId && a.status === 'checked_in'
    );

    if (!active) {
      return { success: false, message: 'No active check-in record found for this worker.' };
    }

    const worker = state.users.find((u) => u.id === workerId) || state.currentUser;
    const { regularHours, overtimeHours, totalHours } = calculateShiftHours(active.checkIn, nowIso, 8);

    const updatedRecord: AttendanceRecord = {
      ...active,
      checkOut: nowIso,
      regularHours,
      overtimeHours,
      totalHours,
      status: 'completed',
    };

    const updatedAttendance = state.attendance.map((a) => (a.id === active.id ? updatedRecord : a));

    // Also update or generate a preview payslip calculation
    const breakdown = calculateSalaryBreakdown(
      regularHours,
      overtimeHours,
      worker.hourlyRate,
      worker.overtimeRate
    );

    const next = {
      ...state,
      attendance: updatedAttendance,
      notifications: [
        {
          id: `notif-${Date.now()}`,
          userId: worker.id,
          title: 'Shift Completed',
          message: `Logged ${totalHours.toFixed(1)} hrs (${overtimeHours > 0 ? `${overtimeHours.toFixed(1)}h overtime` : 'Standard shift'}). Earnings: ₹${breakdown.grossPay.toLocaleString()}`,
          type: 'shift' as const,
          timestamp: nowIso,
          read: false,
        },
        ...state.notifications,
      ],
    };

    saveState(next);
    return { success: true, message: 'Shift completed successfully.', record: updatedRecord };
  };

  // Submit Safety Complaint
  const submitComplaint = (
    data: Omit<SafetyComplaint, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ) => {
    const id = generateComplaintId();
    const now = new Date().toISOString();
    const newComplaint: SafetyComplaint = {
      ...data,
      id,
      status: 'submitted',
      createdAt: now,
      updatedAt: now,
    };

    const next = {
      ...state,
      complaints: [newComplaint, ...state.complaints],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          userId: data.workerId,
          title: `Safety Report Filed (${id})`,
          message: `Your report regarding "${data.title}" has been escalated to site safety officers.`,
          type: 'complaint' as const,
          timestamp: now,
          read: false,
        },
        // Admin alert
        {
          id: `notif-admin-${Date.now()}`,
          userId: 'user-admin-1',
          title: `🚨 New Safety Report: ${id}`,
          message: `${data.severity.toUpperCase()} hazard reported at ${data.location}: ${data.title}`,
          type: 'complaint' as const,
          timestamp: now,
          read: false,
        },
        ...state.notifications,
      ],
    };

    saveState(next);
    return newComplaint;
  };

  // Update Safety Complaint Status (Admin)
  const updateComplaintStatus = (
    complaintId: string,
    status: ComplaintStatus,
    resolutionNotes?: string,
    assignedTo?: string
  ) => {
    const target = state.complaints.find((c) => c.id === complaintId);
    if (!target) return null;

    const now = new Date().toISOString();
    const updated: SafetyComplaint = {
      ...target,
      status,
      resolutionNotes: resolutionNotes || target.resolutionNotes,
      assignedTo: assignedTo || target.assignedTo,
      updatedAt: now,
    };

    const next = {
      ...state,
      complaints: state.complaints.map((c) => (c.id === complaintId ? updated : c)),
      notifications: [
        {
          id: `notif-c-${Date.now()}`,
          userId: target.workerId,
          title: `Report ${complaintId} Updated`,
          message: `Status changed to ${status.toUpperCase().replace('_', ' ')}. ${resolutionNotes ? `Note: "${resolutionNotes}"` : ''}`,
          type: 'complaint' as const,
          timestamp: now,
          read: false,
        },
        ...state.notifications,
      ],
    };

    saveState(next);
    return updated;
  };

  // Submit Anonymous Feedback
  const submitFeedback = (
    category: AnonymousFeedback['category'],
    industry: IndustryType,
    department: string,
    message: string,
    severity: AnonymousFeedback['severity']
  ) => {
    const newFb: AnonymousFeedback = {
      id: `fb-${Date.now()}`,
      category,
      industry,
      department,
      message,
      severity,
      createdAt: new Date().toISOString(),
    };

    const next = {
      ...state,
      feedback: [newFb, ...state.feedback],
    };

    saveState(next);
    return newFb;
  };

  // Acknowledge Anonymous Feedback (Admin)
  const acknowledgeFeedback = (feedbackId: string, acknowledgment: string) => {
    const updated = state.feedback.map((f) =>
      f.id === feedbackId
        ? {
            ...f,
            adminAcknowledgment: acknowledgment,
            acknowledgedAt: new Date().toISOString(),
          }
        : f
    );

    const next = {
      ...state,
      feedback: updated,
    };

    saveState(next);
  };

  // Update Skill Passport
  const updatePassport = (workerId: string, passport: SkillPassport) => {
    const next = {
      ...state,
      skillPassports: {
        ...state.skillPassports,
        [workerId]: passport,
      },
    };
    saveState(next);
  };

  // Create Shift Plan (Admin)
  const createShift = (shift: Omit<ShiftPlan, 'id'>) => {
    const newShift: ShiftPlan = {
      ...shift,
      id: `sh-${Date.now()}`,
    };

    const next = {
      ...state,
      shifts: [newShift, ...state.shifts],
      notifications: [
        {
          id: `notif-sh-${Date.now()}`,
          userId: shift.workerId,
          title: 'New Shift Scheduled',
          message: `Shift assigned on ${shift.date} (${shift.startTime} - ${shift.endTime}) at ${shift.workplace}.`,
          type: 'shift' as const,
          timestamp: new Date().toISOString(),
          read: false,
        },
        ...state.notifications,
      ],
    };

    saveState(next);
    return newShift;
  };

  // Mark notification as read
  const markNotificationRead = (id: string) => {
    const next = {
      ...state,
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    };
    saveState(next);
  };

  return {
    state,
    setCurrentUser,
    setActiveIndustry,
    checkIn,
    checkOut,
    submitComplaint,
    updateComplaintStatus,
    submitFeedback,
    acknowledgeFeedback,
    updatePassport,
    createShift,
    markNotificationRead,
    resetToDemo: resetState,
  };
}
