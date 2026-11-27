// Cinematography gallery: click a still to view it large.
// Close with the "close" button, Esc, or by clicking the dark area.
// Arrow keys (or swiping on a phone) move between stills.

(function () {
  var stills = Array.prototype.slice.call(document.querySelectorAll(".still"));
  var box = document.querySelector(".lightbox");
  if (!stills.length || !box || typeof box.showModal !== "function") return;

  var img = box.querySelector(".lb-img");
  var count = box.querySelector(".lb-count");
  var current = 0;

  function show(n) {
    current = (n + stills.length) % stills.length;
    var thumb = stills[current].querySelector("img");
    img.src = thumb.currentSrc || thumb.src;
    img.alt = thumb.alt;
    count.textContent = (current + 1) + " / " + stills.length;
    // warm up the neighbours so arrowing through feels instant
    [current + 1, current - 1].forEach(function (k) {
      var t = stills[(k + stills.length) % stills.length].querySelector("img");
      new Image().src = t.currentSrc || t.src;
    });
  }

  stills.forEach(function (button, n) {
    button.addEventListener("click", function () {
      show(n);
      box.showModal();
    });
  });

  box.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
  box.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
  box.querySelector(".lb-close").addEventListener("click", function () { box.close(); });

  // clicking the empty dark area closes it
  box.addEventListener("click", function (e) {
    if (e.target === box || e.target.classList.contains("lb-frame")) box.close();
  });

  box.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { e.preventDefault(); show(current + 1); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); show(current - 1); }
  });

  // swipe on touch screens
  var startX = null;
  box.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });

  // return focus to the still you opened
  box.addEventListener("close", function () { stills[current].focus({ preventScroll: true }); });
})();
