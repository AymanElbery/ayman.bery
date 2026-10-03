import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header';
import { Footer } from './layout/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-grid" aria-hidden="true">
      <div class="aurora aurora-a"></div>
      <div class="aurora aurora-b"></div>
    </div>
    <app-header />
    <main id="main" tabindex="-1" class="outline-none">
      <router-outlet />
    </main>
    <app-footer />
  `,
})
export class App {}
