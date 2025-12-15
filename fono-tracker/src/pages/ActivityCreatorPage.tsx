import React, { useEffect, useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { useNavigate } from "react-router-dom";
import { ACTIVITY_TEMPLATES, getTemplateById } from "../activityTemplates/registry";
import { ActivityDraft, ActivityTemplateId, Asset } from "../activityTemplates/types";
import { AssetBank } from "../components/AssetBank/AssetBank";
import { db } from "../db";

const LOCAL_KEY = "fono.activities";

function readLocalDrafts(): ActivityDraft[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as ActivityDraft[]) : [];
  } catch (e) {
    console.error(e);
    return [];
  }
}

function writeLocalDrafts(drafts: ActivityDraft[]) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(drafts));
  } catch (e) {
    console.error(e);
  }
}

export function ActivityCreatorPage() {
  const navigate = useNavigate();
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("lenguaje");
  const [objective, setObjective] = useState("");
  const [instructions, setInstructions] = useState("");
  const [templateId, setTemplateId] = useState<ActivityTemplateId>("grid");
  const [templateData, setTemplateData] = useState<any>(ACTIVITY_TEMPLATES[0].defaultData());
  const [assets, setAssets] = useState<Asset[]>([]);
  const [localFallback, setLocalFallback] = useState<ActivityDraft[]>(() => readLocalDrafts());

  const dexieDrafts = useLiveQuery(() => db.activityDrafts?.orderBy("updatedAt").reverse().toArray(), []);
  const drafts = dexieDrafts ?? localFallback;

  const selectedTemplate = useMemo(() => getTemplateById(templateId) ?? ACTIVITY_TEMPLATES[0], [templateId]);
  const TemplateEditor = selectedTemplate.Editor;

  useEffect(() => {
    if (dexieDrafts) {
      setLocalFallback(dexieDrafts);
    }
  }, [dexieDrafts]);

  const resetForm = () => {
    setCurrentId(null);
    setTitle("");
    setCategory("lenguaje");
    setObjective("");
    setInstructions("");
    const template = getTemplateById("grid") ?? ACTIVITY_TEMPLATES[0];
    setTemplateId(template.id);
    setTemplateData(template.defaultData());
    setAssets([]);
  };

  const handleTemplateChange = (id: ActivityTemplateId) => {
    const next = getTemplateById(id);
    if (!next) return;
    setTemplateId(id);
    setTemplateData(next.defaultData());
  };

  const handleSave = async () => {
    const base: ActivityDraft = {
      id: currentId ?? crypto.randomUUID(),
      title: title.trim() || "Sin título",
      category,
      objective: objective.trim(),
      instructions: instructions.trim(),
      templateId,
      assets,
      templateData,
      createdAt: currentId ? drafts.find((d) => d.id === currentId)?.createdAt || Date.now() : Date.now(),
      updatedAt: Date.now(),
    };

    try {
      if (db.activityDrafts) {
        await db.activityDrafts.put(base);
      }
      setLocalFallback((prev) => {
        const next = [...prev.filter((d) => d.id !== base.id), base];
        writeLocalDrafts(next);
        return next;
      });
      setCurrentId(base.id);
    } catch (e) {
      console.error(e);
      setLocalFallback((prev) => {
        const next = [...prev.filter((d) => d.id !== base.id), base];
        writeLocalDrafts(next);
        return next;
      });
    }

    return base.id;
  };

  const handleEdit = (draft: ActivityDraft) => {
    setCurrentId(draft.id);
    setTitle(draft.title);
    setCategory(draft.category);
    setObjective(draft.objective || "");
    setInstructions(draft.instructions || "");
    setTemplateId(draft.templateId);
    setTemplateData(draft.templateData);
    setAssets(draft.assets || []);
  };

  const handleDelete = async (id: string) => {
    try {
      if (db.activityDrafts) await db.activityDrafts.delete(id);
    } catch (e) {
      console.error(e);
    }
    const next = drafts.filter((d) => d.id !== id);
    setLocalFallback(next);
    writeLocalDrafts(next);
    if (currentId === id) resetForm();
  };

  const handleDuplicate = async (draft: ActivityDraft) => {
    const copy: ActivityDraft = {
      ...draft,
      id: crypto.randomUUID(),
      title: `${draft.title} (copia)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    try {
      if (db.activityDrafts) await db.activityDrafts.add(copy);
    } catch (e) {
      console.error(e);
    }
    const next = [copy, ...drafts];
    setLocalFallback(next);
    writeLocalDrafts(next);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-teal-600 font-bold">Creador de actividades</p>
          <h1 className="text-3xl font-bold text-slate-900">Plantillas + banco de estímulos</h1>
          <p className="text-slate-600 mt-2 max-w-3xl">
            Diseña actividades reusables con pictogramas ARASAAC, imágenes o textos, pensadas para uso clínico en sesión.
          </p>
        </div>
        <div className="flex space-x-2 text-sm">
          <button
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg"
            type="button"
            onClick={resetForm}
          >
            Nuevo borrador
          </button>
          <button
            className="px-4 py-2 bg-teal-600 text-white rounded-lg"
            type="button"
            onClick={handleSave}
          >
            Guardar borrador
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800">Título</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2"
                  placeholder="Ej. Clasifica alimentos vs animales"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-800">Categoría</label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2"
                  placeholder="lenguaje / cognición / lectoescritura"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800">Objetivo terapéutico</label>
                <textarea
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2"
                  rows={3}
                  placeholder="Incrementar vocabulario funcional, clasificación semántica, atención..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-800">Instrucciones</label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2"
                  rows={3}
                  placeholder="Ajustes, apoyos visuales, graduación de dificultad"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 items-start">
              <div>
                <label className="block text-sm font-semibold text-slate-800">Plantilla</label>
                <select
                  value={templateId}
                  onChange={(e) => handleTemplateChange(e.target.value as ActivityTemplateId)}
                  className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2"
                >
                  {ACTIVITY_TEMPLATES.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">{selectedTemplate.description}</p>
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-600">
                <span className="px-2 py-1 bg-teal-50 text-teal-700 rounded-lg">Pantalla amplia</span>
                <p>Usa la vista previa para imprimir o proyectar en sesión.</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-800">Banco de estímulos</h3>
              <AssetBank assets={assets} onChangeAssets={setAssets} />
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">Editor de plantilla</h3>
                <button
                  className="text-teal-700 text-sm font-medium"
                  type="button"
                  onClick={async () => {
                    const id = await handleSave();
                    if (id) navigate(`/actividades/preview/${id}`);
                  }}
                >
                  Vista previa amplia
                </button>
              </div>
              <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                <TemplateEditor data={templateData} assets={assets} onChange={setTemplateData} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Borradores guardados</h3>
            <span className="text-xs text-slate-500">{drafts?.length || 0} actividades</span>
          </div>
          <div className="space-y-3 max-h-[70vh] overflow-auto pr-2">
            {drafts?.map((draft) => (
              <div key={draft.id} className="border border-slate-200 rounded-lg p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{draft.title}</p>
                    <p className="text-xs text-slate-500">{draft.category}</p>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(draft.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{draft.objective || "Sin objetivo"}</p>
                <div className="flex items-center gap-2 text-xs text-teal-700 font-semibold">
                  <span className="px-2 py-1 bg-teal-50 rounded-full">{draft.templateId}</span>
                  <span className="px-2 py-1 bg-slate-50 rounded-full">{draft.assets.length} recursos</span>
                  <span className="px-2 py-1 bg-slate-50 rounded-full">{draft.instructions ? "Con instrucción" : "Sin instrucción"}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs mt-2">
                  <button
                    className="px-3 py-1 bg-slate-100 rounded-lg hover:bg-slate-200"
                    onClick={() => handleEdit(draft)}
                  >
                    Editar
                  </button>
                  <button
                    className="px-3 py-1 bg-slate-100 rounded-lg hover:bg-slate-200"
                    onClick={() => navigate(`/actividades/preview/${draft.id}`)}
                  >
                    Vista previa
                  </button>
                  <button
                    className="px-3 py-1 bg-slate-100 rounded-lg hover:bg-slate-200"
                    onClick={() => handleDuplicate(draft)}
                  >
                    Duplicar
                  </button>
                  <button
                    className="px-3 py-1 bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                    onClick={() => handleDelete(draft.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
            {!drafts || drafts.length === 0 ? (
              <div className="border border-dashed border-slate-200 rounded-lg p-6 text-center text-slate-500">
                Aún no hay actividades guardadas.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
