import React, { useState, useEffect } from 'react';
import {
  AttendanceRecord,
  HazardCategory,
  HazardSeverity,
  Language,
  Payslip,
  SafetyComplaint,
  SkillPassport,
  User,
} from '../../types';
import { translations, speakText } from '../../utils/i18n';
import {
  calculateSalaryBreakdown,
  calculateShiftHours,
} from '../../utils/rules';
import { PrintableModal } from '../common/PrintableModal';
import {
  Clock,
  DollarSign,
  AlertTriangle,
  MessageSquareOff,
  Award,
  Bell,
  CheckCircle2,
  Calendar,
  MapPin,
  Camera,
  Upload,
  Printer,
  ChevronRight,
  ShieldCheck,
  FileText,
  Volume2,
  ExternalLink,
  Plus,
  RefreshCw,
  Info,
  Send,
  Sparkles,
} from 'lucide-react';

interface WorkerDashboardProps {
  currentUser: User;
  attendance: AttendanceRecord[];
  payslips: Payslip[];
  complaints: SafetyComplaint[];
  skillPassport?: SkillPassport;
  notifications: any[];
  onCheckIn: (workerId: string) => { success: boolean; message: string; record?: AttendanceRecord };
  onCheckOut: (workerId: string) => { success: boolean; message: string; record?: AttendanceRecord };
  onSubmitComplaint: (data: any) => SafetyComplaint;
  onSubmitFeedback: (cat: any, ind: any, dept: any, msg: string, sev: any) => any;
  onUpdatePassport: (workerId: string, passport: SkillPassport) => void;
  language: Language;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({
  currentUser,
  attendance,
  payslips,
  complaints,
  skillPassport,
  notifications,
  onCheckIn,
  onCheckOut,
  onSubmitComplaint,
  onSubmitFeedback,
  onUpdatePassport,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<
    'shift' | 'payslip' | 'safety' | 'feedback' | 'passport' | 'notifications'
  >('shift');

  const [notificationBanner, setNotificationBanner] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Modal print states
  const [selectedPayslipForPrint, setSelectedPayslipForPrint] = useState<Payslip | null>(null);
  const [isPrintPassportOpen, setIsPrintPassportOpen] = useState(false);

  // Live timer for active shift
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Safety complaint form state
  const [safetyTitle, setSafetyTitle] = useState('');
  const [safetyDesc, setSafetyDesc] = useState('');
  const [safetyCat, setSafetyCat] = useState<HazardCategory>('fall_hazard');
  const [safetySev, setSafetySev] = useState<HazardSeverity>('high');
  const [safetyLoc, setSafetyLoc] = useState('');
  const [safetyPhotoUrl, setSafetyPhotoUrl] = useState('');
  const [safetyIsAnonymous, setSafetyIsAnonymous] = useState(false);

  // Feedback form state
  const [fbCategory, setFbCategory] = useState<'management' | 'workload' | 'facilities' | 'working_conditions'>(
    'facilities'
  );
  const [fbMessage, setFbMessage] = useState('');
  const [fbSeverity, setFbSeverity] = useState<'neutral' | 'concern' | 'urgent'>('concern');

  // Skill passport addition modal state
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Technical');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Advanced');

  const t = translations[language];

  // Filter records for this worker
  const myAttendance = attendance.filter((a) => a.workerId === currentUser.id);
  const activeShift = myAttendance.find((a) => a.status === 'checked_in');
  const myComplaints = complaints.filter((c) => c.workerId === currentUser.id || c.isAnonymous);
  const myPayslips = payslips.filter((p) => p.workerId === currentUser.id);
  const [activePayslipId, setActivePayslipId] = useState<string>(
    myPayslips[0]?.id || 'DC-PAY-2026-W42'
  );

  const currentPayslip = myPayslips.find((p) => p.id === activePayslipId) || myPayslips[0];

  // Active shift timer effect
  useEffect(() => {
    let interval: any = null;
    if (activeShift) {
      const startMs = new Date(activeShift.checkIn).getTime();
      const updateElapsed = () => {
        const diffSec = Math.floor((Date.now() - startMs) / 1000);
        setElapsedSeconds(diffSec > 0 ? diffSec : 0);
      };
      updateElapsed();
      interval = setInterval(updateElapsed, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [activeShift]);

  const formatElapsedTime = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const handleCheckInClick = () => {
    const res = onCheckIn(currentUser.id);
    if (res.success) {
      setNotificationBanner({ type: 'success', message: res.message });
      speakText('Shift started successfully. Please remember to work safely and follow PPE protocols.', language);
    } else {
      setNotificationBanner({ type: 'error', message: res.message });
    }
    setTimeout(() => setNotificationBanner(null), 5000);
  };

  const handleCheckOutClick = () => {
    const res = onCheckOut(currentUser.id);
    if (res.success) {
      setNotificationBanner({ type: 'success', message: res.message });
      speakText('Shift completed and hours logged. Have a restful recovery.', language);
    } else {
      setNotificationBanner({ type: 'error', message: res.message });
    }
    setTimeout(() => setNotificationBanner(null), 5000);
  };

  const handleSafetySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!safetyTitle.trim() || !safetyDesc.trim()) {
      setNotificationBanner({ type: 'error', message: 'Please provide both title and description of the hazard.' });
      return;
    }

    const created = onSubmitComplaint({
      workerId: currentUser.id,
      workerName: safetyIsAnonymous ? 'Anonymous Frontline Worker' : currentUser.name,
      isAnonymous: safetyIsAnonymous,
      title: safetyTitle.trim(),
      description: safetyDesc.trim(),
      category: safetyCat,
      severity: safetySev,
      location: safetyLoc.trim() || currentUser.workplace,
      workplace: currentUser.workplace,
      industry: currentUser.industry,
      photoUrl: safetyPhotoUrl || undefined,
    });

    setSafetyTitle('');
    setSafetyDesc('');
    setSafetyLoc('');
    setSafetyPhotoUrl('');
    setNotificationBanner({
      type: 'success',
      message: `Safety Report ${created.id} submitted! Site safety supervisors have been notified immediately.`,
    });
    speakText(`Safety report ${created.id} submitted successfully.`, language);
    setTimeout(() => setNotificationBanner(null), 6000);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbMessage.trim()) return;

    onSubmitFeedback(
      fbCategory,
      currentUser.industry,
      currentUser.department,
      fbMessage.trim(),
      fbSeverity
    );

    setFbMessage('');
    setNotificationBanner({
      type: 'success',
      message: 'Anonymous feedback recorded! Your identity is cryptographically separated and hidden from managers.',
    });
    speakText('Anonymous feedback submitted without your name.', language);
    setTimeout(() => setNotificationBanner(null), 5000);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim() || !skillPassport) return;

    const updatedPassport: SkillPassport = {
      ...skillPassport,
      skills: [
        ...skillPassport.skills,
        {
          name: newSkillName.trim(),
          category: newSkillCategory,
          level: newSkillLevel,
          verified: false,
        },
      ],
    };

    onUpdatePassport(currentUser.id, updatedPassport);
    setNewSkillName('');
    setShowAddSkillModal(false);
    setNotificationBanner({
      type: 'success',
      message: 'New skill submitted to your passport! Queued for supervisor peer endorsement.',
    });
    setTimeout(() => setNotificationBanner(null), 4000);
  };

