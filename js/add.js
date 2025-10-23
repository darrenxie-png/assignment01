import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Add = {
  async render() {
    return `
      <section class="add-section">
        <h2 class="page-title">Tambah Story Baru</h2>
        <form id="addForm" class="add-form">
          <label for="name">Judul Story</label>
          <input type="text" id="name" name="name" placeholder="Nama story" required />

          <label for="description">Deskripsi</label>
          <textarea id="description" name="description" placeholder="Deskripsi cerita" required></textarea>

          <label for="photo">Foto</label>
          <input type="file" id="photo" name="photo" accept="image/*" required />

          <label>Pilih Lokasi di Peta</label>
          <div id="map" class="map-container"></div>

          <label for="lat">Latitude</label>
          <input type="text" id="lat" name="lat" placeholder="Klik peta untuk menentukan" readonly required />

          <label for="lon">Longitude</label>
          <input type="text" id="lon" name="lon" placeholder="Klik peta untuk menentukan" readonly required />

          <button type="submit" class="submit-btn">Tambah Story</button>
        </form>
      </section>
    `;
  },

  async afterRender() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.hash = '#/login';
        return;
      }

      // Reset map
      const mapContainer = L.DomUtil.get('map');
      if (mapContainer != null) {
        mapContainer._leaflet_id = null;
      }

      // Init map
      const map = L.map('map').setView([-2.5, 118], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      let marker = L.marker([-2.5, 118]).addTo(map)
        .bindPopup('📍 -2.500000, 118.000000').openPopup();

      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        document.getElementById('lat').value = lat.toFixed(6);
        document.getElementById('lon').value = lng.toFixed(6);

        if (marker) map.removeLayer(marker);
        marker = L.marker([lat, lng]).addTo(map)
          .bindPopup(`📍 ${lat.toFixed(6)}, ${lng.toFixed(6)}`).openPopup();
      });

      setTimeout(() => map.invalidateSize(), 100);

      // Submit form
      document.getElementById('addForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const photo = document.getElementById('photo').files[0];
        const lat = document.getElementById('lat').value;
        const lon = document.getElementById('lon').value;

        if (!name || !description || !photo || !lat || !lon) {
          alert('Semua field harus diisi dan lokasi harus dipilih!');
          return;
        }

        const formData = new FormData();
        // ❗ API Dicoding TIDAK TERIMA "name"
        // Jadi kita gabungkan name ke description
        formData.append('description', `${name} - ${description}`);
        formData.append('photo', photo);
        formData.append('lat', lat);
        formData.append('lon', lon);

        try {
          const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });

          const result = await response.json();

          if (!result.error) {
            alert(result.message || 'Story berhasil ditambahkan!');
            if (Notification.permission === 'granted') {
              new Notification('Story Baru Ditambahkan!', {
                body: `"${name}" berhasil dipublikasikan`,
                icon: '/icons/icon-192.png',
              });
            }
            window.location.hash = '#/home';
          } else {
            alert(`Error: ${result.message}`);
          }
        } catch (error) {
          console.error('Gagal menambahkan story:', error);
          alert('Gagal menambahkan story: ' + error.message);
        }
      });

    } catch (error) {
      console.error('Gagal inisialisasi halaman add:', error);
    }
  },
};

export default Add;
