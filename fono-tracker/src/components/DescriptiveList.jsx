import React from 'react';

/**
 * Descriptive List for Qualitative Scales (like Casby)
 * 
 * @param {Object} props
 * @param {Object} props.value - Values { [id]: { observation: string, score: number } }
 * @param {Function} props.onChange - Handler
 * @param {boolean} props.readOnly
 * @param {Array} props.sections - { id, title, age, examples: [] }
 * @param {Array} props.levels - Optional: { value, label, color } for scoring
 */
export function DescriptiveList({ value = {}, onChange, readOnly = false, sections, levels }) {

    // Helper to get current data safely (handles legacy string-only if needed, though we just built it)
    const getData = (id) => {
        const entry = value[id];
        if (typeof entry === 'string') return { observation: entry, score: '' }; // Back-compat
        return entry || { observation: '', score: '' };
    };

    const handleTextChange = (id, text) => {
        if (readOnly) return;
        const current = getData(id);
        onChange({
            ...value,
            [id]: { ...current, observation: text }
        });
    };

    const handleScoreChange = (id, scoreVal) => {
        if (readOnly) return;
        const current = getData(id);
        onChange({
            ...value,
            [id]: { ...current, score: parseInt(scoreVal) }
        });
    };

    return (
        <div className="space-y-6">
            {sections.map(section => {
                const data = getData(section.id);

                return (
                    <div key={section.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="grid md:grid-cols-2">
                            {/* Info Column */}
                            <div className="p-5 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-base">{section.title}</h3>
                                        <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full font-semibold mt-1">
                                            {section.age}
                                        </span>
                                    </div>

                                    {/* Scoring Dropdown */}
                                    {levels && (
                                        <div className="ml-4 min-w-[140px]">
                                            <select
                                                value={data.score !== undefined ? data.score : ""}
                                                onChange={(e) => handleScoreChange(section.id, e.target.value)}
                                                disabled={readOnly}
                                                className={`w-full text-xs p-2 rounded border focus:ring-2 focus:ring-orange-500 outline-none
                                                    ${data.score === 0 ? 'bg-red-50 border-red-200 text-red-700' : ''}
                                                    ${data.score === 1 ? 'bg-amber-50 border-amber-200 text-amber-700' : ''}
                                                    ${data.score === 2 ? 'bg-green-50 border-green-200 text-green-700' : ''}
                                                    ${data.score === '' ? 'bg-white border-slate-300' : ''}
                                                `}
                                            >
                                                <option value="">Nivel no observado...</option>
                                                {levels.map(lvl => (
                                                    <option key={lvl.value} value={lvl.value}>
                                                        {lvl.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 mt-3">
                                    {section.examples.map((ex, idx) => (
                                        <li key={idx} className="leading-snug pl-1 marker:text-slate-400">
                                            {ex}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Input Column */}
                            <div className="p-4 bg-white flex flex-col">
                                <label className="text-xs font-semibold text-slate-400 uppercase mb-2">Observaciones / Comentarios</label>
                                {readOnly ? (
                                    <p className="text-slate-700 text-sm whitespace-pre-wrap flex-grow bg-slate-50 p-3 rounded-lg border border-transparent">
                                        {data.observation || <span className="text-slate-400 italic">Sin observaciones</span>}
                                    </p>
                                ) : (
                                    <textarea
                                        value={data.observation}
                                        onChange={(e) => handleTextChange(section.id, e.target.value)}
                                        className="w-full h-full min-h-[120px] p-3 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-y"
                                        placeholder="Ingrese sus observaciones aquí..."
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
