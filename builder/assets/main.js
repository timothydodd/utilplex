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

  // Output-pane affordances. An output pane is any pane whose head actions
  // include a copy button — that marks it as a generated result the user may
  // want to read full-width or with wrapping turned off. We inject the toggles
  // here rather than in every tool-body template so all tools get them.
  function mkBtn(label, pressed) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "btn";
    b.textContent = label;
    b.setAttribute("aria-pressed", pressed ? "true" : "false");
    return b;
  }

  function isWrapped(target) {
    if (!target) return true;
    if (target.__upEditor) return true; // CM output wraps by default
    return getComputedStyle(target).whiteSpace.indexOf("pre-wrap") === 0;
  }

  function setWrap(target, on) {
    if (!target) return;
    if (target.__upEditor) { target.__upEditor.setWrap(on); return; }
    target.classList.toggle("up-wrap", on);
    target.classList.toggle("up-nowrap", !on);
  }

  document.querySelectorAll(".editor-pane-head-actions").forEach(function (actions) {
    var copyBtn = actions.querySelector("[data-copy-target]");
    if (!copyBtn) return;
    var target = document.querySelector(copyBtn.getAttribute("data-copy-target"));
    if (!target) return;
    var pane = actions.closest(".editor-pane");
    var panes = pane && pane.closest(".editor-panes");

    // Wrap toggle — flips word wrapping on the output.
    var wrapped = isWrapped(target);
    var wrapBtn = mkBtn(wrapped ? "No wrap" : "Wrap", wrapped);
    wrapBtn.addEventListener("click", function () {
      wrapped = !wrapped;
      setWrap(target, wrapped);
      wrapBtn.setAttribute("aria-pressed", wrapped ? "true" : "false");
      wrapBtn.textContent = wrapped ? "No wrap" : "Wrap";
    });
    actions.insertBefore(wrapBtn, actions.firstChild);

    // Focus toggle — only when this output shares an .editor-panes grid with
    // an input pane; collapses the input so the output fills the width.
    if (panes && panes.querySelector("#input") && pane.querySelector("#input") === null) {
      pane.classList.add("is-output");
      var solo = false;
      var focusBtn = mkBtn("Focus", false);
      focusBtn.addEventListener("click", function () {
        solo = !solo;
        panes.classList.toggle("is-solo-output", solo);
        focusBtn.setAttribute("aria-pressed", solo ? "true" : "false");
        focusBtn.textContent = solo ? "Split" : "Focus";
      });
      actions.insertBefore(focusBtn, actions.firstChild);
    }
  });
})();
