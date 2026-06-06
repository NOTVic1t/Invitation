/**
 * VICTOR INVITATION ENGINE V1
 * modules/gallery/gallery.js
 * Created by Victor Rizki Valentiano
 */

window.VictorGalleryModule = {
  _photos: [],
  _current: 0,

  init(data) {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    this._photos = data.gallery || [];

    if (!this._photos.length) {
      grid.innerHTML = '<p class="gallery-empty">Foto akan segera tersedia</p>';
      return;
    }

    grid.innerHTML = this._photos.map((photo, i) => `
      <div class="gallery-item reveal reveal-delay-${(i % 4) + 1}" role="listitem" tabindex="0" data-index="${i}" aria-label="Photo ${i+1}">
        <img src="${VictorUtils.sanitize(photo.url || photo)}" alt="${VictorUtils.sanitize(photo.caption || `Foto ${i+1}`)}" loading="lazy" />
      </div>
    `).join('');

    // Events
    grid.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => this._openLightbox(parseInt(item.dataset.index)));
      item.addEventListener('keydown', (e) => { if (e.key === 'Enter') this._openLightbox(parseInt(item.dataset.index)); });
    });

    // Lightbox controls
    document.getElementById('lightbox-close')?.addEventListener('click', () => this._closeLightbox());
    document.getElementById('lightbox-prev')?.addEventListener('click', () => this._navigate(-1));
    document.getElementById('lightbox-next')?.addEventListener('click', () => this._navigate(1));

    document.addEventListener('keydown', (e) => {
      const lb = document.getElementById('gallery-lightbox');
      if (lb?.classList.contains('hidden')) return;
      if (e.key === 'Escape') this._closeLightbox();
      if (e.key === 'ArrowLeft') this._navigate(-1);
      if (e.key === 'ArrowRight') this._navigate(1);
    });
  },

  _openLightbox(index) {
    this._current = index;
    const lb = document.getElementById('gallery-lightbox');
    const img = document.getElementById('lightbox-img');
    if (!lb || !img) return;
    const photo = this._photos[index];
    img.src = photo.url || photo;
    img.alt = photo.caption || `Foto ${index + 1}`;
    lb.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  },

  _closeLightbox() {
    document.getElementById('gallery-lightbox')?.classList.add('hidden');
    document.body.style.overflow = '';
  },

  _navigate(dir) {
    this._current = (this._current + dir + this._photos.length) % this._photos.length;
    this._openLightbox(this._current);
  },
};
