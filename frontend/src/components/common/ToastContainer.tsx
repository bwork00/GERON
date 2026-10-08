import React from 'react';
import { useTraining } from '../../context/TrainingContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useTraining();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        maxWidth: 400,
        width: 'calc(100% - 48px)',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => {
        let bg = '#ffffff';
        let borderColor = '#e2e8f0';
        let icon = <Info size={20} color="#7c3aed" />;

        if (toast.type === 'success') {
          borderColor = '#a7f3d0';
          icon = <CheckCircle2 size={20} color="#10b981" />;
        } else if (toast.type === 'error') {
          borderColor = '#fecaca';
          icon = <AlertCircle size={20} color="#ef4444" />;
        }

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              background: bg,
              borderRadius: 12,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              border: `1.5px solid ${borderColor}`,
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
              animation: 'slideUp 200ms ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {icon}
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#0f172a' }}>
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
