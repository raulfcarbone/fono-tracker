import React, { useState, useMemo } from 'react';
import { X, Search, Filter, Star, StarOff, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { OBJECTIVE_BANK, searchObjectives, COMMON_DIAGNOSES, AGE_GROUPS } from '../lib/objective_bank';

export function ObjectiveBankModal({ onSelect, onClose, patientDiagnosis }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedAgeGroup, setSelectedAgeGroup] = useState('');
    const [selectedDiagnosis, setSelectedDiagnosis] = useState(patientDiagnosis || '');
    const [selectedType, setSelectedType] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('objective_favorites');
        return saved ? JSON.parse(saved) : [];
    });
    const [expandedObjective, setExpandedObjective] = useState(null);
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

    // Buscar objetivos con filtros
    const filteredObjectives = useMemo(() => {
        let results = searchObjectives(searchQuery, {
            area: selectedArea,
            ageGroup: selectedAgeGroup,
            diagnosis: selectedDiagnosis,
            type: selectedType
        });

        if (showOnlyFavorites) {
            results = results.filter(obj => favorites.includes(obj.id));
        }

        return results;
    }, [searchQuery, selectedArea, selectedAgeGroup, selectedDiagnosis, selectedType, showOnlyFavorites, favorites]);

    // Toggle favorito
    const toggleFavorite = (objectiveId) => {
        const newFavorites = favorites.includes(objectiveId)
            ? favorites.filter(id => id !== objectiveId)
            : [...favorites, objectiveId];
        setFavorites(newFavorites);
        localStorage.setItem('objective_favorites', JSON.stringify(newFavorites));
    };

    // Seleccionar objetivo
    const handleSelect = (objective) => {
        onSelect({
            description: objective.text,
            area: objective.areaName,
            baseline: objective.baseline,
            target: objective.target,
            contexts: objective.contexts,
            materials: objective.materials,
            strategies: objective.strategies,
            sourceId: objective.id
        });
        onClose();
    };

    // Obtener tipos únicos del área seleccionada
    const availableTypes = useMemo(() => {
        if (!selectedArea) return [];
        const area = OBJECTIVE_BANK.areas.find(a => a.id === selectedArea);
        if (!area) return [];
        const types = [...new Set(area.objectives.map(obj => obj.type))];
        return types.map(type => ({
            id: type,
            label: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        }));
    }, [selectedArea]);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-teal-50 to-blue-50">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Banco de Objetivos Terapéuticos</h2>
                        <p className="text-sm text-slate-600 mt-1">
                            {filteredObjectives.length} objetivo{filteredObjectives.length !== 1 ? 's' : ''} encontrado{filteredObjectives.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Search and Filters */}
                <div className="px-6 py-4 border-b border-slate-200 space-y-3 bg-slate-50">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar por palabra clave (ej: fonema /r/, vocabulario, turnos...)"
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>

                    {/* Filter Toggle */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            <Filter size={16} />
                            {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
                            {showFilters ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                        <button
                            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                            className={clsx(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                                showOnlyFavorites
                                    ? "bg-amber-100 text-amber-700 border border-amber-300"
                                    : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-50"
                            )}
                        >
                            <Star size={16} className={showOnlyFavorites ? "fill-amber-500" : ""} />
                            Solo favoritos ({favorites.length})
                        </button>
                    </div>

                    {/* Filters */}
                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-200">
                            {/* Área Clínica */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Área Clínica</label>
                                <select
                                    value={selectedArea}
                                    onChange={(e) => {
                                        setSelectedArea(e.target.value);
                                        setSelectedType(''); // Reset type when area changes
                                    }}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                >
                                    <option value="">Todas las áreas</option>
                                    {OBJECTIVE_BANK.areas.map(area => (
                                        <option key={area.id} value={area.id}>{area.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Grupo de Edad */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Edad</label>
                                <select
                                    value={selectedAgeGroup}
                                    onChange={(e) => setSelectedAgeGroup(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                >
                                    <option value="">Todas las edades</option>
                                    {AGE_GROUPS.map(group => (
                                        <option key={group.id} value={group.id}>{group.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Diagnóstico */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Diagnóstico</label>
                                <select
                                    value={selectedDiagnosis}
                                    onChange={(e) => setSelectedDiagnosis(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                >
                                    <option value="">Todos los diagnósticos</option>
                                    {COMMON_DIAGNOSES.map(diagnosis => (
                                        <option key={diagnosis} value={diagnosis}>{diagnosis}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Tipo (depende del área) */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Tipo</label>
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    disabled={!selectedArea}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                                >
                                    <option value="">Todos los tipos</option>
                                    {availableTypes.map(type => (
                                        <option key={type.id} value={type.id}>{type.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results */}
                <div className="flex-1 overflow-y-auto p-6">
                    {filteredObjectives.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-slate-400 mb-3">
                                <Search size={48} className="mx-auto" />
                            </div>
                            <p className="text-slate-600 font-medium">No se encontraron objetivos</p>
                            <p className="text-sm text-slate-500 mt-1">
                                Intenta ajustar los filtros o la búsqueda
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredObjectives.map((objective) => {
                                const isExpanded = expandedObjective === objective.id;
                                const isFavorite = favorites.includes(objective.id);

                                return (
                                    <div
                                        key={objective.id}
                                        className="bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                                    >
                                        {/* Objective Header */}
                                        <div className="p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1">
                                                    {/* Area Badge */}
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="inline-block px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-medium rounded">
                                                            {objective.areaName}
                                                        </span>
                                                        <span className="text-xs text-slate-500">
                                                            {objective.ageRange}
                                                        </span>
                                                    </div>

                                                    {/* Objective Text */}
                                                    <p className="text-slate-800 font-medium leading-relaxed">
                                                        {objective.text}
                                                    </p>

                                                    {/* Tags */}
                                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                                        {objective.diagnoses.slice(0, 3).map((diagnosis, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded"
                                                            >
                                                                {diagnosis}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => toggleFavorite(objective.id)}
                                                        className={clsx(
                                                            "p-2 rounded-lg transition-colors",
                                                            isFavorite
                                                                ? "text-amber-500 hover:bg-amber-50"
                                                                : "text-slate-400 hover:bg-slate-100"
                                                        )}
                                                        title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                                                    >
                                                        {isFavorite ? <Star size={20} className="fill-amber-500" /> : <StarOff size={20} />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleSelect(objective)}
                                                        className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                                                        title="Usar este objetivo"
                                                    >
                                                        <Plus size={20} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Toggle Details */}
                                            <button
                                                onClick={() => setExpandedObjective(isExpanded ? null : objective.id)}
                                                className="mt-3 text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                                            >
                                                {isExpanded ? (
                                                    <>
                                                        <ChevronDown size={16} />
                                                        Ocultar detalles
                                                    </>
                                                ) : (
                                                    <>
                                                        <ChevronRight size={16} />
                                                        Ver detalles
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {/* Expanded Details */}
                                        {isExpanded && (
                                            <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50 space-y-3">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Baseline & Target */}
                                                    <div>
                                                        <h4 className="text-xs font-semibold text-slate-700 mb-1">Línea Base → Objetivo</h4>
                                                        <p className="text-sm text-slate-600">
                                                            <span className="font-medium">{objective.baseline}</span>
                                                            {' → '}
                                                            <span className="font-medium text-teal-700">{objective.target}</span>
                                                        </p>
                                                    </div>

                                                    {/* Contexts */}
                                                    <div>
                                                        <h4 className="text-xs font-semibold text-slate-700 mb-1">Contextos</h4>
                                                        <p className="text-sm text-slate-600">
                                                            {objective.contexts.join(', ')}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Materials */}
                                                {objective.materials && objective.materials.length > 0 && (
                                                    <div>
                                                        <h4 className="text-xs font-semibold text-slate-700 mb-1">Materiales Sugeridos</h4>
                                                        <ul className="text-sm text-slate-600 list-disc list-inside">
                                                            {objective.materials.map((material, idx) => (
                                                                <li key={idx}>{material}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Strategies */}
                                                {objective.strategies && objective.strategies.length > 0 && (
                                                    <div>
                                                        <h4 className="text-xs font-semibold text-slate-700 mb-1">Estrategias Sugeridas</h4>
                                                        <ul className="text-sm text-slate-600 list-disc list-inside">
                                                            {objective.strategies.map((strategy, idx) => (
                                                                <li key={idx}>{strategy}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                    <p className="text-sm text-slate-600">
                        💡 <span className="font-medium">Tip:</span> Puedes personalizar el objetivo después de agregarlo
                    </p>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
