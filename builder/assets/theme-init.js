// Inlined into <head> so the dark class is set before first paint.
// Reads ?theme override → localStorage → prefers-color-scheme.
(function () {
  try {
    var stored = localStorage.getItem("up-theme");
    var prefers = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var dark = stored ? stored === "dark" : prefers;
    if (dark) document.documentElement.classList.add("dark");
  } catch (e) { /* private mode etc. — fall back to light */ }
})();
