document.addEventListener('DOMContentLoaded', function() {
  const postForm = document.getElementById('postForm');
  const editForm = document.getElementById('editForm');
  const postsContainer = document.getElementById('posts');

  function fetchPosts() {
    fetch('/posts')
      .then(response => response.json())
      .then(posts => {
        postsContainer.innerHTML = '';
        posts.forEach(post => {
          const postElement = document.createElement('div');
          postElement.classList.add('post');
          postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            <button onclick="deletePost(${post.id})">Delete</button>
            <button onclick="editPost(${post.id}, '${post.title}', '${post.content}')">Edit</button>
          `;
          postsContainer.appendChild(postElement);
        });
      });
  }

  postForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    fetch('/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    }).then(response => response.json())
      .then(() => {
        postForm.reset();
        fetchPosts();
      });
  });

  window.deletePost = function(id) {
    fetch(`/posts/${id}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(() => fetchPosts());
  };

  window.editPost = function(id, title, content) {
    document.getElementById('editId').value = id;
    document.getElementById('editTitle').value = title;
    document.getElementById('editContent').value = content;
    editForm.style.display = 'flex';
    postForm.style.display = 'none';
  };

  window.cancelEdit = function() {
    editForm.style.display = 'none';
    postForm.style.display = 'flex';
  };

  editForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    const title = document.getElementById('editTitle').value;
    const content = document.getElementById('editContent').value;

    fetch(`/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    }).then(response => response.json())
      .then(() => {
        editForm.reset();
        editForm.style.display = 'none';
        postForm.style.display = 'flex';
        fetchPosts();
      });
  });

  fetchPosts();
});
