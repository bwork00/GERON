import React, { useState } from 'react';
import { Header } from '../common/Header';
import { Sidebar } from '../common/Sidebar';
import { ToastContainer } from '../common/ToastContainer';
import { AdminDashboardModal } from '../admin/AdminDashboardModal';
import { useTraining } from '../../context/TrainingContext';

import { Screen1Welcome } from '../screens/Screen1Welcome';
import { Screen2About } from '../screens/Screen2About';
import { Screen3Programs } from '../screens/Screen3Programs';
import { Screen4Videos } from '../screens/Screen4Videos';
import { Screen5Script } from '../screens/Screen5Script';
import { Screen6Calls } from '../screens/Screen6Calls';
import { Screen7Practice } from '../screens/Screen7Practice';

export const AppLayout: React.FC = () => {
  const { currentStep } = useTraining();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  const renderActiveScreen = () => {
    switch (currentStep) {
      case 1:
        return <Screen1Welcome />;
      case 2:
        return <Screen2About />;
      case 3:
        return <Screen3Programs />;
      case 4:
        return <Screen4Videos />;
      case 5:
        return <Screen5Script />;
      case 6:
        return <Screen6Calls />;
      case 7:
        return <Screen7Practice />;
      default:
        return <Screen1Welcome />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="main-content-wrapper" style={{ marginLeft: 0 }}>
        <Header
          onOpenAdmin={() => setAdminModalOpen(true)}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main style={{ flex: 1, minHeight: 'calc(100vh - 72px - 64px)' }}>
          <div className="page-container">
            {renderActiveScreen()}
          </div>
        </main>

        {/* Global Footer */}
        <footer
          style={{
            borderTop: '1px solid #e2e8f0',
            background: '#ffffff',
            padding: '24px 28px',
            textAlign: 'center',
            fontSize: '0.8125rem',
            color: '#64748b',
          }}
        >
          <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 700, color: '#7c3aed' }}>GERON</span>
              <span>— Школа программирования и современных IT-технологий</span>
            </div>
            <div>
              Второй этап отбора менеджеров по продажам © 2026
            </div>
          </div>
        </footer>
      </div>

      {/* Admin Mentor Dashboard Modal */}
      <AdminDashboardModal isOpen={adminModalOpen} onClose={() => setAdminModalOpen(false)} />
      <ToastContainer />

      <style>{`
        @media (min-width: 1024px) {
          .main-content-wrapper {
            margin-left: 300px !important;
          }
        }
      `}</style>
    </div>
  );
};
