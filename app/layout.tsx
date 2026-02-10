import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Alphaus MSP収益モデルシミュレーター - Ripple & スマート予約割引',
  description: 'MSP向けコスト最適化・収益モデル分析ツール - Next.js 15 Edition',
  keywords: ['AWS', 'RI', 'SP', 'MSP', 'Cost Optimization', 'Cloudflare', 'Next.js 15', 'React 19'],
  authors: [{ name: 'Alphaus Cloud Group' }],
  creator: 'Alphaus Cloud Group',
  publisher: 'Alphaus Cloud Group',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Alphaus MSP収益モデルシミュレーター',
    description: 'MSP向けコスト最適化・収益モデル分析ツール',
    type: 'website',
    locale: 'ja_JP',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
