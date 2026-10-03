import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PROJECTS } from '../../data/projects';
import { SeoService } from '../../core/seo.service';
import { ProjectCard } from '../../shared/project-card';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-projects',
  imports: [ProjectCard, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="container-x pt-32 sm:pt-40">
      <p class="enter eyebrow">Work · {{ projects.length }} case studies</p>
      <h1
        class="enter mt-5 max-w-4xl text-[clamp(2.4rem,5.5vw,4.25rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-balance"
        style="--enter-delay: 60ms"
      >
        <span class="text-sheen">Architecture behind the</span>
        <span class="font-serif font-normal text-blueprint italic"> work.</span>
      </h1>
      <p class="enter mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-fg-muted" style="--enter-delay: 120ms">
        Identity platforms, government integrations, event-driven workflows and AI in restricted networks. Each case
        study describes the problem, the constraints and the architecture — client-specific details are generalized.
      </p>
    </section>

    <section class="container-x mt-16">
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        @for (p of projects; track p.slug; let i = $index) {
          <app-project-card [appReveal]="(i % 3) * 80" [project]="p" />
        }
      </div>
    </section>
  `,
})
export class ProjectsPage {
  protected readonly projects = PROJECTS;

  constructor() {
    inject(SeoService).set({
      title: 'Work',
      description: 'Case studies in enterprise architecture: identity & SSO, government integrations, event-driven systems, RAG and large-scale platforms.',
    });
  }
}
