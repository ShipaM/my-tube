import clsx from 'clsx'
import { FC } from 'react'
import { sizeMap } from './constants'

type AvatarProps = {
  src?: string
  alt?: string
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  fallback?: string
  className?: string
}

export const Avatar: FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  fallback,
  className,
}) => {
  return (
    <div className={clsx('avatar', `avatar--${size}`, className)}>
      {src && (
        <img
          src={src}
          alt={alt}
          height={sizeMap[size]}
          className="avatar__image"
          width={sizeMap[size]}
        />
      )}
    </div>
  )
}
