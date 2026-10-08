// In production (Vercel), VITE_API_URL points to Railway backend
// In dev, proxy handles /api -> localhost:5000
const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/v1`
  : '/api/v1';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends RequestInit {
  token?: string | null;
  isAdmin?: boolean;
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, isAdmin = false, headers = {}, ...restOptions } = options;

  const authHeader: Record<string, string> = {};
  
  if (token) {
    authHeader['Authorization'] = `Bearer ${token}`;
  } else {
    // Check localStorage for tokens
    if (isAdmin) {
      const adminToken = localStorage.getItem('geron_admin_token');
      if (adminToken) authHeader['Authorization'] = `Bearer ${adminToken}`;
    } else {
      const candidateToken = localStorage.getItem('geron_candidate_token');
      if (candidateToken) authHeader['Authorization'] = `Bearer ${candidateToken}`;
    }
  }

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...authHeader,
    ...(headers as Record<string, string>),
  };

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: defaultHeaders,
      ...restOptions,
    });

    if (!response.ok) {
      let errorBody: any = null;
      try {
        errorBody = await response.json();
      } catch {
        errorBody = { error: response.statusText };
      }
      throw new ApiError(
        errorBody?.error || errorBody?.message || `HTTP error ${response.status}`,
        response.status,
        errorBody
      );
    }

    return await response.json();
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err?.message || 'Сетевая ошибка при запросе к серверу', 0);
  }
}
