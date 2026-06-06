/**
 * VICTOR INVITATION ENGINE V1
 * core/module-loader.js — Dynamic Module Loader
 * Created by Victor Rizki Valentiano
 */

window.VictorModuleLoader = (() => {

  const _loaded = {};

  async function loadModule(name) {
    if (_loaded[name]) return _loaded[name];

    const base = `${window.VictorConfig?.PATHS?.modules || 'modules'}/${name}`;

    // Load CSS
    const cssPromise = loadCSS(`${base}/${name}.css`);

    // Load HTML template
    const htmlPromise = VictorUtils.fetchText(`${base}/${name}.html`).catch(() => '');

    // Load JS
    const jsPromise = loadScript(`${base}/${name}.js`);

    const [html] = await Promise.all([htmlPromise, cssPromise, jsPromise]);

    _loaded[name] = { html };
    return _loaded[name];
  }

  function loadCSS(href) {
    return new Promise((resolve) => {
      if (document.querySelector(`link[href="${href}"]`)) { resolve(); return; }
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = resolve;
      link.onerror = resolve; // non-fatal
      document.head.appendChild(link);
    });
  }

  function loadScript(src) {
    return new Promise((resolve) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = resolve; // non-fatal
      document.body.appendChild(script);
    });
  }

  async function mountModule(name, mountId, data, guestName) {
    const cfg = window.VictorConfig?.MODULES;
    if (cfg && cfg[name] === false) return;

    try {
      const mod = await loadModule(name);
      const mount = document.getElementById(mountId);
      if (!mount) return;

      // Inject HTML template
      if (mod.html) mount.innerHTML = mod.html;

      // Init module if registered
      const moduleName = `Victor${name.charAt(0).toUpperCase() + name.slice(1)}Module`;
      if (window[moduleName] && typeof window[moduleName].init === 'function') {
        await window[moduleName].init(data, guestName);
      }

      console.info(`[ModuleLoader] Mounted: ${name}`);
    } catch (e) {
      console.error(`[ModuleLoader] Failed to mount module: ${name}`, e);
    }
  }

  return { loadModule, mountModule };

})();
