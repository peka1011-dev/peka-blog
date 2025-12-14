# Peka DevLog - 학생 개발자 블로그

Kali Linux, Python, HTML을 공부하며 배운 내용을 기록하는 개인 블로그 웹사이트입니다.

## 프로젝트 개요

- **프로젝트 이름**: peka-devlog-app
- **성격**: 학생 개발 블로그 (학습 기록용)
- **기술 스택**: Next.js 14, TypeScript, Tailwind CSS, Prisma, SQLite, NextAuth

## 주요 기능

1. **회원가입 / 로그인**
   - 이메일 + 비밀번호 방식
   - 비밀번호는 bcrypt로 해시 처리
   - JWT 기반 세션 관리

2. **권한 시스템**
   - `ADMIN`: 블로그 글 작성/수정/삭제 가능
   - `USER`: 댓글 작성 가능
   - 비로그인: 글 읽기만 가능

3. **관리자 기능**
   - `/admin` 페이지에서 글 관리
   - Markdown 에디터로 글 작성
   - 글 공개/비공개 설정
   - 미리보기 기능

4. **블로그 시스템**
   - `/blog/[slug]` 구조로 개별 글 표시
   - Markdown 렌더링
   - 코드 블록 하이라이팅 (bash, python, html 등)
   - 목차(TOC) 자동 생성
   - SEO 최적화

5. **댓글 기능**
   - 로그인한 사용자만 댓글 작성 가능
   - 작성자 또는 ADMIN만 삭제 가능
   - XSS 방지 처리

## 프로젝트 구조

```
peka-devlog-app/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   │   ├── auth/         # 인증 관련 API
│   │   ├── posts/        # 글 관련 API
│   │   └── comments/     # 댓글 관련 API
│   ├── admin/            # 관리자 페이지
│   ├── auth/             # 로그인/회원가입 페이지
│   ├── blog/             # 블로그 페이지
│   ├── layout.tsx        # 루트 레이아웃
│   ├── page.tsx          # 홈 페이지
│   └── globals.css       # 전역 스타일
├── components/            # React 컴포넌트
│   ├── Navbar.tsx        # 네비게이션 바
│   ├── Footer.tsx        # 푸터
│   ├── MarkdownRenderer.tsx  # Markdown 렌더러
│   ├── CommentSection.tsx    # 댓글 섹션
│   ├── PostEditor.tsx        # 글 작성/수정 에디터
│   └── AdminPostList.tsx     # 관리자 글 목록
├── lib/                  # 유틸리티 함수
│   ├── prisma.ts         # Prisma Client
│   ├── auth.ts           # NextAuth 설정
│   └── utils.ts          # 헬퍼 함수
├── prisma/               # Prisma 설정
│   └── schema.prisma     # 데이터베이스 스키마
├── scripts/              # 스크립트
│   └── init-admin.ts     # 관리자 계정 초기화
├── types/                 # TypeScript 타입 정의
│   └── next-auth.d.ts    # NextAuth 타입 확장
├── middleware.ts         # Next.js 미들웨어
└── package.json          # 의존성 관리
```

## Prisma Schema 설명

### User (사용자)
- `id`: 고유 식별자
- `email`: 이메일 (고유)
- `password`: 해시된 비밀번호
- `name`: 이름 (선택)
- `role`: 역할 (ADMIN 또는 USER)
- `comments`: 작성한 댓글 목록

### Post (블로그 글)
- `id`: 고유 식별자
- `title`: 제목
- `slug`: URL에 사용되는 고유 식별자
- `content`: Markdown 형식의 글 내용
- `excerpt`: 글 요약 (SEO용)
- `published`: 공개 여부
- `comments`: 댓글 목록

### Comment (댓글)
- `id`: 고유 식별자
- `content`: 댓글 내용
- `postId`: 속한 글의 ID
- `userId`: 작성자 ID
- `post`: 글 관계
- `user`: 작성자 관계

## 로그인 / 권한 흐름

### 1. 회원가입
1. 사용자가 `/auth/signup`에서 이메일, 비밀번호 입력
2. `/api/auth/register`로 POST 요청
3. 비밀번호를 bcrypt로 해시 처리
4. 데이터베이스에 USER 역할로 저장

### 2. 로그인
1. 사용자가 `/auth/signin`에서 이메일, 비밀번호 입력
2. NextAuth의 Credentials Provider가 인증 처리
3. 비밀번호 확인 후 JWT 토큰 생성
4. 세션에 사용자 정보 저장 (id, email, role)

