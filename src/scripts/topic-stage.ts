// Knowledge 주제 장면의 지휘자 (lifestories.org/discover의 전환을 참고했다).
// 태그를 누르면: ① 누른 자리에서 물결(ripple)이 퍼져 나가고 별이 서서히 빨라지며 화면이 살짝 확대됐다 돌아오는 동안(1초 남짓)
// 태그들이 바깥으로 흩어지며 사라지고 → ② 잠깐 별만 남았다가 ③ 새 태그들이 0.4배에서 부드럽게 커지며 나타나 제 크기에서 멈춘다.
// 모든 값은 갑자기 켜지지 않고 부드럽게 올랐다 내려간다(lifestories.org 분석: 물결은 0.5초에 걸쳐 생기고, 확대는 1초에 걸쳐 22% 지점에서 정점을 찍는다).
// 좌측 하단 칩은 전환 중 내려갔다가 새 경로로 다시 올라온다.
// 하위가 하나뿐이어도 건너뛰지 않고, 끝(글 목록)은 평범한 페이지 이동이다. 뒤로 가기·앞으로 가기도 같은 화면 안에서 처리한다.
// 별은 scene.ts(메인과 같은 three.js 장면), 태그의 움직임·끌기는 topic-float.ts.
import { startScene, type SceneHandle } from '@/scripts/scene';
import { createField } from '@/scripts/topic-float';
import { findStage, levelTags, topicHref, type StageNode, type Tag } from '@/lib/topics';

const space = document.querySelector<HTMLElement>('[data-space]');
const dataEl = space?.querySelector<HTMLScriptElement>('script[data-tree]');
const list = space?.querySelector<HTMLElement>('.field ul');
const chipsEl = document.querySelector<HTMLElement>('[data-chips]');

