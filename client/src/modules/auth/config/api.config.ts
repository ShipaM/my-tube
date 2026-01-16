export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 30000,
  withCredentials: true,
}

export const AUTH_ENDPOINTS = {
  LOGIN: 'api/auth/login',
  REGISTER: 'api/auth/register',
  LOGOUT: 'api/auth/logout',
  REFRESH: 'api/auth/refresh',
  PROFILE: 'api/account/me',
}
