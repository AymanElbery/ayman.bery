import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowRight, LucideBookOpen, LucideDownload } from '@lucide/angular';
import { PROFILE } from '../../data/profile';
import { Diagram } from '../../data/projects';
import { ArchDiagram } from '../../shared/arch-diagram';
import { BrandIcon } from '../../shared/brand-icon';

/** The reference topology shown in the hero — a simplified view of the systems I build. */
const HERO_TOPOLOGY: Diagram = {
  width: 460,
  height: 530,
  nodes: [
    { id: 'ng', x: 230, y: 45, label: 'Angular', sub: 'client · signals' },
    { id: 'bff', x: 230, y: 150, label: 'BFF · NestJS', sub: 'session · compose', tone: 'accent' },
    { id: 'kc', x: 392, y: 150, label: 'Keycloak', sub: 'OIDC', tone: 'signal', w: 120 },
    { id: 'mq', x: 230, y: 258, label: 'RabbitMQ', sub: 'events', tone: 'signal' },
    { id: 'ora', x: 82, y: 370, label: 'Oracle', sub: 'records', tone: 'store', w: 132 },
    { id: 'redis', x: 230, y: 370, label: 'Redis', sub: 'cache', tone: 'store', w: 132 },
    { id: 'svc', x: 378, y: 370, label: 'Services', sub: 'workers', w: 132 },
    { id: 'ent', x: 230, y: 480, label: 'Enterprise Systems', sub: 'ERP · IDM · gov APIs', tone: 'external', w: 196 },
  ],
  edges: [
    { from: 'ng', to: 'bff', flow: true },
    { from: 'bff', to: 'kc', dashed: true },
    { from: 'bff', to: 'mq', flow: true },
    { from: 'mq', to: 'ora', flow: true },
    { from: 'mq', to: 'redis', flow: true },
    { from: 'mq', to: 'svc', flow: true },
    { from: 'ora', to: 'ent', dashed: true },
    { from: 'svc', to: 'ent', flow: true },
  ],
};

@Component({
  selector: 'app-hero',
  imports: [RouterLink, ArchDiagram, BrandIcon, LucideArrowRight, LucideBookOpen, LucideDownload],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="container-x relative pt-32 pb-20 sm:pt-40 lg:pb-28">
      <div class="grid items-center gap-14 lg:grid-cols-[1.22fr_0.78fr] lg:gap-12">
        <div>
          <div class="enter inline-flex items-center gap-2.5 rounded-full border border-line bg-white/[0.025] py-1 pr-3 pl-1.5 text-xs text-fg-muted">
            <span class="flex items-center gap-1.5 rounded-full bg-white/[0.05] px-2 py-0.5 font-mono text-[10.5px] text-fg">
              <span class="size-1.5 animate-pulse-soft rounded-full bg-ok"></span>
              10+ yrs
            </span>
            <span class="sm:hidden">Senior Full-Stack Engineer · Riyadh</span>
            <span class="hidden sm:inline">{{ profile.role }} · {{ profile.location }}</span>
          </div>

          <h1
            class="enter mt-7 text-[clamp(2.6rem,6vw,4.6rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance"
            style="--enter-delay: 80ms"
          >
            <span class="text-sheen">Building Enterprise Software</span>
            <span class="font-serif font-normal tracking-[-0.02em] text-blueprint italic"> That Scales.</span>
          </h1>

          <p
            class="enter mt-7 max-w-xl text-lg leading-relaxed text-pretty text-fg-muted sm:text-xl"
            style="--enter-delay: 160ms"
          >
            Senior Full-Stack Software Engineer focused on enterprise architecture, distributed systems, digital
            transformation, and modern web platforms.
          </p>

          <div class="enter mt-9 flex flex-wrap items-center gap-3" style="--enter-delay: 240ms">
            <a routerLink="/projects" class="btn btn-primary">
              View Projects <svg lucideArrowRight [size]="16"></svg>
            </a>
            <a routerLink="/blog" class="btn btn-ghost"><svg lucideBookOpen [size]="16"></svg> Read Articles</a>
            <a [href]="profile.resume" download class="btn btn-ghost"><svg lucideDownload [size]="16"></svg> Download Resume</a>
            <div class="flex gap-2">
              <a [href]="profile.linkedin" target="_blank" rel="noopener" class="btn btn-ghost btn-icon" aria-label="LinkedIn profile"
                ><app-brand-icon name="linkedin" [size]="16"
              /></a>
              <a [href]="profile.github" target="_blank" rel="noopener" class="btn btn-ghost btn-icon" aria-label="GitHub profile"
                ><app-brand-icon name="github" [size]="17"
              /></a>
            </div>
          </div>

          <p class="enter mt-12 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[11px] text-fg-dim" style="--enter-delay: 320ms">
            @for (s of stackLine; track s; let last = $last) {
              <span>{{ s }}</span>
              @if (!last) {
                <span class="text-line-strong">/</span>
              }
            }
          </p>
        </div>

        <!-- Architecture topology -->
        <div class="enter relative" style="--enter-delay: 200ms">
          <div
            class="pointer-events-none absolute -inset-y-10 inset-x-0 -z-10 rounded-full lg:-inset-10 bg-[radial-gradient(closest-side,rgb(138_184_255/0.14),transparent)] blur-2xl"
          ></div>
          <div class="glass ticks rounded-2xl">
            <div class="flex items-center justify-between border-b border-line px-4 py-3">
              <div class="flex items-center gap-2 font-mono text-[11px] text-fg-muted">
                <span class="flex gap-1">
                  <span class="size-2 rounded-full bg-white/10"></span>
                  <span class="size-2 rounded-full bg-white/10"></span>
                  <span class="size-2 rounded-full bg-white/10"></span>
                </span>
                <span class="ml-2">reference-topology.svg</span>
              </div>
              <span class="flex items-center gap-1.5 font-mono text-[10.5px] text-fg-dim">
                <span class="size-1.5 animate-pulse-soft rounded-full bg-signal"></span> event flow
              </span>
            </div>
            <div class="mx-auto max-w-[27rem] px-3 py-4 sm:px-6 sm:py-6">
              <app-arch-diagram
                [diagram]="topology"
                [floating]="true"
                [scrollable]="false"
                label="Reference architecture: Angular client, NestJS backend-for-frontend with Keycloak, RabbitMQ event bus, Oracle, Redis and worker services, connected to enterprise systems"
              />
            </div>
            <div class="flex items-center justify-between border-t border-line px-4 py-2.5 font-mono text-[10.5px] text-fg-dim">
              <span>hover a node to trace it</span>
              <span>v2026.09</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class Hero {
  protected readonly profile = PROFILE;
  protected readonly topology = HERO_TOPOLOGY;
  protected readonly stackLine = ['Angular', 'NestJS', 'Keycloak', 'RabbitMQ', 'Redis', 'Oracle', 'Docker', 'RAG'];
}
