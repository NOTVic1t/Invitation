/**
 * VICTOR INVITATION ENGINE V1
 * modules/opening/opening.js
 * Created by Victor Rizki Valentiano
 */

window.VictoropeningModule = {
  init(data, guestName) {
    const cfg = window.VictorConfig || {};
    const lang = cfg.LANG || {};

    // Guest name display
    const prefix = document.getElementById('opening-guest-prefix');
    const nameEl  = document.getElementById('opening-guest-name');
    if (guestName) {
      if (prefix) prefix.textContent = lang.guestPrefix || 'Kepada Yth.';
      if (nameEl)  nameEl.textContent = VictorUtils.sanitize(guestName);
    } else {
      if (prefix) prefix.textContent = '';
      if (nameEl)  nameEl.textContent = lang.guestFallback || 'Dear Guest';
    }

    // Names
    const brideEl = document.getElementById('opening-bride');
    const groomEl = document.getElementById('opening-groom');
    if (brideEl) brideEl.textContent = data.bride_name || '';
    if (groomEl) groomEl.textContent = data.groom_name || '';

    // Date
    const dateEl = document.getElementById('opening-date');
    if (dateEl && data.event_date) {
      dateEl.textContent = VictorUtils.formatDate(data.event_date);
    }

    // Button text
    const btnText = document.getElementById('opening-btn-text');
    if (btnText) btnText.textContent = lang.openButton || 'Buka Undangan';

    // Floating petals
    if (cfg.FEATURES?.floatingPetals) {
      this._spawnPetals();
    }

    // Scroll reveal inside opening
    setTimeout(() => {
      document.querySelectorAll('.opening-screen .reveal').forEach(el => {
        el.classList.add('revealed');
      });
    }, 400);

    // Open button
    const btn = document.getElementById('opening-btn');
    if (btn) {
      btn.addEventListener('click', () => this._open(data));
    }
  },

  _open(data) {
    const screen = document.getElementById('opening-screen');
    if (!screen) return;

    // Play music if configured
    VictorUtils.emit('opening:open', { data });

    screen.classList.add('closing');
    setTimeout(() => {
      screen.classList.add('closed');
      screen.setAttribute('aria-hidden', 'true');
      VictorUtils.emit('opening:closed', {});
      VictorUtils.initScrollReveal();
    }, 1000);
  },

  _spawnPetals() {
    const container = document.getElementById('opening-particles');
    if (!container) return;
    const count = 18;
    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.className = 'petal';
      const size = 4 + Math.random() * 8;
      petal.style.cssText = [
        `--petal-size: ${size}px`,
        `--petal-dur: ${6 + Math.random() * 8}s`,
        `--petal-delay: ${Math.random() * 8}s`,
        `left: ${Math.random() * 100}%`,
        `top: ${-10 - Math.random() * 10}%`,
      ].join(';');
      container.appendChild(petal);
    }
  },
};

// Alias for module-loader (capitalization)
window.VictoropeningModule = window.VictoropeningModule;

// Correct alias matching module-loader convention
window.VictorOpeningModule = window.VictoropeningModule;
