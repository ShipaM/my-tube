'use client'
import { Button, Input } from '@/common/components/ui'
import { useForm } from 'react-hook-form'
import { FaPlay } from 'react-icons/fa'

type RegisterFormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormData>()

  const onSubmit = (data: RegisterFormData) => {
    console.log('Registration form submitted:', data)
  }
  return (
    <div className="auth-card">
      <div className="auth-card__header">
        <div className="auth-card__logo">
          <FaPlay />
          <span>MyTube</span>
        </div>
        <h1 className="auth-card__title">Create account</h1>
        <p className="auth-card__subtitle">Start dharing your videos today</p>
      </div>

      <form className="auth-card__form" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Name (optional)"
          type="text"
          {...register('name', {
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          })}
          error={errors.name?.message}
        />
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
        <Input
          label="Confirm Password"
          type="password"
          {...register('confirmPassword', {
            required: 'Please Confirm your Password',
            validate: (value) => value === getValues('password') || 'Passwords do not match',
          })}
          error={errors.confirmPassword?.message}
        />
        <Button variant="primary" fullWidth type="submit">
          Create Account
        </Button>
      </form>

      <div className="auth-card__footer">
        Already have an account? <a href="/auth/login">Sign In</a>
      </div>
    </div>
  )
}
