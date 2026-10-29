
/*
  READING VOCABULARY LOADER
  Quản lý các bộ từ vựng từ Bộ 07 trở đi.
*/

(function () {
  "use strict";

  const READING_SETS = [
    "reading-07.js",
    "reading-08.js",
    "reading-09.js"

    // Sau này thêm:
    // "reading-10.js",
    // "reading-11.js",
    // "reading-12.js"
  ];

  window.READING_SET_FILES = READING_SETS;

  for (const file of READING_SETS) {
    document.write(
      '<script src="./reading-sets/' +
      file +
      '?v=1"><\/script>'
    );
  }
})();
