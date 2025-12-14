// Markdown 렌더러 컴포넌트
// 이 컴포넌트는 Markdown 형식의 텍스트를 HTML로 변환하여 표시합니다.
// 코드 블록 하이라이팅과 목차(TOC) 생성을 포함합니다.

'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useEffect, useState } from 'react'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [toc, setToc] = useState<Array<{ id: string; text: string; level: number }>>([])

  useEffect(() => {
    // 목차 생성: Markdown의 헤딩(# ## ###)을 찾아서 목차 생성
    const headings = content.match(/^(#{1,3})\s+(.+)$/gm) || []
    const tocItems = headings.map((heading) => {
      const match = heading.match(/^(#{1,3})\s+(.+)$/)
      if (!match) return null
      const level = match[1].length
      const text = match[2]
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
      return { id, text, level }
    }).filter(Boolean) as Array<{ id: string; text: string; level: number }>
    
    setToc(tocItems)
  }, [content])

  return (
    <div className="flex gap-8">
      {/* 목차 사이드바 */}
      {toc.length > 0 && (
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <h3 className="text-sm font-semibold mb-3 text-gray-400">목차</h3>
            <nav className="space-y-1">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block text-sm text-gray-500 hover:text-white transition-colors ${
                    item.level === 1 ? 'pl-0' : item.level === 2 ? 'pl-4' : 'pl-8'
                  }`}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      )}

      {/* Markdown 콘텐츠 */}
      <article className="flex-grow prose prose-invert prose-lg max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // 코드 블록 하이라이팅
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '')
              const language = match ? match[1] : ''
              
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={language}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            },
            // 헤딩에 ID 추가 (목차 링크용)
            h1({ node, children, ...props }: any) {
              const id = String(children)
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
              return <h1 id={id} {...props}>{children}</h1>
            },
            h2({ node, children, ...props }: any) {
              const id = String(children)
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
              return <h2 id={id} {...props}>{children}</h2>
            },
            h3({ node, children, ...props }: any) {
              const id = String(children)
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
              return <h3 id={id} {...props}>{children}</h3>
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  )
}

