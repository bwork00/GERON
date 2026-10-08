import React from 'react';
import { useTraining } from '../../context/TrainingContext';
import {
  Sparkles,
  Building2,
  GraduationCap,
  Video,
  FileText,
  Headphones,
  CheckCircle2,
  Download,
  BookOpen,
  X,
  ExternalLink,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEP_ICONS = [
  Sparkles,
  Building2,
  GraduationCap,
  Video,
  FileText,
  Headphones,
  CheckCircle2,
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentStep, setCurrentStep, overview, checklist, completedChecklistCount } = useTraining();

  const navItems = overview?.navigation || [
    { id: 'welcome', label: '1. Добро пожаловать', step: 1 },
    { id: 'about', label: '2. О школе GERON', step: 2 },
    { id: 'programs', label: '3. Образовательные программы', step: 3 },
    { id: 'videos', label: '4. Видеообучение', step: 4 },
    { id: 'script', label: '5. Скрипт продаж', step: 5 },
    { id: 'calls', label: '6. Реальные звонки', step: 6 },
    { id: 'practice', label: '7. Практический этап', step: 7 },
  ];

  const progressPercentage = Math.round((completedChecklistCount / 7) * 100);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(2px)',
            zIndex: 900,
          }}
          className="mobile-backdrop"
        />
      )}

      <aside
        style={{
          width: 300,
          background: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 950,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isOpen ? '4px 0 24px rgba(0, 0, 0, 0.08)' : 'none',
        }}
        className="app-sidebar"
      >
        {/* Sidebar Header */}
        <div
          style={{
            height: 72,
            padding: '0 24px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1rem',
              }}
            >
              G
            </div>
            <div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>
                План знакомства
              </h3>
              <p style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>
                7 этапов подготовки
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: 6,
            }}
            className="mobile-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Steps Navigation List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {navItems.map((item, idx) => {
              const isActive = currentStep === item.step;
              const isChecked = checklist[idx] === true;
              const Icon = STEP_ICONS[idx] || Sparkles;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentStep(item.step);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 12,
                    border: 'none',
                    background: isActive ? '#f5f3ff' : 'transparent',
                    color: isActive ? '#7c3aed' : '#334155',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    textAlign: 'left',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.875rem',
                    borderLeft: isActive ? '3.5px solid #7c3aed' : '3.5px solid transparent',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <div
                      style={{
                        color: isActive ? '#7c3aed' : isChecked ? '#10b981' : '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <span
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.label}
                    </span>
                  </div>

                  {isChecked && (
                    <div style={{ color: '#10b981', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer: Progress & PDF & Swagger */}
        <div
          style={{
            padding: 20,
            borderTop: '1px solid #f1f5f9',
            background: '#faf5ff',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {/* Progress Card */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6d28d9' }}>
                Готовность к встрече
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7c3aed' }}>
                {progressPercentage}%
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: 8,
                background: '#e9d5ff',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progressPercentage}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #7c3aed 0%, #10b981 100%)',
                  borderRadius: 4,
                  transition: 'width 300ms ease',
                }}
              />
            </div>
          </div>

          {/* Action Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <a
              href="/api/v1/media/script-pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'flex-start' }}
            >
              <Download size={15} />
              <span>Скачать скрипт (PDF)</span>
            </a>

            <a
              href="http://localhost:5000/api-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm"
              style={{ width: '100%', justifyContent: 'flex-start', color: '#64748b' }}
            >
              <ExternalLink size={14} />
              <span>Swagger API Docs</span>
            </a>
          </div>
        </div>
      </aside>

      <style>{`
        @media (min-width: 1024px) {
          .app-sidebar {
            transform: translateX(0) !important;
            box-shadow: none !important;
          }
          .mobile-close-btn,
          .mobile-backdrop {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};
