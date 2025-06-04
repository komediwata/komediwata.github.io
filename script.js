//window.toggleNight = function() {
  //document.body.classList.toggle('night');
//};

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

  function handleHash() {
    const hash = window.location.hash;
    if (hash.startsWith('#post=')) {
      const filename = decodeURIComponent(hash.slice(6));

      fetch('config.json')
        .then(res => res.json())
        .then(posts => {
          const post = posts.find(p => p.file.endsWith('/' + filename));
          if (!post) {
            alert('Post not found.');
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
