/**
 * SlideEngine - Motor interactivo ligero y potente para diapositivas web
 * Compatible con GitHub Pages, sin dependencias externas pesadas.
 */
class SlideEngine {
  constructor(options = {}) {
    this.container = document.querySelector(options.container || '#slides-container');
    this.slides = Array.from(document.querySelectorAll('.slide'));
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.isOverview = false;
    this.autoPlayInterval = null;

    this.progressBar = document.querySelector('#slide-progress');
    this.counterEl = document.querySelector('#slide-counter');
    this.prevBtn = document.querySelector('#prev-slide');
    this.nextBtn = document.querySelector('#next-slide');
    this.fullscreenBtn = document.querySelector('#toggle-fullscreen');
    this.overviewBtn = document.querySelector('#toggle-overview');
    this.helpBtn = document.querySelector('#toggle-help');
    this.helpModal = document.querySelector('#help-modal');

    this.init();
  }

  init() {
    if (!this.slides.length) return;

    // Leer slide desde URL hash si existe (#3 o #slide-3)
    const hash = window.location.hash;
    if (hash) {
      const match = hash.match(/\d+/);
      if (match) {
        const slideNum = parseInt(match[0], 10) - 1;
        if (slideNum >= 0 && slideNum < this.totalSlides) {
          this.currentIndex = slideNum;
        }
      }
    }

    this.bindEvents();
    this.updateSlides();
    this.buildSlideThumbnails();
  }

  bindEvents() {
    // Teclado
    window.addEventListener('keydown', (e) => {
      // Ignorar si el foco está en un input o textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
          e.preventDefault();
          this.next();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          this.prev();
          break;
        case 'Home':
          e.preventDefault();
          this.goTo(0);
          break;
        case 'End':
          e.preventDefault();
          this.goTo(this.totalSlides - 1);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          this.toggleFullscreen();
          break;
        case 'o':
        case 'O':
        case 'Escape':
          e.preventDefault();
          if (this.helpModal && !this.helpModal.classList.contains('hidden')) {
            this.toggleHelp(false);
          } else {
            this.toggleOverview();
          }
          break;
        case '?':
          e.preventDefault();
          this.toggleHelp();
          break;
      }
    });

    // Botones de navegación
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());
    if (this.fullscreenBtn) this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    if (this.overviewBtn) this.overviewBtn.addEventListener('click', () => this.toggleOverview());
    if (this.helpBtn) this.helpBtn.addEventListener('click', () => this.toggleHelp());

    // Soporte táctil / swipe
    let touchStartX = 0;
    let touchEndX = 0;
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 50) {
        if (diff < 0) this.next();
        else this.prev();
      }
    }, { passive: true });

    // Hash change
    window.addEventListener('hashchange', () => {
      const match = window.location.hash.match(/\d+/);
      if (match) {
        const slideNum = parseInt(match[0], 10) - 1;
        if (slideNum >= 0 && slideNum < this.totalSlides && slideNum !== this.currentIndex) {
          this.goTo(slideNum, false);
        }
      }
    });
  }

  goTo(index, updateHash = true) {
    if (index < 0 || index >= this.totalSlides) return;
    this.currentIndex = index;
    this.updateSlides();

    if (updateHash) {
      window.location.hash = `slide-${index + 1}`;
    }

    if (this.isOverview) {
      this.toggleOverview(false);
    }
  }

  next() {
    if (this.currentIndex < this.totalSlides - 1) {
      this.goTo(this.currentIndex + 1);
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.goTo(this.currentIndex - 1);
    }
  }

  updateSlides() {
    this.slides.forEach((slide, idx) => {
      slide.classList.remove('active', 'prev', 'next');
      if (idx === this.currentIndex) {
        slide.classList.add('active');
        // Ejecutar animaciones o resets de slide si existen
        slide.querySelectorAll('.reveal-item').forEach(el => el.classList.add('revealed'));
      } else if (idx < this.currentIndex) {
        slide.classList.add('prev');
      } else {
        slide.classList.add('next');
      }
    });

    // Actualizar barra de progreso
    if (this.progressBar) {
      const progress = ((this.currentIndex + 1) / this.totalSlides) * 100;
      this.progressBar.style.width = `${progress}%`;
    }

    // Actualizar contador
    if (this.counterEl) {
      this.counterEl.textContent = `${this.currentIndex + 1} / ${this.totalSlides}`;
    }

    // Actualizar estado de botones
    if (this.prevBtn) this.prevBtn.disabled = this.currentIndex === 0;
    if (this.nextBtn) this.nextBtn.disabled = this.currentIndex === this.totalSlides - 1;

    // Resaltar en overview
    const thumbs = document.querySelectorAll('.overview-thumb');
    thumbs.forEach((thumb, i) => {
      if (i === this.currentIndex) thumb.classList.add('active-thumb');
      else thumb.classList.remove('active-thumb');
    });
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  toggleOverview(forceState) {
    this.isOverview = typeof forceState === 'boolean' ? forceState : !this.isOverview;
    const overviewEl = document.querySelector('#overview-grid');
    if (overviewEl) {
      if (this.isOverview) {
        overviewEl.classList.remove('hidden');
      } else {
        overviewEl.classList.add('hidden');
      }
    }
  }

  toggleHelp(forceState) {
    if (!this.helpModal) return;
    const isHidden = this.helpModal.classList.contains('hidden');
    const show = typeof forceState === 'boolean' ? forceState : isHidden;
    if (show) {
      this.helpModal.classList.remove('hidden');
    } else {
      this.helpModal.classList.add('hidden');
    }
  }

  buildSlideThumbnails() {
    const overviewGrid = document.querySelector('#overview-grid-content');
    if (!overviewGrid) return;
    overviewGrid.innerHTML = '';

    this.slides.forEach((slide, idx) => {
      const thumb = document.createElement('div');
      thumb.className = `overview-thumb p-4 rounded-xl border transition-all cursor-pointer ${idx === this.currentIndex ? 'active-thumb ring-2 ring-blue-500' : 'hover:border-blue-400'}`;
      
      const title = slide.querySelector('h1, h2, h3')?.textContent || `Diapositiva ${idx + 1}`;
      thumb.innerHTML = `
        <div class="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Slide ${idx + 1}</div>
        <div class="text-sm font-medium line-clamp-2">${title}</div>
      `;

      thumb.addEventListener('click', () => {
        this.goTo(idx);
      });

      overviewGrid.appendChild(thumb);
    });
  }
}

// Inicialización global para usar en cualquier diapositiva
window.SlideEngine = SlideEngine;
