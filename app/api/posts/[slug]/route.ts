// 특정 글 조회/수정/삭제 API
// 이 파일은 개별 글에 대한 CRUD 작업을 처리합니다.
// GET: 글 조회 (공개된 글만)
// PUT: 글 수정 (ADMIN만 가능)
// DELETE: 글 삭제 (ADMIN만 가능)

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { generateSlug } from '@/lib/utils'

const postSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  published: z.boolean().optional(),
})

// GET: 글 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: params.slug },
      include: {
        comments: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: '글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 비공개 글은 ADMIN만 볼 수 있음
    const session = await getServerSession(authOptions)
    if (!post.published && session?.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '접근 권한이 없습니다.' },
        { status: 403 }
      )
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Post fetch error:', error)
    return NextResponse.json(
      { error: '글을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// PUT: 글 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '관리자만 글을 수정할 수 있습니다.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = postSchema.parse(body)

    // slug가 변경되면 새 slug 생성
    let slug = params.slug
    if (validatedData.title) {
      slug = generateSlug(validatedData.title)
      
      // slug 중복 확인 (현재 글 제외)
      const existingPost = await prisma.post.findFirst({
        where: {
          slug,
          NOT: { slug: params.slug },
        },
      })

      if (existingPost) {
        return NextResponse.json(
          { error: '이미 사용 중인 제목입니다.' },
          { status: 400 }
        )
      }
    }

    const post = await prisma.post.update({
      where: { slug: params.slug },
      data: {
        ...validatedData,
        ...(slug !== params.slug && { slug }),
      },
    })

    return NextResponse.json({ message: '글이 수정되었습니다.', post })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Post update error:', error)
    return NextResponse.json(
      { error: '글 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// DELETE: 글 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '관리자만 글을 삭제할 수 있습니다.' },
        { status: 403 }
      )
    }

    await prisma.post.delete({
      where: { slug: params.slug },
    })

    return NextResponse.json({ message: '글이 삭제되었습니다.' })
  } catch (error) {
    console.error('Post delete error:', error)
    return NextResponse.json(
      { error: '글 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

