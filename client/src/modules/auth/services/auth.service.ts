import { apiClient } from '@/infrastructure/api/client'
import { AuthResponse, LoginDto, RegisterDto, User } from '../types/auth.types'
import { AUTH_ENDPOINTS } from '../config/api.config'
import Cookies from 'js-cookie'

export class AuthService {
  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.REGISTER, data)
    this.setAccessToken(response.data.accessToken)
    return response.data
  }

  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials)
    this.setAccessToken(response.data.accessToken)
    return response.data
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post(AUTH_ENDPOINTS.LOGOUT)
    } finally {
      Cookies.remove('accessToken')
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.REFRESH, { refreshToken })
    this.setAccessToken(response.data.accessToken)
    return response.data
  }

  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>(AUTH_ENDPOINTS.PROFILE)
    console.log(response)
    return response?.data
  }
  getAccessToken(): string | undefined {
    return Cookies.get('accessToken')
  }

  private setAccessToken(token: string): void {
    Cookies.set('accessToken', token, {
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
  }
}

export const authService = new AuthService()
