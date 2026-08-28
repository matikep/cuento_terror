# 👁️ Hoja de Ruta: Inmersión Total "El Susurro del Vacío"

Estado de la hoja de ruta original, más lo que se añadió al implementarla.

---

## 🔊 1. Paisaje Sonoro (Web Audio API)

- [x] **Drone atmosférico** — oscilador triangular + filtro paso bajo, vinculado a `sanityState.visual`.
- [x] **Armónico audible** — sine a `f×2` al 18%. Solo el sub a 45Hz era inaudible en un altavoz de móvil.
- [x] **Reverb por convolución** — impulso generado (ruido con decaimiento exponencial). Los clicks suenan *dentro de una habitación*.
- [x] **Feedback de mecanografía** — ruido blanco filtrado con bandpass aleatorio por letra.
- [x] **Gestión de sesión** — desbloqueo tras `[ INICIAR SESIÓN ]`, mute manual, silencio al cambiar de app.
- [x] **Silencio como recurso** — `effects.silence` corta el sonido en seco al entrar a un nodo. Asusta más que subir el volumen.

## 📳 2. Respuesta Táctica (Vibration API)

- [x] **Latido de cordura baja** — bajo `visual < 40`, con `setTimeout` encadenado para que la cadencia se recalcule y **acelere de verdad** por debajo de 20.
- [x] **Feedback de glitch** — vibración corta al desplazarse un botón.
- [x] **Shock narrativo** — `effects.vibrate` en el JSON.
- [x] Toda la háptica respeta `prefers-reduced-motion`.

## 🖥️ 3. Meta-Narrativa (Real-World Injection)

- [x] **Telemetría** — `getBattery()` y detección de terminal por `userAgent`.
- [x] **Inyección de variables** — `{{time}}`, `{{device}}`, `{{battery}}`, y además `{{name}}`, `{{visits}}`, `{{since}}`, `{{lastseen}}`.
- [x] **Persistencia** — `localStorage` guarda visitas, nombre, nodos vistos y finales alcanzados. `textReturning` cambia el nodo `inicio` para quien vuelve: *"Ya has estado aquí N veces"*.
- [x] **Nombre robado** — el jugador introduce un identificador, la historia lo usa y luego lo pierde en `cuaderno_regreso`.
- [x] **Susurro real** — `speechSynthesis` a `rate 0.6 / pitch 0.1` en exactamente tres momentos.
- [x] **Detección de ausencia** — `visibilitychange`: si te vas y vuelves, el terminal lo nota.
- [ ] **Eventos temporales** — nodos ocultos entre 00:00 y 04:00. *(pendiente: requiere escribir ficción nueva)*

## 🧭 4. Espacialidad y Movimiento (Device Orientation API)

- [x] **Paralaje del vacío** — capas de ruido, viñeta y scanlines con `translate3d`.
- [x] **Living vignette** — el gradiente se parametriza con custom properties en vez de reconstruir el string 60 veces por segundo.
- [x] **Secretos por inclinación** — mensajes ocultos con el teléfono inclinado hacia delante.
- [x] **Detección de sacudida** — corrompe el texto y hace parpadear la viñeta.
- [x] **Permisos de iOS** — dentro del flujo de carga inicial.
- [x] **Throttle a 20Hz** — `deviceorientation` dispara a 60Hz y fundía el móvil.
- [x] **Gestos narrativos** — el giroscopio ya no es decorativo: cuatro nodos exigen un gesto físico antes de ofrecer sus opciones.
    - `ojos_cerrados_01` → bajar el terminal. El único momento en que te habla mientras no puedes verlo.
    - `inmovil_01` → no moverte. El progreso se reinicia si te mueves.
    - `grito_01` → sacudirlo.
    - `voz_01` → darte la vuelta, medido con la brújula. La revelación llega cuando le das la espalda.
    - Salida garantizada siempre: `[ continuar ]` sin sensor o con movimiento reducido, `[ no puedo hacerlo ]` a los 12 s.

## ⏱️ 5. Ritmo (añadido: era lo que más faltaba)

- [x] **Regeneración de cordura** — `+4` por nodo. Sin recuperación no hay curva, solo caída libre: en 6 nodos todo estaba a cero y el resto de la partida era ruido constante.
- [x] **Nodo `respirar`** — valle real alcanzable desde los cuatro puntos de máxima presión.
- [x] **Tap para completar** — un toque termina el párrafo. Los nodos tardaban entre 14 y 29 segundos en escribirse sin poder tocar nada.

## 🧯 6. Accesibilidad (no negociable)

- [x] Aviso de fotosensibilidad antes de entrar.
- [x] `prefers-reduced-motion` degrada los efectos, nunca el cuento.
- [x] Botón de silencio permanente.
- [x] Objetivos táctiles de 44px, `:focus-visible`, `aria-label` en controles.

---

## 🐛 Bugs corregidos por el camino

| Qué pasaba | Por qué |
|---|---|
| La meta-narrativa nunca se disparaba | `story.json` (el archivo que cargaba el motor) no tenía ni una sola variable `{{}}`; estaban solo en `story.js`, que nadie incluía |
| El temblor no ocurría nunca | El parpadeo se escribía como `style.animation` inline y pisaba las clases `.shake-*` |
| El latido no aceleraba | El `setInterval` fijaba la cadencia una vez, con la cordura aún en 100 |
| Los botones no huían | `pointerenter` no se dispara en táctil |
| Los subliminales casi no se veían | La capa estaba a `z-index: 1`, detrás de la app |
| El texto corrompía su propio markup | Un regex de letras sobre `innerHTML` convertía `<br>` en `<b†>` |
| Tirones al escribir | `innerHTML += ch` re-parseaba el documento en cada letra |
| Reiniciar duplicaba los subliminales | `setInterval` sin limpiar el anterior |
| El fake crash solo pasaba una vez por carga | `hasCrashed` no se reseteaba al reiniciar |
| Fallo de carga en Safari desde subcarpetas | Se eliminó el `fetch()`; la historia es un `<script src>` y funciona en `file://` |

---

## 🔭 Lo que queda

- Nodos temporales según la hora real (00:00–04:00).
- Recuperar la **inercia** del texto: el original tenía `transition: 0.4s` a 60Hz y flotaba con peso; al optimizar quedó en `0.15s` y sigue al teléfono de forma más rígida. Se puede simular con interpolación amortiguada sin volver a fundir el móvil.
- `devicemotion` (aceleración real, caída libre) sigue sin usarse: solo se lee `deviceorientation`.
- Ramas que reaccionen a `save.endings`: el segundo final debería saber cuál viste primero.
- Un final extra alcanzable solo tras N visitas registradas.
