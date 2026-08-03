/* =====================================================================
   Study Hive — 45-queen-image.js
   DISABLED: this patch used to FORCE the Queen to appear as emoji
   (🐝👑 / 👑) on an interval, wiping any uploaded Queen image from the
   guide avatar, the rare fly-by banner, and the story icon.

   Now that the app uses the creator's actual Queen image
   (images/queen.png) everywhere, this forcing behaviour is obsolete and
   actively harmful — it deleted the Queen image at runtime.
   ===================================================================== */

(function () {
  'use strict';
  /* Intentionally a no-op: the Queen image lives in images/queen.png and
     is used by js/12 (fly-by), js/16 (guide avatar) and js/16 story.
     Nothing here should override it. */
})();
