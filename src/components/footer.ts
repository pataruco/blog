class MyFooter extends HTMLElement {
  connectedCallback() {
    if (!this.innerHTML.trim()) {
      this.render();
    }
  }

  render() {
    this.innerHTML = `
      <footer class="footer">
        <a href="/" title="Pedro Martin Valera" class="branding">
            <img src="/logo.svg" alt="Pedro Martin Valera" width="197" height="64">
        </a>
        <div class="footer-sections | mask-links">
          <div>
            <h3 class="size-md font-bold">Follow me</h3>
            <p>
              <a href="https://www.linkedin.com/in/pataruco/">LinkedIn</a> <br />
              <a href="https://github.com/pataruco">GitHub</a>
            </p>
          </div>
          <div>
            <h3 class="size-md font-bold">Contact me</h3>
            <p>
              <a href="mailto:hola@pataruco.dev">hola@pataruco.dev</a>
            </p>
          </div>
        </div>
        <p class="timestamp" id="timestamp"></p>
      </footer>
    `;
    this.updateTimestamp();
  }

  updateTimestamp() {
    const now = new Date();
    const timestampEl = this.querySelector('#timestamp');
    if (timestampEl) {
      timestampEl.innerHTML = `Updated on: <time datetime="${now.toISOString()}">${new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        month: 'long',
        timeZone: 'Europe/London',
        timeZoneName: 'short',
        year: 'numeric',
        hour12: true,
      }).format(now)}</time>`;
    }
  }
}

customElements.define('my-footer', MyFooter);
