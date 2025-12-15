export type AssetKind = "image" | "arasaac" | "text" | "audio";

export type Asset = {
  id: string;
  kind: AssetKind;
  src?: string;
  text?: string;
  pictoId?: number;
  label?: string;
};

export type ActivityTemplateId = "grid" | "worksheet-image-writing";

export type ActivityDraft = {
  id: string;
  title: string;
  category: string;
  objective?: string;
  instructions?: string;
  templateId: ActivityTemplateId;
  assets: Asset[];
  templateData: any;
  createdAt: number;
  updatedAt: number;
};

export type TemplateEditorProps<T = any> = {
  data: T;
  onChange: (data: T) => void;
  assets: Asset[];
};

export type TemplatePreviewProps<T = any> = {
  data: T;
  assets: Asset[];
};

export type ActivityTemplate<T = any> = {
  id: ActivityTemplateId;
  name: string;
  description: string;
  defaultData: () => T;
  Editor: React.FC<TemplateEditorProps<T>>;
  Preview: React.FC<TemplatePreviewProps<T>>;
};
