export type Channel = {
  id: string
  handle: string
  avatarPath?: string
  bannerPath?: string
  bio?: string
}

export type User = {
  id: string
  name?: string
  email: string
  emailVerified: boolean
  channel?: Channel
}

export type LoginDto = {
  email: string
  password: string
  RecaptchaToken?: string
}

export type RegisterDto = {
  name?: string
  email: string
  password: string
  confirmPassword: string
  RecaptchaToken?: string
}

export type AuthResponse = {
  accessToken: string
  account: User
}

export type RefreshResponse = {
  accessToken: string
}

export type AuthContextValue = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginDto) => Promise<void>
  register: (data: RegisterDto) => Promise<void>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
}
