import { handleApiResponse } from './errors.js';
import { logger } from './logger.js';

// Get API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL;
if (!API_BASE_URL) {
  throw new Error('VITE_API_URL environment variable is not set');
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...init } = options;

  try {
    // Construct the full URL
    let baseUrl = '';
    if (API_BASE_URL.startsWith('http')) {
      // If it's a full URL, use it as is
      baseUrl = API_BASE_URL;
    } else if (typeof window !== 'undefined') {
      // In browser environment, use window.location.origin
      baseUrl = window.location.origin + API_BASE_URL;
    } else {
      // Fallback for non-browser environment
      baseUrl = API_BASE_URL;
    }

    // Add query parameters if provided
    const url = new URL(endpoint, baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value);
        }
      });
    }

    // Set default headers
    const headers = new Headers(init.headers);
    if (!headers.has('Content-Type') && init.method !== 'GET') {
      headers.set('Content-Type', 'application/json');
    }

    logger.debug('Making API request', {
      method: init.method || 'GET',
      url: url.toString(),
      headers: Object.fromEntries(headers.entries()),
      params
    });

    const response = await fetch(url.toString(), {
      ...init,
      headers,
      credentials: 'include'
    });

    return handleApiResponse<T>(response);
  } catch (error) {
    logger.error('API request failed:', {
      endpoint,
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}

export interface Source {
  _id: string;
  name: string;
  description?: string;
  type: string;
  connectionDetails: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Table {
  _id: string;
  name: string;
  alternativeNames?: string[];
  sourceId: string;
  description?: string;
  fields?: {
    name: string;
    type: string;
    isRequired: boolean;
    description?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  _id: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: Record<string, unknown>;
  userId: string;
  createdAt: string;
}

export interface SyncJob {
  _id: string;
  sourceId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export const api = {
  // Health check
  health: () => request<{ status: string; mongodb: string }>('/health'),

  // Sources
  getSources: () => request<Source[]>('/sources'),
  createSource: (data: Omit<Source, '_id' | 'createdAt' | 'updatedAt'>) =>
    request<Source>('/sources', { method: 'POST', body: JSON.stringify(data) }),
  updateSource: (id: string, data: Partial<Source>) =>
    request<Source>(`/sources/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSource: (id: string) =>
    request<void>(`/sources/${id}`, { method: 'DELETE' }),

  // Tables
  getTables: (sourceId?: string) =>
    request<Table[]>('/tables', { params: sourceId ? { sourceId } : undefined }),
  createTable: (data: Omit<Table, '_id' | 'createdAt' | 'updatedAt'>) =>
    request<Table>('/tables', { method: 'POST', body: JSON.stringify(data) }),
  updateTable: (id: string, data: Partial<Table>) =>
    request<Table>(`/tables/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTable: (id: string) =>
    request<void>(`/tables/${id}`, { method: 'DELETE' }),

  // Audit Logs
  getAuditLogs: () => request<AuditLog[]>('/audit-logs'),

  // Sync Jobs
  getSyncJobs: () => request<SyncJob[]>('/sync-jobs'),
  createSyncJob: (sourceId: string) =>
    request<SyncJob>('/sync-jobs', { method: 'POST', body: JSON.stringify({ sourceId }) }),
  cancelSyncJob: (id: string) =>
    request<void>(`/sync-jobs/${id}/cancel`, { method: 'POST' })
};