'use client'

import '@/styles/modules/_auth.scss'
import '@/styles/layout/_main.scss'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="auth-layout">{children}</div>
}
