import { DestroyRef, inject, signal } from '@angular/core';

/** Reactive `prefers-reduced-motion` flag. Call from an injection context. */
export function injectReducedMotion() {
  const query = typeof matchMedia !== 'undefined' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
  const reduced = signal(query?.matches ?? false);
  if (query) {
    const onChange = (e: MediaQueryListEvent) => reduced.set(e.matches);
    query.addEventListener('change', onChange);
    inject(DestroyRef).onDestroy(() => query.removeEventListener('change', onChange));
  }
  return reduced.asReadonly();
}
