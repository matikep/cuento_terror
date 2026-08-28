/* ============================================================
   EL SUSURRO DEL VACÍO — motor
   La historia vive en story.js (const STORY_DATA), cargada por <script src>.
   ============================================================ */

// ============ CONSTANTES ============
const SANITY_REGEN = 4;              // por nodo: sin recuperación no hay curva, solo caída
const SANITY_MAX = 100;
const HEARTBEAT_THRESHOLD = 40;
const SHAKE_THRESHOLD = 18;
const GYRO_MIN_INTERVAL = 50;        // 20Hz: deviceorientation dispara a 60Hz y funde el móvil
const SILENCE_MS = 2600;
const SUBLIMINAL_EVERY = 4000;
const STORAGE_KEY = 'susurro_vacio';
const GESTURE_TICK = 100;
const GESTURE_ESCAPE_MS = 12000;   // tras esto se ofrece salida: el cuento nunca se queda muerto

const GLITCH_CHARS = ['†','‡','☠','Ω','¥','§','∆','◊','░','▒','▓','█','Ψ','Σ','λ'];
const REPLACE_WORDS = ['AYUDA','MÍRAME','ÉL VIENE','NO ESTÁS SOLO','CORRE','DETRÁS DE TI','NO DESPIERTES'];
const SUBLIMINAL_MSGS = ['TE VEO','NO ESTÁS SOLO','DATE LA VUELTA','DESPIERTA','ES REAL','SIEMPRE ESTUVO AHÍ','NO CIERRES LOS OJOS','DETRÁS DE TI'];
const TILT_SECRETS = ['NO MUEVAS EL TERMINAL','ÉL SABE QUE MIRAS','DETRÁS DEL CRISTAL','LAS PAREDES TE SIENTEN','NO ESTÁS LEYENDO... TE ESTÁN LEYENDO'];
const DODGE_TEXTS = ['No hagas esto','Él te observa','No hay salida','Error','???','...'];

// ============ ESTADO ============
const sanityState = { text: 100, visual: 100, perceptive: 100, interface: 100 };
let storyNodes = {};
let currentNode = null;
let debugMode = false;
let reducedMotion = false;
let audioMuted = false;

// Elementos cacheados (se rellenan en init)
const el = {};

// ============ PERSISTENCIA ============
// El cuento habla de bucles y de volver. Sin esto, "sabía que volverías" es una frase;
// con esto, es verdad comprobable.
const save = {
  visits: 0, name: '', last: 0, seen: [], endings: []
};

function loadSave() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) Object.assign(save, JSON.parse(raw));
  } catch (e) { /* modo privado: el vacío no recuerda, y no pasa nada */ }
}

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(save)); } catch (e) {}
}

