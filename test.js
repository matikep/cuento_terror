// Self-check: node test.js
// Falla si el grafo de la historia, las variables meta, los ids del DOM
// o la curva de cordura se rompen.
const assert = require('assert');
const fs = require('fs');

const story = fs.readFileSync('story.js', 'utf8');
const engine = fs.readFileSync('engine.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const NODES = JSON.parse(story.slice(story.indexOf('{'), story.lastIndexOf('}') + 1));

// --- 1. Grafo cerrado y sin nodos muertos ---
const targets = new Set();
for (const n of Object.values(NODES)) for (const o of n.options) targets.add(o.next);
const broken = [...targets].filter(t => t !== '__restart__' && !(t in NODES));
assert.deepStrictEqual(broken, [], `destinos inexistentes: ${broken}`);
const orphans = Object.keys(NODES).filter(k => k !== 'inicio' && !targets.has(k));
assert.deepStrictEqual(orphans, [], `nodos inalcanzables: ${orphans}`);

// --- 2. Toda {{variable}} usada la resuelve el motor ---
const supported = new Set(
  engine.slice(engine.indexOf('const vars = {'), engine.indexOf('return text.replace'))
    .match(/^\s{4}(\w+):/gm).map(s => s.trim().replace(':', '')));
const used = new Set([...story.matchAll(/\{\{(\w+)\}\}/g)].map(m => m[1]));
const unknown = [...used].filter(v => !supported.has(v));
assert.deepStrictEqual(unknown, [], `variables sin soporte en el motor: ${unknown}`);
assert.ok(used.size >= 5, `la meta-narrativa está apagada: solo ${used.size} variables en uso`);

// --- 3. Cada id que el motor cachea existe en el HTML ---
const ids = engine.slice(engine.indexOf("['noise'"), engine.indexOf('].forEach'))
  .match(/'([a-zA-Z]+)'/g).map(s => s.replace(/'/g, '').replace(/[A-Z]/g, m => '-' + m.toLowerCase()));
const missing = ids.filter(id => !html.includes(`id="${id}"`));
assert.deepStrictEqual(missing, [], `ids ausentes en index.html: ${missing}`);

// --- 4. Curva de cordura: debe existir un valle, no solo caída libre ---
const REGEN = +engine.match(/SANITY_REGEN = (\d+)/)[1];
const walk = path => {
  const s = { text: 100, visual: 100, perceptive: 100, interface: 100 };
  const trace = [];
  for (const id of path) {
    const ending = id.startsWith('final_');
    for (const k in s) s[k] = Math.max(0, Math.min(100, s[k] + (ending ? 0 : REGEN) + (NODES[id].impact[k] || 0)));
    trace.push({ id, ...s });
  }
  return trace;
};
const descent = walk(['inicio', 'mesa_01', 'cuaderno_02', 'puerta_01', 'figura_01', 'hablar_reflejo']);
assert.ok(descent.at(-1).visual < 40, 'la ruta agresiva debe hundir la cordura');

const withBreather = walk(['inicio', 'mesa_01', 'paredes_01', 'oscuridad_01', 'respirar', 'respirar']);
const low = Math.min(...withBreather.map(t => t.visual));
assert.ok(withBreather.at(-1).visual > low + 15,
  `respirar debe recuperar cordura de forma perceptible (mín ${low} -> ${withBreather.at(-1).visual})`);

// --- 5. Los ganchos de audio/susurro apuntan a algo ---
const withSilence = Object.values(NODES).filter(n => n.effects && n.effects.silence);
const withWhisper = Object.values(NODES).filter(n => n.effects && n.effects.whisper);
assert.ok(withSilence.length >= 3, 'el silencio se usa como recurso en al menos 3 nodos');
assert.ok(withWhisper.length >= 2 && withWhisper.length <= 4,
  `los susurros deben ser escasos para no perder efecto (hay ${withWhisper.length})`);

// --- 6. Gestos: todo gesto usado existe, y ninguno puede dejar el cuento muerto ---
const known = new Set(Object.keys(JSON.parse('{' +
  engine.slice(engine.indexOf('const GESTURES = {') + 18, engine.indexOf('};\n\nlet gyroTurnAccum'))
    .match(/^ {2}(\w+):/gm).map(s => `"${s.trim().replace(':', '')}":0`).join(',') + '}')));
const gestureNodes = Object.entries(NODES).filter(([, n]) => n.effects && n.effects.gesture);
for (const [id, n] of gestureNodes) {
  assert.ok(known.has(n.effects.gesture), `${id}: gesto desconocido "${n.effects.gesture}"`);
  assert.ok(n.effects.gesturePrompt, `${id}: gesto sin instrucción para el jugador`);
  assert.ok(n.options.length > 0, `${id}: un nodo con gesto y sin salidas atrapa al jugador`);
}
assert.ok(gestureNodes.length >= 3 && gestureNodes.length <= 6,
  `los gestos deben ser un acontecimiento, no un peaje (hay ${gestureNodes.length})`);

// Regla dura: siempre hay salida. startGesture ofrece el escape inmediato sin sensor
// o con movimiento reducido, y evaluateGesture lo revela al pasar GESTURE_ESCAPE_MS.
const sg = engine.slice(engine.indexOf('function startGesture'), engine.indexOf('function evaluateGesture'));
assert.ok(/!spec \|\| !gyroEnabled \|\| reducedMotion/.test(sg),
  'startGesture debe ofrecer salida inmediata sin giroscopio o con movimiento reducido');
assert.ok(/GESTURE_ESCAPE_MS\) el\.gestureSkip\.style\.display = 'block'/.test(engine),
  'evaluateGesture debe revelar el escape pasado el tiempo límite');
assert.ok(engine.includes("el.gestureSkip.addEventListener('click', () => resolveGesture(false))"),
  'el botón de escape debe estar conectado');

console.log(`OK — ${Object.keys(NODES).length} nodos, ${used.size} variables meta, ${ids.length} ids,`,
  `silencio en ${withSilence.length}, susurros en ${withWhisper.length},`,
  `gestos: ${gestureNodes.map(([id, n]) => `${id}=${n.effects.gesture}`).join(' ')}`);
