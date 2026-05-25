export interface Machine {
  id: string;
  name: string;
  shortName: string;
  manufacturer: string;
  introDate: string;
  installations: number;
  lastUpdated: string;
  status: "ready" | "preparing";
  iconColor: string;
  hintsLabel?: string;
  sources?: Source[];
  spec?: Spec;
  ceilings?: Ceiling[];
  evTables?: EVTables;
  modes?: Mode[];
  hints?: Hint[];
  endCards?: EndCard[];
  endCardsSetting?: EndCardSetting[];
  zenchoPatterns?: ZenchoPattern[];
  yameRules?: YameRule[];
  neraiQuick?: NeraiQuick[];
  corrections?: Corrections;
}

export interface Source {
  name: string;
  url?: string;
  type?: string;
  channel?: string;
  date?: string;
  note?: string;
}

export interface Spec {
  type: string;
  pureZou: number;
  coinSpeed: number;
  atRate?: string;
  tImashi?: string;
}

export interface Ceiling {
  name: string;
  unit: string;
  max: number;
  source: string;
  note?: string;
}

export type EVPoint = [number, number];

export interface EVTable {
  equiv: EVPoint[];
  rate56: EVPoint[];
}

export interface EVTables {
  [counter: string]: EVTable;
}

export interface Mode {
  name: string;
  zones: string;
  tenjo: string;
  note: string;
}

export interface Hint {
  text: string;
  type: string;
  detail: string;
  priority: number;
}

export interface EndCard {
  char: string;
  detail: string;
  priority: number;
}

export interface EndCardSetting {
  color: string;
  chars: string;
  detail: string;
}

export interface ZenchoPattern {
  g: string;
  pattern: string;
}

export interface YameRule {
  situation: string;
  action: string;
  reason: string;
}

export interface NeraiQuick {
  type: string;
  threshold: string;
  note: string;
}

export interface ShockPointTier {
  range: string;
  modifier: string;
  note: string;
}

export interface ShockPoint {
  id: string;
  label: string;
  description?: string;
  tiers: ShockPointTier[];
  expectedValueImpact?: string;
  releaseBonus?: string;
  countingRule?: string;
}

export interface YuriKugiri {
  id: string;
  label: string;
  description?: string;
  checkPoints: string[];
  warning?: string;
}

export interface Corrections {
  sluRule?: { [key: string]: number };
  czRanges?: {
    shallow?: { max: number; value: number; label: string };
    deep?: { min: number; value: number; label: string };
  };
  options?: { id: string; label: string; value: number }[];
  shockPoint?: ShockPoint;
  yuriKugiri?: YuriKugiri;
}
