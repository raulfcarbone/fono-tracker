import React from "react";
import { ActivityCreatorPage } from "./ActivityCreatorPage";

// Componente de compatibilidad: asegura que cualquier referencia antigua a
// `Activities` use el nuevo creador basado en plantillas.
export function Activities() {
  return <ActivityCreatorPage />;
}

export default Activities;
