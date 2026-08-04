/* =====================================================================
   Study Hive — 00-shared-utils.js
   ONE implementation of the tiny helpers that used to be re-declared
   in every file (esc, $, qa, getJSON, setJSON, pad, dateKey).

   Rule for this app:
   · NEW code should use window.shEsc / shGet / shQa / shGetJSON /
     shSetJSON / shPad / shDateKey instead of copying bodies.
   · EXISTING files keep their own function declarations as hoist-safe
     fallbacks, but they DELEGATE to the shared implementation when it
     is present (see the `if (window.shEsc) return window.shEsc(s);`
     guard pattern). A missing or reordered script can therefore never
     break the app — the local copy still works.

   Loaded FIRST, before js/01 — do not reorder.
   ===================================================================== */

(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function $(id) { return document.getElementById(id); }
  function qa(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function getJSON(k, fb) { try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch (e) { return fb; } }
  function setJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dateKey(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  window.shEsc = esc;
  window.shGet = $;
  window.shQa = qa;
  window.shGetJSON = getJSON;
  window.shSetJSON = setJSON;
  window.shPad = pad;
  window.shDateKey = dateKey;
})();
