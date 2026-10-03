import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';

/**
 * Fades/slides an element in the first time it scrolls into view.
 * Styling lives in styles.css (.reveal / .is-visible) so reduced-motion
 * users get the final state immediately.
 */
@Directive({
  selector: '[appReveal]',
  host: {
    class: 'reveal',
    '[style.--reveal-delay]': 'delay() + "ms"',
  },
})
export class RevealDirective implements OnInit, OnDestroy {
  readonly delay = input(0, { alias: 'appReveal', transform: (v: unknown) => Number(v) || 0 });

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  ngOnInit() {
    const node = this.el.nativeElement;
    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-visible');
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add('is-visible');
            this.observer?.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    this.observer.observe(node);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
