// 로그인 후 이동 경로는 같은 사이트 내부 경로만 허용한다.
export function safeNextPath(next: string | null, fallback: string) {
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  return fallback;
}
