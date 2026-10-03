import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RevealDirective } from './reveal.directive';

@Component({
  selector: 'app-section-header',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div appReveal class="flex items-center gap-3">
      <span class="font-mono text-xs text-blueprint">{{ index() }}</span>
      <span class="h-px w-8 bg-line-strong"></span>
      <span class="eyebrow">{{ eyebrow() }}</span>
    </div>
    <h2
      appReveal="80"
      class="mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-balance text-fg sm:text-4xl md:text-[2.75rem] md:leading-[1.1]"
    >
      <ng-content />
    </h2>
    @if (lead()) {
      <p appReveal="140" class="mt-5 max-w-2xl text-base leading-relaxed text-pretty text-fg-muted sm:text-lg">
        {{ lead() }}
      </p>
    }
  `,
})
export class SectionHeader {
  readonly index = input.required<string>();
  readonly eyebrow = input.required<string>();
  readonly lead = input<string>();
}
