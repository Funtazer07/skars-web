document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('gallery');

  try {
    const res = await fetch('/api/photos');
    const photos = await res.json();

    photos.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      img.alt = 'Gallery photo';
      img.className = 'gallery-photo';
      container.appendChild(img);
    });
  } catch (err) {
    container.innerText = 'Failed to load gallery.';
    console.error(err);
  }
});