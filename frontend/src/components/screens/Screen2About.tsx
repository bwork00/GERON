import React, { useEffect, useState } from 'react';
import { contentApi } from '../../api/contentApi';
import { AboutData } from '../../types';
import { useTraining } from '../../context/TrainingContext';
import {
  Brain,
  Palette,
  UserCheck,
  Monitor,
  Sparkles,
  Rocket,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  brain: Brain,
  palette: Palette,
  'user-check': UserCheck,
  monitor: Monitor,
  sparkles: Sparkles,
  rocket: Rocket,
};

export const Screen2About: React.FC = () => {
  const { nextStep, prevStep } = useTraining();
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await contentApi.getAbout();
        setData(res);
      } catch (err) {
        console.error('Error loading about screen:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
        Загрузка информации о школе...
      </div>
    );
  }

  if (!data) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Title & Mission Card */}
      <div
        className="card card-purple-subtle"
        style={{
          borderLeft: '6px solid #7c3aed',
          padding: '36px 32px',
        }}
      >
        <span className="badge badge-purple" style={{ marginBottom: 12 }}>
          Этап 2 • О Школе GERON
        </span>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>
          {data.title}
        </h2>
        <p
          style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#6d28d9',
            lineHeight: 1.5,
            maxWidth: 900,
          }}
        >
          «{data.heroText}»
        </p>
      </div>

      {/* Description text */}
      <div className="card">
        <h3 style={{ fontSize: '1.1875rem', fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>
          Миссия и ценности GERON в Павлодаре
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, color: '#334155', fontSize: '0.9375rem', lineHeight: 1.7 }}>
          {data.description.map((text, idx) => (
            <p key={idx}>{text}</p>
          ))}
        </div>
      </div>

      {/* 6 Core Benefits for Parents */}
      <div>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
            {data.benefitsTitle}
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Эти ключевые аргументы помогут вам легко и убедительно вести диалог с родителями
          </p>
        </div>

        <div className="grid-3">
          {data.benefits.map((benefit) => {
            const Icon = ICON_MAP[benefit.icon] || Sparkles;
            return (
              <div
                key={benefit.id}
                className="card card-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  padding: 24,
                  borderRadius: 16,
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: '#f5f3ff',
                    color: '#7c3aed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={22} />
                </div>
                <h4 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a' }}>
                  {benefit.title}
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5 }}>
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Conclusion Highlight */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
          border: '1.5px solid #c4b5fd',
          borderRadius: 18,
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: '#7c3aed',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Lightbulb size={24} />
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase' }}>
            Главный ориентир менеджера
          </span>
          <p style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#4c1d95', marginTop: 2 }}>
            {data.keyConclusion}
          </p>
        </div>
      </div>

      {/* Bottom Step Nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16 }}>
        <button onClick={prevStep} className="btn btn-outline">
          <ArrowLeft size={16} />
          <span>1. Приветствие</span>
        </button>
        <button onClick={nextStep} className="btn btn-primary">
          <span>3. Образовательные программы</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
