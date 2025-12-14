// 글 수정 페이지
// 이 페이지는 관리자가 기존 블로그 글을 수정할 수 있습니다.

import { redirect, notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PostEditor } from '@/components/PostEditor'

interface EditPostPageProps {
  params: { slug: string }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  })

  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">글 수정</h1>
      <PostEditor post={post} />
    </div>
  )
}

