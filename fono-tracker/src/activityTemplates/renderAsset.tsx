import React from "react";
import { Asset } from "./types";

export function getAssetSrc(asset: Asset, size: number = 300) {
  if (asset.kind === "arasaac" && asset.pictoId) {
    return `https://static.arasaac.org/pictograms/${asset.pictoId}/${asset.pictoId}_${size}.png`;
  }
  return asset.src;
}

type RenderAssetProps = {
  asset: Asset;
  showLabel?: boolean;
  className?: string;
};

export function RenderAsset({ asset, showLabel = true, className }: RenderAssetProps) {
  if (!asset) return null;
  if (asset.kind === "text") {
    return (
      <div
        className={`flex items-center justify-center text-center bg-slate-50 text-slate-800 rounded-lg px-3 py-4 text-sm font-semibold ${className ?? ""}`.trim()}
      >
        {asset.text || asset.label || "Texto"}
      </div>
    );
  }

  const src = getAssetSrc(asset, 500);

  if (asset.kind === "audio") {
    return (
      <div className={`flex items-center space-x-2 text-slate-700 ${className ?? ""}`.trim()}>
        <span role="img" aria-label="audio">🎧</span>
        <span>{asset.label || "Audio"}</span>
      </div>
    );
  }

  return (
    <figure className={`flex flex-col items-center ${className ?? ""}`.trim()}>
      {src ? (
        <img src={src} alt={asset.label || asset.text || "Recurso"} className="max-h-48 object-contain" />
      ) : (
        <div className="w-full h-32 bg-slate-100 rounded-lg" />
      )}
      {showLabel && (asset.label || asset.text) && (
        <figcaption className="mt-2 text-xs text-slate-600 text-center">{asset.label || asset.text}</figcaption>
      )}
    </figure>
  );
}
