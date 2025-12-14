// 댓글 섹션 컴포넌트
// 이 컴포넌트는 블로그 글 하단에 댓글을 표시하고 작성할 수 있게 해줍니다.
// 로그인한 사용자만 댓글을 작성할 수 있습니다.

'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    email: string
    name: string | null
  }
}

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 댓글 불러오기
  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`)
      const data = await res.json()
      if (res.ok) {
        setComments(data.comments || [])
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err)
    }
  }

  // 댓글 작성
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      setError('로그인이 필요합니다.')
      return
    }

    if (!content.trim()) {
      setError('댓글 내용을 입력해주세요.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          postId,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setContent('')
        fetchComments() // 댓글 목록 새로고침
      } else {
        setError(data.error || '댓글 작성에 실패했습니다.')
      }
    } catch (err) {
      setError('댓글 작성 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 댓글 삭제
  const handleDelete = async (commentId: string) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchComments() // 댓글 목록 새로고침
      } else {
        alert('댓글 삭제에 실패했습니다.')
      }
    } catch (err) {
      alert('댓글 삭제 중 오류가 발생했습니다.')
    }
  }

  return (
    <section className="mt-12 border-t border-gray-800 pt-8">
      <h2 className="text-2xl font-semibold mb-6">댓글 ({comments.length})</h2>

      {/* 댓글 작성 폼 */}
      {session ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글을 입력하세요..."
            rows={4}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors disabled:opacity-50"
          >
            {loading ? '작성 중...' : '댓글 작성'}
          </button>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-900 border border-gray-700 rounded-lg text-center">
          <p className="text-gray-400 mb-2">댓글을 작성하려면 로그인이 필요합니다.</p>
          <Link
            href="/auth/signin"
            className="text-blue-400 hover:text-blue-300"
          >
            로그인하기
          </Link>
        </div>
      )}

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-400">아직 댓글이 없습니다.</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="border border-gray-800 rounded-lg p-4 bg-gray-900"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm">
                    {comment.user.name || comment.user.email}
                  </p>
                  <time className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleString('ko-KR')}
                  </time>
                </div>
                {(session?.user.id === comment.user.id ||
                  session?.user.role === 'ADMIN') && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    삭제
                  </button>
                )}
              </div>
              <p className="text-gray-300 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

