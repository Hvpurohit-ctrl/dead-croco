import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateShiftHours,
  calculateSalaryBreakdown,
  evaluateFatigueAlerts,
  generateComplaintId,
  calculateSkillPassportMetrics,
} from './rules';
import { AttendanceRecord, SkillPassport, User } from '../types';

test('calculateShiftHours handles standard shift without overtime', () => {
  const checkIn = '2026-10-27T08:00:00Z';
  const checkOut = '2026-10-27T16:00:00Z'; // exactly 8 hours
  const result = calculateShiftHours(checkIn, checkOut, 8);

  assert.equal(result.totalHours, 8);
  assert.equal(result.regularHours, 8);
  assert.equal(result.overtimeHours, 0);
});

test('calculateShiftHours calculates overtime for shifts exceeding 8 hours', () => {
  const checkIn = '2026-10-27T08:00:00Z';
  const checkOut = '2026-10-27T18:30:00Z'; // 10.5 hours
  const result = calculateShiftHours(checkIn, checkOut, 8);

  assert.equal(result.totalHours, 10.5);
  assert.equal(result.regularHours, 8);
  assert.equal(result.overtimeHours, 2.5);
});

test('calculateShiftHours returns zero for invalid timestamps', () => {
  const result = calculateShiftHours('invalid', 'also-invalid');
  assert.equal(result.totalHours, 0);
  assert.equal(result.regularHours, 0);
  assert.equal(result.overtimeHours, 0);
});

test('calculateSalaryBreakdown computes accurate base pay, overtime, and deductions', () => {
  const breakdown = calculateSalaryBreakdown(40, 5, 200, 300, {
    tax: 450,
    socialSecurity: 270,
    healthInsurance: 120,
    unionDues: 50,
  });

  // Base: 40 * 200 = 8000
  assert.equal(breakdown.basePay, 8000);
  // Overtime: 5 * 300 = 1500
  assert.equal(breakdown.overtimePay, 1500);
  // Gross: 9500
  assert.equal(breakdown.grossPay, 9500);
  // Deductions: 450 + 270 + 120 + 50 = 890
  assert.equal(breakdown.totalDeductions, 890);
  // Net: 9500 - 890 = 8610
  assert.equal(breakdown.netPay, 8610);
  assert.ok(breakdown.explanationNotes.length >= 4);
});

test('evaluateFatigueAlerts catches single shift > 10 hours and rest < 11 hours', () => {
  const mockUser: User = {
    id: 'w-1',
    name: 'Raju Kumar',
    email: 'raju@deadcroco.work',
    role: 'worker',
    roleTitle: 'Scaffolding Lead',
    avatar: '',
    industry: 'construction',
    department: 'Structural',
    workplace: 'Metro Rail Site 4',
    hourlyRate: 250,
    overtimeRate: 375,
    joinedDate: '2025-01-10',
  };

  const attendance: AttendanceRecord[] = [
    {
      id: 'att-1',
      workerId: 'w-1',
      workerName: 'Raju Kumar',
      date: '2026-10-25',
      checkIn: '2026-10-25T07:00:00Z',
      checkOut: '2026-10-25T18:30:00Z', // 11.5 hours (>10)
      regularHours: 8,
      overtimeHours: 3.5,
      totalHours: 11.5,
      status: 'completed',
      workplace: 'Metro Rail Site 4',
      industry: 'construction',
    },
    {
      id: 'att-2',
      workerId: 'w-1',
      workerName: 'Raju Kumar',
      date: '2026-10-26',
      checkIn: '2026-10-26T01:00:00Z', // Rest between shifts is 6.5h (<11h!)
      checkOut: '2026-10-26T09:00:00Z',
      regularHours: 8,
      overtimeHours: 0,
      totalHours: 8,
      status: 'completed',
      workplace: 'Metro Rail Site 4',
      industry: 'construction',
    },
  ];

  const alerts = evaluateFatigueAlerts(mockUser, attendance);
  assert.ok(alerts.length >= 2, `Expected at least 2 alerts, got ${alerts.length}`);
  const hasExcessShift = alerts.some((a) => a.ruleViolated.includes('>10h'));
  const hasShortRest = alerts.some((a) => a.ruleViolated.includes('<11h'));

  assert.equal(hasExcessShift, true);
  assert.equal(hasShortRest, true);
});

test('generateComplaintId creates valid DC-SAF prefix format', () => {
  const id = generateComplaintId();
  assert.match(id, /^DC-SAF-\d{4}$/);
});

test('calculateSkillPassportMetrics aggregates metrics correctly', () => {
  const mockPassport: SkillPassport = {
    id: 'sp-1',
    workerId: 'w-1',
    workerName: 'Raju Kumar',
    industry: 'construction',
    headline: 'Certified Master Scaffolder',
    skills: [
      { name: 'Scaffold Rigging', level: 'Expert', verified: true, category: 'Technical' },
      { name: 'Fall Protection', level: 'Advanced', verified: true, category: 'Safety' },
      { name: 'Blueprints', level: 'Intermediate', verified: false, category: 'Technical' },
    ],
    certifications: [
      {
        id: 'c-1',
        title: 'OSHA 30 Construction',
        issuer: 'OSHA Academy',
        dateObtained: '2025-03-01',
        expiryDate: '2028-03-01',
        certificateNumber: 'OSH-9921',
        verified: true,
      },
    ],
    trainingsCompleted: [
      { title: 'Working at Heights', date: '2026-02-14', hours: 16 },
    ],
    workHistory: [
      { company: 'BuildCorp', role: 'Rigging Lead', period: '2024-2026', verifiedHours: 640, endorsements: 12 },
    ],
    safetyRating: 98,
    overallScore: 0,
  };

  const metrics = calculateSkillPassportMetrics(mockPassport);
  assert.equal(metrics.verifiedSkillsCount, 2);
  assert.equal(metrics.totalSkillsCount, 3);
  assert.equal(metrics.certificationsActive, 1);
  assert.ok(metrics.overallScore > 50);
});
