import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { contentApi } from '../../api/contentApi';
import { PracticeData } from '../../types';
import { useTraining } from '../../context/TrainingContext';
import {
  CheckSquare,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Calendar,
  Award,
  PartyPopper,
} from 'lucide-react';

import { defaultPractice } from '../../data/mockContent';

export const Screen7Practice: React.FC = () => {
  const { prevStep, checklist, toggleChecklistItem, completedChecklistCount, completeStage, isStageCompleted } = useTraining();

  const [data, setData] = useState<PracticeData>(defaultPractice);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await contentApi.getPractice();
        if (res) setData(res);
      } catch (err) {
        console.error('Error loading practice screen:', err);
      }
    };
    load();
  }, []);

  const handleFinishTraining = async () => {
    setIsSubmitting(true);
    const ok = await completeStage();
    setIsSubmitting(false);

    if (ok) {
      setShowCelebration(true);
      // Trigger confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#7c3aed', '#a855f7', '#10b981', '#3b82f6', '#f59e0b'],
      });
    }
  };

  const isAllChecked = completedChecklistCount === 7;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
      {/* Header */}
      <div>
        <span className="badge badge-purple" style={{ marginBottom: 12 }}>
          Этап 7 • Финал подготовки и встреча в офисе
        </span>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
          {data.title}
        </h2>
        <p style={{ fontSize: '1rem', color: '#64748b' }}>
          Подведение итогов 2-го этапа отбора и подтверждение готовности к практике
        </p>
      </div>

      {/* Description Card */}
      <div
        className="card"
        style={{
          padding: 32,
          borderRadius: 20,
          border: '1.5px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          color: '#334155',
          fontSize: '0.9375rem',
          lineHeight: 1.7,
        }}
      >
        {data.description.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>

      {/* Interactive 7-point Checklist */}
      <div
        className="card card-purple-subtle"
        style={{
          padding: 36,
          borderRadius: 20,
          border: '2px solid #ddd6fe',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckSquare size={24} color="#7c3aed" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              {data.checklistTitle}
            </h3>
          </div>

          <div
            style={{
              background: isAllChecked ? '#ecfdf5' : '#ffffff',
              border: `1.5px solid ${isAllChecked ? '#a7f3d0' : '#ddd6fe'}`,
              color: isAllChecked ? '#059669' : '#7c3aed',
              padding: '6px 16px',
              borderRadius: 9999,
              fontWeight: 700,
              fontSize: '0.875rem',
            }}
          >
            Отмечено: {completedChecklistCount} из 7
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ width: '100%', height: 10, background: '#e9d5ff', borderRadius: 5, overflow: 'hidden', marginBottom: 24 }}>
          <div
            style={{
              width: `${(completedChecklistCount / 7) * 100}%`,
              height: '100%',
              background: isAllChecked ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' : 'linear-gradient(90deg, #7c3aed 0%, #a855f7 100%)',
              transition: 'all 300ms ease',
            }}
          />
        </div>

        {/* 7 Interactive items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {data.checklistItems.map((item) => {
            const isChecked = checklist[item.id] === true;

            return (
              <div
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '16px 20px',
                  borderRadius: 14,
                  background: isChecked ? '#f5f3ff' : '#ffffff',
                  border: isChecked ? '1.5px solid #a78bfa' : '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  boxShadow: isChecked ? '0 4px 12px rgba(124, 58, 237, 0.08)' : 'none',
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 8,
                    border: isChecked ? '2px solid #7c3aed' : '2px solid #cbd5e1',
                    background: isChecked ? '#7c3aed' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0,
                    transition: 'all 150ms ease',
                  }}
                >
                  {isChecked && <CheckCircle2 size={18} />}
                </div>

                <span
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: isChecked ? 600 : 500,
                    color: isChecked ? '#5b21b6' : '#1e293b',
                    textDecoration: isChecked ? 'line-through' : 'none',
                    opacity: isChecked ? 0.85 : 1,
                  }}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Completion Action */}
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          {isStageCompleted ? (
            <div
              style={{
                background: '#ecfdf5',
                border: '1.5px solid #a7f3d0',
                borderRadius: 16,
                padding: '24px',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#059669', fontSize: '1.1875rem', fontWeight: 800 }}>
                <CheckCircle2 size={24} />
                <span>2-й этап отбора успешно завершён!</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#047857' }}>
                Ваша готовность зафиксирована в системе. Наставник свяжется с вами для согласования даты встречи в офисе.
              </p>
            </div>
          ) : (
            <button
              onClick={handleFinishTraining}
              disabled={isSubmitting}
              className="btn btn-primary btn-lg pulse-glow"
              style={{ padding: '16px 36px', fontSize: '1.125rem' }}
            >
              <Sparkles size={20} />
              <span>{isSubmitting ? 'Сохранение результата...' : 'Завершить 2-й этап и подтвердить готовность'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Office Next Steps Card */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 20,
          padding: 32,
        }}
      >
        <h3 style={{ fontSize: '1.1875rem', fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>
          Что будет происходить на очной встрече:
        </h3>
        <div className="grid-3">
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <MapPin size={22} color="#7c3aed" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem' }}>Офис GERON</div>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: 4 }}>
                г. Павлодар. Уютное рабочее пространство с наставником.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Calendar size={22} color="#7c3aed" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem' }}>Дата и время</div>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: 4 }}>
                Индивидуальное согласование с руководителем отдела продаж.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Award size={22} color="#7c3aed" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem' }}>Практика</div>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: 4 }}>
                Пробные звонки реальным клиентам с поддержкой наставника.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <button onClick={prevStep} className="btn btn-outline">
          <ArrowLeft size={16} />
          <span>6. Реальные звонки</span>
        </button>
      </div>

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="modal-overlay" onClick={() => setShowCelebration(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 520, textAlign: 'center', padding: '36px 32px' }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
              }}
            >
              <PartyPopper size={36} />
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
              Поздравляем с успешным завершением!
            </h3>

            <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.6, marginBottom: 24 }}>
              Вы изучили ключевые принципы школы GERON, познакомились с программами, скриптом и реальными звонками. Теперь вы готовы проявить себя на практике!
            </p>

            <button
              onClick={() => setShowCelebration(false)}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Отлично, жду встречи в офисе!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
