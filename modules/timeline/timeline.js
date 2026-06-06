/**
 * VICTOR INVITATION ENGINE V1
 * modules/timeline/timeline.js
 * Created by Victor Rizki Valentiano
 */

window.VictorTimelineModule = {
  init(data) {
    const list = document.getElementById('timeline-list');
    if (!list) return;

    // Build default timeline from event data
    const items = data.timeline || this._buildDefault(data);

    list.innerHTML = items.map((item, i) => `
      <div class="timeline-item reveal reveal-delay-${(i % 4) + 1}" role="listitem">
        <span class="timeline-time">${VictorUtils.sanitize(item.time || '')}</span>
        <div class="timeline-dot" aria-hidden="true"></div>
        <div class="timeline-content">
          <h3 class="timeline-title">${VictorUtils.sanitize(item.title || '')}</h3>
          ${item.desc ? `<p class="timeline-desc">${VictorUtils.sanitize(item.desc)}</p>` : ''}
        </div>
      </div>
    `).join('');
  },

  _buildDefault(data) {
    const items = [];
    if (data.akad_date) {
      items.push({ time: VictorUtils.formatTime(data.akad_date), title: 'Akad Nikah', desc: data.location_akad || '' });
    }
    if (data.event_date) {
      items.push({ time: VictorUtils.formatTime(data.event_date), title: 'Resepsi Pernikahan', desc: data.location || '' });
    }
    if (data.event_date_end) {
      items.push({ time: VictorUtils.formatTime(data.event_date_end), title: 'Penutupan', desc: '' });
    }
    return items;
  },
};
