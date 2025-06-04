function toggleNight() {
  document.body.classList.toggle('night');
}

window.addEventListener('load', () => {
  const postContent = document.getElementById('post-content');
  const bio = document.getElementById('bio');

  function loadPost(post) {
    if (post.password) {
      const input = prompt("Enter password:");
      if (input !== post.password) {
        alert("Incorrect password.");
        return;
      }
    }
    fetch(post.file)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load post.');
        return res.text();
      })
      .then(txt => {
        bio.style.display = 'none';
        postContent.style.display = 'block';
        postContent.textContent = txt;
      })
      .catch(() => {
        bio.style.display = 'block';
        postContent.style.display = 'none';
        alert('Error loading post.');
      });
  }

  // Read hash param
  const hash = window.location.hash;
  if (hash.startsWith('#post=')) {
    const filename = decodeURIComponent(hash.slice(6));
    fetch('config.json')
      .then(res => res.json())
      .then(posts => {
        const post = posts.find(p => p.file.endsWith(filename));
        if (!post) {
          alert('Post not found.');
          return;
        }
        loadPost(post);
      })
      .catch(() => alert('Error loading config.'));
  }
});
