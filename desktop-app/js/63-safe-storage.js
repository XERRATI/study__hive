/* =====================================================================
   Study Hive — 63-safe-storage.js
   SAFE STORAGE WRAPPER + ADMIN LOCKOUT RESET HOOK
   · safeStore / safeRead — guarded localStorage helpers (size caps,
     JSON validation, graceful fallbacks) so one bad value can never
     corrupt the app's state or blow the quota.
   · Admin brute-force lockout state lives in js/17; this exposes a tiny
     helper to reset it and to write logs safely.
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */

(function () {
  'use strict';
  var MAX_KEY_LEN = 100;
  var MAX_VALUE_BYTES = 500 * 1024; /* 500 KB per key */

  function approxBytes(str) {
    try { return new Blob([str]).size; } catch (e) { return String(str).length * 2; }
  }

  /* ---------- safeStore: returns true on success, false on failure ---------- */
  window.safeStore = function (key, value) {
    try {
      if (typeof key !== 'string' || !key || key.length > MAX_KEY_LEN) return false;
      var raw;
      if (typeof value === 'string') raw = value;
      else raw = JSON.stringify(value);
      if (approxBytes(raw) > MAX_VALUE_BYTES) return false;
      localStorage.setItem(key, raw);
      return true;
    } catch (e) {
      try { if (window.STUDY_HIVE_LOG) window.STUDY_HIVE_LOG('STORAGE_WRITE', String(e && e.message || e)); } catch (_) {}
      return false;
    }
  };

  /* ---------- safeRead: returns fallback on missing/corrupt ---------- */
  window.safeRead = function (key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      /* try JSON first, else return the raw string */
      try { return JSON.parse(raw); } catch (e) { return raw; }
    } catch (e) {
      try { if (window.STUDY_HIVE_LOG) window.STUDY_HIVE_LOG('STORAGE_READ', String(e && e.message || e)); } catch (_) {}
      return fallback;
    }
  };

  /* ---------- Haptics: tiny vibrate helper (safe on desktop) ---------- */
  window.buzz = function (pattern) {
    try {
      if (navigator.vibrate) navigator.vibrate(pattern || 20);
    } catch (e) {}
  };

  /* ---------- Stable card IDs for flashcards ---------- */
  window.makeCardId = function () {
    try {
      if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    } catch (e) {}
    return 'c' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  };

  /* ---------- Reset the admin lockout (used by admin after success / tests) ---------- */
  window.resetAdminLockout = function () {
    try {
      if (window.__adminLockReset) window.__adminLockReset();
    } catch (e) {}
  };

  /* ---------- tiny logging bridge so safeStore can record failures ---------- */
  window.STUDY_HIVE_LOG = function (type, message) {
    try {
      var arr = JSON.parse(localStorage.getItem('studyhive-error-log-v1') || '[]');
      arr.unshift({ ts: new Date().toISOString(), message: String(type) + ': ' + String(message), source: 'safe-storage', line: 0 });
      localStorage.setItem('studyhive-error-log-v1', JSON.stringify(arr.slice(0, 30)));
    } catch (e) {}
  };

  /* Hook: js/17 sets this after a successful admin login to clear the lockout. */
  window.__adminLockReset = function () {
    try {
      var veil = document.getElementById('adminLockVeil');
      if (veil) veil.classList.remove('show');
    } catch (e) {}
  };
})();
