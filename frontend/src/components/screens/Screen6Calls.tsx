import React, { useEffect, useState } from 'react';
import { contentApi } from '../../api/contentApi';
import { CallsData } from '../../types';
import { useTraining } from '../../context/TrainingContext';
import { AudioPlayer } from '../common/AudioPlayer';
import {
  Headphones,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

export const Screen6Calls: React.FC = () => {
  const { nextStep, prevStep } = useTraining();
  const [data, setData] = useState<CallsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await contentApi.getCalls();
        setData(res);
      } catch (err) {
        console.error('Error loading call samples:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
        Загрузка записей звонков...
      </div>
    );
  }

  if (!data) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
      {/* Header */}
      <div>
        <span className="badge badge-purple" style={{ marginBottom: 12 }}>
          Этап 6 • Реальные телефонные разговоры
        </span>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
          {data.title}
        </h2>
        <p style={{ fontSize: '1rem', color: '#64748b' }}>
          Практический слуховой опыт: живые записи общения менеджера с родителями
        </p>
      </div>

      {/* Mentor Advice Card */}
      <div
        className="card card-purple-subtle"
        style={{
          padding: 32,
          borderRadius: 20,
          border: '1.5px solid #ddd6fe',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img
            src="/images/sales_mentor.jpg"
            alt="Наставник"
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #ffffff',
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.2)',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/mira.jpg';
            }}
          />
          <div>
            <h3 style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#0f172a' }}>
              {data.mentor.title}
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#7c3aed', fontWeight: 600 }}>
              Школа программирования GERON
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, color: '#334155', fontSize: '0.9375rem', lineHeight: 1.6 }}>
          {data.mentor.introText.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </div>

      {/* Reflection Questions Box */}
      <div
        style={{
          background: '#ffffff',
          border: '1.5px solid #e2e8f0',
          borderRadius: 16,
          padding: '24px 28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <HelpCircle size={20} color="#7c3aed" />
          <h4 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a' }}>
            Вопросы для самоанализа во время прослушивания:
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {data.reflectionQuestions.map((q, idx) => (
            <div
              key={idx}
              style={{
                background: '#faf5ff',
                border: '1px solid #ede9fe',
                borderRadius: 10,
                padding: '10px 16px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#4c1d95',
              }}
            >
              {q}
            </div>
          ))}
        </div>
      </div>

      {/* 5 Audio Calls List */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <Headphones size={22} color="#7c3aed" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Аудиозаписи звонков ({data.calls.length})
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {data.calls.map((call) => (
            <div key={call.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {call.description && (
                <p style={{ fontSize: '0.8125rem', color: '#64748b', marginLeft: 4 }}>
                  {call.description}
                </p>
              )}
              <AudioPlayer
                id={call.id}
                title={call.title}
                streamUrl={call.streamUrl}
                durationSeconds={call.durationSeconds}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={prevStep} className="btn btn-outline">
          <ArrowLeft size={16} />
          <span>5. Скрипт продаж</span>
        </button>
        <button onClick={nextStep} className="btn btn-primary">
          <span>7. Практический этап</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
