import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowLeft } from '@lucide/angular';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, LucideArrowLeft],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="container-x flex min-h-[70vh] flex-col items-start justify-center pt-32">
      <p class="enter font-mono text-sm text-signal">HTTP 404 · route not found</p>
      <h1 class="enter mt-5 text-5xl font-semibold tracking-[-0.04em] text-sheen sm:text-7xl" style="--enter-delay: 60ms">
        No upstream for this path.
      </h1>
      <p class="enter mt-5 max-w-lg text-lg text-fg-muted" style="--enter-delay: 120ms">
        The page you requested doesn't exist or has moved. The gateway suggests going back to a known route.
      </p>
      <a routerLink="/" class="enter btn btn-ghost mt-10" style="--enter-delay: 180ms">
        <svg lucideArrowLeft [size]="16"></svg> Back to home
      </a>
    </section>
  `,
})
export class NotFoundPage {
  constructor() {
    inject(SeoService).set({ title: 'Not found' });
  }
}
