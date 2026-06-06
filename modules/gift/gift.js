/**
 * VICTOR INVITATION ENGINE V1
 * modules/gift/gift.js
 * Created by Victor Rizki Valentiano
 */

window.VictorGiftModule = {
  init(data) {
    // Bank list
    const bankList = document.getElementById('gift-bank-list');
    if (bankList) {
      const banks = data.gift_bank || [];
      bankList.innerHTML = banks.map((b, i) => this._bankCard(b, i)).join('');
    }

    // Address
    const addrCard = document.getElementById('gift-address-card');
    if (addrCard) {
      addrCard.innerHTML = `
        <div class="gift-address-icon" aria-hidden="true">✦</div>
        <p class="gift-address-text">${VictorUtils.sanitize(data.gift_address || 'Hubungi mempelai untuk informasi pengiriman')}</p>
        <p class="gift-address-note">Mohon konfirmasi pengiriman via WhatsApp</p>
      `;
    }

    // Tabs
    document.querySelectorAll('.gift-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        document.querySelectorAll('.gift-tab').forEach(t => {
          t.classList.toggle('active', t === tab);
          t.setAttribute('aria-selected', String(t === tab));
        });
        document.getElementById('gift-bank-panel')?.classList.toggle('hidden', target !== 'bank');
        document.getElementById('gift-address-panel')?.classList.toggle('hidden', target !== 'address');
      });
    });
  },

  _bankCard(bank, idx) {
    const s = VictorUtils.sanitize;
    return `
      <div class="gift-bank-card">
        <p class="gift-bank-name">${s(bank.bank)}</p>
        <div class="gift-account-row">
          <div>
            <p class="gift-account-number" id="acct-${idx}">${s(bank.account)}</p>
            <p class="gift-account-holder">${s(bank.name)}</p>
          </div>
          <button class="btn-copy" data-account="${s(bank.account)}" data-idx="${idx}" aria-label="Copy account number">Salin</button>
        </div>
      </div>
    `;
  },
};

// Copy button delegation
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-copy');
  if (!btn) return;
  const account = btn.dataset.account;
  VictorUtils.copyToClipboard(account).then(() => {
    btn.textContent = 'Tersalin!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Salin'; btn.classList.remove('copied'); }, 2000);
  });
});
