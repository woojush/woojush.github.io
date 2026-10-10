// 프로필 사진은 사용자가 public/images/profile.(jpg|jpeg|png|webp)로 직접 올린 경우에만 홈에 보인다 (CLAUDE.md 4절).
// 빌드할 때 파일이 있는지 확인한다. 없으면 null이고, 홈은 사진 없이 글만 그린다.
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export function getProfilePhoto(): string | null {
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    if (existsSync(join(process.cwd(), 'public', 'images', `profile.${ext}`))) return `/images/profile.${ext}`;
  }
  return null;
}
