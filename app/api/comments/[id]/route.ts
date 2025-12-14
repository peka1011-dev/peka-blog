// 댓글 삭제 API
// 이 파일은 댓글을 삭제하는 API 엔드포인트입니다.
// 작성자 또는 ADMIN만 삭제할 수 있습니다.

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// DELETE: 댓글 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    // 댓글 찾기
    const comment = await prisma.comment.findUnique({
      where: { id: params.id },
    })

    if (!comment) {
      return NextResponse.json(
        { error: '댓글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 권한 확인: 작성자 또는 ADMIN만 삭제 가능
    if (comment.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '댓글을 삭제할 권한이 없습니다.' },
        { status: 403 }
      )
    }

    await prisma.comment.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: '댓글이 삭제되었습니다.' })
  } catch (error) {
    console.error('Comment delete error:', error)
    return NextResponse.json(
      { error: '댓글 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

