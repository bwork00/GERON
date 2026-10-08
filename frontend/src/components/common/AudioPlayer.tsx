import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTraining } from '../../context/TrainingContext';
import { progressApi } from '../../api/progressApi';

interface AudioPlayerProps {
  id: string;
  title: string;
  streamUrl: string;
  durationSeconds: number;
  initialCompleted?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  id,
  title,
  streamUrl,
  durationSeconds,
  initialCompleted = false,
}) => {
  const { candidateToken } = useAuth();
  const { activeAudioId, setActiveAudioId, showToast } = useTraining();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(durationSeconds || 0);
  const [isCompleted, setIsCompleted] = useState<boolean>(initialCompleted);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // If another audio begins playing, pause this one
  useEffect(() => {
    if (activeAudioId && activeAudioId !== id && isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [activeAudioId, id, isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setActiveAudioId(id);
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error('Audio play failed:', err);
        showToast('Не удалось воспроизвести аудиофайл', 'error');
      });
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    setCurrentTime(cur);

    // If listened past 80% or reached end, mark completed in backend
    if (!isCompleted && duration > 0 && cur >= duration * 0.75) {
      markCompleted(Math.floor(cur));
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || durationSeconds);
      setIsLoading(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
        setActiveAudioId(id);
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const cyclePlaybackRate = () => {
    const nextRate = playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1;
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const markCompleted = async (listenedSec: number) => {
    setIsCompleted(true);
    if (candidateToken) {
      try {
        await progressApi.logCallProgress(
          {
            callSampleId: id,
            listenedSeconds: listenedSec,
            isCompleted: true,
          },
          candidateToken
        );
        showToast(`Запись «${title}» зачтена в вашем прогрессе!`, 'success');
      } catch (err) {
        console.error('Error logging call progress:', err);
      }
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1.5px solid #e2e8f0',
        borderRadius: 16,
        padding: '20px 24px',
        boxShadow: isPlaying ? '0 10px 25px -5px rgba(124, 58, 237, 0.15)' : '0 4px 6px -1px rgba(0,0,0,0.05)',
        borderColor: isPlaying ? '#a78bfa' : '#e2e8f0',
        transition: 'all 200ms ease',
      }}
    >
      <audio
        ref={audioRef}
        src={streamUrl}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onEnded={() => {
          setIsPlaying(false);
          markCompleted(Math.floor(duration));
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>{title}</h4>
          {isCompleted && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#059669',
                background: '#ecfdf5',
                padding: '3px 8px',
                borderRadius: 9999,
                border: '1px solid #a7f3d0',
              }}
            >
              <CheckCircle size={13} /> Прослушано
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: '#64748b' }}>
          <Clock size={14} />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Progress Bar & Scrubber */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          style={{
            width: '100%',
            height: 6,
            borderRadius: 3,
            accentColor: '#7c3aed',
            cursor: 'pointer',
            background: `linear-gradient(to right, #7c3aed ${progressPercent}%, #e2e8f0 ${progressPercent}%)`,
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={togglePlay}
            disabled={isLoading}
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              border: 'none',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
              transition: 'transform 150ms ease',
            }}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: 2 }} />}
          </button>

          <button
            onClick={handleRestart}
            title="Сначала"
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: 8,
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <RotateCcw size={16} />
          </button>

          <button
            onClick={cyclePlaybackRate}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: '6px 10px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#7c3aed',
              cursor: 'pointer',
            }}
          >
            {playbackRate}x
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={toggleMute}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: 6,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};
