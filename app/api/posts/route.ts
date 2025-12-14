// 블로그 글 API
// 이 파일은 블로그 글을 생성하고 조회하는 API 엔드포인트입니다.
// POST: 새 글 작성 (ADMIN만 가능)
// GET: 글 목록 조회 (공개된 글만)

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { generateSlug } from '@/lib/utils'

// 글 작성 스키마
const postSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
  excerpt: z.string().optional(),
  published: z.boolean().default(false),
})

// POST: 새 글 작성 (ADMIN만 가능)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // 로그인 확인
    if (!session) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    // ADMIN 권한 확인
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '관리자만 글을 작성할 수 있습니다.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = postSchema.parse(body)

    // slug 생성
    const slug = generateSlug(validatedData.title)

    // slug 중복 확인
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    })

    if (existingPost) {
      return NextResponse.json(
        { error: '이미 사용 중인 제목입니다. 다른 제목을 사용해주세요.' },
        { status: 400 }
      )
    }

    // 글 생성
    const post = await prisma.post.create({
      data: {
        title: validatedData.title,
        slug,
        content: validatedData.content,
        excerpt: validatedData.excerpt,
        published: validatedData.published,
      },
    })

    return NextResponse.json(
      { message: '글이 작성되었습니다.', post },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Post creation error:', error)
    return NextResponse.json(
      { error: '글 작성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// GET: 글 목록 조회 (공개된 글만)
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Posts fetch error:', error)
    return NextResponse.json(
      { error: '글 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

