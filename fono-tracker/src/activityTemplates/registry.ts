import { ActivityTemplate } from "./types";
import { GridEditor } from "./templates/grid/GridEditor";
import { GridPreview } from "./templates/grid/GridPreview";
import { WorksheetEditor } from "./templates/worksheet/WorksheetEditor";
import { WorksheetPreview } from "./templates/worksheet/WorksheetPreview";

export const ACTIVITY_TEMPLATES: ActivityTemplate[] = [
  {
    id: "grid",
    name: "Cuadrícula",
    description: "Celdas N×M para emparejar, señalar o clasificar estímulos visuales.",
    defaultData: () => ({ rows: 2, cols: 2, cellAssetIds: Array.from({ length: 4 }, () => "") }),
    Editor: GridEditor,
    Preview: GridPreview,
  },
  {
    id: "worksheet-image-writing",
    name: "Imagen + escritura",
    description: "Hoja con imagen superior y espacio para escritura guiada.",
    defaultData: () => ({ headerAssetId: "", promptText: "", lines: 8 }),
    Editor: WorksheetEditor,
    Preview: WorksheetPreview,
  },
];

export function getTemplateById(id: string) {
  return ACTIVITY_TEMPLATES.find((t) => t.id === id);
}
