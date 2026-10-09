import React, { useEffect, useState } from 'react';
import { contentApi } from '../../api/contentApi';
import { WelcomeData } from '../../types';
import { useTraining } from '../../context/TrainingContext';
import { Sparkles, ArrowRight, CheckCircle2, Award, Target, Compass, BookOpen } from 'lucide-react';

import { defaultWelcome } from '../../data/mockContent';

export const Screen1Welcome: React.FC = () => {
  const { nextStep } = useTraining();
  const [data, setData] = useState<WelcomeData>(defaultWelcome);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await contentApi.getWelcome();
        if (res) setData(res);
      } catch (err) {
        console.error('Error loading welcome screen:', err);
      }
    };
    load();
  }, []);

  const currentData = data || defaultWelcome;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Hero Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #581c87 100%)',
          color: '#ffffff',
          borderRadius: 24,
          padding: '40px 36px',
          boxShadow: '0 20px 35px -10px rgba(124, 58, 237, 0.4)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255, 255, 255, 0.18)', padding: '6px 14px', borderRadius: 9999, fontSize: '0.8125rem', fontWeight: 600, marginBottom: 16 }}>
          <Sparkles size={16} />
          <span>Школа программирования GERON</span>
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.25, marginBottom: 16, maxWidth: 840 }}>
          {data.header}
        </h1>

        <p style={{ fontSize: '1.0625rem', color: '#e9d5ff', maxWidth: 720, lineHeight: 1.6 }}>
          Добро пожаловать в команду будущих экспертов продаж образовательных технологий!
        </p>
      </div>

      {/* Director Profile & Greeting Block */}
      <div className="grid-2" style={{ alignItems: 'stretch' }}>
        {/* Left: Director Card */}
        <div
          className="card card-purple-subtle"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: 36,
          }}
        >
          <div
            style={{
              position: 'relative',
              marginBottom: 20,
            }}
          >
            <img
              src="/images/director_olesya.jpg"
              alt={data.director.name}
              style={{
                width: 140,
                height: 140,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid #ffffff',
                boxShadow: '0 10px 25px rgba(124, 58, 237, 0.25)',
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/director_olesya.jpg';
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 4,
                right: 4,
                background: '#10b981',
                width: 22,
                height: 22,
                borderRadius: '50%',
                border: '3px solid #ffffff',
              }}
              title="Директор школы"
            />
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            {data.director.name}
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#7c3aed', fontWeight: 600, marginTop: 4 }}>
            {data.director.title}
          </p>

          <div
            style={{
              marginTop: 24,
              padding: '16px 20px',
              background: '#ffffff',
              borderRadius: 14,
              border: '1px solid #e9d5ff',
              width: '100%',
              fontSize: '0.875rem',
              color: '#475569',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Award size={18} color="#7c3aed" />
              <span>Школа IT-компетенций №1 в регионе</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Compass size={18} color="#7c3aed" />
              <span>Обучение детей от 7 лет и взрослых</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Target size={18} color="#7c3aed" />
              <span>Фокус на создании проектов, а не игр</span>
            </div>
          </div>
        </div>

        {/* Right: Personal Message from Director */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 36 }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>
              {data.greeting}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, color: '#334155', fontSize: '0.9375rem', lineHeight: 1.65 }}>
              {data.body.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
            <button
              onClick={nextStep}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              <span>{data.ctaButtonText}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Stage 2 Roadmap Summary */}
      <div className="card">
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <BookOpen size={20} color="#7c3aed" />
          <span>Что ждет вас на этом обучающем этапе:</span>
        </h3>

        <div className="grid-3">
          <div style={{ background: '#faf5ff', border: '1px solid #ede9fe', borderRadius: 12, padding: 18 }}>
            <div style={{ fontWeight: 700, color: '#7c3aed', marginBottom: 6 }}>1. Понимание ценности</div>
            <p style={{ fontSize: '0.8125rem', color: '#475569' }}>
              Разберитесь, почему родители выбирают GERON и какую долгосрочную пользу получают дети.
            </p>
          </div>

          <div style={{ background: '#faf5ff', border: '1px solid #ede9fe', borderRadius: 12, padding: 18 }}>
            <div style={{ fontWeight: 700, color: '#7c3aed', marginBottom: 6 }}>2. Знание курсов</div>
            <p style={{ fontSize: '0.8125rem', color: '#475569' }}>
              Изучите линейку образовательных программ для детей от 7 лет и взрослых.
            </p>
          </div>

          <div style={{ background: '#faf5ff', border: '1px solid #ede9fe', borderRadius: 12, padding: 18 }}>
            <div style={{ fontWeight: 700, color: '#7c3aed', marginBottom: 6 }}>3. Практические звонки</div>
            <p style={{ fontSize: '0.8125rem', color: '#475569' }}>
              Послушайте реальные аудиозаписи общения с клиентами и примеры преодоления возражений.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
