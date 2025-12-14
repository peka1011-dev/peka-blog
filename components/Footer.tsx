// 푸터 컴포넌트
// 이 컴포넌트는 모든 페이지 하단에 표시됩니다.

export function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-auto py-8">
      <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
        <p>© 2024 Peka DevLog. 학생 개발자 블로그.</p>
        <p className="mt-2">
          Kali Linux, Python, HTML 학습 기록
        </p>
      </div>
    </footer>
  )
}

