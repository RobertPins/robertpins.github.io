// Video page: click a card to play it in a large player over the page.
// Close with "close", Esc, or by clicking the dark area. Closing stops playback.
// Cards with no YouTube or Vimeo ID show a "no signal" placeholder screen.
// Each card is also a plain link to YouTube, so it still works if this script doesn't load.

(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll(".video-card"));
  var box = document.querySelector(".vbox");
  if (!cards.length || !box || typeof box.showModal !== "function") return;

  var frame = box.querySelector(".vb-frame");
  var title = box.querySelector(".vb-title");
  var logline = box.querySelector(".vb-logline");
  var opener = null;

  function embedUrl(card) {
    var yt = (card.dataset.youtube || "").trim();
    var vm = (card.dataset.vimeo || "").trim();
    if (yt) return "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(yt) +
                   "?autoplay=1&rel=0&playsinline=1";
    if (vm) return "https://player.vimeo.com/video/" + encodeURIComponent(vm) +
                   "?autoplay=1&dnt=1";
    return "";
  }

  function open(card) {
    opener = card;
    var url = embedUrl(card);
    frame.innerHTML = "";
    if (url) {
      var iframe = document.createElement("iframe");
      iframe.src = url;
      iframe.title = card.dataset.title || "Video";
      iframe.allow = "autoplay; fullscreen; picture-in-picture; encrypted-media";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      frame.appendChild(iframe);
    } else {
      var ph = document.createElement("div");
      ph.className = "vb-placeholder";
      ph.innerHTML = "<span>video plays here</span>";
      frame.appendChild(ph);
    }
    title.textContent = card.dataset.title || "";
    logline.textContent = card.dataset.logline || "";
    box.showModal();
  }

  cards.forEach(function (card) {
    card.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;   // let Cmd-click open YouTube in a new tab
      e.preventDefault();
      open(card);
    });
  });

  box.querySelector(".lb-close").addEventListener("click", function () { box.close(); });
  box.addEventListener("click", function (e) {
    if (e.target === box || e.target.classList.contains("vb-stage")) box.close();
  });

  box.addEventListener("close", function () {
    frame.innerHTML = "";               // removing the player stops the video
    if (opener) opener.focus({ preventScroll: true });
  });
})();
