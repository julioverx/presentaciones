/**
 * SlideEngine - Motor de Storytelling y Presentación Interactiva (Estilo Julio Vera)
 * Soporta navegación por fragmentos (story-beats), renderizado KaTeX, telemetría y animaciones editoriales.
 */
class SlideEngine {
  constructor(options = {}) {
    this.container = document.querySelector(options.container || '#slides-container');
    this.slides = Array.from(document.querySelectorAll('.slide'));
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.isOverview = false;
    this.bosswareTimer = null;
    this.pauseTimer = null;

    this.progressBar = document.querySelector('#slide-progress');
    this.counterEl = document.querySelector('#slide-counter');
    this.prevBtn = document.querySelector('#prev-slide');
    this.nextBtn = document.querySelector('#next-slide');
    this.fullscreenBtn = document.querySelector('#toggle-fullscreen');

    this.init();
  }

  init() {
    if (!this.slides.length) return;

    // Leer slide desde URL hash (#slide-3)
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

    this.initCodeStreams();
    this.bindEvents();
    this.updateSlides();
    this.renderMath();
  }

  bindEvents() {
    // Teclado
    window.addEventListener('keydown', (e) => {
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
      }
    });

    // Avance por clic directo en la lámina (estilo keynote/reel)
    if (this.container) {
      this.container.addEventListener('click', (e) => {
        if (e.target.closest('button, a, input, select, textarea, .bpe-tab-btn, .timeline-step-card, .cortina-toggle-btn')) {
          return;
        }
        this.next();
      });
    }

    if (this.prevBtn) this.prevBtn.addEventListener('click', (e) => { e.stopPropagation(); this.prev(); });
    if (this.nextBtn) this.nextBtn.addEventListener('click', (e) => { e.stopPropagation(); this.next(); });
    if (this.fullscreenBtn) this.fullscreenBtn.addEventListener('click', (e) => { e.stopPropagation(); this.toggleFullscreen(); });

