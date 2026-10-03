import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomePage),
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects/projects').then((m) => m.ProjectsPage),
  },
  {
    path: 'projects/:slug',
    loadComponent: () => import('./pages/project-detail/project-detail').then((m) => m.ProjectDetailPage),
  },
  {
    path: 'experience',
    loadComponent: () => import('./pages/experience/experience').then((m) => m.ExperiencePage),
  },
  {
    path: 'blog',
    loadComponent: () => import('./pages/blog/blog').then((m) => m.BlogPage),
    data: { category: null },
  },
  {
    path: 'blog/personal',
    loadComponent: () => import('./pages/blog/blog').then((m) => m.BlogPage),
    data: { category: 'personal' },
  },
  {
    path: 'blog/technical',
    loadComponent: () => import('./pages/blog/blog').then((m) => m.BlogPage),
    data: { category: 'technical' },
  },
  {
    path: 'blog/:category/:slug',
    loadComponent: () => import('./pages/post/post').then((m) => m.PostPage),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFoundPage),
  },
];
