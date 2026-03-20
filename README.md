# El Susurro del Vacío — `cuento_terror`

Un **cuento interactivo de terror psicológico** (formato *single page*) pensado **principalmente para móviles**.

La experiencia se ejecuta en el navegador y utiliza APIs del dispositivo para crear una sensación de “terminal / software maldito”:
- **Web Audio API**: drone atmosférico + clicks de “máquina de escribir”.
- **Vibration API**: latidos / shocks en momentos clave.
- **Device Orientation API**: parallax, “living vignette”, secretos por inclinación y detección de sacudidas.

> Nota: En escritorio se bloquea por defecto (a menos que actives el modo debug).

---

## Estructura del repo

- `index.html` — App principal (UI + motor + estilos + efectos).
- `story.json` — Historia en formato JSON (nodos, texto, opciones, impactos y efectos).
- `story.js` — Versión alternativa de la historia en JS (const `STORY_DATA`). *(Actualmente el motor usa `story.json`.)*
- `TODO_IMMERSION.md` — Hoja de ruta de mejoras de inmersión (audio/háptica/meta-narrativa/giroscopio).

---

## Cómo ejecutar

### Opción 1: abrir local (rápido)
Puedes abrir `index.html` directamente con el navegador, pero **algunos navegadores pueden bloquear `fetch()`** si lo abres con `file://`.

### Opción 2 (recomendada): servidor local
Levanta un server estático para que `story.json` cargue sin problemas.

Ejemplos:

**Python**
```bash
python -m http.server 8000
```

**Node**
```bash
npx serve .
```

Luego abre:
- `http://localhost:8000/`

---

## Controles / modos

### Modo normal (móvil)
- En móviles debería dejarte iniciar la sesión con **`[ INICIAR SESIÓN ]`**.
- Al iniciar, el juego:
  - pide permisos del giroscopio (en iOS),
  - habilita audio (desbloqueo de `AudioContext` por interacción),
  - carga `story.json`,
  - comienza en el nodo `inicio`.

### Bloqueo en escritorio
Si detecta que **no es móvil**, muestra una pantalla de **“ACCESO DENEGADO”**.

### Modo debug (forzar en escritorio)
Abre con el parámetro:

- `?debug=true`

Ejemplo:
- `http://localhost:8000/?debug=true`

En debug aparece un panel para:
- modificar “sanity” (text/visual/perceptive/interface),
- saltar entre nodos,
- forzar un “fake crash”.

---

## Formato de `story.json`

Cada nodo tiene esta forma:

- `id`: string
- `text`: string (soporta saltos de línea y variables)
- `options`: array de `{ text, next }`
- `impact`: cambios a estados de cordura
  - `text`, `visual`, `perceptive`, `interface` (valores positivos/negativos)
- `effects`: efectos opcionales, por ejemplo:
  - `force_blur: boolean`
  - `glitch_intensity: "none" | "low" | "medium" | "high" | "critical"`
  - `vibrate: number[]` (patrón de vibración)

### Variables meta-narrativas en texto
El motor reemplaza:
- `{{time}}` → hora local (HH:MM)
- `{{device}}` → tipo de dispositivo (iPhone/iPad/Android/Mac/PC…)
- `{{battery}}` → porcentaje de batería si está disponible (con fallback)

---

## Hoja de ruta (inmersión)
La lista de tareas está en `TODO_IMMERSION.md` e incluye:
- paisaje sonoro avanzado,
- vibración contextual por glitches/narrativa,
- inyección de datos del mundo real (batería/hora/dispositivo),
- efectos por orientación/inclinación y “secretos”.

---

## Disclaimer
Este proyecto usa APIs del dispositivo (audio, vibración y orientación). Dependiendo del navegador/OS, algunas funciones pueden requerir permisos explícitos o no estar disponibles.

---

## Autor
**matikep**
