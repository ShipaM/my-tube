'use client'
import { Button, Input } from '@/common/components/ui'
import { useForm } from 'react-hook-form'
import { FaPlay } from 'react-icons/fa'

type LoginFormData = {
  email: string
  password: string
}
export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: { email: 'demo@example.com', password: 'password123' },
  })
  const onSubmit = (data: LoginFormData) => {
    console.log('Login form submitted:', data)
  }

  return (
    <div className="auth-card">
      <div className="auth-card__header">
        <div className="auth-card__logo">
          <FaPlay />
          <span>MyTube</span>
        </div>
        <h1 className="auth-card__title">Welcome back</h1>
        <p className="auth-card__subtitle">Sign in to your account</p>
      </div>
      <form className="auth-card__form" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          })}
          error={errors.password?.message}
        />
        <Button variant="primary" fullWidth type="submit">
          Sign In
        </Button>
      </form>

      <div className="auth-card__footer">
        Don&apos;t have an account? <a href="/auth/register">Sign Up</a>
      </div>
    </div>
  )
}
