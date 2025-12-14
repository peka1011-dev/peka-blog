// 댓글 API
// 이 파일은 댓글을 생성하고 조회하는 API 엔드포인트입니다.
// POST: 새 댓글 작성 (로그인한 사용자만 가능)
// GET: 댓글 목록 조회

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const commentSchema = z.object({
  content: z.string().min(1, '댓글 내용을 입력해주세요.').max(1000, '댓글은 1000자 이하여야 합니다.'),
  postId: z.string().min(1, '글 ID가 필요합니다.'),
})

// POST: 새 댓글 작성
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = commentSchema.parse(body)

    // 글 존재 확인
    const post = await prisma.post.findUnique({
      where: { id: validatedData.postId },
    })

    if (!post) {
      return NextResponse.json(
        { error: '글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 댓글 생성
    const comment = await prisma.comment.create({
      data: {
        content: validatedData.content,
        postId: validatedData.postId,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(
      { message: '댓글이 작성되었습니다.', comment },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Comment creation error:', error)
    return NextResponse.json(
      { error: '댓글 작성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// GET: 댓글 목록 조회 (특정 글의 댓글)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')

    if (!postId) {
      return NextResponse.json(
        { error: 'postId가 필요합니다.' },
        { status: 400 }
      )
    }

    const comments = await prisma.comment.findMany({
      where: { postId },
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
    })

    return NextResponse.json({ comments })
  } catch (error) {
    console.error('Comments fetch error:', error)
    return NextResponse.json(
      { error: '댓글을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

