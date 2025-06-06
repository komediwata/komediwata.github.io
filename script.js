document.addEventListener('DOMContentLoaded', () => {
  const nightToggle = document.getElementById('night-toggle');

  // Set initial state from localStorage
  const isNight = localStorage.getItem('nightMode') === 'true';
  if (isNight) {
    document.body.classList.add('night');
    nightToggle.textContent = '☀️';
  } else {
    nightToggle.textContent = '🌙';
  }

  // Toggle theme and icon
  nightToggle.addEventListener('click', () => {
    const isNightNow = document.body.classList.toggle('night');
    localStorage.setItem('nightMode', isNightNow);
    nightToggle.textContent = isNightNow ? '☀️' : '🌙';
  });
});

window.addEventListener('DOMContentLoaded', () => {
  const postContent = document.getElementById('post-content');
  const bio = document.getElementById('bio');

  if (!postContent || !bio) {
    console.error('Required DOM elements not found!');
    return;
  }

  function loadPost(post) {
    if (post.password) {
      const input = prompt("Enter password:");
      if (input !== post.password) {
        alert("haha salah.");
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
        document.getElementById('site-name-top').style.display = 'block';
        document.getElementById('post-title').textContent = post.title || '';
        document.getElementById('post-body').textContent = txt;
        
      })
      .catch(() => {
        bio.style.display = 'block';
        postContent.style.display = 'none';
        alert('Error loading post.');
      });
  }

  function handleHash() {
    const hash = window.location.hash;
    let folder = null;
    let filename = null;

    if (hash.startsWith('#post=')) {
      folder = 'post';
      filename = decodeURIComponent(hash.slice(6));
    } else if (hash.startsWith('#sastra=')) {
      folder = 'sastra';
      filename = decodeURIComponent(hash.slice(8));
    }

    if (folder && filename) {
      fetch('config.json')
        .then(res => res.json())
        .then(posts => {
          const path = `/${folder}/${filename}`;
          const post = posts.find(p => p.file === path);
          if (!post) {
            alert('memang takde atau telah dipadam');
            return;
          }
          loadPost(post);
        })
        .catch(() => alert('Error loading config.'));
    } else {
      // Show bio if no post selected
      bio.style.display = 'block';
      postContent.style.display = 'none';
    }
  }

  // Run once and on hash change
  handleHash();
  window.addEventListener('hashchange', handleHash);
});