    // Soporte táctil / swipe
    let touchStartX = 0;
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 50) {
        if (diff < 0) this.next();
        else this.prev();
      }
    }, { passive: true });

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

  next() {
    const currentSlide = this.slides[this.currentIndex];
    const unrevealedBeats = currentSlide.querySelectorAll('.story-beat:not(.revealed)');

    // Si la diapositiva actual tiene fragmentos pendientes, revela el siguiente paso del relato
    if (unrevealedBeats.length > 0) {
      unrevealedBeats[0].classList.add('revealed');
      return;
    }

    // Si ya no quedan fragmentos, avanza a la siguiente diapositiva
    if (this.currentIndex < this.totalSlides - 1) {
      this.goTo(this.currentIndex + 1);
    }
  }

  prev() {
    const currentSlide = this.slides[this.currentIndex];
    const revealedBeats = currentSlide.querySelectorAll('.story-beat.revealed');

    // Si hay fragmentos revelados en esta lámina, oculta el último
    if (revealedBeats.length > 0) {
      revealedBeats[revealedBeats.length - 1].classList.remove('revealed');
      return;
    }

    // Si no, retrocede a la diapositiva anterior
    if (this.currentIndex > 0) {
      this.goTo(this.currentIndex - 1);
    }
  }

  goTo(index, updateHash = true) {
    if (index < 0 || index >= this.totalSlides) return;
    this.currentIndex = index;
    this.updateSlides();

    if (updateHash) {
      window.location.hash = `slide-${index + 1}`;
    }
  }

  updateSlides() {
    this.slides.forEach((slide, idx) => {
      slide.classList.remove('active', 'prev', 'next');
      if (idx === this.currentIndex) {
        slide.classList.add('active');
        this.triggerSlideAnimations(slide, idx);
      } else if (idx < this.currentIndex) {
        slide.classList.add('prev');
      } else {
        slide.classList.add('next');
        // Resetear fragmentos futuros
        slide.querySelectorAll('.story-beat').forEach(b => b.classList.remove('revealed'));
      }
    });

    if (this.progressBar) {
      const progress = ((this.currentIndex + 1) / this.totalSlides) * 100;
      this.progressBar.style.width = `${progress}%`;
    }

    if (this.counterEl) {
      this.counterEl.textContent = `${this.currentIndex + 1} / ${this.totalSlides}`;
    }

    if (this.prevBtn) this.prevBtn.disabled = this.currentIndex === 0;
    if (this.nextBtn) this.nextBtn.disabled = this.currentIndex === this.totalSlides - 1;
  }

  triggerSlideAnimations(slide, index) {
    // 1. Renderizar KaTeX
    this.renderMath();

    // 2. Animar contadores CEPAL y barras (Lámina 7)
    if (slide.querySelector('.stat-number[data-target]')) {
      slide.querySelectorAll('.stat-number[data-target]').forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const suffix = counter.getAttribute('data-suffix') || '%';
        let current = 0;
        const steps = 30;
        const stepVal = target / steps;
        let count = 0;
        const timer = setInterval(() => {
          count++;
          current += stepVal;
          if (count >= steps) {
            counter.textContent = target.toFixed(1) + suffix;
            clearInterval(timer);
          } else {
            counter.textContent = current.toFixed(1) + suffix;
          }
        }, 25);
      });

      slide.querySelectorAll('.funnel-progress-fill').forEach(bar => {
        const targetW = bar.getAttribute('data-width');
        if (targetW) {
          bar.style.width = '0%';
          setTimeout(() => {
            bar.style.transition = 'width 1s cubic-bezier(0.16, 1, 0.3, 1)';
            bar.style.width = `${targetW}%`;
          }, 150);
        }
      });
    }

    // 3. Simulación en tiempo real de telemetría Bossware (Lámina 11)
    if (slide.querySelector('#live-kpm-counter')) {
      this.startBosswareSimulation();
    } else {
      this.stopBosswareSimulation();
    }
  }

  startBosswareSimulation() {
    this.stopBosswareSimulation();

    const kpmEl = document.querySelector('#live-kpm-counter');
    const camEl = document.querySelector('#live-cam-indicator');
    const pauseEl = document.querySelector('#live-pause-tracker');

    let baseKpm = 282;
    let pauseSeconds = 2;

    this.bosswareTimer = setInterval(() => {
      if (kpmEl) {
        const fluctuation = Math.floor(Math.random() * 30) - 15;
        kpmEl.textContent = (baseKpm + fluctuation) + ' KPM';
      }

      if (camEl && Math.random() > 0.6) {
        camEl.textContent = 'CAPTURANDO...';
        camEl.classList.remove('active-green');
        camEl.classList.add('alert-red');
        setTimeout(() => {
          if (camEl) {
            camEl.textContent = 'SINCRONIZADA';
            camEl.classList.remove('alert-red');
            camEl.classList.add('active-green');
          }
        }, 600);
      }
    }, 1200);

    this.pauseTimer = setInterval(() => {
      if (pauseEl) {
        pauseSeconds++;
        if (pauseSeconds > 5) pauseSeconds = 1;
        pauseEl.textContent = `00:0${pauseSeconds}s (ALERTA)`;
      }
    }, 1000);
  }

  stopBosswareSimulation() {
    if (this.bosswareTimer) clearInterval(this.bosswareTimer);
    if (this.pauseTimer) clearInterval(this.pauseTimer);
  }

  initCodeStreams() {
    const streams = document.querySelectorAll('.code-stream-text');
    if (!streams.length) return;

    const codeSample = `
# Algoritmo de Ponderación Deontológica vs Eficiencia BPE
import torch
import torch.nn as nn

class CandidateEvaluation(nn.Module):
    def __init__(self, vocab_dim=4096, hidden_dim=512):
        super().__init__()
        self.embedding = nn.Embedding(vocab_dim, hidden_dim)
        self.attention = nn.MultiheadAttention(hidden_dim, 8)
        self.classifier = nn.Linear(hidden_dim, 1)

    def forward(self, token_seq):
        # BPE fragmentation: [Lic.] [Gest] [ión] [-] [Tal] [ento]
        x = self.embedding(token_seq)
        attn_out, _ = self.attention(x, x, x)
        score = torch.sigmoid(self.classifier(attn_out.mean(dim=1)))
        return score # Fallo epistemológico: carece de juicio sobre la dignidad

# Kalai & Vempala (STOC 2024): Calibrated Language Models Must Hallucinate
def check_hallucination_probability(p_calibrated):
    assert p_calibrated > 0.0
    return "Pr[Falsehood] > 0 (Ineludible)"
`.repeat(3);

    streams.forEach(stream => {
      if (!stream.textContent.trim()) {
        stream.textContent = codeSample;
      }
    });
  }

  renderMath() {
    if (typeof katex !== 'undefined') {
      document.querySelectorAll('.math-formula-display').forEach(el => {
        if (!el.dataset.rendered) {
          const raw = el.getAttribute('data-tex') || el.textContent.trim();
          try {
            katex.render(raw, el, {
              throwOnError: false,
              displayMode: true
            });
            el.dataset.rendered = 'true';
          } catch (err) {
            console.error('KaTeX rendering error:', err);
          }
        }
      });
    }
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
}

window.SlideEngine = SlideEngine;