import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { Diagram, DiagramNode, NodeTone } from '../data/projects';
import { injectReducedMotion } from '../core/motion';

const NODE_W = 150;
const NODE_H = 52;

interface EdgeView {
  key: string;
  from: string;
  to: string;
  d: string;
  mid: { x: number; y: number };
  label?: string;
  dashed: boolean;
  flow: boolean;
  delay: number;
}

const TONES: Record<NodeTone, { fill: string; stroke: string; dot: string; dash?: string }> = {
  default: { fill: 'rgb(255 255 255 / 0.035)', stroke: 'rgb(255 255 255 / 0.14)', dot: '#9aa3b2' },
  accent: { fill: 'rgb(138 184 255 / 0.09)', stroke: 'rgb(138 184 255 / 0.6)', dot: '#8ab8ff' },
  signal: { fill: 'rgb(242 183 101 / 0.07)', stroke: 'rgb(242 183 101 / 0.5)', dot: '#f2b765' },
  store: { fill: 'rgb(126 224 181 / 0.05)', stroke: 'rgb(126 224 181 / 0.38)', dot: '#7ee0b5' },
  external: { fill: 'rgb(255 255 255 / 0.015)', stroke: 'rgb(255 255 255 / 0.22)', dot: '#646d7d', dash: '4 4' },
};

let uid = 0;

/**
 * Renders an architecture diagram from plain data (see data/projects.ts).
 * - Edges route from box edge to box edge with smooth cubic curves.
 * - Hover/focus a node to trace its connections.
 * - Packets travel along "flow" edges unless the user prefers reduced motion.
 * - On narrow screens the diagram keeps a legible minimum width and scrolls.
 */
