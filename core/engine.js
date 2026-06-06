/**
 * VICTOR INVITATION ENGINE V1
 * core/engine.js — Core Engine
 * Created by Victor Rizki Valentiano
 */

window.VictorEngine = (() => {

  async function boot() {
    console.info('🌸 Victor Invitation Engine V1 — Booting...');

    try {
      // 1. Load invitation data
      const data = await VictorConfigLoader.load();
      const guestName = VictorUtils.getGuestName();
      const theme = VictorConfigLoader.getTheme();

      // 2. Load theme
      await VictorThemeLoader.load(theme);

      // 3. Update SEO meta
      updateSEO(data, guestName);

      // 4. Analytics (optional)
      if (window.VictorConfig?.FEATURES?.analytics && window.VictorConfig?.GA_ID) {
        loadAnalytics(window.VictorConfig.GA_ID);
      }

      // 5. Mount via orchestrator
      await VictorOrchestrator.mount(data, guestName);

      // 6. Init scroll reveal after DOM is ready
      setTimeout(() => VictorUtils.initScrollReveal(), 300);

      console.info('✅ Victor Invitation Engine V1 — Ready');
    } catch (e) {
      console.error('[VictorEngine] Boot failed:', e);
      hideLoader();
    }
  }

  function updateSEO(data, guestName) {
    const title = `Undangan Pernikahan ${data.bride_name} & ${data.groom_name}`;
    const description = guestName
      ? `Kepada Yth. ${guestName} — Anda diundang untuk merayakan pernikahan ${data.bride_name} & ${data.groom_name}`
      : `Anda diundang untuk merayakan pernikahan ${data.bride_name} & ${data.groom_name} pada ${VictorUtils.formatDate(data.event_date)}`;

    const el = (id) => document.getElementById(id);
    document.title = title;
    el('page-title') && (el('page-title').textContent = title);
    el('meta-description') && el('meta-description').setAttribute('content', description);
    el('og-title') && el('og-title').setAttribute('content', title);
    el('og-description') && el('og-description').setAttribute('content', description);
    el('twitter-title') && el('twitter-title').setAttribute('content', title);
    el('twitter-description') && el('twitter-description').setAttribute('content', description);

    const canonical = window.location.href.split('?')[0];
    el('canonical') && el('canonical').setAttribute('href', canonical);
    el('og-url') && el('og-url').setAttribute('content', canonical);

    if (data.couple_photo) {
      const img = data.couple_photo.startsWith('http') ? data.couple_photo : window.location.origin + '/' + data.couple_photo;
      el('og-image') && el('og-image').setAttribute('content', img);
      el('twitter-image') && el('twitter-image').setAttribute('content', img);
    }

    // Apple web app title
    const appTitleMeta = document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if (appTitleMeta) appTitleMeta.content = `${data.bride_name} & ${data.groom_name}`;
  }

  function loadAnalytics(gaId) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', gaId);
    window.gtag = gtag;
  }

  function hideLoader() {
    const loader = document.getElementById('engine-loader');
    if (loader) loader.classList.add('hidden');
  }

  function showApp() {
    const wrapper = document.getElementById('invitation-wrapper');
    if (wrapper) wrapper.classList.add('ready');
    hideLoader();
  }

  return { boot, hideLoader, showApp, updateSEO };

})();
