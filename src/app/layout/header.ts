import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { LucideArrowUpRight, LucideDownload, LucideMenu, LucideX } from '@lucide/angular';
import { PROFILE } from '../data/profile';
import { BrandIcon } from '../shared/brand-icon';

export const NAV = [
  { label: 'Work', path: '/projects', code: '01' },
  { label: 'Experience', path: '/experience', code: '02' },
  { label: 'Writing', path: '/blog', code: '03' },
];

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, BrandIcon, LucideMenu, LucideX, LucideDownload, LucideArrowUpRight],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onScroll()',
    '(document:keydown.escape)': 'close()',
  },
  template: `
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-black"
      >Skip to content</a
    >
    <header
      class="fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300"
      [class.header-solid]="scrolled() || open()"
      [class.border-transparent]="!(scrolled() || open())"
      style="padding-top: env(safe-area-inset-top)"
    >
      <nav class="container-x flex h-16 items-center justify-between" aria-label="Primary">
        <a routerLink="/" class="group flex items-center gap-3" aria-label="Ayman Elbery — home">
          <span
            class="relative grid size-8 place-items-center rounded-lg border border-line-strong bg-ink-900 font-mono text-[11px] font-medium tracking-tight text-fg transition-colors group-hover:border-blueprint/60"
          >
            AE
            <span class="absolute -right-0.5 -bottom-0.5 size-1.5 rounded-full bg-signal"></span>
          </span>
          <span class="hidden text-sm font-medium tracking-tight text-fg sm:block">
            Ayman Elbery
            <span class="ml-1 font-normal text-fg-dim">/ engineering</span>
          </span>
        </a>

        <ul class="hidden items-center gap-1 md:flex">
          @for (item of nav; track item.path) {
            <li>
              <a
                [routerLink]="item.path"
                routerLinkActive="nav-active"
                class="rounded-lg px-3.5 py-2 text-sm text-fg-muted transition-colors hover:text-fg"
                >{{ item.label }}</a
              >
            </li>
          }
        </ul>

        <div class="flex items-center gap-2">
          <a
            [href]="profile.github"
            target="_blank"
            rel="noopener"
            class="btn btn-ghost btn-icon btn-sm hidden md:inline-flex"
            aria-label="GitHub"
            ><app-brand-icon name="github" [size]="16"
          /></a>
          <a
            [href]="profile.linkedin"
            target="_blank"
            rel="noopener"
            class="btn btn-ghost btn-icon btn-sm hidden md:inline-flex"
            aria-label="LinkedIn"
            ><app-brand-icon name="linkedin" [size]="15"
          /></a>
          <a [href]="profile.resume" download class="btn btn-primary btn-sm hidden sm:inline-flex">
            <svg lucideDownload [size]="15"></svg> Résumé
          </a>
          <button
            type="button"
            class="btn btn-ghost btn-icon md:hidden"
            [attr.aria-expanded]="open()"
            aria-controls="mobile-menu"
            [attr.aria-label]="open() ? 'Close menu' : 'Open menu'"
            (click)="open.set(!open())"
          >
            @if (open()) {
              <svg lucideX [size]="18"></svg>
            } @else {
              <svg lucideMenu [size]="18"></svg>
            }
          </button>
        </div>
      </nav>
    </header>

    <!-- Mobile menu -->
    <div
      id="mobile-menu"
      class="fixed inset-0 z-40 md:hidden"
      [class.pointer-events-none]="!open()"
      [attr.aria-hidden]="!open()"
      [attr.inert]="open() ? null : ''"
    >
      <div
        class="absolute inset-0 bg-ink-950/90 backdrop-blur-2xl transition-opacity duration-300"
        [class.opacity-0]="!open()"
        (click)="close()"
      ></div>
      <div
        class="relative flex h-full flex-col px-5 pt-24 pb-[max(2rem,env(safe-area-inset-bottom))] transition-[opacity,transform] duration-500 ease-out-expo"
        [class.opacity-0]="!open()"
        [class.-translate-y-3]="!open()"
      >
        <p class="eyebrow mb-4">Navigate</p>
        <ul class="border-t border-line">
          @for (item of mobileNav; track item.path; let i = $index) {
            <li>
              <a
                [routerLink]="item.path"
                routerLinkActive="text-blueprint"
                [routerLinkActiveOptions]="{ exact: item.path === '/' }"
                (click)="close()"
                class="flex items-baseline justify-between border-b border-line py-5 transition-[opacity,transform] duration-500 ease-out-expo"
                [class.opacity-0]="!open()"
                [class.translate-x-4]="!open()"
                [style.transition-delay]="open() ? 60 + i * 50 + 'ms' : '0ms'"
              >
                <span class="text-3xl font-medium tracking-[-0.03em]">{{ item.label }}</span>
                <span class="font-mono text-xs text-fg-dim">{{ item.code }}</span>
              </a>
            </li>
          }
        </ul>
        <div class="mt-auto grid gap-3">
          <a [href]="profile.resume" download class="btn btn-primary w-full"><svg lucideDownload [size]="16"></svg> Download résumé</a>
          <div class="grid grid-cols-2 gap-3">
            <a [href]="profile.linkedin" target="_blank" rel="noopener" class="btn btn-ghost"
              ><app-brand-icon name="linkedin" [size]="15" /> LinkedIn</a
            >
            <a [href]="profile.github" target="_blank" rel="noopener" class="btn btn-ghost"
              ><app-brand-icon name="github" [size]="16" /> GitHub</a
            >
          </div>
          <a [href]="'mailto:' + profile.email" class="mt-2 inline-flex items-center justify-center gap-1.5 font-mono text-xs text-fg-muted">
            {{ profile.email }} <svg lucideArrowUpRight [size]="13"></svg>
          </a>
        </div>
      </div>
    </div>
  `,
})
export class Header {
  protected readonly nav = NAV;
  protected readonly mobileNav = [{ label: 'Home', path: '/', code: '00' }, ...NAV];
  protected readonly profile = PROFILE;
  protected readonly scrolled = signal(false);
  protected readonly open = signal(false);

  private readonly document = inject(DOCUMENT);

  constructor() {
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.open.set(false));

    // Lock page scroll while the mobile menu is open.
    effect(() => {
      this.document.documentElement.style.overflow = this.open() ? 'hidden' : '';
    });
    this.onScroll();
  }

  onScroll() {
    this.scrolled.set((this.document.defaultView?.scrollY ?? 0) > 8);
  }

  close() {
    this.open.set(false);
  }
}
