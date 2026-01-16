'use client'

import { Toaster } from 'react-hot-toast'

import { FC, ReactNode } from 'react'
import { AuthProvider } from '@/modules/auth/context'

type AppProvidersProps = {
  children: ReactNode
}

export const AppProviders: FC<AppProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </AuthProvider>
  )
}
