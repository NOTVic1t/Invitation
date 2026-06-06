/**
 * VICTOR INVITATION ENGINE V1
 * modules/guestbook/guestbook.js
 * Created by Victor Rizki Valentiano
 */

window.VictorGuestbookModule = {
  _invitationId: null,
  _entries: [],

  async init(data, guestName) {
    this._invitationId = data.id;

    // Pre-fill name
    const nameInput = document.getElementById('gb-name');
    if (nameInput && guestName) nameInput.value = guestName;

    // Form submit
    const form = document.getElementById('guestbook-form');
    if (form) form.addEventListener('submit', (e) => this._submit(e));

    // Load existing entries
    await this._loadEntries();
  },

  async _loadEntries() {
    const list = document.getElementById('guestbook-list');
    const loading = document.getElementById('gb-loading');

    try {
      const isConfigured = !window.VictorConfig?.SUPABASE_URL?.includes('YOUR_PROJECT');
      if (isConfigured) {
        this._entries = await VictorSupabase.getGuestbook(this._invitationId);
      } else {
        this._entries = [
          { id: 1, guest_name: 'Sarah & Ahmad', message: 'Selamat menempuh hidup baru. Semoga menjadi keluarga yang sakinah, mawaddah, dan warahmah. Barakallahu lakuma.', created_at: new Date().toISOString() },
          { id: 2, guest_name: 'Keluarga Budi Santoso', message: 'Doa kami selalu menyertai kalian. Semoga menjadi pasangan yang abadi hingga jannah.', created_at: new Date().toISOString() },
          { id: 3, guest_name: 'Rizki & Nia', message: 'Congrats! Semoga pernikahan kalian dipenuhi kebahagiaan dan berkah.', created_at: new Date().toISOString() },
        ];
      }
    } catch (e) {
      console.warn('[Guestbook] Load failed:', e.message);
      this._entries = [];
    }

    this._renderEntries();
    if (loading) loading.remove();
  },

  _renderEntries() {
    const list = document.getElementById('guestbook-list');
    const loading = document.getElementById('gb-loading');
    if (!list) return;

    if (!this._entries.length) {
      list.innerHTML = '<p class="gb-empty">Jadilah yang pertama memberikan ucapan!</p>';
      return;
    }

    list.innerHTML = this._entries.map(e => this._cardHTML(e)).join('');
  },

  _cardHTML(entry) {
    const s = VictorUtils.sanitize;
    const date = new Date(entry.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    return `
      <div class="gb-card" role="listitem">
        <p class="gb-card-name">${s(entry.guest_name)}</p>
        <p class="gb-card-message">${s(entry.message)}</p>
        <p class="gb-card-date">${date}</p>
      </div>
    `;
  },

  async _submit(e) {
    e.preventDefault();
    const form = document.getElementById('guestbook-form');
    const errorEl = document.getElementById('gb-error');
    const submitBtn = document.getElementById('gb-submit');
    const submitText = document.getElementById('gb-submit-text');
    const submitLoading = document.getElementById('gb-submit-loading');

    errorEl.classList.add('hidden');
    const name = form.querySelector('#gb-name')?.value.trim();
    const message = form.querySelector('#gb-message')?.value.trim();

    if (!name) return this._setError('Nama wajib diisi.');
    if (!message) return this._setError('Ucapan tidak boleh kosong.');

    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.classList.add('hidden');
    if (submitLoading) submitLoading.classList.remove('hidden');

    const payload = { invitation_id: this._invitationId, guest_name: name, message };

    try {
      await VictorSupabase.submitGuestbook(payload);
    } catch (err) {
      console.warn('[Guestbook] Submit error (non-fatal in demo):', err.message);
    }

    // Optimistically add to list
    const newEntry = { ...payload, id: Date.now(), created_at: new Date().toISOString() };
    this._entries.unshift(newEntry);
    this._renderEntries();

    form.reset();
    if (submitBtn) submitBtn.disabled = false;
    if (submitText) submitText.classList.remove('hidden');
    if (submitLoading) submitLoading.classList.add('hidden');
  },

  _setError(msg) {
    const el = document.getElementById('gb-error');
    if (el) { el.textContent = msg; el.classList.remove('hidden'); }
  },
};
