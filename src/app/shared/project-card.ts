import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowRight } from '@lucide/angular';
import { Project } from '../data/projects';
import { ArchDiagram } from './arch-diagram';
import { SpotlightDirective } from './spotlight.directive';

@Component({
  selector: 'app-project-card',
  imports: [RouterLink, ArchDiagram, LucideArrowRight, SpotlightDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
  template: `
    <a
      appSpotlight
      [routerLink]="['/projects', project().slug]"
      class="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white/[0.015] transition-[border-color,background-color,transform] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-line-strong"
    >
      <!-- diagram preview -->
      <div class="relative border-b border-line bg-ink-900/60 px-4 pt-4 pb-2" aria-hidden="true">
        <div
          class="mask-fade-b pointer-events-none opacity-70 transition-opacity duration-500 group-hover:opacity-100"
        >
          <app-arch-diagram [diagram]="project().diagram" [animated]="false" [scrollable]="false" [interactive]="false" />
        </div>
        <span class="absolute top-4 left-4 font-mono text-[11px] text-blueprint">{{ project().index }}</span>
      </div>

      <div class="flex flex-1 flex-col p-6 sm:p-7">
        <p class="eyebrow !text-[0.66rem]">{{ project().domain }} · {{ project().org }}</p>
        <h3 class="mt-3 text-xl leading-snug font-medium tracking-[-0.02em] text-balance text-fg">{{ project().title }}</h3>
        <p class="mt-3 text-sm leading-relaxed text-pretty text-fg-muted">{{ project().summary }}</p>
        <div class="mt-auto flex flex-wrap items-center gap-1.5 pt-6">
          @for (t of project().stack.slice(0, 4); track t) {
            <span class="chip">{{ t }}</span>
          }
          <span
            class="ml-auto inline-flex items-center gap-1 text-sm text-fg-muted transition-colors group-hover:text-fg"
          >
            Case study
            <svg lucideArrowRight [size]="15" class="transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5"></svg>
          </span>
        </div>
      </div>
    </a>
  `,
})
export class ProjectCard {
  readonly project = input.required<Project>();
}
