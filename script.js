
const posts = [
  { file: 'posts/post1.txt', title: 'Post 1', password: null },
  { file: 'posts/secret.txt', title: 'Secret Post', password: '1234' }
];

const postList = document.getElementById('post-list');
const content = document.getElementById('post-content');

posts.forEach(post => {
  const link = document.createElement('div');
  link.textContent = post.title;
  link.className = 'post-link';
  link.onclick = () => loadPost(post);
  postList.appendChild(link);
});

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
