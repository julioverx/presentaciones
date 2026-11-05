/**
 * VeraBackgroundEngine - Sistema Gráfico Generativo Canónico (Estilo Julio Vera)
 * Proyecta secuencialmente las 5 formas canónicas colosales del Método VERA
 * con crecimiento concéntrico ("Easy Easy"), desenfoque vaporoso predominante
 * y nexos sincronizados por opacidad pura sin rebote.
 */
class VeraBackgroundEngine {
  constructor(options = {}) {
    this.container = typeof options.container === 'string'
      ? document.querySelector(options.container)
      : options.container;

    this.isDark = !!options.isDark;
    this.viewWidth = options.viewWidth || 1920;
    this.viewHeight = options.viewHeight || 1080;
    this.centerX = this.viewWidth / 2;
    this.centerY = this.viewHeight / 2;
    this.cycleDuration = options.cycleDuration || 14000; // 14 segundos por forma
    this.currentIdx = 0;
    this.timer = null;

    this.paletteLight = {
      primary: '#0f2e5a',
      secondary: '#7c98b6',
      tertiary: '#cbd5e1',
      strokeMain: '#0f2e5a',
      strokeMuted: '#64748b',
      strokeSoft: '#94a3b8'
    };

    this.paletteDark = {
      primary: '#ffffff',
      secondary: '#93c5fd',
      tertiary: '#60a5fa',
      strokeMain: '#ffffff',
      strokeMuted: '#93c5fd',
      strokeSoft: '#60a5fa'
    };

    this.init();
  }

