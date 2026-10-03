import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowUpRight } from '@lucide/angular';
import { CATEGORY_META, PostMeta } from '../core/content.service';
import { SpotlightDirective } from './spotlight.directive';

@Component({
  selector: 'app-post-card',
  imports: [RouterLink, DatePipe, LucideArrowUpRight, SpotlightDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
  template: `
    <a
      appSpotlight
      [routerLink]="post().url"
      class="group flex h-full flex-col rounded-2xl border border-line bg-white/[0.015] p-6 transition-[border-color,background-color,transform] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-line-strong hover:bg-white/[0.03] sm:p-7"
    >
      <div class="flex items-center justify-between gap-3">
        <span class="chip" [class.!text-blueprint]="post().category === 'technical'" [class.!text-signal]="post().category === 'personal'">
          {{ categoryLabel() }}
        </span>
        <svg
          lucideArrowUpRight
          [size]="18"
          class="text-fg-dim transition-[color,transform] duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg"
        ></svg>
      </div>
      <h3 class="mt-6 text-xl leading-snug font-medium tracking-[-0.02em] text-balance text-fg">
        {{ post().title }}
      </h3>
      <p class="mt-3 line-clamp-3 text-sm leading-relaxed text-pretty text-fg-muted">{{ post().description }}</p>
      <div class="mt-auto flex items-center gap-3 pt-6 font-mono text-[11px] text-fg-dim">
        <time [attr.datetime]="post().date">{{ post().date | date: 'MMM d, y' : 'UTC' }}</time>
        <span class="size-0.5 rounded-full bg-fg-dim"></span>
        <span>{{ post().readingTime }} min read</span>
      </div>
    </a>
  `,
})
export class PostCard {
  readonly post = input.required<PostMeta>();
  protected categoryLabel = () => CATEGORY_META[this.post().category].label;
}
