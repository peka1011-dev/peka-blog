// 관리자 페이지
// 이 페이지는 ADMIN 권한을 가진 사용자만 접근할 수 있습니다.
// 블로그 글을 작성, 수정, 삭제할 수 있습니다.

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminPostList } from '@/components/AdminPostList'
import Link from 'next/link'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  // 로그인 확인
  if (!session) {
    redirect('/auth/signin')
  }

  // ADMIN 권한 확인
  if (session.user.role !== 'ADMIN') {
    redirect('/')
  }

  // 모든 글 가져오기 (공개/비공개 모두)
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">관리자 페이지</h1>
        <Link
          href="/admin/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          새 글 작성
        </Link>
      </div>

      <AdminPostList posts={posts} />
    </div>
  )
}

