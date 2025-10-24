import { BookmarkStore } from './database.js';

const Favorite = {
  async render() {
    return `
      <section class="favorite-section">
        <h2 class="page-title">⭐ Story Favorit</h2>
        <div id="storyList" class="story-list"></div>
      </section>
    `;
  },

  async afterRender() {
    try {
      const stories = await BookmarkStore.getBookmarks();
      const container = document.getElementById('storyList');

      if (!stories || stories.length === 0) {
        container.innerHTML = '<p class="empty-message">Belum ada story favorit. Tambahkan dari halaman Home!</p>';
        return;
      }

      container.innerHTML = stories.map(story => `
        <article class="story-card" data-id="${story.id}">
          ${story.photoUrl ? `<img src="${story.photoUrl}" alt="${story.name}" class="story-img" />` : ''}
          <div class="story-info">
            <h3>${story.name || 'Tanpa Judul'}</h3>
            <p>${story.description || 'Tidak ada deskripsi'}</p>
            ${story.lat && story.lon ? `<p class="location">📍 ${story.lat}, ${story.lon}</p>` : ''}
            <button class="remove-bookmark-btn" data-id="${story.id}">🗑️ Hapus dari Favorit</button>
          </div>
        </article>
      `).join('');

      // Add event listener for remove buttons
      container.addEventListener('click', async (e) => {
        if (e.target.classList.contains('remove-bookmark-btn')) {
          const storyId = e.target.dataset.id;
          try {
            await BookmarkStore.removeBookmark(storyId);
            alert('Story berhasil dihapus dari favorit!');
            // Refresh the list
            this.afterRender();
          } catch (error) {
            console.error('Failed to remove bookmark:', error);
            alert('Gagal menghapus dari favorit');
          }
        }
      });

    } catch (error) {
      console.error('Error rendering favorites:', error);
      const container = document.getElementById('storyList');
      container.innerHTML = '<p class="error-message">Gagal memuat story favorit</p>';
    }
  },
};

export default Favorite;