function humanSince(ts) {
  if (!ts) return 'hace un momento';
  const mins = Math.floor((Date.now() - ts) / 60000);
  if (mins < 2) return 'hace un instante';
  if (mins < 60) return `hace ${mins} minutos`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs} ${hrs === 1 ? 'hora' : 'horas'}`;
  const days = Math.floor(hrs / 24);
  return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
}

// ============ META-NARRATIVA ============
let batteryLevel = null;
if ('getBattery' in navigator) {
  navigator.getBattery().then(b => {
    batteryLevel = b.level;
    b.addEventListener('levelchange', () => batteryLevel = b.level);
  }).catch(() => {});
}

function deviceName() {
  const ua = navigator.userAgent;
  if (/iPhone/i.test(ua)) return 'iPhone';
  if (/iPad/i.test(ua)) return 'iPad';
  if (/Android/i.test(ua)) return 'Android';
  if (/Macintosh/i.test(ua)) return 'Mac';
  if (/Windows/i.test(ua)) return 'PC';
  return 'Terminal Desconocido';
}

function parseMetaNarrative(text) {
  const d = new Date();
  const pad = n => n.toString().padStart(2, '0');
  const vars = {
    time: pad(d.getHours()) + ':' + pad(d.getMinutes()),
    device: deviceName(),
    battery: batteryLevel !== null ? Math.round(batteryLevel * 100) + '%' : '13%',
    name: save.name || 'Sin Nombre',
    visits: save.visits,
    since: humanSince(save.last),
    lastseen: save.last ? new Date(save.last).toLocaleString('es') : 'nunca'
  };
  return text.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? vars[k] : m));
}

// ============ AUDIO ============
let audioCtx = null, masterGain = null, wetGain = null;
let droneOsc = null, droneHarm = null, droneFilter = null, droneLfo = null;
let noiseBuffer = null, convolver = null;
let audioEnabled = false, silenceTimer = null;

function makeImpulse(seconds, decay) {
  const rate = audioCtx.sampleRate, len = Math.floor(rate * seconds);
  const buf = audioCtx.createBuffer(2, len, rate);
  for (let c = 0; c < 2; c++) {
    const ch = buf.getChannelData(c);
    for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  return buf;
}

function initAudio() {
  if (audioCtx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  audioCtx = new AC();

  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.5;
  masterGain.connect(audioCtx.destination);

  // Reverb: los clicks deben sonar dentro de una habitación, no dentro del teléfono.
  convolver = audioCtx.createConvolver();
  convolver.buffer = makeImpulse(2.4, 2.5);
  wetGain = audioCtx.createGain();
  wetGain.gain.value = 0.5;
  convolver.connect(wetGain);
  wetGain.connect(masterGain);

  droneFilter = audioCtx.createBiquadFilter();
  droneFilter.type = 'lowpass';
  droneFilter.frequency.value = 150;
  droneFilter.connect(masterGain);

  droneOsc = audioCtx.createOscillator();
  droneOsc.type = 'triangle';
  droneOsc.frequency.value = 45;
  droneOsc.connect(droneFilter);

  // 45Hz es inaudible en un altavoz de móvil. El armónico hace que el sub se *perciba*.
  droneHarm = audioCtx.createOscillator();
  droneHarm.type = 'sine';
  droneHarm.frequency.value = 90;
  const harmGain = audioCtx.createGain();
  harmGain.gain.value = 0.18;
  droneHarm.connect(harmGain);
  harmGain.connect(droneFilter);

  droneLfo = audioCtx.createOscillator();
  droneLfo.type = 'sine';
  droneLfo.frequency.value = 0.2;
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.value = 100;
  droneLfo.connect(lfoGain);
  lfoGain.connect(droneFilter.frequency);

  droneOsc.start(); droneHarm.start(); droneLfo.start();
  audioEnabled = true;
  updateAudioScene();
}

function targetVolume() { return audioMuted ? 0 : 0.5; }

function updateAudioScene() {
  if (!audioEnabled) return;
  const sv = sanityState.visual, t = audioCtx.currentTime;
  const freq = sv < 30 ? 68 : sv < 60 ? 55 : 45;
  droneOsc.frequency.setTargetAtTime(freq, t, 1);
  droneHarm.frequency.setTargetAtTime(freq * 2, t, 1);
  droneFilter.frequency.setTargetAtTime(sv < 30 ? 800 : sv < 60 ? 300 : 150, t, 1);
  droneLfo.frequency.setTargetAtTime(sv < 30 ? 3.5 : sv < 60 ? 0.8 : 0.2, t, 1);
  if (!silenceTimer) masterGain.gain.setTargetAtTime(targetVolume(), t, 0.5);
}

// Cortar el sonido en seco asusta más que subirle el volumen.
function dropToSilence(ms) {
  if (!audioEnabled) return;
  clearTimeout(silenceTimer);
  masterGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.04);
  silenceTimer = setTimeout(() => {
    silenceTimer = null;
    masterGain.gain.setTargetAtTime(targetVolume(), audioCtx.currentTime, 1.5);
  }, ms);
}

function playTypewriterClick() {
  if (!audioEnabled || audioMuted || masterGain.gain.value < 0.01) return;
  if (!noiseBuffer) {
    noiseBuffer = audioCtx.createBuffer(1, Math.floor(audioCtx.sampleRate * 0.1), audioCtx.sampleRate);
    const out = noiseBuffer.getChannelData(0);
    for (let i = 0; i < out.length; i++) out[i] = Math.random() * 2 - 1;
  }
  const noise = audioCtx.createBufferSource();
  noise.buffer = noiseBuffer;
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 2000 + Math.random() * 3000;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.03 + Math.random() * 0.05, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
  noise.connect(filter); filter.connect(gain);
  gain.connect(masterGain);
  gain.connect(convolver);
  noise.start();
  noise.stop(audioCtx.currentTime + 0.05);
}

// Nada rompe más la cuarta pared que el propio teléfono hablando. Tres veces en toda la historia.
function whisper(text) {
  if (audioMuted || !('speechSynthesis' in window)) return;
  try {
    const u = new SpeechSynthesisUtterance(parseMetaNarrative(text));
    u.rate = 0.6; u.pitch = 0.1; u.volume = 0.6; u.lang = 'es-ES';
    speechSynthesis.speak(u);
  } catch (e) {}
}

function toggleMute() {
  audioMuted = !audioMuted;
  el.muteBtn.textContent = audioMuted ? '🔇' : '🔊';
  el.muteBtn.setAttribute('aria-label', audioMuted ? 'Activar sonido' : 'Silenciar');
  if (audioMuted && 'speechSynthesis' in window) speechSynthesis.cancel();
  if (audioEnabled && !silenceTimer) masterGain.gain.setTargetAtTime(targetVolume(), audioCtx.currentTime, 0.1);
}

// ============ HÁPTICA ============
const hapticsSupported = 'vibrate' in navigator;
let heartbeatTimer = null;

function vibrate(pattern) {
  if (!hapticsSupported || reducedMotion) return;
  try { navigator.vibrate(pattern); } catch (e) {}
}

// setInterval fijaba la cadencia una sola vez, con la cordura aún en 100: el latido
// nunca aceleraba. Con setTimeout encadenado se recalcula en cada pulso.
function scheduleHeartbeat() {
  clearTimeout(heartbeatTimer);
  const sv = sanityState.visual;
  const period = sv < 20 ? 1500 : 2500;
  heartbeatTimer = setTimeout(() => {
    if (sanityState.visual < HEARTBEAT_THRESHOLD) {
      const intensity = sanityState.visual < 20 ? 80 : 50;
      const gap = sanityState.visual < 20 ? 120 : 200;
      vibrate([intensity, gap, Math.round(intensity * 0.6)]);
    }
    scheduleHeartbeat();
  }, period);
}

function stopHeartbeat() {
  clearTimeout(heartbeatTimer);
  heartbeatTimer = null;
  vibrate(0);
}

// ============ GIROSCOPIO ============
let gyroEnabled = false;
let gyroData = { alpha: 0, beta: 0, gamma: 0 };
let gyroShakeAccum = 0, gyroShakeCooldown = false;
let gyroLastApply = 0, gyroPending = false;
let currentTiltSecret = TILT_SECRETS[0];

async function requestGyroPermission() {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      if (await DeviceOrientationEvent.requestPermission() === 'granted') { enableGyro(); return true; }
    } catch (e) {}
    return false;
  }
  if ('DeviceOrientationEvent' in window) { enableGyro(); return true; }
  return false;
}

function enableGyro() {
  if (gyroEnabled) return;
  gyroEnabled = true;
  window.addEventListener('deviceorientation', handleOrientation, true);
}

function handleOrientation(e) {
  const prevBeta = gyroData.beta, prevGamma = gyroData.gamma, prevAlpha = gyroData.alpha;
  gyroData.alpha = e.alpha || 0;
  gyroData.beta = e.beta || 0;
  gyroData.gamma = e.gamma || 0;

  // Rotación de brújula acumulada, con el salto 359°->0° resuelto. Se mide aquí, a
  // 60Hz, y no en el tick del gesto: un giro rápido se perdería entre muestras.
  if (pendingGesture && pendingGesture.spec) {
    gyroTurnAccum += Math.abs(((gyroData.alpha - prevAlpha + 540) % 360) - 180);
  }

  const delta = Math.abs(gyroData.beta - prevBeta) + Math.abs(gyroData.gamma - prevGamma);
  gyroShakeAccum = gyroShakeAccum * 0.85 + delta * 0.15;
  if (gyroShakeAccum > SHAKE_THRESHOLD && !gyroShakeCooldown) triggerShakeBurst();

  // Throttle: sin esto se repinta la pantalla completa 60 veces por segundo.
  const now = performance.now();
  if (gyroPending || now - gyroLastApply < GYRO_MIN_INTERVAL) return;
  gyroPending = true;
  requestAnimationFrame(() => {
    gyroPending = false;
    gyroLastApply = performance.now();
    applyGyroEffects();
  });
}

function applyGyroEffects() {
  applyParallax();
  applyLivingVignette();
  applyGravityText();
  applyBreathing();
  updateCompassDot();
  checkTiltSecret();
}

function applyParallax() {
  const x = (gyroData.gamma / 90) * 45;
  const y = ((gyroData.beta - 60) / 90) * 35;
  el.noise.style.transform = `translate3d(${x * 2.5}px,${y * 2.5}px,0)`;
  el.vignette.style.transform = `translate3d(${x * 1.5}px,${y * 1.5}px,0)`;
  el.scanlines.style.transform = `translate3d(${x * 0.8}px,${y * 0.8}px,0)`;
}

// El vignette ahora es un gradiente estático parametrizado por custom properties:
// tocar una variable es mucho más barato que reconstruir el string del gradiente.
function applyLivingVignette() {
  const sv = sanityState.visual;
  const cx = Math.max(0, Math.min(100, 50 + (gyroData.gamma / 90) * 50));
  const cy = Math.max(0, Math.min(100, 50 + ((gyroData.beta - 60) / 90) * 50));
  const s = el.vignette.style;
  s.setProperty('--vx', cx.toFixed(1) + '%');
  s.setProperty('--vy', cy.toFixed(1) + '%');
  s.setProperty('--veye', (sv > 60 ? 55 : sv > 30 ? 40 : 25) + '%');
  s.setProperty('--vdark', sv > 60 ? 0.85 : sv > 30 ? 0.92 : 0.98);
}

let breathingActive = false;
function applyBreathing() {
  const slow = Math.abs(gyroData.gamma) + Math.abs(gyroData.beta - 60) < 20;
  const want = !reducedMotion && sanityState.visual < 60 && slow && gyroShakeAccum < 3;
  if (want === breathingActive) return;
  el.app.classList.toggle('gyro-breathing', want);
  breathingActive = want;
}

function applyGravityText() {
  if (sanityState.visual > 70 || reducedMotion) {
    el.storyText.style.transform = '';
    el.storyText.style.filter = '';
    return;
  }
  const skew = (gyroData.gamma / 90) * 16;
  const ty = ((gyroData.beta - 60) / 90) * 25;
  const blur = (Math.abs(gyroData.gamma) / 90) * 2.5 + (Math.abs(gyroData.beta - 60) / 90) * 2.5;
  el.storyText.style.transform = `skewX(${skew.toFixed(1)}deg) translateY(${ty.toFixed(1)}px)`;
  el.storyText.style.filter = `blur(${Math.max(0, blur).toFixed(2)}px)`;
}

function updateCompassDot() {
  const sp = sanityState.perceptive;
  if (sp >= 70) { el.compass.classList.remove('active'); return; }
  el.compass.classList.add('active');
  const angle = (gyroData.alpha / 360) * Math.PI * 2;
  const rx = window.innerWidth / 2 - 8, ry = window.innerHeight / 2 - 8;
  const x = window.innerWidth / 2 + rx * Math.sin(angle);
  const y = window.innerHeight / 2 - ry * Math.cos(angle);
  const o = 0.3 + (1 - sp / 70) * 0.7;
  el.compass.style.transform = `translate3d(${x}px,${y}px,0)`;
  el.compass.style.background = `rgba(139,0,0,${o.toFixed(2)})`;
  el.compass.style.boxShadow = `0 0 ${(8 + (1 - sp / 70) * 16).toFixed(0)}px rgba(139,0,0,${o.toFixed(2)})`;
}

function checkTiltSecret() {
  if (sanityState.perceptive >= 60) { el.tiltSecret.classList.remove('visible'); return; }
  if (gyroData.beta > 90) {
    el.tiltSecret.textContent = currentTiltSecret;
    el.tiltSecret.classList.add('visible');
  } else if (el.tiltSecret.classList.contains('visible')) {
    el.tiltSecret.classList.remove('visible');
    currentTiltSecret = TILT_SECRETS[Math.floor(Math.random() * TILT_SECRETS.length)];
  }
}

// Se corrompe el texto plano, nunca innerHTML: el regex de letras convertía <br> en <b†>.
function triggerShakeBurst() {
  gyroShakeCooldown = true;
  if (!isTyping && sanityState.text < 80 && el.storyBody.firstChild) {
    const node = el.storyBody.firstChild;
    const original = node.data;
    let mutations = 0;
    node.data = original.replace(/[a-záéíóúñ]/gi, ch =>
      (mutations < 4 && Math.random() < 0.08)
        ? (mutations++, GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)])
        : ch);
    setTimeout(() => { node.data = original; }, 600);
  }
  el.vignette.style.opacity = '0.95';
  setTimeout(() => { el.vignette.style.opacity = ''; }, 150);
  vibrate(30);
  setTimeout(() => { gyroShakeCooldown = false; }, 1200);
}

// ============ GESTOS NARRATIVOS ============
// El giroscopio dejaba de ser decorativo cuando la historia te pide algo con el cuerpo.
// Un nodo con `effects.gesture` no ofrece sus opciones hasta que el gesto ocurre.
//
// Regla dura: esto NUNCA puede bloquear el cuento. Sin giroscopio, sin permiso, con
// movimiento reducido o si simplemente no sale, hay salida. El gesto es una puesta en
// escena, no un peaje.
const GESTURES = {
  // Bajar el terminal: dejas de ver la pantalla, así que el feedback es háptico y hablado.
  face_down: {
    prompt: 'Baja el terminal.',
    hold: 1400,
    test: () => gyroData.beta > 100
  },
  // Quedarse quieto de verdad. El umbral es generoso: nadie tiene el pulso perfecto.
  still: {
    prompt: 'No te muevas.',
    hold: 3000,
    test: () => gyroShakeAccum < 1.8
  },
  shake: {
    prompt: 'Sacúdelo.',
    hold: 0,
    test: () => gyroShakeAccum > SHAKE_THRESHOLD
  },
  // Media vuelta real, medida con la brújula.
  turn_around: {
    prompt: 'Date la vuelta.',
    hold: 0,
    test: () => gyroTurnAccum > 140
  }
};

let gyroTurnAccum = 0;
let pendingGesture = null;

function startGesture(key, promptText, onDone) {
  const spec = GESTURES[key];
  el.options.style.display = 'none';
  el.gesture.style.display = 'flex';
  el.gesturePrompt.textContent = promptText || (spec ? spec.prompt : '');
  el.gestureFill.style.width = '0%';
  el.gestureSkip.style.display = 'none';

  // Sin sensor o con movimiento reducido el gesto es solo una frase: se pasa al toque.
  if (!spec || !gyroEnabled || reducedMotion) {
    el.gestureSkip.textContent = '[ continuar ]';
    el.gestureSkip.style.display = 'block';
    pendingGesture = { onDone };
    return;
  }

  gyroTurnAccum = 0;
  pendingGesture = { spec, onDone, heldSince: 0, started: performance.now(), timer: null };
  pendingGesture.timer = setInterval(evaluateGesture, GESTURE_TICK);
  el.gestureSkip.textContent = '[ no puedo hacerlo ]';
}

function evaluateGesture() {
  const g = pendingGesture;
  if (!g || !g.spec) return;
  const now = performance.now();

  if (g.spec.test()) {
    if (!g.heldSince) g.heldSince = now;
    const held = now - g.heldSince;
    el.gestureFill.style.width = Math.min(100, g.spec.hold ? (held / g.spec.hold) * 100 : 100) + '%';
    if (held >= g.spec.hold) { resolveGesture(true); return; }
  } else {
    g.heldSince = 0;
    el.gestureFill.style.width = '0%';
  }

  if (now - g.started > GESTURE_ESCAPE_MS) el.gestureSkip.style.display = 'block';
}

function resolveGesture(completed) {
  const g = pendingGesture;
  if (!g) return;
  clearInterval(g.timer);
  pendingGesture = null;
  el.gestureFill.style.width = '100%';
  // El terminal puede estar boca abajo: confirmar con vibración, no con pixels.
  if (completed) vibrate([40, 60, 120]);
  setTimeout(() => {
    el.gesture.style.display = 'none';
    el.options.style.display = 'flex';
    g.onDone(completed);
  }, completed ? 450 : 0);
}

// ============ TEXTO ============
function corruptText(text) {
  const s = sanityState.text;
  if (s >= 70) return text;
  const prob = s >= 40 ? 0.05 : 0.30;
  return text.split(' ').map(word => {
    if (s < 40 && Math.random() < 0.04 && word.length > 3) {
      return REPLACE_WORDS[Math.floor(Math.random() * REPLACE_WORDS.length)];
    }
    return word.split('').map(c =>
      (Math.random() < prob && /[a-záéíóúñ]/i.test(c))
        ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
        : c).join('');
  }).join(' ');
}

// El typewriter escribe sobre un Text node (white-space:pre-wrap en CSS), no sobre
// innerHTML: sin re-parseo por letra, sin markup que corromper. rAF en vez de setTimeout.
let isTyping = false;
let tw = null;

function delayFor(ch) {
  if (ch === '.' || ch === '…') return 350 + Math.random() * 200;
  if (ch === ',') return 180 + Math.random() * 100;
  if (ch === '\n') return 200;
  return 28 + Math.random() * 18;
}

function typeWriter(text, done) {
  tw = { text, i: 0, nextAt: 0, done };
  isTyping = true;
  el.storyBody.textContent = '';
  el.storyBody.appendChild(document.createTextNode(''));
  el.cursor.style.display = 'inline-block';
  el.skipHint.classList.add('visible');
  requestAnimationFrame(typeFrame);
}

function typeFrame(now) {
  if (!tw) return;
  if (now >= tw.nextAt && tw.i < tw.text.length) {
    const ch = tw.text[tw.i++];
    el.storyBody.firstChild.appendData(ch);
    if (ch !== ' ' && ch !== '\n') playTypewriterClick();
    tw.nextAt = now + delayFor(ch);
    el.storyArea.scrollTop = el.storyArea.scrollHeight;
  }
  if (tw.i >= tw.text.length) { finishTyping(); return; }
  requestAnimationFrame(typeFrame);
}

// Un toque completa el párrafo. 20 segundos sin poder tocar nada es donde se pierde al jugador.
function completeTyping() {
  if (!isTyping || !tw) return;
  el.storyBody.firstChild.data = tw.text;
  tw.i = tw.text.length;
  finishTyping();
}

function finishTyping() {
  if (!tw) return;
  const cb = tw.done;
  tw = null;
  isTyping = false;
  el.cursor.style.display = 'none';
  el.skipHint.classList.remove('visible');
  el.storyArea.scrollTop = el.storyArea.scrollHeight;
  if (cb) cb();
}

// ============ MOTOR ============
function loadNode(id) {
  if (id === '__restart__') { startGame(); return; }
  const node = storyNodes[id];
  if (!node) return;
  currentNode = node;

  if (!save.seen.includes(id)) { save.seen.push(id); persist(); }

  const isEnding = id.startsWith('final_');
  for (const k in sanityState) {
    const regen = isEnding ? 0 : SANITY_REGEN;
    const delta = (node.impact && node.impact[k]) || 0;
    sanityState[k] = Math.max(0, Math.min(SANITY_MAX, sanityState[k] + regen + delta));
  }
  if (isEnding && !save.endings.includes(id)) { save.endings.push(id); persist(); }

  const fx = node.effects || {};
  applyVisualEffects(fx);
  updateAudioScene();
  scheduleHeartbeat();
  if (fx.silence) dropToSilence(SILENCE_MS);
  if (fx.vibrate) vibrate(fx.vibrate);
  // Con gesto, el susurro espera al gesto: bajas el terminal y entonces te habla.
  if (fx.whisper && !fx.gesture) setTimeout(() => whisper(fx.whisper), 1200);

  if (pendingGesture) resolveGesture(false);
  el.options.innerHTML = '';
  el.gesture.style.display = 'none';
  el.options.style.display = 'flex';

  const source = (id === 'inicio' && save.visits > 1 && node.textReturning) ? node.textReturning : node.text;
  const reveal = () => {
    renderOptions(node.options);
    if (!hasCrashed && sanityState.interface <= 60 && Math.random() < 0.15) {
      setTimeout(() => triggerFakeCrash(false), 1500 + Math.random() * 3000);
    }
  };

  typeWriter(corruptText(parseMetaNarrative(source)), () => {
    if (!fx.gesture) { reveal(); return; }
    startGesture(fx.gesture, fx.gesturePrompt, done => {
      if (done && fx.whisper) whisper(fx.whisper);
      reveal();
    });
  });
  updateDebug();
}

function renderOptions(options) {
  el.options.innerHTML = '';
  options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.type = 'button';
    const span = document.createElement('span');
    span.textContent = corruptText(opt.text);
    btn.appendChild(span);

    // pointerdown, no pointerenter: en táctil no hay hover, así que el efecto
    // "los botones huyen" no se disparaba nunca en el dispositivo objetivo.
    let dodges = 0;
    btn.addEventListener('pointerdown', ev => {
      if (sanityState.interface >= 30 || reducedMotion || dodges >= 2) return;
      if (Math.random() >= 0.45) return;
      ev.preventDefault();
      dodges++;
      btn.style.transform = `translate(${(Math.random() - .5) * 30}px,${(Math.random() - .5) * 15}px)`;
      btn.classList.add('glitched');
      vibrate(15);
      if (Math.random() < 0.5) span.textContent = DODGE_TEXTS[Math.floor(Math.random() * DODGE_TEXTS.length)];
      setTimeout(() => {
        btn.classList.remove('glitched');
        btn.style.transform = '';
        span.textContent = corruptText(opt.text);
      }, 450);
    });

    btn.addEventListener('click', () => { if (!isTyping) loadNode(opt.next); });

    btn.style.opacity = '0';
    btn.style.transform = 'translateY(10px)';
    setTimeout(() => {
      btn.style.transition = 'opacity .4s, transform .4s';
      btn.style.opacity = '1';
      btn.style.transform = 'translateY(0)';
    }, 200 + idx * 150);
    el.options.appendChild(btn);
  });
}

// Temblor y parpadeo son ambos clases CSS y se componen en la misma propiedad
// `animation`. Antes el parpadeo se escribía inline y pisaba al temblor: el shake
// no ocurría nunca justo en el tramo donde importa.
function applyVisualEffects(effects) {
  const sv = sanityState.visual;
  el.app.classList.remove('shake-sm', 'shake-md', 'shake-lg', 'flicker-on');
  el.storyArea.classList.remove('force-blur');
  if (reducedMotion) return;
  if (sv < 30) el.app.classList.add('shake-lg');
  else if (sv < 55) el.app.classList.add('shake-md');
  else if (sv < 75) el.app.classList.add('shake-sm');
  if (sv < 60) {
    el.app.classList.add('flicker-on');
    el.app.style.setProperty('--flicker-dur', Math.max(0.5, sv / 40) + 's');
  }
  if (effects && effects.force_blur) el.storyArea.classList.add('force-blur');
}

let subliminalTimer = null;
function trySubliminal() {
  const sp = sanityState.perceptive;
  if (reducedMotion || sp >= 70) return;
  if (Math.random() > (sp < 30 ? 0.5 : 0.2)) return;
  el.subliminalText.textContent = SUBLIMINAL_MSGS[Math.floor(Math.random() * SUBLIMINAL_MSGS.length)];
  const duration = sp < 30 ? 250 : 120;
  el.subliminal.style.opacity = '0.5';
  setTimeout(() => { el.subliminal.style.opacity = '0'; }, duration);
}

let hasCrashed = false;
function triggerFakeCrash(force) {
  if (hasCrashed && !force) return;
  hasCrashed = true;
  el.crash.style.display = 'flex';
  vibrate([150, 50, 150, 50, 500]);
  setTimeout(() => { el.crash.style.display = 'none'; }, 1000 + Math.random() * 800);
}

// ============ ARRANQUE ============
async function requestSensorsAndStart() {
  save.name = (el.nameInput.value || '').trim().slice(0, 24);
  try {
    await requestGyroPermission();
    initAudio();
    if (audioCtx && audioCtx.state === 'suspended') await audioCtx.resume();
    startGame();
  } catch (e) {
    el.titleMsg.innerHTML = '<span style="color:#8b0000">ERROR: ' + e.message + '</span>';
  }
}

function startGame() {
  save.visits++;
  persist();
  el.title.style.display = 'none';
  el.app.style.display = 'flex';
  for (const k in sanityState) sanityState[k] = 100;
  hasCrashed = false;
  clearInterval(subliminalTimer);
  subliminalTimer = setInterval(trySubliminal, SUBLIMINAL_EVERY);
  scheduleHeartbeat();
  loadNode('inicio');
  save.last = Date.now();
  persist();
}

// El terminal se da cuenta de que te fuiste.
function handleVisibility() {
  if (document.hidden) {
    if (audioEnabled) masterGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.2);
    stopHeartbeat();
    return;
  }
  if (audioEnabled && !silenceTimer) masterGain.gain.setTargetAtTime(targetVolume(), audioCtx.currentTime, 0.6);
  if (currentNode) scheduleHeartbeat();
  if (currentNode && !isTyping && sanityState.perceptive < 70) {
    el.tiltSecret.textContent = '¿A DÓNDE FUISTE?';
    el.tiltSecret.classList.add('visible');
    setTimeout(() => el.tiltSecret.classList.remove('visible'), 1800);
  }
}

function init() {
  ['noise','vignette','scanlines','compass','app','storyArea','storyText','storyBody',
   'cursor','options','subliminal','subliminalText','tiltSecret','crash','title','titleMsg',
   'nameInput','muteBtn','skipHint','desktopBlock','returningNote',
   'gesture','gesturePrompt','gestureFill','gestureSkip'].forEach(k => {
    el[k] = document.getElementById(k.replace(/[A-Z]/g, m => '-' + m.toLowerCase()));
  });

  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  loadSave();
  storyNodes = typeof STORY_DATA !== 'undefined' ? STORY_DATA : {};

  const params = new URLSearchParams(window.location.search);
  debugMode = params.get('debug') === 'true';
  if (debugMode) {
    document.getElementById('debug-panel').style.display = 'block';
    populateDebugSelect();
    setInterval(updateDebug, 500);
  }

  const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || matchMedia('(pointer: coarse)').matches;
  if (!isMobile && !debugMode) {
    el.desktopBlock.style.display = 'flex';
    el.title.style.display = 'none';
    return;
  }

  if (save.visits > 0) {
    el.returningNote.textContent =
      `Sesión anterior: ${humanSince(save.last)}. Visitas registradas: ${save.visits}.`;
    el.returningNote.style.display = 'block';
    if (save.name) el.nameInput.value = save.name;
  }

  el.muteBtn.addEventListener('click', toggleMute);
  el.gestureSkip.addEventListener('click', () => resolveGesture(false));
  document.getElementById('start-btn').addEventListener('click', requestSensorsAndStart);
  el.app.addEventListener('pointerdown', ev => {
    if (!ev.target.closest('.option-btn')) completeTyping();
  });
  document.addEventListener('visibilitychange', handleVisibility);
}

// ============ DEBUG ============
function modSanity(type, amount) {
  sanityState[type] = Math.max(0, Math.min(SANITY_MAX, sanityState[type] + amount));
  applyVisualEffects(currentNode ? currentNode.effects : null);
  updateAudioScene();
  scheduleHeartbeat();
  updateDebug();
}

function populateDebugSelect() {
  const sel = document.getElementById('debug-node-select');
  sel.innerHTML = '<option value="">Select...</option>' +
    Object.keys(storyNodes).map(k => `<option value="${k}">${k}</option>`).join('');
}

function updateDebug() {
  if (!debugMode) return;
  document.getElementById('dt-val').textContent = sanityState.text;
  document.getElementById('dv-val').textContent = sanityState.visual;
  document.getElementById('dp-val').textContent = sanityState.perceptive;
  document.getElementById('di-val').textContent = sanityState.interface;
  document.getElementById('debug-info').innerHTML =
    `Haptics: ${hapticsSupported ? 'ON' : 'N/A'} | Heart: ${sanityState.visual < HEARTBEAT_THRESHOLD ? 'ACTIVE' : 'IDLE'}<br>` +
    `Gyro: ${gyroData.beta.toFixed(0)}° ${gyroData.gamma.toFixed(0)}° | Audio: ${audioEnabled ? (silenceTimer ? 'SILENCED' : 'ON') : 'OFF'}<br>` +
    `Visits: ${save.visits} | Seen: ${save.seen.length}/${Object.keys(storyNodes).length} | Endings: ${save.endings.length}<br>` +
    `Node: ${currentNode ? currentNode.id : 'none'} | Motion: ${reducedMotion ? 'REDUCED' : 'FULL'}`;
}

document.addEventListener('DOMContentLoaded', init);
