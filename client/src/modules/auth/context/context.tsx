'use client'
import { AuthContextValue, LoginDto, RegisterDto, User } from '@/modules/auth/types/auth.types'
import {
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext,
} from 'react'
import { authService } from '../services/auth.service'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'

type AuthProviderProps = {
  children: ReactNode
}
const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const isAuthenticated = !!user

  const initializeAuth = useCallback(async () => {
    try {
      const token = authService.getAccessToken()
      if (token) {
        const profile = await authService.getProfile()
        console.log(profile)
        setUser(profile)
      }
    } catch (error) {
      console.error('Init auth error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(
    async (credentials: LoginDto) => {
      try {
        setIsLoading(true)
        const response = await authService.login(credentials)
        setUser(response.account)
        toast.success('Welcome back, ' + response.account.name)
        router.push('/')
      } catch (error: unknown) {
        console.error('Login error:', error)
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message || 'Login failed')
        }
      }
    },
    [router]
  )

  const register = useCallback(
    async (data: RegisterDto) => {
      try {
        setIsLoading(true)
        const response = await authService.register(data)
        setUser(response.account)
        toast.success('Welcome, ' + response.account.name)
        router.push('/')
      } catch (error: unknown) {
        console.error('Register error:', error)
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message || 'Registration failed')
        }
      } finally {
        setIsLoading(false)
      }
    },
    [router]
  )

  const logout = useCallback(async () => {
    try {
      setIsLoading(true)
      await authService.logout()
      setUser(null)
      toast.success('Successfully logged out')
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const refreshAuth = useCallback(async () => {
    try {
      setIsLoading(true)
      const profile = await authService.getProfile()
      setUser(profile)
    } catch (error) {
      console.error('Refresh auth error:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  const value: AuthContextValue = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    refreshAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthCotext = (): AuthContextValue => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('setAuthContext must be used within a AuthProvider')
  }
  return context as AuthContextValue
}
