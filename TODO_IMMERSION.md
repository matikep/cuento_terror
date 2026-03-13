# 👁️ Hoja de Ruta: Inmersión Total "El Susurro del Vacío"

Este documento detalla las tareas necesarias para transformar el motor actual en una experiencia de "software maldito" altamente inmersiva utilizando APIs web avanzadas.

---

## 🔊 1. Paisaje Sonoro (Web Audio API)
*El terror entra por los oídos. Implementación de audio sin archivos externos.*

- [ ] **Drone Atmosférico de Fondo:**
    - Crear un oscilador de baja frecuencia (Low Frequency Oscillator).
    - Implementar un filtro de paso bajo (Low Pass Filter) para crear un sonido "ahogado".
    - **Dinámica:** Vincular la frecuencia del drone a `sanityState.visual`. A menor cordura, más agudo/errático el tono.
- [ ] **Feedback de Mecanografía:**
    - Generar un pulso de ruido blanco (White Noise) extremadamente corto por cada letra.
    - Aplicar variaciones de volumen (gain) sutiles por letra para simular el ruido mecánico de una máquina de escribir.
- [ ] **Gestión de Sesión de Audio:**
    - Desbloquear el `AudioContext` tras el click en "[ INICIAR SESIÓN ]".
    - Implementar un desvanecimiento suave (fade-out) al cambiar entre nodos narrativos.

## 📳 2. Respuesta Táctica (Vibration API)
*Hacer que el horror se sienta físicamente en las manos del jugador.*

- [ ] **Latido de Cordura Baja:**
    - Si `sanityState.visual < 40`, disparar un patrón de vibración rítmico: `[200, 1000, 200, 1000]`.
- [ ] **Feedback de Interface Glitch:**
    - Al disparar la clase CSS `.glitched`, añadir una vibración corta de 10ms.
- [ ] **Shock Narrativo:**
    - Añadir soporte en el JSON (`"effects": { "vibrate": [500] }`) para vibraciones intensas en momentos clave de la historia.

## 🖥️ 3. Meta-Narrativa (Real-World Injection)
*Borrar la línea entre el juego y el dispositivo del usuario.*

- [ ] **Módulo de Telemetría:**
    - Implementar `navigator.getBattery()` para obtener el porcentaje de batería.
    - Implementar detección de `navigator.userAgent` para identificar el modelo del terminal (ej: "iPhone 13", "Pixel 7").
- [ ] **Sistema de Inyección de Variables:**
    - Modificar el motor de texto para reemplazar tags en [story.json](file:///Users/matiaslobos/proyectos/labs/cuento/story.json):
        - `{{battery}}` -> "42%"
        - `{{time}}` -> "18:45"
        - `{{device}}` -> "Terminal ARM64"
- [ ] **Eventos Temporales:**
    - Detectar si el jugador juega entre las 00:00 y las 04:00 para activar nodos de texto ocultos o visuales más agresivos.

## 🧭 4. Espacialidad y Movimiento (Device Orientation API)
*El terminal reacciona a cómo lo sostienes.*

- [ ] **Paralaje del Vacío:**
    - Vincular los valores de `alpha`, `beta` y `gamma` (giroscopio) al movimiento del overlay de ruido y viñeteado.
    - El área de juego debe "flotar" levemente según la inclinación del teléfono.
- [ ] **Secretos por Inclinación:**
    - Mostrar mensajes subliminales de opacidad baja solo cuando el teléfono se inclina más de 30 grados hacia adelante.
- [ ] **Permisos de iOS:**
    - Añadir el diálogo de solicitud de "Orientation and Motion" dentro del flujo de carga inicial.

## 🛠️ Prioridad de Implementación Recomendada
1. **Audio & Typewriter Clicks** (Impacto inmediato en la atmósfera).
2. **Meta-Narrativa** (Sorpresa total al leer datos del propio teléfono).
3. **Vibraciones** (Inmersión física en Android).
4. **Giroscopio** (Pulido visual final).
