# 프로젝트 폴더 구조

```
peka-devlog-app/
├── app/                          # Next.js App Router
│   ├── api/                      # API 라우트
│   │   ├── auth/                 # 인증 관련 API
│   │   │   ├── [...nextauth]/   # NextAuth 엔드포인트
│   │   │   │   └── route.ts
│   │   │   └── register/         # 회원가입 API
│   │   │       └── route.ts
│   │   ├── posts/                # 글 관련 API
│   │   │   ├── route.ts          # 글 목록 조회, 글 작성
│   │   │   └── [slug]/           # 개별 글 조회/수정/삭제
│   │   │       └── route.ts
│   │   └── comments/             # 댓글 관련 API
│   │       ├── route.ts          # 댓글 목록 조회, 댓글 작성
│   │       └── [id]/             # 댓글 삭제
│   │           └── route.ts
│   ├── admin/                    # 관리자 페이지
│   │   ├── page.tsx              # 관리자 대시보드
│   │   ├── new/                  # 새 글 작성
│   │   │   └── page.tsx
│   │   └── edit/                 # 글 수정
│   │       └── [slug]/
│   │           └── page.tsx
│   ├── auth/                     # 인증 페이지
│   │   ├── signin/               # 로그인
│   │   │   └── page.tsx
│   │   └── signup/               # 회원가입
│   │       └── page.tsx
│   ├── blog/                     # 블로그 페이지
│   │   ├── page.tsx              # 블로그 목록
│   │   └── [slug]/               # 개별 글 상세
│   │       └── page.tsx
│   ├── layout.tsx                # 루트 레이아웃
│   ├── page.tsx                  # 홈 페이지
│   ├── providers.tsx             # NextAuth Provider
│   └── globals.css               # 전역 스타일
├── components/                    # React 컴포넌트
│   ├── Navbar.tsx                # 네비게이션 바
│   ├── Footer.tsx                # 푸터
│   ├── MarkdownRenderer.tsx      # Markdown 렌더러 (TOC 포함)
│   ├── CommentSection.tsx        # 댓글 섹션
│   ├── PostEditor.tsx            # 글 작성/수정 에디터
│   └── AdminPostList.tsx         # 관리자 글 목록
├── lib/                          # 유틸리티 함수
│   ├── prisma.ts                 # Prisma Client 싱글톤
│   ├── auth.ts                   # NextAuth 설정
│   └── utils.ts                  # 헬퍼 함수 (slug 생성 등)
├── prisma/                       # Prisma 설정
│   └── schema.prisma             # 데이터베이스 스키마
├── scripts/                      # 스크립트
│   └── init-admin.ts             # 관리자 계정 초기화
├── types/                        # TypeScript 타입 정의
│   └── next-auth.d.ts            # NextAuth 타입 확장
├── middleware.ts                 # Next.js 미들웨어 (권한 제어)
├── package.json                  # 의존성 관리
├── tsconfig.json                 # TypeScript 설정
├── next.config.js                # Next.js 설정
├── tailwind.config.ts            # Tailwind CSS 설정
├── postcss.config.js             # PostCSS 설정
├── .eslintrc.json                # ESLint 설정
├── .gitignore                    # Git 무시 파일
└── README.md                     # 프로젝트 문서
```

## 주요 파일 설명

### app/layout.tsx
- 모든 페이지에 공통으로 적용되는 레이아웃
- 메타데이터, 폰트, 전역 스타일 설정
- Navbar, Footer 포함

### app/page.tsx
- 홈 페이지
- 최근 공개된 글 목록 표시

### app/blog/[slug]/page.tsx
- 개별 블로그 글 상세 페이지
- Markdown 렌더링
- 댓글 섹션 포함
- SEO 최적화 (메타데이터)

### app/admin/page.tsx
- 관리자 대시보드
- 모든 글 목록 (공개/비공개)
- 글 수정/삭제 기능

### components/MarkdownRenderer.tsx
- Markdown을 HTML로 변환
- 코드 블록 하이라이팅 (Prism)
- 목차(TOC) 자동 생성
- 헤딩에 ID 추가 (앵커 링크)

### lib/auth.ts
- NextAuth 설정
- Credentials Provider (이메일 + 비밀번호)
- JWT 토큰에 role 포함
- 세션에 사용자 정보 저장

### middleware.ts
- `/admin` 경로 접근 제어
- ADMIN 권한 확인
- 권한 없으면 홈으로 리다이렉트

### prisma/schema.prisma
- 데이터베이스 스키마 정의
- User, Post, Comment 모델
- 관계 설정 (1:N)