  init() {
    if (!this.container) return;

    // Crear o recuperar el SVG de proyección
    let svg = this.container.querySelector('svg.vera-canonical-stage');
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'vera-canonical-stage');
      svg.setAttribute('viewBox', `0 0 ${this.viewWidth} ${this.viewHeight}`);
      svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
      this.container.appendChild(svg);
    }
    this.svg = svg;

    if (this.container.parentElement) {
      this.container.parentElement.classList.toggle('dark-theme-active', this.isDark);
    }

    this.spawnShape(0);
    this.startCycle();
  }

  calcRx(size) {
    if (size >= 38) return 5;
    return Math.min(4, Math.max(2, +(size * 0.13).toFixed(1)));
  }

  createNode(cx, cy, size, fill, stroke = 'none', strokeWidth = 1.5, isDiamond = false, fillOpacity = 1, stage = 'nexus-end') {
    const half = size / 2;
    const x = (cx - half).toFixed(1);
    const y = (cy - half).toFixed(1);
    const rx = this.calcRx(size);
    const rot = isDiamond ? `transform="rotate(45 ${cx.toFixed(1)} ${cy.toFixed(1)})"` : '';
    return `<rect class="blueprint-node ${stage}" x="${x}" y="${y}" width="${size.toFixed(1)}" height="${size.toFixed(1)}" rx="${rx}" fill="${fill}" fill-opacity="${fillOpacity}" stroke="${stroke}" stroke-width="${strokeWidth}" ${rot}/>`;
  }

  // 1. El Ojo (Lente Semiótico Colosal)
  shapeEye(pal) {
    const span = 1100; // Proporción colosal desbordante para canvas 1920x1080
    let svg = '';
    svg += `<line class="blueprint-line" x1="${-span * 1.9}" y1="${span * 1.9}" x2="${span * 1.9}" y2="${-span * 1.9}" stroke="${pal.strokeSoft}" stroke-width="2.5"/>`;
    svg += `<path class="blueprint-line delay-1" d="M ${-span} ${span} C ${-span} ${-span * 0.38}, ${-span * 0.38} ${-span}, ${span} ${-span} C ${span} ${span * 0.38}, ${span * 0.38} ${span}, ${-span} ${span} Z" stroke="${pal.strokeMain}" stroke-width="3.8" fill="none"/>`;

    svg += this.createNode(0, 0, 360, pal.secondary, 'none', 0, true, 0.22, 'nexus-split');
    svg += this.createNode(0, 0, 180, pal.primary, 'none', 0, true, 1, 'nexus-split');
    svg += this.createNode(-span, span, 84, pal.secondary, 'none', 0, false, 1, 'nexus-end');
    svg += this.createNode(span, -span, 84, pal.primary, 'none', 0, false, 1, 'nexus-end');

    return `<g transform="translate(${this.centerX}, ${this.centerY}) rotate(-26)">${svg}</g>`;
  }

  // 2. La Gran Bifurcación Colosal
  shapeBranch(pal) {
    let svg = '';
    svg += `<line class="blueprint-line" x1="0" y1="920" x2="0" y2="-920" stroke="${pal.strokeSoft}" stroke-width="2" stroke-dasharray="16 16"/>`;
    svg += `<line class="blueprint-line" x1="0" y1="640" x2="0" y2="100" stroke="${pal.strokeMain}" stroke-width="4.2"/>`;
    svg += `<line class="blueprint-line delay-1" x1="0" y1="100" x2="0" y2="-640" stroke="${pal.strokeMain}" stroke-width="3.8"/>`;
    svg += `<path class="blueprint-line delay-1" d="M 0 100 C 0 -160, -300 -420, -680 -640" stroke="${pal.strokeSoft}" stroke-width="3.4" fill="none"/>`;
    svg += `<path class="blueprint-line delay-1" d="M 0 100 C 0 -160, 300 -420, 680 -640" stroke="${pal.strokeMain}" stroke-width="3.8" fill="none"/>`;
    svg += `<line class="blueprint-line delay-2" x1="-680" y1="-640" x2="-980" y2="-840" stroke="${pal.strokeSoft}" stroke-width="2" stroke-dasharray="12 12"/>`;
    svg += `<line class="blueprint-line delay-2" x1="680" y1="-640" x2="980" y2="-840" stroke="${pal.strokeMain}" stroke-width="2" stroke-dasharray="12 12"/>`;

    svg += this.createNode(0, 640, 240, 'none', pal.strokeSoft, 2, false, 1, 'nexus-base');
    svg += this.createNode(0, 640, 110, pal.primary, 'none', 0, false, 1, 'nexus-base');
    svg += this.createNode(0, 100, 88, pal.secondary, 'none', 0, true, 1, 'nexus-split');
    svg += this.createNode(-680, -640, 96, pal.tertiary, 'none', 0, false, 1, 'nexus-end');
    svg += this.createNode(0, -640, 96, pal.secondary, 'none', 0, false, 1, 'nexus-end');
    svg += this.createNode(680, -640, 106, pal.primary, 'none', 0, false, 1, 'nexus-end');

    return `<g transform="translate(${this.centerX}, ${this.centerY})">${svg}</g>`;
  }

  // 3. Arcos Tangentes Opuestos Colosales
  shapeArcs(pal) {
    let svg = '';
    svg += `<line class="blueprint-line" x1="-1200" y1="-1200" x2="1200" y2="1200" stroke="${pal.strokeSoft}" stroke-width="2.2" stroke-dasharray="16 16"/>`;
    svg += `<path class="blueprint-line delay-1" d="M -860 -150 C -860 360, -360 860, 150 860" stroke="${pal.strokeMain}" stroke-width="4.2" fill="none"/>`;
    svg += `<path class="blueprint-line delay-1" d="M 860 150 C 860 -360, 360 -860, -150 -860" stroke="${pal.strokeSoft}" stroke-width="3.8" fill="none"/>`;

    svg += this.createNode(0, 0, 320, 'none', pal.strokeSoft, 2, true, 1, 'nexus-split');
    svg += this.createNode(0, 0, 150, pal.primary, 'none', 0, true, 1, 'nexus-split');
    svg += this.createNode(-860, -150, 84, pal.secondary, 'none', 0, false, 1, 'nexus-end');
    svg += this.createNode(150, 860, 84, pal.tertiary, 'none', 0, false, 1, 'nexus-end');
    svg += this.createNode(860, 150, 84, pal.primary, 'none', 0, false, 1, 'nexus-end');
    svg += this.createNode(-150, -860, 84, pal.secondary, 'none', 0, false, 1, 'nexus-end');

    return `<g transform="translate(${this.centerX}, ${this.centerY})">${svg}</g>`;
  }

  // 4. Planos Superpuestos en Diagonal Colosales
  shapePlanes(pal) {
    const step = 310;
    const size = 380;
    let svg = '';
    svg += `<line class="blueprint-line" x1="-1300" y1="-1300" x2="1300" y2="1300" stroke="${pal.strokeMain}" stroke-width="3.5"/>`;
    svg += `<line class="blueprint-line delay-1" x1="-1150" y1="-970" x2="1150" y2="1330" stroke="${pal.strokeSoft}" stroke-width="2" stroke-dasharray="14 14"/>`;

    svg += this.createNode(-step, -step, size, 'none', pal.strokeMain, 3.5, false, 1, 'nexus-base');
    svg += this.createNode(0, 0, size, pal.secondary, 'none', 0, false, 0.35, 'nexus-split');
    svg += this.createNode(step, step, size, 'none', pal.strokeMain, 3.5, false, 1, 'nexus-end');

    svg += this.createNode(-step * 2.3, -step * 2.3, 88, pal.tertiary, 'none', 0, true, 1, 'nexus-base');
    svg += this.createNode(0, 0, 120, pal.primary, 'none', 0, true, 1, 'nexus-split');
    svg += this.createNode(step * 2.3, step * 2.3, 88, pal.primary, 'none', 0, true, 1, 'nexus-end');

    return `<g transform="translate(${this.centerX}, ${this.centerY})">${svg}</g>`;
  }

  // 5. Red Escalonada de Nodos Colosal
  shapeStepped(pal) {
    const pts = [
      { x: -1300, y: 390 },
      { x: -520, y: 390 },
      { x: -95, y: 40 },
      { x: 450, y: 40 },
      { x: 860, y: -340 },
      { x: 1300, y: -340 }
    ];

    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) d += ` L ${pts[i].x} ${pts[i].y}`;

    let svg = '';
    svg += `<path class="blueprint-line" d="${d}" stroke="${pal.strokeMain}" stroke-width="4.2" stroke-linejoin="round" fill="none"/>`;
    svg += `<path class="blueprint-line delay-1" d="M ${pts[1].x} ${pts[1].y} C ${pts[1].x} -200, ${pts[3].x} -200, ${pts[4].x} ${pts[4].y}" stroke="${pal.strokeSoft}" stroke-width="3.5" fill="none"/>`;

    svg += this.createNode(pts[1].x, pts[1].y, 102, pal.secondary, 'none', 0, false, 1, 'nexus-base');
    svg += this.createNode(pts[2].x, pts[2].y, 260, 'none', pal.strokeSoft, 2, true, 1, 'nexus-split');
    svg += this.createNode(pts[2].x, pts[2].y, 136, pal.primary, 'none', 0, true, 1, 'nexus-split');
    svg += this.createNode(pts[3].x, pts[3].y, 94, pal.tertiary, 'none', 0, false, 1, 'nexus-split');
    svg += this.createNode(pts[4].x, pts[4].y, 114, pal.primary, 'none', 0, false, 1, 'nexus-end');

    return `<g transform="translate(${this.centerX}, ${this.centerY})">${svg}</g>`;
  }

  getShapes() {
    return [
      (pal) => this.shapeEye(pal),
      (pal) => this.shapeBranch(pal),
      (pal) => this.shapeArcs(pal),
      (pal) => this.shapePlanes(pal),
      (pal) => this.shapeStepped(pal)
    ];
  }

  spawnShape(idx = null) {
    const shapes = this.getShapes();
    if (idx !== null) {
      this.currentIdx = idx % shapes.length;
    } else {
      this.currentIdx = (this.currentIdx + 1) % shapes.length;
    }

    const pal = this.isDark ? this.paletteDark : this.paletteLight;
    const shapeFn = shapes[this.currentIdx];

    if (this.svg) {
      this.svg.innerHTML = `<g class="giant-projection-group" style="transform-origin: ${this.centerX}px ${this.centerY}px;">${shapeFn(pal)}</g>`;
    }
  }

  setTheme(isDark) {
    if (this.container && this.container.parentElement) {
      this.container.parentElement.classList.toggle('dark-theme-active', isDark);
    }
    if (this.isDark !== isDark) {
      this.isDark = isDark;
      this.spawnShape(this.currentIdx);
    }
  }

  startCycle() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.spawnShape();
    }, this.cycleDuration);
  }

  stopCycle() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

if (typeof window !== 'undefined') {
  window.VeraBackgroundEngine = VeraBackgroundEngine;
}
