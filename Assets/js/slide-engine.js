/**
 * SlideEngine - Motor Editorial y de Presentación 16:9 Universal (Estilo Julio Vera)
 * Control de escala proporcional 1920x1080, navegación fluida, KaTeX y laboratorios en modal.
 */
class SlideEngine {
  constructor(options = {}) {
    this.container = document.querySelector(options.container || '#slides-container');
    this.scaler = document.querySelector(options.scaler || '#slide-stage-scaler');
    this.slides = Array.from(document.querySelectorAll('.slide'));
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.isRotatedMobile = false;

    this.progressBar = document.querySelector('#slide-progress');
    this.counterEl = document.querySelector('#slide-counter');
    this.prevBtn = document.querySelector('#prev-slide');
    this.nextBtn = document.querySelector('#next-slide');
    this.fullscreenBtn = document.querySelector('#toggle-fullscreen');
    this.rotateBtn = document.querySelector('#toggle-rotate');

    this.init();
  }

  init() {
    if (!this.slides.length) return;

    this.fitStage();

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

    this.bindEvents();
    this.updateSlides();
    this.renderMath();
    this.initModalListeners();
  }

  fitStage() {
    if (!this.scaler) return;
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Si el usuario forzó la rotación a 16:9 en móvil vertical
    if (this.isRotatedMobile && w < h) {
      const scale = Math.min(h / 1920, w / 1080);
      this.scaler.style.transform = `rotate(90deg) scale(${scale})`;
      return;
    }

    // Escala matemática proporcional exacta 16:9 para resolución canónica 1920x1080
    const scale = Math.min(w / 1920, h / 1080);
    this.scaler.style.transform = `scale(${scale})`;
  }

  toggleMobileRotate() {
    this.isRotatedMobile = !this.isRotatedMobile;
    this.fitStage();
    const pill = document.getElementById('mobile-rotate-pill');
    if (pill) {
      pill.style.display = this.isRotatedMobile ? 'none' : 'flex';
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.fitStage());
    window.addEventListener('orientationchange', () => {
      this.isRotatedMobile = false;
      setTimeout(() => this.fitStage(), 150);
    });

    // Navegación por teclado
    window.addEventListener('keydown', (e) => {
      // Ignorar si el usuario está interactuando con un campo de texto dentro de un modal
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        if (e.key === 'Escape') this.closeAllModals();
        return;
      }

      if (e.key === 'Escape') {
        this.closeAllModals();
        return;
      }

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

    // Avance por clic directo en la lámina
    if (this.container) {
      this.container.addEventListener('click', (e) => {
        if (e.target.closest('button, a, input, select, textarea, .editorial-modal-backdrop, .editorial-modal-window')) {
          return;
        }
        this.next();
      });
    }

    if (this.prevBtn) this.prevBtn.addEventListener('click', (e) => { e.stopPropagation(); this.prev(); });
    if (this.nextBtn) this.nextBtn.addEventListener('click', (e) => { e.stopPropagation(); this.next(); });
    if (this.fullscreenBtn) this.fullscreenBtn.addEventListener('click', (e) => { e.stopPropagation(); this.toggleFullscreen(); });
    if (this.rotateBtn) this.rotateBtn.addEventListener('click', (e) => { e.stopPropagation(); this.toggleMobileRotate(); });

    // Swipe táctil
    let touchStartX = 0;
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      if (document.querySelector('.editorial-modal-backdrop.active')) return;
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
    if (this.currentIndex < this.totalSlides - 1) {
      this.goTo(this.currentIndex + 1);
    }
  }

  prev() {
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

    // Sincronizar tema de fondo canónico Método VERA
    const currentSlide = this.slides[this.currentIndex];
    const isDarkSlide = currentSlide && (
      currentSlide.classList.contains('cover-slide-blue') ||
      currentSlide.classList.contains('closing-slide-blue')
    );
    if (window.veraBg && typeof window.veraBg.setTheme === 'function') {
      window.veraBg.setTheme(isDarkSlide);
    }
  }

  triggerSlideAnimations(slide, index) {
    // 1. Renderizar KaTeX
    this.renderMath();

    // 2. CEPAL (Lámina 7 - index 6)
    if (slide.querySelector('.stat-number[data-target]')) {
      slide.querySelectorAll('.stat-number[data-target]').forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const suffix = counter.getAttribute('data-suffix') || '%';
        let current = 0;
        const steps = 25;
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
        }, 20);
      });

      slide.querySelectorAll('.funnel-progress-fill').forEach(bar => {
        const targetW = bar.getAttribute('data-width');
        if (targetW) {
          bar.style.width = '0%';
          setTimeout(() => {
            bar.style.width = `${targetW}%`;
          }, 100);
        }
      });
    }
  }

  renderMath() {
    // Renderizado estándar KaTeX sin acentos problemáticos
    if (typeof katex !== 'undefined') {
      const formulaEl = document.getElementById('stoc-math-formula');
      if (formulaEl && !formulaEl.dataset.rendered) {
        try {
          katex.render('\\Pr[\\text{Falsedad}] > 0 \\quad (\\forall \\text{ modelo calibrado})', formulaEl, {
            displayMode: true,
            throwOnError: false
          });
          formulaEl.dataset.rendered = 'true';
        } catch (err) {
          console.error('KaTeX rendering error:', err);
        }
      }
    }
  }

  initModalListeners() {
    document.querySelectorAll('.editorial-modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove('active');
        }
      });
    });
  }

  closeAllModals() {
    document.querySelectorAll('.editorial-modal-backdrop').forEach(b => b.classList.remove('active'));
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock('landscape').catch(() => {});
        }
      }).catch(err => console.log(err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
}

// =============================================================================
// FUNCIONES GLOBALES PARA MODALES INTERACTIVOS
// =============================================================================

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');

    if (id === 'modal-bpe') {
      initBpeModal();
    } else if (id === 'modal-bossware') {
      initBosswareModal();
    }
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    if (id === 'modal-bossware' && window.bosswareInterval) {
      clearInterval(window.bosswareInterval);
    }
  }
}

