import React, { useMemo } from "react";
import { TemplateEditorProps } from "../../types";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

type GridData = {
  rows: number;
  cols: number;
  cellAssetIds: string[];
};

function ensureCellCount(data: GridData) {
  const total = data.rows * data.cols;
  if (data.cellAssetIds.length === total) return data.cellAssetIds;
  const next = [...data.cellAssetIds];
  while (next.length < total) next.push("");
  return next.slice(0, total);
}

export function GridEditor({ data, onChange, assets }: TemplateEditorProps<GridData>) {
  const visualAssets = useMemo(() => assets.filter((a) => a.kind === "image" || a.kind === "arasaac" || a.kind === "text"), [assets]);

  const cellAssetIds = ensureCellCount(data);

  const handleSizeChange = (key: "rows" | "cols", value: number) => {
    const nextValue = clamp(value, 2, 6);
    const next = { ...data, [key]: nextValue } as GridData;
    next.cellAssetIds = ensureCellCount(next);
    onChange(next);
  };

  const handleSelectAsset = (index: number, assetId: string) => {
    const updated = [...cellAssetIds];
    updated[index] = assetId;
    onChange({ ...data, cellAssetIds: updated });
  };

  const handleAutofill = () => {
    const ordered = visualAssets.filter((a) => a.kind !== "text" || a.text)?.slice(0, data.rows * data.cols);
    const filled = cellAssetIds.map((cell, idx) => ordered[idx]?.id || cell || "");
    onChange({ ...data, cellAssetIds: filled });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Plantilla clínica pensada para clasificación, memoria visual o asociación imagen-palabra.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm text-slate-700 font-medium flex flex-col">
          Filas
          <input
            type="number"
            min={2}
            max={6}
            value={data.rows}
            onChange={(e) => handleSizeChange("rows", Number(e.target.value))}
            className="mt-1 border border-slate-300 rounded-lg px-3 py-2"
          />
        </label>
        <label className="text-sm text-slate-700 font-medium flex flex-col">
          Columnas
          <input
            type="number"
            min={2}
            max={6}
            value={data.cols}
            onChange={(e) => handleSizeChange("cols", Number(e.target.value))}
            className="mt-1 border border-slate-300 rounded-lg px-3 py-2"
          />
        </label>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-700 font-semibold">Celdas</p>
        <button
          type="button"
          onClick={handleAutofill}
          className="text-teal-700 text-sm font-medium hover:underline"
        >
          Autorrellenar
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {cellAssetIds.map((assetId, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3 space-y-2">
            <p className="text-xs text-slate-500">Celda {idx + 1}</p>
            <select
              value={assetId}
              onChange={(e) => handleSelectAsset(idx, e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-2 py-2 text-sm"
            >
              <option value="">Sin contenido</option>
              {visualAssets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.label || asset.text || `${asset.kind} ${asset.id.slice(0, 4)}`}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
