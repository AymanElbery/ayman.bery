import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowUpRight, LucideRss } from '@lucide/angular';
import { PROFILE } from '../data/profile';
import { BrandIcon } from '../shared/brand-icon';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, BrandIcon, LucideArrowUpRight, LucideRss],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="relative mt-32 border-t border-line">
      <div class="container-x grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p class="text-lg font-medium tracking-tight">Ayman Elbery</p>
          <p class="mt-2 max-w-sm text-sm leading-relaxed text-fg-muted">
            Senior Full-Stack Software Engineer building secure, scalable enterprise platforms. Based in {{ profile.location }}.
          </p>
          <div class="mt-6 flex gap-2">
            <a [href]="profile.linkedin" target="_blank" rel="noopener" class="btn btn-ghost btn-icon btn-sm" aria-label="LinkedIn"
              ><app-brand-icon name="linkedin" [size]="15"
            /></a>
            <a [href]="profile.github" target="_blank" rel="noopener" class="btn btn-ghost btn-icon btn-sm" aria-label="GitHub"
              ><app-brand-icon name="github" [size]="16"
            /></a>
            <a href="feed.xml" class="btn btn-ghost btn-icon btn-sm" aria-label="RSS feed"><svg lucideRss [size]="15"></svg></a>
          </div>
        </div>
        <nav aria-label="Footer">
          <p class="eyebrow mb-4">Site</p>
          <ul class="grid gap-2.5 text-sm text-fg-muted">
            <li><a routerLink="/projects" class="link-underline hover:text-fg">Work</a></li>
            <li><a routerLink="/experience" class="link-underline hover:text-fg">Experience</a></li>
            <li><a routerLink="/blog/technical" class="link-underline hover:text-fg">Technical writing</a></li>
            <li><a routerLink="/blog/personal" class="link-underline hover:text-fg">Personal writing</a></li>
          </ul>
        </nav>
        <div>
          <p class="eyebrow mb-4">Contact</p>
          <ul class="grid gap-2.5 text-sm text-fg-muted">
            <li>
              <a [href]="'mailto:' + profile.email" class="link-underline break-all hover:text-fg">{{ profile.email }}</a>
            </li>
            <li>
              <a [href]="profile.resume" download class="inline-flex items-center gap-1 hover:text-fg"
                >Download résumé <svg lucideArrowUpRight [size]="13"></svg
              ></a>
            </li>
          </ul>
        </div>
      </div>
      <div
        class="container-x flex flex-col gap-2 border-t border-line py-6 font-mono text-[11px] text-fg-dim sm:flex-row sm:items-center sm:justify-between"
      >
        <span>© {{ year }} Ayman Elbery</span>
        <span class="flex items-center gap-2">
          <span class="size-1.5 animate-pulse-soft rounded-full bg-ok"></span>
          Built with Angular &amp; Tailwind CSS
        </span>
      </div>
    </footer>
  `,
})
export class Footer {
  protected readonly profile = PROFILE;
  protected readonly year = new Date().getFullYear();
}
