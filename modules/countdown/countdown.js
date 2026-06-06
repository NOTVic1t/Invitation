/**
 * VICTOR INVITATION ENGINE V1
 * modules/countdown/countdown.js
 * Created by Victor Rizki Valentiano
 */

window.VictorCountdownModule = {
  _timer: null,

  init(data) {
    const dateLabel = document.getElementById('countdown-date-label');
    if (dateLabel && data.event_date) {
      dateLabel.textContent = VictorUtils.formatDate(data.event_date);
    }

    if (data.event_date) {
      this._start(data.event_date);
    }
  },

  _start(targetDate) {
    const update = () => {
      const cd = VictorUtils.countdown(targetDate);

      const setNum = (id, val) => {
        const el = document.getElementById(id);
        if (!el) return;
        const padded = VictorUtils.pad(val);
        if (el.textContent !== padded) {
          el.textContent = padded;
          el.classList.remove('tick');
          void el.offsetWidth; // reflow
          el.classList.add('tick');
        }
      };

      if (cd.ended) {
        clearInterval(this._timer);
        const grid = document.getElementById('countdown-grid');
        const ended = document.getElementById('countdown-ended');
        if (grid) grid.classList.add('hidden');
        if (ended) ended.classList.remove('hidden');
        return;
      }

      setNum('cd-days',    cd.days);
      setNum('cd-hours',   cd.hours);
      setNum('cd-minutes', cd.minutes);
      setNum('cd-seconds', cd.seconds);
    };

    update();
    this._timer = setInterval(update, 1000);
  },

  destroy() {
    if (this._timer) clearInterval(this._timer);
  },
};
