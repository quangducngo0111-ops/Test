window.VocabRacer = window.VocabRacer || {};

VocabRacer.VocabEngine = class {
  constructor(){
    this.set = null;
    this.queue = [];
    this.index = 0;
    this.results = [];
    this.difficulty = "normal";
  }

  async loadSet(setId="environment"){
    const path = `./data/vocab-sets/${setId}.json`;

    try{
      const response = await fetch(path, {cache:"no-store"});
      if(!response.ok) throw new Error(`HTTP ${response.status}`);
      this.set = await response.json();
      return this.set;
    }catch(error){
      const fallback = window.VOCAB_RACER_FALLBACK?.[setId];
      if(!fallback){
        throw new Error(
          `Không tải được bộ từ "${setId}". ` +
          `Hãy chạy trên GitHub Pages/local server hoặc kiểm tra file JSON.`
        );
      }
      console.warn("Dùng vocab fallback vì JSON không fetch được:", error);
      this.set = fallback;
      return this.set;
    }
  }

  prepareRound({difficulty="normal", count=12}={}){
    if(!this.set?.items?.length) throw new Error("Bộ từ chưa được tải.");

    this.difficulty = difficulty;

    const maxLevel = difficulty === "easy" ? 1 : difficulty === "hard" ? 3 : 2;
    const preferred = this.set.items.filter(item => (item.level || 1) <= maxLevel);
    const remaining = this.set.items.filter(item => !preferred.includes(item));

    let pool = [...this.shuffle(preferred), ...this.shuffle(remaining)];
    const seen = new Set();

    pool = pool.filter(item => {
      const key = item.id || item.question || item.correct;
      if(seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    this.queue = pool.slice(0, Math.min(count, pool.length));
    this.index = 0;
    this.results = [];
    return this.queue;
  }

  next(){
    if(this.index >= this.queue.length) return null;

    const item = this.queue[this.index++];
    return {
      ...item,
      gateOptions: this.buildThreeLaneOptions(item)
    };
  }

  buildThreeLaneOptions(item){
    const wrong = (item.options || [])
      .filter(option => this.norm(option) !== this.norm(item.correct));

    return this.shuffle([
      item.correct,
      ...this.shuffle(wrong).slice(0, 2)
    ]);
  }

  record(item, selected, correct, elapsed){
    this.results.push({
      id: item.id,
      question: item.question,
      prompt: item.prompt,
      correctAnswer: item.correct,
      selected: selected ?? null,
      isCorrect: Boolean(correct),
      elapsed: Number(elapsed || 0),
      note: item.note || ""
    });
  }

  getSummary(){
    const correct = this.results.filter(r => r.isCorrect).length;
    const review = this.results.filter(r => !r.isCorrect);

    return {
      setId: this.set?.id || "",
      setTitle: this.set?.title || "",
      total: this.results.length,
      correct,
      wrong: this.results.length - correct,
      accuracy: this.results.length ? Math.round(correct / this.results.length * 100) : 0,
      review
    };
  }

  saveSession(extra={}){
    const summary = {
      ...this.getSummary(),
      ...extra,
      savedAt: new Date().toISOString()
    };

    try{
      const key = "VOCAB_RACER_HISTORY_V1";
      const history = JSON.parse(localStorage.getItem(key) || "[]");
      history.unshift(summary);
      localStorage.setItem(key, JSON.stringify(history.slice(0, 20)));
    }catch(error){
      console.warn("Không lưu được localStorage:", error);
    }

    return summary;
  }

  shuffle(source){
    const arr = [...source];
    for(let i=arr.length-1;i>0;i--){
      const j = Math.floor(Math.random() * (i+1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  norm(value){
    return String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
  }
};
