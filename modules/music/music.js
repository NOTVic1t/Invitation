/**
 * VICTOR INVITATION ENGINE V1
 * modules/music/music.js
 * Created by Victor Rizki Valentiano
 */

window.VictorMusicModule = {
  _audio: null,
  _playing: false,

  init(data) {
    const mount = document.getElementById('music-module-mount');
    if (!mount || !data.music_url) return;

    mount.innerHTML = `
      <div id="music-player" role="complementary" aria-label="Background Music">
        <button class="music-btn" id="music-toggle-btn" aria-label="Play/Pause Music" aria-pressed="false">
          <svg class="music-icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
          <svg class="music-icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 19h4V5H6zm8-14v14h4V5z"/></svg>
        </button>
      </div>
    `;

    this._audio = new Audio(data.music_url);
    this._audio.loop = true;
    this._audio.volume = 0.4;

    const btn = document.getElementById('music-toggle-btn');
    if (btn) {
      btn.addEventListener('click', () => this._toggle());
    }

    // Auto-play on opening close
    VictorUtils.on('opening:open', () => {
      this._play();
    });
  },

  _play() {
    if (!this._audio) return;
    this._audio.play().then(() => {
      this._playing = true;
      this._updateBtn();
    }).catch(() => {
      // Autoplay blocked — user must interact
    });
  },

  _toggle() {
    if (!this._audio) return;
    if (this._playing) {
      this._audio.pause();
      this._playing = false;
    } else {
      this._audio.play().catch(() => {});
      this._playing = true;
    }
    this._updateBtn();
  },

  _updateBtn() {
    const btn = document.getElementById('music-toggle-btn');
    if (!btn) return;
    btn.classList.toggle('playing', this._playing);
    btn.setAttribute('aria-pressed', String(this._playing));
    btn.setAttribute('aria-label', this._playing ? 'Pause Music' : 'Play Music');
  },
};
