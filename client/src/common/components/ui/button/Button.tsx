import clsx from 'clsx'
import React, { ButtonHTMLAttributes, FC } from 'react'

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  isIcon?: boolean
  fullWidth?: boolean
  children: React.ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isIcon = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      className={clsx(
        'button',
        `button--${variant}`,
        `button--${size}`,
        {
          'button--loading': isLoading,
          'button--icon': isIcon,
          'button--full': fullWidth,
        },
        className
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="button__spinner"></span>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  )
}

export default Button
