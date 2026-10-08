import React from 'react';
import { useTraining } from '../../context/TrainingContext';
import { ShieldCheck, Menu, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onOpenAdmin: () => void;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAdmin,
  onToggleSidebar,
}) => {
  const { adminUser } = useAuth();
  const { completedChecklistCount, isStageCompleted } = useTraining();

  return (
    <header
      style={{
        height: 72,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.03)',
      }}
    >
      {/* Left side: Hamburger & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={onToggleSidebar}
          className="btn-ghost"
          style={{
            padding: 8,
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: '#475569',
          }}
          title="Открыть меню"
        >
          <Menu size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src="/images/geron-logo.png"
            alt="GERON"
            style={{ height: 38, objectFit: 'contain' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/geron-logo.jpg';
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                GERON
              </span>
              <span className="badge badge-purple" style={{ fontSize: '0.6875rem' }}>
                Этап 2: Знакомство
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Отбор менеджеров по продажам
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Progress badge & Mentor Access */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Progress chip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: isStageCompleted ? '#ecfdf5' : '#faf5ff',
            border: `1px solid ${isStageCompleted ? '#a7f3d0' : '#ddd6fe'}`,
            padding: '7px 14px',
            borderRadius: 9999,
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: isStageCompleted ? '#059669' : '#7c3aed',
          }}
        >
          <CheckCircle2 size={16} />
          <span>Готовность: {completedChecklistCount}/7</span>
        </div>

        {/* Mentor / Admin Access */}
        <button
          onClick={onOpenAdmin}
          className={adminUser ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
          style={
            adminUser
              ? { background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }
              : { borderColor: '#ddd6fe', color: '#7c3aed' }
          }
        >
          <ShieldCheck size={16} />
          <span style={{ fontWeight: 600 }}>{adminUser ? 'Панель наставника' : 'Наставник'}</span>
        </button>
      </div>
    </header>
  );
};
