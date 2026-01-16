import '@/styles/globals.scss'
import '@/styles/components/index.scss'
import '@/styles/layout/index.scss'
import '@/styles/modules/index.scss'

import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import { AppProviders } from '@/providers/app-providers'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'NextTube',
  description: 'Discover, watch and share videos on NextTube',
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
