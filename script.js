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

  function loadPost(post, filename) {
    if (post.passwordHash) {
      const input = prompt("Enter password:");
      sha256(input).then(hash => {
        if (hash !== post.passwordHash) {
          alert("Wrong password.");
          bio.style.display = 'block';
          postContent.style.display = 'none';
          return;
        }
        fetchPost(filename, post.title);
      });
    } else {
      fetchPost(filename, post.title);
    }
  }

  function fetchPost(filename, title) {
    // Fetch post file relative to current directory (adjust if needed)
    fetch(`post/${filename}`)
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
    console.log('Current hash:', hash);
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
      console.log('Looking for fileHash of:', filename);
      sha256(filename).then(fileHash => {
        console.log('Computed fileHash:', fileHash);
        fetch('config.json')
          .then(res => res.json())
          .then(posts => {
            const post = posts.find(p => p.fileHash === fileHash);
            if (!post) {
              alert('memang takde atau dipadam');
              bio.style.display = 'block';
              postContent.style.display = 'none';
              return;
            }
            loadPost(post, filename);
          })
          .catch(() => {
            alert('jap ada bug');
            bio.style.display = 'block';
            postContent.style.display = 'none';
          });
      });
    } else {
      bio.style.display = 'block';
      postContent.style.display = 'none';
    }
  }

  // Initial load and listen for hash changes
  handleHash();
  window.addEventListener('hashchange', handleHash);
});
