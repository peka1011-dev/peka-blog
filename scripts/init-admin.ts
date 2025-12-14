// 관리자 계정 초기화 스크립트
// 이 스크립트는 환경변수에서 관리자 계정 정보를 읽어서 데이터베이스에 생성합니다.
// 최초 실행 시 한 번만 실행하면 됩니다.

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    console.error('❌ ADMIN_EMAIL과 ADMIN_PASSWORD 환경변수를 설정해주세요.')
    process.exit(1)
  }

  // 기존 관리자 확인
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (existingAdmin) {
    console.log('✅ 관리자 계정이 이미 존재합니다.')
    return
  }

  // 비밀번호 해시
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  // 관리자 계정 생성
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
      name: '관리자',
    },
  })

  console.log('✅ 관리자 계정이 생성되었습니다.')
  console.log(`   이메일: ${admin.email}`)
  console.log(`   역할: ${admin.role}`)
}

main()
  .catch((e) => {
    console.error('❌ 오류 발생:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

