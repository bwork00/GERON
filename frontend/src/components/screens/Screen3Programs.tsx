import React, { useEffect, useState } from 'react';
import { contentApi } from '../../api/contentApi';
import { ProgramsData, ProgramItem } from '../../types';
import { useTraining } from '../../context/TrainingContext';
import {
  GraduationCap,
  Sparkles,
  HeartHandshake,
  Wrench,
  CheckCircle2,
  Save,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export const Screen3Programs: React.FC = () => {
  const {
    nextStep,
    prevStep,
    selfCheckAnswers,
    setSelfCheckAnswer,
    saveSelfCheckAnswers,
    isSavingSelfCheck,
  } = useTraining();

  const [data, setData] = useState<ProgramsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCode, setSelectedCode] = useState<string>('JUNIOR');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await contentApi.getPrograms();
        setData(res);
        if (res.programs?.length > 0) {
          setSelectedCode(res.programs[0].code);
        }
      } catch (err) {
        console.error('Error loading programs:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
        Загрузка программ обучения...
      </div>
    );
  }

  if (!data) return null;

  const currentProgram = data.programs.find((p) => p.code === selectedCode) || data.programs[0];

  const answeredCount = data.selfCheck?.questions.filter(
    (q) => (selfCheckAnswers[String(q.id)] || '').trim().length > 0
  ).length || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
      {/* Header */}
      <div>
        <span className="badge badge-purple" style={{ marginBottom: 12 }}>
          Этап 3 • Линейка курсов GERON
        </span>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
          {data.title}
        </h2>
        <p style={{ fontSize: '1rem', color: '#64748b', maxWidth: 800 }}>
          {data.subtitle}
        </p>
      </div>

      {/* Age Group Selector Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 4,
        }}
      >
        {data.programs.map((prog) => {
          const isSelected = prog.code === selectedCode;
          return (
            <button
              key={prog.id}
              onClick={() => setSelectedCode(prog.code)}
              style={{
                padding: '12px 20px',
                borderRadius: 14,
                border: isSelected ? '2px solid #7c3aed' : '1.5px solid #e2e8f0',
                background: isSelected ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' : '#ffffff',
                color: isSelected ? '#ffffff' : '#334155',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: isSelected ? '0 4px 14px rgba(124, 58, 237, 0.25)' : 'none',
                transition: 'all 150ms ease',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <GraduationCap size={16} color={isSelected ? '#ffffff' : '#7c3aed'} />
              <span>{prog.ageRange}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Program Showcase Card */}
      {currentProgram && (
        <div
          className="card"
          style={{
            padding: 36,
            borderRadius: 20,
            border: '1.5px solid #e9d5ff',
            boxShadow: '0 12px 30px -8px rgba(124, 58, 237, 0.1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
            <div>
              <span className="badge badge-purple" style={{ marginBottom: 8 }}>
                Возраст: {currentProgram.ageRange}
              </span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                {currentProgram.title}
              </h3>
              <p style={{ fontSize: '1.0625rem', color: '#7c3aed', fontWeight: 600, marginTop: 4 }}>
                {currentProgram.subtitle}
              </p>
            </div>
          </div>

          <p style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.7, marginBottom: 24 }}>
            {currentProgram.description}
          </p>

          {/* Tools learned */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Wrench size={16} /> Изучаемые инструменты и технологии:
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {currentProgram.tools.map((tool, idx) => (
                <span
                  key={idx}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    padding: '6px 14px',
                    borderRadius: 9999,
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                  }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Value for parents */}
          <div
            style={{
              background: '#faf5ff',
              border: '1.5px solid #ddd6fe',
              borderRadius: 16,
              padding: '20px 24px',
              display: 'flex',
              gap: 16,
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: '#7c3aed',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <HeartHandshake size={22} />
            </div>
            <div>
              <h5 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#4c1d95', marginBottom: 4 }}>
                Главная ценность для родителей:
              </h5>
              <p style={{ fontSize: '0.9375rem', color: '#5b21b6', lineHeight: 1.6 }}>
                {currentProgram.valueForParents}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Self-Check Questions Form */}
      <div
        className="card"
        style={{
          borderRadius: 20,
          padding: 36,
          background: '#ffffff',
          border: '1.5px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <HelpCircle size={22} color="#7c3aed" />
              <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0f172a' }}>
                {data.selfCheck.title}
              </h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              {data.selfCheck.instructions}
            </p>
          </div>

          <div
            style={{
              background: answeredCount === 7 ? '#ecfdf5' : '#faf5ff',
              border: `1px solid ${answeredCount === 7 ? '#a7f3d0' : '#ddd6fe'}`,
              color: answeredCount === 7 ? '#059669' : '#7c3aed',
              padding: '6px 14px',
              borderRadius: 9999,
              fontWeight: 700,
              fontSize: '0.8125rem',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <CheckCircle2 size={16} />
            <span>Заполнено: {answeredCount} из 7</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 24 }}>
          {data.selfCheck.questions.map((q) => (
            <div
              key={q.id}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 14,
                padding: '18px 20px',
              }}
            >
              <label
                style={{
                  display: 'block',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  marginBottom: 10,
                }}
              >
                <span style={{ color: '#7c3aed', fontWeight: 700, marginRight: 6 }}>
                  #{q.id}
                </span>
                {q.question}
              </label>

              <textarea
                rows={2}
                placeholder="Запишите ваш ответ своими словами..."
                value={selfCheckAnswers[String(q.id)] || ''}
                onChange={(e) => setSelfCheckAnswer(q.id, e.target.value)}
                className="input-field textarea-field"
                style={{ background: '#ffffff' }}
              />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={saveSelfCheckAnswers}
            disabled={isSavingSelfCheck}
            className="btn btn-primary"
          >
            <Save size={16} />
            <span>{isSavingSelfCheck ? 'Сохранение в базе...' : 'Сохранить ответы в профиль'}</span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={prevStep} className="btn btn-outline">
          <ArrowLeft size={16} />
          <span>2. О школе GERON</span>
        </button>
        <button onClick={nextStep} className="btn btn-primary">
          <span>4. Видеообучение</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
