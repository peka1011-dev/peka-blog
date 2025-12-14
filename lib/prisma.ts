// Prisma Client 싱글톤 패턴
// 이 파일은 데이터베이스 연결을 관리합니다.
// 개발 중에는 여러 번 연결이 생성되지 않도록 합니다.

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

