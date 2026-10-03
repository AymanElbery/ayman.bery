import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { catchError, combineLatest, map, of, switchMap } from 'rxjs';
import { LucideArrowLeft, LucideArrowRight, LucideClock } from '@lucide/angular';
import { CATEGORY_META, ContentService, Post, PostCategory, PostMeta } from '../../core/content.service';
import { SeoService } from '../../core/seo.service';
import { NotFoundPage } from '../not-found/not-found';

type LoadState = { status: 'loading' } | { status: 'error' } | { status: 'ok'; post: Post };

@Component({
  selector: 'app-post',
  imports: [RouterLink, DatePipe, NotFoundPage, LucideArrowLeft, LucideArrowRight, LucideClock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(window:scroll)': 'onScroll()' },
  template: `
    <!-- reading progress -->
    <div class="fixed inset-x-0 top-0 z-[60] h-px" aria-hidden="true">
      <div
        class="h-full origin-left bg-gradient-to-r from-blueprint to-signal"
        [style.transform]="'scaleX(' + progress() + ')'"
      ></div>
    </div>

    @switch (state().status) {
      @case ('loading') {
        <div class="container-x pt-40" aria-busy="true">
          <div class="mx-auto max-w-3xl space-y-5">
            <div class="h-4 w-40 animate-pulse rounded bg-white/[0.05]"></div>
            <div class="h-14 w-full animate-pulse rounded-lg bg-white/[0.05]"></div>
            <div class="h-5 w-2/3 animate-pulse rounded bg-white/[0.04]"></div>
          </div>
        </div>
      }
      @case ('error') {
        <app-not-found />
      }
      @case ('ok') {
        @if (post(); as p) {
          <article>
            <header class="container-x pt-28 sm:pt-36">
              <div class="mx-auto max-w-3xl">
                <nav class="enter flex items-center gap-2 font-mono text-xs text-fg-dim" aria-label="Breadcrumb">
                  <a routerLink="/blog" class="transition-colors hover:text-fg">Writing</a>
                  <span>/</span>
                  <a
                    [routerLink]="'/blog/' + p.category"
                    class="transition-colors hover:text-fg"
                    [class]="p.category === 'technical' ? 'text-blueprint' : 'text-signal'"
                    >{{ label(p.category) }}</a
                  >
                </nav>
                <h1
                  class="enter mt-7 text-[clamp(2.1rem,4.8vw,3.6rem)] leading-[1.06] font-semibold tracking-[-0.035em] text-balance text-sheen"
                  style="--enter-delay: 60ms"
                >
                  {{ p.title }}
                </h1>
                <p class="enter mt-6 text-xl leading-relaxed text-pretty text-fg-muted" style="--enter-delay: 120ms">
                  {{ p.description }}
                </p>
                <div
                  class="enter mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-line py-4 font-mono text-xs text-fg-dim"
                  style="--enter-delay: 160ms"
                >
                  <span class="flex items-center gap-2 text-fg-muted">
                    <span class="grid size-6 place-items-center rounded-md border border-line-strong bg-ink-900 text-[9px] text-fg">AE</span>
                    Ayman Elbery
                  </span>
                  <time [attr.datetime]="p.date">{{ p.date | date: 'MMMM d, y' : 'UTC' }}</time>
                  @if (p.updated) {
                    <span>Updated {{ p.updated | date: 'MMM d, y' : 'UTC' }}</span>
                  }
                  <span class="flex items-center gap-1.5"><svg lucideClock [size]="12"></svg> {{ p.readingTime }} min read</span>
                  @if (p.draft) {
                    <span class="chip !text-signal">draft</span>
                  }
                </div>
              </div>
            </header>

            <div class="container-x mt-12">
              <div class="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_15rem]">
                <div class="enter mx-auto w-full max-w-3xl min-w-0 lg:mx-0" style="--enter-delay: 200ms">
                  <div #body class="article" [innerHTML]="html()"></div>

                  @if (p.tags.length) {
                    <div class="mt-14 flex flex-wrap gap-1.5 border-t border-line pt-8">
                      @for (t of p.tags; track t) {
                        <span class="chip">#{{ t }}</span>
                      }
                    </div>
                  }
                </div>

                @if (p.headings.length > 1) {
                  <aside class="hidden lg:block">
                    <nav class="sticky top-28" aria-label="On this page">
                      <p class="eyebrow mb-4">On this page</p>
                      <ul class="border-l border-line">
                        @for (h of p.headings; track h.id) {
                          <li>
                            <a
                              [href]="'#' + h.id"
                              (click)="scrollTo($event, h.id)"
                              class="-ml-px block border-l py-1.5 text-[13px] leading-snug transition-colors"
                              [class.pl-4]="h.depth === 2"
                              [class.pl-7]="h.depth === 3"
                              [class]="
                                activeId() === h.id
                                  ? 'border-blueprint text-fg'
                                  : 'border-transparent text-fg-dim hover:text-fg-muted'
                              "
                              >{{ h.text }}</a
                            >
                          </li>
                        }
                      </ul>
                    </nav>
                  </aside>
                }
              </div>
            </div>

            <!-- Adjacent posts -->
            <nav class="container-x mt-24" aria-label="More writing">
              <div class="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2">
                @if (adjacent().newer; as n) {
                  <a [routerLink]="n.url" class="group rounded-2xl border border-line p-6 transition-colors hover:border-line-strong">
                    <span class="eyebrow flex items-center gap-1.5"><svg lucideArrowLeft [size]="13"></svg> Newer</span>
                    <span class="mt-3 block font-medium text-balance text-fg transition-colors group-hover:text-blueprint">{{ n.title }}</span>
                  </a>
                } @else {
                  <a routerLink="/blog" class="group rounded-2xl border border-line p-6 transition-colors hover:border-line-strong">
                    <span class="eyebrow flex items-center gap-1.5"><svg lucideArrowLeft [size]="13"></svg> Back</span>
                    <span class="mt-3 block font-medium text-fg transition-colors group-hover:text-blueprint">All writing</span>
                  </a>
                }
                @if (adjacent().older; as o) {
                  <a
                    [routerLink]="o.url"
                    class="group rounded-2xl border border-line p-6 text-right transition-colors hover:border-line-strong"
                  >
                    <span class="eyebrow flex items-center justify-end gap-1.5">Older <svg lucideArrowRight [size]="13"></svg></span>
                    <span class="mt-3 block font-medium text-balance text-fg transition-colors group-hover:text-blueprint">{{ o.title }}</span>
                  </a>
                }
              </div>
            </nav>
          </article>
        }
      }
    }
  `,
})
export class PostPage {
  readonly category = input.required<string>();
  readonly slug = input.required<string>();

  private readonly content = inject(ContentService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly injector = inject(Injector);
  private readonly body = viewChild<ElementRef<HTMLElement>>('body');

  protected readonly progress = signal(0);
  protected readonly activeId = signal<string | null>(null);
  private headingObserver?: IntersectionObserver;

  protected readonly state = toSignal(
    combineLatest([toObservable(this.category), toObservable(this.slug)]).pipe(
      switchMap(([c, s]) =>
        this.content.post(c, s).pipe(
          map((post): LoadState => ({ status: 'ok', post })),
          catchError(() => of<LoadState>({ status: 'error' })),
        ),
      ),
    ),
    { initialValue: { status: 'loading' } as LoadState },
  );

  protected readonly post = computed(() => {
    const s = this.state();
    return s.status === 'ok' ? s.post : null;
  });

  /** Post HTML is generated at build time from first-party Markdown in /content, so it is trusted. */
  protected readonly html = computed(() => this.sanitizer.bypassSecurityTrustHtml(this.post()?.html ?? ''));

  private readonly siblings = toSignal(
    toObservable(this.category).pipe(
      switchMap((c) => this.content.posts(c as PostCategory).pipe(catchError(() => of([] as PostMeta[])))),
    ),
    { initialValue: [] as PostMeta[] },
  );

  protected readonly adjacent = computed(() => {
    const list = this.siblings();
    const i = list.findIndex((p) => p.slug === this.slug());
    return { newer: i > 0 ? list[i - 1] : undefined, older: i >= 0 ? list[i + 1] : undefined };
  });

  constructor() {
    const seo = inject(SeoService);
    effect(() => {
      const p = this.post();
      if (!p) return;
      seo.set({ title: p.title, description: p.description, type: 'article' });
      afterNextRender(() => this.enhance(p), { injector: this.injector });
    });
    inject(DestroyRef).onDestroy(() => this.headingObserver?.disconnect());
  }

  protected label(c: PostCategory) {
    return CATEGORY_META[c]?.label ?? c;
  }

  protected scrollTo(event: Event, id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    event.preventDefault();
    el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    history.replaceState(null, '', `${location.pathname}#${id}`);
  }

  onScroll() {
    const el = this.body()?.nativeElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const total = rect.height - window.innerHeight * 0.6;
    const done = Math.min(1, Math.max(0, -rect.top / Math.max(total, 1)));
    this.progress.set(done);
  }

  /** Post-render enhancements: active heading tracking + lazy Mermaid. */
  private enhance(post: Post) {
    const root = this.body()?.nativeElement;
    if (!root) return;

    this.headingObserver?.disconnect();
    const headings = Array.from(root.querySelectorAll<HTMLElement>('h2[id], h3[id]'));
    this.headingObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) this.activeId.set(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -65% 0px' },
    );
    headings.forEach((h) => this.headingObserver!.observe(h));

    if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();

    if (post.hasMermaid) void this.renderMermaid(root);
  }

  private async renderMermaid(root: HTMLElement) {
    const { default: mermaid } = await import('mermaid');
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      securityLevel: 'strict',
      fontFamily: 'Geist, ui-sans-serif, system-ui, sans-serif',
      themeVariables: {
        darkMode: true,
        background: '#0b0e14',
        primaryColor: '#141925',
        primaryTextColor: '#e7e9ee',
        primaryBorderColor: '#4b74b8',
        secondaryColor: '#0f131b',
        tertiaryColor: '#0f131b',
        lineColor: '#646d7d',
        textColor: '#c9ced8',
        noteBkgColor: '#1d2433',
        noteTextColor: '#e7e9ee',
        noteBorderColor: '#4b74b8',
        actorBkg: '#141925',
        actorBorder: '#4b74b8',
        actorTextColor: '#e7e9ee',
        actorLineColor: '#2a3242',
        signalColor: '#9aa3b2',
        signalTextColor: '#e7e9ee',
        sequenceNumberColor: '#07090d',
        fontSize: '14px',
      },
    });
    await mermaid.run({ nodes: Array.from(root.querySelectorAll<HTMLElement>('pre.mermaid')) });
  }
}
