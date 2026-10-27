/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDeadCrocoStore } from './utils/storage';
import { Language, User } from './types';
import { Navbar } from './components/navigation/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { WorkerDashboard } from './components/worker/WorkerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'worker' | 'admin'>('landing');
  const [language, setLanguage] = useState<Language>('en');

  const {
    state,
    setCurrentUser,
    checkIn,
    checkOut,
    submitComplaint,
    updateComplaintStatus,
    submitFeedback,
    acknowledgeFeedback,
    updatePassport,
    createShift,
    resetToDemo,
  } = useDeadCrocoStore();

  const handleUserSelect = (user: User) => {
    setCurrentUser(user);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf8] text-[#0f291e]">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        language={language}
        onLanguageChange={setLanguage}
        currentUser={state.currentUser}
        onUserSelect={handleUserSelect}
        allUsers={state.users}
        onResetDemo={resetToDemo}
      />

      {/* Main Content View */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onNavigate={setCurrentView}
            language={language}
            onUserSelect={handleUserSelect}
            allUsers={state.users}
            currentUser={state.currentUser}
          />
        )}

        {currentView === 'worker' && (
          <WorkerDashboard
            currentUser={state.currentUser}
            attendance={state.attendance}
            payslips={state.payslips}
            complaints={state.complaints}
            skillPassport={state.skillPassports[state.currentUser.id]}
            notifications={state.notifications}
            onCheckIn={checkIn}
            onCheckOut={checkOut}
            onSubmitComplaint={submitComplaint}
            onSubmitFeedback={submitFeedback}
            onUpdatePassport={updatePassport}
            language={language}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            currentUser={state.currentUser}
            allUsers={state.users}
            attendance={state.attendance}
            complaints={state.complaints}
            feedback={state.feedback}
            shifts={state.shifts}
            onUpdateComplaintStatus={updateComplaintStatus}
            onAcknowledgeFeedback={acknowledgeFeedback}
            onCreateShift={createShift}
          />
        )}
      </main>
    </div>
  );
}
