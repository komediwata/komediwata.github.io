//window.toggleNight = function() {
  //document.body.classList.toggle('night');
//};

window.addEventListener('DOMContentLoaded', () => {
  const postContent = document.getElementById('post-content');
  const bio = document.getElementById('bio');

  function sha256(text) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(text))
      .then(buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join(''));
  }

  function base64Encode(text) {
    return btoa(text);
  }

  function loadPost(post, filename) {
    // Ask for password and verify
    if (post.passwordHash) {
      const input = prompt("Enter password:");
      sha256(input).then(hash => {
        if (hash !== post.passwordHash) {
          alert("Wrong password.");
          return;
        }
        fetchPost(filename, post.title);
      });
    } else {
      fetchPost(filename, post.title);
    }
  }

  function fetchPost(filename, title) {
    fetch(`/post/${filename}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load post.');
        return res.text();
      })
      .then(txt => {
        bio.style.display = 'none';
        postContent.style.display = 'block';
        document.getElementById('site-name-top').style.display = 'block';
        document.getElementById('post-title').textContent = title || '';
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
      const fileEncoded = base64Encode(filename);
      fetch('config.json')
        .then(res => res.json())
        .then(posts => {
          const post = posts.find(p => p.fileHash === fileEncoded);
          if (!post) {
            alert('File not found or removed.');
            return;
          }
          loadPost(post, filename);
        })
        .catch(() => alert('Error loading config.'));
    } else {
      bio.style.display = 'block';
      postContent.style.display = 'none';
    }
  }

  handleHash();
  window.addEventListener('hashchange', handleHash);
});

  // Run once and on hash change
  handleHash();
  window.addEventListener('hashchange', handleHash);
});
