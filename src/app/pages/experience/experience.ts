import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LucideAward, LucideDownload, LucideGraduationCap, LucideLanguages, LucideMapPin } from '@lucide/angular';
import { CERTIFICATIONS, EDUCATION, EXPERIENCE, LANGUAGES, PROFILE, SKILLS } from '../../data/profile';
import { SeoService } from '../../core/seo.service';
import { RevealDirective } from '../../shared/reveal.directive';
import { SectionHeader } from '../../shared/section-header';

const SKILL_LABELS: Record<string, string> = {
  frontend: 'Front-end',
  backend: 'Back-end & APIs',
  identity: 'Identity & Security',
  data: 'Databases & Caching',
  messaging: 'Messaging & Real-time',
  geospatial: 'Maps & Geospatial',
  ai: 'AI & LLM',
  infrastructure: 'DevOps & Infrastructure',
  integration: 'Enterprise Integration',
  architecture: 'Architecture & Engineering',
};

@Component({
  selector: 'app-experience',
  imports: [
    RevealDirective,
    SectionHeader,
    LucideAward,
    LucideDownload,
    LucideGraduationCap,
    LucideLanguages,
    LucideMapPin,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="container-x pt-32 sm:pt-40">
      <div class="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p class="enter eyebrow">Experience · 2016 — Present</p>
          <h1
            class="enter mt-5 text-[clamp(2.4rem,5.5vw,4.25rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-balance"
            style="--enter-delay: 60ms"
          >
            <span class="text-sheen">Ten years of shipping systems people</span>
            <span class="font-serif font-normal text-blueprint italic"> rely on.</span>
          </h1>
        </div>
        <div class="enter flex flex-wrap gap-3 lg:justify-end" style="--enter-delay: 140ms">
          <a [href]="profile.resume" download class="btn btn-primary"><svg lucideDownload [size]="16"></svg> Download résumé (PDF)</a>
        </div>
      </div>
      <div class="enter mt-10 grid gap-5 text-lg leading-relaxed text-pretty text-fg-muted md:grid-cols-3" style="--enter-delay: 180ms">
        @for (para of profile.longSummary; track $index) {
          <p>{{ para }}</p>
        }
      </div>
    </section>

    <!-- Timeline -->
    <section class="container-x mt-28" aria-labelledby="timeline-title">
      <h2 id="timeline-title" class="sr-only">Roles</h2>
      <ol class="relative">
        @for (r of experience; track r.company; let i = $index; let last = $last) {
          <li [id]="r.short.toLowerCase()" class="relative grid gap-6 pb-16 md:grid-cols-[13rem_1fr] md:gap-12">
            <!-- rail -->
            <div class="md:sticky md:top-24 md:self-start">
              <div appReveal class="flex items-center gap-3 md:block">
                <p class="font-mono text-xs text-fg-dim">{{ r.start }} — {{ r.end }}</p>
                <p class="mt-0 flex items-center gap-1 text-xs text-fg-dim md:mt-2">
                  <svg lucideMapPin [size]="12"></svg>{{ r.location }}
                </p>
              </div>
            </div>

            <div class="relative border-l border-line pl-6 md:pl-10" [class.pb-2]="last">
              <span
                class="absolute top-1.5 -left-[5px] size-[9px] rounded-full border"
                [class]="i === 0 ? 'border-signal bg-signal/30' : 'border-blueprint/60 bg-ink-950'"
              ></span>
              <div appReveal>
                <h3 class="text-2xl font-semibold tracking-[-0.025em] text-fg">
                  {{ r.company }}
                  @if (r.short !== r.company) {
                    <span class="font-normal text-fg-dim">({{ r.short }})</span>
                  }
                </h3>
                <p class="mt-1 text-fg-muted">{{ r.title }}</p>
                <p class="mt-5 max-w-2xl text-[15px] leading-relaxed text-fg">{{ r.summary }}</p>
              </div>
              <ul class="mt-6 grid max-w-3xl gap-3">
                @for (h of r.highlights; track $index; let j = $index) {
                  <li [appReveal]="j * 40" class="relative pl-5 text-[15px] leading-relaxed text-fg-muted">
                    <span class="absolute top-[0.8em] left-0 h-px w-2.5 bg-blueprint/70"></span>
                    {{ h }}
                  </li>
                }
              </ul>
              <div appReveal class="mt-6 flex flex-wrap gap-1.5">
                @for (t of r.stack; track t) {
                  <span class="chip">{{ t }}</span>
                }
              </div>
            </div>
          </li>
        }
      </ol>
    </section>

    <!-- Skills -->
    <section class="container-x mt-20">
      <app-section-header index="—" eyebrow="Skills" lead="Grouped by where they show up in a system, not by self-rating.">
        Toolbox.
      </app-section-header>
      <dl class="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
        @for (g of skills; track g.key; let i = $index) {
          <div class="bg-ink-950 p-6">
            <div [appReveal]="(i % 2) * 60">
              <dt class="font-mono text-[11px] tracking-[0.12em] text-blueprint uppercase">{{ label(g.key) }}</dt>
              <dd class="mt-3 text-[15px] leading-relaxed text-fg-muted">{{ g.items.join(' · ') }}</dd>
            </div>
          </div>
        }
      </dl>
    </section>

    <!-- Education / certs / languages -->
    <section class="container-x mt-20 grid gap-4 md:grid-cols-3">
      <div appReveal class="rounded-2xl border border-line p-6">
        <svg lucideGraduationCap [size]="20" class="text-blueprint"></svg>
        <h2 class="eyebrow mt-5">Education</h2>
        <p class="mt-3 font-medium text-fg">{{ education.degree }}</p>
        <p class="mt-1 text-sm text-fg-muted">{{ education.school }}, {{ education.location }}</p>
        <p class="mt-3 font-mono text-xs text-fg-dim">Class of {{ education.year }}</p>
      </div>
      <div appReveal="80" class="rounded-2xl border border-line p-6">
        <svg lucideAward [size]="20" class="text-blueprint"></svg>
        <h2 class="eyebrow mt-5">Certifications</h2>
        <ul class="mt-3 grid gap-3">
          @for (c of certifications; track c.name) {
            <li>
              <p class="font-medium text-fg">{{ c.name }}</p>
              <p class="font-mono text-xs text-fg-dim">{{ c.issuer }}</p>
            </li>
          }
        </ul>
      </div>
      <div appReveal="160" class="rounded-2xl border border-line p-6">
        <svg lucideLanguages [size]="20" class="text-blueprint"></svg>
        <h2 class="eyebrow mt-5">Languages</h2>
        <ul class="mt-3 grid gap-3">
          @for (l of languages; track l.name) {
            <li>
              <p class="font-medium text-fg">{{ l.name }}</p>
              <p class="text-sm text-fg-muted">{{ l.level }}</p>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
})
export class ExperiencePage {
  protected readonly profile = PROFILE;
  protected readonly experience = EXPERIENCE;
  protected readonly skills = SKILLS;
  protected readonly education = EDUCATION;
  protected readonly certifications = CERTIFICATIONS;
  protected readonly languages = LANGUAGES;
  protected readonly label = (key: string) => SKILL_LABELS[key] ?? key;

  constructor() {
    inject(SeoService).set({
      title: 'Experience',
      description: 'Ten years of enterprise software: RSAF, Saudi Electronic University, Buseet, Afaqy and Speakol.',
    });
  }
}
