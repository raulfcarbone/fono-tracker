import React, { useState } from "react";
import { Asset } from "../../activityTemplates/types";

const ARASAAC_BASE = "https://api.arasaac.org/api/pictograms/es/search";

async function searchArasaac(query: string) {
  if (!query) return [];
  const resp = await fetch(`${ARASAAC_BASE}/${encodeURIComponent(query)}?download=false&no_derivatives=false`);
  if (!resp.ok) return [];
  return resp.json();
}

type ArasaacPickerProps = {
  onSelect: (asset: Asset) => void;
};

export function ArasaacPicker({ onSelect }: ArasaacPickerProps) {
  const [term, setTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setError(null);
    if (!term.trim()) return;
    setLoading(true);
    try {
      const data = await searchArasaac(term.trim());
      setResults(Array.isArray(data) ? data.slice(0, 12) : []);
    } catch (e) {
      console.error(e);
      setError("No se pudo buscar en ARASAAC (offline o sin conexión)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Buscar pictogramas (ej. comer, feliz)"
          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="px-3 py-2 bg-slate-900 text-white rounded-lg text-sm"
          disabled={loading}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="grid grid-cols-3 gap-3">
        {results.map((item) => {
          const src = `https://static.arasaac.org/pictograms/${item._id}/${item._id}_300.png`;
          const label = item.keywords?.[0]?.keyword || "Picto";
          return (
            <button
              type="button"
              key={item._id}
              onClick={() =>
                onSelect({ id: crypto.randomUUID(), kind: "arasaac", pictoId: item._id, label })
              }
              className="border border-slate-200 rounded-lg p-2 hover:border-teal-500 bg-white"
            >
              <img src={src} alt={label} className="w-full h-20 object-contain" />
              <p className="text-xs text-slate-600 mt-1 text-center line-clamp-2">{label}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
