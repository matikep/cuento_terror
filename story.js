const STORY_DATA = 
{
  "inicio": {
    "id": "inicio",
    "text": "Despiertas en una habitación que no reconoces. El aire huele a humedad y papel viejo. Una vela solitaria titila sobre una mesa de madera carcomida. No recuerdas cómo llegaste aquí.\n\nHay una puerta al fondo. Está entreabierta.\n\nLa llama de la vela se inclina hacia ti, como si respirara.",
    "effects": { "force_blur": false, "glitch_intensity": "none" },
    "impact": { "text": 0, "visual": 0, "perceptive": 0, "interface": 0 },
    "options": [
      { "text": "Examinar la mesa", "next": "mesa_01" },
      { "text": "Ir hacia la puerta", "next": "puerta_01" },
      { "text": "Intentar recordar...", "next": "recuerdo_01" }
    ]
  },
  "mesa_01": {
    "id": "mesa_01",
    "text": "Sobre la mesa encuentras un cuaderno abierto. La caligrafía es errática, casi violenta. Las palabras están escritas en lo que parece ser tinta... o algo más oscuro.\n\n\"Día 1: No sé donde estoy. La puerta no lleva a ningún lado.\"\n\"Día 3: He dejado de contar los días. El tiempo aquí no funciona.\"\n\"Día ?: Si lees esto, ya es tarde. No mires las paredes.\"\n\nInstintivamente, miras las paredes.",
    "effects": { "force_blur": false, "glitch_intensity": "low" },
    "impact": { "text": -5, "visual": -8, "perceptive": -10, "interface": 0 },
    "options": [
      { "text": "Leer más del cuaderno", "next": "cuaderno_02" },
      { "text": "Dejar el cuaderno e ir a la puerta", "next": "puerta_01" },
      { "text": "Mirar las paredes detenidamente", "next": "paredes_01" }
    ]
  },
  "puerta_01": {
    "id": "puerta_01",
    "text": "La puerta se abre con un quejido metálico. Al otro lado hay un pasillo largo y estrecho. Las paredes están cubiertas de un empapelado floral que alguna vez fue elegante, ahora descompuesto y negro en los bordes.\n\nAl fondo del pasillo, una figura está de pie. Inmóvil.\n\nNo tiene rostro.\n\nO quizás sí lo tiene, pero tu mente se niega a procesarlo.",
    "effects": { "force_blur": false, "glitch_intensity": "medium" },
    "impact": { "text": -8, "visual": -15, "perceptive": -12, "interface": -5 },
    "options": [
      { "text": "Caminar hacia la figura", "next": "figura_01" },
      { "text": "Retroceder a la habitación", "next": "regreso_01" },
      { "text": "Cerrar los ojos y avanzar", "next": "ojos_cerrados_01" }
    ]
  },
  "recuerdo_01": {
    "id": "recuerdo_01",
    "text": "Intentas recordar. Fragmentos incompletos inundan tu mente:\n\nUn coche en una carretera vacía. Lluvia. Un sonido como de estática. Y después...\n\nNada.\n\nSolo el vacío. Un vacío que susurra.\n\nSientes que el suelo vibra bajo tus pies. La vela parpadea más rápido ahora.",
    "effects": { "force_blur": false, "glitch_intensity": "low" },
    "impact": { "text": -3, "visual": -5, "perceptive": -15, "interface": 0 },
    "options": [
      { "text": "Seguir intentando recordar", "next": "recuerdo_02" },
      { "text": "Ignorar los recuerdos y explorar", "next": "mesa_01" }
    ]
  },
  "cuaderno_02": {
    "id": "cuaderno_02",
    "text": "Las siguientes páginas están en blanco. Todas excepto la última.\n\nEn ella hay un dibujo. Es tosco, infantil casi. Muestra una figura de palitos dentro de una casa. Fuera de la casa, hay cientos de ojos.\n\nDebajo, una sola línea:\n\n\"No son paredes. Son párpados.\"\n\nSientes cómo la habitación se contrae imperceptiblemente. El aire se vuelve más denso.",
    "effects": { "force_blur": false, "glitch_intensity": "medium" },
    "impact": { "text": -10, "visual": -12, "perceptive": -18, "interface": -5 },
    "options": [
      { "text": "Arrancar la página", "next": "arrancar_pagina" },
      { "text": "Cerrar el cuaderno y dirigirse a la puerta", "next": "puerta_01" }
    ]
  },
  "paredes_01": {
    "id": "paredes_01",
    "text": "Las paredes... se mueven. No como algo vivo, sino como una grabación reproduciéndose en falso. Pequeñas ondulaciones recorren la superficie como latidos bajo la piel.\n\nEntonces lo ves: marcas de uñas. Cientos de ellas. Todas a la misma altura. Todas descendiendo.\n\nAlguien estuvo aquí antes. Alguien que intentó escapar cavando hacia abajo.\n\nLa vela se apaga.",
    "effects": { "force_blur": false, "glitch_intensity": "high", "vibrate": [100, 50, 200] },
    "impact": { "text": -15, "visual": -20, "perceptive": -10, "interface": -10 },
    "options": [
      { "text": "Buscar la vela a tientas", "next": "oscuridad_01" },
      { "text": "Quedarse completamente inmóvil", "next": "inmovil_01" }
    ]
  },
  "recuerdo_02": {
    "id": "recuerdo_02",
    "text": "El recuerdo se rompe como vidrio. Detrás hay otro recuerdo. Y otro. Capas infinitas.\n\nEn la más profunda ves algo que no debería estar ahí: esta misma habitación. Tú mismo sentado en esta misma silla. Pero la versión de ti en el recuerdo está mirando directamente hacia donde tú estás ahora.\n\nY sonríe.\n\n\"Ya casi recuerdas\", dice una voz que sale de ningún lugar.",
    "effects": { "force_blur": false, "glitch_intensity": "high" },
    "impact": { "text": -20, "visual": -15, "perceptive": -25, "interface": -8 },
    "options": [
      { "text": "\"¿Quién eres?\"", "next": "voz_01" },
      { "text": "Gritar", "next": "grito_01" },
      { "text": "Aceptar que esto no es real", "next": "aceptar_01" }
    ]
  },
  "figura_01": {
    "id": "figura_01",
    "text": "Cada paso hacia la figura es más pesado que el anterior. El aire se solidifica. El pasillo se alarga.\n\nCuando finalmente llegas, la figura ya no está ahí. Pero en el suelo hay un espejo roto.\n\nTe inclinas a recoger un fragmento. En el reflejo no estás tú.\n\nEs la habitación de antes. Con alguien sentado en la silla.\n\nEse alguien levanta la vista del espejo y te mira.",
    "effects": { "force_blur": true, "glitch_intensity": "high", "vibrate": [300, 100, 150] },
    "impact": { "text": -18, "visual": -25, "perceptive": -20, "interface": -15 },
    "options": [
      { "text": "Soltar el espejo", "next": "soltar_espejo" },
      { "text": "Hablarle al reflejo", "next": "hablar_reflejo" }
    ]
  },
  "regreso_01": {
    "id": "regreso_01",
    "text": "Retrocedes. La puerta se cierra a tu espalda con un golpe seco.\n\nLa habitación ha cambiado. La mesa ahora está contra la pared opuesta. La vela sigue encendida, pero su llama es negra.\n\nUna llama negra que da luz.\n\nEn el cuaderno hay una nueva página escrita. La tinta aún está fresca:\n\n\"Sabía que volverías.\"",
    "effects": { "force_blur": false, "glitch_intensity": "medium", "vibrate": [80] },
    "impact": { "text": -12, "visual": -10, "perceptive": -20, "interface": -8 },
    "options": [
      { "text": "Leer qué más dice", "next": "cuaderno_regreso" },
      { "text": "Intentar abrir la puerta de nuevo", "next": "puerta_cerrada" }
    ]
  },
  "ojos_cerrados_01": {
    "id": "ojos_cerrados_01",
    "text": "Cierras los ojos. Avanzas a ciegas por el pasillo. Puedes sentir las paredes palpitar a ambos lados.\n\nAlgo te roza la mejilla. Dedos fríos. Delicados.\n\nUna voz, más cerca de lo que cualquier cosa debería estar, susurra directamente dentro de tu oído:\n\n\"No necesitas los ojos para verme.\"\n\nCuando abres los ojos, estás en una habitación diferente. Más pequeña. Sin puertas.",
    "effects": { "force_blur": false, "glitch_intensity": "high", "vibrate": [50, 30, 50, 30, 200] },
    "impact": { "text": -15, "visual": -18, "perceptive": -30, "interface": -12 },
    "options": [
      { "text": "Buscar una salida", "next": "sin_salida_01" },
      { "text": "\"Muéstrate.\"", "next": "voz_01" }
    ]
  },
  "oscuridad_01": {
    "id": "oscuridad_01",
    "text": "En la oscuridad total, tus manos tantean el suelo frío. Encuentras la vela. Está intacta, pero helada al tacto.\n\nNo tienes con qué encenderla.\n\nAlgo respira en la esquina de la habitación. Rítmico. Pausado. Como si estuviera dormido.\n\nO como si estuviera fingiendo dormir.",
    "effects": { "force_blur": false, "glitch_intensity": "medium" },
    "impact": { "text": -8, "visual": -30, "perceptive": -15, "interface": -5 },
    "options": [
      { "text": "Quedarse en silencio absoluto", "next": "inmovil_01" },
      { "text": "Hablarle a la oscuridad", "next": "voz_01" }
    ]
  },
  "inmovil_01": {
    "id": "inmovil_01",
    "text": "No te mueves. No respiras.\n\nEl tiempo se estira hasta perder significado. Podrían ser minutos o siglos.\n\nEntonces, desde algún lugar imposible de determinar, escuchas tu propia voz:\n\n\"¿Por qué sigues aquí?\"\n\nY después, más bajo:\n\n\"Porque aquí es donde siempre has estado.\"",
    "effects": { "force_blur": false, "glitch_intensity": "high" },
    "impact": { "text": -20, "visual": -10, "perceptive": -35, "interface": -15 },
    "options": [
      { "text": "Responder", "next": "voz_01" },
      { "text": "Correr", "next": "correr_01" }
    ]
  },
  "voz_01": {
    "id": "voz_01",
    "text": "La voz no responde con palabras. Responde con imágenes que aparecen directamente en tu mente:\n\nUna carretera. Lluvia. Faros de un camión. El sonido del metal retorciéndose.\n\nY después, silencio. Un silencio perfecto y absoluto.\n\nY en ese silencio, entiendes.\n\nNunca saliste del coche. Esta habitación, el pasillo, la figura, el cuaderno... todo es el último segundo de sinapsis de un cerebro que se apaga.\n\nEl susurro del vacío fue siempre tu propia voz, despidiéndose.",
    "effects": { "force_blur": true, "glitch_intensity": "critical", "vibrate": [500, 200, 300, 100, 800] },
    "impact": { "text": -40, "visual": -40, "perceptive": -40, "interface": -30 },
    "options": [
      { "text": "Soltar...", "next": "final_aceptar" },
      { "text": "NO.", "next": "final_negar" }
    ]
  },
  "arrancar_pagina": {
    "id": "arrancar_pagina",
    "text": "Arrancas la página. El papel se siente vivo entre tus dedos. Palpita.\n\nEl dibujo cambia mientras lo sostienes. Los ojos fuera de la casa ahora miran en tu dirección. La figura de palitos dentro ya no está.\n\nMiras alrededor de la habitación. ¿Siempre fue tan pequeña?",
    "effects": { "force_blur": false, "glitch_intensity": "medium" },
    "impact": { "text": -12, "visual": -15, "perceptive": -20, "interface": -10 },
    "options": [
      { "text": "Quemar la página con la vela", "next": "quemar" },
      { "text": "Guardarla y dirigirse a la puerta", "next": "puerta_01" }
    ]
  },
  "quemar": {
    "id": "quemar",
    "text": "La página arde con una llama blanca que no da calor. Las cenizas flotan hacia arriba, desafiando la gravedad.\n\nForman letras en el aire antes de desintegrarse:\n\n\"G R A C I A S\"\n\nLa habitación se sacude violentamente. La puerta se abre de golpe.",
    "effects": { "force_blur": false, "glitch_intensity": "high", "vibrate": [400, 80, 100] },
    "impact": { "text": -10, "visual": -25, "perceptive": -10, "interface": -5 },
    "options": [
      { "text": "Cruzar la puerta", "next": "puerta_01" }
    ]
  },
  "grito_01": {
    "id": "grito_01",
    "text": "Tu grito rebota en las paredes. Pero no vuelve como eco. Vuelve como risa.\n\nTu propia risa, distorsionada, más grave, reproduciéndose en un bucle que se degrada con cada repetición hasta convertirse en estática pura.\n\nLa estática se filtra en tus ojos. En tu piel. En tus pensamientos.",
    "effects": { "force_blur": false, "glitch_intensity": "critical", "vibrate": [100, 30, 100, 30, 100, 30, 300] },
    "impact": { "text": -25, "visual": -30, "perceptive": -20, "interface": -20 },
    "options": [
      { "text": "Aferrarse a la realidad", "next": "aceptar_01" },
      { "text": "Dejarse ir", "next": "final_aceptar" }
    ]
  },
  "aceptar_01": {
    "id": "aceptar_01",
    "text": "\"No es real\", te dices. Pero las palabras suenan huecas.\n\n¿Qué es real? ¿El que estabas antes de despertar aquí? ¿O este lugar que conoce tu nombre, tu miedo, tus recuerdos?\n\nLa habitación suspira. Una exhalación larga y triste.\n\n\"Real\", susurra algo, \"es solo lo que dura lo suficiente para doler.\"",
    "effects": { "force_blur": false, "glitch_intensity": "medium" },
    "impact": { "text": -15, "visual": -10, "perceptive": -25, "interface": -10 },
    "options": [
      { "text": "\"Entonces esto es real.\"", "next": "voz_01" },
      { "text": "\"Nada de esto importa.\"", "next": "final_negar" }
    ]
  },
  "soltar_espejo": {
    "id": "soltar_espejo",
    "text": "El espejo cae. No se rompe. Se hunde en el suelo como si la piedra fuera agua.\n\nOnda expansiva de silencio. El pasillo se pliega sobre sí mismo.\n\nEstás de vuelta en la habitación. La misma. Siempre la misma.\n\nPero ahora hay dos velas. Y dos sillas.\n\nEn la segunda silla, algo te espera con una paciencia infinita.",
    "effects": { "force_blur": false, "glitch_intensity": "high" },
    "impact": { "text": -15, "visual": -20, "perceptive": -25, "interface": -15 },
    "options": [
      { "text": "Sentarse en la silla vacía", "next": "voz_01" },
      { "text": "Destruir la segunda silla", "next": "grito_01" }
    ]
  },
  "hablar_reflejo": {
    "id": "hablar_reflejo",
    "text": "\"¿Eres yo?\", preguntas al reflejo.\n\nEl reflejo mueve los labios. Pero las palabras que salen no son las tuyas:\n\n\"Yo soy lo que queda cuando tú termines.\"\n\nEl espejo se calienta en tus manos. La imagen se acerca. Más cerca. Demasiado cerca.\n\nSientes aliento frío en tu nuca. Pero estás solo en el pasillo.",
    "effects": { "force_blur": true, "glitch_intensity": "critical", "vibrate": [200, 50, 200, 50, 600] },
    "impact": { "text": -30, "visual": -25, "perceptive": -35, "interface": -20 },
    "options": [
      { "text": "Dejarse absorber", "next": "final_aceptar" },
      { "text": "Romper el espejo", "next": "grito_01" }
    ]
  },
  "sin_salida_01": {
    "id": "sin_salida_01",
    "text": "No hay salida. Las paredes son lisas. El techo es bajo. El suelo es tibio.\n\nTibio como piel.\n\nEntiendes, con un horror que trasciende el miedo, que no estás EN una habitación.\n\nEstás DENTRO de algo. Algo que respira. Algo que digiere.",
    "effects": { "force_blur": false, "glitch_intensity": "critical", "vibrate": [150, 80, 150, 80, 400] },
    "impact": { "text": -25, "visual": -30, "perceptive": -20, "interface": -25 },
    "options": [
      { "text": "Cavar con las uñas", "next": "grito_01" },
      { "text": "Aceptar", "next": "final_aceptar" }
    ]
  },
  "correr_01": {
    "id": "correr_01",
    "text": "Corres. No sabes hacia dónde. El espacio se pliega, se repite, se contradice.\n\nPasas por la misma puerta siete veces. O quizás son siete puertas idénticas.\n\nAl final de la carrera, jadeando, te detienes.\n\nEstás exactamente donde empezaste. Frente a la mesa. Frente a la vela.\n\nPero ahora hay algo escrito en la mesa que antes no estaba:\n\n\"DEJA DE CORRER. SIEMPRE LLEGAS AQUÍ.\"",
    "effects": { "force_blur": false, "glitch_intensity": "high" },
    "impact": { "text": -20, "visual": -15, "perceptive": -15, "interface": -20 },
    "options": [
      { "text": "\"Entonces me quedo.\"", "next": "voz_01" },
      { "text": "Correr de nuevo", "next": "correr_01" }
    ]
  },
  "cuaderno_regreso": {
    "id": "cuaderno_regreso",
    "text": "La nueva página continúa:\n\n\"Cada vez que vuelves, pierdes algo. No algo grande. Algo pequeño. Un color. Un olor. Un nombre.\n\n¿Recuerdas tu nombre?\n\n¿Recuerdas si alguna vez tuviste uno?\"\n\nIntentas recordar tu nombre. No puedes. El espacio donde debería estar ese dato en tu memoria está... vacío.\n\nEl susurro del vacío.",
    "effects": { "force_blur": false, "glitch_intensity": "medium" },
    "impact": { "text": -18, "visual": -12, "perceptive": -30, "interface": -10 },
    "options": [
      { "text": "Seguir leyendo", "next": "voz_01" },
      { "text": "Cerrar los ojos", "next": "ojos_cerrados_01" }
    ]
  },
  "puerta_cerrada": {
    "id": "puerta_cerrada",
    "text": "La puerta no se abre. No está cerrada con llave. Simplemente... ya no es una puerta. Es una pared con forma de puerta. Un recuerdo de una salida que ya no existe.\n\nDetrás de ti, la llama negra proyecta sombras que no corresponden a ningún objeto de la habitación.\n\nUna de las sombras se mueve independientemente.",
    "effects": { "force_blur": false, "glitch_intensity": "high" },
    "impact": { "text": -15, "visual": -20, "perceptive": -25, "interface": -15 },
    "options": [
      { "text": "Enfrentar la sombra", "next": "voz_01" },
      { "text": "Ignorarla y buscar otra salida", "next": "sin_salida_01" }
    ]
  },
  "final_aceptar": {
    "id": "final_aceptar",
    "text": "Sueltas. Todo.\n\nLa habitación se disuelve. Las paredes. El suelo. El techo. Tu cuerpo.\n\nQueda solo la vela. Flotando en un vacío infinito. Su llama — mitad dorada, mitad negra — parpadea una última vez.\n\nY en la oscuridad total, finalmente, hay paz.\n\nNo la paz del descanso. La paz de lo inevitable.\n\n...\n\n...\n\nFIN — SESIÓN TERMINADA\n\n[El vacío siempre estuvo ahí. Solo necesitabas dejar de correr para verlo.]",
    "effects": { "force_blur": true, "glitch_intensity": "critical", "vibrate": [1000] },
    "impact": { "text": -50, "visual": -50, "perceptive": -50, "interface": -50 },
    "options": [
      { "text": "[ REINICIAR SESIÓN ]", "next": "__restart__" }
    ]
  },
  "final_negar": {
    "id": "final_negar",
    "text": "\"NO.\"\n\nLa palabra resuena como un trueno en el vacío. Las paredes se solidifican. La vela arde con fuerza renovada.\n\nPero algo ha cambiado. El cuaderno tiene una nueva entrada. La última:\n\n\"Negarlo no lo detiene. Solo lo repite.\"\n\nLa habitación comienza de nuevo. Idéntica. Exacta. Pero tú sabes que algo es diferente.\n\nTú eres diferente.\n\n¿O eres el mismo, creyendo que es diferente, por enésima vez?\n\n...\n\nFIN — BUCLE DETECTADO\n\n[Algunos vacíos no tienen fondo. Solo tienen repeticiones.]",
    "effects": { "force_blur": false, "glitch_intensity": "critical", "vibrate": [80, 80, 80, 80, 80, 80, 80, 80, 80, 80] },
    "impact": { "text": -50, "visual": -50, "perceptive": -50, "interface": -50 },
    "options": [
      { "text": "[ REINICIAR SESIÓN ]", "next": "__restart__" }
    ]
  }
}
;
