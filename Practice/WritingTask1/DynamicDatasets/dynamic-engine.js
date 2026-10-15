
/*
 SMARTCOM IELTS WRITING TASK 1
 DYNAMIC DATASETS — FREE GRADING ENGINE v6.0

 - No paid API
 - Shared by lesson 01 and 02
 - 16 guided learning steps
 - Browser spellcheck
 - Local grammar and spelling diagnostics
 - Chart fact checks
 - Autosave and independent final writing
*/

(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const lessonId = document.body.dataset.lesson;

  const LESSONS = {
    "01": {
      title: "International Conferences",
      prompt:
        "The line graph provides information about the number of international conferences that took place in three different cities. Provide an overview of the information by identifying and describing the key details, and include comparisons where appropriate.",
      names: ["City A", "City B", "City C"],
      start: 1965,
      end: 2010,
      unit: "conferences",
      trends: {
        A: "down",
        B: "down",
        C: "up"
      },
      values: {
        1965: {A:35, B:31, C:0},
        1975: {A:20, B:29, C:10},
        1985: {A:30, B:29, C:20},
        1995: {A:29, B:27.5, C:30},
        2005: {A:30, B:29, C:24},
        2010: {A:20, B:25, C:29}
      }
    },
    "02": {
      title: "Music Sales by Method",
      prompt:
        "The graph below shows the percentage of total music sales by different methods between 2011 and 2018.",
      names: ["Streaming", "Downloads", "CDs"],
      start: 2011,
      end: 2018,
      unit: "percentage",
      trends: null,
      values: null
    }
  };

  const lesson = LESSONS[lessonId];

  if (!lesson) {
    console.error("Unknown lesson:", lessonId);
    return;
  }

  const STORE = "smartcom_dynamic_evidence_v5_" + lessonId;

  const esc = value =>
    String(value ?? "").replace(/[&<>"']/g, x => ({
      "&":"&amp;",
      "<":"&lt;",
      ">":"&gt;",
      '"':"&quot;",
      "'":"&#39;"
    })[x]);

  function words(text) {
    return (
      String(text || "").match(
        /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu
      ) || []
    ).length;
  }

  function normalized(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/\s+/g, " ")
      .trim();
  }

  const STEPS = [
    {
      section:"Phân tích",
      title:"Xác định đề bài",
      type:"choice",
      question:"Biểu đồ thể hiện nội dung chính nào?",
      options:lessonId === "01"
        ? [
          "Số hội nghị quốc tế tại ba thành phố",
          "Nguyên nhân thay đổi số hội nghị",
          "Quan điểm cá nhân"
        ]
        : [
          "Tỷ lệ doanh số âm nhạc theo phương thức bán",
          "Nguyên nhân khiến doanh số thay đổi",
          "Số lượng ca sĩ"
        ],
      correct:0
    },
    {
      section:"Phân tích",
      title:"Cách đọc Dynamic Dataset",
      type:"choice",
      question:"Cần ưu tiên xác định điều gì?",
      options:[
        "Liệt kê tất cả số liệu",
        "Xu hướng, thay đổi nổi bật và so sánh",
        "Nguyên nhân xã hội"
      ],
      correct:1
    },
    {
      section:"Phân tích",
      title:"Nhận diện xu hướng",
      type:"analysis",
      min:8,
      question:
        "Mô tả các xu hướng tổng thể nổi bật trong biểu đồ.",
      hint:
        "Nêu rõ đối tượng nào tăng, giảm hoặc dao động."
    },
    {
      section:"Phân tích",
      title:"Chia nhóm Body",
      type:"group",
      min:10,
      question:
        "Em sẽ chia các đối tượng vào Body 1 và Body 2 như thế nào? Giải thích lý do.",
      hint:
        "Có thể có nhiều cách nhóm hợp lý. Không mô tả sai xu hướng."
    },
    {
      section:"Introduction",
      title:"Xác định thành phần",
      type:"choice",
      question:"Introduction cần chứa thông tin nào?",
      options:[
        "Đối tượng, đại lượng và giai đoạn",
        "Tất cả số liệu chi tiết",
        "Nguyên nhân và ý kiến"
      ],
      correct:0
    },
    {
      section:"Introduction",
      title:"Paraphrase đề bài",
      type:"intro",
      min:10,
      question:"Paraphrase nội dung đề bài bằng tiếng Anh.",
      hint:"Giữ nguyên ý nghĩa của đề."
    },
    {
      section:"Introduction",
      title:"Viết Introduction",
      type:"intro",
      min:12,
      question:"Viết một Introduction hoàn chỉnh.",
      hint:"Không đưa nhận xét xu hướng vào phần này."
    },
    {
      section:"Overview",
      title:"Chọn ý chính",
      type:"choice",
      question:"Overview cần tập trung vào điều gì?",
      options:[
        "Liệt kê mọi số liệu",
        "Xu hướng và thay đổi nổi bật",
        "Giải thích nguyên nhân"
      ],
      correct:1
    },
    {
      section:"Overview",
      title:"Viết Overview",
      type:"overview",
      min:18,
      question:"Viết Overview bằng tiếng Anh.",
      hint:"Nêu xu hướng và đặc điểm nổi bật. Hạn chế số liệu cụ thể."
    },
    {
      section:"Body 1",
      title:"Xác định số đầu kỳ",
      type:"data",
      min:5,
      question:"Nêu đối tượng, năm đầu và giá trị đầu kỳ.",
      hint:"Đọc trực tiếp dữ liệu trên biểu đồ."
    },
    {
      section:"Body 1",
      title:"Phân tích thay đổi",
      type:"data",
      min:10,
      question:"Mô tả thay đổi, mốc nổi bật và số cuối kỳ.",
      hint:"Có thể ghi dữ liệu bằng tiếng Việt hoặc tiếng Anh."
    },
    {
      section:"Body 1",
      title:"Viết Body 1",
      type:"body",
      min:30,
      question:"Viết đoạn Body 1 hoàn chỉnh bằng tiếng Anh.",
      hint:"Dùng số liệu tiêu biểu và trình tự hợp lý."
    },
    {
      section:"Body 2",
      title:"Xác định số đầu kỳ",
      type:"data",
      min:5,
      question:"Xác định đối tượng của Body 2 và số đầu kỳ.",
      hint:"Không bỏ sót đối tượng chưa mô tả."
    },
    {
      section:"Body 2",
      title:"So sánh số cuối kỳ",
      type:"data",
      min:10,
      question:"Nêu số cuối kỳ và một điểm so sánh.",
      hint:"Chú ý cùng mốc thời gian và đơn vị."
    },
    {
      section:"Body 2",
      title:"Viết Body 2",
      type:"body",
      min:30,
      question:"Viết đoạn Body 2 hoàn chỉnh bằng tiếng Anh.",
      hint:"Bổ sung các đối tượng còn lại."
    },
    {
      section:"Final Writing",
      title:"Tự viết toàn bài",
      type:"essay",
      min:150,
      question:
        "Tự viết toàn bài IELTS Writing Task 1, tối thiểu 150 từ.",
      hint:
        "Viết bốn đoạn: Introduction, Overview, Body 1, Body 2."
    }
  ];

  function freshState() {
    return {
      name:"",
      className:"",
      started:false,
      current:0,
      unlocked:0,
      answers:{},
      grades:{},
      finished:false
    };
  }

  let state = freshState();

  try {
    const saved = JSON.parse(localStorage.getItem(STORE));
    if (saved && typeof saved === "object") {
      state = {...freshState(), ...saved};
      state.answers = saved.answers || {};
      state.grades = saved.grades || {};
      state.started = Boolean(
        saved.started || saved.startedAt
      );
      state.unlocked = Math.max(
        0,
        Math.min(15, Number(saved.unlocked) || 0)
      );
      state.current = Math.max(
        0,
        Math.min(state.unlocked, Number(saved.current) || 0)
      );
    }
  } catch (e) {
    console.warn("Autosave restore error", e);
  }

  function save() {
    try {
      localStorage.setItem(STORE, JSON.stringify(state));
    } catch (e) {
      console.warn("Autosave unavailable", e);
    }
  }

  /*
   SPELLING / GRAMMAR RULES

   These rules only detect specific known errors.
   They cannot replace full contextual grammar checking.
  */

  const RULES = [
    {
      id:"spelling-increase",
      pattern:/\bincrese(?:d|s)?\b/gi,
      correction:"increase / increased",
      message:"Kiểm tra chính tả của increase."
    },
    {
      id:"spelling-decrease",
      pattern:/\bdecrese(?:d|s)?\b/gi,
      correction:"decrease / decreased",
      message:"Kiểm tra chính tả của decrease."
    },
    {
      id:"spelling-significant",
      pattern:/\bsignifcant\b/gi,
      correction:"significant",
      message:"Thiếu chữ i trong significant."
    },
    {
      id:"spelling-dramatically",
      pattern:/\bdramitically\b/gi,
      correction:"dramatically",
      message:"Sai chính tả của dramatically."
    },
    {
      id:"spelling-percentage",
      pattern:/\bpercantage\b/gi,
      correction:"percentage",
      message:"Sai chính tả của percentage."
    },
    {
      id:"tense-increased",
      pattern:/\b(has|have|had)\s+increase\b/gi,
      correction:"has/have/had increased",
      message:"Sau have/has/had cần dùng past participle."
    },
    {
      id:"tense-decreased",
      pattern:/\b(has|have|had)\s+decrease\b/gi,
      correction:"has/have/had decreased",
      message:"Sau have/has/had cần dùng past participle."
    },
    {
      id:"tense-was-increase",
      pattern:/\b(was|were)\s+increase\b/gi,
      correction:"increased / was increasing",
      message:"Không dùng was/were + động từ nguyên mẫu."
    },
    {
      id:"tense-was-decrease",
      pattern:/\b(was|were)\s+decrease\b/gi,
      correction:"decreased / was decreasing",
      message:"Không dùng was/were + động từ nguyên mẫu."
    },
    {
      id:"wordform-dramatic",
      pattern:/\b(increase|increased|rise|rose|grew|fell|decrease|decreased)\s+dramatic\b/gi,
      correction:"... dramatically",
      message:"Sau động từ chỉ xu hướng cần trạng từ."
    },
    {
      id:"wordform-significant",
      pattern:/\b(increase|increased|decrease|decreased|rise|rose|fell)\s+significant\b/gi,
      correction:"... significantly",
      message:"Dùng trạng từ significantly để bổ nghĩa động từ."
    },
    {
      id:"subject-number",
      pattern:/\bthe number of\s+[\w\s]{1,35}?\s+(were|have)\b/gi,
      correction:"was / has (tùy ngữ cảnh)",
      message:"Chủ ngữ chính 'the number' thường dùng động từ số ít."
    },
    {
      id:"subject-amount",
      pattern:/\bthe amount of\s+[\w\s]{1,35}?\s+were\b/gi,
      correction:"was",
      message:"'The amount' là chủ ngữ số ít."
    },
    {
      id:"subject-it",
      pattern:/\bit were\b/gi,
      correction:"it was",
      message:"It đi với was ở quá khứ đơn."
    },
    {
      id:"subject-they",
      pattern:/\bthey was\b/gi,
      correction:"they were",
      message:"They đi với were."
    },
    {
      id:"double-comparative",
      pattern:/\bmore higher\b|\bmore lower\b/gi,
      correction:"higher / lower",
      message:"Không dùng more trước higher hoặc lower."
    },
    {
      id:"many-percentage",
      pattern:/\bmany percentage\b/gi,
      correction:"a high percentage / many percentage points",
      message:"Cần diễn đạt rõ tỷ lệ hay số điểm phần trăm."
    }
  ];

  function checkLanguage(text) {
    const issues = [];

    for (const rule of RULES) {
      rule.pattern.lastIndex = 0;

      for (const match of text.matchAll(rule.pattern)) {
        issues.push({
          start:match.index,
          end:match.index + match[0].length,
          original:match[0],
          correction:rule.correction,
          message:rule.message,
          id:rule.id
        });
      }
    }

    if (/\s+[,.!?;:]/.test(text)) {
      issues.push({
        original:"Dấu câu",
        correction:"Bỏ khoảng trắng trước dấu câu",
        message:"Không đặt dấu cách trước dấu câu.",
        id:"punctuation"
      });
    }

    const repeat = text.match(/\b([a-z]{2,})\s+\1\b/i);
    if (repeat) {
      issues.push({
        original:repeat[0],
        correction:repeat[1],
        message:"Có từ bị lặp liên tiếp.",
        id:"repetition"
      });
    }

    return issues;
  }

  /*
   CHART CONTRADICTION DETECTION

   Only checks explicitly known overall trends.
   It does not try to infer arbitrary sentence meaning.
  */

  const UP_EN =
    "(?:increas\\w*|r[oia]s[een]*|grew|grow\\w*|climb\\w*|surge\\w*|upward)";
  const DOWN_EN =
    "(?:decreas\\w*|declin\\w*|fell|fall\\w*|drop\\w*|downward)";

  function checkChart(text, stepIndex) {
    if (lessonId !== "01") {
      return [];
    }

    const findings = [];
    const t = normalized(text);

    const upVi =
      "(?:tang|di len|tang len)";
    const downVi =
      "(?:giam|di xuong|sut giam)";

    const rising = `(?:${UP_EN}|${upVi})`;
    const falling = `(?:${DOWN_EN}|${downVi})`;

    const pieces = t.split(
      /[.;!?\n]+|\b(?:whereas|while|however|nhung|trong khi)\b/g
    );

    for (const piece of pieces) {
      for (const city of ["A","B","C"]) {
        const name = `(?:city|thanh pho)\\s*${city.toLowerCase()}\\b`;
        const up = new RegExp(
          `${name}[\\s\\S]{0,52}\\b${rising}\\b|\\b${rising}[\\s\\S]{0,35}${name}`,
          "i"
        );
        const down = new RegExp(
          `${name}[\\s\\S]{0,52}\\b${falling}\\b|\\b${falling}[\\s\\S]{0,35}${name}`,
          "i"
        );

        const trend = lesson.trends[city];

        if (trend === "down" && up.test(piece)) {
          findings.push(
            `City ${city} giảm xét từ ${lesson.start} đến ${lesson.end}, không tăng tổng thể.`
          );
        }

        if (trend === "up" && down.test(piece)) {
          findings.push(
            `City ${city} tăng xét từ ${lesson.start} đến ${lesson.end}, không giảm tổng thể.`
          );
        }
      }
    }

    // Only apply trend conclusions where an overall
    // trend is expected, not isolated intermediate moves.
    const globalTrendSteps = [2,3,8];

    return globalTrendSteps.includes(stepIndex)
      ? [...new Set(findings)]
      : [];
  }

  function checkLocal(answer, step, index) {
    const errors = [];
    const warnings = [];

    if (!answer.trim()) {
      return {
        verdict:"revise",
        errors:["Em chưa nhập câu trả lời."],
        warnings:[],
        issues:[]
      };
    }

    if (words(answer) < (step.min || 0)) {
      errors.push(
        `Cần tối thiểu ${step.min} từ. Hiện có ${words(answer)} từ.`
      );
    }

    const issues = [
      "intro","overview","body","essay"
    ].includes(step.type)
      ? checkLanguage(answer)
      : [];

    if (issues.length) {
      errors.push(
        `Phát hiện ${issues.length} lỗi ngôn ngữ theo bộ quy tắc.`
      );
    }

    errors.push(...checkChart(answer, index));

    if (step.type === "group") {
      const t = normalized(answer);

      if (!/body\s*1|doan\s*1/.test(t) ||
          !/body\s*2|doan\s*2/.test(t)) {
        errors.push(
          "Hãy nêu rõ nhóm Body 1 và Body 2."
        );
      }

      if (lessonId === "01") {
        for (const city of ["a","b","c"]) {
          if (!new RegExp(
            `(?:city|thanh pho)\\s*${city}\\b`,
            "i"
          ).test(t)) {
            errors.push(`Chưa xác định vị trí City ${city.toUpperCase()} trong hai Body.`);
          }
        }
      } else {
        for (const term of [
          /streaming/i,
          /downloads?/i,
          /\bcds?\b/i
        ]) {
          if (!term.test(t)) {
            errors.push(
              "Cần phân nhóm đủ streaming, downloads và CDs."
            );
            break;
          }
        }
      }
    }

    if (step.type === "analysis" ||
        step.type === "overview") {
      const t = normalized(answer);

      if (
        !/\b(tang|giam|dao dong|on dinh|vuot|rise|rose|increas|decreas|declin|fall|fell|fluctuat|stable|remain|drop|grow|grew)/i.test(t)
      ) {
        warnings.push(
          "Hãy kiểm tra xem đã mô tả xu hướng tổng thể chưa."
        );
      }
    }

    if (step.type === "data") {
      const numbers = answer.match(/\d+(?:[.,]\d+)?/g) || [];

      if (!numbers.length) {
        errors.push(
          "Cần đưa số liệu hoặc mốc thời gian từ biểu đồ."
        );
      }
    }

    if (step.type === "essay") {
      const paragraphs = answer.trim()
        .split(/\n\s*\n/)
        .filter(Boolean);

      if (paragraphs.length < 4) {
        errors.push(
          "Bài hoàn chỉnh cần tối thiểu bốn đoạn tách biệt."
        );
      }
    }

    if (step.type === "intro") {
      if (lessonId === "01" &&
          !/\bconferences?\b/i.test(answer)) {
        warnings.push(
          "Kiểm tra lại đối tượng hội nghị quốc tế."
        );
      }

      if (lessonId === "02" &&
          !/\b(music|sales)\b/i.test(answer)) {
        warnings.push(
          "Kiểm tra lại đối tượng music sales."
        );
      }
    }

    if (["intro","overview","body","essay"].includes(step.type)) {
      if (/\b(i think|i believe|in my opinion)\b/i.test(answer)) {
        errors.push(
          "IELTS Writing Task 1 không yêu cầu quan điểm cá nhân."
        );
      }
    }

    if (lessonId === "02" &&
        [2,3,8,9,10,11,12,13,14,15].includes(index)) {
      warnings.push(
        "Dữ liệu chi tiết của biểu đồ 02 chưa được xác minh trong bộ chấm offline. Hãy đối chiếu trực tiếp hình gốc."
      );
    }

    return {
      verdict:errors.length ? "revise" : "pass",
      errors:[...new Set(errors)],
      warnings:[...new Set(warnings)],
      issues
    };
  }

  function grade(answer, step, index) {
    if (step.type === "choice") {
      if (answer === "") {
        return {
          verdict:"revise",
          errors:["Hãy chọn một đáp án."],
          warnings:[],
          issues:[]
        };
      }

      return Number(answer) === step.correct
        ? {
          verdict:"pass",
          errors:[],
          warnings:[],
          issues:[]
        }
        : {
          verdict:"revise",
          errors:["Đáp án chưa đúng. Hãy chọn lại."],
          warnings:[],
          issues:[]
        };
    }

    return checkLocal(answer, step, index);
  }

  function renderFeedback(result) {
    const box = $("feedback");
    const passed = result.verdict === "pass";

    box.hidden = false;
    box.className =
      "feedback " + (passed ? "success" : "warning");

    let html = `<strong>${
      passed
        ? "✓ Đạt kiểm tra tự động"
        : "Cần chỉnh sửa trước khi tiếp tục"
    }</strong>`;

    html += `<p>${
      passed
        ? "Không phát hiện lỗi bắt buộc theo các quy tắc hiện có. Kết quả không thay thế đánh giá của giáo viên."
        : "Hãy xem lại các điểm dưới đây, sửa câu trả lời và kiểm tra lại."
    }</p>`;

    if (result.errors.length) {
      html += "<h4>Các vấn đề cần sửa</h4><ul>";
      for (const error of result.errors) {
        html += `<li>${esc(error)}</li>`;
      }
      html += "</ul>";
    }

    if (result.issues.length) {
      html += "<h4>Chữa lỗi ngôn ngữ</h4>";

      for (const issue of result.issues) {
        html += `
          <div class="grading-issue">
            <b>Lỗi:</b> ${esc(issue.original)}
            <p><b>Gợi ý sửa:</b>
            ${esc(issue.correction)}</p>
            <p>${esc(issue.message)}</p>
          </div>
        `;
      }
    }

    if (result.warnings.length) {
      html += "<h4>Những điểm nên kiểm tra</h4><ul>";
      for (const warning of result.warnings) {
        html += `<li>${esc(warning)}</li>`;
      }
      html += "</ul>";
    }

    box.innerHTML = html;
  }

  function renderProgress() {
    $("progressText").textContent =
      `Đã mở ${state.unlocked + 1}/${STEPS.length} bước`;

    $("progress").style.width =
      ((state.unlocked + 1) / STEPS.length * 100) + "%";
  }

  function renderNavigation() {
    $("nav").innerHTML = STEPS.map((step,i) => {
      const locked = i > state.unlocked;
      const active = i === state.current;
      return `
        <button
          type="button"
          class="step-chip ${active ? "active" : ""} ${i < state.unlocked ? "done" : ""}"
          data-step="${i}"
          ${locked ? "disabled" : ""}
        >
          ${i < state.unlocked ? "✓" : i + 1}.
          ${esc(step.section)}
        </button>
      `;
    }).join("");
  }

  function readAnswer() {
    const step = STEPS[state.current];

    if (step.type === "choice") {
      return document.querySelector(
        'input[name="answer"]:checked'
      )?.value ?? "";
    }

    return $("answer")?.value || "";
  }

  function saveAnswer() {
    if (!state.started) return;

    state.answers[state.current] = readAnswer();
    save();
  }

  function renderQuestion() {
    const i = state.current;
    const step = STEPS[i];
    const answer = state.answers[i] ?? "";

    $("stepSection").textContent = step.section;
    $("stepTitle").textContent =
      `${i + 1}. ${step.title}`;
    $("question").textContent = step.question;
    $("hint").textContent = step.hint || "";
    $("hint").hidden = !step.hint;

    if (step.type === "choice") {
      $("answerArea").innerHTML = `
        <div class="choices">
          ${step.options.map((option,j) => `
            <label>
              <input
                type="radio"
                name="answer"
                value="${j}"
                ${String(answer) === String(j) ? "checked" : ""}
              >
              ${esc(option)}
            </label>
          `).join("")}
        </div>
      `;
    } else {
      const rows = step.type === "essay"
        ? 18 : step.type === "body" ? 7 : 4;

      $("answerArea").innerHTML = `
        <textarea
          id="answer"
          rows="${rows}"
          spellcheck="true"
          lang="${["analysis","group","data"].includes(step.type) ? "vi" : "en-GB"}"
          placeholder="Nhập câu trả lời tại đây..."
        ></textarea>
        <div id="words" class="word-line"></div>
      `;

      $("answer").value = answer;
      $("words").textContent = words(answer) + " từ";
    }

    $("checkButton").textContent =
      step.type === "essay"
        ? "Kiểm tra bài hoàn chỉnh"
        : "Kiểm tra & mở khóa";

    $("nextButton").hidden =
      i >= state.unlocked || i >= STEPS.length - 1;

    $("backButton").disabled = i === 0;
    $("feedback").hidden = true;
    $("completedPanel").hidden = !state.finished;
  }

  function render() {
    $("lessonTitle").textContent =
      `Dynamic Datasets ${lessonId} · ${lesson.title}`;

    $("prompt").textContent = lesson.prompt;

    $("welcome").hidden = state.started;
    $("practice").hidden = !state.started;

    $("userLabel").textContent =
      state.name +
      (state.className ? " · " + state.className : "");

    if (!state.started) {
      $("studentName").value = state.name;
      $("studentClass").value = state.className;
      return;
    }

    renderProgress();
    renderNavigation();
    renderQuestion();
  }

  function checkCurrent() {
    const index = state.current;
    const step = STEPS[index];
    const answer = readAnswer().trim();

    saveAnswer();

    const result = grade(answer, step, index);

    renderFeedback(result);

    state.grades[index] = {
      answer,
      verdict:result.verdict,
      checkedAt:new Date().toISOString(),
      errors:result.errors,
      warnings:result.warnings
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
        $("completedPanel").hidden = false;
      }

      renderProgress();
      renderNavigation();
    }

    save();
  }

  function goTo(index) {
    if (
      index < 0 ||
      index >= STEPS.length ||
      index > state.unlocked
    ) return;

    saveAnswer();
    state.current = index;
    save();
    render();
  }

  function start() {
    const name = $("studentName").value.trim();

    if (!name) {
      $("startError").textContent =
        "Vui lòng nhập họ và tên.";
      return;
    }

    state.name = name;
    state.className =
      $("studentClass").value.trim();
    state.started = true;

    save();
    render();
  }

  function reset() {
    if (!confirm(
      "Xóa toàn bộ tiến độ bài học này?"
    )) return;

    localStorage.removeItem(STORE);
    state = freshState();
    render();
  }

  function exportEssay() {
    const essay = state.answers[15] || "";

    if (!essay.trim()) {
      alert("Chưa có bài viết.");
      return;
    }

    const output = [
      "SMARTCOM IELTS WRITING TASK 1",
      lesson.title,
      "",
      "Student: " + state.name,
      "Class: " + state.className,
      "",
      lesson.prompt,
      "",
      "STUDENT ESSAY",
      "",
      essay,
      "",
      "Word count: " + words(essay),
      "",
      "Offline check status: " +
        (state.grades[15]?.verdict || "not_checked")
    ].join("\n");

    const blob = new Blob([output], {
      type:"text/plain;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download =
      `Dynamic-${lessonId}-Writing.txt`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  $("startButton").addEventListener("click", start);
  $("checkButton").addEventListener("click", checkCurrent);

  $("nextButton").addEventListener(
    "click", () => goTo(state.current + 1)
  );

  $("backButton").addEventListener(
    "click", () => goTo(state.current - 1)
  );

  $("resetButton").addEventListener("click", reset);
  $("exportButton").addEventListener("click", exportEssay);

  $("nav").addEventListener("click", event => {
    const button = event.target.closest("[data-step]");
    if (button) {
      goTo(Number(button.dataset.step));
    }
  });

  $("answerArea").addEventListener("input", () => {
    saveAnswer();
    $("feedback").hidden = true;

    if ($("words")) {
      $("words").textContent =
        words(readAnswer()) + " từ";
    }
  });

  $("answerArea").addEventListener("change", saveAnswer);

  render();
})();
