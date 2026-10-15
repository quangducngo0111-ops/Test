
/*
============================================================
SMARTCOM ENGLISH
IELTS WRITING TASK 1 — DYNAMIC DATASETS
OFFLINE GRADING ENGINE v6.1

Works with:
  DynamicDatasets/01/index.html
  DynamicDatasets/02/index.html
  DynamicDatasets/dynamic-style.css

Features:
  - 16 guided steps
  - Deterministic multiple choice grading
  - Chart-based evidence checking
  - Body grouping validation
  - Rule-based spelling and grammar review
  - Distinguishes errors from warnings
  - Browser spellcheck
  - Autosave
  - Final independent writing
  - Export essay

No OpenAI API / No paid backend.

Important:
  This engine is NOT an AI semantic grader.
  It cannot guarantee that every sentence is correct.
============================================================
*/

(() => {
  "use strict";

  // ========================================================
  // 1. INITIAL SETUP
  // ========================================================

  const $ = id => document.getElementById(id);

  const lessonId = document.body.dataset.lesson;

  const VERSION = "6.1";

  const STORE =
    "smartcom_dynamic_offline_v61_" + lessonId;

  const REQUIRED_IDS = [
    "welcome",
    "practice",
    "studentName",
    "studentClass",
    "startButton",
    "startError",
    "lessonTitle",
    "prompt",
    "userLabel",
    "progressText",
    "progress",
    "nav",
    "stepSection",
    "stepTitle",
    "question",
    "hint",
    "answerArea",
    "feedback",
    "checkButton",
    "nextButton",
    "backButton",
    "resetButton",
    "completedPanel",
    "exportButton"
  ];

  const missing = REQUIRED_IDS.filter(id => !$(id));

  if (missing.length) {
    console.error(
      "Dynamic Engine: Missing HTML elements:",
      missing
    );
    return;
  }

  // ========================================================
  // 2. DATASET CONFIGURATION
  // ========================================================

  const LESSONS = {

    "01": {
      title: "International Conferences",

      prompt:
        "The line graph provides information about " +
        "the number of international conferences " +
        "that took place in three different cities. " +
        "Provide an overview of the information by " +
        "identifying and describing the key details, " +
        "and include comparisons where appropriate.",

      start: 1965,
      end: 2010,
      unit: "conferences",

      entities: [
        "City A",
        "City B",
        "City C"
      ],

      /*
       Data transcribed from the supplied chart.
       Intermediate values are approximate where
       the graph does not show exact labels.
      */

      data: {
        years: [
          1965, 1975, 1985,
          1995, 2005, 2010
        ],

        series: {
          "City A": [
            35, 20, 30, 29, 30, 20
          ],

          "City B": [
            31, 29, 29, 27.5, 29, 25
          ],

          "City C": [
            0, 10, 20, 30, 24, 29
          ]
        }
      },

      overall: {
        "City A": "down",
        "City B": "down",
        "City C": "up"
      }
    },

    "02": {
      title: "Music Sales by Method",

      prompt:
        "The graph below shows the percentage " +
        "of total music sales by different methods " +
        "between 2011 and 2018.",

      start: 2011,
      end: 2018,
      unit: "percentage",

      entities: [
        "Streaming",
        "Downloads",
        "CDs"
      ],

      /*
       Exact dataset has not yet been verified.
       Never invent missing chart values.
      */

      data: null,
      overall: null
    }

  };

  const lesson = LESSONS[lessonId];

  if (!lesson) {
    console.error(
      "Unknown Dynamic Dataset:",
      lessonId
    );
    return;
  }

  // ========================================================
  // 3. TEXT UTILITIES
  // ========================================================

  function escapeHTML(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[char]
    );
  }

  function normalize(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[“”]/g, '"')
      .replace(/\s+/g, " ")
      .trim();
  }

  function countWords(text) {
    return (
      String(text || "").match(
        /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu
      ) || []
    ).length;
  }

  function unique(items) {
    return [...new Set(items.filter(Boolean))];
  }

  function paragraphs(text) {
    return String(text || "")
      .trim()
      .split(/\n\s*\n/)
      .map(part => part.trim())
      .filter(Boolean);
  }

  function numbers(text) {
    return (
      String(text || "").match(
        /\b\d+(?:[.,]\d+)?\b/g
      ) || []
    ).map(x => Number(x.replace(",", ".")));
  }

  function hasAny(text, patterns) {
    return patterns.some(regex => regex.test(text));
  }

  function containsYear(text) {
    return new RegExp(
      "\\b(" + lesson.start +
      "|" + lesson.end + ")\\b"
    ).test(text);
  }

  function mentionEntity(text, entity) {
    const t = normalize(text);

    if (entity === "City A") {
      return /\b(?:city|thanh pho)\s*a\b/.test(t);
    }

    if (entity === "City B") {
      return /\b(?:city|thanh pho)\s*b\b/.test(t);
    }

    if (entity === "City C") {
      return /\b(?:city|thanh pho)\s*c\b/.test(t);
    }

    if (entity === "Streaming") {
      return /\bstreaming\b/.test(t);
    }

    if (entity === "Downloads") {
      return /\bdownloads?\b/.test(t);
    }

    if (entity === "CDs") {
      return /\bcds?\b/.test(t);
    }

    return false;
  }

  function entitiesIn(text) {
    return lesson.entities.filter(entity =>
      mentionEntity(text, entity)
    );
  }

  // ========================================================
  // 4. LEARNING STEPS
  // ========================================================

  const STEPS = [

    {
      section: "Phân tích",
      title: "Xác định đề bài",
      type: "choice",

      question:
        "Biểu đồ đang thể hiện thông tin chính nào?",

      options: lessonId === "01"
        ? [
          "Số hội nghị quốc tế tại ba thành phố",
          "Nguyên nhân thay đổi số hội nghị",
          "Quan điểm cá nhân về các thành phố"
        ]
        : [
          "Tỷ lệ doanh số âm nhạc theo phương thức bán",
          "Nguyên nhân thay đổi doanh số",
          "Số lượng ca sĩ trong ngành âm nhạc"
        ],

      correct: 0
    },

    {
      section: "Phân tích",
      title: "Cách đọc biểu đồ",
      type: "choice",

      question:
        "Khi phân tích Dynamic Dataset, " +
        "cần ưu tiên xác định những thông tin nào?",

      options: [
        "Liệt kê mọi số liệu của từng năm",
        "Xu hướng, đặc điểm nổi bật và so sánh",
        "Nguyên nhân xã hội dẫn tới thay đổi"
      ],

      correct: 1
    },

    {
      section: "Phân tích",
      title: "Nhận diện xu hướng",
      type: "analysis",
      min: 8,

      question:
        "Quan sát biểu đồ và mô tả " +
        "những xu hướng tổng thể quan trọng.",

      hint:
        "Nêu rõ tên đối tượng và xu hướng " +
        "tăng, giảm, dao động hoặc ổn định. " +
        "Có thể trả lời bằng tiếng Việt."
    },

    {
      section: "Phân tích",
      title: "Chia nhóm Body",
      type: "group",
      min: 10,

      question:
        "Em sẽ chia các đối tượng vào " +
        "Body 1 và Body 2 như thế nào? " +
        "Giải thích lý do.",

      hint:
        "Có nhiều cách chia hợp lý. " +
        "Quan trọng là đủ đối tượng, " +
        "không trùng nhóm và giải thích đúng."
    },

    {
      section: "Introduction",
      title: "Xác định thành phần",
      type: "choice",

      question:
        "Introduction cần chứa thông tin nào?",

      options: [
        "Đối tượng, đại lượng đo và khoảng thời gian",
        "Tất cả số liệu chi tiết",
        "Nguyên nhân và quan điểm cá nhân"
      ],

      correct: 0
    },

    {
      section: "Introduction",
      title: "Paraphrase đề bài",
      type: "intro",
      min: 10,

      question:
        "Paraphrase nội dung đề bài bằng tiếng Anh.",

      hint:
        "Giữ đúng ý nghĩa gốc, " +
        "không mô tả xu hướng."
    },

    {
      section: "Introduction",
      title: "Viết Introduction",
      type: "intro",
      min: 12,

      question:
        "Viết một Introduction hoàn chỉnh.",

      hint:
        "Giới thiệu nội dung biểu đồ, " +
        "đối tượng, đơn vị và thời gian."
    },

    {
      section: "Overview",
      title: "Chọn ý chính",
      type: "choice",

      question:
        "Overview cần tập trung vào điều gì?",

      options: [
        "Tất cả số liệu cụ thể",
        "Những xu hướng và thay đổi nổi bật",
        "Giải thích nguyên nhân"
      ],

      correct: 1
    },

    {
      section: "Overview",
      title: "Viết Overview",
      type: "overview",
      min: 18,

      question:
        "Viết Overview bằng tiếng Anh.",

      hint:
        "Khái quát xu hướng tổng thể " +
        "và điểm khác biệt nổi bật."
    },

    {
      section: "Body 1",
      title: "Xác định số đầu kỳ",
      type: "data",
      min: 5,

      question:
        "Nêu đối tượng của Body 1, " +
        "năm đầu kỳ và giá trị tương ứng.",

      hint:
        "Ghi tên đối tượng, năm và số liệu."
    },

    {
      section: "Body 1",
      title: "Phân tích thay đổi",
      type: "data",
      min: 10,

      question:
        "Mô tả sự thay đổi nổi bật, " +
        "các mốc quan trọng và số cuối kỳ.",

      hint:
        "Đối chiếu trực tiếp dữ liệu trên biểu đồ."
    },

    {
      section: "Body 1",
      title: "Viết Body 1",
      type: "body",
      min: 30,

      question:
        "Viết Body 1 hoàn chỉnh bằng tiếng Anh.",

      hint:
        "Sử dụng số liệu tiêu biểu " +
        "và trình tự thời gian hợp lý."
    },

    {
      section: "Body 2",
      title: "Xác định số đầu kỳ",
      type: "data",
      min: 5,

      question:
        "Xác định đối tượng Body 2 " +
        "và số liệu đầu kỳ.",

      hint:
        "Không bỏ sót các đối tượng còn lại."
    },

    {
      section: "Body 2",
      title: "So sánh số cuối kỳ",
      type: "data",
      min: 10,

      question:
        "Nêu số cuối kỳ và một điểm so sánh.",

      hint:
        "Chú ý năm, giá trị và đơn vị."
    },

    {
      section: "Body 2",
      title: "Viết Body 2",
      type: "body",
      min: 30,

      question:
        "Viết Body 2 hoàn chỉnh bằng tiếng Anh.",

      hint:
        "Làm rõ những thay đổi và " +
        "so sánh giữa các đối tượng."
    },

    {
      section: "Final Writing",
      title: "Tự viết toàn bài",
      type: "essay",
      min: 150,

      question:
        "Tự viết một bài IELTS Writing Task 1 " +
        "hoàn chỉnh, tối thiểu 150 từ.",

      hint:
        "Viết độc lập thành bốn đoạn. " +
        "Không sử dụng template."
    }
  ];

  // ========================================================
  // 5. STATE AND AUTOSAVE
  // ========================================================

  function defaultState() {
    return {
      version: VERSION,
      name: "",
      className: "",
      started: false,
      current: 0,
      unlocked: 0,
      answers: {},
      grades: {},
      finished: false,
      completedAt: null
    };
  }

  let state = defaultState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORE);

      if (!raw) return;

      const saved = JSON.parse(raw);

      if (!saved || typeof saved !== "object") {
        return;
      }

      state = {
        ...defaultState(),
        ...saved,

        answers:
          saved.answers &&
          typeof saved.answers === "object"
            ? saved.answers
            : {},

        grades:
          saved.grades &&
          typeof saved.grades === "object"
            ? saved.grades
            : {}
      };

      state.unlocked = Math.max(
        0,
        Math.min(
          STEPS.length - 1,
          Number(state.unlocked) || 0
        )
      );

      state.current = Math.max(
        0,
        Math.min(
          state.unlocked,
          Number(state.current) || 0
        )
      );

    } catch (error) {
      console.warn(
        "Cannot load practice state:",
        error
      );
    }
  }

  function saveState() {
    try {
      localStorage.setItem(
        STORE,
        JSON.stringify(state)
      );
    } catch (error) {
      console.warn(
        "Cannot save progress:",
        error
      );
    }
  }

  loadState();

  // ========================================================
  // 6. SPELLING RULES
  // ========================================================

  const SPELLING_RULES = [

    {
      regex: /\bincrese\b/gi,
      correction: "increase",
      explanation:
        "Sai chính tả của increase."
    },

    {
      regex: /\bincresed\b/gi,
      correction: "increased",
      explanation:
        "Sai chính tả của increased."
    },

    {
      regex: /\bdecrese\b/gi,
      correction: "decrease",
      explanation:
        "Sai chính tả của decrease."
    },

    {
      regex: /\bdecresed\b/gi,
      correction: "decreased",
      explanation:
        "Sai chính tả của decreased."
    },

    {
      regex: /\bsignifcant\b/gi,
      correction: "significant",
      explanation:
        "Thiếu chữ i trong significant."
    },

    {
      regex: /\bdramaticallyy\b/gi,
      correction: "dramatically",
      explanation:
        "Sai chính tả của dramatically."
    },

    {
      regex: /\bdramitically\b/gi,
      correction: "dramatically",
      explanation:
        "Sai chính tả của dramatically."
    },

    {
      regex: /\bpercantage\b/gi,
      correction: "percentage",
      explanation:
        "Sai chính tả của percentage."
    },

    {
      regex: /\bcomparision\b/gi,
      correction: "comparison",
      explanation:
        "Sai chính tả của comparison."
    },

    {
      regex: /\bfluctation\b/gi,
      correction: "fluctuation",
      explanation:
        "Sai chính tả của fluctuation."
    },

    {
      regex: /\bfluctueted\b/gi,
      correction: "fluctuated",
      explanation:
        "Sai chính tả của fluctuated."
    },

    {
      regex: /\bgradully\b/gi,
      correction: "gradually",
      explanation:
        "Sai chính tả của gradually."
    },

    {
      regex: /\baproximately\b/gi,
      correction: "approximately",
      explanation:
        "Sai chính tả của approximately."
    },

    {
      regex: /\bsligtly\b/gi,
      correction: "slightly",
      explanation:
        "Sai chính tả của slightly."
    },

    {
      regex: /\bconferances\b/gi,
      correction: "conferences",
      explanation:
        "Sai chính tả của conferences."
    },

    {
      regex: /\bproprotion\b/gi,
      correction: "proportion",
      explanation:
        "Sai chính tả của proportion."
    }
  ];

  // ========================================================
  // 7. GRAMMAR RULES
  // ========================================================

  /*
   Only reasonably reliable local patterns.
   No arbitrary full-sentence grammar claims.
  */

  const GRAMMAR_RULES = [

    {
      regex: /\bthey was\b/gi,
      correction: "they were",
      explanation:
        "They đi với were ở quá khứ đơn."
    },

    {
      regex: /\bit were\b/gi,
      correction: "it was",
      explanation:
        "It đi với was ở quá khứ đơn."
    },

    {
      regex: /\bthere were a\b/gi,
      correction: "there was a",
      explanation:
        "Danh từ số ít đi sau 'a' thường cần there was."
    },

    {
      regex: /\bthere was many\b/gi,
      correction: "there were many",
      explanation:
        "Many thường đi với danh từ đếm được số nhiều."
    },

    {
      regex: /\bhas increase\b/gi,
      correction: "has increased",
      explanation:
        "Sau has cần dùng quá khứ phân từ."
    },

    {
      regex: /\bhave increase\b/gi,
      correction: "have increased",
      explanation:
        "Sau have cần dùng quá khứ phân từ."
    },

    {
      regex: /\bhas decrease\b/gi,
      correction: "has decreased",
      explanation:
        "Sau has cần dùng quá khứ phân từ."
    },

    {
      regex: /\bhave decrease\b/gi,
      correction: "have decreased",
      explanation:
        "Sau have cần dùng quá khứ phân từ."
    },

    {
      regex: /\bwas increase\b/gi,
      correction: "increased / was increasing",
      explanation:
        "Không dùng was + increase ở dạng chủ động. " +
        "Chọn dạng phù hợp với ý nghĩa câu."
    },

    {
      regex: /\bwere increase\b/gi,
      correction: "increased / were increasing",
      explanation:
        "Cần sửa dạng động từ chỉ xu hướng."
    },

    {
      regex: /\bwas decrease\b/gi,
      correction: "decreased / was decreasing",
      explanation:
        "Cần sửa dạng động từ chỉ xu hướng."
    },

    {
      regex:
        /\b(increase|increased|decrease|decreased|rose|fell|grew)\s+dramatic\b/gi,

      correction: "dramatically",

      explanation:
        "Sau động từ chỉ xu hướng, " +
        "thường dùng trạng từ dramatically."
    },

    {
      regex:
        /\b(increase|increased|decrease|decreased|rose|fell|grew)\s+significant\b/gi,

      correction: "significantly",

      explanation:
        "Cần dùng trạng từ significantly " +
        "để bổ nghĩa động từ."
    },

    {
      regex: /\ba sharply increase\b/gi,
      correction: "a sharp increase",
      explanation:
        "Trước danh từ increase, dùng tính từ sharp."
    },

    {
      regex: /\ba dramatically rise\b/gi,
      correction: "a dramatic rise",
      explanation:
        "Dùng dramatic để bổ nghĩa danh từ rise."
    },

    {
      regex: /\bmore higher\b/gi,
      correction: "higher",
      explanation:
        "Không thêm more trước higher."
    },

    {
      regex: /\bmore lower\b/gi,
      correction: "lower",
      explanation:
        "Không thêm more trước lower."
    },

    {
      regex: /\bmore faster\b/gi,
      correction: "faster",
      explanation:
        "Faster đã là dạng so sánh hơn."
    },

    {
      regex: /\bthe figures shows\b/gi,
      correction: "the figures show",
      explanation:
        "Figures là danh từ số nhiều, " +
        "đi với show."
    },

    {
      regex: /\bthe graph show\b/gi,
      correction: "the graph shows",
      explanation:
        "Graph là chủ ngữ số ít, " +
        "cần động từ shows."
    },

    {
      regex: /\bthe chart show\b/gi,
      correction: "the chart shows",
      explanation:
        "Chart là chủ ngữ số ít, " +
        "cần động từ shows."
    },

    {
      regex: /\bthe charts shows\b/gi,
      correction: "the charts show",
      explanation:
        "Charts là chủ ngữ số nhiều."
    },

    {
      regex: /\bthe number of conferences are\b/gi,
      correction: "the number of conferences is",
      explanation:
        "Chủ ngữ chính 'the number' là số ít. " +
        "Chọn is hoặc was tùy thời gian."
    },

    {
      regex: /\bthe number of conferences were\b/gi,
      correction: "the number of conferences was",
      explanation:
        "Chủ ngữ chính 'the number' là số ít."
    },

    {
      regex: /\bthe number of conferences have\b/gi,
      correction: "the number of conferences has",
      explanation:
        "The number là chủ ngữ số ít."
    },

    {
      regex: /\bthe amount of sales were\b/gi,
      correction: "the amount of sales was",
      explanation:
        "The amount là chủ ngữ số ít."
    },

    {
      regex: /\binformations\b/gi,
      correction: "information",
      explanation:
        "Information là danh từ không đếm được."
    },

    {
      regex: /\bmany information\b/gi,
      correction: "much information",
      explanation:
        "Information không đếm được."
    },

    {
      regex: /\ban increase dramatically\b/gi,
      correction: "a dramatic increase",
      explanation:
        "Trước danh từ increase cần tính từ dramatic."
    }
  ];

  // ========================================================
  // 8. LANGUAGE DIAGNOSTIC
  // ========================================================

  function checkLanguage(text) {
    const issues = [];

    const allRules = [
      ...SPELLING_RULES.map(rule => ({
        ...rule,
        category: "Spelling"
      })),

      ...GRAMMAR_RULES.map(rule => ({
        ...rule,
        category: "Grammar"
      }))
    ];

    for (const rule of allRules) {
      rule.regex.lastIndex = 0;

      for (const match of text.matchAll(rule.regex)) {
        issues.push({
          category: rule.category,
          original: match[0],
          correction: rule.correction,
          explanation: rule.explanation,
          start: match.index,
          end: match.index + match[0].length
        });
      }
    }

    const repeatedWords =
      /\b([a-z]{2,})\s+\1\b/gi;

    for (
      const match of text.matchAll(repeatedWords)
    ) {
      issues.push({
        category: "Repetition",
        original: match[0],
        correction: match[1],
        explanation:
          "Có từ bị lặp liên tiếp.",
        start: match.index,
        end: match.index + match[0].length
      });
    }

    /*
     Overlapping matches may refer to
     the same original error.
    */

    issues.sort((a, b) => a.start - b.start);

    const filtered = [];

    for (const issue of issues) {
      if (filtered.some(
        old =>
          issue.start < old.end &&
          issue.end > old.start
      )) {
        continue;
      }

      filtered.push(issue);
    }

    return filtered;
  }

  // ========================================================
  // 9. TREND LANGUAGE
  // ========================================================

  const UP_WORDS = [
    "increase", "increased", "increasing",
    "rise", "rose", "rising",
    "grow", "grew", "grown", "growth",
    "climb", "climbed",
    "surge", "surged",
    "went up", "go up", "upward",
    "tang", "tang len", "di len"
  ];

  const DOWN_WORDS = [
    "decrease", "decreased", "decreasing",
    "decline", "declined",
    "fall", "fell", "fallen",
    "drop", "dropped",
    "went down", "go down", "downward",
    "giam", "giam xuong", "sut giam"
  ];

  const STABLE_WORDS = [
    "stable", "stability", "unchanged",
    "remained steady", "remained stable",
    "on dinh", "khong thay doi"
  ];

  const FLUCTUATION_WORDS = [
    "fluctuate", "fluctuated",
    "fluctuation", "fluctuations",
    "dao dong", "bien dong"
  ];

  function containsPhrase(text, phrases) {
    return phrases.some(phrase => {
      const escaped = phrase.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      return new RegExp(
        "(?:^|\\W)" + escaped + "(?:$|\\W)",
        "i"
      ).test(text);
    });
  }

  function trendEvidence(text) {
    const t = normalize(text);

    return {
      up: containsPhrase(t, UP_WORDS),
      down: containsPhrase(t, DOWN_WORDS),
      stable: containsPhrase(t, STABLE_WORDS),
      fluctuate: containsPhrase(
        t,
        FLUCTUATION_WORDS
      )
    };
  }

  // ========================================================
  // 10. CHART FACTS
  // ========================================================

  function chartValue(entity, year) {
    if (!lesson.data) return null;

    const index =
      lesson.data.years.indexOf(Number(year));

    if (index < 0) return null;

    return (
      lesson.data.series[entity]?.[index] ?? null
    );
  }

  function chartDirection(entity, first, last) {
    const a = chartValue(entity, first);
    const b = chartValue(entity, last);

    if (a === null || b === null) {
      return null;
    }

    if (b > a) return "up";
    if (b < a) return "down";

    return "stable";
  }

  function chartWarnings(text, index) {
    const warnings = [];
    const errors = [];

    if (!lesson.data) {
      warnings.push(
        "Bài 02 chưa có dữ liệu biểu đồ " +
        "được xác minh. Hệ thống chưa thể " +
        "kiểm tra chính xác số liệu hoặc xu hướng."
      );

      return {errors, warnings};
    }

    /*
     Trend checking is scoped to clearly
     identifiable overall claims.

     Do not flag a rising intermediate segment
     as an incorrect overall trend.
    */

    if ([2, 3, 8].includes(index)) {

      const sentences = normalize(text)
        .split(/[.!?;\n]+|\b(?:whereas|while|nhung)\b/)
        .map(x => x.trim())
        .filter(Boolean);

      for (const sentence of sentences) {
        const found = entitiesIn(sentence);

        if (found.length !== 1) {
          continue;
        }

        const entity = found[0];
        const evidence = trendEvidence(sentence);

        const overall =
          lesson.overall[entity];

        const claimsOverall =
          /\b(overall|generally|in general|throughout|entire|whole|nhin chung|tong the|ca giai doan|tu dau den cuoi)\b/i
            .test(sentence) ||
          /\bfrom\s*1965\s*to\s*2010\b/i
            .test(sentence) ||
          /\bbetween\s*1965\s*and\s*2010\b/i
            .test(sentence);

        /*
         Step 2/3/8 asks for an overall trend.
         A sentence explicitly restricted
         to intermediate years is not checked
         against the overall direction.
        */

        const internalYears =
          /\b(1975|1985|1995|2005)\b/.test(sentence);

        if (internalYears && !claimsOverall) {
          continue;
        }

        const hasUp = evidence.up;
        const hasDown = evidence.down;

        if (hasUp && hasDown) {
          warnings.push(
            `Nhận xét về ${entity} có cả từ tăng ` +
            `và giảm. Hãy kiểm tra xem em đang ` +
            `mô tả dao động hay xu hướng tổng thể.`
          );
          continue;
        }

        if (!hasUp && !hasDown) {
          continue;
        }

        if (overall === "down" && hasUp) {
          errors.push(
            `${entity} giảm xét từ năm ` +
            `${lesson.start} đến ${lesson.end}, ` +
            `không tăng tổng thể.`
          );
        }

        if (overall === "up" && hasDown) {
          errors.push(
            `${entity} tăng xét từ năm ` +
            `${lesson.start} đến ${lesson.end}, ` +
            `không giảm tổng thể.`
          );
        }
      }
    }

    return {
      errors: unique(errors),
      warnings: unique(warnings)
    };
  }

  // ========================================================
  // 11. NUMBER VALIDATION
  // ========================================================

  /*
   Only verify simple, unambiguous pairs
   like "City A ... 35 ... 1965" or
   "City A in 1965: 35".

   Complex prose is not automatically
   rejected from numeric pattern matching.
  */

  function validateNumbers(text) {
    const errors = [];
    const warnings = [];

    if (!lesson.data) {
      return {
        errors,
        warnings
      };
    }

    const lines = text
      .split(/[\n;]+/)
      .map(x => x.trim())
      .filter(Boolean);

    for (const line of lines) {
      const found = entitiesIn(line);

      if (found.length !== 1) {
        continue;
      }

      const entity = found[0];
      const ns = numbers(line);

      const chartYears = ns.filter(x =>
        lesson.data.years.includes(x)
      );

      if (chartYears.length !== 1) {
        continue;
      }

      const year = chartYears[0];

      const candidates = ns.filter(x =>
        x !== year &&
        !lesson.data.years.includes(x)
      );

      if (candidates.length !== 1) {
        continue;
      }

      const claimed = candidates[0];

      const expected = chartValue(
        entity,
        year
      );

      if (expected === null) continue;

      /*
       Fractional data on the original graph
       are approximate. Allow small tolerance.
      */

      const tolerance = 1;

      if (
        Math.abs(claimed - expected) > tolerance
      ) {
        errors.push(
          `${entity} tại năm ${year}: ` +
          `em ghi ${claimed}, trong khi ` +
          `biểu đồ thể hiện khoảng ${expected}.`
        );
      }
    }

    return {
      errors: unique(errors),
      warnings: unique(warnings)
    };
  }

  // ========================================================
  // 12. GROUP VALIDATION
  // ========================================================

  function validateGrouping(text) {
    const errors = [];
    const warnings = [];

    const t = normalize(text);

    const body1Match =
      /(?:body|doan)\s*1\s*[:\-]?([\s\S]*?)(?=(?:body|doan)\s*2\b|$)/i
        .exec(t);

    const body2Match =
      /(?:body|doan)\s*2\s*[:\-]?([\s\S]*)/i
        .exec(t);

    if (!body1Match || !body2Match) {
      errors.push(
        "Hãy trình bày rõ Body 1 và Body 2 " +
        "để hệ thống kiểm tra cách chia nhóm."
      );

      return {errors, warnings};
    }

    const body1 = body1Match[1];
    const body2 = body2Match[1];

    const group1 = entitiesIn(body1);
    const group2 = entitiesIn(body2);

    for (const entity of lesson.entities) {
      if (
        !group1.includes(entity) &&
        !group2.includes(entity)
      ) {
        errors.push(
          `Chưa phân nhóm ${entity}.`
        );
      }

      if (
        group1.includes(entity) &&
        group2.includes(entity)
      ) {
        errors.push(
          `${entity} đang xuất hiện ở cả ` +
          "Body 1 và Body 2."
        );
      }
    }

    if (!group1.length || !group2.length) {
      errors.push(
        "Mỗi Body cần có ít nhất một đối tượng."
      );
    }

    if (
      !/\b(vi|because|since|do|theo|nhom|xu huong|tuong dong|khac biet)\b/i
        .test(t)
    ) {
      warnings.push(
        "Hãy giải thích lý do chia nhóm " +
        "thay vì chỉ liệt kê tên đối tượng."
      );
    }

    return {
      errors: unique(errors),
      warnings: unique(warnings)
    };
  }

  // ========================================================
  // 13. STRUCTURE VALIDATION
  // ========================================================

  function validateStructure(text, step) {
    const errors = [];
    const warnings = [];

    const count = countWords(text);

    if (!text.trim()) {
      errors.push("Em chưa nhập câu trả lời.");

      return {errors, warnings};
    }

    if (count < (step.min || 0)) {
      errors.push(
        `Cần tối thiểu ${step.min} từ. ` +
        `Hiện tại có ${count} từ.`
      );
    }

    if (step.type === "essay") {
      const parts = paragraphs(text);

      if (parts.length < 4) {
        errors.push(
          "Bài hoàn chỉnh cần tối thiểu bốn " +
          "đoạn văn tách biệt bằng dòng trống."
        );
      }

      if (parts.length > 5) {
        warnings.push(
          "Bài Task 1 thường nên viết gọn " +
          "trong bốn đoạn."
        );
      }
    }

    if (
      ["intro","overview","body","essay"]
        .includes(step.type)
    ) {
      if (
        /\b(i think|i believe|in my opinion)\b/i
          .test(text)
      ) {
        errors.push(
          "IELTS Academic Task 1 không yêu cầu " +
          "trình bày quan điểm cá nhân."
        );
      }
    }

    if (step.type === "intro") {
      if (
        lessonId === "01" &&
        !/\bconferences?\b/i.test(text)
      ) {
        warnings.push(
          "Introduction cần thể hiện đúng " +
          "đối tượng hội nghị quốc tế."
        );
      }

      if (
        lessonId === "02" &&
        !/\b(music|sales)\b/i.test(text)
      ) {
        warnings.push(
          "Introduction cần thể hiện " +
          "nội dung music sales."
        );
      }

      if (!containsYear(text)) {
        warnings.push(
          "Hãy kiểm tra xem Introduction " +
          "đã nêu khoảng thời gian chưa."
        );
      }
    }

    if (
      step.type === "overview" &&
      !hasAny(
        normalize(text),
        [
          /\b(increase|increased|rise|rose|grow|grew)\b/,
          /\b(decrease|decreased|fall|fell|decline|declined)\b/,
          /\b(tang|giam|dao dong|on dinh)\b/
        ]
      )
    ) {
      warnings.push(
        "Chưa nhận thấy cách diễn đạt xu hướng " +
        "trong Overview. Hãy tự kiểm tra lại."
      );
    }

    if (step.type === "data") {
      if (!numbers(text).length) {
        errors.push(
          "Bước này cần số liệu " +
          "hoặc mốc thời gian cụ thể."
        );
      }

      if (!entitiesIn(text).length) {
        warnings.push(
          "Nên ghi rõ đối tượng tương ứng " +
          "với số liệu."
        );
      }
    }

    if (step.type === "body") {
      if (!numbers(text).length) {
        warnings.push(
          "Body nên có số liệu " +
          "để minh họa các nhận xét."
        );
      }
    }

    return {
      errors: unique(errors),
      warnings: unique(warnings)
    };
  }

  // ========================================================
  // 14. ASSESSMENT ORCHESTRATOR
  // ========================================================

  function gradeAnswer(answer, step, index) {

    if (step.type === "choice") {
      if (answer === "") {
        return {
          verdict: "revise",
          errors: [
            "Hãy chọn một đáp án."
          ],
          warnings: [],
          issues: [],
          verified: true
        };
      }

      return Number(answer) === step.correct
        ? {
          verdict: "pass",
          errors: [],
          warnings: [],
          issues: [],
          verified: true
        }
        : {
          verdict: "revise",
          errors: [
            "Đáp án chưa chính xác. " +
            "Hãy đọc lại yêu cầu và chọn lại."
          ],
          warnings: [],
          issues: [],
          verified: true
        };
    }

    const structure =
      validateStructure(answer, step);

    const errors = [
      ...structure.errors
    ];

    const warnings = [
      ...structure.warnings
    ];

    let issues = [];

    // Check known spelling and grammar errors.

    if (
      ["intro","overview","body","essay"]
        .includes(step.type)
    ) {
      issues = checkLanguage(answer);

      if (issues.length) {
        errors.push(
          `Phát hiện ${issues.length} vấn đề ` +
          "ngôn ngữ theo bộ quy tắc."
        );
      }
    }

    // Check grouping.

    if (step.type === "group") {
      const grouping =
        validateGrouping(answer);

      errors.push(...grouping.errors);
      warnings.push(...grouping.warnings);
    }

    // Check chart trends.

    if (
      ["analysis","group","overview"]
        .includes(step.type)
    ) {
      const chart =
        chartWarnings(answer, index);

      errors.push(...chart.errors);
      warnings.push(...chart.warnings);
    }

    // Check numeric facts.

    if (
      ["data","body","essay"]
        .includes(step.type)
    ) {
      const numeric =
        validateNumbers(answer);

      errors.push(...numeric.errors);
      warnings.push(...numeric.warnings);
    }

    if (
      lessonId === "02" &&
      [2,3,8,9,10,11,12,13,14,15]
        .includes(index)
    ) {
      warnings.push(
        "Chưa có bảng số liệu chuẩn cho " +
        "Dynamic 02. Phần dữ liệu và xu hướng " +
        "chưa được xác minh."
      );
    }

    /*
     The absence of detected errors is NOT
     proof that free-form English is correct.
    */

    return {
      verdict:
        errors.length ? "revise" : "pass",

      errors: unique(errors),
      warnings: unique(warnings),
      issues,

      verified: false
    };
  }

  // ========================================================
  // 15. FEEDBACK DISPLAY
  // ========================================================

  function renderFeedback(result, answer) {
    const box = $("feedback");

    const passed =
      result.verdict === "pass";

    box.hidden = false;
    box.className =
      "feedback " +
      (passed ? "success" : "warning");

    let html = `
      <strong>
        ${
          passed
            ? "✓ Đạt kiểm tra tự động"
            : "Cần chỉnh sửa trước khi tiếp tục"
        }
      </strong>

      <p>
        ${
          passed
            ? "Chưa phát hiện lỗi chắc chắn theo các quy tắc hiện có. Kết quả không xác nhận bài hoàn toàn đúng."
            : "Hãy đọc phản hồi bên dưới và sửa câu trả lời."
        }
      </p>
    `;

    if (result.errors.length) {
      html +=
        "<h4>Những vấn đề cần sửa</h4><ul>";

      for (const error of result.errors) {
        html += `<li>${escapeHTML(error)}</li>`;
      }

      html += "</ul>";
    }

    if (result.issues.length) {
      html += "<h4>Chữa lỗi ngôn ngữ</h4>";

      for (const issue of result.issues) {
        html += `
          <div class="grading-issue">

            <strong>
              ${escapeHTML(issue.category)}
            </strong>

            <p>
              <b>Cụm cần sửa:</b>
              <span style="color:#bf3446">
                ${escapeHTML(issue.original)}
              </span>
            </p>

            <p>
              <b>Đề xuất:</b>
              <span style="color:#16845b">
                ${escapeHTML(issue.correction)}
              </span>
            </p>

            <p>
              ${escapeHTML(issue.explanation)}
            </p>

          </div>
        `;
      }
    }

    if (result.warnings.length) {
      html +=
        "<h4>Những điểm cần tự kiểm tra</h4><ul>";

      for (const warning of result.warnings) {
        html +=
          `<li>${escapeHTML(warning)}</li>`;
      }

      html += "</ul>";
    }

    if (
      !result.verified &&
      result.verdict === "pass"
    ) {
      html += `
        <p style="
          font-size:11px;
          margin-top:12px;
          opacity:.9;
        ">
          Đây là kết quả kiểm tra offline theo
          quy tắc. Giáo viên cần xác minh những
          nội dung không thể đánh giá tự động.
        </p>
      `;
    }

    box.innerHTML = html;
  }

  // ========================================================
  // 16. NAVIGATION AND PROGRESS
  // ========================================================

  function renderProgress() {
    const total = STEPS.length;

    $("progressText").textContent =
      `Đã mở ${state.unlocked + 1}/${total} bước`;

    $("progress").style.width =
      ((state.unlocked + 1) / total * 100) + "%";
  }

  function renderNavigation() {
    $("nav").innerHTML = STEPS.map(
      (step, index) => {

        const locked =
          index > state.unlocked;

        const active =
          index === state.current;

        const done =
          index < state.unlocked;

        return `
          <button
            type="button"
            class="step-chip
              ${active ? "active" : ""}
              ${done ? "done" : ""}"
            data-step="${index}"
            ${locked ? "disabled" : ""}
          >
            ${done ? "✓" : index + 1}.
            ${escapeHTML(step.section)}
          </button>
        `;
      }
    ).join("");
  }

  // ========================================================
  // 17. ANSWER HANDLING
  // ========================================================

  function readAnswer() {
    const step = STEPS[state.current];

    if (step.type === "choice") {
      return (
        document.querySelector(
          'input[name="answer"]:checked'
        )?.value ?? ""
      );
    }

    return $("answer")?.value || "";
  }

  function saveCurrentAnswer() {
    if (!state.started) return;

    state.answers[state.current] =
      readAnswer();

    saveState();
  }

  // ========================================================
  // 18. STEP RENDERING
  // ========================================================

  function renderCurrentStep() {
    const index = state.current;

    const step = STEPS[index];

    const answer =
      state.answers[index] ?? "";

    $("stepSection").textContent =
      step.section;

    $("stepTitle").textContent =
      `${index + 1}. ${step.title}`;

    $("question").textContent =
      step.question;

    $("hint").textContent =
      step.hint || "";

    $("hint").hidden = !step.hint;

    if (step.type === "choice") {
      $("answerArea").innerHTML = `
        <div class="choices">

          ${step.options.map(
            (option, i) => `
              <label>
                <input
                  type="radio"
                  name="answer"
                  value="${i}"
                  ${
                    String(answer) === String(i)
                      ? "checked"
                      : ""
                  }
                >

                ${escapeHTML(option)}
              </label>
            `
          ).join("")}

        </div>
      `;

    } else {

      const rows =
        step.type === "essay"
          ? 18
          : step.type === "body"
            ? 7
            : 4;

      const lang =
        ["analysis","group","data"]
          .includes(step.type)
            ? "vi"
            : "en-GB";

      $("answerArea").innerHTML = `
        <textarea
          id="answer"
          rows="${rows}"
          lang="${lang}"
          spellcheck="true"
          placeholder="Nhập câu trả lời..."
        ></textarea>

        <div
          id="words"
          class="word-line"
        ></div>
      `;

      $("answer").value = answer;

      $("words").textContent =
        countWords(answer) + " từ";
    }

    $("checkButton").textContent =
      step.type === "essay"
        ? "Kiểm tra bài hoàn chỉnh"
        : "Kiểm tra & mở khóa";

    $("nextButton").hidden =
      index >= state.unlocked ||
      index >= STEPS.length - 1;

    $("backButton").disabled =
      index === 0;

    $("feedback").hidden = true;

    $("completedPanel").hidden =
      !state.finished;
  }

  // ========================================================
  // 19. MAIN RENDER
  // ========================================================

  function render() {
    $("lessonTitle").textContent =
      `Dynamic Datasets ${lessonId} · ` +
      lesson.title;

    $("prompt").textContent =
      lesson.prompt;

    $("welcome").hidden =
      state.started;

    $("practice").hidden =
      !state.started;

    $("userLabel").textContent =
      state.name +
      (
        state.className
          ? " · " + state.className
          : ""
      );

    if (!state.started) {
      $("studentName").value =
        state.name;

      $("studentClass").value =
        state.className;

      return;
    }

    renderProgress();
    renderNavigation();
    renderCurrentStep();
  }

  // ========================================================
  // 20. CHECK STEP
  // ========================================================

  function checkCurrentStep() {
    const index = state.current;

    const step = STEPS[index];

    const answer =
      readAnswer().trim();

    saveCurrentAnswer();

    const result =
      gradeAnswer(answer, step, index);

    renderFeedback(result, answer);

    state.grades[index] = {
      answer,
      verdict: result.verdict,
      errors: result.errors,
      warnings: result.warnings,
      issues: result.issues,
      checkedAt: new Date().toISOString(),
      verified: result.verified
    };

    if (result.verdict === "pass") {

      if (index < STEPS.length - 1) {
        state.unlocked = Math.max(
          state.unlocked,
          index + 1
        );

        $("nextButton").hidden = false;

      } else {
        state.finished = true;

        state.completedAt =
          new Date().toISOString();

        $("completedPanel").hidden = false;
      }

      renderProgress();
      renderNavigation();
    }

    saveState();
  }

  // ========================================================
  // 21. STEP NAVIGATION
  // ========================================================

  function goToStep(index) {
    if (
      index < 0 ||
      index >= STEPS.length ||
      index > state.unlocked
    ) {
      return;
    }

    saveCurrentAnswer();

    state.current = index;

    saveState();
    render();
  }

  // ========================================================
  // 22. START PRACTICE
  // ========================================================

  function startPractice() {
    const name =
      $("studentName").value.trim();

    const className =
      $("studentClass").value.trim();

    if (!name) {
      $("startError").textContent =
        "Vui lòng nhập họ và tên.";

      $("studentName").focus();
      return;
    }

    state.name = name;
    state.className = className;
    state.started = true;

    $("startError").textContent = "";

    saveState();
    render();
  }

  // ========================================================
  // 23. RESET
  // ========================================================

  function resetPractice() {
    if (!confirm(
      "Bạn có chắc muốn xóa toàn bộ " +
      "tiến độ bài học này?"
    )) {
      return;
    }

    localStorage.removeItem(STORE);

    state = defaultState();

    render();
  }

  // ========================================================
  // 24. EXPORT FINAL ESSAY
  // ========================================================

  function exportEssay() {
    const essay =
      state.answers[15] || "";

    if (!essay.trim()) {
      alert("Chưa có bài viết hoàn chỉnh.");
      return;
    }

    const content = [
      "SMARTCOM IELTS WRITING TASK 1",
      "",
      `Dynamic Datasets ${lessonId}`,
      lesson.title,
      "",
      "Student: " + state.name,
      "Class: " + state.className,
      "",
      "TASK",
      lesson.prompt,
      "",
      "STUDENT ESSAY",
      "",
      essay,
      "",
      "Word count: " +
        countWords(essay),
      "",
      "Offline assessment: " +
        (
          state.grades[15]?.verdict ||
          "not_checked"
        ),
      "",
      "Note: This is a rule-based " +
        "offline review, not an official " +
        "IELTS band assessment."
    ].join("\n");

    const blob = new Blob(
      [content],
      {
        type: "text/plain;charset=utf-8"
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download =
      `Dynamic-${lessonId}-Writing.txt`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(
      () => URL.revokeObjectURL(url),
      1000
    );
  }

  // ========================================================
  // 25. EVENT LISTENERS
  // ========================================================

  $("startButton").addEventListener(
    "click",
    startPractice
  );

  $("checkButton").addEventListener(
    "click",
    checkCurrentStep
  );

  $("nextButton").addEventListener(
    "click",
    () => goToStep(state.current + 1)
  );

  $("backButton").addEventListener(
    "click",
    () => goToStep(state.current - 1)
  );

  $("resetButton").addEventListener(
    "click",
    resetPractice
  );

  $("exportButton").addEventListener(
    "click",
    exportEssay
  );

  $("nav").addEventListener(
    "click",
    event => {
      const button =
        event.target.closest("[data-step]");

      if (!button) return;

      goToStep(
        Number(button.dataset.step)
      );
    }
  );

  $("answerArea").addEventListener(
    "input",
    () => {
      saveCurrentAnswer();

      $("feedback").hidden = true;

      if ($("words")) {
        $("words").textContent =
          countWords(readAnswer()) + " từ";
      }
    }
  );

  $("answerArea").addEventListener(
    "change",
    saveCurrentAnswer
  );

  // ========================================================
  // 26. INITIALIZE
  // ========================================================

  render();

})();
