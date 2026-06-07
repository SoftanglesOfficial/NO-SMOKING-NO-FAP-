import axios, { AxiosError } from 'axios';
import { getApiBaseUrl } from './config';
import {
  BreakStreakPayload,
  Challenge,
  StartChallengePayload,
} from './types';

export const API_TIMEOUT_MS = 3000;
export const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const method = config.method?.toUpperCase() ?? 'REQUEST';
  const url = `${config.baseURL ?? ''}${config.url ?? ''}`;
  console.log(`[FAB Challenge] API request: ${method} ${url}`);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 404) {
      console.log('[FAB Challenge] API returned 404 (no resource found)');
    } else {
      console.log(
        '[FAB Challenge] API call failed:',
        error.message,
        error.code ?? 'no-code',
      );
    }
    return Promise.reject(error);
  },
);

export function isNotFoundError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404;
}

export function isConnectionError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    return true;
  }

  return !error.response;
}

export function getApiErrorMessage(error: unknown): string {
  if (isNotFoundError(error)) {
    return '';
  }

  if (isConnectionError(error)) {
    return 'Cannot connect to server';
  }

  if (axios.isAxiosError(error)) {
    return error.message || 'Request failed';
  }

  return error instanceof Error ? error.message : 'Something went wrong';
}

export async function startChallenge(
  payload: StartChallengePayload,
): Promise<Challenge> {
  const { data } = await api.post<Challenge>('/challenges/start', payload);
  return data;
}

export async function getChallenge(deviceId: string): Promise<Challenge | null> {
  try {
    const { data } = await api.get<Challenge>(
      `/challenges/${encodeURIComponent(deviceId)}`,
    );
    return data;
  } catch (error) {
    if (isNotFoundError(error)) {
      console.log('No active challenge found, showing setup screen');
      return null;
    }
    throw error;
  }
}

export async function breakStreak(
  payload: BreakStreakPayload,
): Promise<Challenge> {
  const { data } = await api.post<Challenge>('/challenges/break', payload);
  return data;
}
