// Writing 화면용 가공. 글을 형식별로 묶고, 카드 색과 번호를 정한다.
import { formatDate } from '@/lib/format';
import { forms, type WritingForm } from '@/data/writing-forms';

export interface Card {
  slug: string;
  href: string;
  title: string;
  date: string;
  /** 같은 형식 안에서의 번호(오래된 글이 01) */
  no: string;
  color: string;
}

// 카드 색은 형식의 색조 둘레에서 글의 '오래된 순서'에 따라 완만하게 흔들린다. 새 글을 더해도 기존 글의 색이 바뀌지 않는다.
export function cardColor(form: WritingForm, rank: number): string {
  const h = form.hue + form.spread * Math.sin(rank * 0.55);
  const l = form.light + 3.5 * Math.sin(rank * 0.9 + 1);
  const s = form.sat + 4 * Math.sin(rank * 0.7 + 2);
  return `hsl(${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%)`;
}

interface EntryLike {
  id: string;
  data: { title: string; date: Date; form: string };
}

/** 가장 새 글이 첫 번째. 번호·색은 오래된 순서로 정해진다 */
export function cardsOf(entries: readonly EntryLike[], form: WritingForm): Card[] {
  const mine = entries.filter((e) => e.data.form === form.id).sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf());
  const cards = mine.map((e, i) => ({
    slug: e.id,
    href: `/writing/${e.id}/`,
    title: e.data.title,
    date: formatDate(e.data.date),
    no: String(i + 1).padStart(2, '0'),
    color: cardColor(form, i),
  }));
  return cards.reverse();
}

export function countsOf(entries: readonly EntryLike[]): Record<string, number> {
  return Object.fromEntries(forms.map((f) => [f.id, entries.filter((e) => e.data.form === f.id).length]));
}
