/* ============================================
   Gedichte deuten – Interaktive Elemente
   Alles läuft lokal im Browser. Gespeichert wird nur im
   localStorage des jeweiligen Geräts, nichts wird übertragen.
   ============================================ */

(function () {
  "use strict";

  var PREFIX = "gi:";

  /* ---------- Speicher (fehlertolerant) ---------- */
  var store = {
    get: function (key) {
      try { return window.localStorage.getItem(PREFIX + key); } catch (e) { return null; }
    },
    set: function (key, value) {
      try { window.localStorage.setItem(PREFIX + key, value); } catch (e) { /* ignorieren */ }
    },
    remove: function (key) {
      try { window.localStorage.removeItem(PREFIX + key); } catch (e) { /* ignorieren */ }
    }
  };

  /* ---------- Navigation (Mobil) ---------- */
  function initNav() {
    var btn = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".site-nav");
    if (!btn || !nav) return;
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- Quiz ---------- */
  function initQuiz() {
    document.querySelectorAll(".quiz .q").forEach(function (q) {
      var fb = q.querySelector(".feedback");
      q.querySelectorAll(".opt").forEach(function (opt) {
        opt.addEventListener("click", function () {
          var right = opt.dataset.correct === "true";
          q.querySelectorAll(".opt").forEach(function (o) { o.classList.remove("correct", "wrong"); });
          opt.classList.add(right ? "correct" : "wrong");
          if (fb) {
            fb.className = "feedback " + (right ? "ok" : "no");
            fb.textContent = (right ? "Richtig. " : "Noch nicht. ") + (opt.dataset.fb || "");
          }
        });
      });
    });
  }

  /* ---------- Zuordnungsübungen ---------- */
  function initMatch() {
    document.querySelectorAll(".match").forEach(function (m) {
      var selects = m.querySelectorAll("select");
      var result = m.querySelector(".result");
      var check = m.querySelector(".check");
      var reset = m.querySelector(".reset");
      if (check) check.addEventListener("click", function () {
        var count = 0;
        selects.forEach(function (s) {
          var ok = s.value === s.dataset.solution;
          s.classList.remove("right", "false");
          s.classList.add(ok ? "right" : "false");
          if (ok) count++;
        });
        if (result) result.textContent = count + " von " + selects.length + " richtig.";
      });
      if (reset) reset.addEventListener("click", function () {
        selects.forEach(function (s) { s.selectedIndex = 0; s.classList.remove("right", "false"); });
        if (result) result.textContent = "";
      });
    });
  }

  /* ---------- Notizfelder automatisch speichern ---------- */
  function initNotes() {
    document.querySelectorAll("textarea[data-save]").forEach(function (t) {
      var key = "note:" + t.dataset.save;
      var saved = store.get(key);
      if (saved !== null) t.value = saved;
      var timer;
      t.addEventListener("input", function () {
        clearTimeout(timer);
        timer = setTimeout(function () { store.set(key, t.value); }, 400);
      });
    });
  }

  /* ---------- Selbstcheck & Fortschritt ---------- */
  function initSelfcheck() {
    document.querySelectorAll(".selfcheck[data-module]").forEach(function (box) {
      var mod = box.dataset.module;
      var boxes = box.querySelectorAll("input[type=checkbox]");
      store.set("total:" + mod, String(boxes.length));
      boxes.forEach(function (cb, i) {
        var key = "check:" + mod + ":" + i;
        cb.checked = store.get(key) === "1";
        cb.addEventListener("change", function () {
          if (cb.checked) store.set(key, "1"); else store.remove(key);
        });
      });
    });

    document.querySelectorAll("[data-progress]").forEach(function (card) {
      var mod = card.dataset.progress;
      var total = parseInt(store.get("total:" + mod) || "0", 10);
      var done = 0;
      for (var i = 0; i < total; i++) if (store.get("check:" + mod + ":" + i) === "1") done++;
      var bar = card.querySelector(".progress span");
      var label = card.querySelector(".progress-label");
      if (total > 0) {
        if (bar) bar.style.width = Math.round(done / total * 100) + "%";
        if (label) label.textContent = "Selbstcheck: " + done + " von " + total;
      } else if (label) {
        label.textContent = "Noch nicht begonnen";
      }
    });

    var resetAll = document.querySelector("#reset-all");
    if (resetAll) resetAll.addEventListener("click", function () {
      if (!window.confirm("Wirklich alle Notizen, Markierungen und Häkchen auf diesem Gerät löschen?")) return;
      try {
        Object.keys(window.localStorage).forEach(function (k) {
          if (k.indexOf(PREFIX) === 0) window.localStorage.removeItem(k);
        });
      } catch (e) { /* ignorieren */ }
      window.location.reload();
    });
  }

  /* ---------- Textmarker im Gedicht ---------- */
  var lastRange = null;

  function rangeInside(container, range) {
    return range && container.contains(range.commonAncestorContainer);
  }

  function textNodesIn(container, range) {
    var nodes = [];
    var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = walker.nextNode())) {
      if (range.intersectsNode(n) && n.nodeValue.length) nodes.push(n);
    }
    return nodes;
  }

  function applyMark(container, range, color) {
    textNodesIn(container, range).forEach(function (node) {
      var start = node === range.startContainer ? range.startOffset : 0;
      var end = node === range.endContainer ? range.endOffset : node.nodeValue.length;
      if (start >= end) return;
      var mid = node;
      if (start > 0) mid = node.splitText(start);
      if (end - start < mid.nodeValue.length) mid.splitText(end - start);
      if (!mid.nodeValue.trim()) return;
      var parent = mid.parentNode;
      if (parent.tagName === "MARK") {
        if (color === "erase") {
          unwrap(parent);
        } else {
          parent.className = color;
        }
        return;
      }
      if (color === "erase") return;
      var mark = document.createElement("mark");
      mark.className = color;
      parent.insertBefore(mark, mid);
      mark.appendChild(mid);
    });
    container.normalize();
  }

  function unwrap(el) {
    var parent = el.parentNode;
    while (el.firstChild) parent.insertBefore(el.firstChild, el);
    parent.removeChild(el);
  }

  function initMarker() {
    var boxes = document.querySelectorAll(".poem-box[data-marker]");
    if (!boxes.length) return;

    document.addEventListener("selectionchange", function () {
      var sel = window.getSelection();
      if (sel && sel.rangeCount && !sel.isCollapsed) lastRange = sel.getRangeAt(0).cloneRange();
    });

    boxes.forEach(function (box) {
      var poem = box.querySelector(".poem");
      var key = "marks:" + box.dataset.marker + ":" + (box.dataset.version || "1");
      var saved = store.get(key);
      if (saved) poem.innerHTML = saved;

      box.querySelectorAll("[data-color]").forEach(function (btn) {
        btn.addEventListener("mousedown", function (e) { e.preventDefault(); });
        btn.addEventListener("click", function () {
          var sel = window.getSelection();
          var range = sel && sel.rangeCount && !sel.isCollapsed ? sel.getRangeAt(0) : lastRange;
          if (!rangeInside(poem, range)) {
            window.alert("Markiere zuerst eine Textstelle im Gedicht und tippe dann auf eine Farbe.");
            return;
          }
          applyMark(poem, range, btn.dataset.color);
          if (sel) sel.removeAllRanges();
          lastRange = null;
          store.set(key, poem.innerHTML);
        });
      });

      var clear = box.querySelector("[data-clear]");
      if (clear) clear.addEventListener("click", function () {
        poem.querySelectorAll("mark").forEach(unwrap);
        poem.normalize();
        store.remove(key);
      });

      var nums = box.querySelector("[data-numbers]");
      if (nums) nums.addEventListener("click", function () {
        poem.classList.toggle("show-all-numbers");
      });
    });
  }

  /* ---------- Glossar-Suche ---------- */
  function initGlossary() {
    var input = document.querySelector(".glossary-search");
    if (!input) return;
    var entries = document.querySelectorAll("dl.glossary dt");
    var count = document.querySelector(".glossary-count");
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      var shown = 0;
      entries.forEach(function (dt) {
        var dd = dt.nextElementSibling;
        var hit = !q || (dt.textContent + " " + dd.textContent).toLowerCase().indexOf(q) !== -1;
        dt.hidden = !hit;
        dd.hidden = !hit;
        if (hit) shown++;
      });
      if (count) count.textContent = shown + " Begriffe";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initQuiz();
    initMatch();
    initNotes();
    initSelfcheck();
    initMarker();
    initGlossary();
  });
})();
