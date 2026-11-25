export interface MetadataField {
  keyName: string;
  response?: string;
  inputType?: string;
  fieldLabel?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  cardJson?: CardItem[] | string;
}

export interface CardFieldItem {
  keyName: string;
  response?: string;
  inputType?: string;
  fieldLabel?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}

export interface CardItem {
  fields?: CardFieldItem[];
  [key: string]: any;
}

export interface MetadataValues {
  hero?: MetadataField[];
  about?: MetadataField[];
  statistics?: MetadataField[];
  stats?: MetadataField[];
  collections?: MetadataField[];
  exquisite_collections?: MetadataField[];
  latest_collections?: MetadataField[];
  latest?: MetadataField[];
  why_premier?: MetadataField[];
  why?: MetadataField[];
  blog?: MetadataField[];
  gallery?: MetadataField[];
  cta?: MetadataField[];
  video?: MetadataField[];
  seo_metadata?: MetadataField[];
  [key: string]: MetadataField[] | undefined;
}

export interface WebTemplate {
  id: number;
  tenantId: number;
  metadataMasterId: number;
  metadataKey: string;
  metadataValues: MetadataValues;
  createdAt: string;
  updatedAt: string | null;
}
