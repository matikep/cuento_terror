# El Susurro del Vacío — `cuento_terror`

Un **cuento interactivo de terror psicológico** (formato *single page*) pensado **principalmente para móviles**.

La experiencia se ejecuta en el navegador y usa APIs del dispositivo para crear la sensación de "terminal / software maldito":

- **Web Audio API** — drone sub-grave con armónico audible, reverb por convolución y clicks de máquina de escribir.
- **Vibration API** — latido de cordura baja (que acelera de verdad), glitches y shocks narrativos.
- **Device Orientation API** — parallax, *living vignette*, texto que gotea, secretos por inclinación y detección de sacudidas.
- **localStorage** — el cuento recuerda cuántas veces has vuelto, cuándo y con qué nombre.
- **speechSynthesis** — tres susurros en toda la historia. No más: dejarían de dar miedo.
- **Gestos narrativos** — cuatro nodos no avanzan hasta que haces algo con el cuerpo.

---

## Estructura del repo

- `index.html` — Markup y estilos.
- `engine.js` — Motor: cordura, audio, háptica, giroscopio, typewriter, persistencia.
- `story.js` — **Fuente única** de la historia (`const STORY_DATA`).
- `test.js` — Self-check: grafo, variables meta, ids del DOM y curva de cordura.
- `TODO_IMMERSION.md` — Estado de la hoja de ruta de inmersión.

---

## Cómo ejecutar

Abre `index.html` con el navegador. Ya no hace falta servidor: la historia se carga con
`<script src="story.js">` en vez de `fetch()`, así que **funciona con `file://`**.

Si prefieres servidor local:

```bash
python3 -m http.server 8000
```

Verificar que nada está roto:

```bash
node test.js
```

---

## Controles y modos

### Móvil (modo normal)

`[ INICIAR SESIÓN ]` pide permiso de giroscopio (iOS), desbloquea el `AudioContext`
y empieza en el nodo `inicio`. El campo *identificador de sesión* es opcional: si lo
rellenas, la historia usará ese nombre y luego te lo quitará.

Durante la partida:
- **Un toque en el texto** completa el párrafo que se está escribiendo.
- **🔊 en la cabecera** silencia audio y susurros.

### Escritorio

Muestra "ACCESO DENEGADO" salvo en modo debug.

### Modo debug

`?debug=true` — panel con control de cordura, salto entre nodos, crash forzado y
telemetría en vivo (háptica, giroscopio, estado de audio, visitas, nodos vistos).

---

## Formato de `story.js`

Cada nodo:

- `id` — string
- `text` — string con saltos de línea y variables
- `textReturning` — *(opcional)* texto alternativo para quien ya ha jugado antes
- `options` — array de `{ text, next }`
- `impact` — cambios de cordura: `text`, `visual`, `perceptive`, `interface`
  (positivos y negativos; la cordura también se regenera `+4` por nodo)
- `effects` — opcionales:
  - `force_blur: boolean`
  - `glitch_intensity: "none" | "low" | "medium" | "high" | "critical"`
  - `vibrate: number[]` — patrón de vibración
  - `silence: true` — corta el sonido en seco al entrar al nodo
  - `whisper: "texto"` — el teléfono lo dice en voz alta
  - `gesture` + `gesturePrompt` — ver **Gestos narrativos**

### Variables meta-narrativas

| Tag | Se sustituye por |
|-----|------------------|
| `{{time}}` | hora local `HH:MM` |
| `{{device}}` | tipo de terminal (iPhone/iPad/Android/Mac/PC) |
| `{{battery}}` | porcentaje de batería (fallback `13%`) |
| `{{name}}` | identificador de sesión introducido por el jugador |
| `{{visits}}` | número de partidas registradas |
| `{{since}}` | cuánto hace de la sesión anterior |
| `{{lastseen}}` | fecha y hora de la sesión anterior |

`node test.js` falla si usas una variable que el motor no resuelve.

---

## Gestos narrativos

Un nodo con `effects.gesture` no muestra sus opciones hasta que el jugador ejecuta el
gesto con el teléfono. El giroscopio deja de ser decoración cuando la historia te pide
algo con el cuerpo.

| Gesto | Qué hay que hacer | Se cumple con | Dónde |
|-------|-------------------|---------------|-------|
| `face_down` | bajar el terminal y dejar de mirarlo | `beta > 100` sostenido 1,4 s | `ojos_cerrados_01` |
| `still` | quedarse completamente quieto | movimiento bajo durante 3 s | `inmovil_01` |
| `shake` | sacudirlo | pico de aceleración angular | `grito_01` |
| `turn_around` | darse media vuelta | 140° acumulados de brújula | `voz_01` |

```json
"effects": { "gesture": "face_down", "gesturePrompt": "Baja el terminal.\nDeja de mirarlo." }
```

Si el nodo tiene además `whisper`, el susurro **espera al gesto**: bajas el terminal, y
entonces te habla. La confirmación es háptica, no visual — con el teléfono boca abajo no
hay pantalla que mirar.

### El gesto nunca bloquea el cuento

Esto es una puesta en escena, no un peaje:

- Sin giroscopio, sin permiso o con `prefers-reduced-motion`, sale **`[ continuar ]`** de inmediato.
- Con sensor pero sin que salga el gesto, a los 12 s aparece **`[ no puedo hacerlo ]`**.
- Cambiar de nodo cancela cualquier gesto pendiente.

`node test.js` falla si un gesto no existe, no tiene instrucción, o si un nodo con gesto
se queda sin salidas.

---

## Accesibilidad

- Aviso de fotosensibilidad antes de entrar.
- `prefers-reduced-motion` desactiva parpadeo, temblor, subliminales, vibración y
  el texto que gotea. El cuento sigue completo.
- Botón de silencio siempre accesible.
- Los gestos son opcionales: siempre hay una salida por toque.
- Objetivos táctiles de 44px y `:focus-visible` en todos los controles.

---

## Disclaimer

Este proyecto usa APIs del dispositivo (audio, vibración, orientación, batería, síntesis
de voz). Según el navegador y el sistema, algunas pueden requerir permiso explícito o no
estar disponibles; el motor degrada sin romperse.

---

## Autor

**matikep**