  // Helper sample photos for quick realistic demo testing
  const sampleHazardPhotos = [
    {
      title: 'Scaffold Clamp Gap',
      url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Chemical Fume Spill',
      url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Exposed Cable Hazard',
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7faf8] pb-16">
      {/* Worker Portal Header Banner */}
      <div className="bg-[#1b4332] text-white border-b border-[#2d6a4f] py-6 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#0f291e] border-2 border-[#52b788] flex items-center justify-center text-white text-xl font-black shadow-inner overflow-hidden shrink-0">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                currentUser.name[0]
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">{currentUser.name}</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#52b788] text-[#0f291e] uppercase">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#95d5b2] font-medium">{currentUser.roleTitle}</p>
              <p className="text-[11px] text-gray-300 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-[#52b788]" />
                <span className="truncate max-w-sm">{currentUser.workplace}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Base Wage Badge */}
            <div className="bg-white/10 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/15 text-right">
              <span className="text-[10px] text-[#95d5b2] font-mono uppercase block">
                Agreed Wage Standard
              </span>
              <span className="text-base font-extrabold text-white">
                ₹{currentUser.hourlyRate}/hr &bull; ₹{currentUser.overtimeRate}/OT
              </span>
            </div>

            {/* Read aloud helper */}
            <button
              onClick={() =>
                speakText(
                  `Worker portal for ${currentUser.name}. Role: ${currentUser.roleTitle}. Currently ${
                    activeShift ? 'active on shift' : 'not clocked in'
                  }.`,
                  language
                )
              }
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Voice summary"
              aria-label="Voice summary of worker status"
            >
              <Volume2 className="w-5 h-5 text-[#52b788]" />
            </button>
          </div>
        </div>
      </div>

