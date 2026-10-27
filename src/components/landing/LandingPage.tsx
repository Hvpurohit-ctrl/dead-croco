import React, { useState } from 'react';
import { Logo } from '../brand/Logo';
import { Language, User } from '../../types';
import { translations, speakText } from '../../utils/i18n';
import {
  Clock,
  DollarSign,
  AlertTriangle,
  MessageSquareOff,
  Award,
  ShieldAlert,
  ArrowRight,
  HardHat,
  GraduationCap,
  Factory,
  Building2,
  CheckCircle2,
  TrendingUp,
  Volume2,
  Sparkles,
  ChevronRight,
  Eye,
  FileText,
  Users,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: 'landing' | 'worker' | 'admin') => void;
  language: Language;
  onUserSelect: (user: User) => void;
  allUsers: User[];
  currentUser: User;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  language,
  onUserSelect,
  allUsers,
  currentUser,
}) => {
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<'workers' | 'employers'>('workers');
  const [selectedIndustry, setSelectedIndustry] = useState<'construction' | 'college' | 'factory' | 'hospital'>(
    'construction'
  );
  const [interactiveClockedIn, setInteractiveClockedIn] = useState(false);

  const t = translations[language];

  const handleVoiceListen = (text: string) => {
    speakText(text, language);
  };

  const industriesData = [
    {
      id: 'construction',
      name: 'Construction Sites',
      icon: HardHat,
      headline: 'Heavy Infrastructure & Building Sites',
      description:
        'Eliminate unsafe working heights, stripped scaffold clamps, and arbitrary overtime cuts. Protect daily wage earners with verified attendance and gear checks.',
      sampleRoles: ['Scaffolding Specialists', 'Tower Crane Operators', 'Rebar Riggers', 'Civil Laborers'],
      hazardTypes: ['Fall Hazards & Railings', 'Excavation Shoring', 'Crane Hoist Limit Failures', 'Heat Stress'],
      bgGradient: 'from-[#1b4332] to-[#0f291e]',
    },
    {
      id: 'college',
      name: 'Colleges & Universities',
      icon: GraduationCap,
      headline: 'Educational Institutions & Campuses',
      description:
        'Empower campus facility teams, cleaning crews, lab technicians, and night-shift security officers with dignified wages and responsive hazard reporting.',
      sampleRoles: ['Housekeeping Officers', 'Perimeter Security Guards', 'Lab Waste Handlers', 'Campus Electricians'],
      hazardTypes: ['Chemical Lab Fumes', 'Hostel Pathway Dark Zones', 'Slip & Wet Floor Risks', 'Biohazard Storage'],
      bgGradient: 'from-[#2d6a4f] to-[#1b4332]',
    },
    {
      id: 'factory',
      name: 'Manufacturing & Factories',
      icon: Factory,
      headline: 'Assembly Lines & Production Plants',
      description:
        'Prevent fatigue-induced machine accidents and ergonomic strain across continuous 3-shift assembly cycles with automatic rest-interval warnings.',
      sampleRoles: ['Assembly Line Operators', 'CNC Technicians', 'Forklift Drivers', 'Quality Inspectors'],
      hazardTypes: ['Lockout/Tagout Failures', 'Conveyor Pinch Points', 'Excessive Decibel Exposure', 'Micro-dust Inhalation'],
      bgGradient: 'from-[#40916c] to-[#2d6a4f]',
    },
    {
      id: 'hospital',
      name: 'Hospitals & Healthcare',
      icon: Building2,
      headline: 'Healthcare Facilities & Sanitation',
      description:
        'Protect hospital orderly staff, biomedical waste collectors, and emergency attendants from shift exhaustion and pathogen exposure.',
      sampleRoles: ['Sanitation Orderlies', 'Bio-Waste Technicians', 'Facility Handlers', 'Patient Transport Staff'],
      hazardTypes: ['Needlestick & Sharp Bins', 'Disinfectant Fume Overexposure', 'Consecutive Night Fatigue', 'PPE Stockouts'],
      bgGradient: 'from-[#52b788] to-[#1b4332]',
    },
  ];

  const activeInd = industriesData.find((i) => i.id === selectedIndustry) || industriesData[0];

  return (
    <div className="min-h-screen bg-[#f7faf8] text-[#0f291e] overflow-x-hidden">
      {/* UN SDG 8 Announcement Banner */}
      <div className="bg-[#1b4332] text-white py-2 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2 border-b border-[#2d6a4f]">
        <span className="w-2 h-2 rounded-full bg-[#52b788] animate-pulse" />
        <span>{t.unSdg8Banner}</span>
        <button
          onClick={() => handleVoiceListen(t.unSdg8Banner)}
          title="Listen"
          className="p-1 hover:text-[#95d5b2] transition-colors"
          aria-label="Listen to SDG 8 banner announcement"
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-gradient-to-b from-[#eefaf1] via-[#f7faf8] to-[#f7faf8]">
        {/* Decorative background blurs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d8f3dc]/60 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-[#95d5b2]/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d8f3dc] border border-[#74c69d]/60 shadow-2xs">
                <span className="text-xs font-black uppercase tracking-wider text-[#1b4332] font-mono">
                  {t.tagline}
                </span>
                <span className="h-3 w-px bg-[#74c69d]" />
                <span className="text-xs font-bold text-[#2d6a4f]">Decent Work Platform</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0f291e] leading-[1.12]">
                {t.heroHeadline}
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-[#355345] leading-relaxed max-w-2xl font-normal">
                {t.heroSubheadline}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  onClick={() => onNavigate('worker')}
                  className="px-6 py-3.5 rounded-xl text-base font-bold bg-[#1b4332] text-white hover:bg-[#0f291e] shadow-lg shadow-[#1b4332]/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  <HardHat className="w-5 h-5 text-[#74c69d]" />
                  <span>Launch Worker Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('admin')}
                  className="px-6 py-3.5 rounded-xl text-base font-bold bg-white text-[#1b4332] border-2 border-[#1b4332]/20 hover:border-[#1b4332] hover:bg-[#eefaf1] shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ShieldAlert className="w-5 h-5 text-[#2d6a4f]" />
                  <span>Employer / Admin Dashboard</span>
                </button>
              </div>

              {/* Quick Persona Selector Helper */}
              <div className="pt-4 flex flex-wrap items-center gap-3 text-xs text-[#406856]">
                <span className="font-bold uppercase tracking-wider text-[11px] text-[#1b4332]">
                  Try Live Demo:
                </span>
                <button
                  onClick={() => {
                    const raju = allUsers.find((u) => u.id === 'user-worker-1');
                    if (raju) onUserSelect(raju);
                    onNavigate('worker');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#74c69d]/50 hover:bg-[#d8f3dc] font-semibold text-[#0f291e] flex items-center gap-1.5 transition-colors"
                >
                  <HardHat className="w-3.5 h-3.5 text-[#2d6a4f]" />
                  <span>Raju (Construction Lead)</span>
                </button>

                <button
                  onClick={() => {
                    const anita = allUsers.find((u) => u.id === 'user-worker-2');
                    if (anita) onUserSelect(anita);
                    onNavigate('worker');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#74c69d]/50 hover:bg-[#d8f3dc] font-semibold text-[#0f291e] flex items-center gap-1.5 transition-colors"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-[#2d6a4f]" />
                  <span>Anita (Campus Hygiene)</span>
                </button>

                <button
                  onClick={() => {
                    const vikram = allUsers.find((u) => u.id === 'user-admin-1');
                    if (vikram) onUserSelect(vikram);
                    onNavigate('admin');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#1b4332] text-white hover:bg-[#0f291e] font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-[#74c69d]" />
                  <span>Site Safety Admin</span>
                </button>
              </div>
            </div>

            {/* Right Live Workforce Dashboard Preview Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl shadow-2xl border border-[#74c69d]/40 p-5 sm:p-6 backdrop-blur-md">
                {/* Preview Card Header */}
                <div className="flex items-center justify-between border-b border-[#eefaf1] pb-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#1b4332] flex items-center justify-center text-white font-bold text-sm">
                      DC
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-[#0f291e]">dead.croco Live Preview</div>
                      <div className="text-[10px] text-[#406856] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Interactive Shift Simulator</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#d8f3dc] text-[#1b4332]">
                    Metro Site #4
                  </span>
                </div>

                {/* Interactive Shift Card */}
                <div className="bg-[#f4faf6] rounded-2xl p-4 border border-[#74c69d]/40 mb-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-[#1b4332] flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#2d6a4f]" />
                      <span>Today's Shift Status</span>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        interactiveClockedIn
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {interactiveClockedIn ? '● ACTIVE (08:00 - Present)' : '○ Standby'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center my-3">
                    <div className="bg-white p-2.5 rounded-xl border border-gray-100">
                      <div className="text-[10px] text-gray-500 font-medium">Logged Hours</div>
                      <div className="text-lg font-black text-[#0f291e]">
                        {interactiveClockedIn ? '8.5 hrs' : '0.0 hrs'}
                      </div>
                      <div className="text-[9px] text-emerald-600 font-bold">
                        {interactiveClockedIn ? '+0.5h Overtime' : 'Shift not started'}
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-gray-100">
                      <div className="text-[10px] text-gray-500 font-medium">Accrued Wage</div>
                      <div className="text-lg font-black text-[#1b4332]">
                        {interactiveClockedIn ? '₹2,275' : '₹0'}
                      </div>
                      <div className="text-[9px] text-[#2d6a4f] font-semibold">100% Transparent</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setInteractiveClockedIn(!interactiveClockedIn)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                      interactiveClockedIn
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-[#1b4332] hover:bg-[#0f291e] text-white'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{interactiveClockedIn ? 'Tap to Check Out' : 'Tap to Check In (Test Action)'}</span>
                  </button>
                </div>

                {/* Live Safety Complaint Preview Badge */}
                <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between text-xs mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0f291e] text-[11px]">DC-SAF-8921</p>
                      <p className="text-[10px] text-gray-500">Pier 112 Coupler Clamp</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    In Progress
                  </span>
                </div>

                {/* SDG 8 Alignment Tagline */}
                <div className="text-center pt-2">
                  <p className="text-[10px] font-mono text-gray-400">
                    &bull; Zero Retaliation Anonymous Reporting Protected &bull;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-20 bg-white border-y border-[#d8f3dc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2d6a4f] font-mono">
              The Reality Today
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f291e] tracking-tight">
              Why Traditional Workforce Management Fails Frontline Workers
            </h2>
            <p className="text-base sm:text-lg text-[#355345]">
              Millions of workers in construction, sanitation, and campus facilities face systemic exploitation
              because of paper logs, hidden wage formulas, and fear of reporting life-threatening hazards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Problem 1 */}
            <div className="p-6 rounded-2xl bg-[#f8faf9] border border-gray-200 hover:border-[#74c69d] transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0f291e]">Manual Attendance Fraud</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Paper punch cards and contractor registers are frequently altered or "lost", cutting workers out of
                hard-earned overtime hours without proof.
              </p>
            </div>

            {/* Problem 2 */}
            <div className="p-6 rounded-2xl bg-[#f8faf9] border border-gray-200 hover:border-[#74c69d] transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0f291e]">Opaque Salary Deductions</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Workers receive arbitrary lump-sum cash deductions for "uniforms", "gear", or "penalties" with zero
                mathematical transparency or printed payslips.
              </p>
            </div>

            {/* Problem 3 */}
            <div className="p-6 rounded-2xl bg-[#f8faf9] border border-gray-200 hover:border-[#74c69d] transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0f291e]">Unreported Fatal Hazards</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Site workers fear retaliation or job termination if they point out loose scaffolding or chemical leaks.
                Hazards fester until preventable accidents occur.
              </p>
            </div>

            {/* Problem 4 */}
            <div className="p-6 rounded-2xl bg-[#f8faf9] border border-gray-200 hover:border-[#74c69d] transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0f291e]">Ghost Work Histories</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Years of skilled technical craftsmanship vanish when moving to a new contractor because there is no
                portable, accredited digital passport of verified competencies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#f7faf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2d6a4f] font-mono">
              Platform Modules
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f291e] tracking-tight">
              Built from Ground Up for Dignity, Safety & Clarity
            </h2>
            <p className="text-base sm:text-lg text-[#355345]">
              Every module in dead.croco balances worker empowerment with employer operational accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-7 rounded-2xl border border-gray-200/80 shadow-xs hover:border-[#52b788] hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#d8f3dc] text-[#1b4332] flex items-center justify-center font-bold mb-5 group-hover:scale-105 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f291e] mb-2">Smart Shift Tracking</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                One-tap mobile check-in and check-out with automatic overtime rate calculations, preventing duplicate
                entries and ensuring every minute is provably logged.
              </p>
              <ul className="text-xs text-[#2d4a3e] space-y-1.5 font-medium">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#52b788]" /> Daily, weekly, monthly logs
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#52b788]" /> Automatic 1.5× overtime multiplier
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-7 rounded-2xl border border-gray-200/80 shadow-xs hover:border-[#52b788] hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#d8f3dc] text-[#1b4332] flex items-center justify-center font-bold mb-5 group-hover:scale-105 transition-transform">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f291e] mb-2">Transparent Payslips</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Crystal-clear mathematical explanations showing exactly how base earnings, overtime hours, and statutory
                deductions lead to the final take-home salary.
              </p>
              <ul className="text-xs text-[#2d4a3e] space-y-1.5 font-medium">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#52b788]" /> Printable & PDF downloadable
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#52b788]" /> Itemized statutory deduction breakdown
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-7 rounded-2xl border border-gray-200/80 shadow-xs hover:border-[#52b788] hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#d8f3dc] text-[#1b4332] flex items-center justify-center font-bold mb-5 group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f291e] mb-2">Safety Hazard Reporting</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Workers report equipment defects or structural risks with photo attachments, receiving a unique
                tracking ID (e.g. DC-SAF-8921) and real-time status updates.
              </p>
              <ul className="text-xs text-[#2d4a3e] space-y-1.5 font-medium">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#52b788]" /> 4-stage lifecycle: Submitted to Resolved
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#52b788]" /> Photo evidence & supervisor resolution notes
                </li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-7 rounded-2xl border border-gray-200/80 shadow-xs hover:border-[#52b788] hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#d8f3dc] text-[#1b4332] flex items-center justify-center font-bold mb-5 group-hover:scale-105 transition-transform">
                <MessageSquareOff className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f291e] mb-2">Anonymous Feedback</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Workers submit uncensored insights regarding facilities, workload, and management without exposing their
                identity, protected by one-way tokenization.
              </p>
              <ul className="text-xs text-[#2d4a3e] space-y-1.5 font-medium">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#52b788]" /> Zero identity exposure in admin view
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#52b788]" /> Public administrative acknowledgment feed
                </li>
              </ul>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-7 rounded-2xl border border-gray-200/80 shadow-xs hover:border-[#52b788] hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#d8f3dc] text-[#1b4332] flex items-center justify-center font-bold mb-5 group-hover:scale-105 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f291e] mb-2">Digital Skill Passport</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Build a portable, employer-verified credential showcasing OSHA certifications, training hours, and
                safety ratings that stay with the worker throughout their career.
              </p>
              <ul className="text-xs text-[#2d4a3e] space-y-1.5 font-medium">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#52b788]" /> Skill tiers (Beginner to Expert)
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#52b788]" /> Verified safety score & training history
                </li>
              </ul>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-7 rounded-2xl border border-gray-200/80 shadow-xs hover:border-[#52b788] hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#d8f3dc] text-[#1b4332] flex items-center justify-center font-bold mb-5 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f291e] mb-2">Rule-Based Fatigue Alerts</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Protects workers from dangerous exhaustion by flagging shifts exceeding 10 hours, rest periods under 11
                hours, and high weekly cumulative workload.
              </p>
              <ul className="text-xs text-[#2d4a3e] space-y-1.5 font-medium">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#52b788]" /> ILO standard rest interval checks
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#52b788]" /> Specific rule violations & action advice
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white border-y border-[#d8f3dc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2d6a4f] font-mono">
              Simple Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f291e] tracking-tight">
              How dead.croco Works in Practice
            </h2>
            <p className="text-base sm:text-lg text-[#355345]">
              Seamless end-to-end synchronization between frontline staff and site administration.
            </p>

            {/* Toggle Tab */}
            <div className="inline-flex p-1.5 bg-[#f0f9f3] rounded-2xl border border-[#74c69d]/40 mt-4">
              <button
                onClick={() => setActiveWorkflowTab('workers')}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeWorkflowTab === 'workers'
                    ? 'bg-[#1b4332] text-white shadow-xs'
                    : 'text-[#2d4a3e] hover:text-[#1b4332]'
                }`}
              >
                For Frontline Workers
              </button>
              <button
                onClick={() => setActiveWorkflowTab('employers')}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeWorkflowTab === 'employers'
                    ? 'bg-[#1b4332] text-white shadow-xs'
                    : 'text-[#2d4a3e] hover:text-[#1b4332]'
                }`}
              >
                For Employers & Supervisors
              </button>
            </div>
          </div>

          {activeWorkflowTab === 'workers' ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-[#f8faf9] border border-gray-200 text-left space-y-2">
                <span className="w-8 h-8 rounded-full bg-[#1b4332] text-white font-mono font-bold text-xs flex items-center justify-center">
                  01
                </span>
                <h4 className="font-bold text-base text-[#0f291e]">Check In on Site</h4>
                <p className="text-xs text-gray-600">
                  Tap check-in upon arriving at your gate or ward. Your verified time and geofence are locked in.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#f8faf9] border border-gray-200 text-left space-y-2">
                <span className="w-8 h-8 rounded-full bg-[#1b4332] text-white font-mono font-bold text-xs flex items-center justify-center">
                  02
                </span>
                <h4 className="font-bold text-base text-[#0f291e]">Report Any Hazard</h4>
                <p className="text-xs text-gray-600">
                  Spot a missing toe-board or chemical fume leak? Snap a photo and submit with immediate ticket tracking.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#f8faf9] border border-gray-200 text-left space-y-2">
                <span className="w-8 h-8 rounded-full bg-[#1b4332] text-white font-mono font-bold text-xs flex items-center justify-center">
                  03
                </span>
                <h4 className="font-bold text-base text-[#0f291e]">Inspect Math on Pay</h4>
                <p className="text-xs text-gray-600">
                  No mystery numbers. View exactly how base hours and overtime translate to your net earnings.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#f8faf9] border border-gray-200 text-left space-y-2">
                <span className="w-8 h-8 rounded-full bg-[#1b4332] text-white font-mono font-bold text-xs flex items-center justify-center">
                  04
                </span>
                <h4 className="font-bold text-base text-[#0f291e]">Export Passport</h4>
                <p className="text-xs text-gray-600">
                  Take your verified skills, OSHA certificates, and safe work hours to your next career opportunity.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-[#f8faf9] border border-gray-200 text-left space-y-2">
                <span className="w-8 h-8 rounded-full bg-[#2d6a4f] text-white font-mono font-bold text-xs flex items-center justify-center">
                  01
                </span>
                <h4 className="font-bold text-base text-[#0f291e]">Schedule & Assign</h4>
                <p className="text-xs text-gray-600">
                  Create shifts across structural, electrical, or sanitation teams with real-time roster visibility.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#2d6a4f] text-white p-6 rounded-2xl text-left space-y-2">
                <span className="w-8 h-8 rounded-full bg-[#52b788] text-[#0f291e] font-mono font-bold text-xs flex items-center justify-center">
                  02
                </span>
                <h4 className="font-bold text-base">Fatigue Safeguard</h4>
                <p className="text-xs text-emerald-100">
                  System flags workers exceeding safe limits (&gt;10h daily or &lt;11h rest) before accidents happen.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#f8faf9] border border-gray-200 text-left space-y-2">
                <span className="w-8 h-8 rounded-full bg-[#2d6a4f] text-white font-mono font-bold text-xs flex items-center justify-center">
                  03
                </span>
                <h4 className="font-bold text-base text-[#0f291e]">Triage Hazards</h4>
                <p className="text-xs text-gray-600">
                  Review worker hazard submissions, dispatch fixes, update statuses, and log audit notes for compliance.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#f8faf9] border border-gray-200 text-left space-y-2">
                <span className="w-8 h-8 rounded-full bg-[#2d6a4f] text-white font-mono font-bold text-xs flex items-center justify-center">
                  04
                </span>
                <h4 className="font-bold text-base text-[#0f291e]">SDG 8 Analytics</h4>
                <p className="text-xs text-gray-600">
                  Monitor attendance rates, overtime distributions, and safety resolution velocity with live charts.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="py-20 bg-[#f7faf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2d6a4f] font-mono">
              Cross-Industry Adaptability
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f291e] tracking-tight">
              Engineered for High-Risk & High-Vulnerability Sectors
            </h2>
            <p className="text-base sm:text-lg text-[#355345]">
              Tailored workflows for construction sites and educational institutions, extensible to factories and healthcare.
            </p>

            {/* Industry Selector Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              {industriesData.map((ind) => {
                const IconComponent = ind.icon;
                const isSelected = selectedIndustry === ind.id;
                return (
                  <button
                    key={ind.id}
                    onClick={() => setSelectedIndustry(ind.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1b4332] text-white shadow-sm'
                        : 'bg-white text-[#2d4a3e] border border-gray-200 hover:bg-[#eefaf1]'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{ind.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Industry Card */}
          <div className="bg-white rounded-3xl border border-[#74c69d]/40 shadow-xl overflow-hidden p-8 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#d8f3dc] text-[#1b4332] text-xs font-bold font-mono uppercase">
                  Industry Focus: {activeInd.name}
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0f291e]">{activeInd.headline}</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{activeInd.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-[#f8faf9] border border-gray-200">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#1b4332] block mb-2">
                      Key Frontline Roles Protected
                    </span>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {activeInd.sampleRoles.map((role, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#52b788]" />
                          <span>{role}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-[#f8faf9] border border-gray-200">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 block mb-2">
                      Common Monitored Hazards
                    </span>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {activeInd.hazardTypes.map((hazard, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          <span>{hazard}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-gradient-to-br from-[#1b4332] to-[#0f291e] rounded-2xl p-6 text-white space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#95d5b2]">
                    Field Demonstration
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white/10 font-bold">Live Synced</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs">
                    <div className="text-[#95d5b2] font-bold text-[11px]">Primary Benchmark Site</div>
                    <p className="text-white font-medium mt-0.5">
                      {selectedIndustry === 'construction'
                        ? 'Metro Rail Construction Line 4 - Pier 112'
                        : selectedIndustry === 'college'
                        ? 'Apex National University Campus Labs & Hostels'
                        : selectedIndustry === 'factory'
                        ? 'AutoAssembly Plant Unit 2'
                        : 'City Medical Center Central Ward'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs">
                    <div className="text-[#95d5b2] font-bold text-[11px]">Active Protocols Enforced</div>
                    <p className="text-gray-300 mt-0.5">
                      {selectedIndustry === 'construction'
                        ? 'Scaffold Lockout & Daily Working-at-Heights Gear Permits'
                        : selectedIndustry === 'college'
                        ? 'Chemical Hazard Ventilation & Guard Pathway Night Illumination'
                        : 'Conveyor Emergency Tripwire Inspection & 8h Max Overtime Cap'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const targetUser =
                      selectedIndustry === 'construction'
                        ? allUsers.find((u) => u.id === 'user-worker-1')
                        : allUsers.find((u) => u.id === 'user-worker-2');
                    if (targetUser) onUserSelect(targetUser);
                    onNavigate('worker');
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#52b788] hover:bg-[#40916c] text-[#0f291e] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <span>Open {activeInd.name} Worker Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact & UN SDG 8 Alignment Section */}
      <section id="impact" className="py-20 bg-white border-t border-[#d8f3dc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#0f291e] via-[#1b4332] to-[#081c13] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
            {/* Background pattern */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#52b788]/15 blur-2xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#52b788]/20 border border-[#52b788]/40 text-[#95d5b2] text-xs font-bold uppercase tracking-wider font-mono">
                  UN SDG 8 &bull; Decent Work & Economic Growth
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Protecting Labor Rights & Promoting Safe Working Environments
                </h2>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
                  By transforming worker hours into verifiable, tamper-resistant records and democratizing safety
                  reporting without fear of retaliation, dead.croco brings the core tenets of United Nations
                  Sustainable Development Goal 8 directly to frontline work sites.
                </p>

                {/* Sample Demo Data disclaimer clearly labeled */}
                <p className="text-[11px] text-[#95d5b2] font-mono pt-2">
                  * Note: All operational metrics and impact stats presented below are demonstrative sample figures for
                  hackathon simulation.
                </p>
              </div>

              <div className="lg:col-span-4 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-center">
                  <span className="text-3xl sm:text-4xl font-black text-[#52b788]">100%</span>
                  <p className="text-xs text-gray-300 mt-1 font-semibold">Salary Calculation Transparency</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Zero Hidden Cuts</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-center">
                  <span className="text-3xl sm:text-4xl font-black text-[#52b788]">2.4 hrs</span>
                  <p className="text-xs text-gray-300 mt-1 font-semibold">Avg Hazard Triage Speed</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Demo Response SLA</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-center">
                  <span className="text-3xl sm:text-4xl font-black text-[#52b788]">0</span>
                  <p className="text-xs text-gray-300 mt-1 font-semibold">Retaliation Risk</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Encrypted Anonymous Feed</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-center">
                  <span className="text-3xl sm:text-4xl font-black text-[#52b788]">11.0 h</span>
                  <p className="text-xs text-gray-300 mt-1 font-semibold">Mandatory Rest Interval</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Fatigue Rule Floor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Website Footer */}
      <footer className="bg-[#0a1f16] text-white pt-16 pb-12 border-t border-[#1b4332]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
            {/* Col 1: Brand */}
            <div className="lg:col-span-2 space-y-4">
              <Logo size="lg" showTagline={true} inverted={true} />
              <p className="text-xs text-gray-300 leading-relaxed max-w-sm mt-3">
                dead.croco empowers frontline workers with transparent wages, safer worksites, and portable digital
                passports, while providing employers with compliant workforce analytics.
              </p>
              <div className="inline-block px-3 py-1 bg-[#1b4332] text-[#95d5b2] text-xs font-mono font-bold rounded-lg border border-[#52b788]/30">
                Tagline: BE DEAD LIKE CROCO
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#74c69d]">Platform Portals</h4>
              <ul className="text-xs space-y-2 text-gray-300">
                <li>
                  <button
                    onClick={() => onNavigate('worker')}
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <span>Worker Mobile Portal</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('admin')}
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <span>Employer / Safety Admin</span>
                  </button>
                </li>
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Core Modules
                  </a>
                </li>
                <li>
                  <a href="#industries" className="hover:text-white transition-colors">
                    Industry Verticals
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Standards */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#74c69d]">Decent Work & Ethics</h4>
              <ul className="text-xs space-y-2 text-gray-300">
                <li>UN SDG 8 Framework</li>
                <li>ILO Rest Interval Rules</li>
                <li>Anonymous Feedback Protocol</li>
                <li>Cryptographic Payslips</li>
              </ul>
            </div>

            {/* Col 4: Accessibility */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#74c69d]">Accessibility</h4>
              <p className="text-xs text-gray-400">
                Multi-lingual interfaces in English, हिन्दी (Hindi), and தமிழ் (Tamil) with built-in voice assistance.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleVoiceListen(`${t.appName}. ${t.tagline}. ${t.heroHeadline}`)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#52b788]" />
                  <span>Listen to Intro</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
            <p>&copy; {new Date().getFullYear()} dead.croco. All rights reserved. BE DEAD LIKE CROCO.</p>
            <div className="flex items-center gap-4">
              <span>UN SDG 8 Aligned</span>
              <span>&bull;</span>
              <span>ISO 45001 EHS Ready</span>
              <span>&bull;</span>
              <span>Zero Retaliation Protected</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
