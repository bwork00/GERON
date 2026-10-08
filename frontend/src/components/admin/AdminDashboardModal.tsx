import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTraining } from '../../context/TrainingContext';
import { adminApi, InviteCandidateResponse } from '../../api/adminApi';
import { CandidateWithLogs } from '../../types';
import {
  ShieldCheck,
  Users,
  UserPlus,
  Trash2,
  Copy,
  ExternalLink,
  CheckCircle2,
  Clock,
  X,
  FileQuestion,
  Headphones,
  Check,
  AlertCircle,
  Eye,
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const { adminUser, adminToken, loginAdmin, logoutAdmin, error, clearError } = useAuth();
  const { showToast } = useTraining();

  // Login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('geron_admin_2026');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard state
  const [candidates, setCandidates] = useState<CandidateWithLogs[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [activeTab, setActiveTab] = useState<'candidates' | 'invite'>('candidates');

  // Invite candidate state
  const [inviteName, setInviteName] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [generatedInvite, setGeneratedInvite] = useState<InviteCandidateResponse | null>(null);

  // Candidate detail inspect modal state
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateWithLogs | null>(null);

  // Fetch candidates when admin is logged in and modal opens
  const loadCandidates = async () => {
    if (!adminToken) return;
    setIsLoadingList(true);
    try {
      const res = await adminApi.getCandidates();
      if (res.success) {
        setCandidates(res.candidates);
      }
    } catch (err: any) {
      showToast('Ошибка загрузки кандидатов: ' + err.message, 'error');
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    if (isOpen && adminToken) {
      loadCandidates();
    }
  }, [isOpen, adminToken]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    const ok = await loginAdmin(username, password);
    setIsLoggingIn(false);
    if (ok) {
      showToast('Вход в панель наставника выполнен', 'success');
      loadCandidates();
    }
  };

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim()) return;

    setIsInviting(true);
    try {
      const res = await adminApi.inviteCandidate({
        fullName: inviteName.trim(),
        phone: invitePhone.trim() || undefined,
        email: inviteEmail.trim() || undefined,
      });

      if (res.success) {
        setGeneratedInvite(res);
        showToast(`Ссылка для кандидата ${inviteName} успешно создана!`, 'success');
        setInviteName('');
        setInvitePhone('');
        setInviteEmail('');
        loadCandidates();
      }
    } catch (err: any) {
      showToast('Ошибка создания инвайта: ' + err.message, 'error');
    } finally {
      setIsInviting(false);
    }
  };

  const handleDeleteCandidate = async (id: string, name: string) => {
    if (!window.confirm(`Вы уверены, что хотите удалить кандидата «${name}»?`)) return;

    try {
      const res = await adminApi.deleteCandidate(id);
      if (res.success) {
        showToast(`Кандидат «${name}» удален`, 'info');
        setCandidates((prev) => prev.filter((c) => c.id !== id));
        if (selectedCandidate?.id === id) setSelectedCandidate(null);
      }
    } catch (err: any) {
      showToast('Ошибка удаления: ' + err.message, 'error');
    }
  };

  const copyToClipboard = (text: string, label: string = 'Ссылка') => {
    navigator.clipboard.writeText(text);
    showToast(`${label} скопирована в буфер обмена!`, 'success');
  };

  const completedCount = candidates.filter((c) => c.status === 'COMPLETED').length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: adminUser ? 960 : 440, width: '100%' }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 28px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #faf5ff 0%, #ffffff 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#0f172a' }}>
                Панель наставника GERON
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Управление кандидатами и аналитика 2-го этапа
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {adminUser && (
              <button
                onClick={() => {
                  logoutAdmin();
                  showToast('Вы вышли из админ-панели', 'info');
                }}
                className="btn btn-ghost btn-sm"
                style={{ color: '#ef4444' }}
              >
                Выйти
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: 4,
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px' }}>
          {!adminUser ? (
            /* Admin Login Form */
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <p style={{ fontSize: '0.875rem', color: '#475569' }}>
                  Введите логин и пароль наставника для доступа к базе кандидатов
                </p>
              </div>

              {error && (
                <div
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 10,
                    padding: '10px 14px',
                    color: '#b91c1c',
                    fontSize: '0.8125rem',
                  }}
                >
                  {error}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                  Логин наставника
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                  Пароль
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 8 }}
              >
                <ShieldCheck size={18} />
                <span>{isLoggingIn ? 'Авторизация...' : 'Войти в панель'}</span>
              </button>
            </form>
          ) : (
            /* Admin Logged-In View */
            <div>
              {/* Summary Metrics */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    background: '#faf5ff',
                    border: '1px solid #e9d5ff',
                    borderRadius: 14,
                    padding: '16px 20px',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#7c3aed', textTransform: 'uppercase' }}>
                    Всего кандидатов
                  </span>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
                    {candidates.length}
                  </div>
                </div>

                <div
                  style={{
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    borderRadius: 14,
                    padding: '16px 20px',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669', textTransform: 'uppercase' }}>
                    Завершили этап
                  </span>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#065f46', marginTop: 4 }}>
                    {completedCount}
                  </div>
                </div>

                <div
                  style={{
                    background: '#fffbeb',
                    border: '1px solid #fde68a',
                    borderRadius: 14,
                    padding: '16px 20px',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#d97706', textTransform: 'uppercase' }}>
                    В процессе обучения
                  </span>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#92400e', marginTop: 4 }}>
                    {candidates.length - completedCount}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div
                style={{
                  display: 'flex',
                  borderBottom: '1px solid #e2e8f0',
                  marginBottom: 20,
                  gap: 20,
                }}
              >
                <button
                  onClick={() => setActiveTab('candidates')}
                  style={{
                    padding: '10px 4px',
                    border: 'none',
                    background: 'none',
                    borderBottom: activeTab === 'candidates' ? '2.5px solid #7c3aed' : '2.5px solid transparent',
                    color: activeTab === 'candidates' ? '#7c3aed' : '#64748b',
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Users size={18} />
                  <span>Список кандидатов ({candidates.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('invite')}
                  style={{
                    padding: '10px 4px',
                    border: 'none',
                    background: 'none',
                    borderBottom: activeTab === 'invite' ? '2.5px solid #7c3aed' : '2.5px solid transparent',
                    color: activeTab === 'invite' ? '#7c3aed' : '#64748b',
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <UserPlus size={18} />
                  <span>Создать ссылку-инвайт</span>
                </button>
              </div>

              {/* TAB 1: Candidates Table */}
              {activeTab === 'candidates' && (
                <div>
                  {isLoadingList ? (
                    <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                      Загрузка кандидатов...
                    </div>
                  ) : candidates.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
                      Кандидатов пока нет. Вы можете создать персональную ссылку во вкладке «Создать ссылку-инвайт».
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                            <th style={{ padding: '12px 14px' }}>Кандидат</th>
                            <th style={{ padding: '12px 14px' }}>Статус</th>
                            <th style={{ padding: '12px 14px' }}>Чек-лист</th>
                            <th style={{ padding: '12px 14px' }}>Звонки</th>
                            <th style={{ padding: '12px 14px' }}>Токен</th>
                            <th style={{ padding: '12px 14px', textAlign: 'right' }}>Действия</th>
                          </tr>
                        </thead>
                        <tbody>
                          {candidates.map((cand) => {
                            const checkListCount = Array.isArray(cand.checklistState)
                              ? cand.checklistState.filter(Boolean).length
                              : 0;
                            const callsDoneCount = cand.progressLogs
                              ? cand.progressLogs.filter((l) => l.isCompleted).length
                              : 0;

                            return (
                              <tr
                                key={cand.id}
                                style={{
                                  borderBottom: '1px solid #f1f5f9',
                                  transition: 'background 150ms ease',
                                }}
                              >
                                <td style={{ padding: '14px' }}>
                                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{cand.fullName}</div>
                                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                    {cand.phone || 'Телефон не указан'}
                                  </div>
                                </td>

                                <td style={{ padding: '14px' }}>
                                  <span
                                    className={`badge ${cand.status === 'COMPLETED' ? 'badge-success' : 'badge-purple'}`}
                                  >
                                    {cand.status === 'COMPLETED' ? 'Готов к практике' : 'Обучается'}
                                  </span>
                                </td>

                                <td style={{ padding: '14px' }}>
                                  <span style={{ fontWeight: 600, color: checkListCount === 7 ? '#059669' : '#7c3aed' }}>
                                    {checkListCount} / 7
                                  </span>
                                </td>

                                <td style={{ padding: '14px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#475569' }}>
                                    <Headphones size={14} />
                                    <span>{callsDoneCount} / 5</span>
                                  </div>
                                </td>

                                <td style={{ padding: '14px' }}>
                                  <button
                                    onClick={() => copyToClipboard(`http://localhost:3000/?token=${cand.token}`, 'Ссылка кандидата')}
                                    title="Скопировать ссылку для входа"
                                    style={{
                                      fontFamily: 'monospace',
                                      fontSize: '0.75rem',
                                      background: '#f8fafc',
                                      border: '1px solid #e2e8f0',
                                      padding: '4px 8px',
                                      borderRadius: 6,
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 6,
                                      color: '#64748b',
                                    }}
                                  >
                                    <Copy size={12} />
                                    <span>{cand.token.substring(0, 14)}...</span>
                                  </button>
                                </td>

                                <td style={{ padding: '14px', textAlign: 'right' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                                    <button
                                      onClick={() => setSelectedCandidate(cand)}
                                      className="btn btn-secondary btn-sm"
                                      title="Посмотреть анкету и ответы"
                                    >
                                      <Eye size={14} />
                                      <span>Ответы</span>
                                    </button>

                                    <button
                                      onClick={() => handleDeleteCandidate(cand.id, cand.fullName)}
                                      className="btn btn-ghost btn-sm"
                                      style={{ color: '#ef4444' }}
                                      title="Удалить кандидата"
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Invite Generator */}
              {activeTab === 'invite' && (
                <div style={{ maxWidth: 520, margin: '0 auto' }}>
                  <form onSubmit={handleCreateInvite} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                        ФИО нового кандидата *
                      </label>
                      <input
                        type="text"
                        placeholder="например: Дарья Смирнова"
                        value={inviteName}
                        onChange={(e) => setInviteName(e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                        Телефон
                      </label>
                      <input
                        type="tel"
                        placeholder="+7 707 987 65 43"
                        value={invitePhone}
                        onChange={(e) => setInvitePhone(e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                        Email (опционально)
                      </label>
                      <input
                        type="email"
                        placeholder="candidate@gmail.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isInviting || !inviteName.trim()}
                      className="btn btn-primary"
                      style={{ width: '100%', marginTop: 8 }}
                    >
                      <UserPlus size={18} />
                      <span>{isInviting ? 'Генерация ссылки...' : 'Сгенерировать персональную ссылку'}</span>
                    </button>
                  </form>

                  {generatedInvite && (
                    <div
                      style={{
                        marginTop: 24,
                        background: '#ecfdf5',
                        border: '1.5px solid #a7f3d0',
                        borderRadius: 14,
                        padding: '18px 20px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#065f46', fontWeight: 700, marginBottom: 8 }}>
                        <CheckCircle2 size={18} />
                        <span>Ссылка для кандидата готова!</span>
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: '#047857', marginBottom: 10 }}>
                        Кандидат: <strong>{generatedInvite.candidate.fullName}</strong>
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          background: '#ffffff',
                          padding: '8px 12px',
                          borderRadius: 8,
                          border: '1px solid #a7f3d0',
                        }}
                      >
                        <input
                          type="text"
                          readOnly
                          value={generatedInvite.accessUrl}
                          style={{
                            border: 'none',
                            outline: 'none',
                            width: '100%',
                            fontFamily: 'monospace',
                            fontSize: '0.8125rem',
                            color: '#0f172a',
                          }}
                        />
                        <button
                          onClick={() => copyToClipboard(generatedInvite.accessUrl, 'Персональная ссылка')}
                          className="btn btn-primary btn-sm"
                        >
                          <Copy size={14} />
                          <span>Копировать</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Candidate Detail Modal Popup */}
        {selectedCandidate && (
          <div className="modal-overlay" onClick={() => setSelectedCandidate(null)}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: 600, padding: 24 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: '1.1875rem', fontWeight: 700, color: '#0f172a' }}>
                    {selectedCandidate.fullName}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                    Токен: {selectedCandidate.token}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Answers block */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#7c3aed', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FileQuestion size={18} /> Ответы на самопроверку:
                </h4>
                {selectedCandidate.selfCheckAnswers &&
                Object.keys(selectedCandidate.selfCheckAnswers).length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {Object.entries(selectedCandidate.selfCheckAnswers).map(([qNum, ans]) => (
                      <div
                        key={qNum}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: 8,
                          padding: '10px 14px',
                        }}
                      >
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                          Вопрос #{qNum}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#0f172a', marginTop: 4 }}>
                          {ans || '— Без ответа —'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                    Кандидат пока не заполнил ответы на самопроверку на 3-м экране.
                  </p>
                )}
              </div>

              <div style={{ textAlign: 'right' }}>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="btn btn-outline btn-sm"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
