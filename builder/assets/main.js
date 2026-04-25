// Site-wide chrome. Tool-specific behavior lives in tools/<entry>.js.
(function () {
  // Theme toggle
  var btn = document.querySelector("[data-theme-toggle]");
  if (btn) {
    btn.addEventListener("click", function () {
      var root = document.documentElement;
      var dark = root.classList.toggle("dark");
      try { localStorage.setItem("up-theme", dark ? "dark" : "light"); } catch (e) {}
    });
  }

  // Element-or-CM aware read/write. Mirrors tools/src/_helpers.js so
  // generic data-attribute handlers work regardless of pane type.
  function read(t) {
    if (!t) return "";
    if (t.__upEditor) return t.__upEditor.getValue();
    if ("value" in t) return t.value;
    return t.textContent || "";
  }
  function write(t, v) {
    if (!t) return;
    if (t.__upEditor) { t.__upEditor.setValue(v); return; }
    if ("value" in t) {
      t.value = v;
      t.dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }
    t.textContent = v;
  }

  // <button data-copy-target="#id-of-source">
  document.querySelectorAll("[data-copy-target]").forEach(function (b) {
    b.addEventListener("click", function () {
      var target = document.querySelector(b.getAttribute("data-copy-target"));
      if (!target) return;
      var text = read(target);
      navigator.clipboard.writeText(text).then(function () {
        var orig = b.getAttribute("data-label-default") || b.textContent;
        b.textContent = "Copied";
        setTimeout(function () { b.textContent = orig; }, 1200);
      }).catch(function () {});
    });
  });

  // <button data-clear-target="#id">
  document.querySelectorAll("[data-clear-target]").forEach(function (b) {
    b.addEventListener("click", function () {
      var target = document.querySelector(b.getAttribute("data-clear-target"));
      write(target, "");
    });
  });
})();
