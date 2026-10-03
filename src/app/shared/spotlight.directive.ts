import { Directive } from '@angular/core';

/** Tracks the pointer so `.spotlight` surfaces can render a soft radial highlight. */
@Directive({
  selector: '[appSpotlight]',
  host: {
    class: 'spotlight',
    '(pointermove)': 'onMove($event)',
  },
})
export class SpotlightDirective {
  onMove(e: PointerEvent) {
    if (e.pointerType !== 'mouse') return;
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }
}
