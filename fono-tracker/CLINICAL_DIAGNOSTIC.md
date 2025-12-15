# Diagnóstico clínico-funcional de la app

Este reporte resume el estado actual de la app desde la mirada de un revisor clínico en fonoaudiología. Se mantienen los acentos visuales existentes y se señalan prioridades para robustecer la usabilidad, trazabilidad y seguridad de la información.

## 1) Estructura y navegación
- **Fortalezas**: La navegación lateral fija distingue claramente Dashboard, Agenda, Pacientes y Configuración, con realce activo consistente en turquesa para orientar la ubicación del usuario. El contenedor principal mantiene márgenes amplios y fondo neutro que priorizan el contenido clínico.【F:src/components/Layout.jsx†L6-L57】
- **Oportunidades**: Falta un acceso directo a recursos críticos (p.ej., ayuda clínica, guía de escalas o vínculo a consentimiento informado). También sería útil mostrar el nombre del profesional y un switch de cuenta/idioma en el encabezado.

## 2) Agenda y coordinación asistencial
- **Fortalezas**: La agenda usa react-big-calendar con localización en español, soporta tipos de sesión con colores diferenciados (presencial, online, evaluaciones y reuniones) y permite registrar notas clínicas y enlaces de reunión. Las citas canceladas se atenúan visualmente para dar contexto operativo.【F:src/pages/Calendar.jsx†L1-L120】【F:src/pages/Calendar.jsx†L121-L207】
- **Oportunidades**: No se validan solapamientos ni recuerda confirmar duración mínima; sería conveniente alertar cuando el mismo paciente tiene otra cita en la franja. Falta exportar/compartir la agenda o generar recordatorios automáticos por correo/WhatsApp.

## 3) Tablero operativo (Dashboard)
- **Fortalezas**: Calcula atención semanal vs. semana previa, cancelaciones, totales de pacientes y evaluaciones. El gráfico vertical agrupa tipos de evaluación y la lista de actividad reciente enlaza al paciente, ofreciendo visión rápida de productividad clínica.【F:src/pages/Dashboard.jsx†L22-L197】
- **Oportunidades**: No se refleja la tasa de adherencia (asistencias/planificadas) ni indicadores de severidad promedio por escala. Incluir metas semanales o alertas de caídas abruptas en asistencia apoyaría decisiones terapéuticas. Falta consolidar riesgos operativos en un solo golpe de vista.
- **Sugerencias concretas**:
  - **Adherencia y puntualidad**: mostrar porcentaje de asistencia por modalidad (presencial/online) y un semáforo de retrasos >10/15 minutos. Permite ver problemas logísticos antes de que afecten la continuidad.
  - **Severidad promedio por escala**: promediar el último puntaje o nivel de cada instrumento (ej. ASHA FCM, DAGG-2) y exponerlo por área; ayuda a priorizar casos con mayor impacto funcional.
  - **Alertas clínicas y administrativas**: banner compacto para consentimientos vencidos, evaluaciones pendientes, objetivos sin revisión >4 semanas y documentos sin firma. Facilita trazabilidad y cumplimiento.
  - **Tendencia de progreso**: mini-sparklines de GAS promedio semanal o por área clínica, más un indicador de objetivos estancados (sin cambio ≥3 sesiones). Enfoca la toma de decisiones terapéuticas.
  - **Carga asistencial y brecha**: horas agendadas vs. disponibles y brecha de cupos; útil para redistribuir demanda y evitar sobrecarga.

## 4) Gestión de pacientes
- **Fortalezas**: La vista de pacientes prioriza la creación rápida con modal de admisión y tarjetas limpias que destacan nombre y diagnóstico inicial.【F:src/pages/Patients.jsx†L9-L75】
- **Oportunidades**: Falta búsqueda/filtrado por diagnóstico, edad o prioridad, y no hay segmentación por responsable o aseguradora. El alta no valida duplicados ni contempla campos clínicos mínimos (fecha de nacimiento, contacto, derivante), lo que limita la seguridad del registro.

## 5) Objetivos terapéuticos y seguimiento GAS
- **Fortalezas**: En la ficha de paciente se organizan objetivos por área clínica, con expansión por sección, creación en línea y gráfico GAS por objetivo que traza el progreso y conserva historial detallado de rúbrica.【F:src/pages/PatientDetail.jsx†L70-L221】
- **Oportunidades**: El componente de scoring de rúbrica se maneja en un flujo separado y no previene cerrar sin guardar; convendría agregar guardado automático o bloqueo de navegación. Tampoco se calcula tendencia temporal (p.ej., pendiente de GAS) ni promedio por área para comparaciones de plan de trabajo.

## 6) Evaluaciones e instrumentos
- **Fortalezas**: Se integran múltiples escalas (ASHA FCM, DAGG-2, ICS, CELF-5, PLS-5, CARS-2, Derby, Wetherby, Casby), con configuraciones que determinan el tipo de captura (rúbrica, checklist, tabla manual) y colores de acción reutilizados, facilitando consistencia visual y clínica.【F:src/components/PatientEvaluations.jsx†L1-L120】
- **Oportunidades**: No hay validaciones específicas por escala (ej. rangos esperados o cálculo automático de puntuaciones normativas) y los datos se guardan sin firma profesional ni advertencias de completitud. Incluir interpretaciones automáticas y anexar referencias normativas mejoraría la calidad del reporte clínico.

## 7) Documentos y planes
- **Fortalezas**: La ficha permite crear formatos internos imprimibles y cargar documentos externos, manteniendo versiones ordenadas por fecha y con acciones de impresión/eliminación rápidas.【F:src/components/PatientDocuments.jsx†L1-L134】
- **Oportunidades**: Falta control de tamaño/tipo de archivo y no se registra quién sube cada documento. Sería valioso ofrecer plantillas basadas en objetivos activos y un visor para imágenes/PDF sin descargar.

## 8) Datos y trazabilidad
- **Observaciones generales**: Todo persiste en IndexedDB vía Dexie sin autenticación ni cifrado; no hay respaldo en la nube ni control de sesiones. Para uso clínico real se requeriría al menos cifrado en reposo, respaldo y exportación segura, además de bitácora de actividad por usuario.

## Recomendaciones priorizadas
1) **Seguridad y trazabilidad**: incorporar autenticación, cifrado y registro de acciones (creación/edición/borrado) por usuario. Sin esto, el uso clínico formal es riesgoso.
2) **Validaciones clínicas**: agregar reglas y cálculos automáticos por escala (rangos, interpretaciones, puntajes normativos) y checklists de completitud antes de guardar.
3) **Productividad**: habilitar filtros/búsquedas en pacientes, prevenir solapamientos en agenda y permitir recordatorios compartidos.
4) **Insight terapéutico**: resumir progresos por área y tendencia de GAS, y reflejar adherencia en el Dashboard.
5) **Documentación**: plantillas parametrizadas por objetivos y visor embebido para adjuntos.
