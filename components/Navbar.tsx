// 네비게이션 바 컴포넌트
// 이 컴포넌트는 모든 페이지 상단에 표시되는 메뉴입니다.
// 로그인 상태에 따라 다른 메뉴를 보여줍니다.

'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold hover:text-blue-400">
            Peka DevLog
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/blog"
              className="text-gray-400 hover:text-white transition-colors"
            >
              블로그
            </Link>

            {session ? (
              <>
                {session.user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    관리자
                  </Link>
                )}
                <span className="text-gray-500 text-sm">
                  {session.user.name || session.user.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  로그인
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