if (space && dataEl?.textContent && list && chipsEl) {
  const tree: StageNode[] = JSON.parse(dataEl.textContent);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sky = space.querySelector<HTMLCanvasElement>('[data-sky]');
  const noteEl = space.querySelector<HTMLElement>('[data-note]');
  const titleEl = space.querySelector<HTMLElement>('[data-title]');
  const lead = space.dataset.lead ?? '';
  const siteName = document.title.split(' — ').at(-1) ?? '';
  let current = space.dataset.path ?? '';
  let busy = false;

  const EXIT_MS = 650; // 태그가 흩어져 사라지는 데 걸리는 시간(지연 포함)
  const STARS_ONLY_MS = 250; // 별만 남아 있는 시간(짧게 둬서 장면이 끊겨 보이지 않게 한다)
  const ENTER_MS = 1700; // 태그가 나타나 제 크기가 되기까지(지연 포함)
  const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
  const html = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
  const hrefOf = (path: string) => (path ? topicHref(path) : '/knowledge/');
  const pathOf = (href: string) => decodeURIComponent(new URL(href, location.href).pathname).replace(/^\/knowledge\/(topics\/)?/, '').replace(/\/$/, '');

  // ── 별 장면과 울렁임 ──
  let scene: SceneHandle | null = null;
  if (sky) {
    try {
      scene = startScene(sky, { post: true });
    } catch {
      sky.hidden = true; // WebGL을 못 쓰면 별 없이 태그만 보인다
    }
  }
  const field = createField(space);
  let clock = 0;
  let motionAt = -1; // 전환이 시작된 시각(clock 기준). 음수면 전환 중이 아니다
  const smooth = (x: number) => {
    const u = Math.min(1, Math.max(0, x));
    return u * u * (3 - 2 * u);
  };
  /** 별의 속도·후처리 세기: 0.45초에 걸쳐 부드럽게 올랐다가 천천히 가라앉는다 (갑자기 켜지지 않는다) */
  const pulse = (t: number) => smooth(t / 0.45) * Math.exp(-Math.max(0, t - 0.45) * 1.7);
  /** 화면 확대: 1초 동안 22% 지점에서 정점(+4%)을 찍고 돌아온다 (lifestories의 zoom punch와 같은 모양) */
  const punch = (t: number) => {
    const u = t / 1.0;
    if (u <= 0 || u >= 1) return 0;
    return smooth(u < 0.22 ? u / 0.22 : 1 - (u - 0.22) / 0.78);
  };

  let last = performance.now();
  function frame(now: number) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    clock += dt;
    let burst = 0;
    let zoom = 1;
    if (motionAt >= 0) {
      const t = clock - motionAt;
      burst = pulse(t);
      zoom = 1 + 0.04 * punch(t);
      if (t > 4) motionAt = -1;
    }
    space!.style.setProperty('--wob-s', zoom.toFixed(4));
    scene?.setFx(burst);
    scene?.update(0.35 + 8 * burst * burst, 0.14 * burst, dt, clock, 1);
    field.tick(dt);
    requestAnimationFrame(frame);
  }
  /** 전환 시작: (x, y)는 누른 자리(뷰포트 px). 물결이 거기서 퍼진다 */
  const startMotion = (x: number, y: number) => {
    motionAt = clock;
    scene?.ripple(x, y);
  };

  // ── 태그 ──
  const tagLi = (t: Tag, i: number) =>
    `<li class="tag-item" style="--hue:var(--tag-${t.color});--i:${i}"><a class="tag" href="${html(t.href)}" data-path="${html(t.path ?? '')}"><span class="tag-name">${html(t.name)}</span><span class="tag-count" aria-label="${t.count}개의 노트">${t.count}</span></a><span class="tag-ghost" aria-hidden="true"><span class="tag-name">${html(t.name)}</span><span class="tag-count">${t.count}</span></span><span class="tag-hint" aria-hidden="true">Click to reveal notes about this topic</span></li>`;
  const lis = () => [...list!.querySelectorAll<HTMLElement>('li')];

  function place(path: string) {
    const node = findStage(tree, path);
    const tags = levelTags(node, node ? node.children : tree);
    list!.innerHTML = tags.map(tagLi).join('');
    field.load(lis(), hrefOf(path));
  }

  // ── 좌측 하단 칩 ──
  function renderChips(path: string) {
    const segs = path ? path.split('/') : [];
    const node = findStage(tree, path);
    chipsEl!.classList.remove('is-in');
    if (!node) {
      chipsEl!.innerHTML = '';
      return;
    }
    const chips = segs.map((_, i) => {
      const p = segs.slice(0, i + 1).join('/');
      return { name: findStage(tree, p)?.name ?? p, up: i === 0 ? '/knowledge/' : topicHref(segs.slice(0, i).join('/')) };
    });
    chipsEl!.innerHTML =
      `<span class="chips-total" style="--i:0">Total: ${node.count}</span>` +
      chips
        .map(
          (c, i) =>
            `<a class="chip" href="${html(c.up)}" style="--i:${i + 1}" aria-label="${html(c.name)} 해제"><span class="chip-label">${html(c.name)}</span><svg class="chip-x" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" fill="none"/></svg></a>`,
        )
        .join('');
  }
  const chipsIn = () => requestAnimationFrame(() => requestAnimationFrame(() => chipsEl!.classList.add('is-in')));

  function setHeading(path: string) {
    const node = findStage(tree, path);
    const name = node?.name ?? 'Knowledge';
    if (titleEl) titleEl.textContent = name;
    if (noteEl) noteEl.textContent = node ? (node.description ?? '') : lead;
    document.title = node ? `${name} — ${siteName}` : `Knowledge — ${siteName}`;
  }

  // ── 전환 ──
  function scatter() {
    const els = lis();
    const cx = space!.clientWidth / 2;
    const cy = space!.clientHeight / 2;
    const rects = els.map((el) => el.getBoundingClientRect());
    const far = Math.max(1, ...rects.map((r) => Math.hypot(r.x + r.width / 2 - cx, r.y + r.height / 2 - cy)));
    els.forEach((el, i) => {
      const r = rects[i];
      const delay = (Math.hypot(r.x + r.width / 2 - cx, r.y + r.height / 2 - cy) / far) * 160 + Math.random() * 150;
      const a = Math.random() * Math.PI * 2;
      const d = (14 + Math.random() * 16) * 2.2;
      el.style.setProperty('--delay', `${delay.toFixed(0)}ms`);
      el.style.setProperty('--dur', `${(240 + Math.random() * 130).toFixed(0)}ms`);
      el.style.setProperty('--ex', `${(Math.cos(a) * d).toFixed(1)}px`);
      el.style.setProperty('--ey', `${(Math.sin(a) * d).toFixed(1)}px`);
    });
  }
  function bloom() {
    for (const el of lis()) {
      el.style.setProperty('--delay', `${(Math.random() * 260).toFixed(0)}ms`);
      el.style.setProperty('--dur', `${(1100 + Math.random() * 350).toFixed(0)}ms`);
    }
  }

  const center = (): [number, number] => [innerWidth / 2, innerHeight / 2];

  /** 다음 단계로 (push: 주소를 새로 쌓을지. 뒤로 가기에서는 false, from: 물결이 시작될 자리) */
  async function goLevel(path: string, push: boolean, from: [number, number] = center()) {
    if (busy) return;
    busy = true;
    chipsEl!.classList.remove('is-in');
    if (reduce) {
      place(path);
      setHeading(path);
      renderChips(path);
      chipsIn();
    } else {
      startMotion(...from);
      scatter();
      space!.classList.add('is-exiting');
      await wait(EXIT_MS);
      space!.classList.remove('is-exiting');
      space!.classList.add('is-hidden');
      place(path); // 새 태그는 숨긴 채 놓아 둔다
      setHeading(path); // 안내 문구도 이때(숨겨진 동안) 새 단계 것으로 바꾼다. 늦게 바뀌면 이전 단계 설명이 남아 보인다
      await wait(STARS_ONLY_MS);
      bloom();
      space!.classList.remove('is-hidden');
      space!.classList.add('is-entering');
      renderChips(path);
      chipsIn();
      await wait(ENTER_MS);
      space!.classList.remove('is-entering');
    }
    if (push) history.pushState(null, '', hrefOf(path));
    current = path;
    busy = false;
  }

  /** 끝(글 목록)이나 이 주제의 직접 글 목록은 평범한 페이지 이동 */
  async function goPage(href: string, from: [number, number] = center()) {
    if (busy) return;
    busy = true;
    chipsEl!.classList.remove('is-in');
    if (!reduce) {
      startMotion(...from);
      scatter();
      space!.classList.add('is-exiting');
      await wait(EXIT_MS);
    }
    location.href = href;
  }

  space.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a.tag');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    // 하위가 있으면(하나뿐이어도) 반드시 별 세계를 거쳐 들어가고, 하위가 없는 끝이나 직접 글 목록만 페이지로 간다
    const node = a.dataset.path ? findStage(tree, a.dataset.path) : null;
    const from: [number, number] = [e.clientX, e.clientY]; // 키보드로 누르면 (0, 0)이라 태그 가운데에서 시작한다
    if (!from[0] && !from[1]) {
      const r = a.getBoundingClientRect();
      from[0] = r.x + r.width / 2;
      from[1] = r.y + r.height / 2;
    }
    if (node && !node.leaf) return void goLevel(node.path, true, from);
    void goPage(a.href, from);
  });

  // 칩의 ✕: 바로 위 단계로 (건너뛰지 않고 그 단계 그대로)
  chipsEl.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a.chip');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const r = a.getBoundingClientRect();
    void goLevel(pathOf(a.href), true, [r.x + r.width / 2, r.y + r.height / 2]);
  });

  // 뒤로·앞으로 가기: 장면 단계면 같은 화면 안에서, 글 목록 페이지면 새로 불러온다
  addEventListener('popstate', () => {
    const path = pathOf(location.href);
    const node = findStage(tree, path);
    if (path === current) return;
    if (path && (!node || node.leaf || location.pathname.includes('/_notes/'))) return location.reload();
    void goLevel(path, false);
  });

  // 뒤로 가기로 돌아왔을 때(bfcache) 전환 중이던 상태가 남지 않게
  addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    busy = false;
    space.classList.remove('is-exiting', 'is-hidden', 'is-entering');
    chipsEl.classList.add('is-in');
  });

  // 처음 화면
  space.classList.add('is-floating');
  field.load(lis(), hrefOf(current));
  if (!reduce) requestAnimationFrame(frame); // 움직임 줄이기: 별은 scene.ts가 한 장면만 그리고 태그는 제자리에 있다
}
