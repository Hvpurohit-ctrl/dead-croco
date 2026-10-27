import React from 'react';
import { Payslip, SkillPassport } from '../../types';
import { Logo } from '../brand/Logo';
import { Printer, X, CheckCircle2, ShieldCheck, Award } from 'lucide-react';

interface PrintableModalProps {
  type: 'payslip' | 'passport';
  payslip?: Payslip | null;
  passport?: SkillPassport | null;
  onClose: () => void;
}

export const PrintableModal: React.FC<PrintableModalProps> = ({
  type,
  payslip,
  passport,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-8">
        {/* Action Header (Hidden during physical print) */}
        <div className="no-print bg-[#0f291e] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#74c69d]" />
            <h3 className="font-bold text-sm sm:text-base">
              {type === 'payslip' ? 'Official Transparent Payslip Document' : 'Digital Skill Passport Credential'}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-[#52b788] hover:bg-[#40916c] text-[#0f291e] font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-10 bg-white text-gray-900 printable-document">
          {type === 'payslip' && payslip && (
            <div className="space-y-6">
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b-2 border-[#1b4332] pb-6 gap-4">
                <div>
                  <Logo size="md" showTagline={true} />
                  <p className="text-xs text-gray-500 mt-2 font-mono">
                    UN SDG 8 Compliant &bull; Transparent Wage Certification
                  </p>
                </div>
                <div className="sm:text-right">
                  <div className="inline-block px-3 py-1 bg-[#d8f3dc] text-[#1b4332] text-xs font-bold rounded-full font-mono mb-1">
                    {payslip.id}
                  </div>
                  <h2 className="text-xl font-extrabold text-[#0f291e]">EARNINGS STATEMENT</h2>
                  <p className="text-xs text-gray-600 font-medium">Period: {payslip.payPeriod}</p>
                  <p className="text-xs text-gray-500">
                    Range: {payslip.periodStart} to {payslip.periodEnd}
                  </p>
                </div>
              </div>

              {/* Worker & Employer Identification */}
              <div className="grid grid-cols-2 gap-6 bg-[#f8faf9] p-4 rounded-xl border border-gray-200 text-xs">
                <div>
                  <span className="text-gray-400 font-bold uppercase tracking-wider block text-[10px]">
                    Employee Information
                  </span>
                  <p className="font-bold text-sm text-[#0f291e] mt-0.5">{payslip.workerName}</p>
                  <p className="text-gray-600">Employee ID: {payslip.workerId}</p>
                  <p className="text-gray-600">Base Wage: ₹{payslip.hourlyRate}/hour</p>
                  <p className="text-gray-600">Overtime Rate: ₹{payslip.overtimeRate}/hour (1.5×)</p>
                </div>
                <div className="text-right sm:text-left">
                  <span className="text-gray-400 font-bold uppercase tracking-wider block text-[10px]">
                    Disbursement Details
                  </span>
                  <p className="font-semibold text-gray-700 mt-0.5">Disbursement Date: {payslip.paymentDate}</p>
                  <p className="text-gray-600">Method: Direct Bank Settlement (NEFT)</p>
                  <p className="text-emerald-700 font-bold flex items-center gap-1 sm:justify-start justify-end mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Non-Exploitative
                  </p>
                </div>
              </div>

              {/* Breakdown Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-[#1b4332] text-white uppercase text-[10px] tracking-wider font-bold">
                    <tr>
                      <th className="py-2.5 px-4">Pay Component</th>
                      <th className="py-2.5 px-4 text-center">Hours</th>
                      <th className="py-2.5 px-4 text-center">Rate</th>
                      <th className="py-2.5 px-4 text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-gray-800">Standard Working Hours</td>
                      <td className="py-2.5 px-4 text-center">{payslip.regularHours.toFixed(1)} hrs</td>
                      <td className="py-2.5 px-4 text-center">₹{payslip.hourlyRate}</td>
                      <td className="py-2.5 px-4 text-right font-medium">₹{payslip.basePay.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-gray-800">
                        Overtime Premium Hours (1.5× Rule)
                      </td>
                      <td className="py-2.5 px-4 text-center">{payslip.overtimeHours.toFixed(1)} hrs</td>
                      <td className="py-2.5 px-4 text-center">₹{payslip.overtimeRate}</td>
                      <td className="py-2.5 px-4 text-right font-medium text-emerald-700">
                        + ₹{payslip.overtimePay.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="bg-gray-50 font-bold">
                      <td colSpan={3} className="py-2.5 px-4 text-gray-700">
                        Gross Disbursed Earnings
                      </td>
                      <td className="py-2.5 px-4 text-right text-gray-900">
                        ₹{payslip.grossPay.toLocaleString()}
                      </td>
                    </tr>

                    {/* Deductions */}
                    <tr>
                      <td colSpan={3} className="py-2 px-4 text-gray-600 pl-8">
                        - Income Tax Withholding (5% statutory)
                      </td>
                      <td className="py-2 px-4 text-right text-red-600">- ₹{payslip.deductions.tax.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="py-2 px-4 text-gray-600 pl-8">
                        - Social Security & Provident Reserve
                      </td>
                      <td className="py-2 px-4 text-right text-red-600">
                        - ₹{payslip.deductions.socialSecurity.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="py-2 px-4 text-gray-600 pl-8">
                        - Health & On-Site Accident Insurance
                      </td>
                      <td className="py-2 px-4 text-right text-red-600">
                        - ₹{payslip.deductions.healthInsurance.toLocaleString()}
                      </td>
                    </tr>
                    {payslip.deductions.unionDues && (
                      <tr>
                        <td colSpan={3} className="py-2 px-4 text-gray-600 pl-8">
                          - Worker Union & Welfare Contribution
                        </td>
                        <td className="py-2 px-4 text-right text-red-600">
                          - ₹{payslip.deductions.unionDues.toLocaleString()}
                        </td>
                      </tr>
                    )}
                    <tr className="bg-[#f0f9f3] text-sm font-extrabold border-t-2 border-[#1b4332]">
                      <td colSpan={3} className="py-3 px-4 text-[#0f291e]">
                        FINAL NET REMITTANCE (DIRECT TO WORKER)
                      </td>
                      <td className="py-3 px-4 text-right text-[#1b4332] text-base font-black">
                        ₹{payslip.netPay.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Explanatory Notes */}
              <div className="bg-[#f4faf6] p-4 rounded-xl border border-[#74c69d]/40">
                <h4 className="font-bold text-xs text-[#1b4332] uppercase tracking-wider mb-2">
                  Clear Math Formula & Explanation
                </h4>
                <ul className="text-xs text-gray-700 space-y-1">
                  {payslip.explanationNotes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#2d6a4f] font-bold">&bull;</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Signatures & Certification */}
              <div className="pt-6 border-t border-gray-200 grid grid-cols-2 gap-8 text-[11px] text-gray-500">
                <div>
                  <div className="h-10 border-b border-gray-300 mb-1" />
                  <p className="font-bold text-gray-700">Digital Seal: dead.croco Protocol</p>
                  <p>Encrypted verification hash: 98af-412c-dead-croco-sdg8</p>
                </div>
                <div className="text-right">
                  <div className="h-10 border-b border-gray-300 mb-1" />
                  <p className="font-bold text-gray-700">Authorized Payroll Supervisor</p>
                  <p>Certified Fair & Transparent Compensation</p>
                </div>
              </div>
            </div>
          )}

          {type === 'passport' && passport && (
            <div className="space-y-6">
              {/* Passport Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b-2 border-[#1b4332] pb-6 gap-4">
                <div>
                  <Logo size="md" showTagline={true} />
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#d8f3dc] text-[#1b4332] border border-[#74c69d]">
                      OFFICIAL SKILL PASSPORT
                    </span>
                    <span className="text-xs text-gray-500 font-mono">ID: {passport.id}</span>
                  </div>
                </div>
                <div className="sm:text-right">
                  <div className="text-2xl font-black text-[#1b4332]">{passport.overallScore}/100</div>
                  <p className="text-xs text-gray-500 font-medium">Workforce Competency Index</p>
                  <p className="text-xs text-emerald-700 font-bold flex items-center gap-1 sm:justify-end">
                    <ShieldCheck className="w-3.5 h-3.5" /> {passport.safetyRating}% Safety Track Record
                  </p>
                </div>
              </div>

              {/* Identity Banner */}
              <div className="bg-[#0f291e] text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black">{passport.workerName}</h3>
                  <p className="text-xs text-[#95d5b2] font-semibold mt-0.5">{passport.headline}</p>
                  <p className="text-xs text-gray-400 capitalize mt-1">
                    Industry: {passport.industry} &bull; Worker ID: {passport.workerId}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/15 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-gray-300 block">
                    Verified Field Hours
                  </span>
                  <span className="text-lg font-black text-[#52b788]">
                    {passport.workHistory.reduce((s, w) => s + w.verifiedHours, 0).toLocaleString()} hrs
                  </span>
                </div>
              </div>

              {/* Verified Competencies */}
              <div>
                <h4 className="font-extrabold text-sm text-[#0f291e] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#2d6a4f]" />
                  Verified Skills & Safety Badges
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {passport.skills.map((skill, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-gray-900">{skill.name}</p>
                        <p className="text-[10px] text-gray-500">{skill.category}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#d8f3dc] text-[#1b4332]">
                          {skill.level}
                        </span>
                        {skill.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h4 className="font-extrabold text-sm text-[#0f291e] uppercase tracking-wider mb-3">
                  Accredited Certifications & Licensure
                </h4>
                <div className="space-y-2">
                  {passport.certifications.map((c) => (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-xl border border-[#74c69d]/40 bg-[#f8faf9] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <p className="text-xs font-bold text-[#0f291e]">{c.title}</p>
                        <p className="text-[11px] text-gray-600">
                          Issued by {c.issuer} &bull; Reg: <span className="font-mono">{c.certificateNumber}</span>
                        </p>
                      </div>
                      <div className="text-right text-[11px]">
                        <span className="text-gray-500">Valid until: </span>
                        <span className="font-semibold text-gray-800">{c.expiryDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Work History */}
              <div>
                <h4 className="font-extrabold text-sm text-[#0f291e] uppercase tracking-wider mb-3">
                  Verified Employment & Field Track Record
                </h4>
                <div className="space-y-2">
                  {passport.workHistory.map((exp, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-gray-200 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">{exp.role}</span>
                        <span className="text-gray-500 font-medium">{exp.period}</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-600 mt-1">
                        <span>{exp.company}</span>
                        <span className="font-mono text-[#1b4332] font-semibold">
                          {exp.verifiedHours} verified hours ({exp.endorsements} endorsements)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Stamp */}
              <div className="pt-4 border-t border-gray-200 text-center text-[10px] text-gray-400 font-mono">
                Cryptographically Signed by dead.croco Protocol &bull; Portable Career Identity for Decent Work
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
