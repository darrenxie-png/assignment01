import db from './db.js';

const Favorite = {
  async render() {
    return `
      <section class="favorite">
        <h2>Story Favorit</h2>
        <div id="storyList"></div>
      </section>
    `;
  },

  async afterRender() {
    const stories = await db.getAllStories();
    const container = document.getElementById('storyList');
    
    if (stories.length === 0) {
      container.innerHTML = '<p>Tidak ada story favorit.</p>';
    } else {
      container.innerHTML = stories.map(story => `
        <article class="story-item">
          <h3>${story.title}</h3>
          <p>${story.description}</p>
        </article>
      `).join('');
    }
  },
};

export default Favorite;
