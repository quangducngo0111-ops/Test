/*
  ============================================================
  VOCABULARY ARCADE AUDIO ENGINE
  File:
  Test/Practice/Vocabulary/audio/audio-engine.js
  ============================================================

  Nhạc nền đặt trong cùng folder audio:

  audio/
  ├── audio-engine.js
  ├── whack.mp3
  ├── catcher.mp3
  ├── racer.mp3
  ├── match.mp3
  ├── flappy.mp3
  ├── balloon.mp3
  ├── shark.mp3
  └── monkey.mp3

  Sound effect KHÔNG cần file riêng.
  Code tự tạo bằng Web Audio API.
*/


(() => {

  "use strict";


  /* =========================================================
     BACKGROUND MUSIC
  ========================================================= */

  const GAME_MUSIC = {

    whack:
      "./audio/whack.mp3",

    catcher:
      "./audio/catcher.mp3",

    racer:
      "./audio/racer.mp3",

    match:
      "./audio/match.mp3",

    flappy:
      "./audio/flappy.mp3",

    balloon:
      "./audio/balloon.mp3",

    shark:
      "./audio/shark.mp3",

    monkey:
      "./audio/monkey.mp3"

  };


  /*
  Volume riêng từng game.
  0.10 = nhỏ
  0.20 = vừa
  0.30 = khá lớn
  */

  const MUSIC_VOLUME = {

    whack:0.18,

    catcher:0.16,

    racer:0.22,

    match:0.13,

    flappy:0.17,

    balloon:0.16,

    shark:0.18,

    monkey:0.14

  };


  /* =========================================================
     STORAGE
  ========================================================= */

  const STORAGE_KEYS = {

    music:
      "VOCABULARY_MUSIC_ENABLED_V2",

    sfx:
      "VOCABULARY_SFX_ENABLED_V2"

  };


  let musicEnabled =
  localStorage.getItem(
    STORAGE_KEYS.music
  )
  !==
  "false";


  let sfxEnabled =
  localStorage.getItem(
    STORAGE_KEYS.sfx
  )
  !==
  "false";


  /* =========================================================
     STATE
  ========================================================= */

  let audioContext =
  null;


  let masterGain =
  null;


  let noiseBuffer =
  null;


  let currentGameAudio =
  "";


  let currentMusicFile =
  "";


  let musicFadeTimer =
  null;


  let musicRestoreTimer =
  null;


  let lastFlapSound =
  0;


  let lastWrongSound =
  0;


  let monkeyChecking =
  false;


  /* =========================================================
     BACKGROUND AUDIO OBJECT
  ========================================================= */

  const backgroundMusic =
  new Audio();


  backgroundMusic.loop =
  true;


  backgroundMusic.preload =
  "auto";


  backgroundMusic.volume =
  0;


  backgroundMusic.setAttribute(
    "playsinline",
    ""
  );


  backgroundMusic.addEventListener(
    "error",
    ()=>{

      console.warn(
        "[Vocabulary Audio] Không tìm thấy file nhạc:",
        backgroundMusic.src
      );

    }
  );


  /* =========================================================
     AUDIO CONTEXT
  ========================================================= */

  function ensureAudioContext(){

    if(!audioContext){

      const AudioContextClass =
      window.AudioContext
      ||
      window.webkitAudioContext;


      if(
        !AudioContextClass
      ){

        return null;

      }


      audioContext =
      new AudioContextClass();


      masterGain =
      audioContext.createGain();


      masterGain.gain.value =
      .82;


      masterGain.connect(
        audioContext.destination
      );

    }


    if(
      audioContext.state ===
      "suspended"
    ){

      audioContext
      .resume()
      .catch(
        ()=>{}
      );

    }


    return audioContext;

  }


  /* =========================================================
     CREATE NOISE
  ========================================================= */

  function getNoiseBuffer(){

    const ctx =
    ensureAudioContext();


    if(!ctx){

      return null;

    }


    if(
      noiseBuffer
    ){

      return noiseBuffer;

    }


    const length =
    Math.floor(
      ctx.sampleRate
      *
      .5
    );


    const buffer =
    ctx.createBuffer(
      1,
      length,
      ctx.sampleRate
    );


    const data =
    buffer.getChannelData(
      0
    );


    for(
      let i=0;
      i<length;
      i++
    ){

      data[i] =
      Math.random()*2-1;

    }


    noiseBuffer =
    buffer;


    return buffer;

  }


  /* =========================================================
     BASIC TONE
  ========================================================= */

  function playTone({

    frequency=440,

    endFrequency=null,

    duration=.12,

    type="sine",

    volume=.07,

    delay=0,

    attack=.008,

    release=.045

  }={}){


    if(
      !sfxEnabled
    ){

      return;

    }


    const ctx =
    ensureAudioContext();


    if(
      !ctx
      ||
      !masterGain
    ){

      return;

    }


    const start =
    ctx.currentTime
    +
    delay;


    const end =
    start
    +
    duration;


    const oscillator =
    ctx.createOscillator();


    const gain =
    ctx.createGain();


    oscillator.type =
    type;


    oscillator.frequency
    .setValueAtTime(
      Math.max(
        20,
        frequency
      ),
      start
    );


    if(
      typeof endFrequency ===
      "number"
      &&
      endFrequency >
      0
    ){

      oscillator.frequency
      .exponentialRampToValueAtTime(

        Math.max(
          20,
          endFrequency
        ),

        end

      );

    }


    gain.gain
    .setValueAtTime(
      .0001,
      start
    );


    gain.gain
    .exponentialRampToValueAtTime(

      Math.max(
        .0002,
        volume
      ),

      start
      +
      attack

    );


    gain.gain
    .exponentialRampToValueAtTime(

      .0001,

      Math.max(
        start
        +
        attack
        +
        .01,

        end
        -
        release
      )

    );


    oscillator.connect(
      gain
    );


    gain.connect(
      masterGain
    );


    oscillator.start(
      start
    );


    oscillator.stop(
      end+.03
    );

  }


  /* =========================================================
     NOISE SOUND
  ========================================================= */

  function playNoise({

    duration=.1,

    volume=.04,

    delay=0,

    highpass=0,

    lowpass=0

  }={}){


    if(
      !sfxEnabled
    ){

      return;

    }


    const ctx =
    ensureAudioContext();


    const buffer =
    getNoiseBuffer();


    if(
      !ctx
      ||
      !buffer
      ||
      !masterGain
    ){

      return;

    }


    const source =
    ctx.createBufferSource();


    source.buffer =
    buffer;


    let output =
    source;


    if(
      highpass >
      0
    ){

      const filter =
      ctx.createBiquadFilter();


      filter.type =
      "highpass";


      filter.frequency.value =
      highpass;


      output.connect(
        filter
      );


      output =
      filter;

    }


    if(
      lowpass >
      0
    ){

      const filter =
      ctx.createBiquadFilter();


      filter.type =
      "lowpass";


      filter.frequency.value =
      lowpass;


      output.connect(
        filter
      );


      output =
      filter;

    }


    const gain =
    ctx.createGain();


    const start =
    ctx.currentTime
    +
    delay;


    gain.gain
    .setValueAtTime(

      Math.max(
        .0002,
        volume
      ),

      start

    );


    gain.gain
    .exponentialRampToValueAtTime(

      .0001,

      start
      +
      duration

    );


    output.connect(
      gain
    );


    gain.connect(
      masterGain
    );


    source.start(
      start
    );


    source.stop(
      start
      +
      duration
      +
      .03
    );

  }


  /* =========================================================
     FADE MUSIC
  ========================================================= */

  function fadeMusicTo(

    targetVolume,

    duration=250

  ){


    clearInterval(
      musicFadeTimer
    );


    const startVolume =
    backgroundMusic.volume;


    const difference =
    targetVolume
    -
    startVolume;


    const startTime =
    performance.now();


    musicFadeTimer =
    setInterval(
      ()=>{

        const progress =
        Math.min(

          1,

          (
            performance.now()
            -
            startTime
          )
          /
          duration

        );


        backgroundMusic.volume =
        Math.max(

          0,

          Math.min(

            1,

            startVolume
            +
            difference
            *
            progress

          )

        );


        if(
          progress >=
          1
        ){

          clearInterval(
            musicFadeTimer
          );


          musicFadeTimer =
          null;

        }

      },

      20

    );

  }


  /* =========================================================
     DUCK BACKGROUND MUSIC
  ========================================================= */

  function duckMusic(

    duration=350,

    multiplier=.35

  ){


    if(
      !musicEnabled
      ||
      backgroundMusic.paused
    ){

      return;

    }


    const normalVolume =
    MUSIC_VOLUME[
      currentGameAudio
    ]
    ??
    .17;


    clearTimeout(
      musicRestoreTimer
    );


    backgroundMusic.volume =
    Math.min(

      backgroundMusic.volume,

      normalVolume
      *
      multiplier

    );


    musicRestoreTimer =
    setTimeout(
      ()=>{

        if(
          !backgroundMusic.paused
          &&
          musicEnabled
        ){

          fadeMusicTo(
            normalVolume,
            180
          );

        }

      },

      duration

    );

  }


  /* =========================================================
     MUSIC START
  ========================================================= */

  function startMusic(game){

    if(
      !game
    ){

      return;

    }


    currentGameAudio =
    game;


    if(
      !musicEnabled
    ){

      return;

    }


    const file =
    GAME_MUSIC[
      game
    ];


    if(
      !file
    ){

      return;

    }


    const targetVolume =
    MUSIC_VOLUME[
      game
    ]
    ??
    .17;


    if(
      currentMusicFile !==
      file
    ){

      try{

        backgroundMusic.pause();

      }

      catch(error){}


      backgroundMusic.src =
      file;


      backgroundMusic.load();


      currentMusicFile =
      file;

    }


    try{

      backgroundMusic.currentTime =
      0;

    }

    catch(error){}


    backgroundMusic.volume =
    0;


    const promise =
    backgroundMusic.play();


    if(
      promise
      &&
      typeof promise.then ===
      "function"
    ){

      promise
      .then(
        ()=>{

          fadeMusicTo(
            targetVolume,
            450
          );

        }
      )
      .catch(
        ()=>{

          console.warn(
            "[Vocabulary Audio] Trình duyệt chưa cho phép autoplay."
          );

        }
      );

    }

  }


  /* =========================================================
     MUSIC STOP
  ========================================================= */

  function stopMusic(

    fade=true

  ){


    clearTimeout(
      musicRestoreTimer
    );


    clearInterval(
      musicFadeTimer
    );


    function finish(){

      try{

        backgroundMusic.pause();


        backgroundMusic.currentTime =
        0;

      }

      catch(error){}


      backgroundMusic.volume =
      0;


      currentMusicFile =
      "";

    }


    if(
      fade
      &&
      !backgroundMusic.paused
      &&
      backgroundMusic.volume >
      0
    ){

      const initial =
      backgroundMusic.volume;


      const start =
      performance.now();


      musicFadeTimer =
      setInterval(
        ()=>{

          const progress =
          Math.min(

            1,

            (
              performance.now()
              -
              start
            )
            /
            220

          );


          backgroundMusic.volume =
          Math.max(

            0,

            initial
            *
            (
              1-progress
            )

          );


          if(
            progress >=
            1
          ){

            clearInterval(
              musicFadeTimer
            );


            musicFadeTimer =
            null;


            finish();

          }

        },

        20

      );

    }

    else{

      finish();

    }

  }


  /* =========================================================
     SOUND EFFECTS
  ========================================================= */

  function playSFX(name){


    if(
      !sfxEnabled
    ){

      return;

    }


    ensureAudioContext();


    switch(name){


      /* ---------------- UI CLICK ---------------- */

      case "ui":

        playTone({

          frequency:520,

          endFrequency:650,

          duration:.055,

          type:"sine",

          volume:.025

        });

      break;


      /* ---------------- GAME START ---------------- */

      case "start":

        duckMusic(
          400,
          .35
        );


        playTone({

          frequency:392,

          duration:.09,

          type:"triangle",

          volume:.055

        });


        playTone({

          frequency:523,

          duration:.1,

          delay:.07,

          type:"triangle",

          volume:.06

        });


        playTone({

          frequency:659,

          duration:.14,

          delay:.14,

          type:"triangle",

          volume:.07

        });

      break;


      /* ---------------- CORRECT ---------------- */

      case "correct":

        duckMusic(
          320,
          .38
        );


        playTone({

          frequency:523,

          duration:.09,

          type:"sine",

          volume:.06

        });


        playTone({

          frequency:659,

          duration:.1,

          delay:.07,

          type:"sine",

          volume:.065

        });


        playTone({

          frequency:784,

          duration:.15,

          delay:.14,

          type:"sine",

          volume:.075

        });

      break;


      /* ---------------- WRONG ---------------- */

      case "wrong":

        duckMusic(
          430,
          .25
        );


        playTone({

          frequency:230,

          endFrequency:135,

          duration:.25,

          type:"sawtooth",

          volume:.05

        });


        playTone({

          frequency:116,

          duration:.13,

          delay:.12,

          type:"square",

          volume:.024

        });

      break;


      /* =====================================================
         WHACK A WORD
      ===================================================== */

      case "whack":

        duckMusic(
          180,
          .48
        );


        playTone({

          frequency:135,

          endFrequency:58,

          duration:.11,

          type:"sine",

          volume:.12

        });


        playNoise({

          duration:.065,

          volume:.055,

          lowpass:1100

        });

      break;


      /* =====================================================
         WORD CATCHER
      ===================================================== */

      case "catch":

        playTone({

          frequency:240,

          endFrequency:420,

          duration:.11,

          type:"sine",

          volume:.07

        });


        playTone({

          frequency:600,

          duration:.08,

          delay:.09,

          type:"triangle",

          volume:.045

        });

      break;


      /* =====================================================
         RACER BOOST
      ===================================================== */

      case "boost":

        duckMusic(
          450,
          .45
        );


        playTone({

          frequency:90,

          endFrequency:650,

          duration:.43,

          type:"sawtooth",

          volume:.06

        });


        playNoise({

          duration:.22,

          volume:.026,

          highpass:1800

        });


        playTone({

          frequency:880,

          duration:.1,

          delay:.34,

          type:"sine",

          volume:.055

        });

      break;


      /* =====================================================
         CAR CRASH
      ===================================================== */

      case "carCrash":

        duckMusic(
          600,
          .18
        );


        playNoise({

          duration:.34,

          volume:.105,

          lowpass:1800

        });


        playTone({

          frequency:115,

          endFrequency:47,

          duration:.31,

          type:"sawtooth",

          volume:.08

        });

      break;


      /* =====================================================
         MATCH
      ===================================================== */

      case "match":

        duckMusic(
          300,
          .42
        );


        playTone({

          frequency:659,

          duration:.08,

          type:"sine",

          volume:.05

        });


        playTone({

          frequency:988,

          duration:.13,

          delay:.06,

          type:"sine",

          volume:.06

        });


        playTone({

          frequency:1318,

          duration:.12,

          delay:.12,

          type:"sine",

          volume:.045

        });

      break;


      /* =====================================================
         FLAPPY WING
      ===================================================== */

      case "flap":

        playNoise({

          duration:.07,

          volume:.03,

          highpass:1300

        });


        playTone({

          frequency:175,

          endFrequency:265,

          duration:.09,

          type:"triangle",

          volume:.025

        });

      break;


      /* =====================================================
         BIRD CRASH
      ===================================================== */

      case "birdCrash":

        duckMusic(
          520,
          .22
        );


        playTone({

          frequency:170,

          endFrequency:68,

          duration:.24,

          type:"square",

          volume:.055

        });


        playNoise({

          duration:.2,

          volume:.055,

          lowpass:900

        });

      break;


      /* =====================================================
         BALLOON POP
      ===================================================== */

      case "pop":

        playTone({

          frequency:380,

          endFrequency:145,

          duration:.065,

          type:"sine",

          volume:.095

        });


        playNoise({

          duration:.04,

          volume:.055,

          highpass:1000

        });

      break;


      /* =====================================================
         WATER SPLASH
      ===================================================== */

      case "splash":

        playNoise({

          duration:.2,

          volume:.045,

          highpass:450,

          lowpass:3500

        });


        playTone({

          frequency:180,

          endFrequency:290,

          duration:.15,

          type:"sine",

          volume:.032

        });

      break;


      /* =====================================================
         SHARK DANGER
      ===================================================== */

      case "sharkDanger":

        duckMusic(
          520,
          .28
        );


        playTone({

          frequency:72,

          duration:.14,

          type:"sine",

          volume:.1

        });


        playTone({

          frequency:72,

          duration:.16,

          delay:.2,

          type:"sine",

          volume:.085

        });

      break;


      /* =====================================================
         SHARK BITE
      ===================================================== */

      case "sharkBite":

        duckMusic(
          750,
          .12
        );


        playNoise({

          duration:.22,

          volume:.11,

          lowpass:1300

        });


        playTone({

          frequency:105,

          endFrequency:42,

          duration:.36,

          type:"sawtooth",

          volume:.095

        });


        playTone({

          frequency:900,

          endFrequency:180,

          duration:.16,

          type:"square",

          volume:.025

        });

      break;


      /* =====================================================
         LOCK WHEEL
      ===================================================== */

      case "lockTick":

        playTone({

          frequency:980,

          duration:.025,

          type:"square",

          volume:.027

        });


        playTone({

          frequency:610,

          duration:.025,

          delay:.018,

          type:"square",

          volume:.018

        });

      break;


      /* =====================================================
         UNLOCK
      ===================================================== */

      case "unlock":

        duckMusic(
          800,
          .22
        );


        playTone({

          frequency:180,

          duration:.07,

          type:"square",

          volume:.045

        });


        playTone({

          frequency:260,

          duration:.08,

          delay:.06,

          type:"square",

          volume:.042

        });


        playTone({

          frequency:523,

          duration:.13,

          delay:.14,

          type:"triangle",

          volume:.065

        });


        playTone({

          frequency:659,

          duration:.13,

          delay:.23,

          type:"triangle",

          volume:.068

        });


        playTone({

          frequency:784,

          duration:.23,

          delay:.32,

          type:"triangle",

          volume:.075

        });

      break;


      /* =====================================================
         LIFE LOST
      ===================================================== */

      case "lifeLost":

        playTone({

          frequency:175,

          endFrequency:110,

          duration:.22,

          type:"triangle",

          volume:.045

        });

      break;


      /* =====================================================
         FINISH
      ===================================================== */

      case "finish":

        duckMusic(
          950,
          .18
        );


        playTone({

          frequency:523,

          duration:.12,

          type:"triangle",

          volume:.06

        });


        playTone({

          frequency:659,

          duration:.12,

          delay:.09,

          type:"triangle",

          volume:.06

        });


        playTone({

          frequency:784,

          duration:.12,

          delay:.18,

          type:"triangle",

          volume:.065

        });


        playTone({

          frequency:1046,

          duration:.38,

          delay:.28,

          type:"sine",

          volume:.085

        });

      break;


      /* =====================================================
         FAIL
      ===================================================== */

      case "fail":

        duckMusic(
          850,
          .15
        );


        playTone({

          frequency:330,

          endFrequency:220,

          duration:.22,

          type:"triangle",

          volume:.05

        });


        playTone({

          frequency:220,

          endFrequency:130,

          duration:.32,

          delay:.18,

          type:"triangle",

          volume:.055

        });

      break;

    }

  }


  /* =========================================================
     MUSIC TOGGLE
  ========================================================= */

  function toggleMusic(){

    ensureAudioContext();


    musicEnabled =
    !musicEnabled;


    localStorage.setItem(

      STORAGE_KEYS.music,

      String(
        musicEnabled
      )

    );


    updateAudioButtons();


    if(
      !musicEnabled
    ){

      stopMusic(
        true
      );


      return;

    }


    if(
      currentGameAudio
    ){

      startMusic(
        currentGameAudio
      );

    }

  }


  /* =========================================================
     SFX TOGGLE
  ========================================================= */

  function toggleSFX(){

    ensureAudioContext();


    sfxEnabled =
    !sfxEnabled;


    localStorage.setItem(

      STORAGE_KEYS.sfx,

      String(
        sfxEnabled
      )

    );


    updateAudioButtons();


    if(
      sfxEnabled
    ){

      playSFX(
        "ui"
      );

    }

  }


  /* =========================================================
     AUDIO BUTTON STYLE
  ========================================================= */

  function addAudioStyles(){

    if(
      document.getElementById(
        "vocabularyAudioStyles"
      )
    ){

      return;

    }


    const style =
    document.createElement(
      "style"
    );


    style.id =
    "vocabularyAudioStyles";


    style.textContent =
    `

      .vocab-audio-controls{

        display:flex;

        align-items:center;

        gap:6px;

      }


      .vocab-audio-button{

        padding:7px 9px;

        border:
          1px solid
          var(--line,#e3e7ef);

        border-radius:9px;

        background:#fff;

        color:#50388e;

        font:inherit;

        font-size:9px;

        font-weight:950;

        cursor:pointer;

        white-space:nowrap;

        transition:.15s ease;

      }


      .vocab-audio-button:hover{

        transform:
          translateY(-1px);

        border-color:#cfc5ec;

      }


      .vocab-audio-button.off{

        background:#f5f6f8;

        color:#969ba6;

      }


      @media(max-width:650px){

        .vocab-audio-button span{

          display:none;

        }


        .vocab-audio-button{

          min-width:34px;

          padding:7px;

        }

      }

    `;


    document.head
    .appendChild(
      style
    );

  }


  /* =========================================================
     CREATE AUDIO BUTTONS
  ========================================================= */

  function createAudioButtons(){

    addAudioStyles();


    if(
      document.getElementById(
        "vocabAudioControls"
      )
    ){

      return;

    }


    /*
    Nếu index cũ đang có nút:
    id="musicToggle"
    thì ẩn nút đó đi.
    */

    const oldMusicButton =
    document.getElementById(
      "musicToggle"
    );


    if(
      oldMusicButton
    ){

      oldMusicButton.style.display =
      "none";

    }


    const controls =
    document.createElement(
      "div"
    );


    controls.id =
    "vocabAudioControls";


    controls.className =
    "vocab-audio-controls";


    controls.innerHTML =
    `

      <button
        type="button"
        id="vocabMusicButton"
        class="vocab-audio-button"
        aria-label="Bật tắt nhạc nền"
      >
      </button>


      <button
        type="button"
        id="vocabSfxButton"
        class="vocab-audio-button"
        aria-label="Bật tắt hiệu ứng âm thanh"
      >
      </button>

    `;


    const topActions =
    document.querySelector(
      ".top-actions"
    );


    const topInner =
    document.querySelector(
      ".top-inner"
    );


    const host =
    topActions
    ||
    topInner;


    if(
      host
    ){

      const student =
      host.querySelector(
        ".student"
      );


      host.insertBefore(

        controls,

        student
        ||
        null

      );

    }


    const musicButton =
    document.getElementById(
      "vocabMusicButton"
    );


    const sfxButton =
    document.getElementById(
      "vocabSfxButton"
    );


    if(
      musicButton
    ){

      musicButton.addEventListener(
        "click",
        event=>{

          event.stopPropagation();


          toggleMusic();

        }
      );

    }


    if(
      sfxButton
    ){

      sfxButton.addEventListener(
        "click",
        event=>{

          event.stopPropagation();


          toggleSFX();

        }
      );

    }


    updateAudioButtons();

  }


  /* =========================================================
     UPDATE BUTTONS
  ========================================================= */

  function updateAudioButtons(){

    const musicButton =
    document.getElementById(
      "vocabMusicButton"
    );


    const sfxButton =
    document.getElementById(
      "vocabSfxButton"
    );


    if(
      musicButton
    ){

      musicButton.innerHTML =
      musicEnabled

      ?

      `🎵 <span>Nhạc nền</span>`

      :

      `🔇 <span>Nhạc nền</span>`;


      musicButton
      .classList
      .toggle(
        "off",
        !musicEnabled
      );

    }


    if(
      sfxButton
    ){

      sfxButton.innerHTML =
      sfxEnabled

      ?

      `🔔 <span>Hiệu ứng</span>`

      :

      `🔕 <span>Hiệu ứng</span>`;


      sfxButton
      .classList
      .toggle(
        "off",
        !sfxEnabled
      );

    }

  }


  /* =========================================================
     WRAP EXISTING FUNCTIONS
  ========================================================= */

  function wrapFunction(

    functionName,

    wrapper

  ){


    const original =
    window[
      functionName
    ];


    if(
      typeof original !==
      "function"
    ){

      return false;

    }


    if(
      original
      .__audioWrapped
    ){

      return false;

    }


    const patched =
    function(...args){

      return wrapper.call(

        this,

        original,

        args

      );

    };


    patched.__audioWrapped =
    true;


    patched.__original =
    original;


    window[
      functionName
    ] =
    patched;


    return true;

  }


  /* =========================================================
     CORRECT SOUND BY GAME
  ========================================================= */

  function playCorrectForGame(){


    switch(
      currentGameAudio
    ){


      case "whack":

        setTimeout(
          ()=>playSFX(
            "correct"
          ),
          40
        );

      break;


      case "catcher":

        playSFX(
          "catch"
        );


        setTimeout(
          ()=>playSFX(
            "correct"
          ),
          80
        );

      break;


      case "racer":

        playSFX(
          "boost"
        );

      break;


      case "match":

        playSFX(
          "match"
        );

      break;


      case "flappy":

        playSFX(
          "correct"
        );

      break;


      case "balloon":

        setTimeout(
          ()=>playSFX(
            "correct"
          ),
          40
        );

      break;


      case "shark":

        playSFX(
          "splash"
        );


        setTimeout(
          ()=>playSFX(
            "correct"
          ),
          100
        );

      break;


      case "monkey":

        if(
          !monkeyChecking
        ){

          playSFX(
            "correct"
          );

        }

      break;


      default:

        playSFX(
          "correct"
        );

    }

  }


  /* =========================================================
     WRONG SOUND BY GAME
  ========================================================= */

  function playWrongForGame(){


    if(
      monkeyChecking
      &&
      currentGameAudio ===
      "monkey"
    ){

      return;

    }


    const now =
    performance.now();


    if(
      now
      -
      lastWrongSound
      <
      100
    ){

      return;

    }


    lastWrongSound =
    now;


    if(
      currentGameAudio ===
      "racer"
    ){

      playSFX(
        "carCrash"
      );


      setTimeout(
        ()=>playSFX(
          "wrong"
        ),
        90
      );


      return;

    }


    if(
      currentGameAudio ===
      "shark"
    ){

      playSFX(
        "sharkDanger"
      );


      setTimeout(
        ()=>playSFX(
          "wrong"
        ),
        90
      );


      return;

    }


    playSFX(
      "wrong"
    );

  }


  /* =========================================================
     INSTALL GAME HOOKS
  ========================================================= */

  function installHooks(){


    /*
    index.html bản trước của bạn có:
    startGameMusic()
    stopGameMusic()
    toggleMusic()

    Ta ghi đè để dùng engine mới.
    */


    window.startGameMusic =
    function(game){

      currentGameAudio =
      game;


      startMusic(
        game
      );

    };


    window.stopGameMusic =
    function(){

      stopMusic(
        true
      );

    };


    window.toggleMusic =
    function(){

      toggleMusic();

    };


    /* =====================================================
       BEGIN GAME
    ===================================================== */


    wrapFunction(
      "beginPendingGame",
      (
        original,
        args
      )=>{


        ensureAudioContext();


        const result =
        original.apply(
          window,
          args
        );


        /*
        currentGameAudio thường đã được set
        qua startGameMusic(currentGame)
        trong index.html.
        */


        playSFX(
          "start"
        );


        return result;

      }
    );


    /* =====================================================
       CORRECT
    ===================================================== */


    wrapFunction(
      "correctAnswer",
      (
        original,
        args
      )=>{


        const result =
        original.apply(
          window,
          args
        );


        playCorrectForGame();


        return result;

      }
    );


    /* =====================================================
       WRONG
    ===================================================== */


    wrapFunction(
      "wrongAnswer",
      (
        original,
        args
      )=>{


        const result =
        original.apply(
          window,
          args
        );


        playWrongForGame();


        return result;

      }
    );


    /* =====================================================
       LOSE LIFE
    ===================================================== */


    wrapFunction(
      "loseLife",
      (
        original,
        args
      )=>{


        const result =
        original.apply(
          window,
          args
        );


        setTimeout(
          ()=>{

            playSFX(
              "lifeLost"
            );

          },
          100
        );


        return result;

      }
    );


    /* =====================================================
       FLAPPY
    ===================================================== */


    wrapFunction(
      "flap",
      (
        original,
        args
      )=>{


        const now =
        performance.now();


        if(
          now
          -
          lastFlapSound
          >
          65
        ){

          lastFlapSound =
          now;


          playSFX(
            "flap"
          );

        }


        return original.apply(
          window,
          args
        );

      }
    );


    wrapFunction(
      "flappyGroundCrash",
      (
        original,
        args
      )=>{


        playSFX(
          "birdCrash"
        );


        return original.apply(
          window,
          args
        );

      }
    );


    /* =====================================================
       SHARK
    ===================================================== */


    wrapFunction(
      "sharkCaught",
      (
        original,
        args
      )=>{


        playSFX(
          "sharkBite"
        );


        return original.apply(
          window,
          args
        );

      }
    );


    /* =====================================================
       MONKEY LOCK
    ===================================================== */


    wrapFunction(
      "rotateMonkeyWheel",
      (
        original,
        args
      )=>{


        playSFX(
          "lockTick"
        );


        return original.apply(
          window,
          args
        );

      }
    );


    wrapFunction(
      "checkMonkeyCode",
      (
        original,
        args
      )=>{


        monkeyChecking =
        true;


        const result =
        original.apply(
          window,
          args
        );


        monkeyChecking =
        false;


        setTimeout(
          ()=>{


            const door =
            document.getElementById(
              "monkeyDoor"
            );


            const wrongSlot =
            document.querySelector(
              ".lock-column.wrong"
            );


            if(
              door
              &&
              door.classList.contains(
                "open"
              )
            ){

              playSFX(
                "unlock"
              );

            }

            else if(
              wrongSlot
            ){

              playSFX(
                "wrong"
              );

            }

          },
          30
        );


        return result;

      }
    );


    /* =====================================================
       END GAME
    ===================================================== */


    wrapFunction(
      "endGame",
      (
        original,
        args
      )=>{


        const completed =
        Boolean(
          args[0]
        );


        let setComplete =
        false;


        try{

          if(
            typeof window.isSetComplete ===
            "function"
          ){

            setComplete =
            Boolean(
              window.isSetComplete()
            );

          }

        }

        catch(error){}


        const success =
        completed
        ||
        setComplete;


        const result =
        original.apply(
          window,
          args
        );


        stopMusic(
          true
        );


        setTimeout(
          ()=>{

            playSFX(

              success

              ?

              "finish"

              :

              "fail"

            );

          },
          100
        );


        return result;

      }
    );


    /* =====================================================
       STOP / BACK
    ===================================================== */


    wrapFunction(
      "stopGame",
      (
        original,
        args
      )=>{


        stopMusic(
          true
        );


        return original.apply(
          window,
          args
        );

      }
    );


    wrapFunction(
      "backToGameList",
      (
        original,
        args
      )=>{


        stopMusic(
          true
        );


        return original.apply(
          window,
          args
        );

      }
    );

  }


  /* =========================================================
     CLICK SOUND
  ========================================================= */

  function installClickSounds(){


    document.addEventListener(

      "pointerdown",

      event=>{


        ensureAudioContext();


        const element =
        event.target;


        if(
          !(
            element
            instanceof
            Element
          )
        ){

          return;

        }


        /* ---------------- WHACK ---------------- */


        if(
          element.closest(
            ".mole"
          )
        ){

          playSFX(
            "whack"
          );


          return;

        }


        /* ---------------- BALLOON ---------------- */


        if(
          element.closest(
            ".balloon-shape"
          )
        ){

          playSFX(
            "pop"
          );


          return;

        }


        /* ---------------- SHARK BUOY ---------------- */


        if(
          element.closest(
            ".shark-buoy"
          )
        ){

          playSFX(
            "splash"
          );


          return;

        }


        /* ---------------- UI ---------------- */


        if(
          element.closest(

            ".game-play,"
            +
            ".screen-back,"
            +
            ".game-back,"
            +
            ".intro-start,"
            +
            ".study-again"

          )
        ){

          playSFX(
            "ui"
          );

        }

      },

      {
        passive:true
      }

    );

  }


  /* =========================================================
     PAGE VISIBILITY
  ========================================================= */

  function installVisibilityHandler(){


    document.addEventListener(
      "visibilitychange",
      ()=>{


        if(
          document.hidden
        ){

          try{

            backgroundMusic.pause();

          }

          catch(error){}


          return;

        }


        if(
          musicEnabled
          &&
          currentMusicFile
        ){

          const volume =
          MUSIC_VOLUME[
            currentGameAudio
          ]
          ??
          .17;


          backgroundMusic
          .play()
          .then(
            ()=>{

              fadeMusicTo(
                volume,
                220
              );

            }
          )
          .catch(
            ()=>{}
          );

        }

      }
    );

  }


  /* =========================================================
     INITIAL AUDIO UNLOCK
  ========================================================= */

  function installAudioUnlock(){


    function unlock(){


      ensureAudioContext();


      document.removeEventListener(
        "pointerdown",
        unlock,
        true
      );


      document.removeEventListener(
        "keydown",
        unlock,
        true
      );

    }


    document.addEventListener(
      "pointerdown",
      unlock,
      true
    );


    document.addEventListener(
      "keydown",
      unlock,
      true
    );

  }


  /* =========================================================
     INIT
  ========================================================= */

  function initVocabularyAudio(){


    createAudioButtons();


    installHooks();


    installClickSounds();


    installVisibilityHandler();


    installAudioUnlock();


    updateAudioButtons();

  }


  if(
    document.readyState ===
    "loading"
  ){

    document.addEventListener(

      "DOMContentLoaded",

      initVocabularyAudio,

      {
        once:true
      }

    );

  }

  else{

    initVocabularyAudio();

  }


  /* =========================================================
     PUBLIC API
  ========================================================= */

  window.VocabAudio = {


    play:

      playSFX,


    startMusic:

      startMusic,


    stopMusic:

      stopMusic,


    toggleMusic:

      toggleMusic,


    toggleSFX:

      toggleSFX,


    get musicEnabled(){

      return musicEnabled;

    },


    get sfxEnabled(){

      return sfxEnabled;

    },


    backgroundMusic:

      backgroundMusic

  };


})();
