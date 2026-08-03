// Video player + live chat: load the YouTube IFrame API and create the
// player. Chat is only loaded once the player confirms the video ID is
// valid (onReady) — otherwise the chat iframe would end up requesting
// live_chat for a broken video ID and showing YouTube's own error page.
// If the player never loads (timeout) or errors out, both panels fall
// back to their own offline placeholders instead.
(function () {
  var LOAD_TIMEOUT_MS = 8000;
  var streamLayout = document.querySelector(".stream-layout");
  var chatContainer = document.getElementById("chat-container");
  var loadTimer = setTimeout(showOffline, LOAD_TIMEOUT_MS);
  var chatLoaded = false;

  function clearLoadTimer() {
    if (loadTimer) {
      clearTimeout(loadTimer);
      loadTimer = null;
    }
  }

  function showOffline() {
    clearLoadTimer();
    streamLayout.dataset.state = "offline";
  }

  function loadChat() {
    if (chatLoaded) return;
    chatLoaded = true;

    var hostname = window.location.hostname || "localhost";
    var iframe = document.createElement("iframe");
    iframe.src =
      "https://www.youtube.com/live_chat?v=" +
      encodeURIComponent(CONFIG.videoId) +
      "&embed_domain=" +
      encodeURIComponent(hostname);
    iframe.title = "Live chat";
    iframe.setAttribute("frameborder", "0");
    chatContainer.appendChild(iframe);
  }

  window.onYouTubeIframeAPIReady = function () {
    new YT.Player("yt-player", {
      videoId: CONFIG.videoId,
      playerVars: { autoplay: 1, mute: 1, playsinline: 1 },
      events: {
        onReady: function () {
          clearLoadTimer();
          streamLayout.dataset.state = "ready";
          loadChat();
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
