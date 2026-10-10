// 날짜 표기. 콘텐츠의 date는 'YYYY-MM-DD'를 UTC 자정으로 읽은 값이므로 UTC 기준으로 자른다 (시간대에 따라 하루 밀리지 않게).
export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10).replaceAll('-', '.');
}
