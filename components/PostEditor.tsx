// 글 작성/수정 에디터 컴포넌트
// 이 컴포넌트는 Markdown 형식으로 글을 작성하고 수정할 수 있게 해줍니다.
// 미리보기 기능도 포함되어 있습니다.

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MarkdownRenderer } from './MarkdownRenderer'

interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  published: boolean
}

interface PostEditorProps {
  post?: Post
}

export function PostEditor({ post }: PostEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(post?.title || '')
  const [content, setContent] = useState(post?.content || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [published, setPublished] = useState(post?.published || false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const url = post ? `/api/posts/${post.slug}` : '/api/posts'
      const method = post ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          excerpt: excerpt || null,
          published,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        setError(data.error || '글 저장에 실패했습니다.')
      }
    } catch (err) {
      setError('글 저장 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          제목 *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
          요약 (SEO용, 선택)
        </label>
        <textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
          placeholder="글의 간단한 요약을 입력하세요..."
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="content" className="block text-sm font-medium">
            내용 (Markdown) *
          </label>
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            {preview ? '편집' : '미리보기'}
          </button>
        </div>
        {preview ? (
          <div className="border border-gray-700 rounded-lg p-6 bg-gray-900 min-h-[400px]">
            <MarkdownRenderer content={content} />
          </div>
        ) : (
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={20}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
            placeholder="# 제목&#10;&#10;글 내용을 Markdown 형식으로 작성하세요..."
          />
        )}
        <p className="mt-2 text-xs text-gray-500">
          Markdown 문법을 사용할 수 있습니다. 코드 블록은 언어를 지정하면 하이라이팅됩니다.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="published"
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="published" className="text-sm">
          공개하기
        </label>
      </div>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? '저장 중...' : '저장'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          취소
        </button>
      </div>
    </form>
  )
}