// 1. Modal Adela Cortina (Quiebre de Mínimos)
function updateCortinaSimulation() {
  const s = document.getElementById('chk-salary')?.checked;
  const h = document.getElementById('chk-hours')?.checked;
  const t = document.getElementById('chk-tools')?.checked;
  const res = document.getElementById('cortina-sim-result');

  if (!res) return;

  if (s && h && t) {
    res.style.borderColor = 'var(--color-primary-navy)';
    res.style.background = '#f8fafc';
    res.innerHTML = `
      <strong style="color: var(--color-primary-navy);">ESTADO: CONDICIÓN ÉTICA CUMPLIDA</strong><br>
      La institución garantiza el suelo innegociable de justicia. La demanda de compromiso es moralmente legítima.
    `;
  } else {
    res.style.borderColor = '#ef4444';
    res.style.background = '#fef2f2';
    res.innerHTML = `
      <strong style="color: #b91c1c;">ALERTA DE QUIEBRE DE MÍNIMOS (ADELA CORTINA)</strong><br>
      Al suprimir el salario justo, la jornada delimitada o las herramientas, la organización cae en <strong>«Fraude Estructural y Organización Desmoralizada»</strong>. Cualquier exigencia de lealtad se convierte en coacción ilegítima.
    `;
  }
}

// 2. Modal ATS & BPE (Simulador Interactivo)
function initBpeModal() {
  const input = document.getElementById('ats-input-field');
  if (!input) return;
  input.focus();
  runBpeAnalysis(input.value);
}

