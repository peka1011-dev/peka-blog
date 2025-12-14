// 새 글 작성 페이지
// 이 페이지는 관리자가 새로운 블로그 글을 작성할 수 있습니다.

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PostEditor } from '@/components/PostEditor'

export default async function NewPostPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">새 글 작성</h1>
      <PostEditor />
    </div>
  )
}

