// Knowledge 주제 장면의 지휘자 (lifestories.org/discover의 전환을 참고했다).
// 태그를 누르면: ① 태그들이 바깥으로 흩어지며 사라지는 동안(약 0.6초) 별이 울렁이고 → ② 0.4초 동안 별만 남아 울렁이다가
// ③ 새 태그들이 0.4배에서 점점 커지며 나타나 제 크기에서 멈춘다. 좌측 하단 칩은 전환 중 내려갔다가 새 경로로 다시 올라온다.
// 하위가 하나뿐인 단계는 건너뛰고, 끝(글 목록)은 평범한 페이지 이동이다. 뒤로 가기·앞으로 가기도 같은 화면 안에서 처리한다.
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
  const STARS_ONLY_MS = 400; // 별만 남아 울렁이는 시간
  const ENTER_MS = 1700; // 태그가 나타나 제 크기가 되기까지(지연 포함)
  const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
  const html = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
  const hrefOf = (path: string) => (path ? topicHref(path) : '/knowledge/');
  const pathOf = (href: string) => decodeURIComponent(new URL(href, location.href).pathname).replace(/^\/knowledge\/(topics\/)?/, '').replace(/\/$/, '');

  // ── 별 장면과 울렁임 ──
  let scene: SceneHandle | null = null;
  if (sky) {
    try {
      scene = startScene(sky);
    } catch {
      sky.hidden = true; // WebGL을 못 쓰면 별 없이 태그만 보인다
    }
  }
  const field = createField(space);
  let clock = 0;
  let burst = 0; // 전환 때 1에서 0으로 잦아든다: 별이 빨리 흘러오고 장면이 출렁인다
  let wobbleAt = -1;

  let last = performance.now();
  function frame(now: number) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    clock += dt;
    burst = Math.max(0, burst - dt / 1.5);
    let ws = 1;
    let wr = 0;
    if (wobbleAt >= 0) {
      const t = clock - wobbleAt;
      const w = Math.exp(-2.4 * t) * Math.sin(2 * Math.PI * 1.7 * t);
      ws = 1 + 0.045 * w;
      wr = 1.1 * w;
      if (t > 2.5) wobbleAt = -1;
    }
    space!.style.setProperty('--wob-s', ws.toFixed(4));
    space!.style.setProperty('--wob-r', `${wr.toFixed(3)}deg`);
    scene?.update(0.35 + 8 * burst * burst, 0.14 * burst, dt, clock, 1);
    field.tick(dt);
    requestAnimationFrame(frame);
  }
  const startMotion = () => {
    burst = 1;
    wobbleAt = clock;
  };

  // ── 태그 ──
  const tagLi = (t: Tag, i: number) =>
    `<li class="tag-item" style="--hue:var(--tag-${t.color});--i:${i}"><a class="tag" href="${html(t.href)}" data-path="${html(t.path ?? '')}"><span class="tag-name">${html(t.name)}</span><span class="tag-count" aria-label="${t.count}개의 노트">${t.count}</span></a><span class="tag-hint" aria-hidden="true">Click to reveal notes about this topic</span></li>`;
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

  /** 다음 단계로 (push: 주소를 새로 쌓을지. 뒤로 가기에서는 false) */
  async function goLevel(path: string, push: boolean) {
    if (busy) return;
    busy = true;
    chipsEl!.classList.remove('is-in');
    if (reduce) {
      place(path);
      renderChips(path);
      chipsIn();
    } else {
      startMotion();
      scatter();
      space!.classList.add('is-exiting');
      await wait(EXIT_MS);
      space!.classList.remove('is-exiting');
      space!.classList.add('is-hidden');
      place(path); // 새 태그는 숨긴 채 놓아 둔다
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
    setHeading(path);
    current = path;
    busy = false;
  }

  /** 끝(글 목록)이나 이 주제의 직접 글 목록은 평범한 페이지 이동 */
  async function goPage(href: string) {
    if (busy) return;
    busy = true;
    chipsEl!.classList.remove('is-in');
    if (!reduce) {
      startMotion();
      scatter();
      space!.classList.add('is-exiting');
      await wait(EXIT_MS);
    }
    location.href = href;
  }

  /** 아래로 내려갈 때: 하위가 하나뿐이고 직접 글이 없는 단계는 건너뛴다 */
  function descend(path: string): { path: string; page: string | null } {
    let node = findStage(tree, path);
    while (node && node.children.length === 1 && node.ownNotes === 0) node = node.children[0];
    if (!node) return { path, page: null };
    return node.leaf ? { path: node.path, page: topicHref(node.path) } : { path: node.path, page: null };
  }

  space.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a.tag');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (a.dataset.path) {
      const to = descend(a.dataset.path);
      return to.page ? void goPage(to.page) : void goLevel(to.path, true);
    }
    void goPage(a.href);
  });

  // 칩의 ✕: 바로 위 단계로 (건너뛰지 않고 그 단계 그대로)
  chipsEl.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a.chip');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    void goLevel(pathOf(a.href), true);
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