function runBpeAnalysis(text) {
  const tokensContainer = document.getElementById('bpe-tokens-result');
  const verdict = document.getElementById('bpe-verdict-result');
  if (!tokensContainer || !verdict) return;

  const raw = text.trim();
  if (!raw) {
    tokensContainer.innerHTML = '<span style="color:#94a3b8; font-size:0.85rem;">Escribe un cargo o perfil arriba...</span>';
    verdict.innerHTML = 'Esperando texto...';
    return;
  }

  const hasHyphen = raw.includes('-');
  const hasSlash = raw.includes('/');

  if (hasHyphen || hasSlash) {
    const parts = raw.split(/([-\/])/);
    let chipsHtml = '';
    parts.forEach(p => {
      if (p === '-' || p === '/') {
        chipsHtml += `<span class="token-chip broken">[${p}]</span>`;
      } else if (p.length > 4) {
        chipsHtml += `<span class="token-chip broken">[${p.slice(0, 3)}]</span><span class="token-chip broken">[${p.slice(3)}]</span>`;
      } else {
        chipsHtml += `<span class="token-chip broken">[${p}]</span>`;
      }
    });

    tokensContainer.innerHTML = chipsHtml;
    verdict.className = 'orthogonal-box';
    verdict.style.borderColor = '#ef4444';
    verdict.innerHTML = `
      <div class="orthogonal-box-header" style="background:#ef4444;">ALERTA BPE: TOKENIZACIÓN DEFECTUOSA (MATCH: 28%)</div>
      <div class="orthogonal-box-content">
        El guion o carácter separador forzó al algoritmo a fragmentar el lema en <strong>subpalabras rotas numéricamente dispersas</strong> en el espacio latente. El motor ATS <strong>DESCARTA AUTOMÁTICAMENTE</strong> la postulación por un detalle ortográfico irrelevante.
        <div class="box-source-note">Fuente: Chai, Peng & Li (2024), Tokenization Falling Short.</div>
      </div>
    `;
  } else {
    const words = raw.split(/\s+/);
    let chipsHtml = '';
    words.forEach(w => {
      chipsHtml += `<span class="token-chip">[${w}]</span>`;
    });

    tokensContainer.innerHTML = chipsHtml;
    verdict.className = 'orthogonal-box';
    verdict.style.borderColor = 'var(--color-primary-navy)';
    verdict.innerHTML = `
      <div class="orthogonal-box-header" style="background:var(--color-primary-navy);">RECONOCIMIENTO SEMÁNTICO LIMPIO (MATCH: 94%)</div>
      <div class="orthogonal-box-content">
        Vector continuo regular. Los lemas coinciden con la matriz de pesos del modelo de selección algorítmica.
        <div class="box-source-note">Fuente: Chai, Peng & Li (2024), Tokenization Falling Short.</div>
      </div>
    `;
  }
}

