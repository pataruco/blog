---
title: "Good flag great flag: rebuilding a flag design quiz from Express.js to Web"
date: 2026-03-15T00:00:00.000Z
excerpt: "How I rebuilt a vexillology quiz app from a Node/Express/MongoDB stack to a modern static website using Vite MPA, TypeScript, Web Components, and vanilla CSS — with WCAG 2.2 AAA accessibility throughout."
slug: good-flag-great-flag
---

## The origin story

Back in 2016, a student named [Ciaran McLoughlin](https://www.linkedin.com/in/ciaranworkswonders/) built a flag design quiz as their final project on the Front End Web Development course I was teaching at General Assembly in London. The app was inspired by [Roman Mars' TED talk][ted-talk] about vexillology — the study of flags — and the [North American Vexillological Association's][nava] (NAVA) 5 principles of good flag design.

The original stack was [Node](https://nodejs.org/en), [Express](https://expressjs.com/), [MongoDB](https://www.mongodb.com/), [jQuery](https://jquery.com/), and [Sass](https://sass-lang.com/). It did the job, but it was a product of its time. Almost a decade later, I decided to rebuild it from scratch.

## Why rebuild?

The old app needed a running server and a database just to serve what was essentially static content with a bit of interactivity. In retrospect, as a junior developer, I used the excuse to play with tools: the flag data was seeded into MongoDB, the views were [EJS](https://ejs.co/) templates, and jQuery handled the DOM. None of that complexity was necessary.

I wanted something that:

- Could be deployed as a static site on GitHub Pages
- Used zero runtime dependencies
- Was fully accessible at WCAG 2.2 AAA level
- Took advantage of modern platform APIs

## 250 flags, evaluated by hand

The quiz draws from a dataset of 250 countries and territories sourced from the [REST Countries API][rest-countries]. Each flag was evaluated against the 5 <a href="https://www.nava.org/"><abbr title="North American Vexillological Association">NAVA</abbr></a> principles to determine the `goodFlag` boolean:

1. Keep it Simple: can a child draw it from memory?
2. Use Meaningful Symbolism: do the images and colours relate to what it represents?
3. Use 2–3 Basic Colours: are the colours limited and contrasting?
4. No Lettering or Seals: is it free of text and organisational seals?
5. Be Distinctive or Be Related: is it unique or intentionally similar to related flags?

A pattern emerged: most British Overseas Territories (Anguilla, Bermuda, Cayman Islands, Falklands, Montserrat) fail because they share the Blue Ensign pattern — a blue field with the Union Jack in the canton plus a territorial coat of arms. They violate principles 1, 4, and 5 simultaneously. Meanwhile, French territories using the tricolor pass, because the tricolor itself is a well-designed flag.

The names use the official English form from the API — "Swiss Confederation" rather than "Switzerland", "Hellenic Republic" rather than "Greece".

## The new stack

The rebuild uses a deliberately minimal set of tools:

- Vite in MPA mode: four HTML entry points, no SPA routing
- TypeScript in strict mode: type safety without a framework
- Vanilla CSS: native nesting, custom properties, `clamp()` for fluid sizing
- Web Components with Shadow DOM — for the site header and principle cards
- [REST Countries API][rest-countries]: SVG flags fetched at runtime, no local assets to maintain
- GitHub Pages — deployed via a single GitHub Actions workflow

No React. No Tailwind. No component library. Just the platform.

## Web Components for encapsulation

The site has two custom elements: `<site-header>` and `<principle-card>`. Both use Shadow DOM to encapsulate their styles.

The header component handles responsive navigation. On mobile, the nav list uses the [Popover API][popover-api] (`popover="auto"`) for light-dismiss behaviour — tap outside and it closes. On desktop, the nav is always visible inline.

This led to an interesting bug during the rebuild. The `popover="auto"` attribute applies a UA stylesheet rule of `display: none` when the popover is not open. On desktop, where I was hiding the hamburger button via CSS, the nav was invisible because nothing was toggling the popover open.

Author-origin CSS overrides UA-origin regardless of specificity — the cascade was on my side.

The principle cards are configured entirely through HTML attributes:

```html
<principle-card
  order="1"
  card-title="Keep it Simple"
  subtitle="The flag should be so simple that a child can draw it from memory"
  explanation="Flags flap and drape..."
  bg-color="#1a237e"
  card-color="#f57f17"
  text-color="#000000"
></principle-card>
```

All text content is set via `textContent` (never `innerHTML`) and colours are applied as CSS custom properties. The component sets `role="region"` and `aria-label` for accessibility.

## Accessibility as a baseline

I ran a full WCAG 2.2 AAA audit across every page and component. Some highlights:

- **Contrast ratios:** AAA requires 7:1 for normal text and 4.5:1 for large text.
- **Target sizes:** Every interactive element meets the 44×44px minimum ([WCAG 2.5.5](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)). Nav links, quiz buttons, and the hamburger menu all have explicit `min-height: 44px`.
- **Reduced motion:** A `prefers-reduced-motion` media query disables transitions and animations for users who request it.
- **Heading hierarchy:** A strict `h1` → `h2` → `h3` → `h4` structure. The principle cards use `h3`/`h4` to sit properly within the page hierarchy.

## What I learnt

The modern web platform is remarkably capable. [Shadow DOM](https://mdn.io/shadowdom), the [Popover API](https://mdn.io/popoverapi), native CSS nesting, `clamp()`, `container` queries — these features eliminate entire categories of tooling that were once essential. The total JavaScript shipped is under 25KB gzipped across the entire site.

Building for AAA accessibility from the start is easier than retrofitting it. The contrast requirements pushed me toward a bolder, more intentional colour palette. The target size requirements made the UI more usable for everyone. The heading hierarchy forced a clearer content structure.

Sometimes the best architecture is the simplest one. Four HTML files, a handful of TypeScript modules, one CSS file, and two Web Components. That's the whole app.

You can try the quiz at [pataruco.github.io/good-flag-great-flag][live-site].

## PS

Please check the source code on [https://github.com/pataruco/good-flag-great-flag](https://github.com/pataruco/good-flag-great-flag)

[ted-talk]: https://www.youtube.com/watch?v=pnv5iKB2hl4
[nava]: https://nava.org/
[popover-api]: https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
[rest-countries]: https://restcountries.com/
[live-site]: https://pataruco.github.io/good-flag-great-flag/
