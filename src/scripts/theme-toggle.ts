// ThemeToggle 버튼 동작: system → light → dark 순환.
// 선택은 localStorage에 저장하고(system은 저장하지 않음), 첫 페인트 전 적용은 theme-init.js가 맡는다.
// 버튼에 보이는 현재 값은 CSS가 <html data-theme>를 보고 표시하므로 여기서 텍스트를 바꾸지 않는다.

type Theme = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'theme'; // theme-init.js와 같은 키
const ORDER: readonly Theme[] = ['system', 'light', 'dark'];

function currentTheme(): Theme {
  const value = document.documentElement.getAttribute('data-theme');
  return value === 'light' || value === 'dark' ? value : 'system';
}

// 색이 바뀌는 순간에는 색 전환(transition)을 끈다. 배경은 즉시 바뀌는데 링크 색만 140ms 동안
// 중간 색을 지나면 글자가 잠깐 거의 안 보인다. base.css의 [data-theme-switching] 규칙이 전환을 끄고,
// 변경이 그려진 프레임이 지난 뒤(rAF 두 번) 속성을 떼어 hover 전환을 되살린다.
function pauseTransitions(): void {
  const root = document.documentElement;
  root.setAttribute('data-theme-switching', '');
  requestAnimationFrame(() => requestAnimationFrame(() => root.removeAttribute('data-theme-switching')));
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  pauseTransitions();
  root.setAttribute('data-theme', theme);
  void getComputedStyle(root).color; // 스타일을 지금 계산시켜 새 색이 전환 없이 적용되게 한다
  try {
    if (theme === 'system') localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // 저장할 수 없는 환경: 이번 방문 동안만 적용된다
  }
}

function nextTheme(theme: Theme): Theme {
  return ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length] ?? 'system';
}

// 헤더에는 토글이 두 번 렌더링된다(모바일/데스크톱). 둘 다 같은 동작을 한다.
document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
  button.addEventListener('click', () => applyTheme(nextTheme(currentTheme())));
});

// system 상태에서 OS 설정이 바뀌는 경우(일몰 자동 전환 등)도 같은 이유로 전환을 끈다.
// 이 이벤트는 스타일 재계산 전에 발생하므로, 새 색이 전환 없이 적용된다.
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', pauseTransitions);
