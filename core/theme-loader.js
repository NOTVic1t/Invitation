/**
 * VICTOR INVITATION ENGINE V1
 * core/theme-loader.js — Theme System
 * Created by Victor Rizki Valentiano
 */

window.VictorThemeLoader = (() => {

  let _manifest = null;

  async function load(themeName) {
    const cssLink = document.getElementById('theme-stylesheet');
    const cssHref = VictorUtils.themeURL(themeName, 'theme.css');

    // Load CSS
    await new Promise((resolve, reject) => {
      cssLink.href = cssHref;
      cssLink.onload = resolve;
      cssLink.onerror = () => {
        console.warn(`[ThemeLoader] CSS not found for theme "${themeName}". Using default.`);
        resolve();
      };
    });

    // Load JSON manifest
    try {
      _manifest = await VictorUtils.fetchJSON(VictorUtils.themeURL(themeName, 'theme.json'));
      applyManifest(_manifest);
      console.info(`[ThemeLoader] Theme loaded: ${themeName}`);
    } catch (e) {
      console.warn(`[ThemeLoader] theme.json not found for "${themeName}".`, e.message);
    }

    // Set body data attribute for CSS hooks
    document.documentElement.setAttribute('data-theme', themeName);
    document.body.setAttribute('data-theme', themeName);

    return _manifest;
  }

  function applyManifest(manifest) {
    if (!manifest) return;
    const root = document.documentElement;

    // Apply CSS variables from manifest
    if (manifest.colors) {
      Object.entries(manifest.colors).forEach(([key, val]) => {
        root.style.setProperty(`--color-${key}`, val);
      });
    }

    if (manifest.fonts?.display) {
      root.style.setProperty('--font-display', manifest.fonts.display);
      // Inject Google Font if specified
      if (manifest.fonts.googleFonts) {
        injectGoogleFonts(manifest.fonts.googleFonts);
      }
    }
    if (manifest.fonts?.body) {
      root.style.setProperty('--font-body', manifest.fonts.body);
    }
    if (manifest.fonts?.accent) {
      root.style.setProperty('--font-accent', manifest.fonts.accent);
    }

    if (manifest.effects) {
      Object.entries(manifest.effects).forEach(([key, val]) => {
        root.style.setProperty(`--effect-${key}`, val);
      });
    }

    // Update PWA theme color
    const themeColorMeta = document.getElementById('meta-theme-color');
    if (themeColorMeta && manifest.colors?.primary) {
      themeColorMeta.content = manifest.colors.primary;
    }
  }

  function injectGoogleFonts(url) {
    if (document.querySelector(`link[href="${url}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  }

  function getManifest() {
    return _manifest;
  }

  return { load, getManifest };

})();
