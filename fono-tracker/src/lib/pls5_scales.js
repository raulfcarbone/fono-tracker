
export const PLS5_TABLE = {
    id: 'pls5_summary',
    title: 'Síntesis resultados PLS-5',
    columns: [
        { key: 'raw', label: 'Puntaje Bruto', type: 'number' },
        { key: 'standard', label: 'Puntaje Estándar', type: 'number', chart: true },
        { key: 'percentile', label: 'Percentil', type: 'number' },
        { key: 'age_eq', label: 'Edad Equivalente', type: 'text' }
    ],
    rows: [
        { key: 'auditory_comprehension', label: 'Comprensión Auditiva' },
        { key: 'expressive_communication', label: 'Comunicación Expresiva' },
        { key: 'total_language', label: 'Lenguaje Total' }
    ]
};
