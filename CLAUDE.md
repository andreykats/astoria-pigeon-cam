# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A static single-page site showing a live YouTube stream of a pigeon nest (in a planter box in Astoria), its live chat, and a manually-updated timeline of nest events. Plain HTML/CSS/vanilla JS — no framework, no bundler, no build step, no package.json, no tests.

## Running locally

Open `index.html` directly (`file://`) or serve the directory with any static file server — there is no install/build step. The YouTube live chat iframe only authenticates when served from the site's real production domain (it checks `embed_domain` against the video), so chat won't show content when opened via `file://` or `localhost` — that's expected, not a bug. The video player itself works fine locally.

## Editing content

- **Change the live stream**: edit `config.js`, set `CONFIG.videoId` to the ID from the broadcast's YouTube URL (the `?v=` part). This one value drives both the video player and the live chat iframe.
- **Add a nest timeline event**: append `{ date: "Month Day, Year", text: "..." }` to `TIMELINE_EVENTS` in `timeline.js`. Entries render in array order (oldest first).

## Architecture

Everything lives flat at repo root. Scripts load in dependency order at the end of `<body>` in `index.html`: `config.js` → `timeline.js` → `main.js` (`main.js` reads the `CONFIG` and `TIMELINE_EVENTS` globals the first two define).

**Video + chat state machine** (`main.js`): the YouTube IFrame Player API is loaded dynamically and a player is created targeting `#yt-player`. A `data-state` attribute (`loading` / `ready` / `offline`) on `.stream-layout` drives which overlay CSS shows for both the video and chat panels. An 8s timeout forces `offline` if the player never fires `onReady`/`onError`.

**Chat is intentionally not loaded until the player's `onReady` fires** — loading it eagerly against an invalid `videoId` would show YouTube's own error page inside the iframe, so the site shows its own "Chat unavailable" placeholder until the video is confirmed playable. Once ready, `loadChat()` builds a `youtube.com/live_chat?v=...&embed_domain=...` URL and injects it as an iframe into `#chat-container`.

**Nest timeline** (`main.js` + `timeline.js`): `TIMELINE_EVENTS` renders into `#timeline-list` as `<li class="timeline-item">` elements. The responsive layout is pure CSS: a vertical list with a left rail below 900px, a horizontally-scrolling flex row with a top rail above 900px (`style.css`, `@media (min-width: 900px)`). The same 900px breakpoint also switches the stream/chat layout from stacked to side-by-side.

All icons/illustrations are inline SVG in `index.html` (plus a data-URI SVG favicon) — there are no image assets or asset directories in the repo.

## Deployment

GitHub Pages: repo Settings → Pages → Source "Deploy from a branch" → `main` / `/ (root)`. No CI/CD, no build step.
