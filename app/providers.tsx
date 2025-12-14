// Providers 컴포넌트
// 이 파일은 NextAuth 세션을 제공하는 Provider를 설정합니다.
// 클라이언트 컴포넌트이므로 'use client'가 필요합니다.

'use client'

import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}

