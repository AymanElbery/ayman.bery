import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';

export type PostCategory = 'personal' | 'technical';

export const CATEGORY_META: Record<PostCategory, { label: string; blurb: string }> = {
  technical: {
    label: 'Technical',
    blurb: 'Architecture, identity, distributed systems and the details that make enterprise software work.',
  },
  personal: {
    label: 'Personal',
    blurb: 'Reflections on career, leadership, mentoring and a decade of building software.',
  },
};

export interface PostMeta {
  slug: string;
  category: PostCategory;
  url: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: string[];
  featured: boolean;
  draft: boolean;
  readingTime: number;
}

export interface Post extends PostMeta {
  html: string;
  headings: { id: string; depth: number; text: string }[];
  hasMermaid: boolean;
}

interface ContentIndex {
  generatedAt: string;
  tags: string[];
  posts: PostMeta[];
}

/**
 * Reads the JSON emitted by scripts/build-content.mjs from /content.
 * Markdown lives in /content/blog/<category>/*.md.
 */
@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);

  private readonly index$ = this.http
    .get<ContentIndex>('content/index.json')
    .pipe(shareReplay({ bufferSize: 1, refCount: false }));

  posts(category?: PostCategory | null): Observable<PostMeta[]> {
    return this.index$.pipe(map((i) => (category ? i.posts.filter((p) => p.category === category) : i.posts)));
  }

  post(category: string, slug: string): Observable<Post> {
    return this.http.get<Post>(`content/posts/${encodeURIComponent(category)}/${encodeURIComponent(slug)}.json`);
  }
}
