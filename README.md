# Astoria Pigeon Nest Cam

A static page for a live YouTube stream of a pigeon nest, plus its chat and a
manually-updated timeline. Plain HTML/CSS/JS, no build step.

## Update the video when you start a new broadcast

Open `config.js` and paste the video ID from the stream's URL:

```
https://www.youtube.com/watch?v=THIS_PART
```

```js
const CONFIG = {
  videoId: "THIS_PART"
};
```

This one value drives both the video player and the live chat.

## Add a timeline event

Open `timeline.js` and append a line to the bottom of the `TIMELINE_EVENTS`
array:

```js
{ date: "Month Day, Year", text: "What happened" },
```

Entries render in the order they appear in the array (oldest first).

## Known limitation

The live chat iframe only shows real content when the video is actually
live *and* the page is served from the real domain it will end up hosted
on (chat checks the page's domain against the video). Opening `index.html`
locally (`file://` or `localhost`) is fine for checking the video player
and layout, but chat won't authenticate there — that's expected.

## Deploy to GitHub Pages

1. Create a GitHub repository and push this project to it.
2. In the repo, go to **Settings → Pages**.
3. Under "Build and deployment", set Source to **Deploy from a branch**,
   then pick the `main` branch and the `/ (root)` folder.
4. GitHub will publish the site at your repo's Pages URL (this can take a
   few minutes on the first deploy). No build step or Jekyll config needed.
