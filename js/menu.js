// DVD-style main menu behaviour.
// - Only one item looks selected at a time (mouse and keyboard share it).
// - Arrow keys move the selection, Enter opens it, like a remote.

(function () {
  var links = Array.prototype.slice.call(
    document.querySelectorAll(".menu a")
  );
  if (!links.length) return;

  links.forEach(function (link) {
    link.addEventListener("mouseenter", function () {
      link.focus({ preventScroll: true });
    });
  });

  document.addEventListener("keydown", function (e) {
    var keys = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"];
    if (keys.indexOf(e.key) === -1) return;
    e.preventDefault();
    var i = links.indexOf(document.activeElement);
    var forward = e.key === "ArrowDown" || e.key === "ArrowRight";
    if (i === -1) i = forward ? -1 : 0;
    var next = (i + (forward ? 1 : -1) + links.length) % links.length;
    links[next].focus();
  });
})();
