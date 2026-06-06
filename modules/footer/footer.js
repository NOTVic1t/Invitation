/**
 * VICTOR INVITATION ENGINE V1
 * modules/footer/footer.js
 * Created by Victor Rizki Valentiano
 */

window.VictorFooterModule = {
  init(data, guestName) {
    const s = VictorUtils.sanitize;

    // Names
    const brideEl = document.getElementById('footer-bride');
    const groomEl = document.getElementById('footer-groom');
    if (brideEl) brideEl.textContent = s(data.bride_name || '');
    if (groomEl) groomEl.textContent = s(data.groom_name || '');

    // Date
    const dateEl = document.getElementById('footer-date');
    if (dateEl && data.event_date) {
      dateEl.textContent = VictorUtils.formatDate(data.event_date);
    }

    // Location
    const locEl = document.getElementById('footer-location');
    if (locEl) locEl.textContent = s(data.location || '');

    // Share buttons
    if (window.VictorConfig?.FEATURES?.shareButton !== false) {
      this._renderShareBtns(data, guestName);
    } else {
      const shareEl = document.getElementById('footer-share');
      if (shareEl) shareEl.remove();
    }
  },

  _renderShareBtns(data, guestName) {
    const container = document.getElementById('footer-share-btns');
    if (!container) return;

    const baseURL = window.location.href.split('?')[0];
    const guestParam = guestName ? `?to=${encodeURIComponent(guestName)}` : '';
    const shareURL = baseURL + guestParam;
    const shareTitle = `Undangan Pernikahan ${data.bride_name} & ${data.groom_name}`;
    const shareText = `Anda diundang dalam perayaan pernikahan ${data.bride_name} & ${data.groom_name}. ${VictorUtils.formatDate(data.event_date)}.`;

    const waURL = `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareURL)}`;

    container.innerHTML = `
      <a href="${waURL}" target="_blank" rel="noopener noreferrer" class="share-btn" aria-label="Share via WhatsApp">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        WhatsApp
      </a>
      <button class="share-btn" id="footer-copy-btn" aria-label="Copy link">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
        Salin Link
      </button>
      <button class="share-btn" id="footer-native-share" aria-label="Share">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>
        Bagikan
      </button>
    `;

    // Copy link
    document.getElementById('footer-copy-btn')?.addEventListener('click', () => {
      VictorUtils.copyToClipboard(shareURL).then(() => {
        const btn = document.getElementById('footer-copy-btn');
        if (btn) {
          const orig = btn.innerHTML;
          btn.innerHTML = btn.innerHTML.replace('Salin Link', 'Tersalin! ✓');
          setTimeout(() => { if (btn) btn.innerHTML = orig; }, 2000);
        }
      });
    });

    // Native share
    document.getElementById('footer-native-share')?.addEventListener('click', () => {
      VictorUtils.shareInvitation(shareTitle, shareText, shareURL);
    });

    // Hide native share if not supported
    if (!navigator.share) {
      document.getElementById('footer-native-share')?.remove();
    }
  },
};
