/**
 * PLANTILLAS DE INFORMES FONOAUDIOLÓGICOS
 * 
 * Plantillas profesionales en formato Markdown con variables dinámicas
 */

export const REPORT_TEMPLATES = {
    evaluacion: {
        id: 'evaluacion',
        name: 'Informe de Evaluación',
        description: 'Informe completo de evaluación fonoaudiológica inicial',
        template: `# INFORME FONOAUDIOLÓGICO - EVALUACIÓN

**Paciente**: {{nombre}}  
**RUT**: {{rut}}  
**Edad**: {{edad}}  
**Fecha de Evaluación**: {{fecha_evaluacion}}  
**Fonoaudiólogo(a)**: {{nombre_terapeuta}}

---

## MOTIVO DE CONSULTA

{{motivo_consulta}}

## ANTECEDENTES RELEVANTES

### Antecedentes del Desarrollo
{{antecedentes_desarrollo}}

### Antecedentes Médicos
{{antecedentes_medicos}}

### Antecedentes Familiares
{{antecedentes_familiares}}

## EVALUACIONES APLICADAS

{{evaluaciones_tabla}}

## INTERPRETACIÓN DE RESULTADOS

{{interpretacion}}

## DIAGNÓSTICO FONOAUDIOLÓGICO

{{diagnostico}}

## PRONÓSTICO

{{pronostico}}

## PLAN DE TRATAMIENTO

### Objetivos Terapéuticos
{{objetivos_terapeuticos}}

### Frecuencia Sugerida
{{frecuencia}}

### Duración Estimada
{{duracion_estimada}}

---

**Firma**: _______________________________  
**{{nombre_terapeuta}}**  
Fonoaudiólogo(a)  
Registro: {{registro_sis}}
`
    },
    evolucion: {
        id: 'evolucion',
        name: 'Informe de Evolución',
        description: 'Informe de progreso terapéutico',
        template: `# INFORME DE EVOLUCIÓN FONOAUDIOLÓGICA

**Paciente**: {{nombre}}  
**RUT**: {{rut}}  
**Período**: {{fecha_inicio}} - {{fecha_fin}}  
**Fonoaudiólogo(a)**: {{nombre_terapeuta}}

---

## RESUMEN DE INTERVENCIÓN

**Número de sesiones**: {{numero_sesiones}}  
**Frecuencia**: {{frecuencia}}  
**Modalidad**: {{modalidad}}

## OBJETIVOS TRABAJADOS

{{objetivos_trabajados}}

## PROGRESO OBSERVADO

{{progreso}}

## EVALUACIÓN COMPARATIVA

{{comparacion_evaluaciones}}

## OBSERVACIONES CLÍNICAS

{{observaciones}}

## RECOMENDACIONES

{{recomendaciones}}

## PLAN DE CONTINUIDAD

{{plan_continuidad}}

---

**Fecha**: {{fecha_informe}}  
**Firma**: _______________________________  
**{{nombre_terapeuta}}**  
Fonoaudiólogo(a)
`
    },
    pie: {
        id: 'pie',
        name: 'Informe para PIE/Colegio',
        description: 'Informe para Programa de Integración Escolar',
        template: `# INFORME FONOAUDIOLÓGICO PARA PIE

**Establecimiento**: {{nombre_colegio}}  
**Alumno(a)**: {{nombre}}  
**RUT**: {{rut}}  
**Curso**: {{curso}}  
**Fecha**: {{fecha_informe}}

---

## DIAGNÓSTICO FONOAUDIOLÓGICO

{{diagnostico}}

## EVALUACIÓN ACTUAL

{{evaluacion_actual}}

## NECESIDADES EDUCATIVAS ESPECIALES

{{nee}}

## APOYOS REQUERIDOS

### En el Aula
{{apoyos_aula}}

### Fonoaudiológicos
- **Frecuencia**: {{frecuencia}}
- **Modalidad**: {{modalidad}}
- **Objetivos prioritarios**: {{objetivos_prioritarios}}

## RECOMENDACIONES PARA EL DOCENTE

{{recomendaciones_docente}}

## PARTICIPACIÓN FAMILIAR

{{participacion_familiar}}

---

**{{nombre_terapeuta}}**  
Fonoaudiólogo(a)  
Registro: {{registro_sis}}  
Contacto: {{contacto}}
`
    },
    certificado: {
        id: 'certificado',
        name: 'Certificado de Asistencia',
        description: 'Certificado de asistencia a terapia',
        template: `# CERTIFICADO DE ASISTENCIA

El/La que suscribe, **{{nombre_terapeuta}}**, Fonoaudiólogo(a), Registro {{registro_sis}}, certifica que:

**{{nombre}}**, RUT **{{rut}}**, ha asistido a terapia fonoaudiológica en el período comprendido entre **{{fecha_inicio}}** y **{{fecha_fin}}**.

**Número total de sesiones**: {{numero_sesiones}}  
**Frecuencia**: {{frecuencia}}  
**Diagnóstico**: {{diagnostico}}

Se extiende el presente certificado para los fines que el/la interesado(a) estime conveniente.

---

**Fecha**: {{fecha_certificado}}  
**Lugar**: {{lugar}}

**Firma**: _______________________________  
**{{nombre_terapeuta}}**  
Fonoaudiólogo(a)  
Registro: {{registro_sis}}
`
    }
};

/**
 * Helper function to fill template with data
 */
export function fillTemplate(templateId, data) {
    const template = REPORT_TEMPLATES[templateId];
    if (!template) return '';

    let filled = template.template;

    // Replace all variables
    Object.keys(data).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        filled = filled.replace(regex, data[key] || '[No especificado]');
    });

    return filled;
}

/**
 * Get all available templates
 */
export function getAvailableTemplates() {
    return Object.values(REPORT_TEMPLATES);
}
