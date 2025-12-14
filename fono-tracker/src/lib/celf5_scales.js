export const CELF_TABLES = {
    // Tabla 1: Puntuaciones escalares
    scalars: {
        id: 'scalars',
        title: 'Tabla 1: Puntuaciones escalares',
        columns: [
            { key: 'pd', label: 'P. directa', width: 'w-20' },
            { key: 'pe', label: 'P. escalar', width: 'w-20', chart: true }, // Used for chart
            { key: 'ic', label: 'I. Confianza (95%)' },
            { key: 'ic_perc', label: 'I. Confianza percentil (95%)' },
            { key: 'age_eq', label: 'P. edad equivalente' },
            { key: 'dev_val', label: 'Valores de desarrollo' }
        ],
        rows: [
            { key: 'CF', label: 'Comprensión de frases (CF)' },
            { key: 'CL', label: 'Conceptos lingüísticos (CL)' },
            { key: 'M', label: 'Morfosintaxis (M)' },
            { key: 'PR', label: 'Palabras relacionadas (PR)' },
            { key: 'EI', label: 'Ejecución de indicaciones (EI)' },
            { key: 'EF', label: 'Elaboración de frases (EF)' },
            { key: 'RF', label: 'Repetición de frases (RF)' },
            { key: 'COT', label: 'Comprensión oral de textos (COT)' },
            { key: 'PHP', label: 'Perfil de habilidades pragmáticas (PHP)' }
        ]
    },

    // Tabla 2: Puntuaciones compuestas
    composites: {
        id: 'composites',
        title: 'Tabla 2: Puntuaciones compuestas índices',
        columns: [
            { key: 'sum_pe', label: 'Suma puntajes escalares' },
            { key: 'comp_score', label: 'Puntuación compuesta', chart: true }, // Used for chart
            { key: 'ic', label: 'Intervalo de confianza (95%)' },
            { key: 'percentile', label: 'Percentil' },
            { key: 'ic_percentile', label: 'I. Confianza percentil' }
        ],
        rows: [
            { key: 'PPL', label: 'Puntuación principal de lenguaje (PPL)' },
            { key: 'ILR', label: 'Índice de lenguaje receptivo (ILR)' },
            { key: 'ILE', label: 'Índice de lenguaje expresivo (ILE)' },
            { key: 'ICL', label: 'Índice de contenido lingüístico (ICL)' },
            { key: 'IML', label: 'Índice de memoria lingüística (IML)' }
        ]
    },

    // Tabla 3: Comparación entre índices
    comparisons: {
        id: 'comparisons',
        title: 'Tabla 3: Comparación entre índices',
        columns: [
            { key: 'score1', label: 'P. compuesta 1' },
            { key: 'score2', label: 'P. compuesta 2' },
            { key: 'diff', label: 'Diferencia' },
            { key: 'crit_val', label: 'Valor crítico' },
            { key: 'diff_sig', label: 'Diferencia significativa' },
            { key: 'sig_level', label: 'Nivel de significación' }
        ],
        rows: [
            { key: 'ILR_ILE', label: 'ILR – ILE' },
            { key: 'ICL_IML', label: 'ICL – IML' }
        ]
    }
};
