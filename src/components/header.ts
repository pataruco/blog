class MyHeader extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  attachEvents() {
    const toggle = this.querySelector('.navigation-toggle');
    toggle?.addEventListener('click', () => {
      this.querySelector('header')?.classList.toggle('has-nav');
    });
  }

  render() {
    const path = window.location.pathname;
    this.innerHTML = `
      <header>
        <div class="header">
          <a href="/" title="Pedro Martin Valera" class="branding">
            <img src="/logo.svg" alt="Pedro Martin Valera" width="197" height="64">
          </a>
          <button
            type="button"
            aria-label="Toggle navigation"
            class="navigation-toggle"
          >
            menu
          </button>
        </div>
        <nav class="navigation">
          <ul class="navigation-menu mask-links">
            <li class="${path.startsWith('/blog') ? 'is-active' : ''}">
              <a href="/blog/">Blog</a>
            </li>
          </ul>
        </nav>
      </header>
    `;

    this.attachEvents();
  }
}

customElements.define('my-header', MyHeader);
