window.VocabRacer = window.VocabRacer || {};

VocabRacer.HUD = class {
  constructor(){
    this.speedValue = document.getElementById("speedValue");
    this.positionValue = document.getElementById("positionValue");
    this.raceProgress = document.getElementById("raceProgress");
    this.questionPanel = document.getElementById("questionPanel");
    this.questionType = document.getElementById("questionType");
    this.questionText = document.getElementById("questionText");
    this.gateTimer = document.getElementById("gateTimer");
    this.timerFill = document.getElementById("timerFill");
    this.laneHints = document.getElementById("laneHints");
    this.nitroFill = document.getElementById("nitroFill");
    this.nitroText = document.getElementById("nitroText");
    this.message = document.getElementById("message");
    this.overtake = document.getElementById("overtake");
    this.finishScreen = document.getElementById("finishScreen");
  }

  updateRace({speed, rank, totalCars, progress, nitroRatio}){
    this.speedValue.textContent = Math.round(speed * 6.1);
    this.positionValue.textContent = `${rank}/${totalCars}`;
    this.raceProgress.textContent = `${Math.min(100, Math.max(0, Math.round(progress * 100)))}%`;

    const ratio = Math.max(0, Math.min(1, nitroRatio || 0));
    this.nitroFill.style.width = `${ratio * 100}%`;
    this.nitroText.textContent = ratio > 0.05 ? "BOOST" : "READY";
  }

  showQuestion(item, answerTime){
    this.questionPanel.classList.remove("hidden");
    this.questionType.textContent = this.typeLabel(item.type);
    this.questionText.textContent = item.prompt || item.question || "Choose the correct answer";
    this.updateQuestionTimer(answerTime, answerTime);

    this.laneHints.innerHTML = item.gateOptions
      .map((option, index) =>
        `<div class="lane-hint" data-lane="${index}">${["LEFT","CENTER","RIGHT"][index]} · ${this.escape(option)}</div>`
      )
      .join("");
  }

  setActiveLane(lane){
    this.laneHints.querySelectorAll(".lane-hint").forEach(el => {
      el.classList.toggle("active", Number(el.dataset.lane) === lane);
    });
  }

  updateQuestionTimer(remaining, total){
    const ratio = Math.max(0, Math.min(1, remaining / Math.max(.01, total)));
    this.gateTimer.textContent = `${Math.max(0, remaining).toFixed(1)}s`;
    this.timerFill.style.transform = `scaleX(${ratio})`;
  }

  hideQuestion(){
    this.questionPanel.classList.add("hidden");
  }

  flash(text, type="good", duration=1100){
    this.message.textContent = text;
    this.message.className = `show ${type}`;
    clearTimeout(this.flashTimer);
    this.flashTimer = setTimeout(() => this.message.className = "", duration);
  }

  showOvertake(name){
    this.overtake.textContent = `OVERTAKE · ${name}`;
    this.overtake.classList.remove("hidden");
    clearTimeout(this.overtakeTimer);
    this.overtakeTimer = setTimeout(() => this.overtake.classList.add("hidden"), 850);
  }

  showFinish(summary){
    document.getElementById("finalRank").textContent = `${summary.rank}/${summary.totalCars}`;
    document.getElementById("finalTime").textContent = `${summary.time.toFixed(1)}s`;
    document.getElementById("finalScore").textContent = String(summary.score);
    document.getElementById("finalAccuracy").textContent = `${summary.learning.correct}/${summary.learning.total} · ${summary.learning.accuracy}%`;

    const review = document.getElementById("reviewWords");

    if(!summary.learning.review.length){
      review.innerHTML = `<div class="review-empty">Tuyệt vời — không có từ nào cần ôn lại trong lượt này.</div>`;
    }else{
      review.innerHTML = summary.learning.review.map(item => `
        <div class="review-item">
          <b>${this.escape(item.question || item.correctAnswer)}</b>
          <span> · Đáp án: ${this.escape(item.correctAnswer)}</span>
          ${item.note ? `<br><span>${this.escape(item.note)}</span>` : ""}
        </div>
      `).join("");
    }

    this.finishScreen.classList.remove("hidden");
  }

  typeLabel(type){
    const labels = {
      definition_vi:"ĐỊNH NGHĨA VI → EN",
      definition_en:"DEFINITION",
      synonym:"SYNONYM",
      antonym:"ANTONYM",
      collocation:"COLLOCATION / FILL"
    };
    return labels[type] || "VOCAB GATE";
  }

  escape(value){
    return String(value ?? "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;");
  }
};
