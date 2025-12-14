// 관리자 글 목록 컴포넌트
// 이 컴포넌트는 관리자 페이지에서 글 목록을 표시하고 관리할 수 있게 해줍니다.

'use client'

import Link from 'next/link'
import { useState } from 'react'

interface Post {
  id: string
  title: string
  slug: string
  published: boolean
  createdAt: Date
  updatedAt: Date
}

interface AdminPostListProps {
  posts: Post[]
}

export function AdminPostList({ posts }: AdminPostListProps) {
  const [postList, setPostList] = useState(posts)

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`"${title}" 글을 삭제하시겠습니까?`)) return

    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setPostList(postList.filter((post) => post.slug !== slug))
        alert('글이 삭제되었습니다.')
      } else {
        alert('글 삭제에 실패했습니다.')
      }
    } catch (err) {
      alert('글 삭제 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="space-y-4">
      {postList.length === 0 ? (
        <p className="text-gray-400">아직 작성된 글이 없습니다.</p>
      ) : (
        <div className="border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="text-left p-4">제목</th>
                <th className="text-left p-4">상태</th>
                <th className="text-left p-4">작성일</th>
                <th className="text-left p-4">작업</th>
              </tr>
            </thead>
            <tbody>
              {postList.map((post) => (
                <tr
                  key={post.id}
                  className="border-t border-gray-800 hover:bg-gray-900/50"
                >
                  <td className="p-4">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-blue-400"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        post.published
                          ? 'bg-green-900/50 text-green-400'
                          : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {post.published ? '공개' : '비공개'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/edit/${post.slug}`}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        수정
                      </Link>
                      <button
                        onClick={() => handleDelete(post.slug, post.title)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

