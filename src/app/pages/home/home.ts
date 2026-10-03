import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import {
  LucideArrowRight,
  LucideArrowUpRight,
  LucideBrain,
  LucideLandmark,
  LucideLayers,
  LucideMail,
  LucideNetwork,
  LucideServer,
  LucideShieldCheck,
} from '@lucide/angular';
import { EXPERIENCE, FOCUS_AREAS, METRICS, PRINCIPLES, PROFILE, SKILLS } from '../../data/profile';
import { PROJECTS } from '../../data/projects';
import { ContentService } from '../../core/content.service';
import { SeoService } from '../../core/seo.service';
import { RevealDirective } from '../../shared/reveal.directive';
import { SpotlightDirective } from '../../shared/spotlight.directive';
import { SectionHeader } from '../../shared/section-header';
import { ProjectCard } from '../../shared/project-card';
import { PostCard } from '../../shared/post-card';
import { BrandIcon } from '../../shared/brand-icon';
import { Hero } from './hero';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    Hero,
    RevealDirective,
    SpotlightDirective,
    SectionHeader,
    ProjectCard,
    PostCard,
    BrandIcon,
    LucideArrowRight,
    LucideArrowUpRight,
    LucideBrain,
    LucideLandmark,
    LucideLayers,
    LucideMail,
    LucideNetwork,
    LucideServer,
    LucideShieldCheck,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-hero />

    <!-- Metrics -->
    <section class="container-x" aria-label="At a glance">
      <dl class="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
        @for (m of metrics; track m.label; let i = $index) {
          <div class="bg-ink-950 p-6 sm:p-8">
            <div [appReveal]="i * 70">
              <dt class="sr-only">{{ m.label }}</dt>
              <dd class="text-3xl font-semibold tracking-[-0.04em] text-fg sm:text-4xl">{{ m.value }}</dd>
              <dd class="mt-2 text-sm leading-snug text-fg-muted">{{ m.label }}</dd>
            </div>
          </div>
        }
      </dl>
    </section>

    <!-- Focus areas -->
    <section class="container-x mt-32 sm:mt-40">
      <app-section-header
        index="01"
        eyebrow="Capabilities"
        lead="Ten years across ad-tech, mobility, higher education and government — the same core problems, at increasing scale and stakes."
      >
        Architecture for systems that can't afford to fail.
      </app-section-header>

      <div class="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @for (area of focusAreas; track area.code; let i = $index) {
          <article
            appSpotlight
            [appReveal]="(i % 3) * 80"
            class="group flex flex-col rounded-2xl border border-line bg-white/[0.015] p-6 transition-colors duration-300 hover:border-line-strong sm:p-7"
          >
            <div class="flex items-center justify-between">
              <span
                class="grid size-10 place-items-center rounded-xl border border-line bg-ink-900 text-blueprint transition-colors group-hover:border-blueprint/40"
              >
                @switch (area.icon) {
                  @case ('shield') { <svg lucideShieldCheck [size]="18"></svg> }
                  @case ('network') { <svg lucideNetwork [size]="18"></svg> }
                  @case ('landmark') { <svg lucideLandmark [size]="18"></svg> }
                  @case ('layers') { <svg lucideLayers [size]="18"></svg> }
                  @case ('brain') { <svg lucideBrain [size]="18"></svg> }
                  @case ('server') { <svg lucideServer [size]="18"></svg> }
                }
              </span>
              <span class="font-mono text-[11px] text-fg-dim">{{ area.code }}</span>
            </div>
            <h3 class="mt-6 text-lg font-medium tracking-[-0.015em] text-fg">{{ area.title }}</h3>
            <p class="mt-2.5 text-sm leading-relaxed text-pretty text-fg-muted">{{ area.body }}</p>
            <div class="mt-auto flex flex-wrap gap-1.5 pt-6">
              @for (t of area.tags; track t) {
                <span class="chip">{{ t }}</span>
              }
            </div>
          </article>
        }
      </div>
    </section>

    <!-- Selected work -->
    <section class="container-x mt-32 sm:mt-40">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <app-section-header
          index="02"
          eyebrow="Selected work"
          lead="Case studies with the architecture behind them. Details are generalized where systems run in restricted environments."
        >
          Systems, not screenshots.
        </app-section-header>
        <a appReveal routerLink="/projects" class="btn btn-ghost">All case studies <svg lucideArrowRight [size]="16"></svg></a>
      </div>

      <div class="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        @for (p of featured; track p.slug; let i = $index) {
          <app-project-card [appReveal]="i * 90" [project]="p" />
        }
      </div>
    </section>

    <!-- Experience + stack manifest -->
    <section class="container-x mt-32 sm:mt-40">
      <app-section-header index="03" eyebrow="Trajectory">
        A decade of production systems.
      </app-section-header>

      <div class="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <ol class="relative border-t border-line">
          @for (r of experience; track r.company; let i = $index) {
            <li [appReveal]="i * 60">
              <a
                routerLink="/experience"
                [fragment]="r.short.toLowerCase()"
                class="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 border-b border-line py-5 transition-colors sm:grid-cols-[7.5rem_1fr_auto]"
              >
                <span class="order-3 col-span-2 font-mono text-[11px] text-fg-dim sm:order-none sm:col-span-1">
                  {{ r.start.slice(3) }} — {{ r.end === 'Present' ? 'now' : r.end.slice(3) }}
                </span>
                <span>
                  <span class="block font-medium text-fg transition-colors group-hover:text-blueprint">{{ r.company }}</span>
                  <span class="mt-0.5 block text-sm text-fg-muted">{{ r.title }}</span>
                </span>
                <svg
                  lucideArrowUpRight
                  [size]="16"
                  class="text-fg-dim transition-[color,transform] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg"
                ></svg>
              </a>
            </li>
          }
        </ol>

        <!-- stack.yaml -->
        <div appReveal="120" class="glass ticks self-start overflow-hidden rounded-2xl">
          <div class="flex items-center justify-between border-b border-line px-4 py-3 font-mono text-[11px] text-fg-muted">
            <span>stack.yaml</span>
            <span class="text-fg-dim">{{ skillCount }} entries</span>
          </div>
          <pre
            class="px-5 py-5 font-mono text-[12.5px] leading-[1.85] break-words whitespace-pre-wrap"
          ><code><span class="text-fg-dim"># tools I reach for — no percentages, just production use</span>
