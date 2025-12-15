import React from "react";
import { TemplateEditorProps } from "../../types";

export type WorksheetData = {
  headerAssetId?: string;
  promptText?: string;
  lines: number;
};

export function WorksheetEditor({ data, onChange, assets }: TemplateEditorProps<WorksheetData>) {
  const visualAssets = assets.filter((a) => a.kind === "image" || a.kind === "arasaac");

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Plantilla clínicamente útil para escritura guiada después de una imagen o secuencia corta.
      </p>

      <label className="block text-sm font-medium text-slate-700">Imagen de cabecera</label>
      <select
        value={data.headerAssetId || ""}
        onChange={(e) => onChange({ ...data, headerAssetId: e.target.value })}
        className="w-full border border-slate-300 rounded-lg px-3 py-2"
      >
        <option value="">Sin imagen</option>
        {visualAssets.map((asset) => (
          <option key={asset.id} value={asset.id}>
            {asset.label || asset.text || `${asset.kind} ${asset.id.slice(0, 4)}`}
          </option>
        ))}
      </select>

      <label className="block text-sm font-medium text-slate-700">Consigna breve</label>
      <textarea
        value={data.promptText || ""}
        onChange={(e) => onChange({ ...data, promptText: e.target.value })}
        rows={3}
        placeholder="Describe lo que ves, inventa un final, escribe 3 ideas clave..."
        className="w-full border border-slate-300 rounded-lg px-3 py-2"
      />

      <label className="block text-sm font-medium text-slate-700">Líneas para escribir</label>
      <input
        type="number"
        min={4}
        max={16}
        value={data.lines}
        onChange={(e) => onChange({ ...data, lines: Math.max(4, Math.min(16, Number(e.target.value))) })}
        className="w-full border border-slate-300 rounded-lg px-3 py-2"
      />
    </div>
  );
}
