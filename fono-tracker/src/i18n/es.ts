export const es = {
  interactiveActivities: {
    title: 'Actividades interactivas',
    subtitle: 'Módulos terapéuticos listos para usar en consulta o a distancia, con registro local sin conexión.',
    catalogue: 'Catálogo modular',
    offlineNotice: 'Los avances se guardan en este dispositivo usando IndexedDB (Dexie).',
    patientHint: 'Puedes asociar los registros a un paciente escribiendo su identificador clínico.',
    stats: 'Progreso del módulo',
    howToExtendTitle: 'Cómo extender el sistema',
    howToExtendSteps: [
      'Crea un componente React que reciba un hook de progreso y emita logAttempt cuando haya feedback.',
      'Añade el módulo en src/modules/interactiveModules.js con su metadata clínica, tipo de juego y activos.',
      'Usa assets locales (imágenes o audio) y mantén los textos en español para guiar la sesión.',
      'Si requiere APIs externas, encapsula la integración y documenta la clave o build aparte.',
    ],
  },
};

export default es;
