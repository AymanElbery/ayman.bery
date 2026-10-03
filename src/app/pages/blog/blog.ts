import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { catchError, of } from 'rxjs';
import { LucideArrowUpRight, LucideRss, LucideSearch, LucideX } from '@lucide/angular';
import { CATEGORY_META, ContentService, PostCategory, PostMeta } from '../../core/content.service';
import { SeoService } from '../../core/seo.service';
import { RevealDirective } from '../../shared/reveal.directive';
import { SpotlightDirective } from '../../shared/spotlight.directive';

@Component({
  selector: 'app-blog',
  imports: [
    RouterLink,
    RouterLinkActive,
    DatePipe,
    RevealDirective,
    SpotlightDirective,
    LucideArrowUpRight,
    LucideRss,
    LucideSearch,
    LucideX,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="container-x pt-32 sm:pt-40">
      <p class="enter eyebrow">Writing{{ category() ? ' · ' + meta()?.label : '' }}</p>
      <h1
        class="enter mt-5 max-w-4xl text-[clamp(2.4rem,5.5vw,4.25rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-balance"
        style="--enter-delay: 60ms"
      >
        @switch (category()) {
          @case ('technical') {
            <span class="text-sheen">Technical</span><span class="font-serif font-normal text-blueprint italic"> notes.</span>
          }
          @case ('personal') {
            <span class="text-sheen">Personal</span><span class="font-serif font-normal text-signal italic"> essays.</span>
          }
          @default {
            <span class="text-sheen">Notes from the</span><span class="font-serif font-normal text-blueprint italic"> field.</span>
          }
        }
      </h1>
      <p class="enter mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-fg-muted" style="--enter-delay: 120ms">
        {{
          meta()?.blurb ??
            'Architecture, identity and distributed systems — plus reflections on leadership and a decade of engineering.'
        }}
      </p>
    </section>

    <!-- Controls -->
    <section class="container-x mt-12">
      <div class="enter flex flex-col gap-4 border-b border-line pb-5 md:flex-row md:items-center md:justify-between" style="--enter-delay: 160ms">
        <nav aria-label="Categories" class="-mx-1 flex gap-1 overflow-x-auto px-1">
          @for (tab of tabs; track tab.path) {
            <a
              [routerLink]="tab.path"
              routerLinkActive="!border-line-strong !bg-white/[0.06] !text-fg"
              [routerLinkActiveOptions]="{ exact: true }"
              class="shrink-0 rounded-lg border border-transparent px-3.5 py-2 text-sm text-fg-muted transition-colors hover:text-fg"
            >
              {{ tab.label }}
              <span class="ml-1 font-mono text-[11px] text-fg-dim">{{ count(tab.key) }}</span>
            </a>
          }
        </nav>
        <div class="flex items-center gap-2">
          <label class="relative flex-1 md:w-64 md:flex-none">
            <span class="sr-only">Search articles</span>
            <svg lucideSearch [size]="15" class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-fg-dim"></svg>
            <input
              type="search"
              placeholder="Search articles"
              [value]="query()"
              (input)="query.set($any($event.target).value)"
              class="h-10 w-full rounded-lg border border-line bg-white/[0.025] pr-3 pl-9 text-sm text-fg placeholder:text-fg-dim focus:border-blueprint/50 focus:outline-none"
            />
          </label>
          <a href="feed.xml" class="btn btn-ghost btn-icon !h-10 !w-10" aria-label="RSS feed"><svg lucideRss [size]="15"></svg></a>
        </div>
      </div>

      @if (tags().length) {
        <div class="mt-5 flex flex-wrap gap-1.5" role="group" aria-label="Filter by tag">
          @for (t of tags(); track t) {
            <button
              type="button"
              class="chip cursor-pointer transition-colors hover:border-line-strong hover:text-fg"
              [class.!border-blueprint/50]="tag() === t"
              [class.!text-blueprint]="tag() === t"
              [attr.aria-pressed]="tag() === t"
              (click)="tag.set(tag() === t ? null : t)"
            >
              #{{ t }}
            </button>
          }
          @if (tag() || query()) {
            <button type="button" class="chip cursor-pointer hover:text-fg" (click)="reset()">
              <svg lucideX [size]="11"></svg> clear
            </button>
          }
        </div>
      }
    </section>

    <!-- List -->
    <section class="container-x mt-8" aria-live="polite">
      @if (posts() === undefined) {
        <div class="grid gap-3" aria-hidden="true">
          @for (_ of [1, 2, 3]; track $index) {
            <div class="h-28 animate-pulse rounded-2xl bg-white/[0.02]"></div>
          }
        </div>
      } @else if (filtered().length === 0) {
        <div class="rounded-2xl border border-dashed border-line-strong px-6 py-16 text-center">
          <p class="font-mono text-sm text-fg-muted">No articles match.</p>
          @if (tag() || query()) {
            <button type="button" class="btn btn-ghost btn-sm mt-5" (click)="reset()">Clear filters</button>
          }
        </div>
      } @else {
        <ol>
          @for (post of filtered(); track post.url; let i = $index) {
            <li [appReveal]="i < 6 ? i * 60 : 0">
              <a
                appSpotlight
                [routerLink]="post.url"
                class="group -mx-3 grid gap-x-8 gap-y-2 rounded-2xl border border-transparent px-3 py-7 transition-[background-color,border-color] duration-300 hover:border-line hover:bg-white/[0.02] sm:-mx-5 sm:px-5 md:grid-cols-[9rem_1fr_auto]"
              >
                <div class="flex items-center gap-3 font-mono text-[11px] text-fg-dim md:block">
                  <time [attr.datetime]="post.date" class="block">{{ post.date | date: 'MMM d, y' : 'UTC' }}</time>
                  <span class="mt-0 block md:mt-2" [class]="post.category === 'technical' ? 'text-blueprint' : 'text-signal'">
                    {{ label(post.category) }}
                  </span>
                </div>
                <div class="min-w-0">
                  <h2 class="text-xl font-medium tracking-[-0.02em] text-balance text-fg transition-colors sm:text-2xl">
                    {{ post.title }}
                  </h2>
                  <p class="mt-2 max-w-2xl text-[15px] leading-relaxed text-pretty text-fg-muted">{{ post.description }}</p>
                  <div class="mt-4 flex flex-wrap gap-1.5">
                    @for (t of post.tags; track t) {
                      <span class="chip">#{{ t }}</span>
                    }
                  </div>
                </div>
                <div class="hidden items-start gap-3 font-mono text-[11px] text-fg-dim md:flex">
                  <span>{{ post.readingTime }} min</span>
                  <svg
                    lucideArrowUpRight
                    [size]="18"
                    class="-mt-0.5 transition-[color,transform] duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg"
                  ></svg>
                </div>
              </a>
            </li>
          }
        </ol>
      }
    </section>
  `,
})
export class BlogPage {
  /** Bound from route data (see app.routes.ts). */
  readonly category = input<PostCategory | null>(null);

  protected readonly tabs = [
    { key: null, label: 'All', path: '/blog' },
    { key: 'technical' as const, label: 'Technical', path: '/blog/technical' },
    { key: 'personal' as const, label: 'Personal', path: '/blog/personal' },
  ];

  protected readonly query = signal('');
  protected readonly tag = signal<string | null>(null);

  private readonly all = toSignal(inject(ContentService).posts().pipe(catchError(() => of([] as PostMeta[]))));

  protected readonly posts = computed(() => {
    const all = this.all();
    const c = this.category();
    return all && (c ? all.filter((p) => p.category === c) : all);
  });

  protected readonly meta = computed(() => {
    const c = this.category();
    return c ? CATEGORY_META[c] : null;
  });

  protected readonly tags = computed(() => [...new Set((this.posts() ?? []).flatMap((p) => p.tags))].sort());

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const t = this.tag();
    return (this.posts() ?? []).filter(
      (p) =>
        (!t || p.tags.includes(t)) &&
        (!q || `${p.title} ${p.description} ${p.tags.join(' ')}`.toLowerCase().includes(q)),
    );
  });

  constructor() {
    const seo = inject(SeoService);
    effect(() => {
      const m = this.meta();
      seo.set({
        title: m ? `${m.label} writing` : 'Writing',
        description: m?.blurb ?? 'Articles on enterprise architecture, identity, distributed systems and engineering leadership.',
      });
    });
  }

  protected count(key: PostCategory | null) {
    const all = this.all() ?? [];
    return key ? all.filter((p) => p.category === key).length : all.length;
  }

  protected label(c: PostCategory) {
    return CATEGORY_META[c].label;
  }

  protected reset() {
    this.tag.set(null);
    this.query.set('');
  }
}
