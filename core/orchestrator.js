/**
 * VICTOR INVITATION ENGINE V1
 * core/orchestrator.js — Module Orchestration
 * Created by Victor Rizki Valentiano
 */

window.VictorOrchestrator = (() => {

  const MODULE_MAP = [
    { name: 'music',     mount: 'music-module-mount'     },
    { name: 'opening',   mount: 'opening-module-mount'   },
    { name: 'couple',    mount: 'couple-module-mount'    },
    { name: 'countdown', mount: 'countdown-module-mount' },
    { name: 'story',     mount: 'story-module-mount'     },
    { name: 'timeline',  mount: 'timeline-module-mount'  },
    { name: 'gallery',   mount: 'gallery-module-mount'   },
    { name: 'rsvp',      mount: 'rsvp-module-mount'      },
    { name: 'guestbook', mount: 'guestbook-module-mount' },
    { name: 'gift',      mount: 'gift-module-mount'      },
    { name: 'footer',    mount: 'footer-module-mount'    },
  ];

  async function mount(data, guestName) {
    // Mount music and opening first (sequential — opening gates the rest)
    await VictorModuleLoader.mountModule('music', 'music-module-mount', data, guestName);

    // Opening module controls when the main content reveals
    await VictorModuleLoader.mountModule('opening', 'opening-module-mount', data, guestName);

    // Remaining modules load in parallel
    const rest = MODULE_MAP.filter(m => m.name !== 'music' && m.name !== 'opening');
    await Promise.all(
      rest.map(({ name, mount }) => VictorModuleLoader.mountModule(name, mount, data, guestName))
    );

    // Show app after opening is done (or immediately if no opening)
    VictorEngine.showApp();

    // Init parallax if enabled
    if (window.VictorConfig?.FEATURES?.parallax) {
      initParallax();
    }
  }

  function initParallax() {
    const parallaxEls = document.querySelectorAll('[data-parallax]');
    if (!parallaxEls.length) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        parallaxEls.forEach(el => {
          const speed = parseFloat(el.dataset.parallax) || 0.3;
          el.style.transform = `translateY(${scrollY * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }, { passive: true });
  }

  return { mount };

})();
