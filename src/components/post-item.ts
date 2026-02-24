class PostItem extends HTMLElement {
  connectedCallback() {
    if (!this.innerHTML.trim()) {
      this.render();
    }
  }

  render() {
    const title = this.getAttribute('title');
    const date = this.getAttribute('date');
    const excerpt = this.getAttribute('excerpt');
    const path = this.getAttribute('path');

    if (!title || !date || !path) return;

    const formattedDate = new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'full',
    }).format(new Date(date));

    this.innerHTML = `
      <article class="entry">
        <a href="/blog/${path}">
          <h2>${title}</h2>
        </a>
        <p>${excerpt || ''}</p>
        <footer class="meta">
          <time datetime="${date}">${formattedDate}</time>
        </footer>
      </article>
    `;
  }
}

customElements.define('post-item', PostItem);