// 3. Modal Bossware (Experimento en Vivo Móvil / PC)
function initBosswareModal() {
  const kpmDisplay = document.getElementById('bossware-live-kpm');
  const pauseDisplay = document.getElementById('bossware-live-pause');
  const alertBox = document.getElementById('bossware-live-alert');
  const testInput = document.getElementById('bossware-test-input');
  const mobileSensorBox = document.getElementById('bossware-mobile-sensor');

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;

  let keystrokes = 0;
  let lastKeyTime = Date.now();
  let pauseSec = 0;
  let lastGamma = null;

  if (isMobile && mobileSensorBox) {
    mobileSensorBox.style.display = 'block';
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        const tilt = Math.round(e.gamma || 0);
        const sensorVal = document.getElementById('mobile-tilt-val');
        if (sensorVal) sensorVal.textContent = `Inclinación: ${tilt}° | Telemetría: Activa`;

        if (lastGamma !== null && Math.abs(tilt - lastGamma) > 2) {
          keystrokes += 2;
          lastKeyTime = Date.now();
          pauseSec = 0;
          if (alertBox) {
            alertBox.textContent = 'ESTADO: MOVIMIENTO MÓVIL REGISTRADO (SUPERVISIÓN BIOMÉTRICA)';
            alertBox.style.color = '#15803d';
          }
        }
        lastGamma = tilt;
      }, { passive: true });
    }
  }

  if (testInput) {
    testInput.value = '';
    testInput.focus();
    testInput.oninput = () => {
      keystrokes++;
      lastKeyTime = Date.now();
      pauseSec = 0;
      if (alertBox) {
        alertBox.textContent = 'ESTADO: ACTIVIDAD REGISTRADA (TRABAJADOR MONITOREADO)';
        alertBox.style.color = '#15803d';
      }
    };
  }

  if (window.bosswareInterval) clearInterval(window.bosswareInterval);

  window.bosswareInterval = setInterval(() => {
    const elapsed = (Date.now() - lastKeyTime) / 1000;
    if (elapsed > 1.5) {
      pauseSec = Math.floor(elapsed);
      if (pauseDisplay) pauseDisplay.textContent = `00:0${pauseSec}s`;
      if (alertBox) {
        alertBox.textContent = `¡ALERTA DIRECTIVA! Micro-pausa detectada (${pauseSec}s). Productividad bajo penalización.`;
        alertBox.style.color = '#b91c1c';
      }
    } else {
      if (pauseDisplay) pauseDisplay.textContent = '00:00s';
    }

    if (kpmDisplay) {
      const calculatedKpm = keystrokes * 12;
      kpmDisplay.textContent = `${calculatedKpm} KPM`;
      keystrokes = Math.max(0, Math.floor(keystrokes * 0.7));
    }
  }, 1000);
}

/**
 * SlideExporter - Motor de Descarga de Diapositivas Estáticas (ZIP de PNGs y PDF)
 * Captura aislada pixel-perfect a resolución canónica 1920x1080 inmune a escala o dispositivo.
 */
class SlideExporter {
  constructor(engine) {
    this.engine = engine;
    this.isExporting = false;
  }

