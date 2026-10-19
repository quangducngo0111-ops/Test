
'use strict';

(() => {
  const $ = id => document.getElementById(id);
  const params = new URLSearchParams(location.search);

  const topicId = params.get('topic') || '01';
  const part = Number(params.get('part') || 1);
  const errorBox = $('error');

  if (![1, 2, 3].includes(part)) {
    errorBox.textContent = 'Part không hợp lệ.';
    return;
  }

  if (!/^\d{2,5}$/.test(topicId)) {
    errorBox.textContent = 'Mã topic không hợp lệ.';
    return;
  }

  const KEY =
    'IELTS_SPEAKING_PART_' +
    part +
    '_TOPIC_' +
    topicId +
    '_V3';

  const Recognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  let topic = null;

  let state = {
    index: 0,
    answers: {},
    history: [],
    hinted: {}
  };

  let stream = null;
  let recorder = null;
  let chunks = [];
  let audioUrl = null;

  let recognition = null;
  let listening = false;
  let recognized = '';
  let activeQuestionIndex = -1;
  let recordQuestionIndex = -1;

  let clockInterval = null;
  let clockEndTime = 0;
  let clockMode = '';

  const countWords = s =>
    (
      String(s).match(
        /[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu
      ) || []
    ).length;

  const current = () => topic.questions[state.index];

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Không lưu được:', e);
    }
  }

  function showCoach(intro, hint = '') {
    $('coach').textContent = hint
      ? `${intro}\n\n💡 ${hint}`
      : intro;
  }

  // ==========================================
  // TEXT TO SPEECH
  // ==========================================

  function stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) {
      $('status').textContent =
        'Thiết bị không hỗ trợ đọc câu hỏi.';
      return;
    }

    stopSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.9;

    window.speechSynthesis.speak(utterance);
  }

  // ==========================================
  // PART 2 TIMER
  // ==========================================

  function formatTime(seconds) {
    seconds = Math.max(0, Math.ceil(seconds));

    return (
      String(Math.floor(seconds / 60)).padStart(2, '0') +
      ':' +
      String(seconds % 60).padStart(2, '0')
    );
  }

  function stopClock() {
    if (clockInterval !== null) {
      clearInterval(clockInterval);
      clockInterval = null;
    }
  }

  function updateClock() {
    const remaining = Math.max(
      0,
      Math.ceil((clockEndTime - Date.now()) / 1000)
    );

    $('partTimer').textContent = formatTime(remaining);

    if (remaining <= 0) {
      stopClock();

      if (clockMode === 'prep') {
        $('status').textContent =
          'Hết thời gian chuẩn bị. Em có thể bắt đầu nói.';
      } else {
        $('status').textContent =
          'Đã hết thời gian nói. Hãy hoàn thành câu trả lời.';
      }
    }
  }

  function startClock(seconds, mode) {
    if (part !== 2) return;

    stopClock();

    clockMode = mode;
    clockEndTime = Date.now() + seconds * 1000;

    updateClock();

    clockInterval = setInterval(updateClock, 250);

    $('status').textContent =
      mode === 'prep'
        ? 'Đang đếm thời gian chuẩn bị.'
        : 'Đang đếm thời gian nói.';
  }

  // ==========================================
  // MICROPHONE
  // ==========================================

  function stopRecognition() {
    if (!recognition) return;

    const active = recognition;
    recognition = null;

    active.onresult = null;
    active.onerror = null;

    try {
      active.stop();
    } catch (e) {}
  }

  function closeStream() {
    if (!stream) return;

    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }

  function stopRecording() {
    if (!listening) return;

    listening = false;
    stopRecognition();

    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    } else {
      closeStream();
    }

    $('record').disabled = false;
    $('stop').disabled = true;

    $('status').textContent =
      'Đã dừng ghi âm. Hãy nghe lại và nhận gợi ý.';
  }

  function releaseAudio() {
    const player = $('recordingPlayer');

    player.replaceChildren();

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      audioUrl = null;
    }
  }

  async function startRecording() {
    if (listening) return;

    if (
      !navigator.mediaDevices?.getUserMedia ||
      !window.MediaRecorder
    ) {
      $('status').textContent =
        'Trình duyệt không hỗ trợ ghi âm hoặc chưa sử dụng HTTPS.';
      return;
    }

    stopSpeech();
    releaseAudio();

    recognized = '';
    chunks = [];

    const questionIndex = state.index;

    $('record').disabled = true;

    try {
      const acquiredStream =
        await navigator.mediaDevices.getUserMedia({
          audio: true
        });

      if (questionIndex !== state.index) {
        acquiredStream.getTracks().forEach(t => t.stop());
        $('record').disabled = false;
        return;
      }

      stream = acquiredStream;

      const activeRecorder = new MediaRecorder(stream);
      recorder = activeRecorder;
      recordQuestionIndex = questionIndex;

      activeRecorder.ondataavailable = event => {
        if (event.data.size) {
          chunks.push(event.data);
        }
      };

      activeRecorder.onstop = () => {
        const blob = new Blob(chunks, {
          type: activeRecorder.mimeType || 'audio/webm'
        });

        if (
          blob.size &&
          recordQuestionIndex === state.index
        ) {
          audioUrl = URL.createObjectURL(blob);

          const player = document.createElement('audio');
          player.controls = true;
          player.src = audioUrl;

          $('recordingPlayer').append(player);
        }

        closeStream();
      };

      activeRecorder.start();

      listening = true;

      $('record').disabled = true;
      $('stop').disabled = false;

      $('status').textContent =
        'Đang ghi âm. Hãy trả lời bằng tiếng Anh.';

      // ======================================
      // SPEECH RECOGNITION
      // ======================================

      if (Recognition) {
        try {
          const active = new Recognition();
          recognition = active;

          active.lang = 'en-US';
          active.continuous = true;
          active.interimResults = true;

          const previous =
            state.answers[questionIndex] || '';

          active.onresult = event => {
            if (
              !listening ||
              questionIndex !== state.index
            ) return;

            let interim = '';

            for (
              let i = event.resultIndex;
              i < event.results.length;
              i++
            ) {
              const phrase =
                event.results[i][0].transcript;

              if (event.results[i].isFinal) {
                recognized += phrase + ' ';
              } else {
                interim += phrase + ' ';
              }
            }

            const incoming =
              (recognized + interim).trim();

            $('answer').value = [
              previous,
              incoming
            ].filter(Boolean).join(' ').trim();

            state.answers[questionIndex] =
              $('answer').value;

            save();
          };

          active.onerror = event => {
            if (listening) {
              $('status').textContent =
                'Ghi âm vẫn tiếp tục; nhận diện giọng nói gặp lỗi: ' +
                event.error;
            }
          };

          active.start();

        } catch (e) {
          $('status').textContent =
            'Đang ghi âm nhưng nhận diện giọng nói không khả dụng.';
        }
      }

    } catch (e) {
      closeStream();

      listening = false;

      $('record').disabled = false;
      $('stop').disabled = true;

      $('status').textContent =
        'Không truy cập được microphone: ' +
        e.message;
    }
  }

  // ==========================================
  // RENDER
  // ==========================================

  function render() {
    $('topicId').textContent =
      'PART ' + part + ' · TOPIC ' + topicId;

    $('topicTitle').textContent = topic.title;

    $('topicDescription').textContent =
      topic.description ||
      'IELTS Speaking Guided Practice';

    $('questionNumber').textContent =
      'Question ' + (state.index + 1);

    $('progressText').textContent =
      (state.index + 1) +
      ' / ' +
      topic.questions.length;

    $('progressBar').style.width =
      (
        (state.index + 1) /
        topic.questions.length *
        100
      ) + '%';

    $('question').textContent =
      current().question;

    $('answer').value =
      state.answers[state.index] || '';

    $('prev').disabled = state.index === 0;

    $('next').disabled =
      state.index === topic.questions.length - 1;

    // Cue card của Speaking Part 2

    const cueBox = $('cueBullets');
    const bullets = current().bullets || [];

    if (part === 2 && bullets.length) {
      cueBox.hidden = false;
      cueBox.replaceChildren();

      const heading = document.createElement('b');
      heading.textContent = 'You should say:';
      cueBox.append(heading);

      const list = document.createElement('ul');

      bullets.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        list.append(li);
      });

      cueBox.append(list);
    } else {
      cueBox.hidden = true;
      cueBox.replaceChildren();
    }

    $('prepPanel').hidden = part !== 2;

    if (part === 2 && clockInterval === null) {
      $('partTimer').textContent =
        formatTime(Number(topic.prepSeconds) || 60);
    }

    // History

    const box = $('history');
    box.replaceChildren();

    state.history.slice(-10).reverse().forEach(h => {
      const item = document.createElement('div');
      item.className = 'history-item';

      const strong = document.createElement('b');

      strong.textContent =
        'Question ' +
        h.question +
        ' · ' +
        h.date;

      const answer = document.createElement('div');
      answer.textContent = h.answer;

      item.append(strong, answer);
      box.append(item);
    });
  }

  // ==========================================
  // SPEAKING COACH
  // ==========================================

  function showHint(kind, read = true) {
    const hint = current().followUps[kind];

    if (!hint) return;

    showCoach(
      'Hãy phát triển câu trả lời theo gợi ý sau:',
      hint
    );

    state.hinted[state.index] = {
      ...(state.hinted[state.index] || {}),
      [kind]: true
    };

    save();

    if (read) speak(hint);
  }

  function analyze() {
    const answer = $('answer').value.trim();

    if (!answer) {
      showCoach(
        'Chưa có transcript. Hãy trả lời bằng microphone hoặc nhập lời vừa nói.'
      );
      return;
    }

    state.answers[state.index] = answer;

    state.history.push({
      question: state.index + 1,
      answer,
      date: new Date().toLocaleString('vi-VN')
    });

    if (state.history.length > 100) {
      state.history.shift();
    }

    const words = countWords(answer);
    const hinted = state.hinted[state.index] || {};

    // Bộ quy tắc gợi ý miễn phí.
    // Không phải hệ thống chấm band IELTS.

    let kind =
      words < 12
        ? 'reason'
        : words < 25
          ? 'example'
          : 'detail';

    if (hinted[kind]) {
      kind = [
        'reason',
        'example',
        'detail'
      ].find(key => !hinted[key]) || kind;
    }

    save();
    render();

    let message;

    if (words < 12) {
      message =
        'Câu trả lời còn khá ngắn. Em thử bổ sung lý do nhé.';
    } else if (words < 25) {
      message =
        'Câu trả lời đã có ý chính. Em hãy thêm một ví dụ cụ thể.';
    } else {
      message =
        'Câu trả lời đã được phát triển. Em có thể bổ sung chi tiết hoặc chuyển câu mới.';
    }

    showCoach(message);

    showHint(kind, true);
  }

  // ==========================================
  // NAVIGATION
  // ==========================================

  function go(delta) {
    if (listening) stopRecording();

    stopClock();
    stopSpeech();
    releaseAudio();

    state.index = Math.min(
      topic.questions.length - 1,
      Math.max(0, state.index + delta)
    );

    save();
    render();

    showCoach('Hãy trả lời câu hỏi mới.');
  }

  function resetAnswer() {
    if (listening) stopRecording();

    stopClock();
    stopSpeech();
    releaseAudio();

    state.answers[state.index] = '';
    delete state.hinted[state.index];

    save();
    render();

    showCoach(
      'Hãy thử trả lời lại bằng cách nêu ý chính, giải thích lý do rồi thêm ví dụ.'
    );
  }

  // ==========================================
  // EXPORT
  // ==========================================

  function exportHistory() {
    const lines = [
      'IELTS Speaking Guided Practice',
      `Part ${part} · Topic ${topicId}: ${topic.title}`,
      ''
    ];

    state.history.forEach(h => {
      lines.push(
        'Question ' +
        h.question +
        ': ' +
        topic.questions[h.question - 1].question,
        h.answer,
        ''
      );
    });

    const blob = new Blob(
      [lines.join('\n')],
      { type: 'text/plain;charset=utf-8' }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;

    a.download =
      `Speaking_Part${part}_${topicId}_history.txt`;

    a.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  // ==========================================
  // LOAD TOPIC
  // ==========================================

  async function init() {
    try {
      const response = await fetch(
        `./Part${part}/topics/${topicId}.json`,
        { cache: 'no-store' }
      );

      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }

      topic = await response.json();

      if (
        String(topic.id) !== topicId ||
        !Array.isArray(topic.questions) ||
        !topic.questions.length
      ) {
        throw new Error('Dữ liệu topic không hợp lệ.');
      }

      for (const q of topic.questions) {
        if (
          typeof q.question !== 'string' ||
          !q.followUps ||
          ['reason', 'example', 'detail'].some(
            key =>
              typeof q.followUps[key] !== 'string'
          )
        ) {
          throw new Error(
            'Topic thiếu câu hỏi hoặc gợi ý.'
          );
        }
      }

      // Restore progress

      try {
        const saved = JSON.parse(
          localStorage.getItem(KEY) || 'null'
        );

        if (saved && typeof saved === 'object') {
          state = {
            ...state,
            ...saved,
            answers: saved.answers || {},
            history: Array.isArray(saved.history)
              ? saved.history
              : [],
            hinted: saved.hinted || {}
          };
        }
      } catch (e) {}

      state.index = Math.max(
        0,
        Math.min(
          topic.questions.length - 1,
          Number(state.index) || 0
        )
      );

      $('lesson').hidden = false;
      errorBox.textContent = '';

      render();

    } catch (e) {
      errorBox.textContent =
        'Không tải được chủ đề. Kiểm tra file Part' +
        part +
        '/topics/' +
        topicId +
        '.json';

      console.error(e);
      return;
    }

    // ========================================
    // EVENTS
    // ========================================

    $('speechSupport').textContent = Recognition
      ? 'Nhận diện giọng nói phụ thuộc trình duyệt và có thể sử dụng dịch vụ trực tuyến.'
      : 'Trình duyệt không hỗ trợ nhận diện giọng nói. Có thể ghi âm và nhập transcript thủ công.';

    $('prepStart').onclick = () => {
      startClock(
        Number(topic.prepSeconds) || 60,
        'prep'
      );
    };

    $('speakTimerStart').onclick = () => {
      startClock(
        Number(topic.speakSeconds) || 120,
        'speak'
      );
    };

    $('readQuestion').onclick = () => {
      const q = current();

      const text = part === 2 && q.bullets?.length
        ? q.question +
          '. You should say: ' +
          q.bullets.join('. ')
        : q.question;

      speak(text);
    };

    $('record').onclick = startRecording;
    $('stop').onclick = stopRecording;
    $('analyze').onclick = analyze;

    $('answer').oninput = event => {
      state.answers[state.index] =
        event.target.value;

      save();
    };

    document
      .querySelectorAll('[data-hint]')
      .forEach(button => {
        button.onclick = () => {
          showHint(button.dataset.hint);
        };
      });

    $('retry').onclick = resetAnswer;
    $('prev').onclick = () => go(-1);
    $('next').onclick = () => go(1);

    $('export').onclick = exportHistory;

    $('reset').onclick = () => {
      if (
        !confirm(
          'Xóa toàn bộ tiến độ Part ' +
          part +
          ' · Topic ' +
          topicId +
          '?'
        )
      ) return;

      if (listening) stopRecording();

      stopClock();
      stopSpeech();
      releaseAudio();

      state = {
        index: 0,
        answers: {},
        history: [],
        hinted: {}
      };

      save();
      render();

      showCoach('Đã làm lại chủ đề.');
    };
  }

  // ==========================================
  // CLEANUP
  // ==========================================

  window.addEventListener('pagehide', () => {
    stopClock();

    if (listening) stopRecording();

    closeStream();
    stopSpeech();
    releaseAudio();
  });

  init();

})();