### 3. 권한 확인
- **ADMIN**: `/admin` 경로 접근 가능, 글 작성/수정/삭제 가능
- **USER**: 댓글 작성 가능, 글 읽기 가능
- **비로그인**: 글 읽기만 가능

### 4. 미들웨어 보호
- `middleware.ts`에서 `/admin` 경로 접근 제어
- ADMIN 권한이 없으면 홈으로 리다이렉트

## 로컬 실행 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
# 데이터베이스 URL (SQLite)
DATABASE_URL="file:./dev.db"

# NextAuth 설정
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# 최초 관리자 계정 설정
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your-admin-password-here"
```

**중요**: `NEXTAUTH_SECRET`은 랜덤한 문자열로 변경하세요. 다음 명령어로 생성할 수 있습니다:

```bash
openssl rand -base64 32
```

### 3. 데이터베이스 초기화

```bash
# Prisma Client 생성
npm run db:generate

# 데이터베이스 스키마 적용
npm run db:push
```

### 4. 관리자 계정 생성

```bash
npm run init-admin
```

이 명령어는 `.env` 파일의 `ADMIN_EMAIL`과 `ADMIN_PASSWORD`를 사용하여 관리자 계정을 생성합니다.

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 관리자 계정 설정 방법

### 방법 1: 스크립트 사용 (권장)

`.env` 파일에 관리자 정보를 설정한 후:

```bash
npm run init-admin
```

### 방법 2: 수동 생성

1. 회원가입 페이지(`/auth/signup`)에서 계정 생성
2. Prisma Studio에서 역할 변경:

```bash
npm run db:studio
```

3. 생성된 사용자의 `role`을 `ADMIN`으로 변경

## Vercel 무료 배포 방법

### 1. GitHub에 코드 푸시

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Vercel에 프로젝트 연결

1. [Vercel](https://vercel.com)에 로그인
2. "New Project" 클릭
3. GitHub 저장소 선택
4. 프로젝트 설정:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (기본값)
   - **Output Directory**: `.next` (기본값)

### 3. 환경변수 설정

Vercel 대시보드에서 "Settings" > "Environment Variables"에 다음 변수 추가:

- `DATABASE_URL`: SQLite는 Vercel에서 사용할 수 없으므로, **Supabase** 또는 다른 PostgreSQL 서비스를 사용해야 합니다.
- `NEXTAUTH_URL`: 배포된 도메인 (예: `https://your-app.vercel.app`)
- `NEXTAUTH_SECRET`: 랜덤 문자열
- `ADMIN_EMAIL`: 관리자 이메일
- `ADMIN_PASSWORD`: 관리자 비밀번호

### 4. Prisma Schema 수정 (PostgreSQL 사용 시)

`prisma/schema.prisma`에서:

```prisma
datasource db {
  provider = "postgresql"  // sqlite → postgresql로 변경
  url      = env("DATABASE_URL")
}
```

그리고 `DATABASE_URL`을 PostgreSQL 연결 문자열로 설정:

```
DATABASE_URL="postgresql://user:password@host:port/database"
```

### 5. 배포 및 마이그레이션

1. Vercel에서 "Deploy" 클릭
2. 배포 완료 후, Vercel Functions에서 관리자 계정 초기화 스크립트 실행

또는 Vercel CLI 사용:

```bash
npm i -g vercel
vercel login
vercel
```

### 6. 무료 도메인 연결 (선택)

Vercel은 기본적으로 `*.vercel.app` 도메인을 제공합니다. 커스텀 도메인을 연결하려면:

1. Vercel 대시보드 > Settings > Domains
2. 원하는 도메인 입력
3. DNS 설정 안내에 따라 설정

## 보안 고려사항

이 프로젝트는 학생 프로젝트 수준의 보안을 구현했습니다:

- ✅ 비밀번호 해시 처리 (bcrypt)
- ✅ JWT 기반 세션 관리
- ✅ 입력값 검증 (Zod)
- ✅ 권한 기반 접근 제어
- ✅ XSS 방지 (React의 기본 이스케이핑)
- ✅ CSRF 보호 (NextAuth 기본 제공)

**참고**: 프로덕션 환경에서는 추가 보안 조치가 필요할 수 있습니다.

## 학습 주제

이 블로그는 다음 주제를 다룹니다:

- Kali Linux 기초 명령어
- 해킹 공부하면서 배운 개념 정리 (합법/학습 목적)
- Python 기초 문법, 문제 풀이
- HTML 기본 구조, 웹 기초
- 에러 해결 기록

## 라이선스

이 프로젝트는 개인 학습 목적으로 제작되었습니다.

## 문의

문제가 발생하거나 질문이 있으시면 이슈를 등록해주세요.
