import React, { useState } from 'react';
import {
  AnonymousFeedback,
  AttendanceRecord,
  ComplaintStatus,
  FatigueAlert,
  IndustryType,
  SafetyComplaint,
  ShiftPlan,
  User,
} from '../../types';
import { evaluateFatigueAlerts } from '../../utils/rules';
import {
  Users,
  Clock,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Search,
  Filter,
  Plus,
  ArrowRight,
  ExternalLink,
  MessageSquareOff,
  BarChart3,
  Send,
  Eye,
  AlertCircle,
  HardHat,
  GraduationCap,
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User;
  allUsers: User[];
  attendance: AttendanceRecord[];
  complaints: SafetyComplaint[];
  feedback: AnonymousFeedback[];
  shifts: ShiftPlan[];
  onUpdateComplaintStatus: (
    id: string,
    status: ComplaintStatus,
    resolutionNotes?: string,
    assignedTo?: string
  ) => void;
  onAcknowledgeFeedback: (id: string, acknowledgment: string) => void;
  onCreateShift: (shift: Omit<ShiftPlan, 'id'>) => ShiftPlan;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  allUsers,
  attendance,
  complaints,
  feedback,
  shifts,
  onUpdateComplaintStatus,
  onAcknowledgeFeedback,
  onCreateShift,
}) => {
  const [activeModule, setActiveModule] = useState<
    'workers' | 'safety' | 'fatigue' | 'analytics' | 'feedback'
  >('workers');

  // Search & filter states
  const [workerSearch, setWorkerSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState<'all' | IndustryType>('all');
  const [safetyFilterSeverity, setSafetyFilterSeverity] = useState<string>('all');
  const [safetyFilterStatus, setSafetyFilterStatus] = useState<string>('all');

  // Safety complaint resolution dialog state
  const [selectedComplaint, setSelectedComplaint] = useState<SafetyComplaint | null>(null);
  const [resStatus, setResStatus] = useState<ComplaintStatus>('in_progress');
  const [resNotes, setResNotes] = useState('');

  // Anonymous feedback acknowledgment state
  const [ackFeedbackId, setAckFeedbackId] = useState<string | null>(null);
  const [ackText, setAckText] = useState('');

  // Shift assignment modal
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [shiftWorkerId, setShiftWorkerId] = useState(allUsers[0]?.id || '');
  const [shiftDate, setShiftDate] = useState('2026-10-28');
  const [shiftStart, setShiftStart] = useState('08:00');
  const [shiftEnd, setShiftEnd] = useState('16:30');
  const [shiftWorkplace, setShiftWorkplace] = useState(currentUser.workplace);

  // Compute Summary KPIs
  const workersList = allUsers.filter((u) => u.role === 'worker');
  const activeWorkersOnShift = attendance.filter((a) => a.status === 'checked_in');
  const totalOvertimeLogged = attendance.reduce((acc, a) => acc + (a.overtimeHours || 0), 0);
  const openComplaints = complaints.filter((c) => c.status !== 'resolved');
  const criticalComplaints = openComplaints.filter((c) => c.severity === 'critical');

  // Evaluate Fatigue alerts across all workers
  const fatigueAlerts: FatigueAlert[] = [];
  workersList.forEach((worker) => {
    const workerRecords = attendance.filter((a) => a.workerId === worker.id);
    const workerAlerts = evaluateFatigueAlerts(worker, workerRecords);
    fatigueAlerts.push(...workerAlerts);
  });

  // Filtered workers
  const filteredWorkers = workersList.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(workerSearch.toLowerCase()) ||
      w.department.toLowerCase().includes(workerSearch.toLowerCase()) ||
      w.roleTitle.toLowerCase().includes(workerSearch.toLowerCase());
    const matchesIndustry = industryFilter === 'all' || w.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  // Filtered complaints
  const filteredComplaints = complaints.filter((c) => {
    const matchesSev = safetyFilterSeverity === 'all' || c.severity === safetyFilterSeverity;
    const matchesStatus = safetyFilterStatus === 'all' || c.status === safetyFilterStatus;
    const matchesInd = industryFilter === 'all' || c.industry === industryFilter;
    return matchesSev && matchesStatus && matchesInd;
  });

  // Recharts data preparation from actual state
  // 1. Attendance & Overtime trends by day
  const attendanceTrendsMap: Record<string, { date: string; regularHours: number; overtimeHours: number }> = {};
  attendance.forEach((rec) => {
    if (!attendanceTrendsMap[rec.date]) {
      attendanceTrendsMap[rec.date] = { date: rec.date.slice(5), regularHours: 0, overtimeHours: 0 };
    }
    attendanceTrendsMap[rec.date].regularHours += rec.regularHours;
    attendanceTrendsMap[rec.date].overtimeHours += rec.overtimeHours;
  });
  const attendanceTrendsData = Object.values(attendanceTrendsMap).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  // 2. Complaints by Category
  const categoryCounts: Record<string, number> = {};
  complaints.forEach((c) => {
    const key = c.category.replace('_', ' ');
    categoryCounts[key] = (categoryCounts[key] || 0) + 1;
  });
  const complaintCategoryData = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    count,
  }));

  // 3. Complaint Status distribution
  const statusCounts = {
    submitted: complaints.filter((c) => c.status === 'submitted').length,
    under_review: complaints.filter((c) => c.status === 'under_review').length,
    in_progress: complaints.filter((c) => c.status === 'in_progress').length,
    resolved: complaints.filter((c) => c.status === 'resolved').length,
  };
  const statusPieData = [
    { name: 'Submitted', value: statusCounts.submitted, color: '#f59e0b' },
    { name: 'Under Review', value: statusCounts.under_review, color: '#3b82f6' },
    { name: 'In Progress', value: statusCounts.in_progress, color: '#8b5cf6' },
    { name: 'Resolved', value: statusCounts.resolved, color: '#10b981' },
  ];

  const handleUpdateStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    onUpdateComplaintStatus(selectedComplaint.id, resStatus, resNotes.trim(), currentUser.name);
    setSelectedComplaint(null);
    setResNotes('');
  };

  const handleCreateShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedWorker = allUsers.find((u) => u.id === shiftWorkerId);
    if (!assignedWorker) return;

    onCreateShift({
      workerId: assignedWorker.id,
      workerName: assignedWorker.name,
      roleTitle: assignedWorker.roleTitle,
      date: shiftDate,
      startTime: shiftStart,
      endTime: shiftEnd,
      workplace: shiftWorkplace || assignedWorker.workplace,
      department: assignedWorker.department,
      industry: assignedWorker.industry,
      status: 'scheduled',
    });

    setShowShiftModal(false);
  };

  const handleAcknowledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ackFeedbackId || !ackText.trim()) return;
    onAcknowledgeFeedback(ackFeedbackId, ackText.trim());
    setAckFeedbackId(null);
    setAckText('');
  };

  return (
    <div className="min-h-screen bg-[#f7faf8] pb-16">
      {/* Top Banner */}
      <div className="bg-[#0f291e] text-white border-b border-[#2d6a4f] py-6 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1b4332] border border-[#52b788] flex items-center justify-center text-white">
              <ShieldAlert className="w-6 h-6 text-[#74c69d]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">Employer & Safety Director Portal</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#52b788] text-[#0f291e] uppercase">
                  Admin Authority
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#95d5b2]">
                Active Supervisor: <span className="text-white font-bold">{currentUser.name}</span> &bull;{' '}
                {currentUser.roleTitle}
              </p>
            </div>
          </div>

          {/* Quick industry selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">Industry:</span>
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-bold border border-white/20 focus:outline-none"
              aria-label="Filter by industry"
            >
              <option value="all" className="bg-[#0f291e]">
                All Industries
              </option>
              <option value="construction" className="bg-[#0f291e]">
                Construction Sites
              </option>
              <option value="college" className="bg-[#0f291e]">
                Colleges & Campuses
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* KPI 1 */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
            <span className="text-[10px] font-mono text-gray-500 uppercase font-bold block">
              Registered Workers
            </span>
            <div className="text-2xl font-black text-[#0f291e] mt-1">{workersList.length}</div>
            <p className="text-[10px] text-gray-400 mt-0.5">Across {new Set(workersList.map((w) => w.industry)).size} industries</p>
          </div>

          {/* KPI 2 */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
            <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold block">
              Currently On Shift
            </span>
            <div className="text-2xl font-black text-emerald-700 mt-1 flex items-center gap-1.5">
              <span>{activeWorkersOnShift.length}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">Active Punch-ins</p>
          </div>

          {/* KPI 3 */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
            <span className="text-[10px] font-mono text-[#2d6a4f] uppercase font-bold block">
              Attendance Rate
            </span>
            <div className="text-2xl font-black text-[#1b4332] mt-1">94.8%</div>
            <p className="text-[10px] text-[#52b788] font-semibold">Demo benchmark</p>
          </div>

          {/* KPI 4 */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
            <span className="text-[10px] font-mono text-gray-500 uppercase font-bold block">
              Total Overtime
            </span>
            <div className="text-2xl font-black text-[#0f291e] mt-1">
              {totalOvertimeLogged.toFixed(1)} h
            </div>
            <p className="text-[10px] text-emerald-600 font-semibold">1.5× Paid Fairly</p>
          </div>

          {/* KPI 5 */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
            <span className="text-[10px] font-mono text-amber-700 uppercase font-bold block">
              Open Hazards
            </span>
            <div className="text-2xl font-black text-amber-700 mt-1 flex items-center gap-1.5">
              <span>{openComplaints.length}</span>
              {criticalComplaints.length > 0 && (
                <span className="px-1.5 py-0.2 rounded text-[9px] bg-red-100 text-red-800 font-bold">
                  {criticalComplaints.length} Crit
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">Under investigation</p>
          </div>

          {/* KPI 6 */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
            <span className="text-[10px] font-mono text-rose-700 uppercase font-bold block">
              Fatigue Alerts
            </span>
            <div className="text-2xl font-black text-rose-700 mt-1 flex items-center gap-1.5">
              <span>{fatigueAlerts.length}</span>
              <AlertCircle className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">Rule-based warnings</p>
          </div>
        </div>

        {/* Modules Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#d8f3dc]">
          <button
            onClick={() => setActiveModule('workers')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeModule === 'workers'
                ? 'bg-[#1b4332] text-white shadow-xs'
                : 'bg-white text-[#2d4a3e] border border-gray-200 hover:bg-[#eefaf1]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Worker Management & Shifts</span>
          </button>

          <button
            onClick={() => setActiveModule('safety')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeModule === 'safety'
                ? 'bg-[#1b4332] text-white shadow-xs'
                : 'bg-white text-[#2d4a3e] border border-gray-200 hover:bg-[#eefaf1]'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Safety Hazard Triage</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-100 text-red-800 font-mono">
              {openComplaints.length}
            </span>
          </button>

          <button
            onClick={() => setActiveModule('fatigue')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeModule === 'fatigue'
                ? 'bg-[#1b4332] text-white shadow-xs'
                : 'bg-white text-[#2d4a3e] border border-gray-200 hover:bg-[#eefaf1]'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Fatigue Monitoring</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-800 font-mono">
              {fatigueAlerts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveModule('analytics')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeModule === 'analytics'
                ? 'bg-[#1b4332] text-white shadow-xs'
                : 'bg-white text-[#2d4a3e] border border-gray-200 hover:bg-[#eefaf1]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Workforce Analytics</span>
          </button>

          <button
            onClick={() => setActiveModule('feedback')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeModule === 'feedback'
                ? 'bg-[#1b4332] text-white shadow-xs'
                : 'bg-white text-[#2d4a3e] border border-gray-200 hover:bg-[#eefaf1]'
            }`}
          >
            <MessageSquareOff className="w-4 h-4" />
            <span>Anonymous Feedback Review</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#d8f3dc] text-[#1b4332] font-mono">
              {feedback.length}
            </span>
          </button>
        </div>

        {/* MODULE 1: WORKER MANAGEMENT & SHIFTS */}
        {activeModule === 'workers' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by worker name, role, or department..."
                    value={workerSearch}
                    onChange={(e) => setWorkerSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowShiftModal(true)}
                    className="px-4 py-2 rounded-xl bg-[#1b4332] text-white hover:bg-[#0f291e] font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create & Assign Shift</span>
                  </button>
                </div>
              </div>

              {/* Workers Directory Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8faf9] text-gray-500 uppercase text-[10px] tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Worker</th>
                      <th className="py-3 px-4">Role Title</th>
                      <th className="py-3 px-4">Industry / Dept</th>
                      <th className="py-3 px-4">Assigned Workplace</th>
                      <th className="py-3 px-4 text-center">Hourly Rate</th>
                      <th className="py-3 px-4 text-center">Active Shift</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredWorkers.map((w) => {
                      const isCurrentlyActive = attendance.some(
                        (a) => a.workerId === w.id && a.status === 'checked_in'
                      );

                      return (
                        <tr key={w.id} className="hover:bg-[#f8faf9] transition-colors">
                          <td className="py-3 px-4 font-bold text-gray-900 flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#1b4332] text-white flex items-center justify-center font-bold text-xs overflow-hidden">
                              {w.avatar ? (
                                <img src={w.avatar} alt={w.name} className="w-full h-full object-cover" />
                              ) : (
                                w.name[0]
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{w.name}</p>
                              <p className="text-[10px] text-gray-400 font-mono">{w.id}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-semibold text-gray-700">{w.roleTitle}</td>
                          <td className="py-3 px-4">
                            <span className="capitalize font-bold text-[#1b4332]">{w.industry}</span>
                            <span className="text-gray-400 block text-[10px]">{w.department}</span>
                          </td>
                          <td className="py-3 px-4 text-gray-600 max-w-xs truncate">{w.workplace}</td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-gray-900">
                            ₹{w.hourlyRate}/h
                          </td>
                          <td className="py-3 px-4 text-center">
                            {isCurrentlyActive ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Clocked In</span>
                              </span>
                            ) : (
                              <span className="text-[10px] text-gray-400 font-medium">Off Duty</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Shift Roster Schedule */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-base text-[#0f291e]">Current Shift Roster & Deployments</h3>
                  <p className="text-xs text-gray-500">Scheduled shifts across active work sites.</p>
                </div>
                <span className="text-xs font-mono font-bold text-[#1b4332] bg-[#d8f3dc] px-2.5 py-1 rounded-lg">
                  {shifts.length} Shifts Scheduled
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {shifts.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-2xl border border-gray-200 bg-[#fbfdfc] space-y-2 hover:border-[#74c69d] transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0f291e]">{s.workerName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#eefaf1] text-[#1b4332] font-bold">
                        {s.date}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 font-medium">{s.roleTitle}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100">
                      <span className="font-mono text-[#1b4332] font-bold">
                        {s.startTime} - {s.endTime}
                      </span>
                      <span className="capitalize text-[10px] text-gray-400">{s.industry}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODULE 2: SAFETY MANAGEMENT & RESOLUTION */}
        {activeModule === 'safety' && (
          <div className="space-y-6">
            {/* Filter controls */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-lg text-[#0f291e]">Workplace Safety Complaints Queue</h3>
                <p className="text-xs text-gray-500">
                  Review worker reports, inspect hazard photos, update status, and attach formal resolution notes.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={safetyFilterSeverity}
                  onChange={(e) => setSafetyFilterSeverity(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold"
                  aria-label="Filter safety complaints by severity"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                <select
                  value={safetyFilterStatus}
                  onChange={(e) => setSafetyFilterStatus(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold"
                  aria-label="Filter safety complaints by status"
                >
                  <option value="all">All Statuses</option>
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            {/* Complaints Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredComplaints.map((c) => (
                <div
                  key={c.id}
                  className={`p-6 rounded-3xl border shadow-xs space-y-4 transition-all bg-white ${
                    c.severity === 'critical' && c.status !== 'resolved'
                      ? 'border-red-300 ring-2 ring-red-100'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-mono text-xs font-bold bg-[#d8f3dc] text-[#1b4332] px-2 py-0.5 rounded">
                          {c.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            c.severity === 'critical'
                              ? 'bg-red-100 text-red-800'
                              : c.severity === 'high'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {c.severity} Severity
                        </span>
                        <span className="text-[10px] capitalize font-mono text-gray-400">
                          {c.industry}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-base text-[#0f291e]">{c.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Reported by: <span className="font-semibold text-gray-700">{c.workerName}</span> &bull;{' '}
                        {new Date(c.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase font-mono ${
                        c.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'in_progress'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed bg-[#f8faf9] p-3 rounded-xl border border-gray-100">
                    {c.description}
                  </p>

                  <div className="text-xs text-gray-500 font-medium">
                    Location: <span className="text-gray-800 font-semibold">{c.location}</span>
                  </div>

                  {c.photoUrl && (
                    <div className="rounded-xl overflow-hidden border border-gray-200">
                      <img src={c.photoUrl} alt="Hazard photo" className="w-full h-36 object-cover" />
                    </div>
                  )}

                  {c.resolutionNotes && (
                    <div className="p-3 rounded-xl bg-[#f0f9f3] border border-[#74c69d]/40 text-xs">
                      <span className="font-bold text-[#1b4332] block text-[11px]">
                        Resolution Log ({c.assignedTo || 'Site Safety Team'}):
                      </span>
                      <p className="text-gray-800 mt-0.5">{c.resolutionNotes}</p>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-end">
                    <button
                      onClick={() => {
                        setSelectedComplaint(c);
                        setResStatus(c.status);
                        setResNotes(c.resolutionNotes || '');
                      }}
                      className="px-4 py-2 rounded-xl bg-[#1b4332] hover:bg-[#0f291e] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Update Status & Notes</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 3: FATIGUE MONITORING (Rule-Based Warnings) */}
        {activeModule === 'fatigue' && (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-300 rounded-3xl p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-amber-800" />
                <h3 className="font-extrabold text-lg text-amber-950">
                  Rule-Based Worker Fatigue Monitoring Engine
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                <strong>Important Compliance Notice:</strong> These fatigue alerts are rule-based operational warnings
                derived from ILO shift standards (e.g. single shift &gt;10h, rest interval &lt;11h, or &gt;50h weekly
                workload). They are intended to alert administrators to review shift rosters, not as medically validated
                predictions.
              </p>
            </div>

            {/* Fatigue Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fatigueAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-6 rounded-3xl border shadow-xs space-y-3 bg-white ${
                    alert.severity === 'critical' ? 'border-red-300 ring-2 ring-red-50' : 'border-amber-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-red-100 text-red-800">
                        {alert.severity} Risk
                      </span>
                      <h4 className="font-extrabold text-base text-[#0f291e] mt-1.5">{alert.workerName}</h4>
                      <p className="text-xs text-gray-500">{alert.roleTitle}</p>
                    </div>
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                      Rule Violated
                    </span>
                    <p className="font-bold text-red-900">{alert.ruleViolated}</p>
                    <div className="flex items-center justify-between text-[11px] text-gray-600 pt-1">
                      <span>Recorded: {alert.metricValue}</span>
                      <span>Ceiling: {alert.threshold}</span>
                    </div>
                  </div>

                  <div className="text-xs text-[#2d6a4f] bg-[#eefaf1] p-3 rounded-xl border border-[#74c69d]/40">
                    <span className="font-bold block text-[11px]">Recommended Administrator Action:</span>
                    <p className="mt-0.5">{alert.recommendedAction}</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowShiftModal(true);
                      setShiftWorkerId(alert.workerId);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#1b4332] text-white hover:bg-[#0f291e] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Adjust Worker Shift Schedule</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 4: WORKFORCE ANALYTICS (Recharts Visualizations) */}
        {activeModule === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs">
              <h3 className="font-extrabold text-lg text-[#0f291e]">Real-Time Workforce & Safety Analytics</h3>
              <p className="text-xs text-gray-500">
                Interactive metrics grounded in live shift records and reported hazards.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1: Daily Working & Overtime Hours */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-[#0f291e]">Daily Regular vs Overtime Hours</h4>
                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-gray-700">
                      <span className="w-3 h-3 rounded bg-[#1b4332]" /> Standard Hours
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <span className="w-3 h-3 rounded bg-[#52b788]" /> Overtime (1.5×)
                    </span>
                  </div>
                </div>

                <div className="h-64 w-full pt-2">
                  <svg viewBox="0 0 500 220" className="w-full h-full">
                    {/* Y Axis Gridlines */}
                    {[0, 4, 8, 12, 16].map((val, idx) => {
                      const y = 180 - (val / 16) * 150;
                      return (
                        <g key={idx}>
                          <line x1="40" y1={y} x2="480" y2={y} stroke="#f0f2f1" strokeDasharray="4 4" />
                          <text x="32" y={y + 4} textAnchor="end" fontSize="10" fill="#9ca3af" fontFamily="monospace">
                            {val}h
                          </text>
                        </g>
                      );
                    })}

                    {/* Bars for attendance data */}
                    {attendanceTrendsData.map((d, idx) => {
                      const count = attendanceTrendsData.length;
                      const groupWidth = 380 / count;
                      const groupX = 60 + idx * groupWidth;
                      const regH = (d.regularHours / 16) * 150;
                      const otH = (d.overtimeHours / 16) * 150;

                      return (
                        <g key={idx} className="group cursor-pointer">
                          {/* Regular bar */}
                          <rect
                            x={groupX}
                            y={180 - regH}
                            width="24"
                            height={regH}
                            fill="#1b4332"
                            rx="4"
                            className="transition-all hover:opacity-85"
                          />
                          {/* Overtime bar */}
                          <rect
                            x={groupX + 28}
                            y={180 - otH}
                            width="24"
                            height={otH}
                            fill="#52b788"
                            rx="4"
                            className="transition-all hover:opacity-85"
                          />
                          {/* X label */}
                          <text x={groupX + 26} y="202" textAnchor="middle" fontSize="11" fill="#4b5563" fontWeight="bold">
                            {d.date}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Chart 2: Safety Hazards by Category */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3">
                <h4 className="font-extrabold text-sm text-[#0f291e]">Reported Safety Hazards by Category</h4>
                <div className="h-64 w-full pt-2 flex flex-col justify-center space-y-3">
                  {complaintCategoryData.map((cat, idx) => {
                    const maxVal = Math.max(...complaintCategoryData.map((c) => c.count), 1);
                    const pct = Math.round((cat.count / maxVal) * 100);

                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-gray-700 capitalize">
                          <span>{cat.name}</span>
                          <span className="text-[#1b4332] font-mono">{cat.count} reports</span>
                        </div>
                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#2d6a4f] to-[#52b788] rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(pct, 12)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chart 3: Safety Resolution Lifecycle Breakdown */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3">
                <h4 className="font-extrabold text-sm text-[#0f291e]">Complaint Resolution Lifecycle Distribution</h4>
                <div className="h-64 w-full flex flex-col sm:flex-row items-center justify-around gap-4">
                  {/* Circular visual donut */}
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      {/* Background circle */}
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#f3f4f6" strokeWidth="16" />
                      {/* Slices */}
                      {(() => {
                        const total = statusPieData.reduce((s, p) => s + p.value, 0) || 1;
                        let accumulated = 0;
                        return statusPieData.map((slice, i) => {
                          const circumference = 2 * Math.PI * 38;
                          const slicePct = slice.value / total;
                          const strokeDasharray = `${slicePct * circumference} ${circumference}`;
                          const strokeDashoffset = -accumulated * circumference;
                          accumulated += slicePct;

                          return (
                            <circle
                              key={i}
                              cx="50"
                              cy="50"
                              r="38"
                              fill="none"
                              stroke={slice.color}
                              strokeWidth="16"
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset={strokeDashoffset}
                              className="transition-all hover:stroke-width-20"
                            />
                          );
                        });
                      })()}
                    </svg>
                    <div className="absolute text-center">
                      <div className="text-xl font-black text-[#0f291e]">{complaints.length}</div>
                      <div className="text-[9px] uppercase font-bold text-gray-400">Total</div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="space-y-2 text-xs">
                    {statusPieData.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-semibold text-gray-700">{item.name}</span>
                        <span className="font-mono text-gray-400 font-bold ml-auto">
                          ({item.value})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chart 4: UN SDG 8 Decent Work Compliance Index */}
              <div className="bg-gradient-to-br from-[#1b4332] to-[#0f291e] text-white p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#95d5b2]">UN SDG 8 Metric</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white/10 font-bold">100% Target</span>
                </div>
                <h4 className="text-xl font-black">Decent Work Compliance Index</h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Measures total zero-retaliation reporting protection, 100% verified hourly wage formulas, and
                  automated rest interval compliance.
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Salary Transparency Rate</span>
                      <span className="text-[#52b788]">100%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-[#52b788] w-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Hazard Triage Resolution SLA</span>
                      <span className="text-[#74c69d]">92%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-[#74c69d] w-[92%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Safe Rest Interval Compliance</span>
                      <span className="text-[#95d5b2]">88%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-[#95d5b2] w-[88%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 5: ANONYMOUS FEEDBACK REVIEW */}
        {activeModule === 'feedback' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs">
              <h3 className="font-extrabold text-lg text-[#0f291e]">Worker Anonymous Feedback Inbox</h3>
              <p className="text-xs text-gray-500">
                Identities are strictly protected. Post administrative public acknowledgments to communicate
                management actions.
              </p>
            </div>

            <div className="space-y-4">
              {feedback.map((fb) => (
                <div
                  key={fb.id}
                  className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                        {fb.department}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#d8f3dc] text-[#1b4332]">
                        {fb.category.replace('_', ' ')}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          fb.severity === 'urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : fb.severity === 'concern'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {fb.severity}
                      </span>
                    </div>

                    <span className="text-[10px] text-gray-400 font-mono">
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">"{fb.message}"</p>

                  {fb.adminAcknowledgment ? (
                    <div className="p-3.5 rounded-2xl bg-[#f0f9f3] border border-[#74c69d]/40 text-xs">
                      <span className="font-bold text-[#1b4332] block text-[11px]">
                        Public Management Acknowledgment:
                      </span>
                      <p className="text-gray-800 mt-0.5">{fb.adminAcknowledgment}</p>
                      <p className="text-[10px] text-gray-400 font-mono mt-1">
                        Posted {new Date(fb.acknowledgedAt || '').toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <div className="pt-2">
                      {ackFeedbackId === fb.id ? (
                        <form onSubmit={handleAcknowledgeSubmit} className="space-y-2">
                          <textarea
                            rows={2}
                            required
                            placeholder="Write public management response/action taken..."
                            value={ackText}
                            onChange={(e) => setAckText(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#2d6a4f]"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              type="submit"
                              className="px-3 py-1.5 rounded-xl bg-[#1b4332] text-white text-xs font-bold"
                            >
                              Post Acknowledgment
                            </button>
                            <button
                              type="button"
                              onClick={() => setAckFeedbackId(null)}
                              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-500"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button
                          onClick={() => {
                            setAckFeedbackId(fb.id);
                            setAckText('');
                          }}
                          className="px-3 py-1.5 rounded-xl border border-[#2d6a4f] text-[#1b4332] hover:bg-[#eefaf1] text-xs font-bold transition-all"
                        >
                          Acknowledge & Respond
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Safety Resolution Dialog Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-200 p-6 space-y-4">
            <h3 className="font-black text-lg text-[#0f291e]">
              Update Safety Complaint ({selectedComplaint.id})
            </h3>
            <p className="text-xs text-gray-600">{selectedComplaint.title}</p>

            <form onSubmit={handleUpdateStatusSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Lifecycle Status
                </label>
                <select
                  value={resStatus}
                  onChange={(e) => setResStatus(e.target.value as ComplaintStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold focus:ring-2 focus:ring-[#2d6a4f]"
                >
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="in_progress">In Progress (Dispatching Fix)</option>
                  <option value="resolved">Resolved (Inspection Verified)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Supervisor Resolution Notes *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail actions taken, equipment parts replaced, or inspection certificates signed..."
                  value={resNotes}
                  onChange={(e) => setResNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#2d6a4f]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1b4332] text-white hover:bg-[#0f291e]"
                >
                  Save & Notify Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Shift Modal */}
      {showShiftModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-200 p-6 space-y-4">
            <h3 className="font-black text-lg text-[#0f291e]">Create & Assign New Shift</h3>

            <form onSubmit={handleCreateShiftSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Select Worker
                </label>
                <select
                  value={shiftWorkerId}
                  onChange={(e) => setShiftWorkerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold focus:ring-2 focus:ring-[#2d6a4f]"
                >
                  {workersList.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.roleTitle} - {w.industry})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Shift Date
                </label>
                <input
                  type="date"
                  required
                  value={shiftDate}
                  onChange={(e) => setShiftDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={shiftStart}
                    onChange={(e) => setShiftStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={shiftEnd}
                    onChange={(e) => setShiftEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Workplace Location
                </label>
                <input
                  type="text"
                  required
                  value={shiftWorkplace}
                  onChange={(e) => setShiftWorkplace(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowShiftModal(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1b4332] text-white hover:bg-[#0f291e]"
                >
                  Assign Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
