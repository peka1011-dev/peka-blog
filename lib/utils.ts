// 유틸리티 함수들
// 이 파일은 프로젝트 전반에서 사용되는 헬퍼 함수들을 포함합니다.

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// slug 생성 함수 (제목을 URL 친화적인 형식으로 변환)
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // 특수문자 제거
    .replace(/[\s_-]+/g, '-') // 공백을 하이픈으로
    .replace(/^-+|-+$/g, '') // 앞뒤 하이픈 제거
}