      {/* In-app Notification Feedback Banner */}
      {notificationBanner && (
        <div
          className={`max-w-7xl mx-auto px-4 mt-4 transition-all duration-300 ${
            notificationBanner.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
              : notificationBanner.type === 'error'
              ? 'bg-red-50 text-red-900 border border-red-300'
              : 'bg-blue-50 text-blue-900 border border-blue-300'
          } p-3.5 rounded-2xl flex items-center justify-between shadow-xs`}
        >
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
            {notificationBanner.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{notificationBanner.message}</span>
          </div>
          <button
            onClick={() => setNotificationBanner(null)}
            className="text-xs font-bold underline cursor-pointer ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Mobile-Friendly Navigation Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 border-b border-[#d8f3dc] mb-6 no-scrollbar">
          <button
            onClick={() => setActiveTab('shift')}
            className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'shift'
                ? 'bg-[#1b4332] text-white shadow-xs'
                : 'bg-white text-[#2d4a3e] border border-gray-200 hover:bg-[#eefaf1]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Smart Shift Tracking</span>
            {activeShift && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('payslip')}
            className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'payslip'
                ? 'bg-[#1b4332] text-white shadow-xs'
                : 'bg-white text-[#2d4a3e] border border-gray-200 hover:bg-[#eefaf1]'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Transparent Payslips</span>
          </button>

          <button
            onClick={() => setActiveTab('safety')}
            className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'safety'
                ? 'bg-[#1b4332] text-white shadow-xs'
                : 'bg-white text-[#2d4a3e] border border-gray-200 hover:bg-[#eefaf1]'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Safety Reporting</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-100 text-red-800 font-mono">
              {myComplaints.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'feedback'
                ? 'bg-[#1b4332] text-white shadow-xs'
                : 'bg-white text-[#2d4a3e] border border-gray-200 hover:bg-[#eefaf1]'
            }`}
          >
            <MessageSquareOff className="w-4 h-4" />
            <span>Anonymous Feedback</span>
          </button>

          <button
            onClick={() => setActiveTab('passport')}
            className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'passport'
                ? 'bg-[#1b4332] text-white shadow-xs'
                : 'bg-white text-[#2d4a3e] border border-gray-200 hover:bg-[#eefaf1]'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Skill Passport</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'notifications'
                ? 'bg-[#1b4332] text-white shadow-xs'
                : 'bg-white text-[#2d4a3e] border border-gray-200 hover:bg-[#eefaf1]'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Alerts</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#d8f3dc] text-[#1b4332] font-mono">
              {notifications.filter((n) => n.userId === currentUser.id && !n.read).length}
            </span>
          </button>
        </div>

        {/* TAB 1: SMART SHIFT TRACKING */}
        {activeTab === 'shift' && (
          <div className="space-y-6">
            {/* Live Clock Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#74c69d]/40 shadow-sm relative overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d8f3dc] text-[#1b4332] text-xs font-bold font-mono uppercase">
                    {activeShift ? 'Shift In Progress' : 'No Active Shift'}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#0f291e]">
                    {activeShift ? 'Currently Working On Site' : 'Ready to Start Your Shift'}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Tap the button below when arriving or departing. System automatically tallies regular 8-hour
                    schedules and adds 1.5× overtime multiplier for extended hours.
                  </p>

                  <div className="flex items-center gap-2 text-xs text-[#2d6a4f] font-semibold pt-1">
                    <MapPin className="w-4 h-4 text-[#52b788]" />
                    <span>Location Verified: {currentUser.workplace}</span>
                  </div>
                </div>

                {/* Clock / Timer Action Panel */}
                <div className="md:col-span-5 bg-[#f4faf6] rounded-2xl p-6 border border-[#74c69d]/40 text-center space-y-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-gray-500 block">
                      Shift Duration Timer
                    </span>
                    <div className="text-4xl sm:text-5xl font-mono font-black text-[#0f291e] tracking-tight my-1">
                      {formatElapsedTime(elapsedSeconds)}
                    </div>
                    {activeShift && (
                      <p className="text-[11px] text-gray-500">
                        Check-in timestamp:{' '}
                        <span className="font-mono font-bold text-[#1b4332]">
                          {new Date(activeShift.checkIn).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Primary Touch Buttons */}
                  {!activeShift ? (
                    <button
                      onClick={handleCheckInClick}
                      className="w-full py-4 rounded-2xl text-base font-extrabold bg-[#1b4332] text-white hover:bg-[#0f291e] shadow-lg shadow-[#1b4332]/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-98"
                    >
                      <Clock className="w-5 h-5 text-[#74c69d]" />
                      <span>{t.btnCheckIn}</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleCheckOutClick}
                      className="w-full py-4 rounded-2xl text-base font-extrabold bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-98"
                    >
                      <Clock className="w-5 h-5" />
                      <span>{t.btnCheckOut}</span>
                    </button>
                  )}

                  <p className="text-[10px] text-gray-500 font-mono">
                    Protected Against Duplicate Punch-in & Attendance Fraud
                  </p>
                </div>
              </div>
            </div>

            {/* Attendance History Table */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2 mb-4">
                <div>
                  <h3 className="font-extrabold text-lg text-[#0f291e]">Attendance & Working-Hour Records</h3>
                  <p className="text-xs text-gray-500">
                    Transparent log of your daily shifts, verified overtime, and workplace tags.
                  </p>
                </div>
                <div className="text-xs font-mono font-bold text-[#1b4332] bg-[#d8f3dc] px-3 py-1.5 rounded-lg border border-[#74c69d]/40">
                  Total Logged Records: {myAttendance.length}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8faf9] text-gray-500 uppercase text-[10px] tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Check-In</th>
                      <th className="py-3 px-4">Check-Out</th>
                      <th className="py-3 px-4 text-center">Regular</th>
                      <th className="py-3 px-4 text-center">Overtime</th>
                      <th className="py-3 px-4 text-center">Total Hours</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {myAttendance.map((rec) => (
                      <tr key={rec.id} className="hover:bg-[#f8faf9] transition-colors">
                        <td className="py-3.5 px-4 font-bold text-gray-900">{rec.date}</td>
                        <td className="py-3.5 px-4 text-gray-700 font-mono">
                          {new Date(rec.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3.5 px-4 text-gray-700 font-mono">
                          {rec.checkOut
                            ? new Date(rec.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : 'Active'}
                        </td>
                        <td className="py-3.5 px-4 text-center font-semibold text-gray-800">
                          {rec.regularHours.toFixed(1)} hrs
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-emerald-700">
                          {rec.overtimeHours > 0 ? `+${rec.overtimeHours.toFixed(1)} hrs` : '0.0 hrs'}
                        </td>
                        <td className="py-3.5 px-4 text-center font-extrabold text-[#0f291e]">
                          {rec.totalHours.toFixed(1)} hrs
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              rec.status === 'checked_in'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {rec.status === 'checked_in' ? 'Active Shift' : 'Completed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRANSPARENT PAYSLIPS */}
        {activeTab === 'payslip' && (
          <div className="space-y-6">
            {/* Pay Period Selector & Action Header */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2d6a4f]">
                  Non-Exploitative Payroll
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#0f291e]">Salary Breakdown & Payslip Archive</h2>
                <p className="text-xs text-gray-500">
                  Every deduction and overtime bonus is clearly explained with no arbitrary withholding.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={activePayslipId}
                  onChange={(e) => setActivePayslipId(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-800 bg-[#f8faf9] focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
                  aria-label="Select pay period"
                >
                  {myPayslips.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.payPeriod} ({p.id})
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setSelectedPayslipForPrint(currentPayslip)}
                  className="px-4 py-2 rounded-xl bg-[#1b4332] text-white hover:bg-[#0f291e] font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#74c69d]" />
                  <span>Print / PDF</span>
                </button>
              </div>
            </div>

            {currentPayslip ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Visual Earnings Card */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#74c69d]/40 shadow-sm space-y-6">
                  <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                    <div>
                      <div className="text-xs text-gray-400 font-mono uppercase">{currentPayslip.id}</div>
                      <h3 className="text-xl font-extrabold text-[#0f291e]">{currentPayslip.payPeriod}</h3>
                      <p className="text-xs text-gray-500">Disbursed on {currentPayslip.paymentDate}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Disbursed & Verified
                    </span>
                  </div>

                  {/* Top Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-[#f8faf9] border border-gray-100">
                      <span className="text-[10px] text-gray-500 uppercase font-mono block">Regular Hours</span>
                      <span className="text-xl font-black text-gray-900">
                        {currentPayslip.regularHours.toFixed(1)} h
                      </span>
                      <p className="text-[10px] text-gray-400">@ ₹{currentPayslip.hourlyRate}/h</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#f8faf9] border border-gray-100">
                      <span className="text-[10px] text-emerald-700 uppercase font-mono block">Overtime Hours</span>
                      <span className="text-xl font-black text-emerald-700">
                        {currentPayslip.overtimeHours.toFixed(1)} h
                      </span>
                      <p className="text-[10px] text-emerald-600">@ ₹{currentPayslip.overtimeRate}/h (1.5×)</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#f0f9f3] border border-[#74c69d]/40">
                      <span className="text-[10px] text-[#1b4332] uppercase font-mono block">Net Take-Home</span>
                      <span className="text-xl font-black text-[#1b4332]">
                        ₹{currentPayslip.netPay.toLocaleString()}
                      </span>
                      <p className="text-[10px] text-[#2d6a4f] font-semibold">In Bank Account</p>
                    </div>
                  </div>

                  {/* Math Breakdown Table */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-semibold text-gray-700">Base Wage ({currentPayslip.regularHours}h × ₹{currentPayslip.hourlyRate})</span>
                      <span className="font-bold text-gray-900">₹{currentPayslip.basePay.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-semibold text-emerald-700">
                        Overtime Premium ({currentPayslip.overtimeHours}h × ₹{currentPayslip.overtimeRate})
                      </span>
                      <span className="font-bold text-emerald-700">+ ₹{currentPayslip.overtimePay.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200 font-bold text-gray-900 bg-gray-50 px-2 rounded-lg">
                      <span>Gross Pre-Deduction Earnings</span>
                      <span>₹{currentPayslip.grossPay.toLocaleString()}</span>
                    </div>

                    {/* Deductions Itemized */}
                    <div className="pt-2 pl-3 space-y-1.5 text-gray-600">
                      <div className="flex justify-between">
                        <span>- Income Tax (5% statutory)</span>
                        <span className="text-red-600">- ₹{currentPayslip.deductions.tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>- Social Security / Provident Reserve</span>
                        <span className="text-red-600">- ₹{currentPayslip.deductions.socialSecurity.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>- Health & Accident Site Insurance</span>
                        <span className="text-red-600">- ₹{currentPayslip.deductions.healthInsurance.toLocaleString()}</span>
                      </div>
                      {currentPayslip.deductions.unionDues && (
                        <div className="flex justify-between">
                          <span>- Worker Welfare & Union Contribution</span>
                          <span className="text-red-600">- ₹{currentPayslip.deductions.unionDues.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between py-3 border-t-2 border-[#1b4332] text-sm font-extrabold text-[#0f291e] px-2 bg-[#d8f3dc]/40 rounded-xl mt-3">
                      <span>Final Net Disbursed Remittance</span>
                      <span className="text-base text-[#1b4332]">₹{currentPayslip.netPay.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Mathematical Explanation Card */}
                <div className="lg:col-span-5 bg-gradient-to-br from-[#1b4332] to-[#0f291e] text-white rounded-3xl p-6 sm:p-8 space-y-5">
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-[#74c69d]" />
                    <h4 className="font-extrabold text-base">Transparent Formula Walkthrough</h4>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Under dead.croco wage transparency standards, every frontline worker has the right to understand
                    the math behind their compensation without having to ask a foreman.
                  </p>

                  <div className="space-y-3">
                    {currentPayslip.explanationNotes.map((note, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white/10 backdrop-blur-xs text-xs space-y-1">
                        <div className="text-[10px] text-[#95d5b2] font-mono uppercase font-bold">
                          Step 0{idx + 1}
                        </div>
                        <div className="text-white font-medium">{note}</div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() =>
                        speakText(
                          `Payslip breakdown for ${currentPayslip.payPeriod}. Base pay is rupees ${currentPayslip.basePay}. Overtime pay is rupees ${currentPayslip.overtimePay}. Total deductions are rupees ${currentPayslip.totalDeductions}. Final net pay is rupees ${currentPayslip.netPay}.`,
                          language
                        )
                      }
                      className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4 text-[#74c69d]" />
                      <span>Listen to Audio Explanation</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 text-center rounded-3xl border border-gray-200 text-gray-500">
                No payslips found for current worker.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SAFETY REPORTING */}
        {activeTab === 'safety' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form to submit hazard */}
              <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#74c69d]/40 shadow-sm space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold font-mono uppercase">
                    Zero Retaliation Guarantee
                  </div>
                  <h2 className="text-2xl font-black text-[#0f291e] mt-2">Report a Workplace Hazard</h2>
                  <p className="text-xs text-gray-600">
                    Your report is instantly dispatched to site safety officers and tagged with a permanent audit ID.
                  </p>
                </div>

                <form onSubmit={handleSafetySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Hazard Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Loose Scaffolding Clamp on Pier 112"
                      value={safetyTitle}
                      onChange={(e) => setSafetyTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={safetyCat}
                        onChange={(e) => setSafetyCat(e.target.value as HazardCategory)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
                      >
                        <option value="fall_hazard">Fall Hazard & Scaffolding</option>
                        <option value="equipment">Faulty Equipment / Hoists</option>
                        <option value="chemical">Chemical & Fume Leak</option>
                        <option value="electrical">Electrical Shock Risk</option>
                        <option value="ergonomic">Ergonomic & Heavy Load</option>
                        <option value="sanitation">Sanitation & Hydration</option>
                        <option value="fire_safety">Fire Risk & Extinguishers</option>
                        <option value="other">Other Workplace Risk</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Severity
                      </label>
                      <select
                        value={safetySev}
                        onChange={(e) => setSafetySev(e.target.value as HazardSeverity)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
                      >
                        <option value="low">Low (Minor annoyance)</option>
                        <option value="medium">Medium (Requires attention)</option>
                        <option value="high">High (Injury probability)</option>
                        <option value="critical">Critical (Imminent Danger)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Exact Location on Site *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Pier 112 East Ledger, Elevation 14m"
                      value={safetyLoc}
                      onChange={(e) => setSafetyLoc(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Detailed Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe the defect, condition, and any workers at immediate risk..."
                      value={safetyDesc}
                      onChange={(e) => setSafetyDesc(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
                    />
                  </div>

                  {/* Photo Attachment Picker */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center justify-between">
                      <span>Attach Photo (Optional)</span>
                      <span className="text-[10px] text-gray-400 font-normal">Select demo hazard or URL</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {sampleHazardPhotos.map((photo, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSafetyPhotoUrl(photo.url)}
                          className={`p-1.5 rounded-xl border text-left transition-all ${
                            safetyPhotoUrl === photo.url
                              ? 'border-[#2d6a4f] bg-[#d8f3dc] ring-2 ring-[#52b788]'
                              : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                          }`}
                        >
                          <img
                            src={photo.url}
                            alt={photo.title}
                            className="w-full h-12 object-cover rounded-lg mb-1"
                          />
                          <p className="text-[10px] font-bold text-gray-700 truncate">{photo.title}</p>
                        </button>
                      ))}
                    </div>

                    <input
                      type="url"
                      placeholder="Or paste direct image URL (https://...)"
                      value={safetyPhotoUrl}
                      onChange={(e) => setSafetyPhotoUrl(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
                    />
                  </div>

                  {/* Anonymous Checkbox */}
                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={safetyIsAnonymous}
                      onChange={(e) => setSafetyIsAnonymous(e.target.checked)}
                      className="w-4 h-4 rounded text-[#1b4332] focus:ring-[#2d6a4f]"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-gray-900 block">Submit Anonymously</span>
                      <span className="text-gray-500 text-[11px]">
                        Hide my name and employee ID on supervisor screens.
                      </span>
                    </div>
                  </label>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#1b4332] text-white hover:bg-[#0f291e] font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                  >
                    <Send className="w-4 h-4 text-[#74c69d]" />
                    <span>Submit Safety Complaint</span>
                  </button>
                </form>
              </div>

              {/* Status Tracking Queue */}
              <div className="lg:col-span-6 space-y-4">
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                    <div>
                      <h3 className="font-extrabold text-lg text-[#0f291e]">My Active Safety Reports</h3>
                      <p className="text-xs text-gray-500">
                        Track progress from Submission to Supervisor Resolution.
                      </p>
                    </div>
                    <span className="text-xs font-bold font-mono bg-[#d8f3dc] text-[#1b4332] px-2.5 py-1 rounded-lg">
                      {myComplaints.length} Filed
                    </span>
                  </div>

                  <div className="space-y-4 max-h-[620px] overflow-y-auto pr-1">
                    {myComplaints.map((c) => {
                      const statusSteps: Array<'submitted' | 'under_review' | 'in_progress' | 'resolved'> = [
                        'submitted',
                        'under_review',
                        'in_progress',
                        'resolved',
                      ];
                      const currentIdx = statusSteps.indexOf(c.status);

                      return (
                        <div
                          key={c.id}
                          className="p-5 rounded-2xl border border-gray-200/90 bg-[#fbfdfc] space-y-3 hover:border-[#74c69d] transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-[#1b4332] bg-[#d8f3dc] px-2 py-0.5 rounded">
                                  {c.id}
                                </span>
                                <span
                                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                    c.severity === 'critical'
                                      ? 'bg-rose-100 text-rose-800'
                                      : c.severity === 'high'
                                      ? 'bg-orange-100 text-orange-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {c.severity} Severity
                                </span>
                              </div>
                              <h4 className="font-bold text-sm text-[#0f291e] mt-1.5">{c.title}</h4>
                            </div>

                            <span className="text-[10px] text-gray-400 font-mono">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <p className="text-xs text-gray-600 leading-relaxed">{c.description}</p>

                          <div className="text-[11px] text-gray-500 flex items-center gap-1 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            <span>{c.location}</span>
                          </div>

                          {c.photoUrl && (
                            <div className="rounded-xl overflow-hidden border border-gray-200 max-h-40">
                              <img
                                src={c.photoUrl}
                                alt="Hazard photo"
                                className="w-full h-32 object-cover"
                              />
                            </div>
                          )}

                          {/* Progress Stepper */}
                          <div className="pt-2">
                            <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-bold mb-1">
                              <span className={currentIdx >= 0 ? 'text-[#1b4332]' : 'text-gray-300'}>
                                Submitted
                              </span>
                              <span className={currentIdx >= 1 ? 'text-[#1b4332]' : 'text-gray-300'}>
                                Review
                              </span>
                              <span className={currentIdx >= 2 ? 'text-[#1b4332]' : 'text-gray-300'}>
                                Fixing
                              </span>
                              <span className={currentIdx >= 3 ? 'text-emerald-700' : 'text-gray-300'}>
                                Resolved
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden flex">
                              <div
                                className={`h-full transition-all duration-500 ${
                                  currentIdx === 3 ? 'bg-emerald-600' : 'bg-[#2d6a4f]'
                                }`}
                                style={{ width: `${((currentIdx + 1) / 4) * 100}%` }}
                              />
                            </div>
                          </div>

                          {/* Resolution Notes if available */}
                          {c.resolutionNotes && (
                            <div className="p-3 rounded-xl bg-[#eefaf1] border border-[#74c69d]/50 text-xs">
                              <span className="font-bold text-[#1b4332] block text-[11px]">
                                Supervisor Action Notes:
                              </span>
                              <p className="text-gray-700 mt-0.5">{c.resolutionNotes}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ANONYMOUS FEEDBACK */}
        {activeTab === 'feedback' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Cryptographically Anonymized
                </div>
                <h2 className="text-2xl font-black text-[#0f291e] mt-2">Voice Without Retaliation</h2>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-1">
                  Submit confidential feedback regarding management, toxic conditions, broken facilities, or
                  unrealistic overtime quotas. Your name, email, and ID are completely excluded from the record.
                </p>
              </div>

              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Concern Topic
                    </label>
                    <select
                      value={fbCategory}
                      onChange={(e) => setFbCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
                    >
                      <option value="facilities">Facilities (Water, Restrooms, PPE)</option>
                      <option value="workload">Workload & Overtime Pressure</option>
                      <option value="management">Foreman & Supervisory Conduct</option>
                      <option value="working_conditions">General Working Conditions</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Urgency Level
                    </label>
                    <select
                      value={fbSeverity}
                      onChange={(e) => setFbSeverity(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
                    >
                      <option value="neutral">Neutral Suggestion</option>
                      <option value="concern">Notable Concern</option>
                      <option value="urgent">Urgent Intervention Needed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Your Anonymous Feedback *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Speak freely. Do not include personal names if you wish to remain entirely anonymous..."
                    value={fbMessage}
                    onChange={(e) => setFbMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#1b4332] text-white hover:bg-[#0f291e] font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <MessageSquareOff className="w-4 h-4 text-[#74c69d]" />
                  <span>Send Completely Anonymous Feedback</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: DIGITAL SKILL PASSPORT */}
        {activeTab === 'passport' && skillPassport && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#74c69d]/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2d6a4f]">
                  Portable Career Identity
                </span>
                <h2 className="text-2xl font-black text-[#0f291e]">Digital Skill Passport</h2>
                <p className="text-xs text-gray-500">
                  Your verified hours, licenses, and safety endorsements that travel with you across employers.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowAddSkillModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-[#2d6a4f] text-[#1b4332] hover:bg-[#eefaf1] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Skill</span>
                </button>

                <button
                  onClick={() => setIsPrintPassportOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#1b4332] text-white hover:bg-[#0f291e] font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#74c69d]" />
                  <span>Print Passport</span>
                </button>
              </div>
            </div>

            {/* Passport Metrics Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-gray-200">
                <span className="text-[10px] text-gray-400 uppercase font-mono block">Competency Rating</span>
                <span className="text-2xl font-black text-[#1b4332]">{skillPassport.overallScore}/100</span>
                <p className="text-[10px] text-[#2d6a4f] font-semibold">Tier: Master Specialist</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-gray-200">
                <span className="text-[10px] text-gray-400 uppercase font-mono block">Safety Track Record</span>
                <span className="text-2xl font-black text-emerald-700">{skillPassport.safetyRating}%</span>
                <p className="text-[10px] text-gray-500">Zero Incident Violations</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-gray-200">
                <span className="text-[10px] text-gray-400 uppercase font-mono block">Active Certifications</span>
                <span className="text-2xl font-black text-gray-900">{skillPassport.certifications.length}</span>
                <p className="text-[10px] text-gray-500">Accredited by OSHA / Boards</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-gray-200">
                <span className="text-[10px] text-gray-400 uppercase font-mono block">Field Hours Logged</span>
                <span className="text-2xl font-black text-gray-900">
                  {skillPassport.workHistory.reduce((s, w) => s + w.verifiedHours, 0).toLocaleString()} h
                </span>
                <p className="text-[10px] text-gray-500">Verified by Supervisors</p>
              </div>
            </div>

            {/* Skills & Certifications Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Skills */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
                <h3 className="font-extrabold text-base text-[#0f291e] flex items-center justify-between">
                  <span>Verified Competencies & Badges</span>
                  <span className="text-xs text-gray-400 font-mono font-normal">
                    {skillPassport.skills.length} skills listed
                  </span>
                </h3>

                <div className="space-y-2.5">
                  {skillPassport.skills.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-gray-100 bg-[#f8faf9] flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-gray-900">{s.name}</p>
                        <p className="text-[10px] text-gray-500">{s.category}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#d8f3dc] text-[#1b4332]">
                          {s.level}
                        </span>
                        {s.verified ? (
                          <span
                            className="text-emerald-700 flex items-center gap-0.5 text-[10px] font-bold"
                            title="Supervisor Verified"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400">Pending</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
                <h3 className="font-extrabold text-base text-[#0f291e] flex items-center justify-between">
                  <span>Accredited Certifications</span>
                  <span className="text-xs text-gray-400 font-mono font-normal">
                    {skillPassport.certifications.length} active
                  </span>
                </h3>

                <div className="space-y-3">
                  {skillPassport.certifications.map((c) => (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-xl border border-[#74c69d]/40 bg-[#fbfdfc] space-y-1.5"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-extrabold text-[#0f291e]">{c.title}</h4>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Valid
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600">
                        {c.issuer} &bull; Reg No: <span className="font-mono">{c.certificateNumber}</span>
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono">
                        Valid until: {c.expiryDate} (Obtained: {c.dateObtained})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs">
              <h2 className="text-xl font-black text-[#0f291e] mb-1">Workplace Alerts & Reminders</h2>
              <p className="text-xs text-gray-500 mb-4">
                Shift status updates, safety complaint responses, and site hazard warnings.
              </p>

              <div className="space-y-3">
                {notifications
                  .filter((n) => n.userId === currentUser.id)
                  .map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        notif.read
                          ? 'border-gray-100 bg-white text-gray-700'
                          : 'border-[#74c69d] bg-[#f0f9f3] text-gray-900 font-medium'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Bell
                            className={`w-4 h-4 ${notif.read ? 'text-gray-400' : 'text-[#2d6a4f]'}`}
                          />
                          <h4 className="font-bold text-xs">{notif.title}</h4>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {new Date(notif.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 pl-6">{notif.message}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Skill Modal */}
      {showAddSkillModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-200 p-6 space-y-4">
            <h3 className="font-black text-lg text-[#0f291e]">Add New Skill or Endorsement</h3>
            <form onSubmit={handleAddSkill} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scaffolding Rigging, Chemical Spill Handling"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#2d6a4f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                >
                  <option value="Technical">Technical Craft</option>
                  <option value="Safety">Safety & Emergency</option>
                  <option value="Equipment">Heavy Equipment</option>
                  <option value="Health">Health & Bio-Hazard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Proficiency Level
                </label>
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert / Foreman</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddSkillModal(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1b4332] text-white hover:bg-[#0f291e]"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Payslip Modal */}
      {selectedPayslipForPrint && (
        <PrintableModal
          type="payslip"
          payslip={selectedPayslipForPrint}
          onClose={() => setSelectedPayslipForPrint(null)}
        />
      )}

      {/* Printable Passport Modal */}
      {isPrintPassportOpen && skillPassport && (
        <PrintableModal
          type="passport"
          passport={skillPassport}
          onClose={() => setIsPrintPassportOpen(false)}
        />
      )}
    </div>
  );
};
