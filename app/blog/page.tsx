// 블로그 목록 페이지
// 이 페이지는 모든 공개된 블로그 글의 목록을 보여줍니다.

import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      createdAt: true,
    },
  })

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">블로그</h1>
      
      {posts.length === 0 ? (
        <p className="text-gray-400">아직 작성된 글이 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article
              key={post.id}
              className="border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
            >
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-semibold mb-2 hover:text-blue-400">
                  {post.title}
                </h2>
              </Link>
              {post.excerpt && (
                <p className="text-gray-400 mb-3">{post.excerpt}</p>
              )}
              <time className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString('ko-KR')}
              </time>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

