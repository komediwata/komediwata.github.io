
const postList = document.getElementById('post-list');
const content = document.getElementById('post-content');

function toggleNight() {
  document.body.classList.toggle('night');
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
    .then(res => res.text())
    .then(txt => content.textContent = txt)
    .catch(() => content.textContent = 'Error loading post.');
}

fetch("config.json")
  .then(res => res.json())
  .then(posts => {
    posts.forEach(post => {
      const link = document.createElement("div");
      link.textContent = post.title;
      link.className = "post-link";
      link.onclick = () => loadPost(post);
      postList.appendChild(link);
    });
  });
