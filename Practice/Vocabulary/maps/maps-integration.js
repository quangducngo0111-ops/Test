/* ============================================
   WRITING TASK 1 · MAPS
   TÍCH HỢP LỘ TRÌNH 3 GIAI ĐOẠN
============================================ */

(function () {
  "use strict";

  if (typeof window.renderCollection !== "function") {
    console.warn(
      "[Maps] Chưa tìm thấy renderCollection."
    );
    return;
  }

  const oldRender = window.renderCollection;

  window.renderCollection = function () {
    const result = oldRender.apply(this, arguments);

    const root = document.getElementById(
      "collectionScreen"
    );

    let phaseBox = document.getElementById(
      "mapsPhaseProgress"
    );

    let mapsSelected = false;
    let finished = false;
    let passed = false;

    try {
      mapsSelected =
        selectedSkill === "writing-task-1" &&
        String(selectedSet) === "maps";

      finished =
        mapsSelected && isSetComplete();

      passed =
        mapsSelected &&
        hasPassedCurrentVocabularyTest();

    } catch (error) {
      console.warn("[Maps] Progress:", error);
    }

    if (!mapsSelected) {
      if (phaseBox) {
        phaseBox.remove();
      }

      return result;
    }

    if (!root) {
      return result;
    }

    const heading = document.getElementById(
      "collectionTitle"
    );

    if (heading) {
      heading.textContent =
        "Writing Task 1 · Maps · Bộ 01";
    }

    if (!phaseBox) {
      phaseBox = document.createElement("section");

      phaseBox.id = "mapsPhaseProgress";
      phaseBox.className = "maps-phases";

      const completion = document.getElementById(
        "completionBanner"
      );

      if (completion) {
        completion.insertAdjacentElement(
          "beforebegin",
          phaseBox
        );
      } else {
        root.prepend(phaseBox);
      }
    }

    phaseBox.innerHTML = `
      <div class="maps-phases-head">
        <span>WRITING TASK 1 · MAPS</span>
        <b>Lộ trình 3 giai đoạn</b>
      </div>

      <div class="maps-phases-row">

        <div class="maps-phase ${
          finished ? "done" : "active"
        }">
          <span>01</span>
          <strong>Học bằng game</strong>
          <small>
            ${
              finished
                ? "Đã hoàn thành"
                : "Chơi các game bên dưới để học từ vựng"
            }
          </small>
        </div>

        <div class="maps-phase ${
          passed
            ? "done"
            : finished
              ? "active"
              : "locked"
        }">
          <span>02</span>
          <strong>Kiểm tra</strong>
          <small>
            ${
              passed
                ? "Đã đạt bài kiểm tra"
                : finished
                  ? "Chọn Bắt đầu kiểm tra bên dưới"
                  : "Mở khi hoàn thành giai đoạn 1"
            }
          </small>
        </div>

        <div class="maps-phase ${
          passed ? "active" : "locked"
        }">
          <span>03</span>
          <strong>Luyện viết Maps</strong>
          <small>
            ${
              passed
                ? "Đã mở khóa · 13 sơ đồ"
                : "Mở sau khi đạt bài kiểm tra"
            }
          </small>
        </div>

      </div>

      ${
        passed
          ? `
            <a
              class="maps-phase-go"
              href="./maps/index.html"
            >
              Bắt đầu giai đoạn 3:
              Luyện viết theo bản đồ →
            </a>
          `
          : `
            <div class="maps-phase-lock">
              Hoàn thành các giai đoạn trước
              để mở phần luyện viết.
            </div>
          `
      }
    `;

    return result;
  };

  const css = document.createElement("style");

  css.textContent = `
    .maps-phases {
      margin: 16px 0;
      padding: 18px;
      border: 1px solid #dcd5fa;
      border-radius: 20px;
      background: linear-gradient(
        120deg,
        #fff,
        #f4efff
      );
      box-shadow: 0 8px 25px #2c246b0d;
    }

    .maps-phases-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 13px;
      color: #3d277b;
      font-size: 12px;
    }

    .maps-phases-head span {
      font-size: 10px;
      font-weight: 950;
      letter-spacing: .08em;
    }

    .maps-phases-head b {
      font-size: 16px;
    }

    .maps-phases-row {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
    }

    .maps-phase {
      display: flex;
      flex-direction: column;
      gap: 5px;
      padding: 13px;
      border: 1px solid #e1e2ed;
      border-radius: 13px;
      background: white;
      opacity: .85;
    }

    .maps-phase span {
      width: max-content;
      padding: 6px 8px;
      border-radius: 9px;
      background: #eeeafa;
      color: #5238a9;
      font-weight: 900;
    }

    .maps-phase strong {
      color: #281260;
      font-size: 13px;
    }

    .maps-phase small {
      color: #69738a;
      font-size: 11px;
      line-height: 1.4;
    }

    .maps-phase.done {
      border-color: #91dcb7;
      background: #f7fff9;
    }

    .maps-phase.active {
      border-color: #7155df;
      opacity: 1;
      box-shadow: 0 5px 14px #4c32a619;
    }

    .maps-phase.locked {
      opacity: .55;
    }

    .maps-phase-go {
      display: block;
      margin-top: 13px;
      padding: 13px 15px;
      border-radius: 13px;
      background: linear-gradient(
        90deg,
        #5135b7,
        #765ce8
      );
      color: white;
      font-weight: 900;
      text-align: center;
      text-decoration: none;
    }

    .maps-phase-lock {
      margin-top: 11px;
      color: #7c8391;
      font-size: 11px;
      text-align: center;
    }

    @media (max-width: 700px) {
      .maps-phases-row {
        grid-template-columns: 1fr;
      }

      .maps-phases-head {
        align-items: flex-start;
        flex-direction: column;
      }
    }
  `;

  document.head.appendChild(css);

})();
