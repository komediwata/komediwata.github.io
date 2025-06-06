//window.toggleNight = function() {
  //document.body.classList.toggle('night');
//};

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

async function loadPost(post, actualFilename) {
  const input = post.passwordHash
    ? prompt("Enter password:")
    : null;

  if (post.passwordHash && (await sha256(input)) !== post.passwordHash) {
    alert("haha salah.");
    return;
  }

  fetch(actualFilename)
    .then(res => {
      if (!res.ok) throw new Error('Failed to load post.');
      return res.text();
    })
    .then(txt => {
      document.getElementById('bio').style.display = 'none';
      const postContent = document.getElementById('post-content');
      postContent.style.display = 'block';
      document.getElementById('site-name-top').style.display = 'block';
      document.getElementById('post-title').textContent = post.title || '';
      document.getElementById('post-body').textContent = txt;
    })
    .catch(() => {
      document.getElementById('bio').style.display = 'block';
      document.getElementById('post-content').style.display = 'none';
      alert('Error loading post.');
    });
}

async function handleHash() {
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
    const fullPath = `/${folder}/${filename}`;
    const hashedPath = await sha256(fullPath);

    fetch('config.json')
      .then(res => res.json())
      .then(async posts => {
        const matchedPost = posts.find(p => p.fileHash === hashedPath);
        if (!matchedPost) {
          alert('memang takde atau telah dipadam');
          return;
        }
        await loadPost(matchedPost, fullPath);
      })
      .catch(() => alert('jap ada bug pulek.'));
  } else {
    document.getElementById('bio').style.display = 'block';
    document.getElementById('post-content').style.display = 'none';
  }
}
