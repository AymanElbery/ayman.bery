import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

const SITE = 'Ayman Elbery';
const DEFAULT_DESCRIPTION =
  'Senior Full-Stack Software Engineer focused on enterprise architecture, distributed systems, identity, and modern web platforms.';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  set(opts: { title?: string; description?: string; type?: 'website' | 'article' }) {
    const fullTitle = opts.title ? `${opts.title} — ${SITE}` : `${SITE} — Senior Full-Stack Engineer & Enterprise Architect`;
    const description = opts.description ?? DEFAULT_DESCRIPTION;
    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: opts.type ?? 'website' });
    this.meta.updateTag({ property: 'og:url', content: this.document.location.href });
  }
}
