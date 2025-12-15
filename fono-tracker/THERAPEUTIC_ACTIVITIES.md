# Gestor de actividades terapéuticas

Este esquema propone categorías y requisitos funcionales para crear, organizar y ejecutar actividades desde la app, manteniendo el estilo visual existente (tarjetas, cuadrículas y campos rellenables).

## Categorías sugeridas

1. **Articulación y fonología**
   - Discriminación auditiva, pares mínimos, secuencias de sonido/sílaba/palabra/frase.
   - Soporte: subida de imágenes/íconos, casillas para rótulos fonéticos, grabar y reproducir audio de modelo y de paciente.

2. **Fluidez (tartamudez)**
   - Técnicas de modelado, ritmo y pausas; lectura guiada; desensibilización.
   - Soporte: metrónomo/tempo simple, contadores de disfluencias por bloque, grabación para retroalimentación.

3. **Voz**
   - Higiene vocal, resonancia, intensidad/pitch, proyección.
   - Soporte: temporizador de ejercicios, sliders para intensidad percibida, checklist de higiene.

4. **Lenguaje expresivo**
   - Vocabulario, morfosintaxis, narración, descripción de imágenes.
   - Soporte: plantillas de tarjetas con imagen + campos de rótulo, grabación de narrativa, contador de palabras/MLU.

5. **Lenguaje comprensivo**
   - Seguimiento de instrucciones, comprensión de preguntas WH, inferencias.
   - Soporte: secuencias de imágenes con pasos, campos de respuesta, opción de texto o audio.

6. **Pragmática y comunicación social**
   - Turnos conversacionales, contacto visual, reparación de comunicación, teoría de la mente.
   - Soporte: tarjetas de situación, checklists de indicadores, botones de registro rápido de aciertos.

7. **Lectoescritura**
   - Conciencia fonológica, decodificación, fluidez lectora, comprensión.
   - Soporte: tarjetas de letras/sílabas, reloj/cronómetro de lectura, casillas para respuestas escritas.

8. **AAC/SAAC (comunicación aumentativa)**
   - Selección de pictogramas, tableros temáticos, frases modelo.
   - Soporte: subida de pictos, organización en cuadrículas, campos de texto grande, audio de salida opcional.

9. **Motricidad orofacial y alimentación**
   - Tonificación, coordinación soplo/succión/masticación, texturas.
   - Soporte: listas de chequeo, temporizadores por serie, adjuntar imágenes de utensilios/posturas.

10. **Cognición y funciones ejecutivas**
    - Memoria de trabajo, planificación, atención sostenida/alternante.
    - Soporte: secuencias de pasos, casillas para objetivos parciales, contadores y notas rápidas.

11. **Juego y simbolización (pediatría)**
    - Imitación, causa-efecto, juego simbólico, roles sociales.
    - Soporte: storyboard con imágenes, campos para rótulos y guiones breves.

12. **Regulación sensorial / apoyo socioemocional**
    - Alertas sensoriales, autorregulación, identificación emocional.
    - Soporte: ruedas de emociones, sliders de intensidad, campos de estrategia elegida.

## Controles y campos reutilizables
- **Subida de imágenes**: arrastrar/soltar o botón, con previsualización y casillas de rótulo superpuestas.
- **Grabación y reproducción de audio**: botón de grabar (con estado), lista de clips por intento, reproducción inmediata.
- **Cuadrículas rellenables**: campos editables para texto corto/largo, opción de plantillas (tarjeta simple, secuencia, tablero de pictos).
- **Checklists y contadores**: para aciertos, disfluencias, repeticiones o series, con totales automáticos.
- **Temporizador/cronómetro**: configurable por actividad o serie.
- **Notas clínicas**: campo libre + quick tags (fatiga, atención, participación).

## Organización y seguimiento
- **Categoría y subcategoría**: seleccionar al crear la actividad; reutilizar etiquetas para filtrado.
- **Objetivos vinculados**: opcional, solo para referencia; no bloquear actividades por diagnóstico.
- **Versionado ligero**: duplicar actividad para ajustes sin perder historial.
- **Historial de uso**: fecha, paciente, duración, notas breves y clips asociados.
- **Compartir/impresión**: exportar tarjetas/cuadrículas con rótulos visibles y espacio para anotaciones.

## Reglas de uso sugeridas
- Mantener independencia entre diagnóstico y actividad: las categorías sirven para filtrar y sugerir, no para condicionar la elegibilidad.
- Al guardar, pedir confirmación si faltan rótulos o clips requeridos en esa plantilla.
- Conservar los colores/acento actuales (botones primarios y bordes) para consistencia visual.
