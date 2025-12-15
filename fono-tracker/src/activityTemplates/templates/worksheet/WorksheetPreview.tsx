import React from "react";
import { TemplatePreviewProps } from "../../types";
import { RenderAsset } from "../../renderAsset";
import { WorksheetData } from "./WorksheetEditor";

export function WorksheetPreview({ data, assets }: TemplatePreviewProps<WorksheetData>) {
  const header = data.headerAssetId ? assets.find((a) => a.id === data.headerAssetId) : undefined;
  const lines = Array.from({ length: data.lines }, (_, i) => i);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Uso clínico: producción escrita breve o dictado funcional apoyado en imagen.
      </p>
      {header && (
        <div className="flex justify-center">
          <RenderAsset asset={header} showLabel className="max-w-md" />
        </div>
      )}
      {data.promptText && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-800">
          {data.promptText}
        </div>
      )}
      <div className="space-y-2">
        {lines.map((i) => (
          <div key={i} className="h-8 border-b border-dashed border-slate-300" />
        ))}
      </div>
    </div>
  );
}
