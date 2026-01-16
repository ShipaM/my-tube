import { useAuthCotext } from '../context'

export const useAuth = () => {
  return useAuthCotext()
}

export const useLogin = () => {
  const { login, isLoading } = useAuthCotext()
  return { login, isLoading }
}

export const useCurrentUser = () => {
  const { user, isLoading } = useAuthCotext()
  return { user, isLoading }
}

export const useLogout = () => {
  const { logout } = useAuthCotext()
  return { logout }
}

export const useRegister = () => {
  const { register, isLoading } = useAuthCotext()
  return { register, isLoading }
}
