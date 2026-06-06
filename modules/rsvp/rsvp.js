/**
 * VICTOR INVITATION ENGINE V1
 * modules/rsvp/rsvp.js
 * Created by Victor Rizki Valentiano
 */

window.VictorRsvpModule = {
  _invitationId: null,

  init(data, guestName) {
    this._invitationId = data.id;

    // Pre-fill guest name from URL
    const nameInput = document.getElementById('rsvp-name');
    if (nameInput && guestName) {
      nameInput.value = guestName;
    }

    // Show/hide guest count based on attendance
    document.querySelectorAll('input[name="attendance"]').forEach(radio => {
      radio.addEventListener('change', () => {
        const field = document.getElementById('rsvp-count-field');
        if (field) {
          field.style.display = radio.value === 'hadir' ? 'block' : 'none';
        }
      });
    });

    // Form submit
    const form = document.getElementById('rsvp-form');
    if (form) form.addEventListener('submit', (e) => this._submit(e));
  },

  async _submit(e) {
    e.preventDefault();
    const form = document.getElementById('rsvp-form');
    const errorEl = document.getElementById('rsvp-error');
    const submitBtn = document.getElementById('rsvp-submit');
    const submitText = document.getElementById('rsvp-submit-text');
    const submitLoading = document.getElementById('rsvp-submit-loading');

    this._clearError();

    // Validate
    const name = form.querySelector('#rsvp-name')?.value.trim();
    const attendance = form.querySelector('input[name="attendance"]:checked')?.value;
    const guestCount = parseInt(form.querySelector('#rsvp-count')?.value) || 1;
    const message = form.querySelector('#rsvp-message')?.value.trim();

    if (!name) return this._showError('Nama lengkap wajib diisi.');
    if (!attendance) return this._showError('Mohon pilih kehadiran Anda.');

    // Loading state
    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.classList.add('hidden');
    if (submitLoading) submitLoading.classList.remove('hidden');

    const payload = {
      invitation_id: this._invitationId,
      guest_name: name,
      attendance,
      guest_count: guestCount,
      message: message || null,
    };

    try {
      await VictorSupabase.submitRSVP(payload);
      this._showSuccess();
    } catch (err) {
      console.error('[RSVP] Submit error:', err);
      // Graceful fallback — show success anyway (demo mode)
      if (window.VictorConfig?.SUPABASE_URL?.includes('YOUR_PROJECT')) {
        this._showSuccess();
      } else {
        this._showError('Gagal mengirim. Silakan coba lagi.');
        if (submitBtn) submitBtn.disabled = false;
        if (submitText) submitText.classList.remove('hidden');
        if (submitLoading) submitLoading.classList.add('hidden');
      }
    }
  },

  _showSuccess() {
    document.getElementById('rsvp-form')?.classList.add('hidden');
    document.getElementById('rsvp-success')?.classList.remove('hidden');
  },

  _showError(msg) {
    const el = document.getElementById('rsvp-error');
    if (el) { el.textContent = msg; el.classList.remove('hidden'); }
  },

  _clearError() {
    const el = document.getElementById('rsvp-error');
    if (el) { el.textContent = ''; el.classList.add('hidden'); }
  },
};
