import React, { useEffect, useState } from 'react';
import { contentApi } from '../../api/contentApi';
import { ScriptsData, ScriptSectionItem } from '../../types';
import { useTraining } from '../../context/TrainingContext';
import {
  FileText,
  Download,
  Lightbulb,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import { defaultScripts } from '../../data/mockContent';

export const Screen5Script: React.FC = () => {
  const { nextStep, prevStep } = useTraining();
  const [data, setData] = useState<ScriptsData>(defaultScripts);
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await contentApi.getScripts();
        if (res) setData(res);
      } catch (err) {
        console.error('Error loading scripts screen:', err);
      }
    };
    load();
  }, []);

  const toggleStep = (stepNumber: number) => {
    setExpandedStep(expandedStep === stepNumber ? null : stepNumber);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
      {/* Header & PDF Download Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <span className="badge badge-purple" style={{ marginBottom: 12 }}>
            Этап 5 • Скрипт телефонного разговора
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
            {data.title}
          </h2>
          <p style={{ fontSize: '1rem', color: '#64748b' }}>
            8 ключевых этапов построения доверительного диалога с родителем
          </p>
        </div>

        <a
          href="/script.pdf"
          download="GERON_Sales_Script.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ textDecoration: 'none' }}
        >
          <Download size={18} />
          <span>Скачать скрипт в PDF</span>
        </a>
      </div>

      {/* Head of Sales Mira Saduova Greeting Card */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <img
            src="/images/sales_mentor.jpg"
            alt={data.introFromHeadOfSales.author}
            style={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #ffffff',
              boxShadow: '0 8px 20px rgba(124, 58, 237, 0.2)',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/mira.jpg';
            }}
          />
          <div>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0f172a' }}>
              {data.introFromHeadOfSales.author}
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#7c3aed', fontWeight: 600 }}>
              {data.introFromHeadOfSales.position}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, color: '#334155', fontSize: '0.9375rem', lineHeight: 1.65 }}>
          {data.introFromHeadOfSales.text.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </div>

      {/* 8 Script Steps Accordion */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>
          Структура разговора из 8 шагов
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {data.scriptSections.map((sec) => {
            const isExpanded = expandedStep === sec.stepNumber;

            return (
              <div
                key={sec.id}
                style={{
                  background: '#ffffff',
                  border: isExpanded ? '1.5px solid #7c3aed' : '1px solid #e2e8f0',
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: isExpanded ? '0 10px 25px -5px rgba(124, 58, 237, 0.1)' : '0 2px 4px rgba(0,0,0,0.02)',
                  transition: 'all 200ms ease',
                }}
              >
                {/* Header bar */}
                <button
                  onClick={() => toggleStep(sec.stepNumber)}
                  style={{
                    width: '100%',
                    padding: '18px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: isExpanded ? '#faf5ff' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: isExpanded ? '#7c3aed' : '#f1f5f9',
                        color: isExpanded ? '#ffffff' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {sec.stepNumber}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.0625rem', fontWeight: 700, color: isExpanded ? '#7c3aed' : '#0f172a' }}>
                        Этап {sec.stepNumber}. {sec.title}
                      </h4>
                      {sec.description && (
                        <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: 2 }}>
                          Цель: {sec.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{ color: isExpanded ? '#7c3aed' : '#94a3b8' }}>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                {/* Content body */}
                {isExpanded && (
                  <div style={{ padding: '20px 24px 24px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Speech / dialogue */}
                    <div
                      style={{
                        background: '#f8fafc',
                        borderLeft: '4px solid #7c3aed',
                        padding: '16px 20px',
                        borderRadius: '0 12px 12px 0',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#7c3aed', fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase', marginBottom: 6 }}>
                        <MessageSquare size={15} />
                        <span>Речевой модуль менеджера:</span>
                      </div>
                      <p style={{ fontSize: '0.9375rem', color: '#1e293b', lineHeight: 1.65, fontStyle: 'italic' }}>
                        «{sec.content}»
                      </p>
                    </div>

                    {/* Tip */}
                    {sec.scriptTips && (
                      <div
                        style={{
                          background: '#fffbeb',
                          border: '1px solid #fde68a',
                          borderRadius: 12,
                          padding: '12px 16px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 12,
                          color: '#92400e',
                          fontSize: '0.875rem',
                        }}
                      >
                        <Lightbulb size={18} color="#d97706" style={{ marginTop: 2, flexShrink: 0 }} />
                        <span><strong>Совет наставника:</strong> {sec.scriptTips}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={prevStep} className="btn btn-outline">
          <ArrowLeft size={16} />
          <span>4. Видеообучение</span>
        </button>
        <button onClick={nextStep} className="btn btn-primary">
          <span>6. Реальные звонки</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
