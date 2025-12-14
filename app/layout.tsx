// 루트 레이아웃
// 이 파일은 모든 페이지에 공통으로 적용되는 레이아웃입니다.
// 메타데이터, 폰트, 전역 스타일 등을 설정합니다.

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Peka DevLog - 학생 개발자 블로그',
  description: 'Kali Linux, Python, HTML을 공부하며 배운 내용을 기록하는 개발 블로그',
  keywords: ['블로그', '개발', 'Kali Linux', 'Python', 'HTML', '보안', '학습'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="dark">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}

