---
title: "Web Day Out: the web platform is enough"
date: 2026-03-19T00:00:00.000Z
excerpt: "Eight talks, eight speakers, one thread: the native web platform has matured and it's time we trusted it"
slug: web-day-out-the-web-platform-is-enough
---


I spent a day in Brighton at [Web Day Out](https://webdayout.com), a one-day conference curated by [Clearleft](https://clearleft.com/). Eight talks, eight speakers, one thread running through all of them: **the web platform has grown up, and it's time we trusted it**.

What struck me wasn't any single talk — it was the cumulative effect. By the end of the day, I felt like I'd been handed a manifesto written by eight different people. Every speaker, from their own angle, was saying the same thing: stop reaching for the toolbox before you've tried the material.

Here's what I took away.

## Rachel Andrew — A pragmatic guide to browser support

Rachel opened with the kind of talk that reframes how you think about everything that follows. She introduced [**Baseline**](https://web.dev/baseline) — the project she's been working on at Google — as a practical framework for answering the eternal question: *can I use this yet?*

The key insight: Baseline isn't opinionated. It doesn't tell you what to use. It tells you what you don't need to worry about. Anything that's "widely available" (supported across Chrome, Firefox, Safari, Edge for 30 months) is safe. Full stop. No polyfills, no fallbacks, just use it.

But Rachel went further. She laid out a decision-making framework for features *outside* your baseline: What's the fallback? Is there a polyfill? How stable is the spec? Is it on a standards track? Is it in Interop? These aren't abstract questions — they're the questions your team should be asking in sprint planning.

What I loved most was the idea that Baseline lets you **look into the future** of browser support. You can now say "by the time we launch, subgrid will be widely available" and plan accordingly. We've never had that ability across the whole platform before.

## Jemina Abu — I can't believe it's not JavaScript

Jemina brought the energy. Her talk was a tour of native HTML and CSS features that replace JavaScript libraries wholesale — and she started with a story that set the tone perfectly.

Remember when one developer deleted 11 lines of code from npm and broke React, Meta, and Spotify? That's the `left-pad` incident, and Jemina used it to ask a pointed question: Do you actually know what's in your node_modules?*

Then she showed the receipts. Accordions with `<details>` — no JS, accessible out of the box, supported since 2020. Modals with `popover` — focus management, backdrop, top layer, all for free. Theme switchers with `:has()` — no state management library required. Scroll-driven animations with `animation-timeline` — smoother than their JavaScript equivalents because they run on the compositor thread.

The demos were fun, but the underlying message was serious: every library you install is a bet that it will be maintained, that it won't conflict with something else, and that you actually need it. Native elements are a bet on the platform itself.

## Manuel Matuzovic — Breaking with habits

Manuel's talk was the most architecturally ambitious. He took three years of promises he'd made about modern CSS and put them into practice by building a classless CSS framework called Ollie.

The structure was methodical. Five areas where modern CSS changes everything:

**Reset stylesheets.** Manuel argued that in 2026, resets should *improve* browser defaults, not nuke them. Using `:has()`, he makes labels display as blocks when followed by inputs — a better default that requires no classes.

**Cascade layers.** This was the one that clicked for me. `@layer` lets you define specificity buckets upfront: core, third-party, components, utility. Once defined, you never worry about file ordering again. It turns ITCSS from a concept into an enforced architecture.

**Scalable typography.** Using CSS `pow()`, Manuel built a type scale system where changing two custom properties — base size and scale ratio — recalculates every heading on the page. Wild, but elegant.

**Colour with OKLCH and relative colour syntax.** Define four base colours, generate nine variations of each automatically. Change a single hue value and the entire site's palette shifts.

**Component customisation with custom properties as APIs.** Instead of BEM modifiers or utility classes, expose `--card-size` and `--card-axis` as the configuration surface. Custom properties inherit, so setting them on a parent cascades to all children.

The whole thing was a demonstration that CSS is no longer just a styling language — it's a design system runtime.

## Harry Roberts — Build for the web, build on the web, build with the web

Harry’s talk was the emotional core of the day. Part love letter to the platform, part post-mortem on what happens when you ignore it.

He opened with a story about two clients — from unrelated industries, with the same problem. Both lost six to nine months to Next.js framework upgrades. No new features, no business value, just treading water, rebuilding the same thing in a newer version of a tool.

Then the case studies got sharper. A newspaper that migrated to Next.js for “faster second page views” — with an 89% bounce rate. An e-commerce site that replaced 10KB of repeated header/footer HTML with 780KB of JavaScript runtime, crippling $20 Android devices in South Asia. WordPress sites pass Core Web Vitals at 47%, while Next.js sites pass at roughly 27%.

Harry was careful to say this isn’t anti-React. It’s anti-default. The web is a buffet, not a set menu. If you take a framework wholesale, you get the good and the bad. And most of us aren’t solving Facebook-scale problems.

The line that stuck with me: *"All things being equal, doing more work can never be faster."*

## Jake Archibald — Customisable `<select>` and the friends we made along the way

Jake told the story of the `<select>` element — specifically, the 33-year journey to make it stylable. It was part technical deep-dive, part institutional history, and it was brilliant.

The punchline: in 1993, before the `<select>` element even existed, Dave Raggett wrote in an email that the first requirement for a selection menu should be author control over how it appears. It took until 2026 to deliver on that.

But the journey produced so much more than styled selects. The top layer (originally created for the fullscreen API). Popovers. Invoke commands. CSS anchor positioning. Starting styles for animating discrete properties. Each was a foundational piece that had to exist before customisable `<select>` could work.

Jake's walkthrough of anchor positioning was particularly eye-opening. `position-area: bottom span-right` with `position-try: flip-block` and a `calc-size(stretch)` max-height — it sounds complex, but the result is a picker that shrinks, flips, and stays visible as you scroll. All CSS, no JavaScript.

The meta-lesson: the platform builds foundational capabilities that compose into higher-level features. Every “missing” feature is often just a prerequisite that hasn’t shipped yet.

## Aleth Gueguen — Progressive web apps from the trenches

Aleth’s talk was the most practical of the day. She builds professional PWAs for field workers — people in factories, logistics, construction — and her constraints are brutal: unreliable networks, limited battery, devices that might go offline for days.

Her principles were refreshingly simple. One action = one page, served via a service worker from the cache. Data lives in IndexedDB. Event delegation on the top element. DOM mutation instead of re-rendering. Navigate between pages with links.

That’s it. No framework, no router, no state management library. Offline for free.

The share target API demo was a highlight — receiving GPS tracks from other Android apps directly into her PWA, intercepted by the service worker. The file sync mechanism (a ping-pong of messages between page and service worker, checking HEAD requests to avoid duplicates) was battle-tested in real conditions: 80 photos uploaded over a slow island connection in twenty minutes without losing a single file.

Her strongest point: sync status should never be transparent. Users should always know whether their data has been sent, is pending, or has failed. In the field, hiding that information is dangerous.

## Richard Rutter — What's new in web typography

Richard wrote the book on web typography — literally — nine years ago, and used that as his baseline. Everything since then, in 25 minutes.

The practical stuff hit hardest. Font synthesis detection: a tiny script that toggles synthesised bold on and off so you can spot fake bold at a glance. `size-adjust` in `@font-face` to make inline monospace fonts match the body text size without touching `font-size`. `font-size-adjust` to reduce layout shift when web fonts load by matching the fallback font's x-height to the web font.

Variable fonts got a proper showcase. One font file replaces multiple weights and widths, with `font-variation-settings` giving continuous control. The `text-wrap: balance` and `text-wrap: pretty` features for better line breaking — the kind of typographic refinement that used to require manual intervention.

But the theme kept returning: these features have been there for years, quietly improving. Most developers just haven't noticed. Typography on the web is no longer a compromise — it's a craft medium.

## Lola Odelola — The browser is the playground

Lola closed the day by doing something none of the other speakers did: she opened the browser's source code.

Starting from her earlier work on alt text as a primary image experience, she built a `prefers-alt-text` media query in a fork of Firefox. Not because it should ship — she was explicit that it probably shouldn't — but to understand what happens when an idea moves from concept to implementation.

The technical journey was fascinating. A YAML file for static preferences. A CSS rule (`image-painting: alt-text`) requiring coordination between Gecko's C++ layout engine and Stylo's Rust CSS engine. A media query definition that needed atoms, enums, and keyword evaluators across both systems.

But the real lesson was about fingerprinting. A `prefers-alt-text` media query would let developers infer that a user has a disability — a massive privacy violation under W3C principles. Even preventing image downloads (to save bandwidth) would create a network fingerprint. The feature that looks good on the surface crumbles under privacy analysis.

Lola's closing point reframed the whole day: **not all good ideas are good ideas**. The W3C's priority of constituencies puts end users before developers, developers before browsers, and browsers before specs. Sometimes, the best thing the platform can do is *not* add a feature.

## The thread

Eight talks, one theme. The web platform in 2026 is not the one in 2016. CSS has cascade layers, container queries, anchor positioning, `:has()`, `@starting-style`, scroll-driven animations, OKLCH colour, and pow(). HTML includes `<details>`, popovers, a customisable `<select>`, and the share target API. The browser has a top layer, service workers that can sync files over unreliable connections, and IndexedDB that stores hundreds of photos for a year.

The question isn’t whether the platform is capable. It’s whether we’ll trust it.

Every speaker, from their own corner, was saying: the cost of abstraction is real — in bundle size, in upgrade cycles, in accessibility gaps, in battery drain, in privacy risk. The platform keeps getting better, but only if we use it.

I left Brighton feeling like I’d been given permission to simplify. Not to be clever, not to be cutting-edge, but to be close to the metal. To build for the web, on the web, with the web.

And honestly? That felt like enough.
