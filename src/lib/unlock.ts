'use client';

import { useEffect, useState, useCallback } from 'react';

const KEY = (storyId: string) => `unlocked:${storyId}`;

export function isUnlocked(storyId: string): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(KEY(storyId)) === 'true';
}

export function unlockStory(storyId: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY(storyId), 'true');
  window.dispatchEvent(new CustomEvent('unlock-change', { detail: { storyId } }));
}

export function useUnlock(storyId: string): { unlocked: boolean; unlock: () => void } {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setUnlocked(isUnlocked(storyId));
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ storyId: string }>;
      if (ce.detail?.storyId === storyId) setUnlocked(true);
    };
    window.addEventListener('unlock-change', handler);
    return () => window.removeEventListener('unlock-change', handler);
  }, [storyId]);

  const unlock = useCallback(() => unlockStory(storyId), [storyId]);
  return { unlocked, unlock };
}