@Component({
  selector: 'app-arch-diagram',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="relative m-0">
      <div class="scroll-x" [class.-mx-1]="scrollable()">
        <svg
          [attr.viewBox]="'0 0 ' + diagram().width + ' ' + diagram().height"
          [style.min-width.px]="scrollable() ? diagram().width * minScale() : null"
          class="block h-auto w-full select-none"
          role="img"
          [attr.aria-label]="label()"
          (pointerleave)="active.set(null)"
        >
          <defs>
            <marker [attr.id]="id + '-arrow'" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M1 1 L7 4 L1 7" fill="none" stroke="rgb(255 255 255 / 0.35)" stroke-width="1.2" stroke-linecap="round" />
            </marker>
            <marker [attr.id]="id + '-arrow-on'" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M1 1 L7 4 L1 7" fill="none" stroke="#8ab8ff" stroke-width="1.2" stroke-linecap="round" />
            </marker>
            <radialGradient [attr.id]="id + '-packet'">
              <stop offset="0" stop-color="#fff" />
              <stop offset="0.4" stop-color="#f2b765" />
              <stop offset="1" stop-color="#f2b765" stop-opacity="0" />
            </radialGradient>
          </defs>

          @for (lane of diagram().lanes ?? []; track lane.label) {
            <g>
              <line x1="12" [attr.x2]="diagram().width - 12" [attr.y1]="lane.y" [attr.y2]="lane.y" stroke="rgb(255 255 255 / 0.06)" stroke-dasharray="2 6" />
              <text x="14" [attr.y]="lane.y - 7" class="fill-fg-dim font-mono" font-size="10" letter-spacing="1.4">{{ lane.label.toUpperCase() }}</text>
            </g>
          }

          <!-- edges -->
          @for (e of edges(); track e.key) {
            <g [style.opacity]="edgeOpacity(e)" style="transition: opacity .3s ease">
              <path
                [attr.d]="e.d"
                fill="none"
                [attr.stroke]="isLit(e) ? 'rgb(138 184 255 / 0.75)' : 'rgb(255 255 255 / 0.16)'"
                stroke-width="1.2"
                [attr.stroke-dasharray]="e.dashed ? '3 5' : null"
                [attr.marker-end]="'url(#' + id + (isLit(e) ? '-arrow-on' : '-arrow') + ')'"
                style="transition: stroke .3s ease"
              />
              @if (e.flow && animated() && !reducedMotion()) {
                <path [attr.d]="e.d" fill="none" stroke="rgb(138 184 255 / 0.35)" stroke-width="1.2" class="diagram-edge-flow" />
                <circle r="4" [attr.fill]="'url(#' + id + '-packet)'">
                  <animateMotion [attr.path]="e.d" dur="3.2s" [attr.begin]="e.delay + 's'" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
                </circle>
              }
              @if (e.label) {
                <g [attr.transform]="'translate(' + e.mid.x + ' ' + e.mid.y + ')'">
                  <rect [attr.x]="-(e.label.length * 3.2 + 8)" y="-9" [attr.width]="e.label.length * 6.4 + 16" height="18" rx="9" fill="#0b0e14" stroke="rgb(255 255 255 / 0.08)" />
                  <text text-anchor="middle" dominant-baseline="central" font-size="10" class="fill-fg-muted font-mono">{{ e.label }}</text>
                </g>
              }
            </g>
          }

          <!-- nodes -->
          @for (n of diagram().nodes; track n.id; let i = $index) {
            <g
              class="diagram-node cursor-default outline-none"
              [class.floating]="floating() && !reducedMotion()"
              [style.--float-delay]="i * -0.9 + 's'"
              [style.opacity]="nodeOpacity(n.id)"
              style="transition: opacity .3s ease"
              [attr.tabindex]="interactive() ? 0 : null"
              [attr.aria-label]="n.label + (n.sub ? ', ' + n.sub : '')"
              (pointerenter)="interactive() && active.set(n.id)"
              (focus)="active.set(n.id)"
              (blur)="active.set(null)"
            >
              <rect
                [attr.x]="n.x - w(n) / 2"
                [attr.y]="n.y - h / 2"
                [attr.width]="w(n)"
                [attr.height]="h"
                rx="11"
                [attr.fill]="tone(n).fill"
                [attr.stroke]="active() === n.id ? '#8ab8ff' : tone(n).stroke"
                [attr.stroke-dasharray]="tone(n).dash ?? null"
                stroke-width="1"
                style="transition: stroke .25s ease"
              />
              <circle [attr.cx]="n.x - w(n) / 2 + 14" [attr.cy]="n.y - (n.sub ? 7 : 0)" r="2.6" [attr.fill]="tone(n).dot" />
              <text
                [attr.x]="n.x - w(n) / 2 + 24"
                [attr.y]="n.y - (n.sub ? 7 : 0)"
                dominant-baseline="central"
                font-size="12.5"
                font-weight="500"
                class="fill-fg font-sans"
              >{{ n.label }}</text>
              @if (n.sub) {
                <text
                  [attr.x]="n.x - w(n) / 2 + 24"
                  [attr.y]="n.y + 10"
                  dominant-baseline="central"
                  font-size="10"
                  fill="#7d8697"
                  class="font-mono"
                >{{ n.sub }}</text>
              }
            </g>
          }
        </svg>
      </div>
      <figcaption class="sr-only">
        {{ label() }}. Connections:
        @for (e of edges(); track e.key) {
          {{ nodeLabel(e.from) }} to {{ nodeLabel(e.to) }}{{ e.label ? ' (' + e.label + ')' : '' }};
        }
      </figcaption>
    </figure>
  `,
})
export class ArchDiagram {
  readonly diagram = input.required<Diagram>();
  readonly label = input('Architecture diagram');
  readonly animated = input(true);
  readonly floating = input(false);
  /** Hover/focus tracing. Disable when the diagram sits inside a link. */
  readonly interactive = input(true);
  /** Keep a minimum legible width and scroll horizontally on narrow screens. */
  readonly scrollable = input(true);
  readonly minScale = input(0.82);

  protected readonly id = `dg${++uid}`;
  protected readonly h = NODE_H;
  protected readonly active = signal<string | null>(null);
  protected readonly reducedMotion = injectReducedMotion();

  private readonly byId = computed(() => new Map(this.diagram().nodes.map((n) => [n.id, n])));

  protected readonly edges = computed<EdgeView[]>(() => {
    const nodes = this.byId();
    return this.diagram().edges.map((e, i) => {
      const a = nodes.get(e.from);
      const b = nodes.get(e.to);
      if (!a || !b) throw new Error(`Diagram edge references unknown node: ${e.from} → ${e.to}`);
      const { d, mid } = route(a, b);
      return {
        key: `${e.from}->${e.to}`,
        from: e.from,
        to: e.to,
        d,
        mid,
        label: e.label,
        dashed: !!e.dashed,
        flow: !!e.flow,
        delay: (i * 0.53) % 3.2,
      };
    });
  });

  protected w(n: DiagramNode) {
    return n.w ?? NODE_W;
  }

  protected tone(n: DiagramNode) {
    return TONES[n.tone ?? 'default'];
  }

  protected nodeLabel(id: string) {
    return this.byId().get(id)?.label ?? id;
  }

  protected isLit(e: EdgeView) {
    const a = this.active();
    return !!a && (e.from === a || e.to === a);
  }

  protected edgeOpacity(e: EdgeView) {
    return !this.active() || this.isLit(e) ? 1 : 0.25;
  }

  protected nodeOpacity(id: string) {
    const a = this.active();
    if (!a || a === id) return 1;
    return this.edges().some((e) => (e.from === a && e.to === id) || (e.to === a && e.from === id)) ? 1 : 0.4;
  }
}

/** Box-edge to box-edge cubic curve; vertical when rows differ enough, otherwise horizontal. */
function route(a: DiagramNode, b: DiagramNode) {
  const aw = (a.w ?? NODE_W) / 2;
  const bw = (b.w ?? NODE_W) / 2;
  const hh = NODE_H / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const gap = 3; // keep arrowheads off the border

  if (Math.abs(dy) > Math.abs(dx) * 0.35) {
    const s = Math.sign(dy);
    const x1 = a.x;
    const y1 = a.y + s * hh;
    const x2 = b.x;
    const y2 = b.y - s * (hh + gap);
    const my = (y1 + y2) / 2;
    return { d: `M${x1} ${y1} C${x1} ${my} ${x2} ${my} ${x2} ${y2}`, mid: { x: (x1 + x2) / 2, y: my } };
  }
  const s = Math.sign(dx) || 1;
  const x1 = a.x + s * aw;
  const y1 = a.y;
  const x2 = b.x - s * (bw + gap);
  const y2 = b.y;
  const mx = (x1 + x2) / 2;
  return { d: `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`, mid: { x: mx, y: (y1 + y2) / 2 } };
}
