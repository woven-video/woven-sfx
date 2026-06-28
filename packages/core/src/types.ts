export type Sound = {
  id: string;
  file: string;
  tags: string[];
  duration_ms: number;
  pairings?: { transition?: string[]; moment?: string[] };
  default_volume: number;
  url: string;
  peaks_url?: string;
};

export type Catalog = {
  version: string;
  sounds: Sound[];
};

export type ResolvedSound = {
  id: string;
  file: string;
  localPath: string;
  duration_ms: number;
  suggested_volume: number;
  url: string;
};