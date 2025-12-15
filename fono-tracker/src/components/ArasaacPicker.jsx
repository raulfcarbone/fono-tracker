import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, MessageSquareText, Search } from 'lucide-react';
import { pictoUrl, searchPictograms } from '../services/arasaac';

export function ArasaacPicker({ locale = 'es', onSelect, selectedId }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [captions, setCaptions] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const debounceMs = 400;

    useEffect(() => {
        const term = query.trim();
        if (!term) {
            setResults([]);
            setError('');
            return undefined;
        }

        const controller = new AbortController();
        const timer = setTimeout(async () => {
            setIsLoading(true);
            setError('');
            try {
                const data = await searchPictograms(locale, term, { signal: controller.signal });
                setResults(Array.isArray(data) ? data : []);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error(err);
                    setError('No se pudo conectar con ARASAAC. Intenta nuevamente.');
                }
            } finally {
                setIsLoading(false);
            }
        }, debounceMs);

        return () => {
            controller.abort();
            clearTimeout(timer);
        };
    }, [query, locale]);

    const selectedKeyword = useMemo(() => {
        const found = results.find(item => item._id === selectedId);
        return found?.keywords?.[0]?.keyword;
    }, [results, selectedId]);

    const handleSelect = (result) => {
        const payload = {
            id: result._id,
            keyword: result.keywords?.[0]?.keyword,
            caption: captions[result._id]?.trim(),
            url: pictoUrl(result._id, 500)
        };
        onSelect?.(payload);
    };

    return (
        <div className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-slate-800 flex items-center space-x-2">
                        <Search size={15} className="text-teal-600" />
                        <span>ARASAAC (símbolos)</span>
                    </p>
                    <p className="text-xs text-slate-500">Busca pictogramas y selecciónalos como recursos reutilizables.</p>
                </div>
                {isLoading && <Loader2 size={18} className="animate-spin text-teal-600" />}
            </div>

            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ej. perro, ir al baño, ayuda"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />

            {error && <p className="text-xs text-red-600">{error}</p>}

            {results.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs uppercase font-semibold text-slate-500">Resultados</p>
                    <div className="grid grid-cols-2 gap-3 max-h-64 overflow-auto pr-1">
                        {results.map(result => {
                            const displayKeyword = result.keywords?.[0]?.keyword;
                            const captionValue = captions[result._id] || '';
                            const isSelected = selectedId === result._id;
                            return (
                                <div
                                    key={result._id}
                                    className={`border border-slate-200 rounded-lg bg-white shadow-xs overflow-hidden ${isSelected ? 'ring-2 ring-teal-400' : ''}`}
                                >
                                    <div className="aspect-square bg-slate-50 flex items-center justify-center">
                                        <img
                                            src={pictoUrl(result._id, 500)}
                                            alt={displayKeyword || 'Pictograma ARASAAC'}
                                            className="max-h-40 object-contain"
                                        />
                                    </div>
                                    <div className="p-2 space-y-2">
                                        <p className="text-xs font-semibold text-slate-800 truncate flex items-center space-x-1">
                                            <MessageSquareText size={14} className="text-teal-600" />
                                            <span>{displayKeyword || 'Sin palabra clave'}</span>
                                        </p>
                                        <input
                                            value={captionValue}
                                            onChange={(e) => setCaptions(prev => ({ ...prev, [result._id]: e.target.value }))}
                                            placeholder="Rótulo opcional"
                                            className="w-full border border-slate-200 rounded-md px-2 py-1 text-xs"
                                        />
                                        <button
                                            onClick={() => handleSelect(result)}
                                            className="w-full text-center bg-slate-900 text-white py-2 rounded-md text-xs font-semibold hover:bg-slate-800"
                                        >
                                            {isSelected ? 'Seleccionado' : 'Usar pictograma'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {selectedId && (
                <p className="text-xs text-teal-700 font-medium">Pictograma seleccionado: {selectedKeyword || selectedId}</p>
            )}
        </div>
    );
}
