import React, { useEffect, useState } from 'react';
import { contentApi } from '../../api/contentApi';
import { VideosData, VideoLessonItem } from '../../types';
import { useTraining } from '../../context/TrainingContext';
import {
  Video,
  Play,
  CheckSquare,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  GraduationCap,
} from 'lucide-react';

import { defaultVideos } from '../../data/mockContent';

export const Screen4Videos: React.FC = () => {
  const { nextStep, prevStep } = useTraining();
  const [data, setData] = useState<VideosData>(defaultVideos);
  const [activeModalVideo, setActiveModalVideo] = useState<VideoLessonItem | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await contentApi.getVideos();
        if (res) setData(res);
      } catch (err) {
        console.error('Error loading video lessons:', err);
      }
    };
    load();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
      {/* Header */}
      <div>
        <span className="badge badge-purple" style={{ marginBottom: 12 }}>
          Этап 4 • Видеообучение
        </span>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
          {data.title}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, color: '#475569', fontSize: '0.9375rem', lineHeight: 1.6, maxWidth: 900 }}>
          {data.intro.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      </div>

      {/* Manager's Evaluation Checklist */}
      <div
        className="card card-purple-subtle"
        style={{
          borderLeft: '5px solid #7c3aed',
          padding: '24px 28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <CheckSquare size={20} color="#7c3aed" />
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a' }}>
            На что обращать внимание при просмотре каждого видео:
          </h3>
        </div>
        <div className="grid-3">
          {data.managerChecklist.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: '#ffffff',
                border: '1px solid #ddd6fe',
                borderRadius: 12,
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#4c1d95',
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: '#7c3aed',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {idx + 1}
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5 Video Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {data.videos.map((vid, idx) => (
          <div
            key={vid.id}
            className="card card-hover"
            style={{
              padding: 28,
              borderRadius: 18,
              border: '1.5px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <span className="badge badge-purple" style={{ marginBottom: 6 }}>
                  Урок {idx + 1} • {vid.programCode}
                </span>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  {vid.title}
                </h4>
              </div>

              <button
                onClick={() => setActiveModalVideo(vid)}
                className="btn btn-primary btn-sm"
              >
                <Play size={14} />
                <span>Смотреть видео</span>
              </button>
            </div>

            {/* Key takeaways */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Ключевые тезисы для менеджера:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {vid.keyTakeaways.map((point, pIdx) => (
                  <div
                    key={pIdx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      background: '#f8fafc',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid #f1f5f9',
                      fontSize: '0.875rem',
                      color: '#334155',
                    }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed', marginTop: 8, flexShrink: 0 }} />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Player */}
      {activeModalVideo && (
        <div className="modal-overlay" onClick={() => setActiveModalVideo(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 780, padding: 0, overflow: 'hidden' }}
          >
            <div
              style={{
                padding: '16px 20px',
                background: '#0f172a',
                color: '#ffffff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>
                {activeModalVideo.title}
              </h4>
              <button
                onClick={() => setActiveModalVideo(null)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, background: '#000000' }}>
              <iframe
                src={activeModalVideo.videoUrl}
                title={activeModalVideo.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={prevStep} className="btn btn-outline">
          <ArrowLeft size={16} />
          <span>3. Программы</span>
        </button>
        <button onClick={nextStep} className="btn btn-primary">
          <span>5. Скрипт продаж</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
