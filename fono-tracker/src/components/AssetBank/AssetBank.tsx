import React, { useMemo, useState } from "react";
import { Asset } from "../../activityTemplates/types";
import { ArasaacPicker } from "./ArasaacPicker";

const TABS = [
  { id: "images", label: "Mis imágenes" },
  { id: "arasaac", label: "ARASAAC" },
  { id: "text", label: "Textos" },
];

type AssetBankProps = {
  assets: Asset[];
  onChangeAssets: (next: Asset[]) => void;
};

export function AssetBank({ assets, onChangeAssets }: AssetBankProps) {
  const [tab, setTab] = useState("images");
  const [textValue, setTextValue] = useState("");

  const visualAssets = useMemo(() => assets.filter((a) => a.kind === "image" || a.kind === "arasaac"), [assets]);

  const handleAddAsset = (asset: Asset) => {
    onChangeAssets([...assets, asset]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      handleAddAsset({
        id: crypto.randomUUID(),
        kind: "image",
        src: reader.result as string,
        label: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAddText = () => {
    if (!textValue.trim()) return;
    handleAddAsset({ id: crypto.randomUUID(), kind: "text", text: textValue.trim(), label: textValue.trim() });
    setTextValue("");
  };

  const handleRemove = (id: string) => {
    onChangeAssets(assets.filter((a) => a.id !== id));
  };

  return (
    <div className="border border-slate-200 rounded-xl bg-white p-4 space-y-4">
      <div className="flex space-x-3 text-sm">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 rounded-lg font-medium ${tab === t.id ? "bg-teal-50 text-teal-700" : "text-slate-600"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "images" && (
        <div className="space-y-3">
          <label className="flex items-center justify-between border border-dashed border-slate-300 rounded-lg px-3 py-2 cursor-pointer hover:border-teal-400">
            <div>
              <p className="text-sm font-semibold text-slate-800">Subir imagen</p>
              <p className="text-xs text-slate-500">Archivos locales se guardan offline</p>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
          <div className="grid grid-cols-2 gap-2">
            {visualAssets.map((asset) => (
              <div key={asset.id} className="border border-slate-200 rounded-lg p-2 text-xs text-slate-700 flex justify-between items-center">
                <span className="truncate">{asset.label || asset.id}</span>
                <button onClick={() => handleRemove(asset.id)} className="text-slate-400 hover:text-slate-700">✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "arasaac" && (
        <ArasaacPicker
          onSelect={(asset) => {
            handleAddAsset(asset);
            setTab("images");
          }}
        />
      )}

      {tab === "text" && (
        <div className="space-y-2">
          <div className="flex space-x-2">
            <input
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="Añadir etiqueta o palabra"
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={handleAddText}
              className="px-3 py-2 bg-slate-900 text-white rounded-lg text-sm"
            >
              Agregar
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {assets
              .filter((a) => a.kind === "text")
              .map((asset) => (
                <div key={asset.id} className="border border-slate-200 rounded-lg px-2 py-1 text-xs flex justify-between items-center">
                  <span className="truncate">{asset.text}</span>
                  <button onClick={() => handleRemove(asset.id)} className="text-slate-400 hover:text-slate-700">✕</button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
