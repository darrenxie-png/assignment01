import { BookmarkStore } from './database.js';

const Favorite = {
  async render() {
    return `
      <section class="favorite">
        <h2>Story Favorit</h2>
        <div id="storyList" class="story-list"></div>
      </section>
    `;
  },

  async afterRender() {
    const stories = await BookmarkStore.getBookmarks(); // ✅ ganti fungsi ini
    const container = document.getElementById('storyList');
    
    if (!stories || stories.length === 0) {
      container.innerHTML = '<p>Tidak ada story favorit.</p>';
      return;
    }

    container.innerHTML = stories.map(story => `
  <article class="story-item">
    ${story.photo ? `<img src="${story.photo}" alt="${story.title}" class="story-photo" />` : ''}
    <h3>${story.title}</h3>
    <p>${story.description}</p>
    <p><small>Lat: ${story.lat}, Lng: ${story.lng}</small></p>
  </article>
`).join('');

  },
};

export default Favorite;
