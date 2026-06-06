/**
 * VICTOR INVITATION ENGINE V1
 * modules/couple/couple.js
 * Created by Victor Rizki Valentiano
 */

window.VictorCoupleModule = {
  init(data) {
    const s = VictorUtils.sanitize;

    // Photos
    const bp = document.getElementById('bride-photo');
    const gp = document.getElementById('groom-photo');
    if (bp && data.bride_photo) { bp.src = data.bride_photo; bp.alt = `Foto ${data.bride_name}`; }
    if (gp && data.groom_photo) { gp.src = data.groom_photo; gp.alt = `Foto ${data.groom_name}`; }

    // Names & parents
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = s(val || ''); };
    set('bride-full-name', data.bride_full || data.bride_name);
    set('groom-full-name', data.groom_full || data.groom_name);
    set('bride-parents', data.bride_parents || '');
    set('groom-parents', data.groom_parents || '');

    // Event Cards
    const eventsEl = document.getElementById('event-details');
    if (eventsEl) {
      eventsEl.innerHTML = this._buildEventCards(data);
    }

    // Maps button
    const mapsWrap = document.getElementById('event-maps-btn-wrap');
    if (mapsWrap && data.maps_url) {
      mapsWrap.innerHTML = `
        <a href="${s(data.maps_url)}" target="_blank" rel="noopener noreferrer" class="btn-maps">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>
          Buka di Google Maps
        </a>
      `;
    }
  },

  _buildEventCards(data) {
    const calIcon = `<svg viewBox="0 0 24 24"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>`;
    const locIcon = `<svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>`;
    const timeIcon = `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 5v5.25l4.5 2.67-.75 1.23L11 13V7h1.5z"/></svg>`;

    const cards = [];

    if (data.akad_date) {
      cards.push(this._eventCard('Akad Nikah', data.akad_date, data.akad_date_end, data.location_akad, calIcon, locIcon, timeIcon));
    }

    cards.push(this._eventCard('Resepsi', data.event_date, data.event_date_end, data.location, calIcon, locIcon, timeIcon));

    return cards.join('');
  },

  _eventCard(type, dateStart, dateEnd, location, calIcon, locIcon, timeIcon) {
    const date = VictorUtils.formatDate(dateStart);
    const timeStart = VictorUtils.formatTime(dateStart);
    const timeEnd = dateEnd ? ` – ${VictorUtils.formatTime(dateEnd)}` : ' – selesai';
    const loc = VictorUtils.sanitize(location || '');

    return `
      <div class="event-card">
        <p class="event-type">${type}</p>
        <h3 class="event-name">${type}</h3>
        <div class="event-info-row">${calIcon}<span class="event-info-text">${date}</span></div>
        <div class="event-info-row">${timeIcon}<span class="event-info-text">${timeStart}${timeEnd} WIB</span></div>
        <div class="event-info-row">${locIcon}<span class="event-info-text">${loc}</span></div>
      </div>
    `;
  },
};
