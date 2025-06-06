//window.toggleNight = function() {
  //document.body.classList.toggle('night');
//};

window.addEventListener('DOMContentLoaded', () => {
  const postContent = document.getElementById('post-content');
  const bio = document.getElementById('bio');

  // SHA-256 hashing function
  function sha256(text) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(text))
      .then(buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join(''));
  }

  // Load and show post content after password check (if needed)
  function loadPost(post, filePath, fileName) {
    if (post.passwordHash) {
      const input = prompt("Enter password:");
      sha256(input).then(hash => {
        if (hash !== post.passwordHash) {
          alert("Wrong password.");
          bio.style.display = 'block';
          postContent.style.display = 'none';
          return;
        }
        fetchPost(filePath, post.title);
      });
    } else {
      fetchPost(filePath, post.title);
    }
  }

  // Fetch the post content from server and show it
  function fetchPost(filePath, title) {
    fetch(filePath)
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

  // Handle the URL hash changes
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
      const filePath = `/${folder}/${filename}`; // e.g. /post/bank-in.txt

      sha256(filePath).then(fileHash => {
        fetch('config.json')
          .then(res => res.json())
          .then(posts => {
            const post = posts.find(p => p.fileHash === fileHash);
            if (!post) {
              alert('Post not found or deleted');
              bio.style.display = 'block';
              postContent.style.display = 'none';
              return;
            }
            loadPost(post, filePath, filename);
          })
          .catch(() => {
            alert('Error loading config');
            bio.style.display = 'block';
            postContent.style.display = 'none';
          });
      });
    } else {
      bio.style.display = 'block';
      postContent.style.display = 'none';
    }
  }

  handleHash();
  window.addEventListener('hashchange', handleHash);
});
