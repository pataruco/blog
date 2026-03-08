---
title: "El Guacal"
date: 2026-02-24T00:00:00.000Z
excerpt: "For over 7.9 million Venezuelans living abroad, finding a taste of home can feel impossible. El Guacal is an open-source, crowdsourced map of Venezuelan product locations around the world — built with Rust, PostGIS, and React, and powered by the people who need it most. This is the story of why I built it, the technical decisions behind it, and what comes next."
slug: el-guacal
---

When you leave your country, you carry it with you in unexpected ways. The smell of arepas on a Sunday morning, the taste of Maltín Polar, the sound of a mother asking, “Did you eat?” For over 7.9 million Venezuelans living abroad, these sensory memories are both a comfort and a quiet ache.

El Guacal started from a simple, personal question: *where can I find Harina P.A.N. near me?*

## Why “El Guacal”?

In Venezuela, a guacal is a wooden crate used to transport fruit, vegetables, and goods. It is a humble object, deeply embedded in the country’s commercial culture. Markets, street vendors, and family kitchens all revolve around it. Naming this project “El Guacal” felt right: it is a vessel for carrying something familiar across borders.

## The personal motive

Migration is not just a change of address. It is learning to navigate a new supermarket where nothing looks like what you grew up with. It is explaining to a colleague what cachapa is. It is the specific sadness of craving tequeños at midnight, knowing that nowhere nearby sells them.

I built El Guacal because I have lived this. The Venezuelan displacement crisis, one of the largest in the world, has scattered our people across every continent. Roughly 20 to 30 per cent of the country’s population now lives outside its borders. Each of us, at some point, has stood in a foreign aisle wondering where to find a taste of home.

This is not a problem that one person can solve. The Venezuelan commercial footprint is vast and constantly shifting: new abastos open, restaurants close, Tesco starts stocking Harina P.A.N. in Lewisham but not in Hackney. The only way to keep track is to ask the community. That is the heart of El Guacal: crowdsourced knowledge from the people who need it most.

# How it works

El Guacal is an open-source (GitHub repository)[https://github.com/pataruco/el-guacal], crowdsourced database of Venezuelan product locations worldwide. Anyone can browse the map without an account. If you want to add a store, edit a listing, or report a closure, you sign in and contribute. The data belongs to everyone: it is exported daily as open datasets (JSON and CSV) published automatically as GitHub [releases](https://github.com/pataruco/el-guacal/releases).

The initial dataset started with over 60 stores across the UK, from Brixton Market in south London to Lupe Pintos in Edinburgh, from Spanglish Tiendita in Newcastle to Worldwide Foods in Manchester. Every single one was seeded with Harina P.A.N. by Alimentos Polar, because if you know, you know.

## The technology choices

Building El Guacal meant making deliberate decisions about every layer of the stack. I [documented](https://github.com/pataruco/el-guacal/tree/main/docs/adrs) these through Architecture Decision Records (ADRs) to keep the reasoning transparent.

## Rust for the backend

The API server is written in Rust using the [axum`](https://github.com/tokio-rs/axum) framework. This was not an obvious choice for a side project. Rust has a steep learning curve, and most people would reach for Node.js or Python. But I wanted something fast, reliable, and memory-efficient for a service running on Google Cloud Run, where you pay for what you use. Rust’s compile-time guarantees also mean fewer runtime surprises, which matters when you are a solo maintainer.

The API uses GraphQL (via [`async-graphql`](https://async-graphql.github.io/async-graphql/en/index.html)) because the frontend needs flexible queries: fetch stores near a location, filter by products, and get details for a single store. GraphQL lets the client ask for exactly what it needs.

## PostgreSQL with PostGIS

Geographic queries are the core of this application. “Show me stores within 5km” is not a query you can efficiently answer with a regular database. [PostGIS](https://postgis.net/), the spatial extension for PostgreSQL, handles this natively. Store locations are stored as ``GEOGRAPHY(Point)` types with a GIST index, enabling fast radius-based lookups even as the dataset grows.

## React with Vite and React Router

The frontend is a React application using Vite for bundling and React Router v7 for static site generation. State management uses Redux Toolkit with RTK Query, which generates typed GraphQL hooks from the schema. The map uses Google Maps via [`@vis.gl/react-google-maps`](https://visgl.github.io/react-google-maps/).

## Firebase for auth

Authentication uses Firebase, supporting both Google sign-in and email/password. The interesting part is how the server verifies tokens: rather than calling Firebase on every request, it fetches Google’s public keys once, caches them for an hour, and validates JWTs locally using RS256. This keeps the backend stateless and fast.

For more details on the authentication flow, see [authentication flow](https://github.com/pataruco/el-guacal/blob/main/docs/auth-flow.md).

## Infrastructure as Code

Everything runs on Google Cloud Platform and is defined in Terraform: Cloud SQL for the database, Cloud Run for the API, Artefact Registry for Docker images, and Firebase Hosting for the static frontend. GitHub Actions handles CI/CD, with Workload Identity Federation for secure, secretless deployments.

## Monorepo with Moon

The project is a monorepo managed with [Moon](https://moonrepo.dev/moon), a task runner designed for polyglot repositories. It orchestrates builds across the Rust backend and the TypeScript frontend, managing dependency graphs for tasks such as code generation, testing, and deployment.

## Challenges

### The cold start problem

A crowdsourced database is only useful if it has data. Nobody will visit a map with three pins. To solve this, I manually seeded the database with over 60 stores across the UK, drawing on personal knowledge and community recommendations. It is bootstrap work, but necessary.

### Geographic data is messy.

Addresses are not standardised. Coordinates come from different sources with different precision. Some stores have moved. Some have closed. Building a system that handles this gracefully while keeping data entry simple enough for anyone to contribute is an ongoing tension.

### Internationalisation

El Guacal serves a diaspora spread across dozens of countries. The interface needed to work in both English and Spanish (specifically Venezuelan Spanish, not Castilian). The i18n system uses i18next with automatic browser language detection, falling back to English if no language is detected. Every string in the UI, from form validation messages to navigation labels, is translated.

### Solo maintenance

This is a side project built by one person. Every technology choice carries a maintenance cost. Rust is excellent for reliability, but slower to iterate on than JavaScript. Terraform is powerful but verbose. Firebase is convenient but introduces vendor coupling. Each decision was a trade-off between doing things properly and actually shipping.

### Making it truly open

The daily export pipeline was built to ensure the data never becomes locked inside the application. Every day at midnight UTC, a GitHub Action downloads the full dataset from the API and publishes it as a release. Anyone can download the data without ever touching the app. This is a deliberate commitment to openness: if El Guacal disappeared tomorrow, the data would survive.

## What comes next

El Guacal is a living project. Some of what I am thinking about:

- Expanding beyond the UK. The initial dataset is UK-focused because that is where I live. But the Venezuelan diaspora is everywhere: Colombia, Peru, Chile, Spain, and the United States. The infrastructure supports global coverage; it just needs the data.
- Product coverage. Right now, the database tracks which stores carry which products. The product catalogue needs to expand beyond Harina P.A .N. to include brands such as Mavesa, Savoy, Toddy, and others.

## An invitation

El Guacal is open source. The code is on GitHub. The data is published daily. If you are part of the Venezuelan diaspora and you know where to find our products, you can help by adding stores. If you are a developer and this resonates with you, contributions are welcome.

Because a guacal is not meant to stay empty. It is meant to be filled, carried, and shared.
