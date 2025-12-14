// 홈 페이지
// 이 페이지는 블로그의 메인 페이지입니다.
// 최근 공개된 글 목록을 보여줍니다.

import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function Home() {
  // 공개된 글만 최신순으로 가져오기
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 5, // 최근 5개만
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
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Peka DevLog</h1>
        <p className="text-lg text-gray-400">
          Kali Linux, Python, HTML을 공부하며 배운 내용을 기록하는 개발 블로그
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">최근 글</h2>
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
                  <h3 className="text-xl font-semibold mb-2 hover:text-blue-400">
                    {post.title}
                  </h3>
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
      </section>
    </div>
  )
}

