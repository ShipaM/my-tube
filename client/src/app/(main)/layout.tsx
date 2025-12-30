'use client'

import { Header } from '@/common/components/patterns/Header'
import { Sidebar } from '@/common/components/patterns/Sidebar'
import clsx from 'clsx'
import React, { useState } from 'react'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const handleMenuClick = () => {
    setIsSidebarCollapsed((prev) => !prev)
  }

  return (
    <div className={clsx('main-layout', { 'main-layout--sidebar-collapsed': isSidebarCollapsed })}>
      <Header onMenuClick={handleMenuClick} />
      <Sidebar iscollapsed={isSidebarCollapsed} />
      <main className="main-layout__content">{children}</main>
    </div>
  )
}