@for (g of skills; track g.key) {<span class="text-blueprint">{{ g.key }}</span><span class="text-fg-dim">:</span> <span class="text-fg-dim">[</span>@for (item of g.items; track item; let last = $last) {<span class="text-[#a6d9b8]">{{ item }}</span>@if (!last) {<span class="text-fg-dim">, </span>}}<span class="text-fg-dim">]</span>
}</code></pre>
        </div>
      </div>

      <div class="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        @for (p of principles; track p.title; let i = $index) {
          <div class="bg-ink-950 p-6">
            <div [appReveal]="i * 70">
              <span class="font-mono text-[11px] text-signal">0{{ i + 1 }}</span>
              <h3 class="mt-3 font-medium tracking-[-0.01em] text-fg">{{ p.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-fg-muted">{{ p.body }}</p>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- Writing -->
    <section class="container-x mt-32 sm:mt-40">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <app-section-header
          index="04"
          eyebrow="Writing"
          lead="Technical deep-dives on architecture and identity, and personal notes on a decade of engineering."
        >
          Notes from the field.
        </app-section-header>
        <div appReveal class="flex gap-2">
          <a routerLink="/blog/technical" class="btn btn-ghost btn-sm">Technical</a>
          <a routerLink="/blog/personal" class="btn btn-ghost btn-sm">Personal</a>
        </div>
      </div>

      @if (latest(); as posts) {
        <div class="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          @for (post of posts; track post.url; let i = $index) {
            <app-post-card [appReveal]="i * 90" [post]="post" />
          }
        </div>
      } @else {
        <div class="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
          @for (_ of [1, 2, 3]; track $index) {
            <div class="h-64 animate-pulse rounded-2xl border border-line bg-white/[0.02]"></div>
          }
        </div>
      }
    </section>

    <!-- Contact -->
    <section class="container-x mt-32 sm:mt-40" id="contact">
      <div
        appReveal
        class="ticks relative overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-white/[0.04] to-transparent px-6 py-16 text-center sm:px-12 sm:py-24"
      >
        <div
          class="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-80 w-[40rem] max-w-full rounded-full bg-[radial-gradient(closest-side,rgb(138_184_255/0.18),transparent)] blur-2xl"
        ></div>
        <p class="eyebrow">Contact</p>
        <h2 class="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl md:text-6xl">
          <span class="text-sheen">Have a system that needs to</span>
          <span class="font-serif font-normal text-blueprint italic"> scale?</span>
        </h2>
        <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-pretty text-fg-muted sm:text-lg">
          I'm happy to talk about enterprise architecture, identity, integrations, or senior engineering and
          leadership roles.
        </p>
        <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a [href]="'mailto:' + profile.email" class="btn btn-primary"><svg lucideMail [size]="16"></svg> {{ profile.email }}</a>
          <a [href]="profile.linkedin" target="_blank" rel="noopener" class="btn btn-ghost"
            ><app-brand-icon name="linkedin" [size]="15" /> Connect on LinkedIn</a
          >
        </div>
      </div>
    </section>
  `,
})
export class HomePage {
  protected readonly profile = PROFILE;
  protected readonly metrics = METRICS;
  protected readonly focusAreas = FOCUS_AREAS;
  protected readonly experience = EXPERIENCE;
  protected readonly skills = SKILLS;
  protected readonly principles = PRINCIPLES;
  protected readonly skillCount = SKILLS.reduce((n, g) => n + g.items.length, 0);
  protected readonly featured = PROJECTS.filter((p) => p.featured).slice(0, 3);

  protected readonly latest = toSignal(
    inject(ContentService)
      .posts()
      .pipe(
        map((posts) => [...posts].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 3)),
        catchError(() => of([])),
      ),
  );

  constructor() {
    inject(SeoService).set({});
  }
}
