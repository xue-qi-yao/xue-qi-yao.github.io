// Progressive disclosure for the home-page news list.
//
// One centred chevron: pointing down it reveals another batch, and once every
// item is visible it flips up and collapses back to the initial batch.
//
// Every item is rendered server-side, so expanding costs no page load. The rows
// carry `hidden` from the server; if this script never runs the list simply
// stays collapsed rather than breaking.
(function () {
  function setup(root) {
    var batch = parseInt(root.getAttribute("data-news-batch"), 10) || 5;
    var rows = Array.prototype.slice.call(root.querySelectorAll(".news-row"));
    var toggle = root.querySelector(".news-toggle");
    if (!toggle || rows.length <= batch) return;

    var icon = toggle.querySelector("i");
    var shown = batch;

    function apply() {
      rows.forEach(function (row, i) {
        row.hidden = i >= shown;
      });

      var expanded = shown >= rows.length;
      icon.classList.toggle("fa-chevron-down", !expanded);
      icon.classList.toggle("fa-chevron-up", expanded);
      toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
      toggle.setAttribute("aria-label", expanded ? "Collapse news" : "Show more news");
    }

    toggle.addEventListener("click", function () {
      shown = shown >= rows.length ? batch : Math.min(shown + batch, rows.length);
      apply();
    });

    apply();
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll(".news[data-news-batch]"), setup);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