  /**
   * Captura una diapositiva individual en un contenedor sandbox 1920x1080 aislado,
   * libre de transformaciones CSS del scaler y sin verse afectado por el ancho del teléfono.
   */
  async captureSlide(slideEl, index, total) {
    const isDark = slideEl.classList.contains('cover-slide-blue') || slideEl.classList.contains('closing-slide-blue');

    // 1. Obtener o crear sandbox aislado en document.body (fuera del scaler)
    let sandbox = document.getElementById('render-export-sandbox');
    if (!sandbox) {
      sandbox = document.createElement('div');
      sandbox.id = 'render-export-sandbox';
      sandbox.className = 'slide-canvas';
      sandbox.style.cssText = `
        position: fixed !important;
        left: 0 !important;
        top: 0 !important;
        width: 1920px !important;
        height: 1080px !important;
        min-width: 1920px !important;
        min-height: 1080px !important;
        max-width: 1920px !important;
        max-height: 1080px !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        outline: none !important;
        transform: none !important;
        filter: none !important;
        overflow: hidden !important;
        z-index: 100 !important;
        pointer-events: none !important;
        font-family: 'Figtree', system-ui, -apple-system, sans-serif !important;
        box-sizing: border-box !important;
        opacity: 1 !important;
        visibility: visible !important;
      `;
      document.body.appendChild(sandbox);
    }

    sandbox.style.backgroundColor = isDark ? '#0f2e5a' : '#ffffff';
    sandbox.innerHTML = '';

    // 2. Si es diapositiva interior clara, agregar retícula geométrica ambiental de fondo
    if (!isDark) {
      const ambientBg = document.createElement('div');
      ambientBg.className = 'ambient-canvas-layer';
      ambientBg.style.cssText = 'position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 1;';
      ambientBg.innerHTML = `
        <div class="ambient-shape-1" style="position: absolute; top: -80px; right: -80px; width: 640px; height: 640px; border-radius: 50%; background: radial-gradient(circle, rgba(15, 46, 90, 0.07) 0%, rgba(255, 255, 255, 0) 70%); filter: blur(40px);"></div>
        <div class="ambient-shape-2" style="position: absolute; bottom: -100px; left: 60px; width: 700px; height: 500px; background: radial-gradient(ellipse, rgba(30, 58, 138, 0.06) 0%, rgba(255, 255, 255, 0) 70%); filter: blur(45px);"></div>
        <div class="ambient-grid-lines" style="position: absolute; inset: 0; background-image: linear-gradient(to right, rgba(15, 46, 90, 0.022) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 46, 90, 0.022) 1px, transparent 1px); background-size: 48px 48px; opacity: 0.7;"></div>
      `;
      sandbox.appendChild(ambientBg);
    }

    // 3. Clonar la diapositiva en el sandbox
    const clone = slideEl.cloneNode(true);
    clone.classList.add('active');
    clone.style.cssText = `
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 1920px !important;
      height: 1080px !important;
      min-width: 1920px !important;
      min-height: 1080px !important;
      max-width: 1920px !important;
      max-height: 1080px !important;
      opacity: 1 !important;
      visibility: visible !important;
      transform: none !important;
      transition: none !important;
      animation: none !important;
      z-index: 5 !important;
      background: ${isDark ? '#0f2e5a' : 'transparent'} !important;
      color: ${isDark ? '#ffffff' : '#0f172a'} !important;
    `;

    // Congelar transiciones y animaciones internas
    clone.querySelectorAll('*').forEach(el => {
      el.style.animation = 'none';
      el.style.transition = 'none';
    });

    const innerBody = clone.querySelector('.inner-body');
    if (innerBody) {
      innerBody.style.opacity = '1';
      innerBody.style.transform = 'none';
      innerBody.style.animation = 'none';
    }

    // Asegurar métricas completas en gráficos de barras y contadores estadísticos
    clone.querySelectorAll('.stat-number[data-target]').forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const suffix = counter.getAttribute('data-suffix') || '%';
      counter.textContent = target.toFixed(1) + suffix;
    });

    clone.querySelectorAll('.funnel-progress-fill[data-width]').forEach(bar => {
      const targetW = bar.getAttribute('data-width');
      bar.style.width = `${targetW}%`;
    });

    sandbox.appendChild(clone);

    // Breve pausa para estabilizar renderizado de fuentes y DOM en el sandbox
    await new Promise(r => setTimeout(r, 60));

    // 4. Capturar en lienzo 1920x1080 canónico
    const canvas = await html2canvas(sandbox, {
      width: 1920,
      height: 1080,
      windowWidth: 1920,
      windowHeight: 1080,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      scale: 1,
      useCORS: true,
      logging: false,
      backgroundColor: isDark ? '#0f2e5a' : '#ffffff'
    });

    // Limpiar contenido del sandbox para evitar retención de memoria
    sandbox.innerHTML = '';
    return canvas;
  }

  async exportZip() {
    if (this.isExporting) return;
    this.isExporting = true;
    const progressBox = document.getElementById('export-progress-box');
    const progressBar = document.getElementById('export-progress-bar');
    const progressText = document.getElementById('export-progress-text');
    const btnZip = document.getElementById('btn-export-zip');
    const btnPdf = document.getElementById('btn-export-pdf');

    if (progressBox) progressBox.style.display = 'block';
    if (btnZip) btnZip.disabled = true;
    if (btnPdf) btnPdf.disabled = true;

    try {
      if (typeof JSZip === 'undefined' || typeof html2canvas === 'undefined') {
        throw new Error('Librerías de exportación no cargadas');
      }

      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      const zip = new JSZip();
      const slides = this.engine.slides;
      const total = slides.length;
      document.body.classList.add('export-mode');

      for (let i = 0; i < total; i++) {
        if (progressText) progressText.textContent = `Capturando lámina ${i + 1} de ${total} (1920×1080)...`;
        if (progressBar) progressBar.style.width = `${Math.round(((i + 1) / (total + 1)) * 100)}%`;

        const canvas = await this.captureSlide(slides[i], i, total);
        const dataUrl = canvas.toDataURL('image/png');
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
        const filename = `Lamina-${String(i + 1).padStart(2, '0')}.png`;
        zip.file(filename, base64Data, { base64: true });

        // Liberar memoria gráfica del canvas inmediatamente
        canvas.width = 0;
        canvas.height = 0;
      }

      if (progressText) progressText.textContent = 'Comprimiendo archivo ZIP de alta resolución...';
      const content = await zip.generateAsync({ type: 'blob' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'Diapositivas-Etica-Julio-Vera.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      if (progressText) progressText.textContent = '¡Colección ZIP (1920×1080) descargada con éxito!';
      setTimeout(() => {
        if (progressBox) progressBox.style.display = 'none';
        closeModal('modal-download');
      }, 1400);

    } catch (err) {
      console.error('Error al exportar ZIP:', err);
      if (progressText) progressText.textContent = 'Error al exportar imágenes. Utiliza la opción de impresión PDF.';
    } finally {
      const sandbox = document.getElementById('render-export-sandbox');
      if (sandbox) sandbox.remove();
      document.body.classList.remove('export-mode');
      this.isExporting = false;
      if (btnZip) btnZip.disabled = false;
      if (btnPdf) btnPdf.disabled = false;
    }
  }

  async exportPdf() {
    if (this.isExporting) return;
    this.isExporting = true;
    const progressBox = document.getElementById('export-progress-box');
    const progressBar = document.getElementById('export-progress-bar');
    const progressText = document.getElementById('export-progress-text');
    const btnZip = document.getElementById('btn-export-zip');
    const btnPdf = document.getElementById('btn-export-pdf');

    if (progressBox) progressBox.style.display = 'block';
    if (btnZip) btnZip.disabled = true;
    if (btnPdf) btnPdf.disabled = true;

    try {
      if (typeof window.jspdf === 'undefined' || typeof html2canvas === 'undefined') {
        throw new Error('Librerías de exportación no cargadas');
      }

      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1920, 1080]
      });

      const slides = this.engine.slides;
      const total = slides.length;
      document.body.classList.add('export-mode');

      for (let i = 0; i < total; i++) {
        if (progressText) progressText.textContent = `Generando página ${i + 1} de ${total} (1920×1080)...`;
        if (progressBar) progressBar.style.width = `${Math.round(((i + 1) / (total + 1)) * 100)}%`;

        const canvas = await this.captureSlide(slides[i], i, total);
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        if (i > 0) pdf.addPage([1920, 1080], 'landscape');
        pdf.addImage(imgData, 'JPEG', 0, 0, 1920, 1080);

        // Liberar memoria del canvas de inmediato
        canvas.width = 0;
        canvas.height = 0;
      }

      if (progressText) progressText.textContent = 'Guardando documento PDF en resolución 16:9...';
      pdf.save('Diapositivas-Etica-Julio-Vera.pdf');

      if (progressText) progressText.textContent = '¡Documento PDF descargado!';
      setTimeout(() => {
        if (progressBox) progressBox.style.display = 'none';
        closeModal('modal-download');
      }, 1400);

    } catch (err) {
      console.error('Error al exportar PDF:', err);
      if (progressText) progressText.textContent = 'Error al generar PDF. Utiliza la opción de impresión nativa.';
    } finally {
      const sandbox = document.getElementById('render-export-sandbox');
      if (sandbox) sandbox.remove();
      document.body.classList.remove('export-mode');
      this.isExporting = false;
      if (btnZip) btnZip.disabled = false;
      if (btnPdf) btnPdf.disabled = false;
    }
  }

  printNative() {
    window.print();
  }
}

window.SlideEngine = SlideEngine;
window.SlideExporter = SlideExporter;
