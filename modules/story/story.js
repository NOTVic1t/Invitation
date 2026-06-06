/**
 * VICTOR INVITATION ENGINE V1
 * modules/story/story.js
 * Created by Victor Rizki Valentiano
 */

window.VictorStoryModule = {
  init(data) {
    const container = document.getElementById('story-timeline');
    if (!container) return;

    const stories = data.story || [];
    if (!stories.length) {
      document.getElementById('story-section')?.remove();
      return;
    }

    container.innerHTML = stories.map((item, i) => {
      const s = VictorUtils.sanitize;
      return `
        <div class="story-item reveal reveal-delay-${(i % 3) + 1}" role="listitem">
          <div class="story-year-badge">${s(item.year || '')}</div>
          ${i % 2 === 0 ? '' : '<div class="story-spacer"></div>'}
          <article class="story-card">
            <h3 class="story-card-title">${s(item.title || '')}</h3>
            <p class="story-card-content">${s(item.content || '')}</p>
          </article>
          ${i % 2 === 0 ? '<div class="story-spacer"></div>' : ''}
        </div>
      `;
    }).join('');
  },
};
