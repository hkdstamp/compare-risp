import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import IframeResizer from '@/components/IframeResizer'
import { LanguageProvider } from '@/components/LanguageProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Alphaus MSP収益モデルシミュレーター - Ripple & コミットメント保証',
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
    <html lang={process.env.NEXT_PUBLIC_DEFAULT_LANG || 'ja'}>
      <body className={inter.className}>
        <LanguageProvider>
          <IframeResizer />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
