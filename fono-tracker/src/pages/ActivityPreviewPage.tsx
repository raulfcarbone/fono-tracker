import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTemplateById } from "../activityTemplates/registry";
import { ActivityDraft } from "../activityTemplates/types";
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

export function ActivityPreviewPage() {
  const { draftId } = useParams();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<ActivityDraft | null>(null);
  const [status, setStatus] = useState("cargando");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      if (!draftId) return;
      setStatus("cargando");
      try {
        let stored: ActivityDraft | undefined;
        if (db.activityDrafts) {
          stored = await db.activityDrafts.get(draftId);
        }
        if (!stored) {
          stored = readLocalDrafts().find((d) => d.id === draftId);
        }
        if (!stored) {
          setStatus("no-encontrado");
          return;
        }
        setDraft(stored);
        setStatus("listo");
      } catch (e) {
        console.error(e);
        setStatus("error");
      }
    }
    load();
  }, [draftId]);

  const template = useMemo(() => (draft ? getTemplateById(draft.templateId) : undefined), [draft]);

  const requestFullscreen = () => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    }
  };

  if (status === "cargando") return <div>Cargando vista previa...</div>;
  if (status === "no-encontrado")
    return (
      <div className="space-y-3">
        <p>No encontramos esta actividad.</p>
        <button className="px-3 py-2 bg-slate-100 rounded-lg" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>
    );
  if (status === "error") return <div>Hubo un problema al cargar la actividad.</div>;
  if (!draft || !template) return <div>No hay datos para mostrar.</div>;

  const Preview = template.Preview;

  return (
    <div className="space-y-4" ref={containerRef}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-teal-600 font-bold">Vista previa</p>
          <h1 className="text-2xl font-bold text-slate-900">{draft.title}</h1>
          <p className="text-sm text-slate-500">{draft.objective || draft.instructions}</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-2 bg-slate-100 rounded-lg" onClick={() => navigate("/activities")}>Volver</button>
          <button className="px-3 py-2 bg-slate-900 text-white rounded-lg" onClick={requestFullscreen}>
            Pantalla completa
          </button>
          <button className="px-3 py-2 bg-teal-600 text-white rounded-lg" onClick={() => window.print()}>
            Imprimir
          </button>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-5xl mx-auto">
        <Preview data={draft.templateData} assets={draft.assets} />
      </div>
    </div>
  );
}
