// Video player: load the YouTube IFrame API, create the player, and fall
// back to the offline placeholder if it errors out or never loads.
(function () {
  var LOAD_TIMEOUT_MS = 8000;
  var wrapper = document.getElementById("video-wrapper");
  var loadTimer = setTimeout(showOffline, LOAD_TIMEOUT_MS);

  function clearLoadTimer() {
    if (loadTimer) {
      clearTimeout(loadTimer);
      loadTimer = null;
    }
  }

  function showOffline() {
    clearLoadTimer();
    wrapper.dataset.state = "offline";
  }

  window.onYouTubeIframeAPIReady = function () {
    new YT.Player("yt-player", {
      videoId: CONFIG.videoId,
      playerVars: { autoplay: 1, mute: 1, playsinline: 1 },
      events: {
        onReady: function () {
          clearLoadTimer();
          wrapper.dataset.state = "ready";
        },
        onError: showOffline
      }
    });
  };

  var apiTag = document.createElement("script");
  apiTag.src = "https://www.youtube.com/iframe_api";
  apiTag.onerror = showOffline;
  document.head.appendChild(apiTag);
})();

// Live chat: build the embed URL from the current hostname so it works
// on whatever domain the page ends up served from.
(function () {
  var container = document.getElementById("chat-container");
  var hostname = window.location.hostname || "localhost";
  var iframe = document.createElement("iframe");
  iframe.src =
    "https://www.youtube.com/live_chat?v=" +
    encodeURIComponent(CONFIG.videoId) +
    "&embed_domain=" +
    encodeURIComponent(hostname);
  iframe.title = "Live chat";
  iframe.setAttribute("frameborder", "0");
  container.appendChild(iframe);
})();

// Timeline: render the hand-edited TIMELINE_EVENTS list in order.
(function () {
  var list = document.getElementById("timeline-list");
  var frag = document.createDocumentFragment();

  TIMELINE_EVENTS.forEach(function (event) {
    var item = document.createElement("li");
    item.className = "timeline-item";

    var date = document.createElement("span");
    date.className = "timeline-date";
    date.textContent = event.date;

    var text = document.createElement("span");
    text.className = "timeline-text";
    text.textContent = event.text;

    item.appendChild(date);
    item.appendChild(text);
    frag.appendChild(item);
  });

  list.appendChild(frag);
})();
