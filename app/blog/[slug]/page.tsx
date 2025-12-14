// 블로그 글 상세 페이지
// 이 페이지는 개별 블로그 글을 표시합니다.
// Markdown 렌더링, 댓글 기능을 포함합니다.

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { CommentSection } from '@/components/CommentSection'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import type { Metadata } from 'next'

interface BlogPostPageProps {
  params: { slug: string }
}

// SEO를 위한 메타데이터 생성
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  })

  if (!post || !post.published) {
    return {
      title: '글을 찾을 수 없습니다',
    }
  }

  return {
    title: `${post.title} | Peka DevLog`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: 'article',
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const session = await getServerSession(authOptions)
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  })

  if (!post) {
    notFound()
  }

  // 비공개 글은 ADMIN만 볼 수 있음
  if (!post.published && session?.user.role !== 'ADMIN') {
    notFound()
  }

  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <time>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</time>
          {post.updatedAt.getTime() !== post.createdAt.getTime() && (
            <span className="text-gray-500">
              (수정: {new Date(post.updatedAt).toLocaleDateString('ko-KR')})
            </span>
          )}
        </div>
      </header>

      <div className="prose prose-invert max-w-none">
        <MarkdownRenderer content={post.content} />
      </div>

      <CommentSection postId={post.id} />
    </article>
  )
}

