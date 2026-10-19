
'use strict';

(() => {
  const $ = id => document.getElementById(id);

  const params = new URLSearchParams(location.search);
  const topicId = params.get('topic') || '01';
  const errorBox = $('error');

  if (!/^\d{2,5}$/.test(topicId)) {
    errorBox.textContent = 'Mã topic không hợp lệ.';
    return;
  }

  const KEY = 'IELTS_SPEAKING_TOPIC_' + topicId + '_V2';

  const Recognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  let topic;

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
  let recordQuestionIndex = -1;
  let speakingNow = false;

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

  /* =========================================
     TEXT TO SPEECH
  ========================================= */

  function stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    speakingNow = false;
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

    utterance.onend = () => {
      speakingNow = false;
    };

    speakingNow = true;
    window.speechSynthesis.speak(utterance);
  }

  /* =========================================
     SPEECH RECOGNITION
  ========================================= */

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

  /* =========================================
     MICROPHONE / AUDIO RECORDING
  ========================================= */

  function closeStream() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }
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
      'Đã dừng. Hãy nghe lại và nhấn “Nhận gợi ý”.';
  }

  function releaseAudio() {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      audioUrl = null;
    }

    $('recordingPlayer').replaceChildren();
  }

  async function startRecording() {
    if (listening) return;

    if (
      !navigator.mediaDevices?.getUserMedia ||
      !window.MediaRecorder
    ) {
      $('status').textContent =
        'Trình duyệt không hỗ trợ ghi âm hoặc chưa dùng HTTPS.';
      return;
    }

    stopSpeech();
    releaseAudio();

    recognized = '';
    chunks = [];

    const questionIndex = state.index;

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      // Học sinh có thể chuyển câu trong khi đang cấp quyền micro.
      if (questionIndex !== state.index) {
        closeStream();
        return;
      }

      recorder = new MediaRecorder(stream);
      recordQuestionIndex = questionIndex;

      recorder.ondataavailable = event => {
        if (event.data.size) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, {
          type: recorder.mimeType || 'audio/webm'
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

      recorder.start();
      listening = true;

      $('record').disabled = true;
      $('stop').disabled = false;

      $('status').textContent =
        'Đang ghi âm — nói tiếng Anh vào microphone.';

      /* SPEECH TO TEXT */

      if (Recognition) {
        try {
          recognition = new Recognition();

          const active = recognition;

          active.lang = 'en-US';
          active.continuous = true;
          active.interimResults = true;

          const previous = state.answers[questionIndex] || '';

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
              const phrase = event.results[i][0].transcript;

              if (event.results[i].isFinal) {
                recognized += phrase + ' ';
              } else {
                interim += phrase + ' ';
              }
            }

            const incoming = (recognized + interim).trim();

            $('answer').value = [
              previous,
              incoming
            ].filter(Boolean).join(' ').trim();

            state.answers[questionIndex] = $('answer').value;

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
            'Đang ghi âm; thiết bị không hỗ trợ nhận diện giọng nói.';
        }
      }

    } catch (e) {
      closeStream();
      listening = false;

      $('record').disabled = false;
      $('stop').disabled = true;

      $('status').textContent =
        'Không truy cập được microphone: ' + e.message;
    }
  }

  /* =========================================
     RENDER LESSON
  ========================================= */

  function render() {
    $('topicId').textContent = 'TOPIC ' + topicId;
    $('topicTitle').textContent = topic.title;

    $('topicDescription').textContent =
      topic.description ||
      'Luyện IELTS Speaking Guided Practice.';

    $('questionNumber').textContent =
      'Question ' + (state.index + 1);

    $('progressText').textContent =
      (state.index + 1) + ' / ' + topic.questions.length;

    $('progressBar').style.width =
      (
        (state.index + 1) /
        topic.questions.length *
        100
      ) + '%';

    $('question').textContent = current().question;

    $('answer').value =
      state.answers[state.index] || '';

    $('prev').disabled = state.index === 0;

    $('next').disabled =
      state.index === topic.questions.length - 1;

    /* RENDER HISTORY */

    const historyBox = $('history');
    historyBox.replaceChildren();

    state.history.slice(-10).reverse().forEach(item => {
      const div = document.createElement('div');
      div.className = 'history-item';

      const strong = document.createElement('b');

      strong.textContent =
        'Question ' +
        item.question +
        ' · ' +
        item.date;

      const answer = document.createElement('div');
      answer.textContent = item.answer;

      div.append(strong, answer);
      historyBox.append(div);
    });
  }

  /* =========================================
     SPEAKING COACH
  ========================================= */

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

    if (read) {
      speak(hint);
    }
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

    /*
      Bộ quy tắc miễn phí:
      - Dưới 12 từ: gợi ý lý do.
      - Dưới 25 từ: gợi ý ví dụ.
      - Từ 25 từ: gợi ý bổ sung chi tiết.

      Đây không phải hệ thống AI chấm ngữ nghĩa
      hay chấm band IELTS.
    */

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

    const message =
      words < 12
        ? 'Câu trả lời còn khá ngắn. Em thử giải thích lý do nhé.'
        : words < 25
          ? 'Câu trả lời đã có ý chính. Hãy thêm một ví dụ cụ thể.'
          : 'Em đã phát triển câu trả lời. Thử bổ sung chi tiết nếu còn ý, hoặc chuyển câu mới.';

    showCoach(message);
    showHint(kind, true);
  }

  /* =========================================
     QUESTION NAVIGATION
  ========================================= */

  function go(delta) {
    if (listening) stopRecording();

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

    stopSpeech();
    releaseAudio();

    state.answers[state.index] = '';
    delete state.hinted[state.index];

    save();
    render();

    showCoach(
      'Hãy thử lại: nêu ý chính, giải thích vì sao, sau đó thêm ví dụ.'
    );
  }

  /* =========================================
     EXPORT HISTORY
  ========================================= */

  function exportHistory() {
    const lines = [
      'IELTS Speaking Guided Practice',
      `Topic ${topicId}: ${topic.title}`,
      ''
    ];

    state.history.forEach(item => {
      lines.push(
        'Question ' + item.question + ': ' +
        topic.questions[item.question - 1].question,
        item.answer,
        ''
      );
    });

    const blob = new Blob(
      [lines.join('\n')],
      { type: 'text/plain;charset=utf-8' }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download =
      `Speaking_${topicId}_history.txt`;

    link.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  /* =========================================
     LOAD TOPIC JSON
  ========================================= */

  async function init() {
    try {
      const response = await fetch(
        `./topics/${topicId}.json`,
        { cache: 'no-store' }
      );

      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }

      topic = await response.json();

      if (
        topic.id !== topicId ||
        !Array.isArray(topic.questions) ||
        !topic.questions.length
      ) {
        throw new Error('Dữ liệu topic không hợp lệ');
      }

      for (const question of topic.questions) {
        if (
          typeof question.question !== 'string' ||
          !question.followUps ||
          ['reason', 'example', 'detail'].some(
            key =>
              typeof question.followUps[key] !== 'string'
          )
        ) {
          throw new Error(
            'Topic thiếu câu hỏi hoặc gợi ý'
          );
        }
      }

      /* RESTORE PROGRESS */

      try {
        const saved = JSON.parse(
          localStorage.getItem(KEY) || 'null'
        );

        if (
          saved &&
          typeof saved === 'object'
        ) {
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
        'Không tải được chủ đề. Kiểm tra topics/' +
        topicId +
        '.json và đường dẫn của website.';

      console.error(e);
      return;
    }

    /* =========================================
       EVENTS
    ========================================= */

    $('speechSupport').textContent = Recognition
      ? 'Nhận diện giọng nói phụ thuộc trình duyệt; có thể sử dụng dịch vụ trực tuyến.'
      : 'Trình duyệt chưa hỗ trợ nhận diện giọng nói. Có thể ghi âm và nhập transcript thủ công.';

    $('readQuestion').onclick = () => {
      speak(current().question);
    };

    $('record').onclick = startRecording;
    $('stop').onclick = stopRecording;
    $('analyze').onclick = analyze;

    $('answer').oninput = event => {
      state.answers[state.index] = event.target.value;
      save();
    };

    document.querySelectorAll('[data-hint]').forEach(button => {
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
          'Xóa toàn bộ tiến độ của Topic ' +
          topicId +
          '?'
        )
      ) {
        return;
      }

      if (listening) stopRecording();

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

  /* =========================================
     CLEANUP
  ========================================= */

  window.addEventListener('pagehide', () => {
    if (listening) stopRecording();

    closeStream();
    stopSpeech();
    releaseAudio();
  });

  init();
})();
