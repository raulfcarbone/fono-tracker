import React from "react";
import { TemplatePreviewProps } from "../../types";
import { RenderAsset } from "../../renderAsset";

type GridData = {
  rows: number;
  cols: number;
  cellAssetIds: string[];
};

export function GridPreview({ data, assets }: TemplatePreviewProps<GridData>) {
  const { rows, cols, cellAssetIds } = data;
  const total = rows * cols;
  const displayCells = cellAssetIds.slice(0, total);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Uso clínico: organización visual para atención sostenida o clasificación rápida.
      </p>
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {displayCells.map((assetId, idx) => {
          const asset = assets.find((a) => a.id === assetId);
          return (
            <div
              key={`${assetId}-${idx}`}
              className="border border-slate-200 bg-white rounded-xl p-3 min-h-[140px] flex items-center justify-center"
            >
              {asset ? (
                <RenderAsset asset={asset} />
              ) : (
                <span className="text-xs text-slate-400">Disponible para recurso visual</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
