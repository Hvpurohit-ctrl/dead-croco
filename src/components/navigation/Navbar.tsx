import React, { useState } from 'react';
import { Logo } from '../brand/Logo';
import { Language, User } from '../../types';
import { translations, speakText } from '../../utils/i18n';
import {
  Globe,
  UserCheck,
  Shield,
  Menu,
  X,
  Volume2,
  HardHat,
  GraduationCap,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'worker' | 'admin';
  onNavigate: (view: 'landing' | 'worker' | 'admin') => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser: User;
  onUserSelect: (user: User) => void;
  allUsers: User[];
  onResetDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  language,
  onLanguageChange,
  currentUser,
  onUserSelect,
  allUsers,
  onResetDemo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const t = translations[language];

  const handleVoiceListen = () => {
    const textToSpeak = `${t.appName}. ${t.tagline}. ${t.heroHeadline}. ${t.heroSubheadline}`;
    speakText(textToSpeak, language);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#d8f3dc] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => {
              onNavigate('landing');
              setMobileMenuOpen(false);
            }}
            className="flex items-center text-left focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] rounded-lg p-1"
            aria-label="dead.croco home"
          >
            <Logo size="md" showTagline={true} />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentView === 'landing'
                  ? 'text-[#1b4332] bg-[#d8f3dc]/60 font-bold'
                  : 'text-[#2d4a3e] hover:text-[#1b4332] hover:bg-[#eefaf1]'
              }`}
            >
              {t.navHome}
            </button>

            <a
              href="#features"
              onClick={(e) => {
                if (currentView !== 'landing') {
                  e.preventDefault();
                  onNavigate('landing');
                  setTimeout(() => {
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-[#2d4a3e] hover:text-[#1b4332] hover:bg-[#eefaf1] transition-colors"
            >
              {t.navFeatures}
            </a>

            <a
              href="#industries"
              onClick={(e) => {
                if (currentView !== 'landing') {
                  e.preventDefault();
                  onNavigate('landing');
                  setTimeout(() => {
                    document.getElementById('industries')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-[#2d4a3e] hover:text-[#1b4332] hover:bg-[#eefaf1] transition-colors"
            >
              {t.navIndustries}
            </a>

            <a
              href="#impact"
              onClick={(e) => {
                if (currentView !== 'landing') {
                  e.preventDefault();
                  onNavigate('landing');
                  setTimeout(() => {
                    document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-[#2d4a3e] hover:text-[#1b4332] hover:bg-[#eefaf1] transition-colors"
            >
              {t.navAbout}
            </a>

            <div className="h-5 w-px bg-[#d8f3dc] mx-1" />

            {/* Portal Switchers */}
            <button
              onClick={() => onNavigate('worker')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
                currentView === 'worker'
                  ? 'bg-[#1b4332] text-white shadow-sm'
                  : 'text-[#1b4332] bg-[#d8f3dc]/50 hover:bg-[#d8f3dc] border border-[#74c69d]/40'
              }`}
            >
              <HardHat className="w-4 h-4 text-[#52b788]" />
              <span>{t.navWorkerPortal}</span>
            </button>

            <button
              onClick={() => onNavigate('admin')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
                currentView === 'admin'
                  ? 'bg-[#1b4332] text-white shadow-sm'
                  : 'text-[#1b4332] bg-[#d8f3dc]/50 hover:bg-[#d8f3dc] border border-[#74c69d]/40'
              }`}
            >
              <Shield className="w-4 h-4 text-[#2d6a4f]" />
              <span>{t.navAdminPortal}</span>
            </button>
          </nav>

          {/* Right Action Tools: Language, Accessibility Voice, Role Demo Switcher */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Audio Read-Aloud */}
            <button
              onClick={handleVoiceListen}
              title="Listen aloud (Text-to-speech accessibility)"
              aria-label="Text to speech accessibility"
              className="p-2 rounded-lg text-[#1b4332] hover:bg-[#d8f3dc] border border-[#74c69d]/40 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setRoleDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#1b4332] bg-[#f0f9f3] border border-[#74c69d]/40 hover:bg-[#d8f3dc] transition-colors"
                aria-label="Select language"
              >
                <Globe className="w-3.5 h-3.5 text-[#2d6a4f]" />
                <span>
                  {language === 'en' ? 'EN' : language === 'hi' ? 'हिन्दी' : 'தமிழ்'}
                </span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-[#74c69d]/40 py-1.5 z-50">
                  <button
                    onClick={() => {
                      onLanguageChange('en');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-[#f0f9f3] ${
                      language === 'en' ? 'text-[#1b4332] bg-[#d8f3dc]/50 font-bold' : 'text-[#2d4a3e]'
                    }`}
                  >
                    <span>English</span>
                    {language === 'en' && <span className="w-1.5 h-1.5 rounded-full bg-[#2d6a4f]" />}
                  </button>
                  <button
                    onClick={() => {
                      onLanguageChange('hi');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-[#f0f9f3] ${
                      language === 'hi' ? 'text-[#1b4332] bg-[#d8f3dc]/50 font-bold' : 'text-[#2d4a3e]'
                    }`}
                  >
                    <span>हिन्दी (Hindi)</span>
                    {language === 'hi' && <span className="w-1.5 h-1.5 rounded-full bg-[#2d6a4f]" />}
                  </button>
                  <button
                    onClick={() => {
                      onLanguageChange('ta');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-[#f0f9f3] ${
                      language === 'ta' ? 'text-[#1b4332] bg-[#d8f3dc]/50 font-bold' : 'text-[#2d4a3e]'
                    }`}
                  >
                    <span>தமிழ் (Tamil)</span>
                    {language === 'ta' && <span className="w-1.5 h-1.5 rounded-full bg-[#2d6a4f]" />}
                  </button>
                </div>
              )}
            </div>

            {/* Quick Demo Persona / User Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setRoleDropdownOpen(!roleDropdownOpen);
                  setLangDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#74c69d]/50 hover:border-[#2d6a4f] shadow-2xs transition-all text-left"
                aria-label="Switch active demo persona"
              >
                <div className="w-6 h-6 rounded-full bg-[#1b4332] text-white flex items-center justify-center text-[10px] font-bold overflow-hidden">
                  {currentUser.role === 'worker' ? (
                    currentUser.industry === 'construction' ? (
                      <HardHat className="w-3.5 h-3.5 text-[#95d5b2]" />
                    ) : (
                      <GraduationCap className="w-3.5 h-3.5 text-[#95d5b2]" />
                    )
                  ) : (
                    <Shield className="w-3.5 h-3.5 text-[#95d5b2]" />
                  )}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[#0f291e] leading-tight flex items-center gap-1">
                    <span>{currentUser.name}</span>
                    <span className="text-[10px] uppercase font-mono px-1 py-0.2 bg-[#d8f3dc] text-[#1b4332] rounded">
                      {currentUser.role}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#406856] leading-tight truncate max-w-[110px]">
                    {currentUser.industry === 'construction' ? 'Construction Site' : 'University Campus'}
                  </div>
                </div>
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#74c69d]/40 p-2 z-50">
                  <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#406856] border-b border-[#eefaf1] mb-1 flex items-center justify-between">
                    <span>Select Demo Account</span>
                    <span className="text-[10px] text-[#2d6a4f] lowercase">instant sync</span>
                  </div>

                  <div className="space-y-1">
                    {allUsers.map((u) => {
                      const isSelected = u.id === currentUser.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => {
                            onUserSelect(u);
                            setRoleDropdownOpen(false);
                            if (u.role === 'worker') {
                              onNavigate('worker');
                            } else {
                              onNavigate('admin');
                            }
                          }}
                          className={`w-full text-left p-2.5 rounded-xl transition-colors flex items-start gap-2.5 ${
                            isSelected
                              ? 'bg-[#d8f3dc]/70 border border-[#74c69d]'
                              : 'hover:bg-[#f0f9f3]'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#1b4332] text-white flex items-center justify-center shrink-0 font-bold text-xs">
                            {u.role === 'worker' ? (
                              u.industry === 'construction' ? (
                                <HardHat className="w-4 h-4 text-[#74c69d]" />
                              ) : (
                                <GraduationCap className="w-4 h-4 text-[#74c69d]" />
                              )
                            ) : (
                              <Shield className="w-4 h-4 text-[#74c69d]" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#0f291e] truncate">{u.name}</span>
                              <span className="text-[10px] uppercase font-mono px-1 rounded bg-[#eefaf1] text-[#1b4332]">
                                {u.role}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#406856] truncate">{u.roleTitle}</p>
                            <p className="text-[10px] text-[#52b788] font-medium capitalize">
                              {u.industry} &bull; {u.department}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#eefaf1] flex items-center justify-between px-2">
                    <button
                      onClick={() => {
                        onResetDemo();
                        setRoleDropdownOpen(false);
                      }}
                      className="text-[11px] text-red-600 hover:text-red-700 font-semibold"
                    >
                      Reset Demo Data
                    </button>
                    <span className="text-[10px] text-gray-400">Offline LocalStore</span>
                  </div>
                </div>
              )}
            </div>

            {/* CTA Button */}
            {currentView === 'landing' ? (
              <button
                onClick={() => onNavigate('worker')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1b4332] text-white hover:bg-[#0f291e] shadow-sm flex items-center gap-1.5 transition-all"
              >
                <span>{t.navGetStarted}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => onNavigate('landing')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#eefaf1] text-[#1b4332] border border-[#74c69d]/40 hover:bg-[#d8f3dc] transition-all"
              >
                Exit to Website
              </button>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => onLanguageChange(language === 'en' ? 'hi' : language === 'hi' ? 'ta' : 'en')}
              className="px-2.5 py-1 text-xs font-bold bg-[#f0f9f3] text-[#1b4332] border border-[#74c69d]/40 rounded-lg"
              aria-label="Toggle language"
            >
              {language.toUpperCase()}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#0f291e] hover:bg-[#eefaf1] focus:outline-none"
              aria-label="Toggle mobile navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#d8f3dc] bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="space-y-1">
            <button
              onClick={() => {
                onNavigate('landing');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-[#1b4332] hover:bg-[#eefaf1]"
            >
              {t.navHome}
            </button>
            <button
              onClick={() => {
                onNavigate('worker');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-[#1b4332] bg-[#d8f3dc]/40 flex items-center gap-2"
            >
              <HardHat className="w-4 h-4 text-[#2d6a4f]" />
              <span>{t.navWorkerPortal} (Check-in, Payslip, Safety)</span>
            </button>
            <button
              onClick={() => {
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-[#1b4332] bg-[#d8f3dc]/40 flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-[#2d6a4f]" />
              <span>{t.navAdminPortal} (Safety, Roster, Fatigue)</span>
            </button>
          </div>

          <div className="pt-3 border-t border-[#d8f3dc]">
            <p className="text-xs font-bold uppercase tracking-wider text-[#406856] mb-2">
              Active Persona: {currentUser.name} ({currentUser.role})
            </p>
            <div className="grid grid-cols-2 gap-2">
              {allUsers.slice(0, 4).map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    onUserSelect(u);
                    setMobileMenuOpen(false);
                    if (u.role === 'worker') onNavigate('worker');
                    else onNavigate('admin');
                  }}
                  className={`p-2 rounded-lg text-xs font-medium text-left border ${
                    u.id === currentUser.id
                      ? 'border-[#2d6a4f] bg-[#d8f3dc] font-bold text-[#1b4332]'
                      : 'border-gray-200 bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="truncate">{u.name}</div>
                  <div className="text-[10px] text-gray-500 uppercase">{u.role} &bull; {u.industry}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
