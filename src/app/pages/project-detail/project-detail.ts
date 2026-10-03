import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowLeft, LucideArrowRight, LucideCheck } from '@lucide/angular';
import { PROJECTS, findProject } from '../../data/projects';
import { SeoService } from '../../core/seo.service';
import { ArchDiagram } from '../../shared/arch-diagram';
import { RevealDirective } from '../../shared/reveal.directive';
import { NotFoundPage } from '../not-found/not-found';

@Component({
  selector: 'app-project-detail',
  imports: [RouterLink, ArchDiagram, RevealDirective, NotFoundPage, LucideArrowLeft, LucideArrowRight, LucideCheck],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (project(); as p) {
      <article>
        <header class="container-x pt-28 sm:pt-36">
          <a routerLink="/projects" class="enter inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg">
            <svg lucideArrowLeft [size]="15"></svg> All work
          </a>
          <div class="enter mt-10 flex flex-wrap items-center gap-2" style="--enter-delay: 40ms">
            <span class="font-mono text-xs text-blueprint">{{ p.index }}</span>
            <span class="h-px w-6 bg-line-strong"></span>
            <span class="eyebrow">{{ p.domain }}</span>
          </div>
          <h1
            class="enter mt-5 max-w-4xl text-[clamp(2.2rem,5vw,3.9rem)] leading-[1.04] font-semibold tracking-[-0.04em] text-balance text-sheen"
            style="--enter-delay: 80ms"
          >
            {{ p.title }}
          </h1>
          <p class="enter mt-5 max-w-2xl font-serif text-2xl leading-snug text-fg-muted italic" style="--enter-delay: 120ms">
            {{ p.tagline }}
          </p>

          <dl
            class="enter mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3"
            style="--enter-delay: 160ms"
          >
            <div class="bg-ink-950 p-5">
              <dt class="eyebrow !text-[0.65rem]">Organization</dt>
              <dd class="mt-2 text-sm text-fg">{{ p.org }}</dd>
            </div>
            <div class="bg-ink-950 p-5">
              <dt class="eyebrow !text-[0.65rem]">Period</dt>
              <dd class="mt-2 text-sm text-fg">{{ p.period }}</dd>
            </div>
            <div class="col-span-2 bg-ink-950 p-5 sm:col-span-1">
              <dt class="eyebrow !text-[0.65rem]">Domain</dt>
              <dd class="mt-2 text-sm text-fg">{{ p.domain }}</dd>
            </div>
          </dl>
        </header>

        <!-- Architecture -->
        <section class="container-x mt-12" aria-labelledby="arch-title">
          <div class="glass ticks rounded-2xl">
            <div class="flex items-center justify-between border-b border-line px-4 py-3 font-mono text-[11px] text-fg-muted">
              <span id="arch-title" class="truncate">architecture<span class="hidden sm:inline"> / {{ p.slug }}</span></span>
              <span class="hidden text-fg-dim sm:inline">hover or focus a node to trace connections</span>
              <span class="shrink-0 text-fg-dim sm:hidden">swipe to explore →</span>
            </div>
            <div class="px-3 py-6 sm:px-8 sm:py-10">
              <div class="mx-auto max-w-4xl">
                <app-arch-diagram [diagram]="p.diagram" [label]="'Architecture of ' + p.title" />
              </div>
            </div>
            <div class="flex flex-wrap gap-x-5 gap-y-2 border-t border-line px-4 py-3 font-mono text-[10.5px] text-fg-dim">
              <span class="flex items-center gap-1.5"><span class="size-2 rounded-full bg-blueprint"></span>core component</span>
              <span class="flex items-center gap-1.5"><span class="size-2 rounded-full bg-signal"></span>identity / messaging</span>
              <span class="flex items-center gap-1.5"><span class="size-2 rounded-full bg-ok"></span>data store</span>
              <span class="flex items-center gap-1.5"><span class="size-2 rounded-full border border-dashed border-fg-dim"></span>external system</span>
            </div>
          </div>
        </section>

        <div class="container-x mt-20 grid gap-14 lg:grid-cols-[1fr_18rem] lg:gap-20">
          <div class="min-w-0">
            <section appReveal>
              <h2 class="eyebrow">Overview</h2>
              <p class="mt-4 text-xl leading-relaxed text-pretty text-fg">{{ p.summary }}</p>
              <p class="mt-5 text-base leading-relaxed text-pretty text-fg-muted">{{ p.context }}</p>
            </section>

            <section appReveal class="mt-16">
              <h2 class="eyebrow">Constraints</h2>
              <ul class="mt-5 grid gap-3 sm:grid-cols-2">
                @for (c of p.challenges; track c; let i = $index) {
                  <li class="flex gap-3 rounded-xl border border-line bg-white/[0.015] p-4 text-sm leading-relaxed text-fg-muted">
                    <span class="font-mono text-[11px] text-signal">C{{ i + 1 }}</span>
                    <span>{{ c }}</span>
                  </li>
                }
              </ul>
            </section>

            <section class="mt-16">
              <h2 appReveal class="eyebrow">Approach</h2>
              <ol class="mt-5 border-t border-line">
                @for (a of p.approach; track a.title; let i = $index) {
                  <li [appReveal]="i * 60" class="grid gap-2 border-b border-line py-6 sm:grid-cols-[3rem_1fr]">
                    <span class="font-mono text-xs text-blueprint">0{{ i + 1 }}</span>
                    <div>
                      <h3 class="font-medium tracking-[-0.01em] text-fg">{{ a.title }}</h3>
                      <p class="mt-2 text-[15px] leading-relaxed text-pretty text-fg-muted">{{ a.body }}</p>
                    </div>
                  </li>
                }
              </ol>
            </section>

            <section appReveal class="mt-16">
              <h2 class="eyebrow">Outcomes</h2>
              <ul class="mt-5 grid gap-3">
                @for (o of p.outcomes; track o) {
                  <li class="flex items-start gap-3 text-[15px] leading-relaxed text-fg">
                    <span class="mt-1 grid size-5 shrink-0 place-items-center rounded-full border border-ok/30 bg-ok/10 text-ok">
                      <svg lucideCheck [size]="12"></svg>
                    </span>
                    {{ o }}
                  </li>
                }
              </ul>
            </section>
          </div>

          <aside class="lg:sticky lg:top-24 lg:self-start">
            <div class="rounded-2xl border border-line p-6">
              <h2 class="eyebrow">Stack</h2>
              <div class="mt-4 flex flex-wrap gap-1.5">
                @for (t of p.stack; track t) {
                  <span class="chip">{{ t }}</span>
                }
              </div>
            </div>
          </aside>
        </div>

        <!-- Prev / next -->
        <nav class="container-x mt-24 grid gap-4 sm:grid-cols-2" aria-label="More case studies">
          @if (siblings().prev; as prev) {
            <a [routerLink]="['/projects', prev.slug]" class="group rounded-2xl border border-line p-6 transition-colors hover:border-line-strong">
              <span class="eyebrow flex items-center gap-1.5"><svg lucideArrowLeft [size]="13"></svg> Previous</span>
              <span class="mt-3 block font-medium text-fg transition-colors group-hover:text-blueprint">{{ prev.title }}</span>
            </a>
          } @else {
            <span></span>
          }
          @if (siblings().next; as next) {
            <a
              [routerLink]="['/projects', next.slug]"
              class="group rounded-2xl border border-line p-6 text-right transition-colors hover:border-line-strong"
            >
              <span class="eyebrow flex items-center justify-end gap-1.5">Next <svg lucideArrowRight [size]="13"></svg></span>
              <span class="mt-3 block font-medium text-fg transition-colors group-hover:text-blueprint">{{ next.title }}</span>
            </a>
          }
        </nav>
      </article>
    } @else {
      <app-not-found />
    }
  `,
})
export class ProjectDetailPage {
  readonly slug = input.required<string>();

  protected readonly project = computed(() => findProject(this.slug()));
  protected readonly siblings = computed(() => {
    const i = PROJECTS.findIndex((p) => p.slug === this.slug());
    return { prev: PROJECTS[i - 1], next: PROJECTS[i + 1] };
  });

  constructor() {
    const seo = inject(SeoService);
    effect(() => {
      const p = this.project();
      if (p) seo.set({ title: p.title, description: p.summary, type: 'article' });
    });
  }
}
