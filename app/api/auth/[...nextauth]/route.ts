// NextAuth API 라우트
// 이 파일은 NextAuth의 인증 엔드포인트를 처리합니다.
// /api/auth/signin, /api/auth/signout 등의 경로를 자동으로 생성합니다.

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

