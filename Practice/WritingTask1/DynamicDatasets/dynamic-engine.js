
/**
 * DYNAMIC DATASETS — SHARED LEARNING ENGINE
 * Version: 4.0
 *
 * Used by:
 *   /DynamicDatasets/01/index.html
 *   /DynamicDatasets/02/index.html
 *
 * Learning flow:
 * Analysis → Introduction → Overview →
 * Body 1 → Body 2 → Independent Writing
 *
 * Assessment:
 * Layer 1: Structure validation
 * Layer 2: Content evidence and consistency
 * Layer 3: Optional AI assessment via secure backend
 *
 * Never place an AI API key in this file.
 */

(() => {
  "use strict";

  // ==========================================
  // 1. LESSON CONFIGURATION
  // ==========================================

  const LESSONS = {
    "01": {
      title: "International Conferences",
      label: "Dynamic Datasets 01",
      chartType: "Line graph",

      prompt:
        "The line graph provides information about " +
        "the number of international conferences " +
        "that took place in three different cities. " +
        "Provide an overview of the information by " +
        "identifying and describing the key details, " +
        "and include comparisons where appropriate.",

      subject: "international conferences",
      measurement: "number",
      unit: "conferences",
      entities: ["three cities"],

      period: null,

      introductionHint:
        "Paraphrase the number of international " +
        "conferences held in three cities over " +
        "the period shown.",

      overviewHint:
        "Identify the main trends for the three " +
        "cities. Look for rises, falls, fluctuations " +
        "and differences in their final positions.",

      groupingHint:
        "Group cities according to their trends " +
        "or other important similarities and differences.",

      requiredTopics: [
        /\bconferences?\b/i,
        /\b(cities|city|locations?)\b/i
      ],

      measurePattern:
        /\b(number|total|count|held|hosted|took place)\b/i,

      forbiddenPatterns: [
        {
          regex: /\bpercentage of music sales\b/i,
          message: "Nội dung đang nhầm sang bài Music Sales."
        }
      ],

      chartFacts: null
    },

    "02": {
      title: "Music Sales by Method",
      label: "Dynamic Datasets 02",
      chartType: "Line graph",

      prompt:
        "The graph below shows the percentage " +
        "of total music sales by different methods " +
        "between 2011 and 2018.",

      subject: "music sales",
      measurement: "percentage",
      unit: "%",

      entities: [
        "streaming",
        "downloads",
        "CDs"
      ],

      period: {
        start: 2011,
        end: 2018
      },

      introductionHint:
        "Describe how the proportions of total " +
        "music sales through different methods " +
        "changed from 2011 to 2018.",

      overviewHint:
        "Compare the overall trends of streaming, " +
        "downloads and CDs. Identify important " +
        "changes in their relative positions.",

      groupingHint:
        "Consider grouping methods with similar " +
        "trends together. Describe contrasting " +
        "trends in the other body paragraph.",

      requiredTopics: [
        /\b(music|sales)\b/i,
        /\b(streaming|downloads?|CDs?|methods?|formats?)\b/i
      ],

      measurePattern:
        /\b(percent|percentage|proportion|share)\b|%/i,

      forbiddenPatterns: [
        {
          regex: /\b(number of international conferences)\b/i,
          message: "Nội dung đang nhầm sang bài International Conferences."
        }
      ],

      chartFacts: null
    }
  };

  // ==========================================
  // 2. INITIALIZATION
  // ==========================================

  const lessonId = document.body.dataset.lesson;
  const lesson = LESSONS[lessonId];

  if (!lesson) {
    console.error(
      "Dynamic Engine: invalid lesson ID",
      lessonId
    );
    return;
  }

  const $ = selector => document.querySelector(selector);

  const DOM = {
    welcome: $("#welcome"),
    practice: $("#practice"),
    name: $("#studentName"),
    className: $("#studentClass"),
    startButton: $("#startButton"),
    startError: $("#startError"),
    userLabel: $("#userLabel"),

    lessonTitle: $("#lessonTitle"),
    prompt: $("#prompt"),
    chart: $("#chart"),

    progress: $("#progress"),
    progressText: $("#progressText"),
    nav: $("#nav"),

    section: $("#stepSection"),
    title: $("#stepTitle"),
    question: $("#question"),
    hint: $("#hint"),
    answerArea: $("#answerArea"),

    feedback: $("#feedback"),

    checkButton: $("#checkButton"),
    nextButton: $("#nextButton"),
    backButton: $("#backButton"),
    resetButton: $("#resetButton"),

    completedPanel: $("#completedPanel"),
    exportButton: $("#exportButton")
  };

  const STORAGE_KEY =
    "smartcom_dynamic_guided_v4_" + lessonId;

  const ENGINE_VERSION = "4.0";

  // Configure in HTML or a separate config file:
  //
  // window.DYNAMIC_GRADER_ENDPOINT =
  //   "https://your-domain.com/api/dynamic-grade";
  //
  // This must be YOUR secure backend endpoint.
  // Never expose an OpenAI API key in frontend code.

  const AI_ENDPOINT =
    typeof window.DYNAMIC_GRADER_ENDPOINT === "string"
      ? window.DYNAMIC_GRADER_ENDPOINT
      : "";

  const STRICT_AI_MODE =
    window.DYNAMIC_REQUIRE_AI === true;

  const AI_TIMEOUT_MS = 20000;

  // ==========================================
  // 3. UTILITIES
  // ==========================================

  function escapeHTML(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[character]
    );
  }

  function countWords(text) {
    const matches = String(text || "").match(
      /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu
    );

    return matches ? matches.length : 0;
  }

  function normalize(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function unique(items) {
    return [...new Set(items.filter(Boolean))];
  }

  function getParagraphs(text) {
    return String(text || "")
      .trim()
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(Boolean);
  }

  function getNumbers(text) {
    return (
      String(text || "").match(
        /\b\d+(?:[.,]\d+)?\b/g
      ) || []
    );
  }

  function hasAny(text, patterns) {
    return patterns.some(regex => regex.test(text));
  }

  function containsEntity(text) {
    if (lessonId === "01") {
      return /\b(city|cities|conference|conferences)\b/i
        .test(text);
    }

    return /\b(streaming|downloads?|CDs?|music|sales)\b/i
      .test(text);
  }

  const TREND_PATTERN =
    /\b(increase[ds]?|increasing|rise|rose|rising|grow|grew|grown|growth|climb(?:ed)?|surge[ds]?|jump(?:ed)?|decrease[ds]?|decreasing|decline[ds]?|drop(?:ped)?|fall|fell|fallen|fluctuat(?:e[ds]?|ing|ion)|remain(?:ed)?|stable|steady|unchanged|peak(?:ed)?|overtake|overtook|surpass(?:ed)?|highest|lowest|upward|downward)\b/i;

  const COMPARISON_PATTERN =
    /\b(compared|comparison|whereas|while|however|although|than|higher|lower|more|less|largest|smallest|similar|different|both|respectively|contrast|overtook|surpassed|exceeded|followed)\b/i;

  const CAUSE_PATTERN =
    /\b(because|due to|caused by|as a result of|owing to)\b/i;

  const PERSONAL_PATTERN =
    /\b(i think|i believe|in my opinion|i feel|we think)\b/i;

  const CHART_PATTERN =
    /\b(graph|chart|figure|diagram|line graph|illustration)\b/i;

  // ==========================================
  // 4. LEARNING STEPS
  // ==========================================

  const STEPS = [
    {
      section: "Phân tích",
      title: "Xác định đối tượng",
      type: "choice",

      question:
        "Biểu đồ đang thể hiện thông tin chính nào?",

      options: [
        lessonId === "01"
          ? "Số lượng hội nghị quốc tế tại ba thành phố"
          : "Tỷ lệ doanh số âm nhạc theo phương thức bán",

        "Nguyên nhân khiến dữ liệu thay đổi",

        "Quan điểm cá nhân về chủ đề"
      ],

      correct: 0,

      explanation:
        "IELTS Writing Task 1 yêu cầu mô tả " +
        "dữ liệu được cung cấp, không suy đoán nguyên nhân."
    },

    {
      section: "Phân tích",
      title: "Nhận diện xu hướng",
      type: "choice",

      question:
        "Khi phân tích Dynamic Dataset, " +
        "em cần ưu tiên quan sát điều gì?",

      options: [
        "Chỉ ghi tất cả số liệu của từng năm",

        "Xu hướng tổng thể, điểm nổi bật " +
        "và sự khác biệt giữa các đối tượng",

        "Nguyên nhân xã hội của sự thay đổi"
      ],

      correct: 1,

      explanation:
        "Cần nhìn toàn bộ giai đoạn trước khi " +
        "chọn dữ liệu cho Overview và Body."
    },

    {
      section: "Phân tích",
      title: "Xác định thay đổi nổi bật",
      type: "text",
      minWords: 7,

      question:
        "Quan sát biểu đồ và mô tả ít nhất một " +
        "xu hướng nổi bật, kèm tên đối tượng.",

      hint:
        "Có thể trả lời bằng tiếng Việt hoặc " +
        "tiếng Anh. Tập trung vào tăng, giảm, " +
        "dao động, ổn định hoặc sự vượt qua."
    },

    {
      section: "Phân tích",
      title: "Chia nhóm Body",
      type: "text",
      minWords: 12,

      question:
        "Em sẽ chia các đối tượng vào Body 1 " +
        "và Body 2 như thế nào? Giải thích lý do.",

      hint: lesson.groupingHint
    },

    {
      section: "Introduction",
      title: "Xác định thành phần",
      type: "choice",

      question:
        "Introduction cần trình bày những thành phần nào?",

      options: [
        "Đối tượng, đại lượng đo, thời gian và " +
        "loại biểu đồ khi phù hợp",

        "Tất cả số liệu và những thay đổi nổi bật",

        "Ý kiến và nguyên nhân của người viết"
      ],

      correct: 0,

      explanation:
        "Introduction paraphrase thông tin đề bài, " +
        "không phân tích dữ liệu."
    },

    {
      section: "Introduction",
      title: "Luyện paraphrase",
      type: "text",
      minWords: 8,

      question:
        "Viết một cách diễn đạt khác của " +
        "nội dung chính trong đề bài bằng tiếng Anh.",

      hint: lesson.introductionHint
    },

    {
      section: "Introduction",
      title: "Viết Introduction",
      type: "paragraph",
      rubric: "introduction",
      minWords: 12,

      question:
        "Viết một câu Introduction hoàn chỉnh " +
        "bằng tiếng Anh.",

      hint:
        "Giữ đúng thông tin của đề. " +
        "Không đưa nhận xét xu hướng hoặc " +
        "nguyên nhân vào Introduction."
    },

    {
      section: "Overview",
      title: "Chọn nội dung tổng quan",
      type: "choice",

      question:
        "Một Overview tốt cần ưu tiên điều gì?",

      options: [
        "Liệt kê toàn bộ số liệu trong biểu đồ",

        "Khái quát những xu hướng và khác biệt " +
        "nổi bật nhất",

        "Giải thích nguyên nhân biến động"
      ],

      correct: 1,

      explanation:
        "Overview thường tập trung vào hai hoặc " +
        "vài đặc điểm nổi bật, không liệt kê " +
        "tất cả giá trị chi tiết."
    },

    {
      section: "Overview",
      title: "Viết Overview",
      type: "paragraph",
      rubric: "overview",
      minWords: 18,

      question:
        "Viết Overview bằng tiếng Anh, thể hiện " +
        "ít nhất hai đặc điểm quan trọng của biểu đồ.",

      hint: lesson.overviewHint
    },

    {
      section: "Body 1",
      title: "Xác định số đầu kỳ",
      type: "data",
      minWords: 5,

      question:
        "Ghi tên đối tượng thuộc Body 1, " +
        "mốc thời gian đầu kỳ và giá trị tương ứng.",

      hint:
        "Sử dụng số liệu đọc trực tiếp từ biểu đồ."
    },

    {
      section: "Body 1",
      title: "Phân tích thay đổi",
      type: "data",
      minWords: 10,

      question:
        "Ghi nhận thay đổi đáng chú ý, số cuối kỳ " +
        "và một so sánh nếu phù hợp.",

      hint:
        "Chú ý các điểm tăng, giảm, dao động " +
        "hoặc giao nhau giữa các đường."
    },

    {
      section: "Body 1",
      title: "Viết Body 1",
      type: "paragraph",
      rubric: "body",
      minWords: 30,

      question:
        "Ghép các thông tin vừa phân tích thành " +
        "một đoạn Body 1 hoàn chỉnh bằng tiếng Anh.",

      hint:
        "Viết có trình tự thời gian và dùng " +
        "số liệu để hỗ trợ nhận xét."
    },

    {
      section: "Body 2",
      title: "Xác định số đầu kỳ",
      type: "data",
      minWords: 7,

      question:
        "Xác định đối tượng thuộc Body 2, " +
        "số đầu kỳ và xu hướng thay đổi.",

      hint:
        "Không lặp lại toàn bộ đối tượng " +
        "đã mô tả ở Body 1."
    },

    {
      section: "Body 2",
      title: "Số cuối kỳ và so sánh",
      type: "data",
      minWords: 9,

      question:
        "Ghi nhận số cuối kỳ và một điểm " +
        "so sánh giữa các đối tượng.",

      hint:
        "So sánh có thể là thứ hạng, độ lớn, " +
        "xu hướng hoặc mức chênh lệch."
    },

    {
      section: "Body 2",
      title: "Viết Body 2",
      type: "paragraph",
      rubric: "body",
      minWords: 30,

      question:
        "Viết đoạn Body 2 hoàn chỉnh bằng " +
        "tiếng Anh, có số liệu và so sánh.",

      hint:
        "Bảo đảm thông tin bổ sung cho Body 1, " +
        "không lặp lại nội dung không cần thiết."
    },

    {
      section: "Final Writing",
      title: "Tự viết toàn bài",
      type: "essay",
      rubric: "essay",
      minWords: 150,

      question:
        "Tự viết một bài IELTS Writing Task 1 " +
        "hoàn chỉnh, ít nhất 150 từ.",

      hint:
        "Viết độc lập theo bốn phần: Introduction, " +
        "Overview, Body 1 và Body 2. " +
        "Không có template hoặc bài mẫu."
    }
  ];

  // ==========================================
  // 5. STATE AND AUTOSAVE
  // ==========================================

  function initialState() {
    return {
      version: ENGINE_VERSION,

      name: "",
      className: "",

      startedAt: null,

      current: 0,
      unlocked: 0,

      answers: {},
      reviews: {},

      essay: "",
      completed: false,

      submittedAt: null
    };
  }

  let state = initialState();
  let checking = false;

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (!raw) return;

      const parsed = JSON.parse(raw);

      if (!parsed || typeof parsed !== "object") {
        return;
      }

      state = {
        ...initialState(),
        ...parsed,

        answers:
          parsed.answers && typeof parsed.answers === "object"
            ? parsed.answers
            : {},

        reviews:
          parsed.reviews && typeof parsed.reviews === "object"
            ? parsed.reviews
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
        "Cannot restore Dynamic practice:",
        error
      );
    }
  }

  function saveState() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
      );
    } catch (error) {
      console.warn(
        "Cannot save Dynamic practice:",
        error
      );
    }
  }

  loadState();

  // ==========================================
  // 6. ASSESSMENT LAYER 1
  // STRUCTURE AND DIRECT REQUIREMENTS
  // ==========================================

  function validateStructure(answer, step) {
    const errors = [];
    const warnings = [];
    const positives = [];

    const text = answer.trim();
    const wordTotal = countWords(text);

    if (!text) {
      errors.push("Em chưa nhập câu trả lời.");

      return {
        errors,
        warnings,
        positives
      };
    }

    if (step.minWords && wordTotal < step.minWords) {
      errors.push(
        `Câu trả lời mới có ${wordTotal} từ. ` +
        `Bước này cần tối thiểu ${step.minWords} từ.`
      );
    }

    if (step.type === "essay") {
      const paragraphs = getParagraphs(text);

      if (paragraphs.length < 4) {
        errors.push(
          "Bài viết cần có bốn đoạn tách biệt: " +
          "Introduction, Overview, Body 1 và Body 2."
        );
      }

      if (paragraphs.length > 5) {
        warnings.push(
          "Hãy kiểm tra cấu trúc bài. " +
          "Task 1 thường được triển khai gọn trong bốn đoạn."
        );
      }
    }

    if (/\b(\w+)\s+\1\b/i.test(text)) {
      warnings.push(
        "Có thể có lỗi lặp từ liên tiếp. " +
        "Hãy đọc lại câu trả lời."
      );
    }

    if (/\s+[,.!?]/.test(text)) {
      warnings.push(
        "Kiểm tra khoảng trắng trước dấu câu."
      );
    }

    if (!errors.length) {
      positives.push(
        "Đạt yêu cầu cấu trúc và độ dài tối thiểu."
      );
    }

    return {
      errors: unique(errors),
      warnings: unique(warnings),
      positives
    };
  }

  // ==========================================
  // 7. ASSESSMENT LAYER 2
  // LOCAL CONTENT EVIDENCE
  // ==========================================

  function validateContent(answer, step, index) {
    const errors = [];
    const warnings = [];
    const positives = [];

    const text = answer.trim();
    const numbers = getNumbers(text);

    // Detect obvious cross-lesson mismatches.

    for (const rule of lesson.forbiddenPatterns) {
      if (rule.regex.test(text)) {
        errors.push(rule.message);
      }
    }

    // Trend analysis.

    if (index === 2) {
      if (
        !TREND_PATTERN.test(text) &&
        !/\b(tăng|giảm|dao động|ổn định|vượt)\b/i
          .test(text)
      ) {
        warnings.push(
          "Chưa thấy dấu hiệu mô tả xu hướng. " +
          "Hãy nêu rõ đối tượng tăng, giảm " +
          "hay thay đổi như thế nào."
        );
      }
    }

    // Body grouping.

    if (index === 3) {
      if (
        !/\bbody\s*1\b/i.test(text) &&
        !/\bđoạn\s*1\b/i.test(text)
      ) {
        warnings.push(
          "Nên ghi rõ nhóm đối tượng của Body 1."
        );
      }

      if (
        !/\bbody\s*2\b/i.test(text) &&
        !/\bđoạn\s*2\b/i.test(text)
      ) {
        warnings.push(
          "Nên ghi rõ nhóm đối tượng của Body 2."
        );
      }
    }

    // Introduction.

    if (step.rubric === "introduction") {
      if (!containsEntity(text)) {
        warnings.push(
          "Kiểm tra lại đối tượng chính " +
          "được mô tả trong Introduction."
        );
      }

      if (!CHART_PATTERN.test(text)) {
        warnings.push(
          "Có thể sử dụng 'the graph', " +
          "'the line chart' hoặc một cách " +
          "diễn đạt tương đương."
        );
      }

      if (
        !lesson.measurePattern.test(text) &&
        !lesson.requiredTopics.every(
          regex => regex.test(text)
        )
      ) {
        warnings.push(
          "Hãy kiểm tra xem câu đã nêu đúng " +
          "đại lượng biểu đồ đo lường chưa."
        );
      }

      if (lesson.period) {
        if (
          !text.includes(String(lesson.period.start)) ||
          !text.includes(String(lesson.period.end))
        ) {
          warnings.push(
            "Introduction nên nêu chính xác " +
            "khoảng thời gian 2011–2018."
          );
        }
      }

      if (CAUSE_PATTERN.test(text)) {
        errors.push(
          "Introduction không nên suy đoán " +
          "nguyên nhân khiến số liệu thay đổi."
        );
      }

      if (PERSONAL_PATTERN.test(text)) {
        errors.push(
          "Không sử dụng quan điểm cá nhân " +
          "trong IELTS Writing Task 1."
        );
      }

      if (numbers.length > 2 && lesson.period) {
        warnings.push(
          "Introduction có thể đang chứa " +
          "số liệu chi tiết không cần thiết."
        );
      }
    }

    // Overview.

    if (step.rubric === "overview") {
      if (!TREND_PATTERN.test(text)) {
        warnings.push(
          "Overview cần thể hiện xu hướng " +
          "hoặc đặc điểm nổi bật của biểu đồ."
        );
      }

      if (!COMPARISON_PATTERN.test(text)) {
        warnings.push(
          "Hãy cân nhắc bổ sung một điểm " +
          "so sánh quan trọng giữa các đối tượng."
        );
      }

      if (numbers.length >= 3) {
        warnings.push(
          "Overview thường không cần " +
          "liệt kê nhiều giá trị số chi tiết."
        );
      }

      if (CAUSE_PATTERN.test(text)) {
        errors.push(
          "Không suy đoán nguyên nhân " +
          "thay đổi khi biểu đồ không cung cấp."
        );
      }

      if (PERSONAL_PATTERN.test(text)) {
        errors.push(
          "Overview cần khách quan, " +
          "không thể hiện ý kiến cá nhân."
        );
      }
    }

    // Data extraction.

    if (step.type === "data") {
      if (numbers.length < 1) {
        errors.push(
          "Bước này yêu cầu ghi lại mốc thời gian " +
          "hoặc giá trị số từ biểu đồ."
        );
      }

      if (!containsEntity(text)) {
        warnings.push(
          "Hãy ghi rõ đối tượng mà số liệu " +
          "đang đề cập."
        );
      }
    }

    // Body paragraphs.

    if (step.rubric === "body") {
      if (numbers.length < 2) {
        errors.push(
          "Body cần có dẫn chứng số liệu " +
          "hoặc mốc thời gian cụ thể."
        );
      }

      if (
        !TREND_PATTERN.test(text) &&
        !COMPARISON_PATTERN.test(text)
      ) {
        warnings.push(
          "Đoạn Body cần mô tả diễn biến " +
          "hoặc so sánh dữ liệu."
        );
      }

      if (lessonId === "02") {
        if (!lesson.measurePattern.test(text)) {
          warnings.push(
            "Đây là biểu đồ tỷ lệ phần trăm. " +
            "Hãy kiểm tra đơn vị số liệu."
          );
        }
      }
    }

    // Final essay.

    if (step.type === "essay") {
      const paragraphs = getParagraphs(text);

      if (!containsEntity(text)) {
        warnings.push(
          "Bài viết chưa thể hiện rõ " +
          "đối tượng của biểu đồ."
        );
      }

      if (!TREND_PATTERN.test(text)) {
        warnings.push(
          "Cần thể hiện những xu hướng " +
          "quan trọng trong bài."
        );
      }

      if (!COMPARISON_PATTERN.test(text)) {
        warnings.push(
          "Cần xem xét bổ sung so sánh " +
          "giữa các đối tượng."
        );
      }

      if (paragraphs.length >= 4) {
        if (!TREND_PATTERN.test(paragraphs[1])) {
          warnings.push(
            "Đoạn Overview chưa thể hiện " +
            "rõ xu hướng nổi bật."
          );
        }

        if (getNumbers(paragraphs[2]).length < 1) {
          warnings.push(
            "Body 1 nên có số liệu minh họa."
          );
        }

        if (getNumbers(paragraphs[3]).length < 1) {
          warnings.push(
            "Body 2 nên có số liệu minh họa."
          );
        }
      }

      if (PERSONAL_PATTERN.test(text)) {
        errors.push(
          "IELTS Academic Task 1 không yêu cầu " +
          "trình bày quan điểm cá nhân."
        );
      }
    }

    // Important: local checks cannot verify chart facts.

    const needsChartVerification = [
      2, 3, 8, 9, 10, 11, 12, 13, 14, 15
    ].includes(index);

    if (needsChartVerification) {
      warnings.push(
        "Cần đối chiếu nội dung và số liệu " +
        "với biểu đồ gốc. Bộ chấm trên " +
        "trình duyệt chưa xác minh được " +
        "độ chính xác của dữ liệu."
      );
    }

    if (errors.length === 0) {
      positives.push(
        "Không phát hiện lỗi nội dung " +
        "chắc chắn theo bộ quy tắc hiện có."
      );
    }

    return {
      errors: unique(errors),
      warnings: unique(warnings),
      positives: unique(positives),
      needsChartVerification
    };
  }

  // ==========================================
  // 8. ASSESSMENT LAYER 3
  // OPTIONAL AI GRADER
  // ==========================================

  /*
   * Backend request:
   *
   * POST window.DYNAMIC_GRADER_ENDPOINT
   *
   * {
   *   schemaVersion: "4.0",
   *   lessonId: "01" | "02",
   *   stepIndex: number,
   *   taskPrompt: string,
   *   answer: string,
   *   rubric: string,
   *   requirements: string,
   *   chartFactsAvailable: boolean
   * }
   *
   * Expected response:
   *
   * {
   *   schemaVersion: "4.0",
   *   verdict: "pass" | "revise" | "needs_review",
   *   issues: [
   *     {
   *       category: string,
   *       original: string,
   *       correction: string,
   *       explanation: string,
   *       severity: "minor" | "major"
   *     }
   *   ],
   *   explanation: string,
   *   suggestion: string,
   *   verifiedChart: boolean
   * }
   *
   * The server must verify chart data independently.
   * Client-side verifiedChart is not trusted as proof.
   */

  async function assessWithAI(answer, step, index) {
    if (!AI_ENDPOINT) {
      return null;
    }

    const controller = new AbortController();

    const timeout = setTimeout(
      () => controller.abort(),
      AI_TIMEOUT_MS
    );

    try {
      const response = await fetch(AI_ENDPOINT, {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        credentials: "same-origin",

        signal: controller.signal,

        body: JSON.stringify({
          schemaVersion: ENGINE_VERSION,

          lessonId,
          stepIndex: index,

          section: step.section,
          title: step.title,

          taskPrompt: lesson.prompt,
          answer,

          rubric: step.rubric || step.type,
          requirements: step.question,

          chartFactsAvailable:
            lesson.chartFacts !== null,

          assessmentPolicy: {
            acceptParaphrases: true,
            requireCorrectMeaning: true,
            identifyDefiniteErrorsOnly: true,
            doNotInventChartValues: true,
            doNotRequireExactModelWording: true,
            preferActionableFeedback: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(
          "Grader HTTP " + response.status
        );
      }

      const result = await response.json();

      if (
        !result ||
        result.schemaVersion !== ENGINE_VERSION ||
        !["pass", "revise", "needs_review"]
          .includes(result.verdict) ||
        !Array.isArray(result.issues)
      ) {
        throw new Error(
          "Invalid grader response schema"
        );
      }

      const issues = result.issues
        .filter(
          issue =>
            issue &&
            typeof issue === "object"
        )
        .slice(0, 12)
        .map(issue => ({
          category:
            String(issue.category || "Content")
              .slice(0, 80),

          original:
            String(issue.original || "")
              .slice(0, 350),

          correction:
            String(issue.correction || "")
              .slice(0, 350),

          explanation:
            String(issue.explanation || "")
              .slice(0, 600),

          severity:
            issue.severity === "major"
              ? "major"
              : "minor"
        }));

      return {
        available: true,
        verdict: result.verdict,
        issues,

        explanation:
          String(result.explanation || "")
            .slice(0, 1200),

        suggestion:
          String(result.suggestion || "")
            .slice(0, 1000),

        verifiedChart:
          result.verifiedChart === true
      };

    } catch (error) {
      console.warn(
        "Dynamic AI grader unavailable:",
        error
      );

      return {
        available: false,
        verdict: "needs_review",
        issues: [],
        explanation:
          "Không kết nối được hệ thống chấm AI.",
        suggestion:
          "Vui lòng kiểm tra kết nối hoặc " +
          "thử lại sau.",
        verifiedChart: false
      };

    } finally {
      clearTimeout(timeout);
    }
  }

  // ==========================================
  // 9. ASSESSMENT ORCHESTRATOR
  // ==========================================

  async function gradeAnswer(answer, step, index) {
    const structure = validateStructure(
      answer,
      step
    );

    const content = validateContent(
      answer,
      step,
      index
    );

    const errors = unique([
      ...structure.errors,
      ...content.errors
    ]);

    const warnings = unique([
      ...structure.warnings,
      ...content.warnings
    ]);

    const positives = unique([
      ...structure.positives,
      ...content.positives
    ]);

    if (errors.length > 0) {
      return {
        verdict: "revise",
        level: "local",

        errors,
        warnings,
        positives,

        issues: [],
        explanation:
          "Câu trả lời chưa đáp ứng " +
          "một số yêu cầu bắt buộc.",

        verifiedChart: false
      };
    }

    const ai = await assessWithAI(
      answer,
      step,
      index
    );

    if (ai && ai.available) {
      return {
        verdict: ai.verdict,
        level: "ai",

        errors: [],
        warnings,
        positives,

        issues: ai.issues,
        explanation: ai.explanation,
        suggestion: ai.suggestion,

        verifiedChart: ai.verifiedChart
      };
    }

    // No connected AI:
    // Local checks only produce a provisional verdict.

    if (STRICT_AI_MODE) {
      return {
        verdict: "needs_review",
        level: "local",

        errors: [],
        warnings,
        positives,

        issues: [],

        explanation:
          "Chế độ chấm AI bắt buộc đang bật, " +
          "nhưng chưa có kết quả AI hợp lệ.",

        verifiedChart: false
      };
    }

    return {
      verdict: "pass_provisional",
      level: "local",

      errors: [],
      warnings,
      positives,

      issues: [],

      explanation:
        "Đã vượt qua các điều kiện kiểm tra " +
        "tự động trên trình duyệt. " +
        "Đây chưa phải xác nhận chính xác " +
        "về ngữ nghĩa hoặc số liệu biểu đồ.",

      verifiedChart: false
    };
  }

  // ==========================================
  // 10. FEEDBACK RENDERING
  // ==========================================

  function showFeedback(result) {
    const element = DOM.feedback;

    const passed = [
      "pass",
      "pass_provisional"
    ].includes(result.verdict);

    element.hidden = false;

    element.className =
      "feedback " +
      (passed ? "success" : "warning");

    let title = "";

    if (result.verdict === "pass") {
      title = "Đạt yêu cầu — có thể tiếp tục";
    } else if (
      result.verdict === "pass_provisional"
    ) {
      title =
        "Đạt kiểm tra sơ bộ — đã mở bước tiếp theo";
    } else if (
      result.verdict === "needs_review"
    ) {
      title = "Cần xác minh thêm";
    } else {
      title = "Cần sửa trước khi tiếp tục";
    }

    let html =
      `<strong>${escapeHTML(title)}</strong>`;

    if (result.explanation) {
      html +=
        `<p>${escapeHTML(result.explanation)}</p>`;
    }

    if (result.errors?.length) {
      html +=
        "<h4>Những điểm cần sửa</h4><ul>";

      result.errors.forEach(error => {
        html += `<li>${escapeHTML(error)}</li>`;
      });

      html += "</ul>";
    }

    if (result.issues?.length) {
      html += "<h4>Phản hồi chi tiết</h4>";

      result.issues.forEach(issue => {
        html += '<div class="grading-issue">';

        html +=
          `<strong>${escapeHTML(
            issue.category
          )}</strong>`;

        if (issue.original) {
          html +=
            `<p><b>Đoạn cần xem:</b> ` +
            `${escapeHTML(issue.original)}</p>`;
        }

        if (issue.correction) {
          html +=
            `<p><b>Gợi ý sửa:</b> ` +
            `${escapeHTML(issue.correction)}</p>`;
        }

        if (issue.explanation) {
          html +=
            `<p>${escapeHTML(
              issue.explanation
            )}</p>`;
        }

        html += "</div>";
      });
    }

    if (result.suggestion) {
      html +=
        `<p><b>Hướng dẫn:</b> ` +
        `${escapeHTML(result.suggestion)}</p>`;
    }

    if (result.warnings?.length) {
      html +=
        "<h4>Những điểm nên kiểm tra</h4><ul>";

      result.warnings.forEach(warning => {
        html +=
          `<li>${escapeHTML(warning)}</li>`;
      });

      html += "</ul>";
    }

    element.innerHTML = html;
  }

  // ==========================================
  // 11. RENDER LESSON
  // ==========================================

  function render() {
    const step = STEPS[state.current];

    DOM.lessonTitle.textContent =
      `${lesson.label} · ${lesson.title}`;

    DOM.prompt.textContent = lesson.prompt;

    DOM.chart.alt =
      "Line graph — " + lesson.title;

    DOM.welcome.hidden = Boolean(
      state.startedAt
    );

    DOM.practice.hidden = !state.startedAt;

    DOM.userLabel.textContent =
      state.name
        ? state.name +
          (state.className
            ? " · " + state.className
            : "")
        : "";

    if (!state.startedAt) {
      DOM.name.value = state.name;
      DOM.className.value = state.className;
      return;
    }

    const currentProgress =
      ((state.unlocked + 1) /
        STEPS.length) * 100;

    DOM.progress.style.width =
      currentProgress + "%";

    DOM.progressText.textContent =
      `Đã mở ${state.unlocked + 1}` +
      `/${STEPS.length} bước`;

    renderNavigation();
    renderCurrentStep(step);

    DOM.backButton.disabled =
      state.current === 0;

    DOM.nextButton.hidden =
      state.current >= state.unlocked ||
      state.current >= STEPS.length - 1;

    DOM.completedPanel.hidden =
      !state.completed;

    DOM.feedback.hidden = true;
  }

  function renderNavigation() {
    DOM.nav.innerHTML = STEPS.map(
      (step, index) => {
        const locked =
          index > state.unlocked;

        const active =
          index === state.current;

        const done =
          index < state.unlocked;

        const classes = [
          "step-chip",
          active ? "active" : "",
          done ? "done" : ""
        ].join(" ");

        return `
          <button
            type="button"
            class="${classes}"
            data-step="${index}"
            ${locked ? "disabled" : ""}
            ${active ? 'aria-current="step"' : ""}
          >
            ${done ? "✓" : index + 1}.
            ${escapeHTML(step.section)}
          </button>
        `;
      }
    ).join("");
  }

  function renderCurrentStep(step) {
    DOM.section.textContent =
      step.section;

    DOM.title.textContent =
      `${state.current + 1}. ${step.title}`;

    DOM.question.textContent =
      step.question;

    DOM.hint.textContent =
      step.hint || "";

    DOM.hint.hidden =
      !step.hint;

    const existingAnswer =
      step.type === "essay"
        ? state.essay
        : (state.answers[state.current] ?? "");

    if (step.type === "choice") {
      DOM.answerArea.innerHTML = `
        <div class="choices">
          ${step.options.map(
            (option, index) => `
              <label>
                <input
                  type="radio"
                  name="answer"
                  value="${index}"
                  ${
                    String(existingAnswer) === String(index)
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
          : step.type === "paragraph"
            ? 7
            : 4;

      DOM.answerArea.innerHTML = `
        <textarea
          id="answer"
          rows="${rows}"
          lang="en"
          spellcheck="true"
          placeholder="${
            step.type === "essay"
              ? "Write your complete essay independently..."
              : "Write your answer here..."
          }"
        >${escapeHTML(existingAnswer)}</textarea>

        <div class="word-line" id="words">
          ${countWords(existingAnswer)} từ
        </div>
      `;
    }

    DOM.checkButton.textContent =
      step.type === "essay"
        ? "Nộp bài hoàn chỉnh"
        : "Kiểm tra & mở khóa";

    DOM.checkButton.disabled = false;
  }

  // ==========================================
  // 12. READING AND SAVING ANSWERS
  // ==========================================

  function readAnswer() {
    const step = STEPS[state.current];

    if (step.type === "choice") {
      return (
        document.querySelector(
          'input[name="answer"]:checked'
        )?.value ?? ""
      );
    }

    return $("#answer")?.value || "";
  }

  function persistCurrentAnswer() {
    if (!state.startedAt) return;

    const step = STEPS[state.current];
    const answer = readAnswer();

    if (step.type === "essay") {
      state.essay = answer;
    } else {
      state.answers[state.current] = answer;
    }

    saveState();
  }

  // ==========================================
  // 13. UNLOCK LOGIC
  // ==========================================

  function unlockStep(result) {
    const current = state.current;

    state.reviews[current] = {
      verdict: result.verdict,
      level: result.level,
      checkedAt: new Date().toISOString(),
      verifiedChart: result.verifiedChart
    };

    state.unlocked = Math.max(
      state.unlocked,
      Math.min(
        STEPS.length - 1,
        current + 1
      )
    );

    saveState();

    DOM.nextButton.hidden =
      current >= state.unlocked;

    renderNavigation();

    DOM.progress.style.width =
      (
        ((state.unlocked + 1) /
          STEPS.length) * 100
      ) + "%";

    DOM.progressText.textContent =
      `Đã mở ${state.unlocked + 1}` +
      `/${STEPS.length} bước`;
  }

  // ==========================================
  // 14. CHECK CURRENT ANSWER
  // ==========================================

  async function checkCurrentStep() {
    if (checking) return;

    const stepIndex = state.current;
    const step = STEPS[stepIndex];

    const answer = readAnswer().trim();

    persistCurrentAnswer();

    if (step.type === "choice") {
      if (answer === "") {
        showFeedback({
          verdict: "revise",
          explanation:
            "Hãy chọn một đáp án trước khi kiểm tra.",
          errors: [],
          warnings: [],
          issues: []
        });
        return;
      }

      if (Number(answer) !== step.correct) {
        showFeedback({
          verdict: "revise",
          explanation: step.explanation,
          errors: [
            "Đáp án chưa chính xác. " +
            "Hãy đọc hướng dẫn và chọn lại."
          ],
          warnings: [],
          issues: []
        });
        return;
      }

      const result = {
        verdict: "pass",
        level: "deterministic",
        verifiedChart: false,
        explanation: step.explanation,
        errors: [],
        warnings: [],
        issues: []
      };

      showFeedback(result);
      unlockStep(result);
      return;
    }

    checking = true;

    DOM.checkButton.disabled = true;
    DOM.checkButton.textContent =
      "Đang kiểm tra...";

    try {
      const result = await gradeAnswer(
        answer,
        step,
        stepIndex
      );

      showFeedback(result);

      const canPass = [
        "pass",
        "pass_provisional"
      ].includes(result.verdict);

      if (!canPass) {
        return;
      }

      if (step.type !== "essay") {
        unlockStep(result);
        return;
      }

      // Final essay submission.

      state.completed = true;

      state.submittedAt =
        new Date().toISOString();

      state.reviews[stepIndex] = {
        verdict: result.verdict,
        level: result.level,
        checkedAt: state.submittedAt,
        verifiedChart: result.verifiedChart
      };

      saveState();

      DOM.completedPanel.hidden = false;

    } catch (error) {
      console.error(
        "Dynamic grading error:",
        error
      );

      showFeedback({
        verdict: "needs_review",
        explanation:
          "Có lỗi trong quá trình kiểm tra. " +
          "Câu trả lời đã được lưu trên trình duyệt.",
        errors: [],
        warnings: [],
        issues: []
      });

    } finally {
      checking = false;

      DOM.checkButton.disabled = false;

      DOM.checkButton.textContent =
        step.type === "essay"
          ? "Nộp bài hoàn chỉnh"
          : "Kiểm tra & mở khóa";
    }
  }

  // ==========================================
  // 15. START PRACTICE
  // ==========================================

  function startPractice() {
    const name = DOM.name.value.trim();
    const className =
      DOM.className.value.trim();

    if (!name) {
      DOM.startError.textContent =
        "Vui lòng nhập họ và tên.";
      DOM.name.focus();
      return;
    }

    state.name = name;
    state.className = className;

    if (!state.startedAt) {
      state.startedAt = Date.now();
    }

    DOM.startError.textContent = "";

    saveState();
    render();
  }

  // ==========================================
  // 16. NAVIGATION
  // ==========================================

  function goToStep(index) {
    if (
      checking ||
      index < 0 ||
      index >= STEPS.length ||
      index > state.unlocked
    ) {
      return;
    }

    persistCurrentAnswer();

    state.current = index;

    saveState();
    render();
  }

  function nextStep() {
    goToStep(state.current + 1);
  }

  function previousStep() {
    goToStep(state.current - 1);
  }

  // ==========================================
  // 17. RESET
  // ==========================================

  function resetPractice() {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa toàn bộ tiến độ " +
      "Dynamic Datasets " + lessonId + "?"
    );

    if (!confirmed) return;

    localStorage.removeItem(STORAGE_KEY);

    state = initialState();

    render();
  }

  // ==========================================
  // 18. EXPORT FINAL ESSAY
  // ==========================================

  function exportEssay() {
    if (!state.essay.trim()) {
      return;
    }

    const content = [
      lesson.label,
      lesson.title,

      "",
      "Student: " + state.name,
      "Class: " + state.className,

      "",
      "IELTS Academic Writing Task 1",
      lesson.prompt,

      "",
      "STUDENT ESSAY",
      "",

      state.essay,

      "",
      "Word count: " + countWords(state.essay),

      "Assessment status: " +
        (
          state.reviews[STEPS.length - 1]
            ?.verdict || "not_assessed"
        ),

      "Submitted at: " +
        (state.submittedAt || "")
    ].join("\n");

    const blob = new Blob(
      [content],
      {
        type: "text/plain;charset=utf-8"
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download =
      `Dynamic-Datasets-${lessonId}-` +
      `Writing-Task-1.txt`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  // ==========================================
  // 19. EVENT BINDINGS
  // ==========================================

  DOM.startButton.addEventListener(
    "click",
    startPractice
  );

  DOM.checkButton.addEventListener(
    "click",
    checkCurrentStep
  );

  DOM.nextButton.addEventListener(
    "click",
    nextStep
  );

  DOM.backButton.addEventListener(
    "click",
    previousStep
  );

  DOM.resetButton.addEventListener(
    "click",
    resetPractice
  );

  DOM.exportButton.addEventListener(
    "click",
    exportEssay
  );

  DOM.nav.addEventListener(
    "click",
    event => {
      const button = event.target.closest(
        "[data-step]"
      );

      if (!button) return;

      goToStep(
        Number(button.dataset.step)
      );
    }
  );

  DOM.answerArea.addEventListener(
    "input",
    () => {
      persistCurrentAnswer();

      const counter = $("#words");

      if (counter) {
        counter.textContent =
          countWords(readAnswer()) + " từ";
      }

      // Hide outdated feedback when editing.

      DOM.feedback.hidden = true;
    }
  );

  DOM.answerArea.addEventListener(
    "change",
    persistCurrentAnswer
  );

  // ==========================================
  // 20. INITIAL RENDER
  // ==========================================

  render();

})();
