class MyFooter extends HTMLElement {
  connectedCallback() {
    this.render();
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
              <a href="https://github.com/pataruco">GitHub</a> <br />
              <a href="https://bsky.app/profile/pataruco.dev">Bluesky</a> <br />
              <a href="https://pataruco.dev/rss.xml">RSS</a>
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
    const buildTime = this.getAttribute('build-time');
    const date = buildTime ? new Date(Number(buildTime)) : new Date();
    const timestampEl = this.querySelector('#timestamp');
    if (timestampEl) {
      const timeEl = document.createElement('time');
      timeEl.setAttribute('datetime', date.toISOString());
      timeEl.textContent = new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        month: 'long',
        timeZone: 'Europe/London',
        timeZoneName: 'short',
        year: 'numeric',
        hour12: true,
      }).format(date);
      timestampEl.textContent = 'Updated on: ';
      timestampEl.appendChild(timeEl);
    }
  }
}

customElements.define('my-footer', MyFooter);
